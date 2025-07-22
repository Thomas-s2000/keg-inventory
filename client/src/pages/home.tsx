import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Beer, Plus, Minus, Trash2, Wifi, AlertTriangle } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import type { BeerType } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [newBeerName, setNewBeerName] = useState("");
  const [newBeerCount, setNewBeerCount] = useState("");
  const [adjustAmounts, setAdjustAmounts] = useState<Record<number, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; beerType?: BeerType }>({
    open: false,
  });

  // Fetch beer types
  const { data: beerTypes = [], isLoading } = useQuery<BeerType[]>({
    queryKey: ["/api/beer-types"],
  });

  // Create beer type mutation
  const createBeerTypeMutation = useMutation({
    mutationFn: async (data: { name: string; kegCount: number }) => {
      const response = await apiRequest("POST", "/api/beer-types", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/beer-types"] });
      setNewBeerName("");
      setNewBeerCount("");
      toast({
        title: "Success",
        description: "New beer type added to inventory!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add beer type",
        variant: "destructive",
      });
    },
  });

  // Delete beer type mutation
  const deleteBeerTypeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/beer-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/beer-types"] });
      toast({
        title: "Success",
        description: "Beer type deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete beer type",
        variant: "destructive",
      });
    },
  });

  // Add kegs mutation
  const addKegsMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: number; amount: number }) => {
      const response = await apiRequest("POST", `/api/beer-types/${id}/add-kegs`, { amount });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/beer-types"] });
      setAdjustAmounts({});
      toast({
        title: "Success",
        description: "Kegs added to inventory!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add kegs",
        variant: "destructive",
      });
    },
  });

  // Remove kegs mutation
  const removeKegsMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: number; amount: number }) => {
      const response = await apiRequest("POST", `/api/beer-types/${id}/remove-kegs`, { amount });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/beer-types"] });
      setAdjustAmounts({});
      toast({
        title: "Success",
        description: "Kegs removed from inventory!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove kegs",
        variant: "destructive",
      });
    },
  });

  const handleAddBeerType = () => {
    if (!newBeerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a beer type name",
        variant: "destructive",
      });
      return;
    }

    const kegCount = parseInt(newBeerCount) || 0;
    createBeerTypeMutation.mutate({ name: newBeerName.trim(), kegCount });
  };

  const handleDeleteBeerType = (beerType: BeerType) => {
    setDeleteConfirm({ open: true, beerType });
  };

  const confirmDelete = () => {
    if (deleteConfirm.beerType) {
      deleteBeerTypeMutation.mutate(deleteConfirm.beerType.id);
    }
    setDeleteConfirm({ open: false });
  };

  const handleAdjustKegs = (beerType: BeerType, operation: "add" | "remove") => {
    const amount = parseInt(adjustAmounts[beerType.id]) || 0;
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (operation === "add") {
      addKegsMutation.mutate({ id: beerType.id, amount });
    } else {
      removeKegsMutation.mutate({ id: beerType.id, amount });
    }
  };

  // Calculate summary stats
  const totalKegs = beerTypes.reduce((sum, beer) => sum + beer.kegCount, 0);
  const totalTypes = beerTypes.length;
  const lowStockTypes = beerTypes.filter(beer => beer.kegCount <= 20);
  const wellStockedTypes = beerTypes.filter(beer => beer.kegCount > 20);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Beer className="text-blue-600 h-8 w-8" />
              <h1 className="text-2xl font-bold text-gray-900">Keg Inventory Manager</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Wifi className="h-4 w-4 text-green-500" />
              <span>Connected to Local Network</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Add New Beer Type</h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  placeholder="Enter beer type name"
                  value={newBeerName}
                  onChange={(e) => setNewBeerName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Initial keg count"
                  value={newBeerCount}
                  onChange={(e) => setNewBeerCount(e.target.value)}
                  min="0"
                  className="w-full sm:w-32"
                />
                <Button
                  onClick={handleAddBeerType}
                  disabled={createBeerTypeMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Type
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Inventory Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Current Inventory</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </Card>
              ))}
            </div>
          ) : beerTypes.length === 0 ? (
            <Card className="p-12 text-center">
              <Beer className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Beer Types Yet</h3>
              <p className="text-gray-500">Add your first beer type to get started with inventory management.</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beerTypes.map((beerType) => (
                  <Card key={beerType.id} className="p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{beerType.name}</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{beerType.kegCount}</p>
                        <p className="text-sm text-gray-500">kegs in stock</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBeerType(beerType)}
                        className="text-gray-400 hover:text-red-600"
                        disabled={deleteBeerTypeMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm font-medium text-gray-700 w-16">Adjust:</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Amount"
                          value={adjustAmounts[beerType.id] || ""}
                          onChange={(e) =>
                            setAdjustAmounts(prev => ({
                              ...prev,
                              [beerType.id]: e.target.value
                            }))
                          }
                          className="flex-1 text-center"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleAdjustKegs(beerType, "add")}
                          disabled={addKegsMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                        <Button
                          onClick={() => handleAdjustKegs(beerType, "remove")}
                          disabled={removeKegsMutation.isPending}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-sm"
                        >
                          <Minus className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Low Stock Warning Card */}
                {lowStockTypes.length > 0 && (
                  <Card className="bg-yellow-50 border-2 border-yellow-200 p-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="text-yellow-600 h-6 w-6 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alert</h3>
                        <div className="mt-1">
                          {lowStockTypes.map((beer, index) => (
                            <p key={beer.id} className="text-yellow-700">
                              {beer.name} is running low ({beer.kegCount} kegs remaining)
                              {index < lowStockTypes.length - 1 && <br />}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm text-yellow-600 mt-2">Consider restocking soon to avoid shortages.</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Inventory Summary */}
              <Card className="p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{totalKegs}</p>
                    <p className="text-sm text-gray-500">Total Kegs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700">{totalTypes}</p>
                    <p className="text-sm text-gray-500">Beer Types</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{wellStockedTypes.length}</p>
                    <p className="text-sm text-gray-500">Well Stocked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">{lowStockTypes.length}</p>
                    <p className="text-sm text-gray-500">Low Stock</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open })}
        title="Confirm Deletion"
        description={
          deleteConfirm.beerType
            ? `Are you sure you want to delete ${deleteConfirm.beerType.name}? This action cannot be undone.`
            : ""
        }
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteBeerTypeMutation.isPending}
      />
    </div>
  );
}
