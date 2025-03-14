import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculationFormSchema } from "@shared/schema";
import type { CalculationResult } from "@shared/calculations";
import { calculateMortgage } from "@shared/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Results } from "./Results";

export function Calculator() {
  const [results, setResults] = useState<{
    downPaymentVariants: CalculationResult[];
    priceVariants: CalculationResult[];
  }>({ downPaymentVariants: [], priceVariants: [] });

  const form = useForm({
    resolver: zodResolver(calculationFormSchema),
    defaultValues: {
      purchasePrice: 625000,
      downPaymentPercent: 60,
      hoa: 819,
      taxes: 1000,
      interestRate: 7.0,
      insurance: 100,
      renovationBudget: 125000,
      monthlyNetIncome: 15000,
    },
  });

  function onSubmit(data: any) {
    // Calculate down payment variants
    const selectedDP = data.downPaymentPercent;
    const downPayments = [
      Math.max(0, selectedDP - 10),
      selectedDP,
      Math.min(100, selectedDP + 10)
    ].sort((a, b) => a - b);
    const uniqueDownPayments = [...new Set(downPayments)];

    const downPaymentVariants = uniqueDownPayments.map(dp =>
      calculateMortgage(
        data.purchasePrice,
        dp,
        data.interestRate,
        data.hoa,
        data.taxes,
        data.insurance,
        data.monthlyNetIncome
      )
    );

    // Calculate purchase price variants
    const selectedPrice = data.purchasePrice;
    const prices = [
      selectedPrice * 0.9,  // 10% below
      selectedPrice,        // Selected price
      selectedPrice * 1.1   // 10% above
    ];

    const priceVariants = prices.map(price =>
      calculateMortgage(
        price,
        data.downPaymentPercent,
        data.interestRate,
        data.hoa,
        data.taxes,
        data.insurance,
        data.monthlyNetIncome
      )
    );

    setResults({
      downPaymentVariants,
      priceVariants
    });
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Enter Purchase Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter purchase price"
                        {...field}
                        onChange={e => {
                          field.onChange(Number(e.target.value));
                          form.handleSubmit(onSubmit)();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyNetIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Net Take-Home Pay</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter monthly net income"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="downPaymentPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Down Payment {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={[field.value]}
                        onValueChange={([value]) => {
                          field.onChange(value);
                          form.handleSubmit(onSubmit)();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hoa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly HOA</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="HOA fees"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Property Taxes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Annual taxes"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate %</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Interest rate"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insurance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Insurance</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Monthly insurance"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="renovationBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renovation Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Renovation budget"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Calculate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(results.downPaymentVariants.length > 0 || results.priceVariants.length > 0) && (
        <Results 
          downPaymentVariants={results.downPaymentVariants}
          downPaymentPercents={results.downPaymentVariants.map(r => (r.downPayment / (r.downPayment + r.principal)) * 100)}
          priceVariants={results.priceVariants}
          basePrice={form.getValues("purchasePrice")}
        />
      )}
    </div>
  );
}