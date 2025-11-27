import { useState, useMemo } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "./components/ui/button";
import { Sidebar } from "./components/Sidebar";
import { MobileSidebar } from "./components/MobileSidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./components/views/DashboardWithRealData";
import { FamiliesView } from "./components/views/FamiliesView";
import { Reports } from "./components/views/Reports";
import { Analytics } from "./components/views/Analytics";
import { Settings } from "./components/views/Settings";
import { MetricsFilterControls } from "./components/MetricsFilterControls";
import { Family, FilterState, SelectionType } from "./types/family";
import { mockFamilies } from "./data/mockData";
import {
  applySelectionPreset,
  countActiveFilters,
  initialFilterState,
  normalizeFilters,
  resetFilters,
} from "./lib/filter-utils";
import { NotificationsProvider } from "./components/NotificationsProvider";
import { Toaster } from "sonner";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [families, setFamilies] = useState<Family[]>(mockFamilies);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const updateFilters = (updater: FilterState | ((prev: FilterState) => FilterState)) => {
    setFilters((prev) => {
      const nextState = typeof updater === "function" ? updater(prev) : updater;
      return normalizeFilters(nextState);
    });
  };

  const handleSelectionTypeChange = (selection: SelectionType) => {
    setFilters((prev) => applySelectionPreset(selection, prev));
  };

  const handleFilterFieldChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    updateFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFiltersChange = (nextFilters: FilterState) => {
    updateFilters(nextFilters);
  };

  const handleSearchChange = (value: string) => {
    handleFilterFieldChange("busqueda", value);
  };

  const handleSearchSubmit = (value: string) => {
    setActiveSection("families");
    handleFilterFieldChange("busqueda", value);
  };

  // Filtrar familias
  const filteredFamilies = useMemo(() => {
    return families.filter((family) => {
      // Búsqueda general
      if (filters.busqueda) {
        const searchTerm = filters.busqueda.toLowerCase();
        const matchesSearch = 
          family.nombreApellido.toLowerCase().includes(searchTerm) ||
          family.dni.toLowerCase().includes(searchTerm) ||
          family.telefono.toLowerCase().includes(searchTerm) ||
          family.direccion.toLowerCase().includes(searchTerm) ||
          family.barrio.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Filtro: Estado laboral
      if (filters.estadoLaboral !== "todos") {
        if (filters.estadoLaboral === "trabaja" && !family.trabaja) return false;
        if (filters.estadoLaboral === "no-trabaja" && family.trabaja) return false;
      }

      // Filtro: Discapacidad
      if (filters.discapacidad !== "todos") {
        if (filters.discapacidad === "si" && !family.discapacidad) return false;
        if (filters.discapacidad === "no" && family.discapacidad) return false;
      }

      // Filtro: Barrio
      if (filters.barrio !== "todos") {
        if (family.barrio !== filters.barrio) return false;
      }

      // Filtro: Cantidad de hijos
      if (filters.cantidadHijos !== "todos") {
        if (filters.cantidadHijos === "0" && family.hijos !== 0) return false;
        if (filters.cantidadHijos === "1" && family.hijos !== 1) return false;
        if (filters.cantidadHijos === "2" && family.hijos !== 2) return false;
        if (filters.cantidadHijos === "3+" && family.hijos < 3) return false;
      }

      // Filtro: Programas sociales
      if (filters.programasSociales !== "todos") {
        if (filters.programasSociales === "sin-programas" && family.programasSociales.length > 0) return false;
        if (filters.programasSociales !== "sin-programas" && !family.programasSociales.includes(filters.programasSociales)) return false;
      }

      // Filtro: Nivel de estudios
      if (filters.nivelEstudios !== "todos") {
        if (filters.nivelEstudios === "universitario-completo" && family.estudios.universitario !== "completo") return false;
        if (filters.nivelEstudios === "universitario-cursando" && family.estudios.universitario !== "cursando") return false;
        if (filters.nivelEstudios === "secundaria-completa" && family.estudios.secundaria !== "completo") return false;
        if (filters.nivelEstudios === "primaria-completa" && family.estudios.primaria !== "completo") return false;
        if (filters.nivelEstudios === "sin-estudios" && 
            (family.estudios.primaria === "completo" || 
             family.estudios.secundaria === "completo" || 
             family.estudios.universitario === "completo")) return false;
      }

      // Filtro: Oficio
      if (filters.oficio !== "todos") {
        if (filters.oficio === "con-oficio" && (!family.oficio || family.oficio === "")) return false;
        if (filters.oficio === "sin-oficio" && family.oficio && family.oficio !== "") return false;
        if (filters.oficio !== "con-oficio" && filters.oficio !== "sin-oficio" && family.oficio !== filters.oficio) return false;
      }

      return true;
    });
  }, [families, filters]);

  const clearFilters = () => {
    setFilters(resetFilters());
  };

  const activeFilterCount = countActiveFilters(filters);
  const hasActiveFilters = activeFilterCount > 0;

  const handleAddFamily = (family: Family) => {
    setFamilies([...families, family]);
  };

  const handleEditFamily = (family: Family) => {
    setFamilies(families.map((f) => (f.id === family.id ? family : f)));
  };

  const handleDeleteFamily = (familyId: string) => {
    setFamilies(families.filter((f) => f.id !== familyId));
  };

  const handleSaveObservations = (familyId: string, observaciones: Family["observacionesAmpliadas"]) => {
    setFamilies(families.map((f) =>
      f.id === familyId
        ? { ...f, observacionesAmpliadas: observaciones }
        : f
    ));
  };

  // Renderizar vista según sección activa
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-4 md:space-y-6">
            <MetricsFilterControls
              filters={filters}
              families={families}
              onFilterFieldChange={handleFilterFieldChange}
              onSelectionTypeChange={handleSelectionTypeChange}
              onClearFilters={clearFilters}
            />
            <Dashboard
              families={filteredFamilies}
              totalFamilies={families.length}
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
        );

      case "families":
        return (
          <FamiliesView
            families={families}
            filteredFamilies={filteredFamilies}
            filters={filters}
            onFilterChange={handleFiltersChange}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            onAddFamily={handleAddFamily}
            onEditFamily={handleEditFamily}
            onDeleteFamily={handleDeleteFamily}
            onSaveObservations={handleSaveObservations}
          />
        );

      case "reports":
        return <Reports families={families} />;

      case "analytics":
        return (
          <div className="space-y-4 md:space-y-6">
            <MetricsFilterControls
              filters={filters}
              families={families}
              onFilterFieldChange={handleFilterFieldChange}
              onSelectionTypeChange={handleSelectionTypeChange}
              onClearFilters={clearFilters}
            />
            <Analytics
              families={filteredFamilies}
              totalFamilies={families.length}
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
        );

      case "settings":
        return <Settings />;

      default:
        return (
          <div className="space-y-4 md:space-y-6">
            <MetricsFilterControls
              filters={filters}
              families={families}
              onFilterFieldChange={handleFilterFieldChange}
              onSelectionTypeChange={handleSelectionTypeChange}
              onClearFilters={clearFilters}
            />
            <Dashboard
              families={filteredFamilies}
              totalFamilies={families.length}
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
        );
    }
  };

  // Título según sección
  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard":
        return {
          title: "Dashboard",
          subtitle: "Resumen general y métricas clave del sistema",
        };
      case "families":
        return {
          title: "Gestión de Familias",
          subtitle: "Registro y seguimiento de familias en territorio comunitario",
        };
      case "reports":
        return {
          title: "Reportes",
          subtitle: "Genera y descarga reportes personalizados",
        };
      case "analytics":
        return {
          title: "Análisis",
          subtitle: "Análisis avanzado y métricas de tendencias",
        };
      case "settings":
        return {
          title: "Configuración",
          subtitle: "Administra las preferencias de tu cuenta y del sistema",
        };
      default:
        return {
          title: "Dashboard",
          subtitle: "Resumen general y métricas clave del sistema",
        };
    }
  };

  const sectionInfo = getSectionTitle();

  const handleReportsImportClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("reports:import"));
    }
  };

  const handleReportsExportClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("reports:export"));
    }
  };

  return (
    <NotificationsProvider>
      <div className="flex min-h-screen bg-background text-foreground transition-colors">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header
            onMenuClick={() => setMobileMenuOpen(true)}
            searchQuery={filters.busqueda}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
          />

          {/* Content Area */}
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
              {/* Page Header - Solo mostrar en secciones que no sean dashboard o families */}
              {activeSection !== "dashboard" && activeSection !== "families" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-foreground mb-1">{sectionInfo.title}</h1>
                      <p className="text-muted-foreground text-sm md:text-base">
                        {sectionInfo.subtitle}
                      </p>
                    </div>
                    {activeSection === "reports" && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
                        <Button
                          variant="outline"
                          className="gap-2 border-border flex-1 md:flex-none"
                          onClick={handleReportsImportClick}
                        >
                          <Upload className="size-4" />
                          <span className="hidden sm:inline">Importar</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-2 border-border flex-1 md:flex-none"
                          onClick={handleReportsExportClick}
                        >
                          <Download className="size-4" />
                          <span className="hidden sm:inline">Exportar</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Render Vista Actual */}
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </NotificationsProvider>
  );
}