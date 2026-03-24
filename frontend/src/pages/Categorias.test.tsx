import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Categorias } from './Categorias';
import { financeiroService } from '@/services/financeiroService';

vi.mock('@/services/financeiroService', () => ({
    financeiroService: {
        obterTotaisPorCategoria: vi.fn()
    }
}));

vi.mock('@/services/categoriaService', () => ({
    categoriaService: {
        criar: vi.fn()
    }
}));

/**
 * Suíte de testes da página de Categorias.
 * Foca em garantir que o requisito opcional (Totais por Categoria) está integrado à UI,
 * validando a renderização do rodapé agregador e o fluxo de cadastro.
 */
describe('Página Categorias', () => {
    beforeEach(() => {
        vi.mocked(financeiroService.obterTotaisPorCategoria).mockResolvedValue({
            itens: [],
            totalGeralReceitas: 0,
            totalGeralDespesas: 0,
            saldoGeralLiquido: 0
        });
    });

    it('deve renderizar os cabeçalhos e a faixa de totais do rodapé', async () => {
        render(<Categorias />);

        expect(screen.getByText('Categorias')).toBeInTheDocument();

        expect(await screen.findByText('TOTAL GERAL')).toBeInTheDocument();
        expect(screen.getByText('Total de Receitas')).toBeInTheDocument();
        expect(screen.getByText('Saldo Líquido')).toBeInTheDocument();

        expect(screen.getByText('Nenhuma categoria encontrada.')).toBeInTheDocument();
    });

    it('deve abrir o modal de cadastro ao clicar em "Nova Categoria"', async () => {
        render(<Categorias />);

        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        const botaoNovo = screen.getByRole('button', { name: /nova categoria/i });
        fireEvent.click(botaoNovo);

        expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
        expect(screen.getByLabelText('Finalidade')).toBeInTheDocument();
    });
});