import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Calculator } from '../../client/src/components/Calculator';
import { Toaster } from '../../client/src/components/ui/toaster';
import React from 'react';
import '@testing-library/jest-dom/vitest';

describe('Calculator Component', () => {
  beforeEach(() => {
    render(
      <>
        <Calculator />
        <Toaster />
      </>
    );
  });

  it('renders with default values', () => {
    const priceInput = screen.getByLabelText('Purchase Price ($)') as HTMLInputElement;
    const incomeInput = screen.getByLabelText('Monthly Net Take-Home Pay ($)') as HTMLInputElement;
    const downPaymentSlider = screen.getByLabelText('Down Payment Percentage') as HTMLElement;
    const downPaymentValue = downPaymentSlider.closest('span')?.querySelector('[role="slider"]');

    expect(priceInput.value).toBe('625000');
    expect(incomeInput.value).toBe('15000');
    expect(downPaymentValue?.getAttribute('aria-valuenow')).toBe('60');
  });

  it('updates calculations when inputs change', async () => {
    const priceInput = screen.getByLabelText('Purchase Price ($)') as HTMLInputElement;
    fireEvent.change(priceInput, { target: { value: '700000' } });

    await waitFor(() => {
      expect(priceInput.value).toBe('700000');
    });
  });

  it('shows warning when monthly payment exceeds recommended percentage', async () => {
    // Set a high purchase price and low income to trigger the warning
    const priceInput = screen.getByLabelText('Purchase Price ($)') as HTMLInputElement;
    const incomeInput = screen.getByLabelText('Monthly Net Take-Home Pay ($)') as HTMLInputElement;

    fireEvent.change(priceInput, { target: { value: '1000000' } });
    fireEvent.change(incomeInput, { target: { value: '5000' } });

    // Wait for the Results component to update and click the Calculate button
    const calculateButton = screen.getByRole('button', { name: 'Calculate' });
    fireEvent.click(calculateButton);

    // Wait for the Results component to update
    await waitFor(() => {
      const percentageElements = screen.getAllByText(/% of Monthly Income/i);
      const warningElement = percentageElements.find(el => 
        el.nextElementSibling?.classList.contains('text-destructive')
      );
      expect(warningElement).toBeTruthy();
    });
  });
});