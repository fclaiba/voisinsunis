import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileText, Download, Printer, Filter, Calendar, TrendingUp, Users, FileSpreadsheet, Mail } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Family } from "../../types/family";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

type BinaryFilter = "todos" | "si" | "no";
type ReportFormat = "PDF" | "Excel" | "Word" | "CSV";
type TimeframeValue = "semana" | "mes" | "trimestre" | "año";
type CustomReportType = "general" | "detallado" | "resumen";
type CustomDateRange = "actual" | "anterior" | "personalizado";

interface ReportFilters {
  barrio: string;
  trabaja: BinaryFilter;
  discapacidad: BinaryFilter;
  programa: string;
}

interface DatasetSummaryItem {
  label: string;
  value: string;
}

interface ReportDataset {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: Array<Record<string, string | number>>;
  summary?: DatasetSummaryItem[];
}

interface GeneratedReport {
  id: string;
  name: string;
  generatedAt: string;
  generatedBy: string;
  format: ReportFormat;
  status: "Completado" | "Programado";
  type: "template" | "custom";
  templateId?: number;
  appliedFilters: ReportFilters;
  dataset: ReportDataset;
  scheduledFor?: string;
}

interface ScheduleForm {
  email: string;
  when: string;
}

interface CustomFieldDefinition {
  id: string;
  label: string;
  defaultSelected?: boolean;
  resolver: (family: Family) => string | number;
}

const TIMEFRAME_IN_MS: Record<TimeframeValue, number> = {
  semana: 7 * 24 * 60 * 60 * 1000,
  mes: 30 * 24 * 60 * 60 * 1000,
  trimestre: 90 * 24 * 60 * 60 * 1000,
  año: 365 * 24 * 60 * 60 * 1000,
};

