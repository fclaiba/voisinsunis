import { useMemo } from "react";
import {
  Filter,
  ListChecks,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { FilterState, Family, SelectionType } from "../types/family";
import { countActiveFilters } from "../lib/filter-utils";

type FilterFieldUpdater = <K extends keyof FilterState>(
  key: K,
  value: FilterState[K],
) => void;

interface MetricsFilterControlsProps {
  filters: FilterState;
  families: Family[];
  onFilterFieldChange: FilterFieldUpdater;
  onSelectionTypeChange: (selection: SelectionType) => void;
  onClearFilters: () => void;
}

const selectionOptions: Array<{
  value: SelectionType;
  label: string;
  description: string;
  icon: typeof Sparkles;
  disabled?: boolean;
}> = [
  {
    value: "todos",
    label: "Todas las familias",
    description: "Dataset completo sin filtros aplicados",
    icon: Sparkles,
  },
  {
    value: "empleo-activo",
    label: "Familias con empleo",
    description: "Registros con al menos una persona empleada",
    icon: ListChecks,
  },
  {
    value: "sin-empleo",
    label: "Familias sin empleo",
    description: "Situaciones con necesidad de inserción laboral",
    icon: Filter,
  },
  {
    value: "discapacidad",
    label: "Casos con discapacidad",
    description: "Familias que requieren apoyo de salud especializado",
    icon: Filter,
  },
  {
    value: "familia-numerosa",
    label: "Familias numerosas",
    description: "Hogares con 3 o más hijos registrados",
    icon: Filter,
  },
  {
    value: "sin-programas",
    label: "Sin programas sociales",
    description: "Casos que no reciben asistencia estatal",
    icon: Filter,
  },
  {
    value: "estudios-superiores",
    label: "Con estudios superiores",
    description: "Familias con integrantes cursando nivel superior",
    icon: Filter,
  },
  {
    value: "personalizado",
    label: "Configuración personalizada",
    description: "Combinación manual de filtros avanzados",
    icon: SlidersHorizontal,
    disabled: true,
  },
];

const filterLabels: Record<
  keyof Omit<FilterState, "selectionType">,
  {
    label: string;
    formatter?: (value: string) => string;
  }
> = {
  busqueda: {
    label: "Búsqueda",
    formatter: (value) => `"${value}"`,
  },
  estadoLaboral: {
    label: "Estado laboral",
    formatter: (value) =>
      ({
        trabaja: "Trabaja",
        "no-trabaja": "No trabaja",
        todos: "",
      }[value] || value),
  },
  programasSociales: {
    label: "Programa",
    formatter: (value) =>
      ({
        todos: "",
        "sin-programas": "Sin programas",
      }[value] || value),
  },
  discapacidad: {
    label: "Discapacidad",
    formatter: (value) =>
      ({
        todos: "",
        si: "Con discapacidad",
        no: "Sin discapacidad",
      }[value] || value),
  },
  barrio: {
    label: "Barrio",
  },
  cantidadHijos: {
    label: "Hijos",
    formatter: (value) =>
      ({
        todos: "",
        "0": "Sin hijos",
        "1": "1 hijo",
        "2": "2 hijos",
        "3+": "3 o más",
      }[value] || value),
  },
  nivelEstudios: {
    label: "Estudios",
    formatter: (value) =>
      ({
        todos: "",
        "universitario-completo": "Universitario completo",
        "universitario-cursando": "Universitario cursando",
        "secundaria-completa": "Secundaria completa",
        "primaria-completa": "Primaria completa",
        "sin-estudios": "Sin estudios",
      }[value] || value),
  },
  oficio: {
    label: "Oficio",
    formatter: (value) =>
      ({
        todos: "",
        "con-oficio": "Con oficio definido",
        "sin-oficio": "Sin oficio",
      }[value] || value),
  },
};

function getActiveFilterBadges(filters: FilterState) {
  const badges: string[] = [];

  (Object.keys(filterLabels) as Array<
    keyof Omit<FilterState, "selectionType">
  >).forEach((key) => {
    const value = filters[key];

    if (!value || value === "todos") {
      return;
    }

    const { label, formatter } = filterLabels[key];
    const friendlyValue = formatter ? formatter(String(value)) : String(value);

    if (!friendlyValue) return;

    badges.push(`${label}: ${friendlyValue}`);
  });

  return badges;
}

export function MetricsFilterControls({
  filters,
  families,
  onFilterFieldChange,
  onSelectionTypeChange,
  onClearFilters,
}: MetricsFilterControlsProps) {
  const activeFilterCount = countActiveFilters(filters);
  const hasActiveFilters = activeFilterCount > 0;
  const activeBadges = getActiveFilterBadges(filters);

  const barriosDisponibles = useMemo(() => {
    return Array.from(new Set(families.map((f) => f.barrio).filter(Boolean))).sort();
  }, [families]);

  const oficiosDisponibles = useMemo(() => {
    return Array.from(
      new Set(families.map((f) => f.oficio).filter((oficio): oficio is string => Boolean(oficio && oficio !== ""))),
    ).sort();
  }, [families]);

  const handleSelectionChange = (value: SelectionType) => {
    onSelectionTypeChange(value);
  };

  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm transition-colors sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="size-4 text-primary" />
            Segmento de análisis
          </div>
          <Select value={filters.selectionType} onValueChange={handleSelectionChange}>
            <SelectTrigger className="w-full max-w-xs border-input bg-muted text-left focus:border-ring focus:bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selectionOptions.map(({ value, label, description, disabled }) => (
                <SelectItem key={value} value={value} disabled={disabled}>
                  <div className="flex flex-col gap-0.5">
                    <span>{label}</span>
                    <span className="text-xs text-muted-foreground">{description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-3 text-primary" />
            {selectionOptions.find((option) => option.value === filters.selectionType)?.description ??
              "Selecciona un segmento para comenzar"}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-input bg-muted text-sm font-medium hover:bg-white"
              >
                <SlidersHorizontal className="size-4" />
                Filtro avanzado
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Configuración avanzada de filtros</SheetTitle>
                <SheetDescription>
                  Define combinaciones específicas para refinar los insights del dashboard y de analítica.
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4 pb-24">
                <div className="space-y-6">
                  <section>
                    <h4 className="mb-3 text-sm font-semibold text-foreground">Búsqueda general</h4>
                    <Input
                      value={filters.busqueda}
                      placeholder="Buscar por nombre, DNI, teléfono o dirección"
                      onChange={(event) => onFilterFieldChange("busqueda", event.target.value)}
                      className="border-input bg-muted focus:border-ring focus:bg-card"
                    />
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <header className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">Situación laboral</h4>
                      <p className="text-xs text-muted-foreground">
                        Segmenta según la condición laboral u oficios declarados.
                      </p>
                    </header>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Estado laboral
                        </label>
                        <Select
                          value={filters.estadoLaboral}
                          onValueChange={(value) => onFilterFieldChange("estadoLaboral", value)}
                        >
                          <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="trabaja">Trabaja</SelectItem>
                            <SelectItem value="no-trabaja">No trabaja</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Oficio
                        </label>
                        <Select
                          value={filters.oficio}
                          onValueChange={(value) => onFilterFieldChange("oficio", value)}
                        >
                          <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="con-oficio">Con oficio definido</SelectItem>
                            <SelectItem value="sin-oficio">Sin oficio</SelectItem>
                            {oficiosDisponibles.map((oficio) => (
                              <SelectItem key={oficio} value={oficio}>
                                {oficio}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <header className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">Entorno familiar y social</h4>
                      <p className="text-xs text-muted-foreground">
                        Refuerza la comparativa según cantidad de hijos y asistencia recibida.
                      </p>
                    </header>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Cantidad de hijos
                        </label>
                        <Select
                          value={filters.cantidadHijos}
                          onValueChange={(value) => onFilterFieldChange("cantidadHijos", value)}
                        >
                          <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="0">Sin hijos</SelectItem>
                            <SelectItem value="1">1 hijo</SelectItem>
                            <SelectItem value="2">2 hijos</SelectItem>
                            <SelectItem value="3+">3 o más hijos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Programas sociales
                        </label>
                        <Select
                          value={filters.programasSociales}
                          onValueChange={(value) => onFilterFieldChange("programasSociales", value)}
                        >
                          <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="AUH">AUH</SelectItem>
                            <SelectItem value="Tarjeta Alimentar">Tarjeta Alimentar</SelectItem>
                            <SelectItem value="Potenciar Trabajo">Potenciar Trabajo</SelectItem>
                            <SelectItem value="Progresar">Progresar</SelectItem>
                            <SelectItem value="Pensión no contributiva">Pensión no contributiva</SelectItem>
                            <SelectItem value="sin-programas">Sin programas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <header className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">Condiciones de salud y territorio</h4>
                      <p className="text-xs text-muted-foreground">
                        Identifica focos de intervención prioritaria según zona y situación sanitaria.
                      </p>
                    </header>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Discapacidad
                        </label>
                        <Select
                          value={filters.discapacidad}
                          onValueChange={(value) => onFilterFieldChange("discapacidad", value)}
                        >
                          <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="si">Con discapacidad</SelectItem>
                            <SelectItem value="no">Sin discapacidad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Barrio
                        </label>
                        <Select
                          value={filters.barrio}
                          onValueChange={(value) => onFilterFieldChange("barrio", value)}
                        >
                          <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos los barrios</SelectItem>
                            {barriosDisponibles.map((barrio) => (
                              <SelectItem key={barrio} value={barrio}>
                                {barrio}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <header className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">Trayectoria educativa</h4>
                      <p className="text-xs text-muted-foreground">
                        Observa la cobertura educativa y oportunidades de formación.
                      </p>
                    </header>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-muted-foreground">
                        Nivel de estudios
                      </label>
                      <Select
                        value={filters.nivelEstudios}
                        onValueChange={(value) => onFilterFieldChange("nivelEstudios", value)}
                      >
                        <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="universitario-completo">Universitario completo</SelectItem>
                          <SelectItem value="universitario-cursando">Universitario cursando</SelectItem>
                          <SelectItem value="secundaria-completa">Secundaria completa</SelectItem>
                          <SelectItem value="primaria-completa">Primaria completa</SelectItem>
                          <SelectItem value="sin-estudios">Sin estudios</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </section>
                </div>
              </div>

              <SheetFooter>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 border-input text-muted-foreground hover:text-foreground"
                    onClick={onClearFilters}
                  >
                    <RefreshCw className="size-4" />
                    Restablecer filtros
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="ml-0 justify-start text-destructive hover:bg-destructive/10 hover:text-destructive sm:justify-center"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="size-4 text-primary" />
          {hasActiveFilters ? (
            <>
              <span>{activeFilterCount} filtros activos</span>
              <span className="text-muted-foreground">•</span>
              <span>Resultados actualizados en tiempo real</span>
            </>
          ) : (
            <span>Sin filtros aplicados. Visualizando el universo total.</span>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {activeBadges.map((badge) => (
              <Badge key={badge} variant="secondary" className="bg-muted text-muted-foreground">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

