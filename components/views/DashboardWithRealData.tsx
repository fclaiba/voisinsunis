import { TrendingUp, TrendingDown, Users, UserCheck, AlertTriangle, Baby, Briefcase, Heart, MapPin, Calendar, GraduationCap, Wrench } from "lucide-react";
import { Card } from "../ui/card";
import { Family } from "../../types/family";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

interface DashboardProps {
  families: Family[];
  totalFamilies: number;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export function Dashboard({ families, totalFamilies, hasActiveFilters, activeFilterCount }: DashboardProps) {
  // Métricas principales (DATOS REALES)
  const filteredFamiliesCount = families.length;
  const familiesWithJobs = families.filter(f => f.trabaja).length;
  const familiesWithDisability = families.filter(f => f.discapacidad).length;
  const totalChildren = families.reduce((sum, f) => sum + f.hijos, 0);
  const familiesWithChildren = families.filter(f => f.hijos > 0).length;
  const averageChildren =
    filteredFamiliesCount > 0 && familiesWithChildren > 0
      ? (totalChildren / familiesWithChildren).toFixed(1)
      : "0";
  const employmentRate =
    filteredFamiliesCount > 0 ? ((familiesWithJobs / filteredFamiliesCount) * 100).toFixed(1) : "0";
  const studentsCount = families.filter(
    (family) => family.estudios.universitario === "cursando",
  ).length;

  // Datos REALES para gráfico de programas sociales
  const programsDataReal = [
    { name: "AUH", value: families.filter(f => f.programasSociales.includes("AUH")).length, color: "#3B82F6" },
    { name: "Tarjeta Alimentar", value: families.filter(f => f.programasSociales.includes("Tarjeta Alimentar")).length, color: "#10B981" },
    { name: "Potenciar Trabajo", value: families.filter(f => f.programasSociales.includes("Potenciar Trabajo")).length, color: "#F59E0B" },
    { name: "Progresar", value: families.filter(f => f.programasSociales.includes("Progresar")).length, color: "#8B5CF6" },
    { name: "Pensión", value: families.filter(f => f.programasSociales.includes("Pensión no contributiva")).length, color: "#EC4899" },
    { name: "Sin programas", value: families.filter(f => f.programasSociales.length === 0).length, color: "#6B7280" },
  ].filter(p => p.value > 0); // Solo mostrar los que tienen datos

  // Distribución REAL de hijos
  const childrenDistributionReal = [
    { range: "Sin hijos", count: families.filter(f => f.hijos === 0).length },
    { range: "1 hijo", count: families.filter(f => f.hijos === 1).length },
    { range: "2 hijos", count: families.filter(f => f.hijos === 2).length },
    { range: "3 hijos", count: families.filter(f => f.hijos === 3).length },
    { range: "4+ hijos", count: families.filter(f => f.hijos >= 4).length },
  ];

  // Situación laboral REAL
  const employmentDataReal = [
    { category: "Trabaja", value: familiesWithJobs, color: "#10B981" },
    { category: "No trabaja", value: filteredFamiliesCount - familiesWithJobs, color: "#EF4444" },
  ];

  // Oficios REALES más comunes
  const oficiosData = families
    .filter(f => f.oficio && f.oficio.trim() !== "")
    .reduce((acc, f) => {
      const oficio = f.oficio!;
      acc[oficio] = (acc[oficio] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const oficiosChartData = Object.entries(oficiosData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([oficio, count]) => ({ oficio, count }));

  // Distribución geográfica REAL
  const areasData = families.reduce((acc, f) => {
    const area = f.barrio || "Sin especificar";
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topAreas = Object.entries(areasData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([area, count]) => ({
      zona: area,
      familias: count,
      porcentaje: filteredFamiliesCount > 0 ? Math.round((count / filteredFamiliesCount) * 100) : 0
    }));

  // Datos de estudios REALES
  const estudiosData = [
    { nivel: "Primaria completa", count: families.filter(f => f.estudios.primaria === "completo").length },
    { nivel: "Secundaria completa", count: families.filter(f => f.estudios.secundaria === "completo").length },
    { nivel: "Universitario completo", count: families.filter(f => f.estudios.universitario === "completo").length },
    { nivel: "Universitario cursando", count: families.filter(f => f.estudios.universitario === "cursando").length },
  ].filter(e => e.count > 0);

  return (
    <div className="space-y-4 md:space-y-6">
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        <div>
          {hasActiveFilters ? (
            <>
              Mostrando{" "}
              <span className="font-semibold text-foreground">{filteredFamiliesCount}</span> de{" "}
              <span className="font-semibold text-foreground">{totalFamilies}</span> familias registradas.
            </>
          ) : (
            <>
              Universo completo de{" "}
              <span className="font-semibold text-foreground">{totalFamilies}</span> familias registradas.
            </>
          )}
        </div>
        {hasActiveFilters && (
          <div className="text-xs text-muted-foreground">
            {activeFilterCount} filtros activos aplicados al conjunto de datos.
          </div>
        )}
      </div>
    </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div>
            <p className="text-blue-100 text-xs md:text-sm mb-1">
              {hasActiveFilters ? "Familias filtradas" : "Total de Familias"}
            </p>
            <h2 className="text-white mb-2 text-2xl md:text-3xl">{filteredFamiliesCount}</h2>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <Users className="size-3 md:size-4" />
              {hasActiveFilters ? (
                <span>de {totalFamilies} registradas</span>
              ) : (
                <span>Registradas</span>
              )}
              </div>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Users className="size-6 md:size-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div>
              <p className="text-green-100 text-xs md:text-sm mb-1">Familias con Empleo</p>
              <h2 className="text-white mb-2 text-2xl md:text-3xl">{familiesWithJobs}</h2>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span>{employmentRate}% del total</span>
              </div>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Briefcase className="size-6 md:size-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div>
              <p className="text-orange-100 text-xs md:text-sm mb-1">Casos Discapacidad</p>
              <h2 className="text-white mb-2 text-2xl md:text-3xl">{familiesWithDisability}</h2>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <AlertTriangle className="size-3 md:size-4" />
                <span>Seguimiento activo</span>
              </div>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Heart className="size-6 md:size-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div>
              <p className="text-purple-100 text-xs md:text-sm mb-1">Total Niños</p>
              <h2 className="text-white mb-2 text-2xl md:text-3xl">{totalChildren}</h2>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <Baby className="size-3 md:size-4" />
                <span>{averageChildren} promedio</span>
              </div>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Baby className="size-6 md:size-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200 dark:bg-gradient-to-br dark:from-cyan-900/60 dark:to-blue-950 dark:border-blue-700/40">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="size-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">Estudian Universidad</p>
              <h3 className="text-gray-900 dark:text-white mb-1">{studentsCount} familias</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {filteredFamiliesCount > 0 ? ((studentsCount / filteredFamiliesCount) * 100).toFixed(1) : "0"}%{" "}
                {hasActiveFilters ? "sobre el universo filtrado" : "del total"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200 dark:bg-gradient-to-br dark:from-amber-900/60 dark:to-orange-950 dark:border-orange-800/40">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <Wrench className="size-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">Con Oficio Definido</p>
              <h3 className="text-gray-900 dark:text-white mb-1">
                {oficiosChartData.reduce((sum, o) => sum + o.count, 0)} familias
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Trabajadores con oficio registrado</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Programas Sociales REALES */}
        <Card className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Programas Sociales (Datos Reales)</h3>
            <p className="text-xs md:text-sm text-gray-500">Distribución actual por tipo de programa</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={programsDataReal}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {programsDataReal.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Oficios REALES */}
        {oficiosChartData.length > 0 && (
          <Card className="p-4 md:p-6">
            <div className="mb-4 md:mb-6">
              <h3 className="text-gray-900 mb-1 text-base md:text-lg">Oficios Más Comunes</h3>
              <p className="text-xs md:text-sm text-gray-500">Top {oficiosChartData.length} oficios registrados</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={oficiosChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="oficio" stroke="#6B7280" fontSize={12} angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Distribución de Hijos REAL */}
        <Card className="p-4 md:p-6 lg:col-span-2">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Distribución por Cantidad de Hijos (Real)</h3>
            <p className="text-xs md:text-sm text-gray-500">Composición familiar del territorio</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={childrenDistributionReal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Situación Laboral REAL */}
        <Card className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Situación Laboral</h3>
            <p className="text-xs md:text-sm text-gray-500">Estado de empleo real</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employmentDataReal}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ value }) => value}
              >
                {employmentDataReal.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Distribución Geográfica REAL */}
      {topAreas.length > 0 && (
        <Card className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Distribución Geográfica Real</h3>
            <p className="text-xs md:text-sm text-gray-500">Top {topAreas.length} áreas con más familias</p>
          </div>
          <div className="space-y-4">
            {topAreas.map((zona, idx) => {
              const colors = ["blue", "green", "purple", "orange", "pink"];
              const color = colors[idx % colors.length];
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className={`size-5 text-${color}-600`} />
                      <span className="text-sm font-medium text-gray-900">{zona.zona}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{zona.familias} familias</span>
                      <span className="text-sm font-semibold text-gray-900">{zona.porcentaje}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600`}
                      style={{ width: `${zona.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Datos de Estudios */}
      {estudiosData.length > 0 && (
        <Card className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Nivel de Estudios</h3>
            <p className="text-xs md:text-sm text-gray-500">Distribución por nivel de estudios completados</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estudiosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="nivel" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}