import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

/**
 * Layout principal da aplicação (Shell).
 * Define a estrutura estática da Sidebar e a área de conteúdo dinâmico.
 */
export function AppLayout() {
    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
            <Sidebar />

            {/* O overflow-y-auto garante scroll independente para o conteúdo principal,
                mantendo a Sidebar sempre visível e fixa na lateral.
            */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}