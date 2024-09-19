import { MarqueeItem } from "src/components/Marquee/Marquee.component";
import Adidas from "src/icons/Adidas.svg";
import Ancestry from "src/icons/Ancestry.svg";
import Audible from "src/icons/Audible.svg";
import Axios from "src/icons/Axios.svg";
import Disney from "src/icons/Disney.svg";
import Dove from "src/icons/Dove.svg";
import FisherPrice from "src/icons/FisherPrice.svg";
import GE from "src/icons/GE.svg";
import Microsoft from "src/icons/Microsoft.svg";
import Pfizer from "src/icons/Pfizer.svg";
import Samsung from "src/icons/Samsung.svg";
import TheAtlantic from "src/icons/TheAtlantic.svg";
import TheMacallan from "src/icons/TheMacallan.svg";

export const featuredBrands: MarqueeItem[] = [
  {
    name: "Axios",
    content: <Axios />,
    maxWidth: "clamp(11rem, 5vw, 13rem)",
  },
  {
    name: "Ancestry",
    content: <Ancestry />,
    maxWidth: "clamp(15rem, 5vw, 16rem)",
  },
  {
    name: "Dove",
    content: <Dove />,
    maxWidth: "clamp(11rem, 5vw, 13rem)",
  },
  {
    name: "Audible",
    content: <Audible />,
    maxWidth: "clamp(11rem, 5vw, 13rem)",
  },
  {
    name: "Samsung",
    content: <Samsung />,
    maxWidth: "clamp(12rem, 5vw, 14rem)",
  },
  {
    name: "GE",
    content: <GE />,
    maxWidth: "clamp(5rem, 5vw, 6rem)",
  },
  {
    name: "Disney",
    content: <Disney />,
    maxWidth: "clamp(10rem, 5vw, 12rem)",
  },
  {
    name: "The Atlantic",
    content: <TheAtlantic />,
    maxWidth: "clamp(10rem, 5vw, 12rem)",
  },
  {
    name: "Adidas",
    content: <Adidas />,
    maxWidth: "clamp(5rem, 5vw, 6rem)",
  },
  {
    name: "Fisher Price",
    content: <FisherPrice />,
    maxWidth: "clamp(12rem, 5vw, 14rem)",
  },
  {
    name: "Pfizer",
    content: <Pfizer />,
    maxWidth: "clamp(12rem, 5vw, 14rem)",
  },
  {
    name: "The Macallan",
    content: <TheMacallan />,
    maxWidth: "clamp(12rem, 5vw, 14rem)",
  },
  {
    name: "Microsoft",
    content: <Microsoft />,
    maxWidth: "clamp(12rem, 5vw, 14rem)",
  },
];
