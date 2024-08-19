import { ReactNode } from "react";
import Adidas from "src/icons/Adidas.svg";
import Disney from "src/icons/Disney.svg";
import Dove from "src/icons/Dove.svg";
import GE from "src/icons/GE.svg";
import Samsung from "src/icons/Samsung.svg";

interface FeaturedBrand {
  name: string;
  maxWidth?: string;
  icon: React.JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
}

export const featuredBrands: FeaturedBrand[] = [
  {
    name: "Dove",
    icon: Dove,
  },
  {
    name: "Samsung",
    icon: Samsung,
  },
  {
    name: "Disney",
    icon: Disney,
  },
  {
    name: "GE",
    icon: GE,
    maxWidth: "7rem",
  },
  {
    name: "Adidas",
    icon: Adidas,
    maxWidth: "7rem",
  },
];
