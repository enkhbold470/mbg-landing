"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hexColors, hexToHsl, applyTheme, toggleTheme, getCurrentTheme } from "@/lib/colors";
import { useState, useEffect } from "react";

export function ThemeCustomizer() {
  const [colors, setColors] = useState({
    primary: hexColors.primary,
    secondary: hexColors.secondary,
    success: hexColors.success,
    warning: hexColors.warning,
    error: hexColors.error,
  });
  
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Get current theme on mount
    const currentTheme = getCurrentTheme();
    setIsDark(currentTheme.isDark);
  }, []);

  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    setColors((prev) => ({
      ...prev,
      [colorKey]: value,
    }));
  };

  const applyColors = () => {
    // Apply colors to CSS variables
    const colorMap = {
      primary: hexToHsl(colors.primary),
      secondary: hexToHsl(colors.secondary),
      destructive: hexToHsl(colors.error),
      ring: hexToHsl(colors.primary),
      accent: hexToHsl(colors.secondary),
    };

    // Apply to CSS variables
    const root = document.documentElement;
    Object.entries(colorMap).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Show success message
    alert("Colors applied successfully! Your theme has been updated.");
  };

  const resetToDefaults = () => {
    setColors({
      primary: hexColors.primary,
      secondary: hexColors.secondary,
      success: hexColors.success,
      warning: hexColors.warning,
      error: hexColors.error,
    });
    
    // Reset CSS variables by removing custom properties
    const root = document.documentElement;
    ['primary', 'secondary', 'destructive', 'ring', 'accent'].forEach(prop => {
      root.style.removeProperty(`--${prop}`);
    });
  };

  const handleThemeToggle = () => {
    const newIsDark = toggleTheme();
    setIsDark(newIsDark);
  };

  const copyTailwindConfig = () => {
    const configSnippet = `// CSS Variables for global.css
:root {
  --primary: ${hexToHsl(colors.primary)};
  --secondary: ${hexToHsl(colors.secondary)};
  --destructive: ${hexToHsl(colors.error)};
  --ring: ${hexToHsl(colors.primary)};
  --accent: ${hexToHsl(colors.secondary)};
}

// Or direct Tailwind config colors:
colors: {
  primary: "${colors.primary}",
  secondary: "${colors.secondary}",
  destructive: "${colors.error}",
  success: "${colors.success}",
  warning: "${colors.warning}",
}`;
    
    navigator.clipboard.writeText(configSnippet);
    alert("Configuration copied to clipboard!");
  };

  return (
    <div className="p-6 border rounded-lg bg-card space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Theme Customizer</h2>
        <p className="text-sm text-muted-foreground">
          Customize your color palette using CSS variables. Changes apply in real-time.
        </p>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div>
          <h3 className="font-medium">Theme Mode</h3>
          <p className="text-sm text-muted-foreground">
            Currently using {isDark ? 'dark' : 'light'} theme
          </p>
        </div>
        <Button onClick={handleThemeToggle} variant="outline">
          Switch to {isDark ? 'Light' : 'Dark'}
        </Button>
      </div>
      
      {/* Color Controls */}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="primary">Primary Color</Label>
          <div className="flex gap-2">
            <Input
              id="primary"
              type="color"
              value={colors.primary}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              type="text"
              value={colors.primary}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="flex-1"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="secondary">Secondary Color</Label>
          <div className="flex gap-2">
            <Input
              id="secondary"
              type="color"
              value={colors.secondary}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              type="text"
              value={colors.secondary}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
              className="flex-1"
              placeholder="#ec4899"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="success">Success Color</Label>
          <div className="flex gap-2">
            <Input
              id="success"
              type="color"
              value={colors.success}
              onChange={(e) => handleColorChange("success", e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              type="text"
              value={colors.success}
              onChange={(e) => handleColorChange("success", e.target.value)}
              className="flex-1"
              placeholder="#10b981"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="warning">Warning Color</Label>
          <div className="flex gap-2">
            <Input
              id="warning"
              type="color"
              value={colors.warning}
              onChange={(e) => handleColorChange("warning", e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              type="text"
              value={colors.warning}
              onChange={(e) => handleColorChange("warning", e.target.value)}
              className="flex-1"
              placeholder="#f59e0b"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="error">Error Color</Label>
          <div className="flex gap-2">
            <Input
              id="error"
              type="color"
              value={colors.error}
              onChange={(e) => handleColorChange("error", e.target.value)}
              className="w-12 h-10 p-1 border rounded"
            />
            <Input
              type="text"
              value={colors.error}
              onChange={(e) => handleColorChange("error", e.target.value)}
              className="flex-1"
              placeholder="#ef4444"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button onClick={applyColors} className="w-full">
            Apply Colors
          </Button>
          <Button onClick={resetToDefaults} variant="outline" className="w-full">
            Reset
          </Button>
          <Button onClick={copyTailwindConfig} variant="secondary" className="w-full">
            Copy Config
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Live Preview</h3>
        
        {/* Color Swatches */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-primary border"></div>
            <span className="text-xs">Primary</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-secondary border"></div>
            <span className="text-xs">Secondary</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-destructive border"></div>
            <span className="text-xs">Destructive</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-success border"></div>
            <span className="text-xs">Success</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-warning border"></div>
            <span className="text-xs">Warning</span>
          </div>
        </div>

        {/* Component Previews */}
        <div className="grid gap-3">
          <div className="p-4 bg-card border rounded-lg">
            <h4 className="font-medium mb-2">Card Component</h4>
            <p className="text-muted-foreground text-sm">This is how cards look with your theme.</p>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm">Primary Button</Button>
            <Button variant="secondary" size="sm">Secondary</Button>
            <Button variant="destructive" size="sm">Destructive</Button>
            <Button variant="outline" size="sm">Outline</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
