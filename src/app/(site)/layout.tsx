import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ToastProvider } from "@/components/ui/toast";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <ToastProvider>
      <SiteHeader />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </ToastProvider>
  );
}
