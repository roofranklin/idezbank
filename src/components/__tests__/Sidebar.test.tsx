import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from '../Sidebar';

describe('Sidebar Component', () => {
    it('should render the user profile correctly', () => {
        render(<Sidebar />);

        expect(screen.getByText('Roosevelt Franklin')).toBeInTheDocument();
        expect(screen.getByText('Cliente Black')).toBeInTheDocument();
    });

    it('should render primary navigation links', () => {
        render(<Sidebar />);

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Cartões')).toBeInTheDocument();
        expect(screen.getByText('Transações')).toBeInTheDocument();
        expect(screen.getByText('Investimentos')).toBeInTheDocument();
    });

    it('should render secondary/footer navigation links', () => {
        render(<Sidebar />);

        expect(screen.getByText('Ajuda')).toBeInTheDocument();
        expect(screen.getByText('Sair')).toBeInTheDocument();
    });
});
