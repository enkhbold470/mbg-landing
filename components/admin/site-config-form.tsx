'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SiteConfigFormProps {
  siteConfig: any
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export function SiteConfigForm({ siteConfig, onSubmit }: SiteConfigFormProps) {
  console.log("⚙️ [SiteConfigForm] Rendering form with config:", siteConfig ? "Loaded" : "Loading...");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Configuration</CardTitle>
        <CardDescription>Update basic site information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={siteConfig?.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                defaultValue={siteConfig?.tagline}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={siteConfig?.description}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slogan">Slogan</Label>
            <Input
              id="slogan"
              name="slogan"
              defaultValue={siteConfig?.slogan}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Site URL</Label>
            <Input
              id="url"
              name="url"
              defaultValue={siteConfig?.url}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogImage">OG Image URL</Label>
            <Input
              id="ogImage"
              name="ogImage"
              defaultValue={siteConfig?.ogImage}
              required
            />
          </div>
          <Button type="submit">Update Site Configuration</Button>
        </form>
      </CardContent>
    </Card>
  )
} 