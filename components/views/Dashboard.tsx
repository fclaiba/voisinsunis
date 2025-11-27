import { TrendingUp, TrendingDown, Users, UserCheck, AlertTriangle, Baby, Briefcase, Heart, MapPin, Calendar } from "lucide-react";
import { Card } from "../ui/card";
import { Family } from "../../types/family";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

interface DashboardProps {
  families: Family[];
}

export function Dashboard({ families }: DashboardProps) {
  // Métricas principales
  const totalFamilies = families.length;
  const familiesWithJobs = families.filter(f => f.trabaja).length;
  const familiesWithDisability = families.filter(f => f.discapacidad).length;
  const totalChildren = families.reduce((sum, f) => sum + f.hijos, 0);
  const averageChildren = (totalChildren / totalFamilies).toFixed(1);
  const employmentRate = ((familiesWithJobs / totalFamilies) * 100).toFixed(1);

  // Datos para gráficos
  const programsData = [
    { name: "AUH", value: families.filter(f => f.programasSociales.includes("AUH")).length, color: "#3B82F6" },
    { name: "Tarjeta Alimentar", value: families.filter(f => f.programasSociales.includes("Tarjeta Alimentar")).length, color: "#10B981" },
    { name: "Potenciar Trabajo", value: families.filter(f => f.programasSociales.includes("Potenciar Trabajo")).length, color: "#F59E0B" },
    { name: "Progresar", value: families.filter(f => f.programasSociales.includes("Progresar")).length, color: "#8B5CF6" },
    { name: "Pensión", value: families.filter(f => f.programasSociales.includes("Pensión no contributiva")).length, color: "#EC4899" },
    { name: "Ninguno", value: families.filter(f => f.programasSociales.length === 0).length, color: "#6B7280" },
  ];

  const childrenDistribution = [
    { range: "0 hijos", count: families.filter(f => f.hijos === 0).length },
    { range: "1 hijo", count: families.filter(f => f.hijos === 1).length },
    { range: "2 hijos", count: families.filter(f => f.hijos === 2).length },
    { range: "3 hijos", count: families.filter(f => f.hijos === 3).length },
    { range: "4+ hijos", count: families.filter(f => f.hijos >= 4).length },
  ];

  const monthlyTrend = [
    { month: "Ene", familias: 420, nuevas: 35 },
    { month: "Feb", familias: 438, nuevas: 18 },
    { month: "Mar", familias: 455, nuevas: 17 },
    { month: "Abr", familias: 467, nuevas: 12 },
    { month: "May", familias: 478, nuevas: 11 },
    { month: "Jun", familias: totalFamilies, nuevas: 9 },
  ];

  const employmentData = [
    { category: "Trabaja", value: familiesWithJobs, color: "#10B981" },
    { category: "No trabaja", value: totalFamilies - familiesWithJobs, color: "#EF4444" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div>
              <p className="text-blue-100 text-xs md:text-sm mb-1">Total de Familias</p>
              <h2 className="text-white mb-2 text-2xl md:text-3xl">{totalFamilies}</h2>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <TrendingUp className="size-3 md:size-4" />
                <span>+12% este mes</span>
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Tendencia Mensual */}
        <Card className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Crecimiento de Registros</h3>
            <p className="text-xs md:text-sm text-gray-500">Evolución mensual de familias registradas</p>
          </div>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="colorFamilias" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="familias" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorFamilias)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Programas Sociales */}
        <Card className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Programas Sociales</h3>
            <p className="text-xs md:text-sm text-gray-500">Distribución por tipo de programa</p>
          </div>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <PieChart>
              <Pie
                data={programsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {programsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Distribución de Hijos */}
        <Card className="p-4 md:p-6 lg:col-span-2">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Distribución por Cantidad de Hijos</h3>
            <p className="text-xs md:text-sm text-gray-500">Composición familiar del territorio</p>
          </div>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <BarChart data={childrenDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="range" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Situación Laboral */}
        <Card className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Situación Laboral</h3>
            <p className="text-xs md:text-sm text-gray-500">Estado de empleo</p>
          </div>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <PieChart>
              <Pie
                data={employmentData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {employmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Activity */}
        <Card className="p-4 md:p-6 lg:col-span-2">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Actividad Reciente</h3>
            <p className="text-xs md:text-sm text-gray-500">Últimas acciones en el sistema</p>
          </div>
          <div className="space-y-3 md:space-y-4">
            {[
              { action: "Nuevo registro", family: "Laura Sánchez", time: "Hace 5 minutos", icon: Users, color: "blue" },
              { action: "Actualización", family: "Carlos Rodríguez", time: "Hace 12 minutos", icon: UserCheck, color: "green" },
              { action: "Visita programada", family: "María González", time: "Hace 1 hora", icon: Calendar, color: "purple" },
              { action: "Caso urgente", family: "Roberto Fernández", time: "Hace 2 horas", icon: AlertTriangle, color: "orange" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 md:w-10 md:h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon className={`size-4 md:size-5 text-${item.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{item.action}</p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">{item.family}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h3 className="text-gray-900 mb-1 text-base md:text-lg">Estadísticas Rápidas</h3>
            <p className="text-xs md:text-sm text-gray-500">Resumen del día</p>
          </div>
          <div className="space-y-4 md:space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-gray-600">Visitas hoy</span>
                <span className="text-xs md:text-sm font-semibold text-gray-900">8/12</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '66%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-gray-600">Casos urgentes</span>
                <span className="text-xs md:text-sm font-semibold text-gray-900">3/5</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-gray-600">Seguimientos</span>
                <span className="text-xs md:text-sm font-semibold text-gray-900">15/20</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-gray-600">Trámites pendientes</span>
                <span className="text-xs md:text-sm font-semibold text-gray-900">7/10</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}