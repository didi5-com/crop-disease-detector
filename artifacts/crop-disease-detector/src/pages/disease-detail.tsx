import { useRoute, useLocation } from "wouter";
import { useState } from "react";
import { useGetDisease, getGetDiseaseQueryKey, useGetDiseaseImages, getGetDiseaseImagesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, AlertTriangle, ShieldAlert, Thermometer, Camera, Microscope, Flame, Radio, ExternalLink } from "lucide-react";

function ThermalImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-black">
      <img src={src} alt={alt} className="w-full h-full object-cover opacity-90" style={{
        filter: "sepia(1) hue-rotate(200deg) saturate(4) brightness(0.85) contrast(1.4)",
      }} />
      <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-br from-orange-600/30 via-transparent to-blue-600/20 pointer-events-none" />
      <div className="absolute top-2 left-2 bg-black/70 text-orange-300 text-xs px-2 py-1 rounded font-mono tracking-wider">THERMAL</div>
    </div>
  );
}

function InfraredImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-black">
      <img src={src} alt={alt} className="w-full h-full object-cover opacity-90" style={{
        filter: "hue-rotate(85deg) saturate(3.5) brightness(0.9) contrast(1.3) invert(0.12)",
      }} />
      <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-b from-red-500/10 via-transparent to-green-700/20 pointer-events-none" />
      <div className="absolute top-2 left-2 bg-black/70 text-red-300 text-xs px-2 py-1 rounded font-mono tracking-wider">INFRARED</div>
    </div>
  );
}

function FieldImageCard({ url, attribution, source, licenseCode }: { url: string; attribution: string; source: string; licenseCode?: string | null }) {
  return (
    <div className="group space-y-1.5">
      <div className="rounded-lg overflow-hidden aspect-[4/3] bg-muted border">
        <img
          src={url}
          alt="Field observation"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      <div className="flex items-start justify-between gap-1">
        <p className="text-xs text-muted-foreground leading-tight line-clamp-2" dangerouslySetInnerHTML={{ __html: attribution }} />
        <Badge variant="outline" className="text-[10px] shrink-0">{licenseCode ?? source}</Badge>
      </div>
    </div>
  );
}

function LabImageCard({ url, attribution, source, licenseCode }: { url: string; attribution: string; source: string; licenseCode?: string | null }) {
  return (
    <div className="group space-y-1.5">
      <div className="rounded-lg overflow-hidden aspect-[4/3] bg-muted border">
        <img
          src={url}
          alt="Lab / microscope reference"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ filter: "grayscale(0.2) contrast(1.05)" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      <div className="flex items-start justify-between gap-1">
        <p className="text-xs text-muted-foreground leading-tight line-clamp-2" dangerouslySetInnerHTML={{ __html: attribution }} />
        <Badge variant="outline" className="text-[10px] shrink-0">{licenseCode ?? source}</Badge>
      </div>
    </div>
  );
}

