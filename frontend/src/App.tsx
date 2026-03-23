import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Pessoas } from "@/pages/Pessoas";
import { Categorias } from "@/pages/Categorias";

const Dashboard = () => <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-slate-500 mt-2">Em breve...</p></div>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/transacoes" element={<div>Transações</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}