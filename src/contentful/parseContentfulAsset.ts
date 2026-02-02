import type { Asset, AssetLink } from "contentful";

export interface ContentfulAsset {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function parseContentfulAsset(
  asset?: Asset<undefined, string> | { sys: AssetLink },
): ContentfulAsset | null {
  if (!asset) {
    return null;
  }

  if (!("fields" in asset)) {
    return null;
  }

  return {
    id: asset.sys.id,
    src: asset.fields.file?.url || "",
    alt: asset.fields.description || "",
    width: asset.fields.file?.details.image?.width || 0,
    height: asset.fields.file?.details.image?.height || 0,
  };
}
