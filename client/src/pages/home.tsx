import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Beer, Plus, Minus, Trash2, AlertTriangle, BarChart3 } from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import type { BeerType } from "@shared/schema";

// Helper function to get beer color class
const getBeerColorClass = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('blonde') || lowerName.includes('blond')) return 'beer-blonde';
  if (lowerName.includes('amber') || lowerName.includes('ambrée')) return 'beer-amber';
  if (lowerName.includes('ipa')) return 'beer-ipa';
  if (lowerName.includes('triple')) return 'beer-triple';
  if (lowerName.includes('white') || lowerName.includes('blanche')) return 'beer-white';
  if (lowerName.includes('brown') || lowerName.includes('brune')) return 'beer-brown';
  if (lowerName.includes('citrus') || lowerName.includes('citron')) return 'beer-citrus';
  if (lowerName.includes('spring') || lowerName.includes('printemps')) return 'beer-spring';
  return 'beer-default';
};

// Helper function to get keg count color class
const getKegCountClass = (count: number) => {
  if (count === 0) return 'keg-count-zero';
  if (count <= 20) return 'keg-count-low';
  if (count <= 50) return 'keg-count-medium';
  return 'keg-count-high';
};

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
    <div className="min-h-screen bg-background">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Compact Add Beer Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Input
              placeholder="Nom de la bière..."
              value={newBeerName}
              onChange={(e) => setNewBeerName(e.target.value)}
              className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground h-12"
            />
            <Input
              type="number"
              placeholder="Fûts"
              value={newBeerCount}
              onChange={(e) => setNewBeerCount(e.target.value)}
              min="0"
              className="w-full sm:w-24 bg-input border-border text-foreground placeholder:text-muted-foreground h-12"
            />
            <Button
              onClick={handleAddBeerType}
              disabled={createBeerTypeMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Beer Inventory Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse bg-card border-border">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </Card>
              ))}
            </div>
          ) : beerTypes.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <Beer className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Aucun type de bière</h3>
              <p className="text-muted-foreground">Ajoutez votre premier type de bière pour commencer la gestion d'inventaire.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {beerTypes.map((beerType) => (
                <Card 
                  key={beerType.id} 
                  className={`p-6 bg-card border-l-4 transition-all duration-200 hover:scale-105 ${getBeerColorClass(beerType.name)}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <Beer className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">{beerType.name}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBeerType(beerType)}
                      className="text-muted-foreground hover:text-red-400 h-8 w-8 p-0"
                      disabled={deleteBeerTypeMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-center mb-6">
                    <p className={`text-6xl font-bold ${getKegCountClass(beerType.kegCount)}`}>
                      {beerType.kegCount}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Fûts disponibles</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleAdjustKegs(beerType, "remove")}
                        disabled={removeKegsMutation.isPending}
                        size="sm"
                        className="h-10 w-10 p-0 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/30"
                      >
                        <Minus className="h-4 w-4 text-red-400" />
                      </Button>
                      
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={adjustAmounts[beerType.id] || ""}
                        onChange={(e) =>
                          setAdjustAmounts(prev => ({
                            ...prev,
                            [beerType.id]: e.target.value
                          }))
                        }
                        className="flex-1 text-center bg-input border-border text-foreground"
                      />
                      
                      <Button
                        onClick={() => handleAdjustKegs(beerType, "add")}
                        disabled={addKegsMutation.isPending}
                        size="sm"
                        className="h-10 w-10 p-0 rounded-full bg-green-600/20 hover:bg-green-600/30 border border-green-600/30"
                      >
                        <Plus className="h-4 w-4 text-green-400" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      Dernière mis à jour: 1 hour
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Compact Summary */}
        <div className="mt-8">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Fûts</p>
                <p className="text-2xl font-bold text-cyan-400">{totalKegs}</p>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Types</p>
                <p className="text-2xl font-bold text-foreground">{totalTypes}</p>
              </div>
            </div>
          </Card>
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
