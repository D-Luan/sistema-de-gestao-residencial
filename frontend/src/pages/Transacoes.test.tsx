import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Transacoes } from './Transacoes';
import { transacaoService } from '@/services/transacaoService';

vi.mock('@/services/transacaoService', () => ({
    transacaoService: {
        obterTodas: vi.fn()
    }
}));

// Mocks dos serviços para garantir o isolamento do componente.
// Diferente das outras telas, aqui mockamos Pessoas e Categorias também, pois 
// o formulário de nova transação depende desses dados para preencher os Selects.
vi.mock('@/features/pessoas/pessoaService', () => ({
    pessoaService: { obterTodas: vi.fn().mockResolvedValue({ itens: [] }) }
}));
vi.mock('@/features/categorias/categoriaService', () => ({
    categoriaService: { obterTodas: vi.fn().mockResolvedValue([]) }
}));

/**
 * Suíte de testes da página de listagem e cadastro de Transações.
 * Foca em validar a renderização da tabela, a ausência de indicadores não pertinentes à tela 
 * e a montagem correta do formulário com múltiplas dependências.
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
        
        // Valida uma decisão de UX/UI: a tela de transações é focada no fluxo de caixa (extrato).
        // Os cards de totais são responsabilidade exclusiva das páginas de Pessoas e Categorias.
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