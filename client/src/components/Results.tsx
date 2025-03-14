import type { CalculationResult } from "@shared/calculations";
import { formatCurrency } from "@shared/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsProps {
  results: CalculationResult[];
}

export function Results({ results }: ResultsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {results.map((result, index) => (
        <Card key={index} className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">
              {index === 0 ? "50%" : index === 1 ? "60%" : "70%"} Down Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Monthly Payment</dt>
                <dd className="font-medium">{formatCurrency(result.monthlyPayment)}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Down Payment</dt>
                <dd className="font-medium">{formatCurrency(result.downPayment)}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Principal</dt>
                <dd className="font-medium">{formatCurrency(result.principal)}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Monthly Taxes</dt>
                <dd className="font-medium">{formatCurrency(result.monthlyTaxes)}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Monthly Insurance</dt>
                <dd className="font-medium">{formatCurrency(result.monthlyInsurance)}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Monthly HOA</dt>
                <dd className="font-medium">{formatCurrency(result.monthlyHOA)}</dd>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <dt>Total Monthly</dt>
                  <dd>{formatCurrency(result.totalMonthly)}</dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
