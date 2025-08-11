'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
interface SiteConfigFormProps {
  siteConfig: any
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export function SiteConfigForm({ siteConfig, onSubmit }: SiteConfigFormProps) {
  // console.log("⚙️ [SiteConfigForm] Rendering form with config:", siteConfig ? "Loaded" : "Loading...");
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(e);
    toast({
      title: "Admin Page | 管理页面",
        description: "Site settings saved successfully | 站点设置已成功保存",
    })  
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings | 站点设置</CardTitle>
        <CardDescription>Configure your site | 配置您的站点</CardDescription>
      </CardHeader>
      <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name | 站点名称</Label>
              <Input
                id="name"
                name="name"
                defaultValue={siteConfig?.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline | 标语</Label>
              <Input
                id="tagline"
                name="tagline"
                defaultValue={siteConfig?.tagline}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description | 描述</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={siteConfig?.description}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slogan">Slogan | 口号</Label>
            <Input
              id="slogan"
              name="slogan"
              defaultValue={siteConfig?.slogan}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Site URL | 站点链接</Label>
            <Input
              id="url"
              name="url"
              defaultValue={siteConfig?.url}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogImage">OG Image URL | OG 图片链接</Label>
            <Input
              id="ogImage"
              name="ogImage"
              defaultValue={siteConfig?.ogImage}
              required
            />
          </div>
              <Button type="submit">Save | 保存</Button>
        </form>
      </CardContent>
    </Card>
  )
} 