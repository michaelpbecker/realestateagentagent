import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calculator } from '../../client/src/components/Calculator';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Calculator Component', () => {
  it('renders with default values', () => {
    render(<Calculator />, { wrapper });
    expect(screen.getByLabelText(/Purchase Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Down Payment/i)).toBeInTheDocument();
  });

  it('updates calculations when inputs change', async () => {
    render(<Calculator />, { wrapper });
    const priceInput = screen.getByLabelText(/Purchase Price/i);

    fireEvent.change(priceInput, { target: { value: '500000' } });

    // Check if the results are updated
    expect(await screen.findByText(/Results Summary/i)).toBeInTheDocument();
  });

  it('shows warning when monthly payment exceeds recommended percentage', async () => {
    render(<Calculator />, { wrapper });

    // Set a high purchase price and low income to trigger warning
    const priceInput = screen.getByLabelText(/Purchase Price/i);
    const incomeInput = screen.getByLabelText(/Monthly Net Take-Home Pay/i);

    fireEvent.change(priceInput, { target: { value: '1000000' } });
    fireEvent.change(incomeInput, { target: { value: '5000' } });

    // The Results component should show the percentage in red
    const percentageElement = await screen.findByText(/% of Monthly Income/i);
    expect(percentageElement.closest('div')).toHaveClass('text-destructive');
  });
});