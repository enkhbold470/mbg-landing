"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfile } from "./actions/saveProfile";
import { createDeliveryOrder, calculateDeliveryQuote, trackDeliveryOrder } from "./actions/getMatches";
import { siteConfig } from "@/config/site";
import { DeliveryOrderFormData, DeliveryQuote } from "@/lib/types";
import { Package, Search, Home as HomeIcon, Shield, Calculator } from "lucide-react";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🏠 Loading MBG Cargo package delivery service");
}

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"claim" | "track">("claim");
  const [trackingId, setTrackingId] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  const [formData, setFormData] = useState<DeliveryOrderFormData>({
    tracking_id: "",
    package_title: "",
    package_description: "",
    delivery_address: "",
    item_value: 0,
    wants_insurance: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fetchedProfile = await getProfile();
        setProfile(fetchedProfile);
        
        // Pre-fill delivery address from profile
        if (fetchedProfile?.home_address) {
          setFormData(prev => ({ ...prev, delivery_address: fetchedProfile.home_address || "" }));
        }
        
        if (process.env.NODE_ENV === "development") {
          console.log("👤 Profile loaded:", fetchedProfile ? "found" : "not found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field: keyof DeliveryOrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate quote when key fields change
    if (["wants_insurance", "item_value"].includes(field) && formData.item_value > 0) {
      handleCalculateQuote();
    }
  };

  const handleCalculateQuote = async () => {
    if (!formData.tracking_id || formData.item_value <= 0) return;
    
    try {
      const calculatedQuote = await calculateDeliveryQuote(formData);
      setQuote(calculatedQuote);
      
      if (process.env.NODE_ENV === "development") {
        console.log("💰 Quote calculated:", calculatedQuote);
      }
    } catch (error) {
      console.error("Error calculating quote:", error);
    }
  };

  const handleSubmitDeliveryOrder = async () => {
    if (!formData.tracking_id || !formData.package_title || !formData.delivery_address || formData.item_value <= 0) {
      alert("Please fill in all required fields including item value");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createDeliveryOrder(formData);
      
      if (!response.success) {
        alert(`Error: ${response.error}`);
        return;
      }
      
      const deliveryOrder = response.data;
      
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Delivery order created:", deliveryOrder.tracking_id);
      }
      
      alert(`Package delivery claimed successfully! Tracking ID: ${deliveryOrder.tracking_id}`);
      
      // Reset form
      setFormData({
        tracking_id: "",
        package_title: "",
        package_description: "",
        delivery_address: profile?.home_address || "",
        item_value: 0,
        wants_insurance: false,
      });
      setQuote(null);
      
      // Switch to tracking tab with the tracking ID
      setTrackingId(deliveryOrder.tracking_id);
      setActiveTab("track");
      
    } catch (error: any) {
      console.error("Error creating delivery order:", error);
      alert(`Error: ${error.message || "An unexpected error occurred. Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackDelivery = async () => {
    if (!trackingId.trim()) return;
    
    try {
      const response = await trackDeliveryOrder(trackingId);
      
      if (!response.success) {
        setTrackingResult({ error: response.error || "Package not found" });
        return;
      }
      
      setTrackingResult(response.data);
      
      if (process.env.NODE_ENV === "development") {
        console.log("📍 Tracking result:", response.data);
      }
    } catch (error: any) {
      console.error("Error tracking delivery:", error);
      setTrackingResult({ error: error.message || "An unexpected error occurred" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p>Loading {siteConfig.name}...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Welcome to {siteConfig.name}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Claim your packages at our cargo facility and get them delivered to your home
        </p>
        
        {!profile && (
          <Button 
            onClick={() => router.push("/profile")}
            className="mb-8"
          >
            Create Account to Get Started
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side - Features */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Package Claiming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Use your tracking ID to claim packages from our cargo facility.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5" />
                Home Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get your packages delivered directly to your home address.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Optional Insurance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Add insurance coverage for ¥50 for peace of mind during delivery.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Center - Main Form */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="flex mb-6 border-b">
            <Button
              variant={activeTab === "claim" ? "default" : "ghost"}
              onClick={() => setActiveTab("claim")}
              className="rounded-none border-b-2 border-transparent"
            >
              <Package className="h-4 w-4 mr-2" />
              Claim Package
            </Button>
            <Button
              variant={activeTab === "track" ? "default" : "ghost"}
              onClick={() => setActiveTab("track")}
              className="rounded-none border-b-2 border-transparent"
            >
              <Search className="h-4 w-4 mr-2" />
              Track Delivery
            </Button>
          </div>

          {/* Claim Package Tab */}
          {activeTab === "claim" && (
            <Card>
              <CardHeader>
                <CardTitle>Claim Your Package</CardTitle>
                <CardDescription>
                  Enter your tracking ID to claim your package and request home delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tracking ID */}
                <div>
                  <Label htmlFor="tracking_id">Package Tracking ID *</Label>
                  <Input
                    id="tracking_id"
                    value={formData.tracking_id}
                    onChange={(e) => handleInputChange("tracking_id", e.target.value)}
                    placeholder="Enter your tracking ID (e.g., PKG123456789)"
                  />
                </div>

                {/* Package Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="package_title">Package Title *</Label>
                    <Input
                      id="package_title"
                      value={formData.package_title}
                      onChange={(e) => handleInputChange("package_title", e.target.value)}
                      placeholder="Electronics, Clothes, Documents, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="item_value">Item Value (¥) *</Label>
                    <Input
                      id="item_value"
                      type="number"
                      value={formData.item_value || ""}
                      onChange={(e) => handleInputChange("item_value", parseFloat(e.target.value) || 0)}
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="package_description">Package Description</Label>
                  <Textarea
                    id="package_description"
                    value={formData.package_description || ""}
                    onChange={(e) => handleInputChange("package_description", e.target.value)}
                    placeholder="Brief description of your package contents..."
                    rows={3}
                  />
                </div>

                {/* Delivery Address */}
                <div>
                  <Label htmlFor="delivery_address">Home Delivery Address *</Label>
                  <Textarea
                    id="delivery_address"
                    value={formData.delivery_address}
                    onChange={(e) => handleInputChange("delivery_address", e.target.value)}
                    placeholder="Enter your complete home address for delivery..."
                    rows={3}
                  />
                  {profile?.home_address && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleInputChange("delivery_address", profile.home_address)}
                    >
                      Use My Profile Address
                    </Button>
                  )}
                </div>

                {/* Insurance Option */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="insurance"
                    checked={formData.wants_insurance}
                    onCheckedChange={(checked) => handleInputChange("wants_insurance", checked)}
                  />
                  <Label htmlFor="insurance" className="text-sm">
                    Add insurance coverage (10% of item value)
                    {formData.item_value > 0 && ` - ¥${(formData.item_value * 0.1).toFixed(2)}`}
                  </Label>
                </div>

                {/* Quote Display */}
                {quote && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-800">
                        <Calculator className="h-5 w-5" />
                        Delivery Quote
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-blue-800">
                      <div className="space-y-3 text-sm">
                        <div>Base Cargo Cost: ¥{quote.base_cargo_cost.toFixed(2)}</div>
                        <div>Insurance: ¥{quote.insurance_cost.toFixed(2)}</div>
                        <div className="pt-2 border-t border-blue-300">
                          <div className="font-semibold text-blue-900">
                            Estimated Delivery: {quote.estimated_days} days
                          </div>
                          <p className="text-xs mt-2 text-blue-700">
                            ⚠️ Final delivery cost subject to change depending on package size and weight
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <Button 
                    onClick={handleCalculateQuote}
                    variant="outline"
                    disabled={!formData.tracking_id || formData.item_value <= 0}
                  >
                    Calculate Quote
                  </Button>
                  <Button
                    onClick={handleSubmitDeliveryOrder}
                    disabled={!formData.tracking_id || !formData.package_title || !formData.delivery_address || formData.item_value <= 0 || isSubmitting}
                  >
                    {isSubmitting ? "Claiming..." : "Claim Package"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Track Delivery Tab */}
          {activeTab === "track" && (
            <Card>
              <CardHeader>
                <CardTitle>Track Your Delivery</CardTitle>
                <CardDescription>
                  Enter your tracking ID to see the current delivery status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter tracking ID"
                    className="flex-1"
                  />
                  <Button onClick={handleTrackDelivery}>
                    Track
                  </Button>
                </div>

                {trackingResult && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Tracking Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {trackingResult.error ? (
                        <p className="text-red-600">{trackingResult.error}</p>
                      ) : (
                        <div className="space-y-2">
                          <div><strong>Tracking ID:</strong> {trackingResult.tracking_id}</div>
                          <div><strong>Status:</strong> <span className="capitalize">{trackingResult.status}</span></div>
                          <div><strong>Package:</strong> {trackingResult.package_title}</div>
                          <div><strong>Delivery Address:</strong> {trackingResult.delivery_address}</div>
                          <div><strong>Insurance:</strong> {trackingResult.wants_insurance ? "Yes" : "No"}</div>
                          {trackingResult.estimated_delivery && (
                            <div><strong>Estimated Delivery:</strong> {new Date(trackingResult.estimated_delivery).toLocaleDateString()}</div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
