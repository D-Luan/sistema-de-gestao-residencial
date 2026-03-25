import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Transacoes } from './Transacoes';
import { transacaoService } from '@/features/transacoes/transacaoService';

vi.mock('@/features/transacoes/transacaoService', () => ({
    transacaoService: {
        obterTodas: vi.fn()
    }
}));

vi.mock('@/features/pessoas/pessoaService', () => ({
    pessoaService: { obterTodas: vi.fn().mockResolvedValue({ itens: [] }) }
}));
vi.mock('@/features/categorias/categoriaService', () => ({
    categoriaService: { obterTodas: vi.fn().mockResolvedValue([]) }
}));

/**
 * Testes unitários para Transações.
 * Verifica se a interface se comporta corretamente ao abrir o formulário
 * e se os estados de lista vazia são apresentados.
 */
describe('Página Transações', () => {
    beforeEach(() => {
        vi.mocked(transacaoService.obterTodas).mockResolvedValue({
            itens: [],
            totalRegistros: 0,
            paginaAtual: 1,
            tamanhoPagina: 10
        });
    });

    it('deve renderizar a página apenas com tabela, sem cards de totais', async () => {
        render(<Transacoes />);

        expect(screen.getByText('Transações')).toBeInTheDocument();
        
        expect(screen.queryByText('Total de Receitas')).not.toBeInTheDocument();
        expect(screen.queryByText('Saldo Líquido')).not.toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Nenhuma transação registrada.')).toBeInTheDocument();
        });
    });

    it('deve abrir o modal de cadastro ao clicar em "Nova Transação"', async () => {
        render(<Transacoes />);

        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        const botaoNovo = screen.getByRole('button', { name: /nova transação/i });
        fireEvent.click(botaoNovo);

        expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
        expect(screen.getByLabelText('Valor (R$)')).toBeInTheDocument();
    });
});