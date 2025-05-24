
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogoutButton } from "@/components/ui/logout-button";
import DashboardChart from "@/components/DashboardChart";
import { BarChart3, TrendingUp, Package, MapPin } from "lucide-react";

interface InventoryStats {
  total: number;
  byCondition: { [key: string]: number };
  byCity: { [key: string]: number };
}

export default function Analytics() {
  const [stats, setStats] = useState<InventoryStats>({
    total: 0,
    byCondition: {},
    byCity: {}
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/auth");
    });

    // Load initial data
    loadStats();

    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_assets'
        },
        () => {
          console.log('Inventory data changed, reloading stats...');
          loadStats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_assets')
        .select('kondisi, kota');
      
      if (error) throw error;

      const total = data?.length || 0;
      const byCondition: { [key: string]: number } = {};
      const byCity: { [key: string]: number } = {};

      data?.forEach(item => {
        // Count by condition
        byCondition[item.kondisi] = (byCondition[item.kondisi] || 0) + 1;
        
        // Count by city
        if (item.kota) {
          byCity[item.kota] = (byCity[item.kota] || 0) + 1;
        }
      });

      setStats({ total, byCondition, byCity });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-modern-yellow via-white to-modern-blue/70">
      <header className="bg-modern-blue-dark text-modern-yellow p-7 pb-8 flex items-center justify-between shadow-xl rounded-b-3xl">
        <div className="flex items-center gap-7">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow flex items-center gap-3">
            <BarChart3 size={40} />
            Analytics Dashboard
          </h1>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-modern-yellow hover:underline hover:text-modern-yellow-accent font-bold text-lg transition">
              Main Dashboard
            </Link>
            <Link to="/inventory" className="text-modern-yellow hover:underline hover:text-modern-yellow-accent font-bold text-lg transition">
              Inventory
            </Link>
          </div>
        </div>
        <LogoutButton />
      </header>

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Assets Card */}
          <div className="bg-white/90 rounded-xl p-6 shadow-lg border-2 border-modern-blue/20">
            <div className="flex items-center gap-3 mb-2">
              <Package className="text-modern-blue" size={24} />
              <h3 className="text-lg font-bold text-modern-blue-dark">Total Assets</h3>
            </div>
            <p className="text-3xl font-extrabold text-modern-blue">{stats.total}</p>
          </div>

          {/* Condition Breakdown */}
          <div className="bg-white/90 rounded-xl p-6 shadow-lg border-2 border-modern-blue/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-modern-blue" size={24} />
              <h3 className="text-lg font-bold text-modern-blue-dark">By Condition</h3>
            </div>
            <div className="space-y-1">
              {Object.entries(stats.byCondition).map(([condition, count]) => (
                <div key={condition} className="flex justify-between text-sm">
                  <span className="text-modern-blue-dark">{condition}:</span>
                  <span className="font-semibold text-modern-blue">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* City Breakdown */}
          <div className="bg-white/90 rounded-xl p-6 shadow-lg border-2 border-modern-blue/20">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="text-modern-blue" size={24} />
              <h3 className="text-lg font-bold text-modern-blue-dark">By City</h3>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {Object.entries(stats.byCity).map(([city, count]) => (
                <div key={city} className="flex justify-between text-sm">
                  <span className="text-modern-blue-dark">{city}:</span>
                  <span className="font-semibold text-modern-blue">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/90 rounded-xl p-6 shadow-lg border-2 border-modern-blue/20">
          <h2 className="text-2xl font-bold mb-4 text-modern-blue-dark">Inventory Trends</h2>
          <DashboardChart />
        </div>
      </main>
    </div>
  );
}
