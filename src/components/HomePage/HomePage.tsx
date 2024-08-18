import { FeaturedWork } from "src/components/FeaturedWork/FeaturedWork.component";
import type { Work } from "src/contentful/getWork";

interface HomePageProps {
  featuredWork: Work[];
}

export const HomePage = (props: HomePageProps) => {
  const { featuredWork } = props;

  return featuredWork.map((work) => (
    <FeaturedWork fields={work} key={work.workSlug} />
  ));
};
