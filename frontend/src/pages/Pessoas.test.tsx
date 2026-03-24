import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pessoas } from './Pessoas';
import { financeiroService } from '@/services/financeiroService';

vi.mock('@/services/financeiroService', () => ({
    financeiroService: {
        obterTotaisPorPessoa: vi.fn()
    }
}));

vi.mock('@/services/pessoaService', () => ({
    pessoaService: {
        criar: vi.fn(),
        atualizar: vi.fn(),
        remover: vi.fn()
    }
}));

/**
 * Suíte de testes da página de Pessoas.
 * Assegura que a interface atende de ponta a ponta ao requisito "Consulta de totais por pessoa",
 * verificando a montagem da tabela e a presença obrigatória dos totais gerais.
 */
describe('Página Pessoas', () => {
    beforeEach(() => {
        vi.mocked(financeiroService.obterTotaisPorPessoa).mockResolvedValue({
            itens: [],
            totalRegistros: 0,
            paginaAtual: 1,
            tamanhoPagina: 10,
            totalGeralReceitas: 0,
            totalGeralDespesas: 0,
            saldoGeralLiquido: 0
        });
    });

    it('deve renderizar os cabeçalhos e a faixa de totais do rodapé', async () => {
        render(<Pessoas />);

        expect(screen.getByText('Pessoas')).toBeInTheDocument();

        expect(await screen.findByText('TOTAL GERAL')).toBeInTheDocument();
        expect(screen.getByText('Total de Receitas')).toBeInTheDocument();
        expect(screen.getByText('Saldo Líquido')).toBeInTheDocument();

        expect(screen.getByText('Nenhuma pessoa encontrada.')).toBeInTheDocument();
    });

    it('deve abrir o modal de cadastro ao clicar em "Nova Pessoa"', async () => {
        render(<Pessoas />);

        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        const botaoNovo = screen.getByRole('button', { name: /nova pessoa/i });
        fireEvent.click(botaoNovo);

        expect(screen.getByText('Nome Completo')).toBeInTheDocument();
        expect(screen.getByLabelText('Idade')).toBeInTheDocument();
    });
});