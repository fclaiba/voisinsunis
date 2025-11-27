import { useState } from "react";
import { Plus, Download, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { FilterBar } from "../FilterBar";
import { FamilyTable } from "../FamilyTable";
import { AddEditFamilyDialog } from "../AddEditFamilyDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { ObservationsPanel } from "../ObservationsPanel";
import { Family, FilterState } from "../../types/family";

interface FamiliesViewProps {
  families: Family[];
  filteredFamilies: Family[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onAddFamily: (family: Family) => void;
  onEditFamily: (family: Family) => void;
  onDeleteFamily: (familyId: string) => void;
  onSaveObservations: (familyId: string, observaciones: Family["observacionesAmpliadas"]) => void;
}

export function FamiliesView({
  families,
  filteredFamilies,
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  onAddFamily,
  onEditFamily,
  onDeleteFamily,
  onSaveObservations,
}: FamiliesViewProps) {
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [observationsPanelOpen, setObservationsPanelOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  const handleAddClick = () => {
    setDialogMode("add");
    setSelectedFamily(null);
    setAddEditDialogOpen(true);
  };

  const handleEditClick = (family: Family) => {
    setDialogMode("edit");
    setSelectedFamily(family);
    setAddEditDialogOpen(true);
  };

  const handleDeleteClick = (family: Family) => {
    setSelectedFamily(family);
    setDeleteDialogOpen(true);
  };

  const handleViewObservations = (family: Family) => {
    setSelectedFamily(family);
    setObservationsPanelOpen(true);
  };

  const handleSaveFamily = (family: Family) => {
    if (dialogMode === "add") {
      onAddFamily(family);
    } else {
      onEditFamily(family);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedFamily) {
      onDeleteFamily(selectedFamily.id);
      setDeleteDialogOpen(false);
      setSelectedFamily(null);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
        families={families}
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
          <p className="text-sm md:text-base text-gray-600">
            Mostrando{" "}
            <span className="font-semibold text-gray-900">{filteredFamilies.length}</span>{" "}
            de{" "}
            <span className="font-semibold text-gray-900">{families.length}</span>{" "}
            registros
          </p>
          {hasActiveFilters && <div className="hidden h-6 w-px bg-gray-200 sm:block"></div>}
        </div>
        <div className="flex w-full flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50 w-full sm:w-auto">
            <Upload className="size-4" />
            <span className="hidden sm:inline">Importar</span>
          </Button>
          <Button variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50 w-full sm:w-auto">
            <Download className="size-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button
            onClick={handleAddClick}
            className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/30 w-full sm:w-auto"
          >
            <Plus className="size-4" />
            <span className="sm:inline">Agregar</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <FamilyTable
        families={filteredFamilies}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onViewObservations={handleViewObservations}
        selectedFamilyId={selectedFamily?.id}
      />

      {/* Dialogs */}
      <AddEditFamilyDialog
        open={addEditDialogOpen}
        onClose={() => setAddEditDialogOpen(false)}
        onSave={handleSaveFamily}
        family={selectedFamily}
        mode={dialogMode}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        family={selectedFamily}
      />

      <ObservationsPanel
        open={observationsPanelOpen}
        onClose={() => setObservationsPanelOpen(false)}
        family={selectedFamily}
        onSave={onSaveObservations}
      />
    </div>
  );
}