const RELATIVE_TIME_UNITS = [
  { unit: "year", ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: "month", ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: "week", ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
] as const;

const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat("es-AR", { numeric: "auto" });

const customTypeLabels: Record<CustomReportType, string> = {
  general: "General",
  detallado: "Detallado",
  resumen: "Resumen ejecutivo",
};

const dateRangeLabels: Record<CustomDateRange, string> = {
  actual: "Período actual",
  anterior: "Período anterior",
  personalizado: "Período personalizado",
};

const templateColorStyles: Record<string, { icon: string; bg: string; badge: string }> = {
  blue: { icon: "text-sky-500", bg: "bg-sky-500/15", badge: "bg-sky-500/15 text-sky-500" },
  orange: { icon: "text-orange-500", bg: "bg-orange-500/15", badge: "bg-orange-500/15 text-orange-500" },
  green: { icon: "text-emerald-500", bg: "bg-emerald-500/15", badge: "bg-emerald-500/15 text-emerald-500" },
  purple: { icon: "text-purple-500", bg: "bg-purple-500/15", badge: "bg-purple-500/15 text-purple-500" },
};

const CUSTOM_FIELD_DEFINITIONS: CustomFieldDefinition[] = [
  { id: "nombreApellido", label: "Nombre y apellido", defaultSelected: true, resolver: (family) => family.nombreApellido },
  { id: "dni", label: "DNI", defaultSelected: true, resolver: (family) => family.dni },
  { id: "telefono", label: "Teléfono", resolver: (family) => family.telefono },
  { id: "direccion", label: "Dirección", resolver: (family) => family.direccion },
  { id: "barrio", label: "Barrio", defaultSelected: true, resolver: (family) => family.barrio },
  { id: "hijos", label: "Cantidad de hijos", resolver: (family) => family.hijos },
  {
    id: "discapacidad",
    label: "Discapacidad",
    resolver: (family) => (family.discapacidad ? (family.detalleDiscapacidad ? `Sí - ${family.detalleDiscapacidad}` : "Sí") : "No"),
  },
  {
    id: "trabaja",
    label: "Situación laboral",
    resolver: (family) => {
      if (family.trabaja) {
        return family.oficio && family.oficio.trim().length > 0 ? `Trabaja - ${family.oficio}` : "Trabaja";
      }
      return "No trabaja";
    },
  },
  {
    id: "programasSociales",
    label: "Programas sociales",
    defaultSelected: true,
    resolver: (family) => (family.programasSociales.length ? family.programasSociales.join(", ") : "Sin programas"),
  },
  { id: "observaciones", label: "Observaciones", resolver: (family) => family.observaciones },
];

const createDefaultFilters = (): ReportFilters => ({
  barrio: "todos",
  trabaja: "todos",
  discapacidad: "todos",
  programa: "todos",
});

const createReportId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `report-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
};

const slugify = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "reporte";

const capitalize = (text: string): string => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

const formatRelativeTimeFromNow = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Sin información";
  }
  const now = Date.now();
  const diff = date.getTime() - now;

  for (const { unit, ms } of RELATIVE_TIME_UNITS) {
    if (Math.abs(diff) >= ms || unit === "minute") {
      const value = Math.round(diff / ms);
      return capitalize(RELATIVE_TIME_FORMATTER.format(value, unit));
    }
  }

  return "Hace instantes";
};

const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const describeFilters = (filters: ReportFilters): string => {
  const fragments: string[] = [];

  if (filters.barrio !== "todos") {
    fragments.push(`Barrio: ${filters.barrio}`);
  }

  if (filters.trabaja !== "todos") {
    fragments.push(`Trabajo: ${filters.trabaja === "si" ? "Trabaja" : "No trabaja"}`);
  }

  if (filters.discapacidad !== "todos") {
    fragments.push(`Discapacidad: ${filters.discapacidad === "si" ? "Sí" : "No"}`);
  }

  if (filters.programa !== "todos") {
    fragments.push(filters.programa === "sin-programas" ? "Sin programas sociales" : `Programa: ${filters.programa}`);
  }

  return fragments.length > 0 ? fragments.join(" · ") : "Sin filtros adicionales";
};

const applyFilters = (families: Family[], filters: ReportFilters): Family[] =>
  families.filter((family) => {
    if (filters.barrio !== "todos" && family.barrio !== filters.barrio) {
      return false;
    }

    if (filters.trabaja !== "todos") {
      const trabaja = family.trabaja ? "si" : "no";
      if (trabaja !== filters.trabaja) {
        return false;
      }
    }

    if (filters.discapacidad !== "todos") {
      const discapacidad = family.discapacidad ? "si" : "no";
      if (discapacidad !== filters.discapacidad) {
        return false;
      }
    }

    if (filters.programa !== "todos") {
      if (filters.programa === "sin-programas") {
        if (family.programasSociales.length > 0) {
          return false;
        }
      } else if (!family.programasSociales.includes(filters.programa)) {
        return false;
      }
    }

    return true;
  });

const getUniqueBarrios = (families: Family[]): string[] =>
  Array.from(new Set(families.map((family) => family.barrio))).sort((a, b) => a.localeCompare(b, "es"));

const getProgramOptions = (families: Family[]): string[] =>
  Array.from(new Set(families.flatMap((family) => family.programasSociales))).sort((a, b) => a.localeCompare(b, "es"));

const getReportReferenceDate = (report: GeneratedReport): string =>
  report.status === "Programado" && report.scheduledFor ? report.scheduledFor : report.generatedAt;

const isWithinTimeframe = (isoDate: string, timeframe: TimeframeValue, reference = new Date()): boolean => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const diff = Math.abs(reference.getTime() - date.getTime());
  return diff <= TIMEFRAME_IN_MS[timeframe];
};

const filterReportsByTimeframe = (reports: GeneratedReport[], timeframe: TimeframeValue): GeneratedReport[] => {
  if (reports.length === 0) {
    return [];
  }
  const now = new Date();
  return reports.filter((report) => isWithinTimeframe(getReportReferenceDate(report), timeframe, now));
};

const cloneDataset = (dataset: ReportDataset): ReportDataset => ({
  title: dataset.title,
  subtitle: dataset.subtitle,
  columns: [...dataset.columns],
  rows: dataset.rows.map((row) => ({ ...row })),
  summary: dataset.summary ? dataset.summary.map((item) => ({ ...item })) : undefined,
});

const normalizeFilters = (raw: Partial<ReportFilters> | undefined): ReportFilters => {
  const normalized = createDefaultFilters();
  if (!raw) {
    return normalized;
  }

  if (typeof raw.barrio === "string") {
    normalized.barrio = raw.barrio;
  }
  if (raw.trabaja === "si" || raw.trabaja === "no" || raw.trabaja === "todos") {
    normalized.trabaja = raw.trabaja;
  }
  if (raw.discapacidad === "si" || raw.discapacidad === "no" || raw.discapacidad === "todos") {
    normalized.discapacidad = raw.discapacidad;
  }
  if (typeof raw.programa === "string") {
    normalized.programa = raw.programa;
  }
  return normalized;
};

const normalizeDataset = (raw: ReportDataset | undefined): ReportDataset => {
  if (!raw || typeof raw !== "object") {
    return {
      title: "Reporte importado",
      columns: [],
      rows: [],
    };
  }

  const rows = Array.isArray(raw.rows)
    ? raw.rows.map((row) => {
      if (!row || typeof row !== "object") {
        return {};
      }
      return Object.entries(row).reduce<Record<string, string | number>>((acc, [key, value]) => {
        acc[String(key)] = typeof value === "number" ? value : String(value ?? "");
        return acc;
      }, {});
    })
    : [];

  let columns = Array.isArray(raw.columns) ? raw.columns.map((column) => String(column)) : [];

  if (columns.length === 0 && rows.length > 0) {
    columns = Object.keys(rows[0]);
  }

  return {
    title: typeof raw.title === "string" ? raw.title : "Reporte importado",
    subtitle: typeof raw.subtitle === "string" ? raw.subtitle : undefined,
    columns,
    rows,
    summary: Array.isArray(raw.summary)
      ? raw.summary
        .filter((item): item is DatasetSummaryItem => Boolean(item?.label) && Boolean(item?.value))
        .map((item) => ({ label: String(item.label), value: String(item.value) }))
      : undefined,
  };
};

const sanitizeImportedReport = (raw: unknown): GeneratedReport | null => {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const data = raw as Partial<GeneratedReport> & { format?: string; status?: string; type?: string };

  if (!data.name || !data.dataset) {
    return null;
  }

  const allowedFormats: ReportFormat[] = ["PDF", "Excel", "Word", "CSV"];
  const sanitizedFormat = (data.format ?? "PDF").toUpperCase() as ReportFormat;

  return {
    id: typeof data.id === "string" ? data.id : createReportId(),
    name: String(data.name),
    generatedAt: typeof data.generatedAt === "string" ? data.generatedAt : new Date().toISOString(),
    generatedBy: typeof data.generatedBy === "string" ? data.generatedBy : "Importado",
    format: allowedFormats.includes(sanitizedFormat) ? sanitizedFormat : "PDF",
    status: data.status === "Programado" ? "Programado" : "Completado",
    type: data.type === "template" ? "template" : "custom",
    templateId: typeof data.templateId === "number" ? data.templateId : undefined,
    appliedFilters: normalizeFilters(data.appliedFilters),
    dataset: normalizeDataset(data.dataset),
    scheduledFor: typeof data.scheduledFor === "string" ? data.scheduledFor : undefined,
  };
};

const downloadPDF = (dataset: ReportDataset, filename: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  let cursorY = 20;

  doc.setFontSize(16);
  doc.text(dataset.title, marginX, cursorY);
  cursorY += 8;

  if (dataset.subtitle) {
    doc.setFontSize(11);
    const subtitleLines = doc.splitTextToSize(dataset.subtitle, pageWidth - marginX * 2);
    doc.text(subtitleLines, marginX, cursorY);
    cursorY += subtitleLines.length * 5.5 + 4;
  }

  if (dataset.summary?.length) {
    doc.setFontSize(11);
    dataset.summary.forEach((item) => {
      doc.text(`${item.label}: ${item.value}`, marginX, cursorY);
      cursorY += 6;
    });
    cursorY += 4;
  }

  if (dataset.columns.length > 0) {
    doc.setFontSize(11);
    const availableWidth = pageWidth - marginX * 2;
    const columnWidth = availableWidth / dataset.columns.length;

    doc.setFont(undefined, "bold");
    dataset.columns.forEach((column, index) => {
      const x = marginX + index * columnWidth;
      doc.text(column, x, cursorY);
    });

    doc.setFont(undefined, "normal");
    cursorY += 6;

    doc.setFontSize(10);
    dataset.rows.forEach((row) => {
      if (cursorY > pageHeight - 20) {
        doc.addPage();
        cursorY = 20;
      }

      let rowHeight = 6;
      const cellLines: string[][] = [];

      dataset.columns.forEach((column, index) => {
        const value = String(row[column] ?? "");
        const text = doc.splitTextToSize(value, columnWidth - 2);
        cellLines[index] = text;
        rowHeight = Math.max(rowHeight, text.length * 5.5 + 2);
      });

      dataset.columns.forEach((column, index) => {
        const x = marginX + index * columnWidth;
        doc.text(cellLines[index], x, cursorY);
      });

      cursorY += rowHeight;
    });
  } else {
    doc.setFontSize(11);
    doc.text("Este reporte no contiene columnas configuradas.", marginX, cursorY);
  }

  doc.save(`${filename}.pdf`);
};

const downloadCSV = (dataset: ReportDataset, filename: string) => {
  const rows = [];
  rows.push(dataset.columns.join(","));
  dataset.rows.forEach((row) => {
    const values = dataset.columns.map((column) => {
      const value = String(row[column] ?? "");
      const sanitized = value.replace(/"/g, '""');
      return `"${sanitized}"`;
    });
    rows.push(values.join(","));
  });

  const csvContent = rows.join("\r\n");
  // Add BOM for Excel compatibility
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadDoc = (dataset: ReportDataset, filename: string) => {
  const tableRows = dataset.rows
    .map((row) => {
      const columns = dataset.columns
        .map((column) => `<td>${String(row[column] ?? "")}</td>`)
        .join("");
      return `<tr>${columns}</tr>`;
    })
    .join("");

  const summary = dataset.summary
    ?.map((item) => `<li><strong>${item.label}:</strong> ${item.value}</li>`)
    .join("") ?? "";

  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${dataset.title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
          h1 { font-size: 20px; margin-bottom: 8px; }
          h2 { font-size: 14px; font-weight: normal; color: #4b5563; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f3f4f6; }
          ul { padding-left: 18px; }
        </style>
      </head>
      <body>
        <h1>${dataset.title}</h1>
        ${dataset.subtitle ? `<h2>${dataset.subtitle}</h2>` : ""}
        ${dataset.summary?.length
      ? `<section><h3>Resumen</h3><ul>${summary}</ul></section>`
      : ""
    }
        <table>
          <thead>
            <tr>${dataset.columns.map((column) => `<th>${column}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff" + html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.doc`;
  link.click();
  URL.revokeObjectURL(url);
};

