import { faker } from "@faker-js/faker";
import type { StyledButtonType } from "src/components/StyledButton/StyledButton.interfaces";
import { BaseFactory } from "src/tests/factories/BaseFactory";
import type { KeysMatch } from "src/types/KeysMatch";

type StyledButtonFactoryOptions = Record<string, never>;

class StyledButtonFactory extends BaseFactory<
  StyledButtonType,
  StyledButtonFactoryOptions
> {
  build(
    attributes?: Partial<StyledButtonType>,
    _options?: StyledButtonFactoryOptions,
  ) {
    const instance = {
      id: faker.string.uuid(),
      label: faker.lorem.words(2),
    } satisfies StyledButtonType;

    const factoryBuilt: StyledButtonType = {
      ...instance,
      ...(attributes ?? {}),
    };

    const _allKeysMustBeInTheInstance: KeysMatch<
      StyledButtonType,
      typeof instance
    > = undefined;

    return factoryBuilt;
  }
}

export const styledButtonFactory = new StyledButtonFactory();
