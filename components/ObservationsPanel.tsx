import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Family } from "../types/family";
import { FileText, Calendar, AlertCircle, History } from "lucide-react";

interface ObservationsPanelProps {
  open: boolean;
  onClose: () => void;
  family: Family | null;
  onSave: (familyId: string, observaciones: Family["observacionesAmpliadas"]) => void;
}

export function ObservationsPanel({ open, onClose, family, onSave }: ObservationsPanelProps) {
  const [observaciones, setObservaciones] = useState({
    notasLargas: "",
    seguimiento: "",
    situacionesUrgentes: "",
    historialVisitas: "",
  });

  useEffect(() => {
    if (family?.observacionesAmpliadas) {
      setObservaciones({
        notasLargas: family.observacionesAmpliadas.notasLargas || "",
        seguimiento: family.observacionesAmpliadas.seguimiento || "",
        situacionesUrgentes: family.observacionesAmpliadas.situacionesUrgentes || "",
        historialVisitas: family.observacionesAmpliadas.historialVisitas || "",
      });
    } else {
      setObservaciones({
        notasLargas: "",
        seguimiento: "",
        situacionesUrgentes: "",
        historialVisitas: "",
      });
    }
  }, [family, open]);

  const handleSave = () => {
    if (family) {
      onSave(family.id, observaciones);
      onClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-gray-900">Observaciones Ampliadas</SheetTitle>
          {family && (
            <SheetDescription className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-xs">
                {family.nombreApellido.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-foreground">{family.nombreApellido}</p>
                <p className="text-sm text-muted-foreground">DNI: {family.dni}</p>
              </div>
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <Label className="text-foreground">Notas largas</Label>
            </div>
            <Textarea
              value={observaciones.notasLargas}
              onChange={(e) => setObservaciones({ ...observaciones, notasLargas: e.target.value })}
              placeholder="Descripción detallada de la situación familiar..."
              rows={5}
              className="border border-primary/30 bg-card focus:border-primary/60 focus:ring-primary/30"
            />
          </div>

          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="size-5 text-emerald-500" />
              <Label className="text-foreground">Seguimiento</Label>
            </div>
            <Textarea
              value={observaciones.seguimiento}
              onChange={(e) => setObservaciones({ ...observaciones, seguimiento: e.target.value })}
              placeholder="Estado actual del seguimiento, próximas acciones..."
              rows={4}
              className="border border-emerald-500/30 bg-card focus:border-emerald-500/50 focus:ring-emerald-500/30"
            />
          </div>

          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="size-5 text-orange-500" />
              <Label className="text-foreground">Situaciones urgentes</Label>
            </div>
            <Textarea
              value={observaciones.situacionesUrgentes}
              onChange={(e) => setObservaciones({ ...observaciones, situacionesUrgentes: e.target.value })}
              placeholder="Necesidades urgentes o situaciones críticas..."
              rows={4}
              className="border border-orange-500/30 bg-card focus:border-orange-500/50 focus:ring-orange-500/30"
            />
          </div>

          <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <History className="size-5 text-purple-500" />
              <Label className="text-foreground">Historial de visitas</Label>
            </div>
            <Textarea
              value={observaciones.historialVisitas}
              onChange={(e) => setObservaciones({ ...observaciones, historialVisitas: e.target.value })}
              placeholder="Registro de visitas realizadas con fechas y detalles..."
              rows={6}
              className="border border-purple-500/30 bg-card focus:border-purple-500/50 focus:ring-purple-500/30"
            />
          </div>
        </div>

        <SheetFooter className="mt-6 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose} className="border-border">
            Cerrar sin guardar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
            Guardar observaciones
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}