const openPrintPreview = (dataset: ReportDataset): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const printWindow = window.open("", "_blank", "width=960,height=720");
  if (!printWindow) {
    return false;
  }

  const doc = printWindow.document;
  const tableRows = dataset.rows
    .map(
      (row) =>
        `<tr>${dataset.columns
          .map((column) => `<td style="border:1px solid #d1d5db;padding:8px;">${String(row[column] ?? "")}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  const summary = dataset.summary
    ?.map((item) => `<li><strong>${item.label}:</strong> ${item.value}</li>`)
    .join("") ?? "";

  doc.write(`
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${dataset.title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
          h1 { font-size: 20px; margin-bottom: 8px; }
          h2 { font-size: 14px; font-weight: normal; color: #4b5563; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f9fafb; }
          ul { padding-left: 18px; }
        </style>
      </head>
      <body>
        <h1>${dataset.title}</h1>
        ${dataset.subtitle ? `<h2>${dataset.subtitle}</h2>` : ""}
        ${dataset.summary?.length
      ? `<section><h3>Resumen</h3><ul>${summary}</ul></section>`
      : ""
    }
        <table>
          <thead>
            <tr>${dataset.columns.map((column) => `<th>${column}</th>`).join("")}</tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `);
  doc.close();
  printWindow.focus();
  printWindow.print();
  return true;
};

