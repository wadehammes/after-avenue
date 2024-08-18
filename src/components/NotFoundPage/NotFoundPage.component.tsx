import { Hero } from "src/components/Hero/Hero";

export const NotFoundPage = () => {
  return (
    <div className="page-content">
      <Hero
        h1="Oops."
        subtitle="This is awkward, we know, but we can't find a page with that url. Sorry about that."
        buttonProps={{ label: "Go back home", href: "/" }}
        reducedHeight
      />
    </div>
  );
};
