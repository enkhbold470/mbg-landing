"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Monitor } from "lucide-react";

const themes = [
  { name: "light", label: "Light", icon: Sun },
  { name: "dark", label: "Dark", icon: Moon },
  { name: "system", label: "System", icon: Monitor },
];

const colors = [
  { name: "default", label: "Default", value: "hsl(262.1 83.3% 57.8%)" },
  { name: "blue", label: "Blue", value: "hsl(221.2 83.2% 53.3%)" },
  { name: "green", label: "Green", value: "hsl(142.1 76.2% 36.3%)" },
  { name: "red", label: "Red", value: "hsl(0 84.2% 60.2%)" },
  { name: "orange", label: "Orange", value: "hsl(24.6 95% 53.1%)" },
];

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Theme Mode</Label>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="grid grid-cols-3 gap-4"
            >
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.name} className="flex items-center space-x-2">
                    <RadioGroupItem value={t.name} id={t.name} />
                    <Label
                      htmlFor={t.name}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{t.label}</span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Color Scheme</Label>
            <Select defaultValue="default">
              <SelectTrigger>
                <SelectValue placeholder="Select a color scheme" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color.name} value={color.name}>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full">
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 