const downloadReportFile = (format: ReportFormat, dataset: ReportDataset, filename: string) => {
  if (typeof window === "undefined") {
    return;
  }
  switch (format) {
    case "PDF":
      downloadPDF(dataset, filename);
      break;
    case "Excel":
      downloadCSV(dataset, filename);
      break;
    case "Word":
      downloadDoc(dataset, filename);
      break;
    case "CSV":
      downloadCSV(dataset, filename);
      break;
    default:
      downloadCSV(dataset, filename);
  }
};

const createGeneralDataset = (families: Family[], filters: ReportFilters): ReportDataset => {
  const rows = families.map((family) => ({
    Nombre: family.nombreApellido,
    DNI: family.dni,
    Barrio: family.barrio,
    "Programas sociales": family.programasSociales.length ? family.programasSociales.join(", ") : "Sin programas",
  }));

  const summary: DatasetSummaryItem[] = [
    { label: "Familias incluidas", value: String(families.length) },
    { label: "Con discapacidad", value: String(families.filter((family) => family.discapacidad).length) },
    { label: "Con programas sociales", value: String(families.filter((family) => family.programasSociales.length > 0).length) },
  ];

  return {
    title: "Reporte General de Familias",
    subtitle: `Filtros aplicados: ${describeFilters(filters)}`,
    columns: ["Nombre", "DNI", "Barrio", "Programas sociales"],
    rows,
    summary,
  };
};

const createDisabilityDataset = (families: Family[], filters: ReportFilters): ReportDataset => {
  const disabilityFamilies = families.filter((family) => family.discapacidad);
  const rows = disabilityFamilies.map((family) => ({
    Nombre: family.nombreApellido,
    DNI: family.dni,
    Detalle: family.detalleDiscapacidad ?? "Sin detalle",
    Barrio: family.barrio,
  }));

  const percentage = families.length > 0 ? Math.round((disabilityFamilies.length / families.length) * 100) : 0;

  const summary: DatasetSummaryItem[] = [
    { label: "Casos totales", value: String(disabilityFamilies.length) },
    { label: "Porcentaje del total", value: `${percentage}%` },
  ];

  return {
    title: "Familias con Discapacidad",
    subtitle: `Filtros aplicados: ${describeFilters(filters)}`,
    columns: ["Nombre", "DNI", "Detalle", "Barrio"],
    rows,
    summary,
  };
};

const createProgramsDataset = (families: Family[], filters: ReportFilters): ReportDataset => {
  const programMap = new Map<string, number>();
  families.forEach((family) => {
    family.programasSociales.forEach((programa) => {
      programMap.set(programa, (programMap.get(programa) ?? 0) + 1);
    });
  });

  const rows = Array.from(programMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([programa, count]) => ({
      Programa: programa,
      Familias: count,
    }));

  const summary: DatasetSummaryItem[] = [
    { label: "Familias con programas", value: String(families.filter((family) => family.programasSociales.length > 0).length) },
    { label: "Programas diferentes", value: String(programMap.size) },
  ];

  return {
    title: "Programas Sociales Activos",
    subtitle: `Filtros aplicados: ${describeFilters(filters)}`,
    columns: ["Programa", "Familias"],
    rows,
    summary,
  };
};

const createLaborDataset = (families: Family[], filters: ReportFilters): ReportDataset => {
  const rows = families.map((family) => ({
    Nombre: family.nombreApellido,
    Situación: family.trabaja ? "Trabaja" : "No trabaja",
    Oficio: family.trabaja ? family.oficio || "Sin especificar" : "—",
    Hijos: family.hijos,
  }));

  const working = families.filter((family) => family.trabaja).length;
  const notWorking = families.length - working;
  const percentage = families.length > 0 ? Math.round((working / families.length) * 100) : 0;

  const summary: DatasetSummaryItem[] = [
    { label: "Trabajan", value: String(working) },
    { label: "No trabajan", value: String(notWorking) },
    { label: "Porcentaje empleado", value: `${percentage}%` },
  ];

  return {
    title: "Situación Laboral",
    subtitle: `Filtros aplicados: ${describeFilters(filters)}`,
    columns: ["Nombre", "Situación", "Oficio", "Hijos"],
    rows,
    summary,
  };
};

const createCustomDataset = (
  families: Family[],
  filters: ReportFilters,
  selectedFieldIds: string[],
  reportType: CustomReportType,
  periodLabel: string,
): ReportDataset => {
  const selectedFields = CUSTOM_FIELD_DEFINITIONS.filter((field) => selectedFieldIds.includes(field.id));
  const columns = selectedFields.map((field) => field.label);

  const rows = families.map((family) =>
    selectedFields.reduce<Record<string, string | number>>((acc, field) => {
      acc[field.label] = field.resolver(family);
      return acc;
    }, {}),
  );

  const familiesCount = families.length;
  const disabilityCount = families.filter((family) => family.discapacidad).length;
  const programCount = families.filter((family) => family.programasSociales.length > 0).length;
  const totalChildren = families.reduce((total, family) => total + family.hijos, 0);
  const averageChildren = familiesCount > 0 ? (totalChildren / familiesCount).toFixed(1) : "0";

  const summary: DatasetSummaryItem[] = [
    { label: "Familias incluidas", value: String(familiesCount) },
    { label: "Con discapacidad", value: String(disabilityCount) },
    { label: "Con programas sociales", value: String(programCount) },
  ];

  if (reportType !== "resumen") {
    summary.push({ label: "Promedio de hijos", value: String(averageChildren) });
  }

  return {
    title: `Reporte personalizado - ${customTypeLabels[reportType]}`,
    subtitle: `Período: ${periodLabel} · Filtros: ${describeFilters(filters)} · Campos: ${columns.length}`,
    columns,
    rows,
    summary,
  };
};

