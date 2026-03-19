import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreditCard } from '../CreditCard';

describe('CreditCard Component', () => {
    it('should render card details correctly matching real UI', () => {
        render(<CreditCard />);
        
        expect(screen.getByText('Roosevelt Santos')).toBeInTheDocument();
        expect(screen.getByText('12/31')).toBeInTheDocument();
        expect(screen.getByText('8183')).toBeInTheDocument();
    });
});
