import { FilterState, SelectionType } from "../types/family";

type FilterKey = Exclude<keyof FilterState, "selectionType">;

const baseFilterDefaults: Record<FilterKey, FilterState[FilterKey]> = {
  busqueda: "",
  estadoLaboral: "todos",
  programasSociales: "todos",
  discapacidad: "todos",
  barrio: "todos",
  cantidadHijos: "todos",
  nivelEstudios: "todos",
  oficio: "todos",
};

const filterKeys = Object.keys(baseFilterDefaults) as FilterKey[];

export const initialFilterState: FilterState = {
  ...baseFilterDefaults,
  selectionType: "todos",
};

export const selectionPresets: Record<
  SelectionType,
  Partial<Record<FilterKey, FilterState[FilterKey]>>
> = {
  todos: {},
  "empleo-activo": { estadoLaboral: "trabaja" },
  "sin-empleo": { estadoLaboral: "no-trabaja" },
  discapacidad: { discapacidad: "si" },
  "familia-numerosa": { cantidadHijos: "3+" },
  "sin-programas": { programasSociales: "sin-programas" },
  "estudios-superiores": { nivelEstudios: "universitario-cursando" },
  personalizado: {},
};

export const defaultFiltersWithoutSelection = { ...baseFilterDefaults };

export function deriveSelectionType(filters: FilterState): SelectionType {
  const isDefault = filterKeys.every(
    (key) => filters[key] === baseFilterDefaults[key],
  );

  if (isDefault) {
    return "todos";
  }

  for (const [selection, preset] of Object.entries(selectionPresets) as Array<
    [SelectionType, Partial<Record<FilterKey, FilterState[FilterKey]>>]
  >) {
    if (selection === "todos" || selection === "personalizado") continue;

    const presetEntries = Object.entries(
      preset,
    ) as Array<[FilterKey, FilterState[FilterKey]]>;

    const matchesPreset =
      presetEntries.length > 0 &&
      presetEntries.every(([key, value]) => filters[key] === value) &&
      filterKeys
        .filter(
          (key) => !presetEntries.some(([presetKey]) => presetKey === key),
        )
        .every((key) => filters[key] === baseFilterDefaults[key]);

    if (matchesPreset) {
      return selection;
    }
  }

  return "personalizado";
}

export function normalizeFilters(filters: FilterState): FilterState {
  return {
    ...filters,
    selectionType: deriveSelectionType(filters),
  };
}

export function applySelectionPreset(
  selectionType: SelectionType,
  currentFilters?: FilterState,
): FilterState {
  const preset = selectionPresets[selectionType] ?? {};
  const nextFilters = {
    ...baseFilterDefaults,
    busqueda:
      currentFilters?.busqueda ?? baseFilterDefaults.busqueda,
    ...preset,
  } as Omit<FilterState, "selectionType">;

  return normalizeFilters({
    ...nextFilters,
    selectionType,
  });
}

export function countActiveFilters(filters: FilterState): number {
  return filterKeys.reduce((count, key) => {
    return count + (filters[key] === baseFilterDefaults[key] ? 0 : 1);
  }, 0);
}

export function resetFilters(): FilterState {
  return { ...initialFilterState };
}

