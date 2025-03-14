import type { CalculationResult } from "@shared/calculations";
import { formatCurrency, formatPercentage } from "@shared/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsProps {
  downPaymentVariants: CalculationResult[];
  downPaymentPercents: number[];
  priceVariants: CalculationResult[];
  basePrice: number;
}

export function Results({ downPaymentVariants, downPaymentPercents, priceVariants, basePrice }: ResultsProps) {
  const ResultTable = ({ results, titles }: { results: CalculationResult[], titles: string[] }) => (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      {results.map((result, index) => (
        <Card key={index} className="bg-muted">
          <CardHeader>
            <CardTitle className="text-lg">
              {titles[index]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm md:text-base">
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
                <div className="flex justify-between mt-2 text-sm">
                  <dt className="text-muted-foreground">% of Monthly Income</dt>
                  <dd className={result.monthlyIncomePercentage > 35 ? "text-destructive font-medium" : "text-primary font-medium"}>
                    {formatPercentage(result.monthlyIncomePercentage)}
                  </dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Down Payment Variations</h3>
          <ResultTable 
            results={downPaymentVariants} 
            titles={downPaymentPercents.map(dp => `${formatPercentage(dp)} Down`)} 
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Purchase Price Variations</h3>
          <ResultTable 
            results={priceVariants} 
            titles={[
              `${formatCurrency(basePrice * 0.9)} (-10%)`,
              `${formatCurrency(basePrice)}`,
              `${formatCurrency(basePrice * 1.1)} (+10%)`
            ]} 
          />
        </div>
      </CardContent>
    </Card>
  );
}