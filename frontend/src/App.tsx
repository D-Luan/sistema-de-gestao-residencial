import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";

const Dashboard = () => <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-slate-500 mt-2">Em breve...</p></div>;
const PessoasPlaceholder = () => <div><h1 className="text-2xl font-bold">Pessoas</h1><p className="text-slate-500 mt-2">Em trabalho...</p></div>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<PessoasPlaceholder />} />
          <Route path="/categorias" element={<div>Categorias</div>} />
          <Route path="/transacoes" element={<div>Transações</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}