
import React, { useState, useEffect } from "react";
import { InventoryTable } from "@/components/InventoryTable";
import { InventoryForm } from "@/components/InventoryForm";
import { InventoryNavbar } from "@/components/InventoryNavbar";
import { InventoryHeader } from "@/components/InventoryHeader";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function InventoryPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-modern-yellow/10 via-white to-modern-blue/10">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 bg-modern-yellow rounded-full animate-bounce"></div>
          <div className="w-8 h-8 bg-modern-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-8 h-8 bg-modern-yellow-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-modern-yellow/10 via-white to-modern-blue/10">
      <InventoryNavbar />
      <main className="flex-1 p-8 max-w-7xl w-full mx-auto animate-fade-in">
        <InventoryHeader onAddAsset={() => setAddOpen(true)} />
        <div className="transform transition-all duration-300">
          <InventoryTable />
        </div>
      </main>
      {/* Add Asset Modal */}
      <InventoryForm open={addOpen} setOpen={setAddOpen} mode="add" />
    </div>
  );
}
