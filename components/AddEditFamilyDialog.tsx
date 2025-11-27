import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Family } from "../types/family";
import { programasSocialesOptions, oficiosComunes } from "../data/mockData";

interface AddEditFamilyDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (family: Family) => void;
  family?: Family | null;
  mode: "add" | "edit";
}

export function AddEditFamilyDialog({ open, onClose, onSave, family, mode }: AddEditFamilyDialogProps) {
  const [formData, setFormData] = useState<Partial<Family>>({
    nombreApellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    barrio: "",
    referenciaCasa: "",
    hijos: 0,
    discapacidad: false,
    detalleDiscapacidad: "",
    trabaja: false,
    oficio: "",
    estudios: {
      primaria: "no",
      secundaria: "no",
      universitario: "no",
      carreraUniversitaria: ""
    },
    programasSociales: [],
    observaciones: "",
  });

  useEffect(() => {
    if (family && mode === "edit") {
      setFormData(family);
    } else {
      setFormData({
        nombreApellido: "",
        dni: "",
        telefono: "",
        direccion: "",
        barrio: "",
        referenciaCasa: "",
        hijos: 0,
        discapacidad: false,
        detalleDiscapacidad: "",
        trabaja: false,
        oficio: "",
        estudios: {
          primaria: "no",
          secundaria: "no",
          universitario: "no",
          carreraUniversitaria: ""
        },
        programasSociales: [],
        observaciones: "",
      });
    }
  }, [family, mode, open]);

  const handleSave = () => {
    const newFamily: Family = {
      id: family?.id || Date.now().toString(),
      nombreApellido: formData.nombreApellido || "",
      dni: formData.dni || "",
      telefono: formData.telefono || "",
      direccion: formData.direccion || "",
      barrio: formData.barrio || "",
      referenciaCasa: formData.referenciaCasa || "",
      hijos: formData.hijos || 0,
      discapacidad: formData.discapacidad || false,
      detalleDiscapacidad: formData.detalleDiscapacidad,
      trabaja: formData.trabaja || false,
      oficio: formData.oficio,
      estudios: formData.estudios || {
        primaria: "no",
        secundaria: "no",
        universitario: "no",
        carreraUniversitaria: ""
      },
      programasSociales: formData.programasSociales || [],
      observaciones: formData.observaciones || "",
      observacionesAmpliadas: family?.observacionesAmpliadas,
    };
    onSave(newFamily);
    onClose();
  };

  const togglePrograma = (programa: string) => {
    const current = formData.programasSociales || [];
    if (current.includes(programa)) {
      setFormData({ ...formData, programasSociales: current.filter(p => p !== programa) });
    } else {
      setFormData({ ...formData, programasSociales: [...current, programa] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {mode === "add" ? "Agregar nuevo registro" : "Editar registro"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Completa la información de la familia para crear un nuevo registro en el sistema."
              : "Modifica los datos de la familia. Los cambios se guardarán inmediatamente."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Información Personal */}
          <div className="col-span-2">
            <h3 className="text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">Información Personal</h3>
          </div>

          <div className="col-span-2">
            <Label className="text-gray-700">Nombre y apellido *</Label>
            <Input
              value={formData.nombreApellido}
              onChange={(e) => setFormData({ ...formData, nombreApellido: e.target.value })}
              placeholder="Nombre completo"
              className="mt-1.5 border border-input bg-muted focus:border-ring focus:bg-card"
            />
          </div>

          <div>
            <Label className="text-gray-700">DNI *</Label>
            <Input
              value={formData.dni}
              onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
              placeholder="12.345.678"
              className="mt-1.5 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          <div>
            <Label className="text-gray-700">Teléfono *</Label>
            <Input
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="11-1234-5678"
              className="mt-1.5 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          {/* Ubicación */}
          <div className="col-span-2 mt-4">
            <h3 className="text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">Ubicación</h3>
          </div>

          <div className="col-span-2">
            <Label className="text-gray-700">Dirección *</Label>
            <Input
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Calle y número"
              className="mt-1.5 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          <div>
            <Label className="text-gray-700">Barrio *</Label>
            <Input
              value={formData.barrio}
              onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
              placeholder="Nombre del barrio"
              className="mt-1.5 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          <div>
            <Label className="text-gray-700">Referencia de la casa</Label>
            <Input
              value={formData.referenciaCasa}
              onChange={(e) => setFormData({ ...formData, referenciaCasa: e.target.value })}
              placeholder="Color, esquina, cerca de..."
              className="mt-1.5 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          {/* Composición Familiar */}
          <div className="col-span-2 mt-4">
            <h3 className="text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">Composición Familiar</h3>
          </div>

          <div className="col-span-2">
            <Label className="text-gray-700">Cantidad de hijos</Label>
            <Input
              type="number"
              min="0"
              value={formData.hijos}
              onChange={(e) => setFormData({ ...formData, hijos: parseInt(e.target.value) || 0 })}
              className="mt-1.5 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Checkbox
                id="discapacidad"
                checked={formData.discapacidad}
                onCheckedChange={(checked) => setFormData({ ...formData, discapacidad: checked as boolean })}
                className="border-orange-400"
              />
              <Label htmlFor="discapacidad" className="cursor-pointer text-gray-900">¿Hay discapacidad en el hogar? (hijo o pareja)</Label>
            </div>
            {formData.discapacidad && (
              <Input
                value={formData.detalleDiscapacidad}
                onChange={(e) => setFormData({ ...formData, detalleDiscapacidad: e.target.value })}
                placeholder="Detalles sobre la discapacidad"
                className="bg-gray-50 border-gray-200 focus:bg-white"
              />
            )}
          </div>

          {/* Situación Laboral */}
          <div className="col-span-2 mt-4">
            <h3 className="text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">Situación Laboral</h3>
          </div>

          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Checkbox
                id="trabaja"
                checked={formData.trabaja}
                onCheckedChange={(checked) => setFormData({ ...formData, trabaja: checked as boolean })}
                className="border-green-400"
              />
              <Label htmlFor="trabaja" className="cursor-pointer text-gray-900">¿Trabaja actualmente?</Label>
            </div>
            {formData.trabaja && (
              <div>
                <Label className="text-gray-700">Oficio / Profesión</Label>
                <Select 
                  value={formData.oficio} 
                  onValueChange={(value) => setFormData({ ...formData, oficio: value })}
                >
                  <SelectTrigger className="mt-1.5 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Seleccionar oficio" />
                  </SelectTrigger>
                  <SelectContent>
                    {oficiosComunes.map((oficio) => (
                      <SelectItem key={oficio} value={oficio}>{oficio}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Estudios Completos */}
          <div className="col-span-2 mt-4">
            <h3 className="text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">Estudios Completos</h3>
          </div>

          <div>
            <Label className="text-gray-700">Nivel Primario</Label>
            <Select 
              value={formData.estudios?.primaria} 
              onValueChange={(value) => setFormData({ 
                ...formData, 
                estudios: { ...formData.estudios!, primaria: value as any }
              })}
            >
              <SelectTrigger className="mt-1.5 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completo">Completo</SelectItem>
                <SelectItem value="cursando">Cursando</SelectItem>
                <SelectItem value="incompleto">Incompleto</SelectItem>
                <SelectItem value="no">No cursó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700">Nivel Secundario</Label>
            <Select 
              value={formData.estudios?.secundaria} 
              onValueChange={(value) => setFormData({ 
                ...formData, 
                estudios: { ...formData.estudios!, secundaria: value as any }
              })}
            >
              <SelectTrigger className="mt-1.5 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completo">Completo</SelectItem>
                <SelectItem value="cursando">Cursando</SelectItem>
                <SelectItem value="incompleto">Incompleto</SelectItem>
                <SelectItem value="no">No cursó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700">Nivel Universitario</Label>
            <Select 
              value={formData.estudios?.universitario} 
              onValueChange={(value) => setFormData({ 
                ...formData, 
                estudios: { ...formData.estudios!, universitario: value as any }
              })}
            >
              <SelectTrigger className="mt-1.5 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completo">Completo</SelectItem>
                <SelectItem value="cursando">Cursando</SelectItem>
                <SelectItem value="incompleto">Incompleto</SelectItem>
                <SelectItem value="no">No cursó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.estudios?.universitario === "completo" || formData.estudios?.universitario === "cursando" || formData.estudios?.universitario === "incompleto") && (
            <div>
              <Label className="text-gray-700">Nombre de la carrera</Label>
              <Input
                value={formData.estudios?.carreraUniversitaria || ""}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  estudios: { ...formData.estudios!, carreraUniversitaria: e.target.value }
                })}
                placeholder="Ej: Enfermería, Administración"
                className="mt-1.5 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          )}

          {/* Programas Sociales */}
          <div className="col-span-2 mt-4">
            <h3 className="text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">Programas Sociales</h3>
          </div>

          <div className="col-span-2">
            <Label className="mb-3 block text-gray-700">Programas sociales activos</Label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              {programasSocialesOptions.filter(p => p !== "Ninguno").map((programa) => (
                <div key={programa} className="flex items-center space-x-2">
                  <Checkbox
                    id={`programa-${programa}`}
                    checked={formData.programasSociales?.includes(programa)}
                    onCheckedChange={() => togglePrograma(programa)}
                    className="border-blue-400"
                  />
                  <Label htmlFor={`programa-${programa}`} className="cursor-pointer text-gray-900 text-sm">{programa}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div className="col-span-2 mt-4">
            <h3 className="text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">Observaciones</h3>
          </div>

          <div className="col-span-2">
            <Label className="text-gray-700">Observaciones iniciales</Label>
            <Textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              placeholder="Notas y observaciones sobre el caso"
              rows={4}
              className="mt-1.5 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-gray-200 pt-4">
          <Button variant="outline" onClick={onClose} className="border-gray-200">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
            {mode === "add" ? "Crear registro" : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
