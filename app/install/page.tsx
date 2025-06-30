"use client";

import { Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Install App</h1>
      <div className="max-w-md w-full space-y-6 border-2 border-gray-300 rounded-lg p-4">
        {isInstallable ? (
          <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Install App</h2>
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Install App
            </button>
          </div>
        ) : (
          <>
            <div className="p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Safari_2020_logo.svg/1024px-Safari_2020_logo.svg.png?20240509054828"
                    alt="Safari"
                    width={18}
                    height={18}
                  />
                </div>
                <h2 className="text-xl font-semibold">iOS Installation</h2>
              </div>
              <ol className="list-decimal list-inside space-y-2">
                <li>Open this website in Safari</li>
                <li>
                  Tap the Share button <span className="inline-block">⎋</span>
                </li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" to install</li>
              </ol>
            </div>

            <div className="p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg"
                    alt="Chrome"
                    width={18}
                    height={18}
                  />
                </div>
                <h2 className="text-xl font-semibold">Android Installation</h2>
              </div>
              <ol className="list-decimal list-inside space-y-2">
                <li>Open this website in Chrome</li>
                <li>
                  Tap the three dots menu{" "}
                  <span className="inline-block">⋮</span>
                </li>
                <li>Select "Add to Home screen"</li>
                <li>Tap "Add" to install</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
