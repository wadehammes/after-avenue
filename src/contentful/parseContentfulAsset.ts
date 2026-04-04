import type { Asset, AssetLink } from "contentful";

export interface ContentfulAsset {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

type LinkedAsset = Asset<"WITHOUT_UNRESOLVABLE_LINKS">;

export const parseContentfulAsset = (
  asset?: LinkedAsset | { sys: AssetLink },
): ContentfulAsset | null => {
  if (!asset) {
    return null;
  }

  if (!("fields" in asset)) {
    return null;
  }

  const file = asset.fields.file;

  return {
    id: asset.sys.id,
    src: file?.url ?? "",
    alt: asset.fields.description ?? "",
    width: file?.details?.image?.width ?? 0,
    height: file?.details?.image?.height ?? 0,
  };
};
