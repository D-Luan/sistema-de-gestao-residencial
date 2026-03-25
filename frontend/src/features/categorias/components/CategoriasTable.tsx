import { Tag } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import type { RelatorioGeralResposta, RelatorioCategoriaResposta } from "@/types/Financeiro";

interface CategoriasTableProps {
    relatorio: RelatorioGeralResposta<RelatorioCategoriaResposta> | null;
    carregando: boolean;
}

/**
 * Tabela de listagem que implementa o requisito opcional:
 * "Consulta de totais por categoria", exibindo receitas, despesas e saldo líquido.
 */
export function CategoriasTable({ relatorio, carregando }: CategoriasTableProps) {
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return (
        <div className="bg-white rounded-md border border-slate-200">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead>Descrição</TableHead>
                        <TableHead>Finalidade</TableHead>
                        <TableHead className="text-right">Receitas</TableHead>
                        <TableHead className="text-right">Despesas</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Renderização da lista de categorias com seus respectivos totais financeiros */}
                    {carregando ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-slate-500">Carregando...</TableCell>
                        </TableRow>
                    ) : relatorio?.itens.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-slate-500">Nenhuma categoria encontrada.</TableCell>
                        </TableRow>
                    ) : (
                        relatorio?.itens.map((categoria) => (
                            <TableRow key={categoria.id}>
                                <TableCell className="font-medium text-slate-900">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-slate-400" />
                                        {categoria.descricao}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                        ${categoria.finalidade === 'Despesa' ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10' :
                                            categoria.finalidade === 'Receita' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10' :
                                                'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10'}`}
                                    >
                                        {categoria.finalidade}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right text-emerald-600 font-medium">
                                    {formatarMoeda(categoria.totalReceitas)}
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-medium">
                                    {formatarMoeda(categoria.totalDespesas)}
                                </TableCell>
                                <TableCell className={`text-right font-bold ${categoria.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                    {formatarMoeda(categoria.saldo)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>

                {/* Exibição do Total Geral das categorias ao final da listagem */}
                {relatorio && (
                    <TableFooter className="bg-slate-50/80 font-bold border-t-2 border-slate-200">
                        <TableRow>
                            <TableCell colSpan={2} className="text-slate-900 uppercase">TOTAL GERAL</TableCell>
                            <TableCell className="text-right text-emerald-600">
                                <p className="text-sm font-medium text-slate-500">Total de Receitas</p>
                                <p className="text-base font-semibold mt-1">{formatarMoeda(relatorio.totalGeralReceitas)}</p>
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                                <p className="text-sm font-medium text-slate-500">Total de Despesas</p>
                                <p className="text-base font-semibold mt-1">{formatarMoeda(relatorio.totalGeralDespesas)}</p>
                            </TableCell>
                            <TableCell className={`text-right ${relatorio.saldoGeralLiquido >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                <p className="text-sm font-medium text-slate-500">Saldo Líquido</p>
                                <p className="text-base font-semibold mt-1">{formatarMoeda(relatorio.saldoGeralLiquido)}</p>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}