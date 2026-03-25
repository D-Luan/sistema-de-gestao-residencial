import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import type { RelatorioPessoaResposta, RelatorioPaginadoResposta } from "@/features/financeiro/financeiro.types";

interface PessoasTableProps {
    relatorio: RelatorioPaginadoResposta<RelatorioPessoaResposta> | null;
    carregando: boolean;
    onEditar: (pessoa: RelatorioPessoaResposta) => void;
    onDeletar: (id: number) => void;
}

/**
 * Tabela de listagem que cumpre o requisito de exibir totais por pessoa e o saldo geral.
 * Recebe dados já processados pelo financeiroService no backend.
 */
export function PessoasTable({ relatorio, carregando, onEditar, onDeletar }: PessoasTableProps) {
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return (
        <div className="bg-white rounded-md border border-slate-200">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead>Nome</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead className="text-right">Receitas</TableHead>
                        <TableHead className="text-right">Despesas</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {/* Renderização condicional para estados de carregamento ou lista vazia */}
                    {carregando ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-slate-500">Carregando...</TableCell>
                        </TableRow>
                    ) : relatorio?.itens.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-slate-500">Nenhuma pessoa encontrada.</TableCell>
                        </TableRow>
                    ) : (
                        relatorio?.itens.map((pessoa) => (
                            <TableRow key={pessoa.id}>
                                <TableCell className="font-medium text-slate-900">{pessoa.nome}</TableCell>
                                <TableCell className="text-slate-600">{pessoa.idade} anos</TableCell>
                                <TableCell className="text-right text-emerald-600 font-medium">
                                    {formatarMoeda(pessoa.totalReceitas)}
                                </TableCell>
                                <TableCell className="text-right text-red-600 font-medium">
                                    {formatarMoeda(pessoa.totalDespesas)}
                                </TableCell>
                                <TableCell className={`text-right font-bold ${pessoa.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                    {formatarMoeda(pessoa.saldo)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => onEditar(pessoa)}>
                                        <Pencil className="w-4 h-4 text-slate-500 hover:text-blue-600" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDeletar(pessoa.id)}>
                                        <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-600" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>

                {/* Requisito: Exibição do Total Geral no final da listagem */}
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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}