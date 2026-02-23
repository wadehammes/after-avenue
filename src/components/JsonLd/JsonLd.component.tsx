interface JsonLdProps {
  data: object;
}

export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data, stringified for safety
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
