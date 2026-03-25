import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TransacaoResposta } from "@/features/transacoes/transacoes.types";

interface TransacoesTableProps {
    transacoes: TransacaoResposta[];
    carregando: boolean;
}

/**
 * Tabela para exibição do histórico de transações.
 * Utiliza indicadores visuais (cores e ícones) para diferenciar receitas de despesas.
 */
export function TransacoesTable({ transacoes, carregando }: TransacoesTableProps) {
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return (
        <div className="bg-white rounded-md border border-slate-200">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead>Descrição</TableHead>
                        <TableHead>Pessoa</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {carregando ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-slate-500">Carregando...</TableCell>
                        </TableRow>
                    ) : transacoes.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-slate-500">Nenhuma transação registrada.</TableCell>
                        </TableRow>
                    ) : (
                        transacoes.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell className="font-medium text-slate-900">
                                    <div className="flex items-center gap-2">
                                        {t.tipo === 1 ? (
                                            <ArrowDownCircle className="w-4 h-4 text-red-500" />
                                        ) : (
                                            <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
                                        )}
                                        {t.descricao}
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600">{t.nomePessoa}</TableCell>
                                <TableCell className="text-slate-600">{t.descricaoCategoria}</TableCell>
                                <TableCell className={`text-right font-medium ${t.tipo === 1 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {t.tipo === 1 ? '-' : '+'}{formatarMoeda(t.valor)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}