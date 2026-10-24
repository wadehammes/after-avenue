import { jest } from "@jest/globals";

const createdObservers: IntersectionObserver[] = [];

export function resetIntersectionObserverMocks(): void {
  for (const observer of createdObservers) {
    observer.disconnect();
  }

  createdObservers.length = 0;

  const reactIntersectionObserverPath = require.resolve(
    "react-intersection-observer",
  );
  delete require.cache[reactIntersectionObserverPath];

  try {
    const featuredReelInViewPath = require.resolve(
      "src/components/FeaturedWork/useFeaturedReelInView",
    );
    delete require.cache[featuredReelInViewPath];
  } catch {
    return;
  }
}

export interface SetupIntersectionObserverMockOptions {
  disconnect?: () => void;
  fireOnObserve?: boolean;
  isIntersecting?: boolean;
  observe?: (target: Element) => void;
  root?: Element | null;
  rootMargin?: string;
  scrollMargin?: string;
  takeRecords?: () => IntersectionObserverEntry[];
  thresholds?: number[];
  unobserve?: (target: Element) => void;
}

export interface IntersectionObserverMockHandle {
  observe: jest.Mock<(target: Element) => void>;
}

export function setupIntersectionObserverMock({
  disconnect = () => null,
  fireOnObserve = false,
  isIntersecting = false,
  observe: observeOverride,
  root = null,
  rootMargin = "",
  scrollMargin = "",
  takeRecords = () => [],
  thresholds = [],
  unobserve = () => null,
}: SetupIntersectionObserverMockOptions = {}): IntersectionObserverMockHandle {
  const observeMock = jest.fn((target: Element) => {
    observeOverride?.(target);
  });

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null;
    readonly rootMargin: string;
    readonly scrollMargin: string;
    readonly thresholds: ReadonlyArray<number>;
    observe: (target: Element) => void = (target) => {
      observeMock(target);

      if (fireOnObserve) {
        this.callback(
          [
            {
              boundingClientRect: target.getBoundingClientRect(),
              intersectionRatio: isIntersecting ? 1 : 0,
              intersectionRect: target.getBoundingClientRect(),
              isIntersecting,
              rootBounds: null,
              target,
              time: Date.now(),
            },
          ],
          this,
        );
      }
    };
    takeRecords: () => IntersectionObserverEntry[] = takeRecords;
    unobserve: (target: Element) => void = unobserve;

    constructor(
      private readonly callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      createdObservers.push(this);
      this.root = options?.root instanceof Element ? options.root : root;
      this.rootMargin = options?.rootMargin ?? rootMargin;
      this.scrollMargin = scrollMargin;
      const optionThreshold = options?.threshold;
      if (optionThreshold === undefined) {
        this.thresholds = thresholds.length > 0 ? thresholds : [0];
      } else if (Array.isArray(optionThreshold)) {
        this.thresholds = optionThreshold;
      } else {
        this.thresholds = [optionThreshold];
      }
    }

    disconnect = (): void => {
      disconnect();
      const index = createdObservers.indexOf(this);
      if (index >= 0) {
        createdObservers.splice(index, 1);
      }
    };
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });

  Object.defineProperty(global, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });

  return { observe: observeMock };
}