export default function DiseaseDetail() {
  const [, params] = useRoute("/diseases/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? parseInt(params.id, 10) : 0;
  const [imageTab, setImageTab] = useState("field");

  const { data: disease, isLoading, isError } = useGetDisease(id, {
    query: { enabled: !!id, queryKey: getGetDiseaseQueryKey(id) }
  });

  const { data: gallery, isLoading: galleryLoading } = useGetDiseaseImages(id, {
    query: { enabled: !!id && !!disease, queryKey: getGetDiseaseImagesQueryKey(id) }
  });

  const firstFieldImg = gallery?.fieldImages?.[0];
  const allFieldImgs = gallery?.fieldImages ?? [];
  const labImgs = gallery?.labImages ?? [];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !disease) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Disease Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the requested disease information.</p>
        <Button onClick={() => setLocation("/diseases")}>Return to Library</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Button variant="ghost" className="-ml-4" onClick={() => setLocation("/diseases")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden bg-sidebar text-sidebar-foreground border shadow-md">
        {firstFieldImg && (
          <div className="absolute inset-0 opacity-25">
            <img src={firstFieldImg.url} alt={disease.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/60 to-transparent" />
          </div>
        )}
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex gap-2 mb-4">
            <Badge variant="outline" className="bg-background/10 text-sidebar-foreground border-sidebar-foreground/20 capitalize px-3 py-1">
              Crop: {disease.cropType}
            </Badge>
            <Badge variant="secondary" className={`capitalize px-3 py-1 border-none
              ${disease.severity === 'high' ? 'bg-destructive text-destructive-foreground' :
                disease.severity === 'medium' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
              {disease.severity} Severity
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{disease.name}</h1>
          <p className="text-lg md:text-xl text-sidebar-foreground/80 max-w-2xl leading-relaxed">
            {disease.description}
          </p>
        </div>
      </div>

      {/* Image Gallery */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Visual Reference Gallery
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Field observations, lab microscopy, and simulated spectral analysis views
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={imageTab} onValueChange={setImageTab}>
            <TabsList className="mb-4 flex flex-wrap h-auto gap-1">
              <TabsTrigger value="field" className="flex items-center gap-1.5 text-sm">
                <Camera className="h-3.5 w-3.5" />
                Field View
              </TabsTrigger>
              <TabsTrigger value="thermal" className="flex items-center gap-1.5 text-sm">
                <Flame className="h-3.5 w-3.5" />
                Thermal
              </TabsTrigger>
              <TabsTrigger value="infrared" className="flex items-center gap-1.5 text-sm">
                <Radio className="h-3.5 w-3.5" />
                Infrared
              </TabsTrigger>
              <TabsTrigger value="lab" className="flex items-center gap-1.5 text-sm">
                <Microscope className="h-3.5 w-3.5" />
                Microscope / Lab
              </TabsTrigger>
            </TabsList>

            <TabsContent value="field">
              {galleryLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-lg" />)}
                </div>
              ) : allFieldImgs.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allFieldImgs.map((img, i) => (
                      <FieldImageCard key={i} {...img} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <ExternalLink className="h-3 w-3" />
                    Field photos sourced from iNaturalist — real observations by farmers and researchers worldwide
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Camera className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No field images found for this disease.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="thermal">
              {galleryLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-lg" />)}
                </div>
              ) : allFieldImgs.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allFieldImgs.map((img, i) => (
                      <ThermalImage key={i} src={img.url} alt={`Thermal view ${i + 1}`} />
                    ))}
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-md px-4 py-2.5 text-xs text-orange-800 dark:text-orange-300">
                    Thermal simulation: False-color heat mapping applied to field images. In real thermal imaging, infected leaf tissue shows higher heat signatures (orange-red) due to metabolic stress.
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Flame className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No source images available for thermal simulation.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="infrared">
              {galleryLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-lg" />)}
                </div>
              ) : allFieldImgs.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allFieldImgs.map((img, i) => (
                      <InfraredImage key={i} src={img.url} alt={`Infrared view ${i + 1}`} />
                    ))}
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md px-4 py-2.5 text-xs text-red-800 dark:text-red-300">
                    Near-infrared (NIR) simulation: In true NIR imaging, healthy plant tissue reflects strongly (bright), while diseased tissue has reduced reflectance — a key indicator used in precision agriculture.
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Radio className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No source images available for infrared simulation.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="lab">
              {galleryLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-lg" />)}
                </div>
              ) : labImgs.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {labImgs.map((img, i) => (
                      <LabImageCard key={i} {...img} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <ExternalLink className="h-3 w-3" />
                    Lab images from Wikimedia Commons — scientific photography of pathogens and tissue samples
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Microscope className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No microscopy images found for this pathogen.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Symptoms & Treatment */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-sm border-primary/20">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              Visual Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none text-foreground/80">
              {disease.symptoms.split(/[,.]/).filter(Boolean).map((item, i) => (
                <p key={i} className="mb-3 last:mb-0 flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{item.trim()}</span>
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-accent/20">
          <CardHeader className="bg-accent/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-accent" />
              Treatment & Prevention
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none text-foreground/80">
              {disease.treatment.split(/[.]+/).filter(s => s.trim()).map((sentence, i) => (
                <p key={i} className="mb-3 last:mb-0">{sentence.trim()}.</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-8 border-t">
        <Button size="lg" onClick={() => setLocation("/scan")} className="gap-2">
          Scan a Crop Now
        </Button>
      </div>
    </div>
  );
}
