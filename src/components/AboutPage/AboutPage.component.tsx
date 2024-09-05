import { SectionRenderer } from "src/components/SectionRenderer/SectionRenderer.component";
import { Page } from "src/contentful/getPages";

interface AboutPageProps {
  pageFields: Page;
}

export const AboutPage = (props: AboutPageProps) => {
  const { pageFields } = props;
  const { sections } = pageFields;

  return <SectionRenderer sections={sections} noPadding />;
};
