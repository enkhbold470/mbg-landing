// admin page to configure the site, /config/siteConfig.ts
import { siteConfig } from "@/config/site";

export default function AdminPage() {
  return <div>
    <h1>Admin Page</h1>
    <p>{siteConfig.name}</p>
    <p>{siteConfig.description}</p>
    <p>{siteConfig.tagline}</p>
    <p>{siteConfig.slogan}</p>
    <p>{siteConfig.url}</p>
    <p>{siteConfig.ogImage}</p>

  </div>;
}