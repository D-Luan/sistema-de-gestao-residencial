import { LayoutDashboard, Users, Tags, CircleDollarSign } from "lucide-react";
import { NavLink } from "react-router-dom";

/**
 * Menu de navegação lateral.
 */
export function Sidebar() {
    // Configuração centralizada para facilitar a expansão do menu.    
    const links = [
        { nome: "Dashboard", caminho: "/", icone: LayoutDashboard },
        { nome: "Pessoas", caminho: "/pessoas", icone: Users },
        { nome: "Categorias", caminho: "/categorias", icone: Tags },
        { nome: "Transações", caminho: "/transacoes", icone: CircleDollarSign },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <h1 className="font-bold text-lg text-slate-800 tracking-tight">
                    GestãoResidencial
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const Icone = link.icone;
                    return (
                        <NavLink
                            key={link.nome}
                            to={link.caminho}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${isActive
                                    ? "bg-slate-100 text-slate-900"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`
                            }
                        >
                            <Icone className="w-5 h-5" />
                            {link.nome}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}