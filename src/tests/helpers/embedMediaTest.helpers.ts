import { jest } from "@jest/globals";

export const createEmbedMediaDomFixture = () => {
  const container = document.createElement("div");
  const embed = document.createElement("vimeo-video");
  container.appendChild(embed);

  return {
    container,
    containerRef: { current: container },
    embed,
  };
};

export const createMockEmbedMediaController = () => {
  const play = jest.fn(async () => {});
  const pause = jest.fn(async () => {});

  return { pause, play };
};
