"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { useToast } from "@/components/ui/toast";
import type { BusinessDraft } from "@/features/catalog/lib/business-form";
import { slugify } from "@/lib/text";
import { useRowFeedback } from "@/lib/use-row-feedback";
import type {
  ActivityArea,
  ActivityEntry,
  Business,
  Category,
  Opportunity,
  OpportunityStatus,
  OpportunityType,
  ReviewStatus,
} from "@/types";

/**
 * Estado de DEMOSTRACIÓN del panel de administración. Vive en memoria mientras el panel está abierto
 * (compartido por todas sus secciones) y registra cada acción en la bitácora. No se guarda en ningún servidor.
 * Con el backend, cada acción pasa a ser una llamada a la API con autorización en servidor (ver docs/INTEGRACION-BACKEND.md).
 * Cada acción simula la latencia de una llamada, avisa con un mensaje y, cuando se puede, ofrece «Deshacer».
 */
export interface AdminState {
  businesses: Business[];
  opportunities: Opportunity[];
  categories: Category[];
  activity: ActivityEntry[];
  /** Sectores disponibles para clasificar emprendimientos. */
  locations: string[];
}

export interface OpportunityDraft {
  title: string;
  type: OpportunityType;
  summary: string;
  description: string;
  organization: string;
  startDate: string;
  deadline?: string;
  requirements: string[];
  url: string;
  status: OpportunityStatus;
  published: boolean;
}

export type AdminBusinessDraft = BusinessDraft & { status: ReviewStatus; foundedYear?: number };

type Action =
  | { type: "business/upsert"; item: Business; at?: "start" | "end" }
  | { type: "business/remove"; id: string }
  | { type: "opportunity/upsert"; item: Opportunity; at?: "start" | "end" }
  | { type: "opportunity/remove"; id: string }
  | { type: "category/upsert"; item: Category; at?: "start" | "end" }
  | { type: "category/remove"; id: string }
  | { type: "log"; entry: ActivityEntry };

function upsert<T extends { id: string }>(list: T[], item: T, at: "start" | "end"): T[] {
  if (list.some((x) => x.id === item.id)) return list.map((x) => (x.id === item.id ? item : x));
  return at === "start" ? [item, ...list] : [...list, item];
}

function reducer(state: AdminState, action: Action): AdminState {
  switch (action.type) {
    case "business/upsert":
      return { ...state, businesses: upsert(state.businesses, action.item, action.at ?? "end") };
    case "business/remove":
      return { ...state, businesses: state.businesses.filter((b) => b.id !== action.id) };
    case "opportunity/upsert":
      return { ...state, opportunities: upsert(state.opportunities, action.item, action.at ?? "start") };
    case "opportunity/remove":
      return { ...state, opportunities: state.opportunities.filter((o) => o.id !== action.id) };
    case "category/upsert":
      return { ...state, categories: upsert(state.categories, action.item, action.at ?? "end") };
    case "category/remove":
      return { ...state, categories: state.categories.filter((c) => c.id !== action.id) };
    case "log":
      return { ...state, activity: [action.entry, ...state.activity] };
  }
}

export interface AdminActions {
  setBusinessStatus: (business: Business, status: ReviewStatus) => Promise<void>;
  addBusiness: (draft: AdminBusinessDraft) => Promise<void>;
  updateBusiness: (business: Business, draft: AdminBusinessDraft) => Promise<void>;
  removeBusiness: (business: Business) => Promise<void>;
  addOpportunity: (draft: OpportunityDraft) => Promise<void>;
  updateOpportunity: (item: Opportunity, draft: OpportunityDraft) => Promise<void>;
  setOpportunityPublished: (item: Opportunity, published: boolean) => Promise<void>;
  setOpportunityStatus: (item: Opportunity, status: OpportunityStatus) => Promise<void>;
  removeOpportunity: (item: Opportunity) => Promise<void>;
  addCategory: (name: string, description: string) => Promise<void>;
  updateCategory: (category: Category, name: string, description: string) => Promise<void>;
  /** Devuelve false si el rubro tiene emprendimientos y no puede eliminarse. */
  removeCategory: (category: Category) => Promise<boolean>;
}

