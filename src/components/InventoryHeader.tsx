
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Package, Sparkles } from "lucide-react";

interface InventoryHeaderProps {
  onAddAsset: () => void;
}

export function InventoryHeader({ onAddAsset }: InventoryHeaderProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-modern-blue/10 mb-6 transform transition-all duration-300 hover:scale-102 hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-modern-yellow/20 rounded-xl transform transition-transform duration-300 hover:rotate-12">
            <Package className="text-modern-blue" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-modern-blue-dark flex items-center gap-2">
              Asset Management
              <Sparkles className="text-modern-yellow" size={20} />
            </h2>
            <p className="text-modern-blue/70">Manage your inventory assets with ease</p>
          </div>
        </div>
        <Button
          onClick={onAddAsset}
          className="bg-gradient-to-r from-modern-yellow to-modern-yellow-accent text-modern-blue-dark hover:from-modern-yellow-accent hover:to-modern-yellow font-bold px-8 py-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl hover:-translate-y-1 border-2 border-modern-blue/20"
        >
          <div className="flex items-center gap-3">
            <div className="p-1 bg-modern-blue/10 rounded-lg">
              <Plus size={20} />
            </div>
            <span className="text-lg">Add New Asset</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
