/** Vimeo page URL → sync poster image (no oEmbed round-trip). */
export function getVimeoPosterUrl(videoUrl: string): string | undefined {
  const match = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);

  if (!match) {
    return undefined;
  }

  return `https://vumbnail.com/${match[1]}.jpg`;
}
