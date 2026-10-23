import type { Offering } from "@/types";

/** DATOS FICTICIOS. Precios referenciales de demostración. */
export const offerings: Offering[] = [
  { id: "o01", businessId: "b01", kind: "product", name: "Café en grano 250 g", description: "Tostado medio, origen único.", priceClp: 7500 },
  { id: "o02", businessId: "b01", kind: "service", name: "Suscripción para oficinas", description: "Entrega mensual según consumo del equipo." },
  { id: "o03", businessId: "b02", kind: "product", name: "Pan de masa madre", description: "Hogaza de 800 g, fermentación de 24 horas.", priceClp: 4200 },
  { id: "o04", businessId: "b02", kind: "product", name: "Torta por encargo", description: "Diferentes sabores, 10 a 20 porciones.", priceClp: 28000 },
  { id: "o05", businessId: "b03", kind: "product", name: "Set de tazas (4)", description: "Esmalte natural, aptas para lavavajillas.", priceClp: 32000 },
  { id: "o06", businessId: "b03", kind: "service", name: "Taller de iniciación", description: "Dos horas, grupos de hasta seis personas.", priceClp: 18000 },
  { id: "o07", businessId: "b04", kind: "product", name: "Manta de lana", description: "Tejida en telar, 140 x 200 cm.", priceClp: 65000 },
  { id: "o08", businessId: "b05", kind: "service", name: "Arreglos y ajustes", description: "Bastas, cierres y ajustes de talla." },
  { id: "o09", businessId: "b06", kind: "service", name: "Inicio de actividades", description: "Trámite completo y orientación inicial.", priceClp: 45000 },
  { id: "o10", businessId: "b07", kind: "service", name: "Pack identidad visual", description: "Logotipo, paleta y tipografías en manual breve.", priceClp: 220000 },
  { id: "o11", businessId: "b08", kind: "service", name: "Sitio web con tienda", description: "Hasta 30 productos, pasarela a cotizar." },
  { id: "o12", businessId: "b09", kind: "service", name: "Excursión de día completo", description: "Transporte y guía incluidos.", priceClp: 38000 },
  { id: "o13", businessId: "b10", kind: "product", name: "Caja semanal mediana", description: "Entre 6 y 8 tipos de hortalizas de temporada.", priceClp: 14000 },
  { id: "o14", businessId: "b11", kind: "product", name: "Miel 500 g", description: "Miel multifloral cosechada en la zona.", priceClp: 6500 },
  { id: "o15", businessId: "b12", kind: "service", name: "Reparación de calzado", description: "Cambio de suela y costuras." },
];
