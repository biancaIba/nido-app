import { Footer } from "@/components/ui";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden">
      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)] md:h-screen">
        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-auto w-full bg-subtle-gradient">
          <main className="flex-1 h-full min-h-0 overflow-y-auto">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