const buildInitialRecentReports = (families: Family[]): GeneratedReport[] => {
  const filters = createDefaultFilters();
  const filteredFamilies = applyFilters(families, filters);

  const now = Date.now();
  const entry = (
    templateId: number,
    hoursAgo: number,
    format: ReportFormat,
    name: string,
    dataset: ReportDataset,
    generatedBy: string,
  ): GeneratedReport => ({
    id: createReportId(),
    name,
    generatedAt: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString(),
    generatedBy,
    format,
    status: "Completado",
    type: "template",
    templateId,
    appliedFilters: { ...filters },
    dataset: cloneDataset(dataset),
  });

  const generalDataset = createGeneralDataset(filteredFamilies, filters);
  const disabilityDataset = createDisabilityDataset(filteredFamilies, filters);
  const programsDataset = createProgramsDataset(filteredFamilies, filters);

  return [
    entry(1, 2, "PDF", "Reporte Mensual - General", generalDataset, "Ana Rodríguez"),
    entry(2, 26, "Excel", "Análisis Trimestral Q4", disabilityDataset, "Carlos Gómez"),
    entry(3, 48, "PDF", "Reporte de Programas Sociales", programsDataset, "María Torres"),
  ].sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
};

interface ReportsProps {
  families: Family[];
}

export function Reports({ families }: ReportsProps) {
  const [timeframe, setTimeframe] = useState<TimeframeValue>("mes");
  const [reportFilters, setReportFilters] = useState<ReportFilters>(() => createDefaultFilters());
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [customReportType, setCustomReportType] = useState<CustomReportType>("general");
  const [customReportFormat, setCustomReportFormat] = useState<ReportFormat>("PDF");
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>("actual");
  const [customSelectedFields, setCustomSelectedFields] = useState<string[]>(
    () => CUSTOM_FIELD_DEFINITIONS.filter((field) => field.defaultSelected).map((field) => field.id),
  );
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({ email: "", when: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [recentReports, setRecentReports] = useState<GeneratedReport[]>(() => buildInitialRecentReports(families));

  const barrioOptions = useMemo(() => getUniqueBarrios(families), [families]);
  const programOptions = useMemo(() => getProgramOptions(families), [families]);

  const filteredFamilies = useMemo(() => applyFilters(families, reportFilters), [families, reportFilters]);

  const lastGeneratedForTemplate = useCallback(
    (templateId: number): string => {
      const latest = recentReports
        .filter((report) => report.templateId === templateId && report.status === "Completado")
        .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())[0];

      return latest ? formatRelativeTimeFromNow(latest.generatedAt) : "Sin registros recientes";
    },
    [recentReports],
  );

  const templateCards = useMemo(
    () => [
      {
        id: 1,
        name: "Reporte General de Familias",
        description: "Listado completo con todas las familias registradas",
        icon: Users,
        color: "blue",
        records: filteredFamilies.length,
        lastGenerated: lastGeneratedForTemplate(1),
      },
      {
        id: 2,
        name: "Familias con Discapacidad",
        description: "Casos que requieren seguimiento especial",
        icon: TrendingUp,
        color: "orange",
        records: filteredFamilies.filter((family) => family.discapacidad).length,
        lastGenerated: lastGeneratedForTemplate(2),
      },
      {
        id: 3,
        name: "Programas Sociales Activos",
        description: "Distribución por tipo de programa social",
        icon: FileSpreadsheet,
        color: "green",
        records: filteredFamilies.filter((family) => family.programasSociales.length > 0).length,
        lastGenerated: lastGeneratedForTemplate(3),
      },
      {
        id: 4,
        name: "Situación Laboral",
        description: "Análisis de empleo y desempleo",
        icon: FileText,
        color: "purple",
        records: filteredFamilies.length,
        lastGenerated: lastGeneratedForTemplate(4),
      },
    ],
    [filteredFamilies, lastGeneratedForTemplate],
  );

  const filteredRecentReports = useMemo(() => {
    const scoped = filterReportsByTimeframe(recentReports, timeframe);
    return scoped.slice().sort((a, b) => new Date(getReportReferenceDate(b)).getTime() - new Date(getReportReferenceDate(a)).getTime());
  }, [recentReports, timeframe]);

  const stats = useMemo(() => {
    const total = recentReports.length;
    const completed = recentReports.filter((report) => report.status === "Completado").length;
    const scheduled = recentReports.filter((report) => report.status === "Programado").length;
    const month = recentReports.filter((report) => isWithinTimeframe(getReportReferenceDate(report), "mes")).length;

    return {
      total,
      month,
      completed,
      scheduled,
    };
  }, [recentReports]);

  const hasActiveFilters = reportFilters.barrio !== "todos" || reportFilters.trabaja !== "todos" || reportFilters.discapacidad !== "todos" || reportFilters.programa !== "todos";

  const buildTemplateDataset = useCallback(
    (templateId: number): ReportDataset => {
      switch (templateId) {
        case 1:
          return createGeneralDataset(filteredFamilies, reportFilters);
        case 2:
          return createDisabilityDataset(filteredFamilies, reportFilters);
        case 3:
          return createProgramsDataset(filteredFamilies, reportFilters);
        case 4:
          return createLaborDataset(filteredFamilies, reportFilters);
        default:
          return createGeneralDataset(filteredFamilies, reportFilters);
      }
    },
    [filteredFamilies, reportFilters],
  );

  const handleTemplateDownload = useCallback(
    (templateId: number, format: ReportFormat) => {
      const template = templateCards.find((item) => item.id === templateId);
      if (!template) {
        toast.error("No se encontró la plantilla seleccionada.");
        return;
      }

      const dataset = buildTemplateDataset(templateId);

      if (dataset.rows.length === 0) {
        toast.warning("No hay datos para generar este reporte con los filtros aplicados.");
        return;
      }

      const timestamp = new Date().toISOString();
      const filename = `${slugify(`${template.name}`)}-${timestamp.slice(0, 10)}`;

      downloadReportFile(format, dataset, filename);

      const filtersSnapshot = { ...reportFilters };

      setRecentReports((prev) => [
        {
          id: createReportId(),
          name: template.name,
          generatedAt: timestamp,
          generatedBy: "Coordinación",
          format,
          status: "Completado",
          type: "template",
          templateId,
          appliedFilters: filtersSnapshot,
          dataset: cloneDataset(dataset),
        },
        ...prev,
      ]);

      toast.success(`${template.name} generado en formato ${format}.`);
    },
    [buildTemplateDataset, reportFilters, templateCards],
  );

  const handleTemplatePrint = useCallback(
    (templateId: number) => {
      const template = templateCards.find((item) => item.id === templateId);
      if (!template) {
        toast.error("No se encontró la plantilla seleccionada.");
        return;
      }

      const dataset = buildTemplateDataset(templateId);
      if (dataset.rows.length === 0) {
        toast.warning("No hay datos que imprimir con los filtros actuales.");
        return;
      }

      const success = openPrintPreview(dataset);
      if (!success) {
        toast.error("No se pudo abrir la vista de impresión (verifica el bloqueador de ventanas emergentes).");
      }
    },
    [buildTemplateDataset, templateCards],
  );

  const handleToggleField = useCallback((fieldId: string, checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setCustomSelectedFields((prev) => {
      if (isChecked) {
        if (prev.includes(fieldId)) {
          return prev;
        }
        return [...prev, fieldId];
      }

      if (!isChecked) {
        if (prev.length === 1 && prev[0] === fieldId) {
          toast.warning("Debes mantener al menos un campo seleccionado.");
          return prev;
        }
        return prev.filter((id) => id !== fieldId);
      }

      return prev;
    });
  }, []);

  const handleGenerateCustomReport = useCallback(() => {
    if (customSelectedFields.length === 0) {
      toast.warning("Selecciona al menos un campo para tu reporte.");
      return;
    }

    if (filteredFamilies.length === 0) {
      toast.warning("No hay familias que coincidan con los filtros seleccionados.");
      return;
    }

    const dataset = createCustomDataset(filteredFamilies, reportFilters, customSelectedFields, customReportType, dateRangeLabels[customDateRange]);
    const timestamp = new Date().toISOString();
    const filename = `${slugify(dataset.title)}-${timestamp.slice(0, 10)}`;

    downloadReportFile(customReportFormat, dataset, filename);

    setRecentReports((prev) => [
      {
        id: createReportId(),
        name: dataset.title,
        generatedAt: timestamp,
        generatedBy: "Coordinación",
        format: customReportFormat,
        status: "Completado",
        type: "custom",
        appliedFilters: { ...reportFilters },
        dataset: cloneDataset(dataset),
      },
      ...prev,
    ]);

    toast.success(`Reporte personalizado generado en formato ${customReportFormat}.`);
  }, [customSelectedFields, filteredFamilies, reportFilters, customReportType, customDateRange, customReportFormat]);

  const handleDownloadStoredReport = useCallback((report: GeneratedReport) => {
    if (!report.dataset || report.dataset.rows.length === 0) {
      toast.warning("No hay datos disponibles para descargar este reporte.");
      return;
    }

    const filename = `${slugify(report.name)}-${new Date().toISOString().slice(0, 10)}`;
    downloadReportFile(report.format, report.dataset, filename);
    toast.success(`Descargaste ${report.name}.`);
  }, []);

  const handlePrintStoredReport = useCallback((report: GeneratedReport) => {
    if (!report.dataset || report.dataset.rows.length === 0) {
      toast.warning("No hay datos disponibles para imprimir.");
      return;
    }

    const success = openPrintPreview(report.dataset);
    if (!success) {
      toast.error("No se pudo abrir la vista de impresión (verifica el bloqueador de ventanas emergentes).");
    }
  }, []);

  const handleExportReports = useCallback(() => {
    if (recentReports.length === 0) {
      toast.warning("No hay reportes para exportar.");
      return;
    }

    const payload = JSON.stringify(recentReports, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reportes-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Reportes exportados en formato JSON.");
  }, [recentReports]);

  const triggerImportDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      try {
        const content = await file.text();
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
          throw new Error("Formato inválido");
        }

        const sanitized = parsed
          .map(sanitizeImportedReport)
          .filter((report): report is GeneratedReport => Boolean(report));

        if (sanitized.length === 0) {
          toast.warning("No se encontraron reportes válidos en el archivo.");
        } else {
          setRecentReports(
            sanitized
              .map((report) => ({ ...report, dataset: cloneDataset(report.dataset), appliedFilters: normalizeFilters(report.appliedFilters) }))
              .sort((a, b) => new Date(getReportReferenceDate(b)).getTime() - new Date(getReportReferenceDate(a)).getTime()),
          );
          toast.success(`Se importaron ${sanitized.length} reportes.`);
        }
      } catch (error) {
        console.error(error);
        toast.error("No se pudo importar el archivo. Verifica que tenga el formato correcto.");
      } finally {
        event.target.value = "";
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleImportRequest = () => triggerImportDialog();
    const handleExportRequest = () => handleExportReports();

    window.addEventListener("reports:import", handleImportRequest);
    window.addEventListener("reports:export", handleExportRequest);

    return () => {
      window.removeEventListener("reports:import", handleImportRequest);
      window.removeEventListener("reports:export", handleExportRequest);
    };
  }, [handleExportReports, triggerImportDialog]);

  const resetFilters = useCallback(() => {
    setReportFilters(createDefaultFilters());
  }, []);

  const handleScheduleReport = useCallback(() => {
    if (!scheduleForm.email || !scheduleForm.email.includes("@")) {
      toast.error("Ingresá un correo válido para programar el envío.");
      return;
    }

    if (!scheduleForm.when) {
      toast.error("Seleccioná una fecha y hora de envío.");
      return;
    }

    const scheduledDate = new Date(scheduleForm.when);
    if (Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now()) {
      toast.error("La fecha programada debe ser posterior al momento actual.");
      return;
    }

    if (filteredFamilies.length === 0) {
      toast.warning("No hay datos para programar el envío con los filtros seleccionados.");
      return;
    }

    const dataset = createCustomDataset(filteredFamilies, reportFilters, customSelectedFields, customReportType, dateRangeLabels[customDateRange]);

    setRecentReports((prev) => [
      {
        id: createReportId(),
        name: `Reporte programado - ${customTypeLabels[customReportType]}`,
        generatedAt: new Date().toISOString(),
        generatedBy: "Coordinación",
        format: customReportFormat,
        status: "Programado",
        type: "custom",
        appliedFilters: { ...reportFilters },
        dataset: cloneDataset(dataset),
        scheduledFor: scheduledDate.toISOString(),
      },
      ...prev,
    ]);

    setScheduleDialogOpen(false);
    setScheduleForm({ email: "", when: "" });
    toast.success(`Envío programado para ${formatDateTime(scheduledDate.toISOString())}.`);
  }, [
    scheduleForm,
    filteredFamilies,
    reportFilters,
    customSelectedFields,
    customReportType,
    customDateRange,
    customReportFormat,
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="mb-1 text-foreground">Centro de Reportes</h2>
          <p className="text-muted-foreground">Genera, exporta e imprime reportes personalizados</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as TimeframeValue)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Esta semana</SelectItem>
              <SelectItem value="mes">Este mes</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="año">Año</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className={cn("gap-2 relative", hasActiveFilters && "border-sky-400 text-sky-600")}
            onClick={() => setFiltersDialogOpen(true)}
          >
            <Filter className="size-4" />
            Filtros
            {hasActiveFilters && <span className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full bg-sky-500" />}
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {reportFilters.barrio !== "todos" && <Badge variant="secondary">Barrio: {reportFilters.barrio}</Badge>}
          {reportFilters.trabaja !== "todos" && <Badge variant="secondary">Trabajo: {reportFilters.trabaja === "si" ? "Trabaja" : "No trabaja"}</Badge>}
          {reportFilters.discapacidad !== "todos" && (
            <Badge variant="secondary">Discapacidad: {reportFilters.discapacidad === "si" ? "Sí" : "No"}</Badge>
          )}
          {reportFilters.programa !== "todos" && (
            <Badge variant="secondary">
              {reportFilters.programa === "sin-programas" ? "Sin programas sociales" : `Programa: ${reportFilters.programa}`}
            </Badge>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {templateCards.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="group p-4 sm:p-6 transition-all duration-200 hover:shadow-lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
                    templateColorStyles[template.color]?.bg ?? "bg-primary/10",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-7",
                      templateColorStyles[template.color]?.icon ?? "text-primary",
                    )}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-foreground">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-transparent",
                        templateColorStyles[template.color]?.badge ?? "bg-primary/10 text-primary",
                      )}
                    >
                      {template.records} registros
                    </Badge>
                    <span className="text-xs text-muted-foreground">{template.lastGenerated}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                      onClick={() => handleTemplateDownload(template.id, "PDF")}
                    >
                      <Download className="size-4" />
                      Generar PDF
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => handleTemplateDownload(template.id, "Excel")}>
                      <FileSpreadsheet className="size-4" />
                      Excel
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-2" onClick={() => handleTemplatePrint(template.id)}>
                      <Printer className="size-4" />
                      Imprimir
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-6">
          <h3 className="mb-1 text-foreground">Crear Reporte Personalizado</h3>
          <p className="text-sm text-muted-foreground">Selecciona el tipo, formato, período y campos a incluir en tu reporte.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Tipo de reporte</label>
            <Select value={customReportType} onValueChange={(value) => setCustomReportType(value as CustomReportType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="detallado">Detallado</SelectItem>
                <SelectItem value="resumen">Resumen ejecutivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Formato</label>
            <Select value={customReportFormat.toLowerCase()} onValueChange={(value) => setCustomReportFormat(value.toUpperCase() as ReportFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="word">Word</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Fecha</label>
            <Select value={customDateRange} onValueChange={(value) => setCustomDateRange(value as CustomDateRange)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actual">Período actual</SelectItem>
                <SelectItem value="anterior">Período anterior</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-2 block text-sm text-muted-foreground">Campos a incluir</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CUSTOM_FIELD_DEFINITIONS.map((field) => (
                <div key={field.id} className="flex items-start gap-2">
                  <Checkbox
                    id={`field-${field.id}`}
                    checked={customSelectedFields.includes(field.id)}
                    onCheckedChange={(checked) => handleToggleField(field.id, checked)}
                  />
                  <Label htmlFor={`field-${field.id}`} className="text-sm leading-5 text-foreground">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 sm:w-auto"
            onClick={handleGenerateCustomReport}
          >
            <FileText className="size-4" />
            Generar Reporte
          </Button>
          <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={() => setScheduleDialogOpen(true)}>
            <Mail className="size-4" />
            Programar envío
          </Button>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="mb-6">
          <h3 className="mb-1 text-foreground">Reportes Recientes</h3>
          <p className="text-sm text-muted-foreground">Historial de reportes generados o programados.</p>
        </div>
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <Table className="min-w-[760px] sm:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del reporte</TableHead>
                <TableHead>Fecha y hora</TableHead>
                <TableHead>Generado por</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecentReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    No hay reportes para el período seleccionado.
                  </TableCell>
                </TableRow>
              )}
              {filteredRecentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(report.scheduledFor ?? report.generatedAt)}</TableCell>
                  <TableCell className="text-muted-foreground">{report.generatedBy}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.format}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "border-transparent",
                        report.status === "Completado" ? "bg-emerald-500/15 text-emerald-600" : "bg-sky-500/15 text-sky-600",
                      )}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" className="gap-2" onClick={() => handleDownloadStoredReport(report)}>
                        <Download className="size-4" />
                        Descargar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handlePrintStoredReport(report)}>
                        <Printer className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/15">
              <FileText className="size-5 text-sky-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total reportes</p>
              <p className="text-lg font-semibold text-foreground">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
              <Calendar className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Este mes</p>
              <p className="text-lg font-semibold text-foreground">{stats.month}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/15">
              <Download className="size-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Descargas</p>
              <p className="text-lg font-semibold text-foreground">{stats.completed}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15">
              <Mail className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Programados</p>
              <p className="text-lg font-semibold text-foreground">{stats.scheduled}</p>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={filtersDialogOpen} onOpenChange={setFiltersDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filtros de reportes</DialogTitle>
            <DialogDescription>Refiná los datos que se incluyen en tus reportes.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="filter-barrio">Barrio</Label>
              <Select value={reportFilters.barrio} onValueChange={(value) => setReportFilters((prev) => ({ ...prev, barrio: value }))}>
                <SelectTrigger id="filter-barrio">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {barrioOptions.map((barrio) => (
                    <SelectItem key={barrio} value={barrio}>
                      {barrio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-trabaja">Situación laboral</Label>
              <Select value={reportFilters.trabaja} onValueChange={(value) => setReportFilters((prev) => ({ ...prev, trabaja: value as BinaryFilter }))}>
                <SelectTrigger id="filter-trabaja">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="si">Trabaja</SelectItem>
                  <SelectItem value="no">No trabaja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-discapacidad">Discapacidad</Label>
              <Select
                value={reportFilters.discapacidad}
                onValueChange={(value) => setReportFilters((prev) => ({ ...prev, discapacidad: value as BinaryFilter }))}
              >
                <SelectTrigger id="filter-discapacidad">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="si">Con discapacidad</SelectItem>
                  <SelectItem value="no">Sin discapacidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-programa">Programa social</Label>
              <Select value={reportFilters.programa} onValueChange={(value) => setReportFilters((prev) => ({ ...prev, programa: value }))}>
                <SelectTrigger id="filter-programa">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="sin-programas">Sin programas</SelectItem>
                  {programOptions.map((programa) => (
                    <SelectItem key={programa} value={programa}>
                      {programa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={resetFilters}>
              Restablecer filtros
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setFiltersDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setFiltersDialogOpen(false)}>Aplicar filtros</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={scheduleDialogOpen}
        onOpenChange={(open) => {
          setScheduleDialogOpen(open);
          if (!open) {
            setScheduleForm({ email: "", when: "" });
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Programar envío</DialogTitle>
            <DialogDescription>Configura el envío automático del reporte personalizado seleccionado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-email">Correo destinatario</Label>
              <Input
                id="schedule-email"
                type="email"
                placeholder="coordinacion@organizacion.org"
                value={scheduleForm.email}
                onChange={(event) => setScheduleForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-when">Fecha y hora de envío</Label>
              <Input
                id="schedule-when"
                type="datetime-local"
                value={scheduleForm.when}
                onChange={(event) => setScheduleForm((prev) => ({ ...prev, when: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleScheduleReport}>Programar envío</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