interface AdminContextValue extends AdminState {
  actions: AdminActions;
  /** true mientras una acción sobre ese id está en curso. */
  isPending: (id: string) => boolean;
  /** true durante un instante tras cambiar ese id (para resaltarlo). */
  isRecent: (id: string) => boolean;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin debe usarse dentro de <AdminProvider>");
  return ctx;
}

const ACTOR = "Admin demo";

/** Fecha y hora local en formato yyyy-mm-ddThh:mm (solo se llama desde manejadores de eventos). */
function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function entry(area: ActivityArea, action: string, target: string): ActivityEntry {
  const at = nowStamp();
  return { id: `${at}-${Math.random().toString(36).slice(2, 7)}`, area, at, actor: ACTOR, action, target };
}

function localId(): string {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function uniqueSlug(base: string, taken: Set<string>): string {
  const root = slugify(base) || "elemento";
  let slug = root;
  for (let i = 2; taken.has(slug); i++) slug = `${root}-${i}`;
  return slug;
}

export function AdminProvider({ initial, children }: { initial: AdminState; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const { notify } = useToast();
  const { run, isPending, isRecent } = useRowFeedback();

  // Referencia al estado más reciente: las acciones la leen para saber el valor previo (necesario para «Deshacer»).
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const actions = useMemo<AdminActions>(() => {
    const log = (area: ActivityArea, action: string, target: string) =>
      dispatch({ type: "log", entry: entry(area, action, target) });

    /** Muestra el aviso y, si hay función de reversa, ofrece «Deshacer» (que también queda en la bitácora). */
    const announce = (message: string, area: ActivityArea, target: string, undo?: () => void) =>
      notify(message, {
        action: undo
          ? {
              label: "Deshacer",
              onClick: () => {
                undo();
                log(area, "Deshizo el último cambio", target);
              },
            }
          : undefined,
      });

    const businessSlugs = (ignoreId?: string) =>
      new Set(stateRef.current.businesses.filter((b) => b.id !== ignoreId).map((b) => b.slug));
    const opportunitySlugs = (ignoreId?: string) =>
      new Set(stateRef.current.opportunities.filter((o) => o.id !== ignoreId).map((o) => o.slug));

    return {
      async setBusinessStatus(business, status) {
        const previous = business.status;
        const verb = { approved: "Aprobó perfil", hidden: "Ocultó perfil", pending: "Devolvió a revisión" }[status];
        await run(business.id, () => {
          dispatch({ type: "business/upsert", item: { ...business, status } });
          log("business", verb, business.name);
        });
        announce(`${verb}: ${business.name}`, "business", business.name, () =>
          dispatch({ type: "business/upsert", item: { ...business, status: previous } }),
        );
      },

      async addBusiness(draft) {
        const id = localId();
        await run(id, () => {
          const { status, foundedYear, ...fields } = draft;
          const item: Business = {
            id,
            slug: uniqueSlug(fields.name, businessSlugs()),
            foundedYear: foundedYear ?? new Date().getFullYear(),
            status,
            ...fields,
          };
          dispatch({ type: "business/upsert", item, at: "start" });
          log("business", "Creó emprendimiento", item.name);
        });
        announce(`Emprendimiento creado: ${draft.name}`, "business", draft.name, () =>
          dispatch({ type: "business/remove", id }),
        );
      },

      async updateBusiness(business, draft) {
        await run(business.id, () => {
          const { status, foundedYear, ...fields } = draft;
          dispatch({
            type: "business/upsert",
            item: { ...business, ...fields, status, foundedYear: foundedYear ?? business.foundedYear },
          });
          log("business", "Editó emprendimiento", fields.name);
        });
        announce(`Cambios guardados: ${draft.name}`, "business", draft.name, () =>
          dispatch({ type: "business/upsert", item: business }),
        );
      },

      async removeBusiness(business) {
        await run(business.id, () => {
          dispatch({ type: "business/remove", id: business.id });
          log("business", "Eliminó emprendimiento", business.name);
        });
        announce(`Emprendimiento eliminado: ${business.name}`, "business", business.name, () =>
          dispatch({ type: "business/upsert", item: business, at: "start" }),
        );
      },

      async addOpportunity(draft) {
        const id = localId();
        await run(id, () => {
          dispatch({
            type: "opportunity/upsert",
            item: { id, slug: uniqueSlug(draft.title, opportunitySlugs()), ...draft },
            at: "start",
          });
          log("opportunity", "Creó oportunidad", draft.title);
        });
        announce(`Oportunidad creada: ${draft.title}`, "opportunity", draft.title, () =>
          dispatch({ type: "opportunity/remove", id }),
        );
      },

      async updateOpportunity(item, draft) {
        await run(item.id, () => {
          dispatch({
            type: "opportunity/upsert",
            item: { ...item, ...draft, slug: uniqueSlug(draft.title, opportunitySlugs(item.id)) },
          });
          log("opportunity", "Editó oportunidad", draft.title);
        });
        announce(`Cambios guardados: ${draft.title}`, "opportunity", draft.title, () =>
          dispatch({ type: "opportunity/upsert", item }),
        );
      },

      async setOpportunityPublished(item, published) {
        const verb = published ? "Publicó oportunidad" : "Despublicó oportunidad";
        await run(item.id, () => {
          dispatch({ type: "opportunity/upsert", item: { ...item, published } });
          log("opportunity", verb, item.title);
        });
        announce(`${verb}: ${item.title}`, "opportunity", item.title, () =>
          dispatch({ type: "opportunity/upsert", item }),
        );
      },

      async setOpportunityStatus(item, status) {
        const verb = { closed: "Cerró oportunidad", open: "Reabrió oportunidad", upcoming: "Marcó como próxima" }[status];
        await run(item.id, () => {
          dispatch({ type: "opportunity/upsert", item: { ...item, status } });
          log("opportunity", verb, item.title);
        });
        announce(`${verb}: ${item.title}`, "opportunity", item.title, () =>
          dispatch({ type: "opportunity/upsert", item }),
        );
      },

      async removeOpportunity(item) {
        await run(item.id, () => {
          dispatch({ type: "opportunity/remove", id: item.id });
          log("opportunity", "Eliminó oportunidad", item.title);
        });
        announce(`Oportunidad eliminada: ${item.title}`, "opportunity", item.title, () =>
          dispatch({ type: "opportunity/upsert", item, at: "start" }),
        );
      },

      async addCategory(name, description) {
        const item: Category = { id: localId(), name: name.trim(), description: description.trim() };
        await run(item.id, () => {
          dispatch({ type: "category/upsert", item });
          log("category", "Creó rubro", item.name);
        });
        announce(`Rubro creado: ${item.name}`, "category", item.name, () =>
          dispatch({ type: "category/remove", id: item.id }),
        );
      },

      async updateCategory(category, name, description) {
        const next: Category = { ...category, name: name.trim(), description: description.trim() };
        await run(category.id, () => {
          dispatch({ type: "category/upsert", item: next });
          log("category", "Editó rubro", next.name);
        });
        announce(`Rubro actualizado: ${next.name}`, "category", next.name, () =>
          dispatch({ type: "category/upsert", item: category }),
        );
      },

      async removeCategory(category) {
        if (stateRef.current.businesses.some((b) => b.categoryId === category.id)) return false;
        await run(category.id, () => {
          dispatch({ type: "category/remove", id: category.id });
          log("category", "Eliminó rubro", category.name);
        });
        announce(`Rubro eliminado: ${category.name}`, "category", category.name, () =>
          dispatch({ type: "category/upsert", item: category }),
        );
        return true;
      },
    };
  }, [notify, run]);

  const value = useMemo<AdminContextValue>(
    () => ({ ...state, actions, isPending, isRecent }),
    [state, actions, isPending, isRecent],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

