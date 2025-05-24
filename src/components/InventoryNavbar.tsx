
import React from "react";
import { Link } from "react-router-dom";
import { LogoutButton } from "@/components/ui/logout-button";
import { Home, Package } from "lucide-react";

export function InventoryNavbar() {
  return (
    <header className="bg-gradient-to-r from-modern-blue-dark to-modern-blue text-modern-yellow p-7 pb-8 shadow-2xl rounded-b-3xl transform transition-all duration-300 hover:shadow-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-3 transform transition-transform duration-300 hover:scale-105">
            <div className="p-2 bg-modern-yellow/20 rounded-xl">
              <Package size={40} className="text-modern-yellow" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow">
              Inventory Management
            </h1>
          </div>
          <nav className="flex gap-4">
            <Link 
              to="/dashboard" 
              className="text-modern-yellow/80 hover:text-modern-yellow hover:underline font-bold text-lg transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-modern-yellow/10 transform hover:scale-105"
            >
              <Home size={20} />
              Dashboard
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
