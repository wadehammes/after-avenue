import { FeaturedWork } from "src/components/FeaturedWork/FeaturedWork.component";
import type { LazyReactPlayerProps } from "src/components/LazyReactPlayer/LazyReactPlayer.component";
import type { Work } from "src/contentful/getWork";
import { GlobalVariablesProvider } from "src/context/globalContext.context";
import {
  BasePageObject,
  type BasePageObjectProps,
} from "src/tests/basePageObject.po";
import { workFactory } from "src/tests/factories/Work.factory";
import { render } from "src/tests/test-utils";

export const featuredWorkPlayerProps: LazyReactPlayerProps[] = [];

jest.mock("src/components/LazyReactPlayer/LazyReactPlayer.component", () => ({
  LazyReactPlayer: (props: LazyReactPlayerProps) => {
    featuredWorkPlayerProps.push(props);

    return <div data-testid="featured-work-player" />;
  },
}));

export class FeaturedWorkPageObject extends BasePageObject {
  public testId = "rhFeaturedWork";
  public defaultWork = workFactory.build();

  constructor(
    { debug, raiseOnFind }: BasePageObjectProps = {
      debug: false,
      raiseOnFind: false,
    },
  ) {
    super({ debug, raiseOnFind });
  }

  renderFeaturedWork(fields: Work = this.defaultWork, priority = false) {
    featuredWorkPlayerProps.length = 0;

    render(
      <GlobalVariablesProvider
        value={{
          featuredWorkButtonText: "Watch Video",
          id: "global-vars-test",
        }}
      >
        <FeaturedWork fields={fields} priority={priority} />
      </GlobalVariablesProvider>,
    );
  }

  latestPlayerProps() {
    return featuredWorkPlayerProps.at(-1);
  }
}
