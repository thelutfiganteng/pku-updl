
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogoutButton } from "@/components/ui/logout-button";
import { DashboardStats } from "@/components/DashboardStats";
import { ConditionPieChart } from "@/components/ConditionPieChart";
import { Home, Package, TrendingUp, BarChart3 } from "lucide-react";

interface InventoryStats {
  total: number;
  byCondition: { [key: string]: number };
  byCity: { [key: string]: number };
  byLocation: { [key: string]: number };
}

export default function Dashboard() {
  const [stats, setStats] = useState<InventoryStats>({
    total: 0,
    byCondition: {},
    byCity: {},
    byLocation: {}
  });
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
        .select('kondisi, kota, keterangan_lokasi');
      
      if (error) throw error;

      const total = data?.length || 0;
      const byCondition: { [key: string]: number } = {};
      const byCity: { [key: string]: number } = {};
      const byLocation: { [key: string]: number } = {};

      data?.forEach(item => {
        // Count by condition
        byCondition[item.kondisi] = (byCondition[item.kondisi] || 0) + 1;
        
        // Count by city
        if (item.kota) {
          byCity[item.kota] = (byCity[item.kota] || 0) + 1;
        }

        // Count by location description
        if (item.keterangan_lokasi) {
          byLocation[item.keterangan_lokasi] = (byLocation[item.keterangan_lokasi] || 0) + 1;
        }
      });

      setStats({ total, byCondition, byCity, byLocation });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-modern-yellow via-white to-modern-blue/80">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 bg-modern-yellow rounded-full animate-bounce"></div>
          <div className="w-8 h-8 bg-modern-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-8 h-8 bg-modern-yellow-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  const conditionChartData = Object.entries(stats.byCondition).map(([name, value]) => ({
    name,
    value
  }));

  const cityChartData = Object.entries(stats.byCity).map(([name, value]) => ({
    name,
    value
  }));

  const locationChartData = Object.entries(stats.byLocation).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-modern-yellow/10 via-white to-modern-blue/10">
      <header className="bg-gradient-to-r from-modern-blue-dark to-modern-blue text-modern-yellow p-7 pb-8 shadow-2xl rounded-b-3xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-7">
            <div className="flex items-center gap-3 transform transition-transform duration-300 hover:scale-105">
              <div className="p-2 bg-modern-yellow/20 rounded-xl">
                <Home size={40} className="text-modern-yellow" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight drop-shadow">
                InventoryHub Dashboard
              </h1>
            </div>
            <nav className="flex gap-4">
              <Link 
                to="/inventory" 
                className="text-modern-yellow/80 hover:text-modern-yellow hover:underline font-bold text-lg transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-modern-yellow/10 transform hover:scale-105"
              >
                <Package size={20} />
                Inventory
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8 animate-fade-in">
        <div className="mb-8 transform transition-all duration-500 hover:scale-102">
          <h2 className="text-3xl font-extrabold mb-2 text-modern-blue drop-shadow flex items-center gap-3">
            <TrendingUp className="text-modern-yellow" size={32} />
            Welcome to InventoryHub
          </h2>
          <p className="text-lg font-semibold text-modern-blue-dark/70 mb-8">
            Real-time overview of your inventory management system
          </p>
        </div>

        <DashboardStats stats={stats} />

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-modern-blue-dark flex items-center gap-3">
            <BarChart3 className="text-modern-yellow" size={28} />
            Analytics Overview
          </h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Condition Distribution Chart */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-modern-blue/10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
              <h3 className="text-xl font-bold mb-4 text-modern-blue-dark flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Asset Condition Distribution
              </h3>
              {conditionChartData.length > 0 ? (
                <ConditionPieChart data={conditionChartData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-modern-blue-dark/50">
                  No data available
                </div>
              )}
            </div>

            {/* City Distribution Chart */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-modern-blue/10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
              <h3 className="text-xl font-bold mb-4 text-modern-blue-dark flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Assets by City
              </h3>
              {cityChartData.length > 0 ? (
                <ConditionPieChart data={cityChartData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-modern-blue-dark/50">
                  No data available
                </div>
              )}
            </div>

            {/* Location Distribution Chart */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-modern-blue/10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
              <h3 className="text-xl font-bold mb-4 text-modern-blue-dark flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                Assets by Location
              </h3>
              {locationChartData.length > 0 ? (
                <ConditionPieChart data={locationChartData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-modern-blue-dark/50">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-modern-blue/10 transform transition-all duration-300 hover:scale-102 hover:shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-modern-blue-dark">Quick Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link 
              to="/inventory" 
              className="group bg-gradient-to-r from-modern-yellow/90 to-modern-yellow-accent/80 hover:from-modern-yellow hover:to-modern-yellow-accent text-modern-blue-dark py-6 px-6 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-modern-blue/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-modern-blue/10 rounded-xl group-hover:bg-modern-blue/20 transition-colors duration-300">
                  <Package size={28} />
                </div>
                <div>
                  <div className="text-xl">Manage Inventory</div>
                  <div className="text-sm font-normal opacity-75">Add, edit, or view assets</div>
                </div>
              </div>
            </Link>
            
            <div className="group bg-gradient-to-r from-modern-blue/90 to-modern-blue-dark/80 hover:from-modern-blue hover:to-modern-blue-dark text-modern-yellow py-6 px-6 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-modern-yellow/20 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-modern-yellow/10 rounded-xl group-hover:bg-modern-yellow/20 transition-colors duration-300">
                  <BarChart3 size={28} />
                </div>
                <div>
                  <div className="text-xl">View Analytics</div>
                  <div className="text-sm font-normal opacity-75">Real-time data insights</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
