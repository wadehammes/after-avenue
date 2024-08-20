import Adidas from "src/icons/Adidas.svg";
import Disney from "src/icons/Disney.svg";
import Dove from "src/icons/Dove.svg";
import GE from "src/icons/GE.svg";
import Samsung from "src/icons/Samsung.svg";
import TheAtlantic from "src/icons/TheAtlantic.svg";

interface FeaturedBrand {
  name: string;
  maxWidth?: string;
  icon: React.JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
}

export const featuredBrands: FeaturedBrand[] = [
  {
    name: "Dove",
    icon: Dove,
    maxWidth: "clamp(11rem, 5vw, 13rem)",
  },
  {
    name: "Samsung",
    icon: Samsung,
    maxWidth: "clamp(12rem, 5vw, 14rem)",
  },
  {
    name: "Disney",
    icon: Disney,
    maxWidth: "clamp(10rem, 5vw, 12rem)",
  },
  {
    name: "The Atlantic",
    icon: TheAtlantic,
    maxWidth: "clamp(10rem, 5vw, 12rem)",
  },
  {
    name: "GE",
    icon: GE,
    maxWidth: "clamp(5rem, 5vw, 6rem)",
  },
  {
    name: "Adidas",
    icon: Adidas,
    maxWidth: "clamp(5rem, 5vw, 6rem",
  },
];
