export interface Family {
  id: string;
  nombreApellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  barrio: string;
  referenciaCasa: string;
  hijos: number;
  discapacidad: boolean;
  detalleDiscapacidad?: string;
  trabaja: boolean;
  oficio?: string;
  estudios: {
    primaria: "completo" | "cursando" | "incompleto" | "no";
    secundaria: "completo" | "cursando" | "incompleto" | "no";
    universitario: "completo" | "cursando" | "incompleto" | "no";
    carreraUniversitaria?: string;
  };
  programasSociales: string[];
  observaciones: string;
  observacionesAmpliadas?: {
    notasLargas?: string;
    seguimiento?: string;
    situacionesUrgentes?: string;
    historialVisitas?: string;
  };
}

export type SelectionType =
  | "todos"
  | "empleo-activo"
  | "sin-empleo"
  | "discapacidad"
  | "familia-numerosa"
  | "sin-programas"
  | "estudios-superiores"
  | "personalizado";

export interface FilterState {
  busqueda: string;
  estadoLaboral: string;
  programasSociales: string;
  discapacidad: string;
  barrio: string;
  cantidadHijos: string;
  nivelEstudios: string;
  oficio: string;
  selectionType: SelectionType;
}