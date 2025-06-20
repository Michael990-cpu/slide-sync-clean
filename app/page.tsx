import type { Metadata } from "next"
import ClientHomePage from "./ClientHomePage"

export const metadata: Metadata = {
  title: "SlideSync - Create Beautiful Before & After Slideshows",
  description:
    "Create stunning before & after slideshows with smooth transitions, music, and text overlays. Share your transformations on social media.",
}

export default function HomePage() {
  return <ClientHomePage />
}
