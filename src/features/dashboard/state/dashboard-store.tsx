"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { useToast } from "@/components/ui/toast";
import type { BusinessDraft } from "@/features/catalog/lib/business-form";
import { useRowFeedback } from "@/lib/use-row-feedback";
import type { Business, Category, ContactRequest, ContactRequestStatus, Offering, OfferingKind } from "@/types";

/**
 * Estado de DEMOSTRACIÓN del área del emprendedor: su negocio, su oferta y sus solicitudes. Vive en memoria mientras el
 * área está abierta (compartido por todas sus secciones, así el resumen siempre coincide con el detalle). No se guarda
 * en ningún servidor. Con el backend, cada acción pasa a ser una llamada a la API (ver docs/INTEGRACION-BACKEND.md).
 */
export interface DashboardState {
  business: Business;
  offerings: Offering[];
  requests: ContactRequest[];
  categories: Category[];
  locations: string[];
}

export interface OfferingDraft {
  kind: OfferingKind;
  name: string;
  description: string;
  priceClp?: number;
}

type Action =
  | { type: "business/update"; item: Business }
  | { type: "offering/upsert"; item: Offering; at?: "start" | "end" }
  | { type: "offering/remove"; id: string }
  | { type: "request/upsert"; item: ContactRequest };

function upsert<T extends { id: string }>(list: T[], item: T, at: "start" | "end"): T[] {
  if (list.some((x) => x.id === item.id)) return list.map((x) => (x.id === item.id ? item : x));
  return at === "start" ? [item, ...list] : [...list, item];
}

function reducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case "business/update":
      return { ...state, business: action.item };
    case "offering/upsert":
      return { ...state, offerings: upsert(state.offerings, action.item, action.at ?? "end") };
    case "offering/remove":
      return { ...state, offerings: state.offerings.filter((o) => o.id !== action.id) };
    case "request/upsert":
      return { ...state, requests: upsert(state.requests, action.item, "end") };
  }
}

export interface DashboardActions {
  updateBusiness: (draft: BusinessDraft) => Promise<void>;
  addOffering: (draft: OfferingDraft) => Promise<void>;
  updateOffering: (offering: Offering, draft: OfferingDraft) => Promise<void>;
  removeOffering: (offering: Offering) => Promise<void>;
  setRequestStatus: (request: ContactRequest, status: ContactRequestStatus) => Promise<void>;
}

interface DashboardContextValue extends DashboardState {
  actions: DashboardActions;
  isPending: (id: string) => boolean;
  isRecent: (id: string) => boolean;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard debe usarse dentro de <DashboardProvider>");
  return ctx;
}

const requestVerb: Record<ContactRequestStatus, string> = {
  answered: "Marcada como respondida",
  archived: "Solicitud archivada",
  new: "Solicitud restaurada",
};

export function DashboardProvider({ initial, children }: { initial: DashboardState; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const { notify } = useToast();
  const { run, isPending, isRecent } = useRowFeedback();

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const actions = useMemo<DashboardActions>(() => {
    const announce = (message: string, undo?: () => void) =>
      notify(message, { action: undo ? { label: "Deshacer", onClick: undo } : undefined });

    return {
      async updateBusiness(draft) {
        const previous = stateRef.current.business;
        await run(previous.id, () => dispatch({ type: "business/update", item: { ...previous, ...draft } }));
        announce("Perfil actualizado", () => dispatch({ type: "business/update", item: previous }));
      },

      async addOffering(draft) {
        const id = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
        await run(id, () =>
          dispatch({
            type: "offering/upsert",
            item: { id, businessId: stateRef.current.business.id, ...draft },
            at: "end",
          }),
        );
        announce(`Agregado: ${draft.name}`, () => dispatch({ type: "offering/remove", id }));
      },

      async updateOffering(offering, draft) {
        await run(offering.id, () => dispatch({ type: "offering/upsert", item: { ...offering, ...draft } }));
        announce(`Cambios guardados: ${draft.name}`, () => dispatch({ type: "offering/upsert", item: offering }));
      },

      async removeOffering(offering) {
        const index = stateRef.current.offerings.findIndex((o) => o.id === offering.id);
        await run(offering.id, () => dispatch({ type: "offering/remove", id: offering.id }));
        announce(`Eliminado: ${offering.name}`, () =>
          // Se restaura al final; el orden original solo importa visualmente.
          dispatch({ type: "offering/upsert", item: offering, at: index === 0 ? "start" : "end" }),
        );
      },

      async setRequestStatus(request, status) {
        const previous = request.status;
        await run(request.id, () => dispatch({ type: "request/upsert", item: { ...request, status } }));
        announce(`${requestVerb[status]}: ${request.fromName}`, () =>
          dispatch({ type: "request/upsert", item: { ...request, status: previous } }),
        );
      },
    };
  }, [notify, run]);

  const value = useMemo<DashboardContextValue>(
    () => ({ ...state, actions, isPending, isRecent }),
    [state, actions, isPending, isRecent],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
