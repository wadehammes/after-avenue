import { createClient } from "contentful";

interface InitOptions {
  preview?: boolean;
}

const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID as string;
const contentfulContentDeliveryToken = process.env
  .CONTENTFUL_CONTENT_DELIVERY_API_KEY as string;
const contentfulPreviewToken = process.env.CONTENTFUL_PREVIEW_API_KEY as string;

const client = createClient({
  space: contentfulSpaceId,
  accessToken: contentfulContentDeliveryToken,
});

const previewClient = createClient({
  space: contentfulSpaceId,
  accessToken: contentfulPreviewToken,
  host: "preview.contentful.com",
});

export const contentfulClient = ({ preview = false }: InitOptions) => {
  if (preview) {
    return previewClient;
  }

  return client;
};
