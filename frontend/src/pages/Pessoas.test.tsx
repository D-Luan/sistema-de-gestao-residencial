import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pessoas } from './Pessoas';
import { pessoaService } from '@/services/pessoaService';

// Mock do serviço para isolar o componente e evitar chamadas HTTP reais durante a execução
vi.mock('@/services/pessoaService', () => ({
    pessoaService: {
        obterTodas: vi.fn()
    }
}));

/**
 * Suíte de testes da página de listagem de Pessoas.
 * Foca em garantir a renderização dos indicadores financeiros e a interatividade da UI.
 */
describe('Página Pessoas', () => {
    beforeEach(() => {
        // Simula um retorno de API sem registros cadastrados
        vi.mocked(pessoaService.obterTodas).mockResolvedValue({
            itens: [],
            totalRegistros: 0,
            paginaAtual: 1,
            tamanhoPagina: 10
        });
    });

    it('deve renderizar os cabeçalhos e a faixa de totais', async () => {
        render(<Pessoas />);

        expect(screen.getByText('Pessoas')).toBeInTheDocument();
        expect(screen.getByText('Total de Receitas')).toBeInTheDocument();
        expect(screen.getByText('Saldo Líquido')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Nenhuma pessoa encontrada.')).toBeInTheDocument();
        });
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