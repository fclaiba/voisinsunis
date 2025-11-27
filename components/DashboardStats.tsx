import { Users, UserCheck, AlertTriangle, TrendingUp } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { Family } from "../types/family";

interface DashboardStatsProps {
  families: Family[];
}

export function DashboardStats({ families }: DashboardStatsProps) {
  const totalFamilies = families.length;
  const familiesWithJobs = families.filter(f => f.trabaja).length;
  const familiesWithDisability = families.filter(f => f.discapacidad).length;
  const totalChildren = families.reduce((sum, f) => sum + f.hijos, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <StatsCard
        title="Total de Familias Registradas"
        value={totalFamilies}
        change="+12% vs mes anterior"
        changeType="positive"
        icon={Users}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-50"
      />
      <StatsCard
        title="Familias con Empleo"
        value={familiesWithJobs}
        change={`${Math.round((familiesWithJobs / totalFamilies) * 100)}% del total`}
        changeType="neutral"
        icon={UserCheck}
        iconColor="text-green-600"
        iconBgColor="bg-green-50"
      />
      <StatsCard
        title="Casos con Discapacidad"
        value={familiesWithDisability}
        change="Requieren seguimiento"
        changeType="neutral"
        icon={AlertTriangle}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-50"
      />
      <StatsCard
        title="Niños Totales"
        value={totalChildren}
        change={`Promedio ${(totalChildren / totalFamilies).toFixed(1)} por familia`}
        changeType="neutral"
        icon={TrendingUp}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-50"
      />
    </div>
  );
}
