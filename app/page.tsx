import { loadContent } from "@/lib/content";
import PortfolioClient from "./portfolio/PortfolioClient";

export default function Page() {
  const content = loadContent();
  return <PortfolioClient content={content} />;
}
