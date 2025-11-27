import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Family } from "../types/family";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  family: Family | null;
}

export function DeleteConfirmDialog({ open, onClose, onConfirm, family }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-gray-900">¿Eliminar este registro?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            {family && (
              <>
                Esta acción eliminará permanentemente el registro de{" "}
                <span className="font-semibold text-gray-900">{family.nombreApellido}</span>{" "}
                (DNI: {family.dni}) del sistema.
                <br /><br />
                <span className="text-red-600">Esta acción no se puede deshacer.</span>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-200">Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
          >
            Eliminar registro
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}