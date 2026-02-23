import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "Vercel",
};

const VercelDashboard = async () => {
  return notFound();
};

export default VercelDashboard;
