
import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export function LogoutButton({ className = "" }: { className?: string }) {
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Logout failed", description: error.message });
      return;
    }
    toast({ title: "Logged out", description: "See you soon!" });
    navigate("/auth");
  }

  return (
    <Button variant="destructive" className={`flex gap-1 ${className}`} onClick={handleLogout}>
      <LogOut size={20} />
      Log Out
    </Button>
  );
}
