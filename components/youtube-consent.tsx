"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { youtubeVideo } from "@/lib/utils"
import { PlayIcon } from "lucide-react"

interface YouTubeConsentProps {
  link: string
  title: string
  className?: string
}

function extractYouTubeId(link: string): string | null {
  try {
    const url = new URL(link)
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "") || null
    }
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v")
      return id
    }
  } catch {
    // Fallback: naive split
    const maybe = link.split("v=")[1]
    if (maybe) return maybe
  }
  return null
}

export function YouTubeConsent({ link, title, className }: YouTubeConsentProps) {
  const [consented, setConsented] = useState(false)
  const videoId = useMemo(() => extractYouTubeId(link), [link])

  const thumbnail = useMemo(() => {
    return videoId ? `/vi-placeholder.png` : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  }, [videoId])

  if (consented) {
    const src = youtubeVideo(link) + "&autoplay=1"
    return (
      <iframe
        width="100%"
        height="100%"
        src={src}
        title={title}
        frameBorder={0}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className={cn("rounded-2xl", className)}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConsented(true)}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-200",
        className
      )}
      aria-label={`Play video: ${title}`}
    >
      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt="YouTube video thumbnail"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gray-100" />
      )}

      <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow">
          <PlayIcon className="h-6 w-6 text-purple-600" />
          <span className="text-sm font-medium text-gray-900">Play video</span>
        </div>
      </div>

      <span className="sr-only">Click to load YouTube. Third-party content will be requested.</span>
    </button>
  )
}


