import { faker } from "@faker-js/faker";
import type { Work } from "src/contentful/getWork";
import { BaseFactory } from "src/tests/factories/BaseFactory";

class WorkFactory extends BaseFactory<Work, object> {
  public build(attributes: Partial<Work> = {}): Work {
    const slug =
      attributes.workSlug ?? faker.helpers.slugify(faker.lorem.words(2));

    return {
      id: this.generateId(),
      publishDate: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      workSlug: slug,
      workTitle: faker.lorem.sentence(),
      workVideoUrl: `https://vimeo.com/${faker.number.int({ min: 100000000, max: 999999999 })}`,
      ...attributes,
    };
  }
}

export const workFactory = new WorkFactory();
