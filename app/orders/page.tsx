"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserDeliveryOrders, trackDeliveryOrder } from "@/app/actions/getMatches";
import { DeliveryOrderWithUser } from "@/lib/types";
import { Package, Search, MapPin, Calendar, DollarSign, Shield, Eye, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("📋 Loading orders dashboard");
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<DeliveryOrderWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrderWithUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const userOrders = await getUserDeliveryOrders();
        setOrders(userOrders);

        if (process.env.NODE_ENV === "development") {
          console.log(`📦 Loaded ${userOrders.length} orders`);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = async (order: DeliveryOrderWithUser) => {
    try {
      const response = await trackDeliveryOrder(order.tracking_id);
      
      if (response.success) {
        setSelectedOrder(response.data);
      } else {
        console.error("Error fetching order details:", response.error);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "requested":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_delivery":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "requested":
        return "⏳";
      case "confirmed":
        return "✅";
      case "in_delivery":
        return "🚚";
      case "delivered":
        return "📦";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  const filteredOrders = orders.filter(order =>
    order.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.package_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Delivery Orders</h1>
        <p className="text-gray-600">Track and manage all your package delivery orders</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by tracking ID or package title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Protected</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{orders.filter(order => order.wants_insurance).reduce((sum, order) => sum + order.item_value, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => ["requested", "confirmed", "in_delivery"].includes(order.status)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">
              {orders.length === 0 
                ? "You haven't claimed any packages yet." 
                : "No orders match your search criteria."
              }
            </p>
            {orders.length === 0 && (
              <Button onClick={() => router.push("/")}>
                Claim Your First Package
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{order.package_title}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)} {order.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="font-mono">{order.tracking_id}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>¥{order.item_value.toFixed(2)} value</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span>{order.wants_insurance ? "Insured" : "No Insurance"}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {order.package_description && (
                      <p className="text-gray-600 mt-2 text-sm">{order.package_description}</p>
                    )}
                    
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600 line-clamp-2">{order.delivery_address}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                    className="ml-4"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order Details
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div><strong>Tracking ID:</strong> {selectedOrder.tracking_id}</div>
                <div><strong>Package:</strong> {selectedOrder.package_title}</div>
                {selectedOrder.package_description && (
                  <div><strong>Description:</strong> {selectedOrder.package_description}</div>
                )}
                <div><strong>Delivery Address:</strong> {selectedOrder.delivery_address}</div>
                <div><strong>Item Value:</strong> ¥{selectedOrder.item_value.toFixed(2)}</div>
                <div><strong>Base Cargo Cost:</strong> ¥{selectedOrder.base_cargo_cost?.toFixed(2) || '0.00'}</div>
                <div><strong>Insurance:</strong> {selectedOrder.wants_insurance ? `Yes - ¥${selectedOrder.insurance_cost?.toFixed(2) || '0.00'}` : "No"}</div>
                                 <div><strong>Status:</strong> <Badge className={getStatusColor(selectedOrder.status)}>{getStatusIcon(selectedOrder.status)} {selectedOrder.status.replace("_", " ").toUpperCase()}</Badge></div>
                <div><strong>Created:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</div>
                {selectedOrder.estimated_delivery && (
                  <div><strong>Estimated Delivery:</strong> {new Date(selectedOrder.estimated_delivery).toLocaleDateString()}</div>
                )}
                {selectedOrder.actual_delivery && (
                  <div><strong>Delivered:</strong> {new Date(selectedOrder.actual_delivery).toLocaleDateString()}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 