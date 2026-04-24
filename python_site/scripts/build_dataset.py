from __future__ import annotations

import argparse
from collections import defaultdict
from pathlib import Path

from datasets import load_dataset
from tqdm import tqdm

from app.utils import normalize_crop_name, normalize_disease_name, parse_general_label


def slugify_label(raw: str) -> str:
    return raw.strip().replace(" ", "_").replace("/", "_")


def save_split(dataset, split_name: str, output_dir: Path, max_per_class: int = 0) -> dict[str, int]:
    split_dir = output_dir / split_name
    split_dir.mkdir(parents=True, exist_ok=True)

    counters = defaultdict(int)
    indices = range(len(dataset))

    for i in tqdm(indices, desc=f"Exporting {split_name}", unit="img"):
        row = dataset[i]
        if "crop" in row and "disease" in row:
            crop = normalize_crop_name(str(row["crop"]))
            disease = normalize_disease_name(str(row["disease"]), crop=crop)
        elif "label" in row:
            label_feature = dataset.features.get("label")
            if hasattr(label_feature, "int2str"):
                class_name = label_feature.int2str(int(row["label"]))
            else:
                class_name = str(row["label"])
            crop, disease, _ = parse_general_label(class_name)
        else:
            continue

        class_key = f"{crop}___{disease}"
        if max_per_class > 0 and counters[class_key] >= max_per_class:
            continue

        class_dir = split_dir / slugify_label(class_key)
        class_dir.mkdir(parents=True, exist_ok=True)
        file_path = class_dir / f"{counters[class_key]:06d}.jpg"
        row["image"].convert("RGB").save(file_path, format="JPEG", quality=95)
        counters[class_key] += 1

    return dict(counters)


def main():
    parser = argparse.ArgumentParser(description="Build a crop disease dataset for local training.")
    parser.add_argument("--output", type=Path, default=Path("dataset/combined"), help="Output dataset directory.")
    parser.add_argument(
        "--max-per-class",
        type=int,
        default=0,
        help="Optional cap per class (0 means no cap). Useful for quick experiments.",
    )
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    print("Downloading PlantVillage (color split) from Hugging Face...")
    plantvillage = load_dataset("mohanty/PlantVillage", "color")

    train_counts = save_split(
        plantvillage["train"],
        split_name="train",
        output_dir=args.output,
        max_per_class=args.max_per_class,
    )
    test_counts = save_split(
        plantvillage["test"],
        split_name="test",
        output_dir=args.output,
        max_per_class=args.max_per_class,
    )

    print("\nDataset export complete.")
    print(f"Train classes: {len(train_counts)}")
    print(f"Test classes: {len(test_counts)}")
    print(f"Output path: {args.output.resolve()}")
    print(
        "\nNext step: add field-specific classes (for cassava/rice local conditions) under "
        f"{(args.output / 'train').resolve()} and {(args.output / 'test').resolve()} "
        "using the same class format: crop___Disease Name"
    )


if __name__ == "__main__":
    main()
