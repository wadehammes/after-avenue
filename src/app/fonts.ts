import localFont from "next/font/local";

const arida = localFont({
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  src: [
    {
      path: "./fonts/Arida/Arida-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Arida/Arida-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Arida/Arida-Medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Arida/Arida-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Arida/Arida-RegularIt.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-arida",
});

const area = localFont({
  display: "swap",
  fallback: ["system-ui", "arial", "sans-serif"],
  src: [
    {
      path: "./fonts/Area/fonnts.com-Area_Normal_Black_Italic.otf",
      weight: "900",
      style: "italic",
    },
    {
      path: "./fonts/Area/fonnts.com-Area_Normal_Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Area/fonnts.com-Area_Normal_Bold_Italic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/Area/fonnts.com-Area_Normal_Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Area/fonnts.com-Area_Normal_ExtraBold_Italic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "./fonts/Area/fonnts.com-Area_Normal_ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Area/fonnts.com-Area_Normal_Regular_Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Area/fonnts.com-Area_Normal_Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Area/fonnts.com-Area_Normal_SemiBold_Italic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/Area/fonnts.com-Area_Normal_SemiBold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-area",
});

export { arida, area };
