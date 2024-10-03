import classNames from "classnames";
import Image from "next/image";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { createImageUrl, isVideo } from "src/utils/helpers";

interface AnimatedMediaProps {
  className?: string;
  media: ContentfulAsset | null;
  opacity?: number;
}

export const Media = (props: AnimatedMediaProps) => {
  const { media, className, opacity } = props;

  if (!media) {
    return null;
  }

  const video = isVideo(media?.src);

  if (video) {
    return (
      <video
        playsInline
        loop
        preload="auto"
        autoPlay
        muted
        className={classNames(className)}
        style={{ opacity }}
      >
        <source src={createImageUrl(media?.src)} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      key={media.src}
      src={createImageUrl(media.src)}
      alt={media.alt}
      width={media.width}
      height={media.height}
      loading="lazy"
      style={{ height: "auto", opacity }}
      className={classNames(className)}
      quality={85}
    />
  );
};
