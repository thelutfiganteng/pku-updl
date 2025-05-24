
import React from "react";
import { Package, TrendingUp, MapPin, AlertCircle } from "lucide-react";

interface InventoryStats {
  total: number;
  byCondition: { [key: string]: number };
  byCity: { [key: string]: number };
}

interface DashboardStatsProps {
  stats: InventoryStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const topCity = Object.entries(stats.byCity).sort(([,a], [,b]) => b - a)[0];
  const topCondition = Object.entries(stats.byCondition).sort(([,a], [,b]) => b - a)[0];
  const totalCities = Object.keys(stats.byCity).length;
  const conditionTypes = Object.keys(stats.byCondition).length;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Assets Card */}
      <div className="bg-gradient-to-br from-modern-yellow to-modern-yellow-accent rounded-xl p-6 shadow-lg border-2 border-modern-blue/10">
        <div className="flex items-center gap-3 mb-2">
          <Package className="text-modern-blue-dark" size={28} />
          <h3 className="text-lg font-bold text-modern-blue-dark">Total Assets</h3>
        </div>
        <p className="text-3xl font-extrabold text-modern-blue-dark">{stats.total}</p>
        <p className="text-sm text-modern-blue-dark/70 mt-1">Assets in inventory</p>
      </div>

      {/* Top Location Card */}
      <div className="bg-gradient-to-br from-modern-blue to-modern-blue-dark rounded-xl p-6 shadow-lg border-2 border-modern-yellow/20">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="text-modern-yellow" size={28} />
          <h3 className="text-lg font-bold text-modern-yellow">Top Location</h3>
        </div>
        <p className="text-2xl font-extrabold text-modern-yellow">
          {topCity ? topCity[0] : 'N/A'}
        </p>
        <p className="text-sm text-modern-yellow/80 mt-1">
          {topCity ? `${topCity[1]} assets` : 'No data'} • {totalCities} cities total
        </p>
      </div>

      {/* Most Common Condition */}
      <div className="bg-white/90 rounded-xl p-6 shadow-lg border-2 border-modern-blue/20">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="text-modern-blue" size={28} />
          <h3 className="text-lg font-bold text-modern-blue-dark">Top Condition</h3>
        </div>
        <p className="text-2xl font-extrabold text-modern-blue">
          {topCondition ? topCondition[0] : 'N/A'}
        </p>
        <p className="text-sm text-modern-blue/70 mt-1">
          {topCondition ? `${topCondition[1]} assets` : 'No data'} • {conditionTypes} types
        </p>
      </div>

      {/* Condition Variety */}
      <div className="bg-white/90 rounded-xl p-6 shadow-lg border-2 border-modern-blue/20">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="text-modern-blue" size={28} />
          <h3 className="text-lg font-bold text-modern-blue-dark">Asset Health</h3>
        </div>
        <p className="text-2xl font-extrabold text-modern-blue">{conditionTypes}</p>
        <p className="text-sm text-modern-blue/70 mt-1">Different conditions tracked</p>
      </div>
    </div>
  );
}
