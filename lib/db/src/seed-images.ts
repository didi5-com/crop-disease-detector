import { db } from "./index";
import { diseasesTable } from "./schema/diseases";
import { eq } from "drizzle-orm";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

function isImageUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.includes(ext));
}

// Wikipedia article names for each disease (more reliable for page thumbnails)
const WIKI_ARTICLES: Record<string, string> = {
  "Cassava Mosaic Virus": "Cassava_mosaic_virus",
  "Cassava Bacterial Blight": "Cassava_bacterial_blight",
  "Maize Northern Leaf Blight": "Northern_corn_leaf_blight",
  "Maize Common Rust": "Common_corn_rust",
  "Tomato Late Blight": "Phytophthora_infestans",
  "Tomato Leaf Mold": "Passalora_fulva",
  "Rice Leaf Blast": "Rice_blast",
  "Potato Early Blight": "Early_blight_of_potato",
  "Healthy": "Cassava",
};

// Fallback Commons search queries (image-specific)
const COMMONS_QUERIES: Record<string, string> = {
  "Cassava Mosaic Virus": "cassava mosaic disease leaf",
  "Cassava Bacterial Blight": "cassava blight diseased leaf",
  "Maize Northern Leaf Blight": "northern corn leaf blight lesion",
  "Maize Common Rust": "corn rust Puccinia sorghi",
  "Tomato Late Blight": "tomato late blight Phytophthora infestans leaf",
  "Tomato Leaf Mold": "tomato leaf mold",
  "Rice Leaf Blast": "rice blast disease",
  "Potato Early Blight": "potato early blight leaf spot",
  "Healthy": "healthy cassava plant field",
};

interface WikiPage {
  pageid: number;
  thumbnail?: { source: string };
  imageinfo?: Array<{ url: string; thumburl?: string }>;
}

async function fetchWikipediaThumbnail(articleTitle: string): Promise<string | null> {
  const encoded = encodeURIComponent(articleTitle);
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&pithumbsize=800&format=json&origin=*`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { query?: { pages?: Record<string, WikiPage> } };
    const pages = data?.query?.pages ?? {};
    for (const page of Object.values(pages)) {
      if (page?.thumbnail?.source) {
        const src = page.thumbnail.source;
        if (isImageUrl(src)) return src;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchCommonsImage(query: string): Promise<string | null> {
  // Search Commons for image files only
  const encoded = encodeURIComponent(`${query} filetype:bitmap`);
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&srnamespace=6&srlimit=10&format=json&origin=*`;
  try {
    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(10000) });
    if (!searchRes.ok) return null;
    const searchData = (await searchRes.json()) as { query?: { search?: Array<{ title: string }> } };
    const hits = searchData?.query?.search ?? [];

    // Filter to image file titles only
    const imageTitles = hits
      .map((h) => h.title)
      .filter((t) => IMAGE_EXTENSIONS.some((ext) => t.toLowerCase().endsWith(ext)));

    if (imageTitles.length === 0) return null;

    const titles = imageTitles.slice(0, 5).join("|");
    const imgUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json&origin=*`;
    const imgRes = await fetch(imgUrl, { signal: AbortSignal.timeout(10000) });
    if (!imgRes.ok) return null;
    const imgData = (await imgRes.json()) as { query?: { pages?: Record<string, WikiPage> } };
    const pages = imgData?.query?.pages ?? {};
    for (const page of Object.values(pages)) {
      const info = page?.imageinfo?.[0];
      const candidate = info?.thumburl ?? info?.url;
      if (candidate && isImageUrl(candidate)) return candidate;
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchInatImage(query: string): Promise<string | null> {
  const encoded = encodeURIComponent(query);
  const url = `https://api.inaturalist.org/v1/observations?q=${encoded}&photos=true&per_page=3&license=cc-by,cc-by-sa,cc0,cc-by-nc`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: Array<{ photos?: Array<{ url?: string }> }> };
    for (const obs of data.results ?? []) {
      for (const photo of obs.photos ?? []) {
        if (photo.url) {
          const highRes = photo.url.replace("/square.", "/medium.").replace("/thumb.", "/medium.");
          if (isImageUrl(highRes)) return highRes;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  const diseases = await db.select().from(diseasesTable);
  console.log(`Updating thumbnail images for ${diseases.length} diseases...\n`);

  for (const disease of diseases) {
    const wikiArticle = WIKI_ARTICLES[disease.name];
    const commonsQuery = COMMONS_QUERIES[disease.name] ?? disease.name;

    console.log(`[${disease.id}] ${disease.name}`);

    let imageUrl: string | null = null;

    // Strategy 1: Wikipedia article thumbnail (best quality, most relevant)
    if (wikiArticle) {
      imageUrl = await fetchWikipediaThumbnail(wikiArticle);
      if (imageUrl) console.log(`  => Wikipedia thumbnail: ${imageUrl}`);
    }

    // Strategy 2: Wikimedia Commons image search
    if (!imageUrl) {
      imageUrl = await fetchCommonsImage(commonsQuery);
      if (imageUrl) console.log(`  => Commons image: ${imageUrl}`);
    }

    // Strategy 3: iNaturalist field photo
    if (!imageUrl) {
      imageUrl = await fetchInatImage(commonsQuery);
      if (imageUrl) console.log(`  => iNaturalist photo: ${imageUrl}`);
    }

    if (imageUrl) {
      await db.update(diseasesTable).set({ imageUrl }).where(eq(diseasesTable.id, disease.id));
      console.log(`  Saved to DB.\n`);
    } else {
      console.log(`  No image found — skipping.\n`);
    }
  }

  console.log("Done!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
