import { Edit2, Trash2, Eye, GraduationCap, Wrench, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Family } from "../types/family";
import { cn } from "../lib/utils";

interface FamilyTableProps {
  families: Family[];
  onEdit: (family: Family) => void;
  onDelete: (family: Family) => void;
  onViewObservations: (family: Family) => void;
  selectedFamilyId?: string;
}

export function FamilyTable({ families, onEdit, onDelete, onViewObservations, selectedFamilyId }: FamilyTableProps) {
  const getEstudiosBadge = (estudios: Family["estudios"]) => {
    const niveles = [];
    
    if (estudios.primaria === "completo") niveles.push("Primaria");
    if (estudios.primaria === "cursando") niveles.push("Primaria (cursando)");
    
    if (estudios.secundaria === "completo") niveles.push("Secundaria");
    if (estudios.secundaria === "cursando") niveles.push("Secundaria (cursando)");
    
    if (estudios.universitario === "completo" || estudios.universitario === "cursando") {
      const estado = estudios.universitario === "cursando" ? " (cursando)" : "";
      const carrera = estudios.carreraUniversitaria ? `: ${estudios.carreraUniversitaria}` : "";
      niveles.push(`Universidad${carrera}${estado}`);
    } else if (estudios.universitario === "incompleto") {
      niveles.push("Universidad (incompleto)");
    }
    
    return niveles.length > 0 ? niveles : ["Sin estudios formales"];
  };

  if (families.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-16 text-center shadow-sm">
        <div className="mx-auto max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Eye className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-foreground">No se encontraron registros</h3>
          <p className="text-muted-foreground">No hay familias que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/40">
              <TableHead className="min-w-[200px] text-muted-foreground">Nombre y apellido</TableHead>
              <TableHead className="min-w-[130px] text-muted-foreground">DNI</TableHead>
              <TableHead className="min-w-[140px] text-muted-foreground">Teléfono</TableHead>
              <TableHead className="min-w-[280px] text-muted-foreground">Dirección</TableHead>
              <TableHead className="min-w-[90px] text-center text-muted-foreground">Hijos</TableHead>
              <TableHead className="min-w-[130px] text-center text-muted-foreground">Discapacidad</TableHead>
              <TableHead className="min-w-[110px] text-center text-muted-foreground">Trabaja</TableHead>
              <TableHead className="min-w-[160px] text-muted-foreground">Oficio</TableHead>
              <TableHead className="min-w-[250px] text-muted-foreground">Estudios Completos</TableHead>
              <TableHead className="min-w-[220px] text-muted-foreground">Programas sociales</TableHead>
              <TableHead className="min-w-[280px] text-muted-foreground">Observaciones</TableHead>
              <TableHead className="sticky right-0 min-w-[140px] bg-card text-right text-muted-foreground">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {families.map((family) => {
              const estudiosArray = getEstudiosBadge(family.estudios);
              const isSelected = selectedFamilyId === family.id;
              return (
                <TableRow 
                  key={family.id}
                  className={cn(
                    "transition-colors hover:bg-muted",
                    isSelected && "ring-1 ring-primary/40"
                  )}
                  style={isSelected ? { backgroundColor: "var(--muted)" } : undefined}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs text-white">
                        {family.nombreApellido
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <span className="font-medium text-foreground">{family.nombreApellido}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{family.dni}</TableCell>
                  <TableCell className="text-muted-foreground">{family.telefono}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{family.direccion}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        <span>{family.barrio}</span>
                      </div>
                      {family.referenciaCasa && (
                        <p className="text-xs italic text-muted-foreground opacity-80">
                          {family.referenciaCasa}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm text-secondary-foreground">
                      {family.hijos}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {family.discapacidad ? (
                      <div className="space-y-1">
                        <Badge className="border-transparent bg-amber-500/15 text-amber-500 hover:bg-amber-500/20">
                          Sí
                        </Badge>
                        {family.detalleDiscapacidad && (
                          <p className="text-xs text-muted-foreground">
                            {family.detalleDiscapacidad}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {family.trabaja ? (
                      <Badge className="border-transparent bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20">
                        Sí
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {family.oficio ? (
                      <div className="flex items-center gap-2">
                        <Wrench className="size-4 text-amber-500" />
                        <span className="text-sm text-foreground">{family.oficio}</span>
                      </div>
                    ) : (
                      <span className="text-xs italic text-muted-foreground">Sin oficio</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      {estudiosArray.map((estudio, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <GraduationCap className="size-3 text-primary" />
                          <span className="text-xs text-muted-foreground">{estudio}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {family.programasSociales.length > 0 ? (
                        family.programasSociales.map((programa) => (
                          <Badge
                            key={programa}
                            variant="outline"
                            className="border-blue-500/30 bg-blue-500/10 text-xs text-blue-600"
                          >
                            {programa}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs italic text-muted-foreground">Sin programas</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-sm text-muted-foreground line-clamp-2">
                        {family.observaciones || "Sin observaciones"}
                      </p>
                      {family.observacionesAmpliadas && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewObservations(family)}
                          className="h-7 shrink-0 px-2 text-primary hover:bg-muted hover:text-primary"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="sticky right-0 bg-card text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(family)}
                        className="h-9 px-3 text-primary hover:bg-blue-500/10 hover:text-primary"
                      >
                        <Edit2 className="mr-1.5 size-4" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(family)}
                        className="h-9 px-3 text-destructive hover:bg-red-500/10 hover:text-destructive"
                      >
                        <Trash2 className="mr-1.5 size-4" />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
