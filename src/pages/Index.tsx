
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, ArrowRight, BarChart3, Package, Shield } from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-modern-yellow/20 via-modern-yellow-accent/10 to-modern-blue/20">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 bg-modern-yellow rounded-full animate-bounce"></div>
          <div className="w-8 h-8 bg-modern-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-8 h-8 bg-modern-yellow-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-modern-yellow/20 via-modern-yellow-accent/10 to-modern-blue/20 p-4">
      <div className="bg-white/95 backdrop-blur-sm border rounded-3xl p-10 shadow-2xl max-w-4xl w-full text-center transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
        <div className="mb-8 transform transition-all duration-300 hover:scale-105">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-modern-yellow to-modern-yellow-accent rounded-full mb-6 shadow-xl transform transition-transform duration-300 hover:rotate-12">
            <Package className="text-modern-blue-dark" size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-modern-blue drop-shadow-lg bg-gradient-to-r from-modern-blue to-modern-blue-dark bg-clip-text text-transparent">
            BAGIAN PKU
          </h1>
          <p className="text-lg md:text-2xl text-modern-blue-dark/70 font-medium mb-8 max-w-2xl mx-auto">
            Manajemen Inventaris Bagian PKU.
          </p>
        </div>

        {/* Features Grid */}
        {/* <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-modern-yellow/10 p-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <BarChart3 className="text-modern-blue mx-auto mb-4" size={32} />
            <h3 className="font-bold text-modern-blue-dark mb-2">Real-time Analytics</h3>
            <p className="text-modern-blue/70 text-sm">Track your inventory with live data visualization</p>
          </div>
          <div className="bg-modern-blue/10 p-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <Package className="text-modern-yellow mx-auto mb-4" size={32} />
            <h3 className="font-bold text-modern-blue-dark mb-2">Asset Management</h3>
            <p className="text-modern-blue/70 text-sm">Comprehensive inventory control system</p>
          </div>
          <div className="bg-modern-yellow-accent/10 p-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <Shield className="text-modern-blue-dark mx-auto mb-4" size={32} />
            <h3 className="font-bold text-modern-blue-dark mb-2">Secure Access</h3>
            <p className="text-modern-blue/70 text-sm">Protected authentication and data security</p>
          </div>
        </div> */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <>
              <a
                href="/dashboard"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-modern-blue to-modern-blue-dark text-modern-yellow shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <BarChart3 size={24} />
                <span className="text-lg">Go to Dashboard</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <a
                href="/inventory"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-modern-yellow to-modern-yellow-accent text-modern-blue-dark shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <Package size={24} />
                <span className="text-lg">Manage Inventory</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </>
          ) : (
            <a
              href="/auth"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-modern-blue to-modern-blue-dark text-modern-yellow shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-1"
            >
              <User size={24} />
              <span className="text-lg">Login to Get Started</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          )}
        </div>

        {!isAuthenticated && (
          <p className="mt-6 text-modern-blue/60 text-sm">
            New user? Create your account to start managing your assets
          </p>
        )}
      </div>
    </div>
  );
};

export default Index;
