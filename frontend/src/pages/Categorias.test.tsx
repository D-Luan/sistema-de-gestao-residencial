import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Categorias } from './Categorias';
import { categoriaService } from '@/services/categoriaService';

vi.mock('@/services/categoriaService', () => ({
    categoriaService: {
        obterTodas: vi.fn()
    }
}));

/**
 * Suíte de testes da página de listagem de Categorias.
 * Mantém a consistência com os testes de Pessoas, focando na renderização e interatividade.
 */
describe('Página Categorias', () => {
    beforeEach(() => {
        // Simula um retorno de API sem registros cadastrados (Array vazio)
        vi.mocked(categoriaService.obterTodas).mockResolvedValue([]);
    });

    it('deve renderizar os cabeçalhos e a faixa de totais', async () => {
        render(<Categorias />);

        expect(screen.getByText('Categorias')).toBeInTheDocument();
        expect(screen.getByText('Total de Receitas')).toBeInTheDocument();
        expect(screen.getByText('Saldo Líquido')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Nenhuma categoria encontrada.')).toBeInTheDocument();
        });
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