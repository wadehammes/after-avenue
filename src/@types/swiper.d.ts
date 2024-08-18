import React from "react";

import type { SwiperProps, SwiperSlideProps } from "swiper/react";

declare global {
  // biome-ignore lint/style/noNamespace: <explanation>
  // biome-ignore lint/style/useNamingConvention: <explanation>
  namespace JSX {
    interface IntrinsicElements {
      "swiper-container": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & SwiperProps,
        HTMLElement
      >;
      "swiper-slide": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & SwiperSlideProps,
        HTMLElement
      >;
    }
  }
}
