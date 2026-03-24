import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Pessoas } from "@/pages/Pessoas";
import { Categorias } from "@/pages/Categorias";
import { Transacoes } from "@/pages/Transacoes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/pessoas" replace />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/transacoes" element={<Transacoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}