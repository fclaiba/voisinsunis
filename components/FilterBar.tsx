import { Search, Filter, X, Users, Briefcase, Heart, GraduationCap, MapPin, Baby } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FilterState, Family } from "../types/family";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  families: Family[];
}

export function FilterBar({ filters, onFilterChange, onClearFilters, hasActiveFilters, families }: FilterBarProps) {
  // Extraer barrios únicos de los datos reales
  const barriosUnicos = Array.from(new Set(families.map(f => f.barrio).filter(Boolean))).sort();

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Filter className="size-5 text-primary" />
          <h3 className="text-foreground">Filtrar familias</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <X className="size-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Búsqueda principal */}
      <div className="mt-4 mb-5 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, DNI, teléfono o dirección..."
            value={filters.busqueda}
            onChange={(e) => onFilterChange({ ...filters, busqueda: e.target.value })}
            className="h-12 border-input bg-muted pl-10 focus:border-ring focus:bg-card"
          />
        </div>
      </div>

      {/* Filtros en grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Filtro: Trabaja */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="size-4 text-muted-foreground" />
            Estado laboral
          </label>
          <Select 
            value={filters.estadoLaboral} 
            onValueChange={(value) => onFilterChange({ ...filters, estadoLaboral: value })}
          >
            <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="trabaja">Trabaja</SelectItem>
              <SelectItem value="no-trabaja">No trabaja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro: Discapacidad */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="size-4 text-muted-foreground" />
            Discapacidad
          </label>
          <Select 
            value={filters.discapacidad} 
            onValueChange={(value) => onFilterChange({ ...filters, discapacidad: value })}
          >
            <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="si">Con discapacidad</SelectItem>
              <SelectItem value="no">Sin discapacidad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro: Barrio */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-muted-foreground" />
            Barrio
          </label>
          <Select 
            value={filters.barrio} 
            onValueChange={(value) => onFilterChange({ ...filters, barrio: value })}
          >
            <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los barrios</SelectItem>
              {barriosUnicos.map(barrio => (
                <SelectItem key={barrio} value={barrio}>{barrio}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro: Cantidad de hijos */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Baby className="size-4 text-muted-foreground" />
            Cantidad de hijos
          </label>
          <Select 
            value={filters.cantidadHijos} 
            onValueChange={(value) => onFilterChange({ ...filters, cantidadHijos: value })}
          >
            <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
              <SelectValue />
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

        {/* Filtro: Programas sociales */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4 text-muted-foreground" />
            Programa social
          </label>
          <Select 
            value={filters.programasSociales} 
            onValueChange={(value) => onFilterChange({ ...filters, programasSociales: value })}
          >
            <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
              <SelectValue />
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

        {/* Filtro: Nivel de estudios */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="size-4 text-muted-foreground" />
            Nivel de estudios
          </label>
          <Select 
            value={filters.nivelEstudios} 
            onValueChange={(value) => onFilterChange({ ...filters, nivelEstudios: value })}
          >
            <SelectTrigger className="border-input bg-muted focus:border-ring focus:bg-card">
              <SelectValue />
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

        {/* Filtro: Oficio */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="size-4 text-muted-foreground" />
            Oficio
          </label>
          <Select 
            value={filters.oficio} 
            onValueChange={(value) => onFilterChange({ ...filters, oficio: value })}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Albañil">Albañil</SelectItem>
              <SelectItem value="Plomero">Plomero</SelectItem>
              <SelectItem value="Electricista">Electricista</SelectItem>
              <SelectItem value="Carpintero">Carpintero</SelectItem>
              <SelectItem value="Empleada doméstica">Empleada doméstica</SelectItem>
              <SelectItem value="Vendedor/a">Vendedor/a</SelectItem>
              <SelectItem value="con-oficio">Con oficio definido</SelectItem>
              <SelectItem value="sin-oficio">Sin oficio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Indicador de resultados */}
      {hasActiveFilters && (
        <div className="mt-6 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">Filtros activos aplicados</span>
          </div>
        </div>
      )}
    </div>
  );
}
