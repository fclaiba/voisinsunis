import { Family } from "../types/family";

export const mockFamilies: Family[] = [
  {
    id: "1",
    nombreApellido: "María González",
    dni: "32.456.789",
    telefono: "11-2345-6789",
    direccion: "Av. Rivadavia 1234",
    barrio: "Barrio Norte",
    referenciaCasa: "Casa de material, portón verde, al lado del almacén",
    hijos: 2,
    discapacidad: true,
    detalleDiscapacidad: "Hijo menor con discapacidad motriz",
    trabaja: false,
    oficio: "",
    estudios: {
      primaria: "completo",
      secundaria: "completo",
      universitario: "no"
    },
    programasSociales: ["AUH", "Tarjeta Alimentar"],
    observaciones: "Necesita asistencia para trámites de pensión",
    observacionesAmpliadas: {
      notasLargas: "Familia numerosa con necesidades específicas. La madre está al cuidado de los dos hijos y no puede trabajar debido a la situación de discapacidad del menor.",
      seguimiento: "Última visita: 15/10/2024. Próxima visita programada: 30/11/2024",
      situacionesUrgentes: "Requiere gestión urgente de certificado de discapacidad actualizado",
      historialVisitas: "10/09/2024 - Primera visita\n15/10/2024 - Seguimiento de trámites\n05/11/2024 - Entrega de documentación"
    }
  },
  {
    id: "2",
    nombreApellido: "Carlos Rodríguez",
    dni: "28.123.456",
    telefono: "11-9876-5432",
    direccion: "Calle 25 de Mayo 567",
    barrio: "Villa Esperanza",
    referenciaCasa: "Casa de chapa, frente a la cancha de fútbol",
    hijos: 3,
    discapacidad: false,
    trabaja: true,
    oficio: "Albañil",
    estudios: {
      primaria: "completo",
      secundaria: "incompleto",
      universitario: "no"
    },
    programasSociales: ["AUH"],
    observaciones: "Situación laboral inestable",
    observacionesAmpliadas: {
      notasLargas: "Padre de familia que trabaja en la construcción de manera informal. Ingresos irregulares.",
      seguimiento: "Última visita: 20/10/2024",
      situacionesUrgentes: "Ninguna por el momento",
      historialVisitas: "20/10/2024 - Primera visita y relevamiento"
    }
  },
  {
    id: "3",
    nombreApellido: "Ana Martínez",
    dni: "35.678.901",
    telefono: "11-3456-7890",
    direccion: "Pasaje Los Andes 89",
    barrio: "Barrio San Martín",
    referenciaCasa: "Departamento PB, timbre 3",
    hijos: 1,
    discapacidad: false,
    trabaja: true,
    oficio: "Empleada doméstica",
    estudios: {
      primaria: "completo",
      secundaria: "cursando",
      universitario: "no"
    },
    programasSociales: ["AUH", "Potenciar Trabajo"],
    observaciones: "Necesita guardería para su hijo",
    observacionesAmpliadas: {
      notasLargas: "Madre soltera que trabaja limpiando casas. Tiene dificultad para cuidar a su hijo mientras trabaja.",
      seguimiento: "Última visita: 25/10/2024. Se gestionó contacto con jardín comunitario",
      situacionesUrgentes: "Busca vacante en jardín maternal cercano",
      historialVisitas: "25/10/2024 - Primera visita\n28/10/2024 - Seguimiento sobre jardín"
    }
  },
  {
    id: "4",
    nombreApellido: "Roberto Fernández",
    dni: "30.234.567",
    telefono: "11-4567-8901",
    direccion: "Av. San Juan 2345",
    barrio: "Barrio Flores",
    referenciaCasa: "Casa esquina, puerta azul",
    hijos: 0,
    discapacidad: true,
    detalleDiscapacidad: "Discapacidad visual",
    trabaja: false,
    oficio: "",
    estudios: {
      primaria: "completo",
      secundaria: "completo",
      universitario: "incompleto"
    },
    programasSociales: ["Pensión no contributiva"],
    observaciones: "Vive solo, necesita acompañamiento",
    observacionesAmpliadas: {
      notasLargas: "Persona con discapacidad visual que vive sola. Tiene autonomía pero necesita apoyo para ciertos trámites.",
      seguimiento: "Última visita: 18/10/2024. Visitas mensuales programadas",
      situacionesUrgentes: "Ninguna",
      historialVisitas: "01/09/2024 - Primera visita\n18/10/2024 - Visita de seguimiento mensual"
    }
  },
  {
    id: "5",
    nombreApellido: "Laura Sánchez",
    dni: "33.890.123",
    telefono: "11-5678-9012",
    direccion: "Calle Belgrano 456",
    barrio: "Villa Constitución",
    referenciaCasa: "Casa amarilla, al lado del kiosco",
    hijos: 4,
    discapacidad: false,
    trabaja: false,
    oficio: "",
    estudios: {
      primaria: "completo",
      secundaria: "incompleto",
      universitario: "no"
    },
    programasSociales: ["AUH", "Tarjeta Alimentar", "Progresar"],
    observaciones: "Familia numerosa, requiere seguimiento",
    observacionesAmpliadas: {
      notasLargas: "Familia con cuatro hijos. La madre se dedica al cuidado de los menores. El hijo mayor está estudiando secundaria.",
      seguimiento: "Última visita: 22/10/2024. Próxima visita: 15/11/2024",
      situacionesUrgentes: "Necesita útiles escolares para inicio de clases",
      historialVisitas: "05/09/2024 - Primera visita\n22/10/2024 - Entrega de mercadería"
    }
  },
  {
    id: "6",
    nombreApellido: "Jorge Méndez",
    dni: "29.567.234",
    telefono: "11-6789-0123",
    direccion: "Calle Moreno 789",
    barrio: "Barrio Norte",
    referenciaCasa: "Casa de dos pisos, reja negra",
    hijos: 2,
    discapacidad: false,
    trabaja: true,
    oficio: "Plomero",
    estudios: {
      primaria: "completo",
      secundaria: "completo",
      universitario: "no"
    },
    programasSociales: ["AUH"],
    observaciones: "Trabaja por cuenta propia, ingresos variables",
    observacionesAmpliadas: {
      notasLargas: "Plomero independiente con cartera de clientes estable. Hijo mayor terminando secundaria.",
      seguimiento: "Última visita: 12/10/2024",
      situacionesUrgentes: "Ninguna",
      historialVisitas: "12/10/2024 - Primera visita"
    }
  },
  {
    id: "7",
    nombreApellido: "Patricia López",
    dni: "31.234.890",
    telefono: "11-7890-1234",
    direccion: "Av. Libertador 2567",
    barrio: "Villa Esperanza",
    referenciaCasa: "Edificio blanco, 3er piso departamento B",
    hijos: 1,
    discapacidad: false,
    trabaja: true,
    oficio: "Vendedora",
    estudios: {
      primaria: "completo",
      secundaria: "completo",
      universitario: "cursando",
      carreraUniversitaria: "Enfermería"
    },
    programasSociales: ["Progresar"],
    observaciones: "Estudia y trabaja, necesita apoyo para gastos educativos",
    observacionesAmpliadas: {
      notasLargas: "Madre soltera que trabaja en comercio y estudia enfermería. Su hijo mayor está por terminar la universidad.",
      seguimiento: "Última visita: 28/10/2024",
      situacionesUrgentes: "Necesita renovar beca Progresar",
      historialVisitas: "28/10/2024 - Asesoramiento sobre becas"
    }
  },
  {
    id: "8",
    nombreApellido: "Miguel Ángel Torres",
    dni: "27.345.678",
    telefono: "11-8901-2345",
    direccion: "Calle Sarmiento 123",
    barrio: "Barrio San Martín",
    referenciaCasa: "Casa con jardín adelante, portón blanco",
    hijos: 3,
    discapacidad: false,
    trabaja: true,
    oficio: "Electricista",
    estudios: {
      primaria: "completo",
      secundaria: "completo",
      universitario: "no"
    },
    programasSociales: ["AUH", "Tarjeta Alimentar"],
    observaciones: "Busca regularizar situación laboral",
    observacionesAmpliadas: {
      notasLargas: "Electricista con amplia experiencia. Busca monotributo para facturar.",
      seguimiento: "Última visita: 05/11/2024",
      situacionesUrgentes: "Asesoramiento sobre monotributo social",
      historialVisitas: "05/11/2024 - Derivación a contador del municipio"
    }
  },
  {
    id: "9",
    nombreApellido: "Claudia Ramírez",
    dni: "34.456.789",
    telefono: "11-9012-3456",
    direccion: "Pasaje Santa Fe 456",
    barrio: "Barrio Flores",
    referenciaCasa: "Casa de ladrillo sin revocar, fondo del pasaje",
    hijos: 2,
    discapacidad: true,
    detalleDiscapacidad: "Hijo mayor con TEA",
    trabaja: false,
    oficio: "",
    estudios: {
      primaria: "completo",
      secundaria: "completo",
      universitario: "incompleto"
    },
    programasSociales: ["AUH", "Pensión no contributiva"],
    observaciones: "Necesita escuela especial para hijo con TEA",
    observacionesAmpliadas: {
      notasLargas: "Madre dedicada al cuidado de hijo con TEA. Requiere apoyo profesional.",
      seguimiento: "Última visita: 18/10/2024",
      situacionesUrgentes: "Buscar vacante en escuela especial",
      historialVisitas: "18/10/2024 - Gestión de certificado de discapacidad"
    }
  },
  {
    id: "10",
    nombreApellido: "Fernando Castro",
    dni: "26.789.012",
    telefono: "11-0123-4567",
    direccion: "Av. Corrientes 3456",
    barrio: "Villa Constitución",
    referenciaCasa: "Local con vivienda arriba, persiana verde",
    hijos: 1,
    discapacidad: false,
    trabaja: true,
    oficio: "Carpintero",
    estudios: {
      primaria: "completo",
      secundaria: "completo",
      universitario: "completo",
      carreraUniversitaria: "Técnico en Construcción"
    },
    programasSociales: [],
    observaciones: "Situación estable, no requiere asistencia",
    observacionesAmpliadas: {
      notasLargas: "Carpintero con taller propio. Situación económica estable.",
      seguimiento: "Última visita: 01/10/2024",
      situacionesUrgentes: "Ninguna",
      historialVisitas: "01/10/2024 - Relevamiento inicial"
    }
  }
];

export const programasSocialesOptions = [
  "AUH",
  "Tarjeta Alimentar",
  "Potenciar Trabajo",
  "Progresar",
  "Pensión no contributiva",
  "Ninguno"
];

export const oficiosComunes = [
  "Albañil",
  "Plomero",
  "Electricista",
  "Carpintero",
  "Pintor",
  "Mecánico",
  "Jardinero",
  "Empleada doméstica",
  "Vendedor/a",
  "Cocinero/a",
  "Peluquero/a",
  "Costurero/a",
  "Cuidador/a",
  "Chofer",
  "Otro"
];