"use client";

import { useMemo, useState } from "react";

type CostInput = {
  key: string;
  label: string;
  help: string;
  prefix?: string;
  suffix?: string;
  step?: string;
  min?: string;
};

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

const percentFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const basicInputs: CostInput[] = [
  {
    key: "productCost",
    label: "Product Cost",
    help: "Cost of goods sold.",
    prefix: "$",
  },
  {
    key: "labourCost",
    label: "Labour Cost",
    help: "Labour directly attributable to producing or delivering one unit.",
    prefix: "$",
  },
  {
    key: "packaging",
    label: "Packaging",
    help: "Packaging cost per sale.",
    prefix: "$",
  },
  {
    key: "shipping",
    label: "Shipping / Delivery",
    help: "Delivery or fulfilment cost per sale.",
    prefix: "$",
  },
  {
    key: "otherCosts",
    label: "Other Variable Costs",
    help: "Any additional cost per sale.",
    prefix: "$",
  },
  {
    key: "paymentFee",
    label: "Payment Processing Fee",
    help: "Percentage of selling price charged by your payment provider.",
    suffix: "%",
  },
  {
    key: "sellingPrice",
    label: "Selling Price",
    help: "Current price charged to the customer.",
    prefix: "$",
  },
];

const marginInput: CostInput = {
  key: "grossMargin",
  label: "Gross Margin",
  help: "The percentage of each sale left after variable costs.",
  suffix: "%",
};

const advancedInputs: CostInput[] = [
  {
    key: "fixedCosts",
    label: "Monthly Fixed Costs",
    help: "Rent, software, salaries and other fixed monthly costs.",
    prefix: "$",
  },
  {
    key: "monthlySales",
    label: "Expected Monthly Sales",
    help: "Expected number of units sold per month.",
    step: "1",
    min: "0",
  },
  {
    key: "profitGoal",
    label: "Monthly Profit Goal",
    help: "Target profit after variable costs and fixed costs.",
    prefix: "$",
  },
];

const initialValues: Record<string, number> = {
  productCost: 25,
  labourCost: 8,
  packaging: 2,
  shipping: 6,
  otherCosts: 1.5,
  paymentFee: 2.2,
  sellingPrice: 79,
  fixedCosts: 8000,
  monthlySales: 300,
  profitGoal: 10000,
};

const discountOptions = [0, 5, 10, 15, 20, 25];

function money(value: number) {
  if (!Number.isFinite(value)) {
    return "$0.00";
  }

  return currencyFormatter.format(value);
}

function percent(value: number) {
  if (!Number.isFinite(value)) {
    return "0.0%";
  }

  return `${percentFormatter.format(value)}%`;
}

function units(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "Not viable";
  }

  return `${Math.ceil(value).toLocaleString("en-AU")} sales`;
}

function getVariableCostBeforeFee(values: Record<string, number>) {
  return (
    values.productCost +
    values.labourCost +
    values.packaging +
    values.shipping +
    values.otherCosts
  );
}

function getPriceForMargin(values: Record<string, number>, margin: number) {
  const variableCostBeforeFee = getVariableCostBeforeFee(values);
  const feeRate = values.paymentFee / 100;
  const marginRate = margin / 100;
  const denominator = 1 - feeRate - marginRate;

  if (denominator <= 0) {
    return Infinity;
  }

  return variableCostBeforeFee / denominator;
}

function NumericInput({
  input,
  value,
  onChange,
}: {
  input: CostInput;
  value: number;
  onChange: (key: string, value: number) => void;
}) {
  return (
    <label className="calculatorField">
      <span className="calculatorFieldLabel">{input.label}</span>
      <span className="calculatorFieldHelp">{input.help}</span>
      <span className="calculatorInputWrap">
        {input.prefix ? <span aria-hidden="true">{input.prefix}</span> : null}
        <input
          inputMode="decimal"
          min={input.min ?? "0"}
          name={input.key}
          onChange={(event) =>
            onChange(input.key, Number(event.currentTarget.value))
          }
          step={input.step ?? "0.01"}
          type="number"
          value={value}
        />
        {input.suffix ? <span aria-hidden="true">{input.suffix}</span> : null}
      </span>
    </label>
  );
}

export default function PricingMarginCalculator() {
  const [values, setValues] = useState(initialValues);
  const [discount, setDiscount] = useState(0);
  const [activeBreakdownLabel, setActiveBreakdownLabel] = useState<string | null>(
    null,
  );

  const calculations = useMemo(() => {
    const variableCostBeforeFee = getVariableCostBeforeFee(values);
    const paymentFeeAmount = values.sellingPrice * (values.paymentFee / 100);
    const trueCost = variableCostBeforeFee + paymentFeeAmount;
    const profitPerSale = values.sellingPrice - trueCost;
    const grossMargin =
      values.sellingPrice > 0 ? (profitPerSale / values.sellingPrice) * 100 : 0;
    const markup = trueCost > 0 ? (profitPerSale / trueCost) * 100 : 0;
    const monthlyRevenue = values.sellingPrice * values.monthlySales;
    const monthlyVariableCosts = trueCost * values.monthlySales;
    const monthlyGrossProfit = profitPerSale * values.monthlySales;
    const estimatedMonthlyProfit = monthlyGrossProfit - values.fixedCosts;
    const breakEvenSales =
      profitPerSale > 0 ? values.fixedCosts / profitPerSale : Infinity;
    const targetProfitSales =
      profitPerSale > 0
        ? (values.fixedCosts + values.profitGoal) / profitPerSale
        : Infinity;
    const feeRate = values.paymentFee / 100;
    const discountedPrice = values.sellingPrice * (1 - discount / 100);
    const discountedFeeAmount = discountedPrice * feeRate;
    const discountedTrueCost = variableCostBeforeFee + discountedFeeAmount;
    const discountedProfit = discountedPrice - discountedTrueCost;
    const discountedMargin =
      discountedPrice > 0 ? (discountedProfit / discountedPrice) * 100 : 0;
    const profitDifference = profitPerSale - discountedProfit;
    const profitReduction =
      profitPerSale > 0 ? (profitDifference / profitPerSale) * 100 : 0;

    return {
      variableCostBeforeFee,
      paymentFeeAmount,
      trueCost,
      profitPerSale,
      grossMargin,
      markup,
      monthlyRevenue,
      monthlyVariableCosts,
      monthlyGrossProfit,
      estimatedMonthlyProfit,
      breakEvenSales,
      targetProfitSales,
      discountedPrice,
      discountedProfit,
      discountedMargin,
      profitDifference,
      profitReduction,
    };
  }, [discount, values]);

  const handleChange = (key: string, value: number) => {
    setValues((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? Math.max(0, value) : 0,
    }));
  };

  const handleDiscountChange = (value: number) => {
    setDiscount(Number.isFinite(value) ? Math.max(0, Math.min(25, value)) : 0);
  };

  const handleMarginChange = (margin: number) => {
    setValues((current) => {
      const clampedMargin = Number.isFinite(margin)
        ? Math.max(0, Math.min(95, margin))
        : 0;
      const sellingPrice = getPriceForMargin(current, clampedMargin);

      return {
        ...current,
        sellingPrice: Number.isFinite(sellingPrice)
          ? Number(sellingPrice.toFixed(2))
          : current.sellingPrice,
      };
    });
  };

  const costBreakdown = [
    {
      label: "Product",
      value: values.productCost,
      className: "segmentProduct",
    },
    {
      label: "Labour",
      value: values.labourCost,
      className: "segmentLabour",
    },
    {
      label: "Packaging",
      value: values.packaging,
      className: "segmentPackaging",
    },
    {
      label: "Shipping",
      value: values.shipping,
      className: "segmentShipping",
    },
    {
      label: "Other",
      value: values.otherCosts,
      className: "segmentOther",
    },
    {
      label: "Fees",
      value: calculations.paymentFeeAmount,
      className: "segmentFees",
    },
  ].sort((first, second) => second.value - first.value);

  const breakdown = [
    ...costBreakdown,
    {
      label: "Profit",
      value: Math.max(0, calculations.profitPerSale),
      className: "segmentProfit",
    },
  ];

  return (
    <div className="calculatorShell">
      <section className="calculatorInputsPanel" aria-labelledby="calculator-inputs">
        <div className="calculatorPanelHeader">
          <p className="eyebrow">Inputs</p>
          <h2 id="calculator-inputs" className="section-title">
            Start with one sale.
          </h2>
        </div>

        <div className="calculatorFieldsGrid">
          {basicInputs.map((input) => (
            <NumericInput
              input={input}
              key={input.key}
              onChange={handleChange}
              value={values[input.key]}
            />
          ))}

          <NumericInput
            input={marginInput}
            onChange={(_, value) => handleMarginChange(value)}
            value={Number(calculations.grossMargin.toFixed(1))}
          />
        </div>

        <details className="advancedCalculatorPanel">
          <summary>
            <span>
              <span className="eyebrow">Advanced Inputs</span>
              Add monthly fixed costs, sales volume and profit goals.
            </span>
          </summary>

          <div className="calculatorFieldsGrid advancedFieldsGrid">
            {advancedInputs.map((input) => (
              <NumericInput
                input={input}
                key={input.key}
                onChange={handleChange}
                value={values[input.key]}
              />
            ))}
          </div>

          <div className="advancedResults">
            <article>
              <span>Monthly Revenue</span>
              <strong>{money(calculations.monthlyRevenue)}</strong>
            </article>
            <article>
              <span>Monthly Gross Profit</span>
              <strong>{money(calculations.monthlyGrossProfit)}</strong>
            </article>
            <article>
              <span>Estimated Monthly Profit</span>
              <strong>{money(calculations.estimatedMonthlyProfit)}</strong>
            </article>
            <article>
              <span>Break-even Sales</span>
              <strong>{units(calculations.breakEvenSales)}</strong>
            </article>
            <article>
              <span>Sales for Target Profit</span>
              <strong>{units(calculations.targetProfitSales)}</strong>
            </article>
          </div>

          <p className="body advancedSummary">
            With monthly fixed costs of {money(values.fixedCosts)}, you need
            approximately {units(calculations.breakEvenSales)} to break even.
            To earn {money(values.profitGoal)} in monthly profit, you need
            roughly {units(calculations.targetProfitSales)}.
          </p>
        </details>
      </section>

      <section className="calculatorResultsPanel" aria-labelledby="calculator-results">
        <div className="calculatorPanelHeader">
          <p className="eyebrow">Live Results</p>
          <h2 id="calculator-results" className="section-title">
            What each sale is really doing.
          </h2>
        </div>

        <div className="calculatorHeroMetric">
          <span>True Cost per Sale</span>
          <strong>{money(calculations.trueCost)}</strong>
          <p>
            Includes product, labour, packaging, delivery, other variable costs
            and payment processing.
          </p>
        </div>

        <div className="calculatorSummaryCards">
          <article>
            <span>Selling Price</span>
            <strong>{money(values.sellingPrice)}</strong>
          </article>
          <article>
            <span>Profit per Sale</span>
            <strong>{money(calculations.profitPerSale)}</strong>
          </article>
          <article>
            <span>Gross Margin</span>
            <strong>{percent(calculations.grossMargin)}</strong>
          </article>
          <article>
            <span>Markup</span>
            <strong>{percent(calculations.markup)}</strong>
          </article>
        </div>
      </section>

      <section className="calculatorBreakdownPanel" aria-labelledby="cost-breakdown">
        <div>
          <p className="eyebrow">Cost Breakdown</p>
          <h2 id="cost-breakdown" className="section-title">
            Where each dollar goes.
          </h2>
          <p className="body">
            Selling price: <strong>{money(values.sellingPrice)}</strong>
          </p>
        </div>

        <div
          className="costStack"
          aria-label={`Cost breakdown for a selling price of ${money(
            values.sellingPrice,
          )}`}
        >
          {breakdown.map((item) => {
            const width =
              values.sellingPrice > 0
                ? Math.max(0, (item.value / values.sellingPrice) * 100)
                : 0;

            if (width <= 0) {
              return null;
            }

            return (
              <span
                className={`costSegment ${item.className}`}
                key={item.label}
                onBlur={() => setActiveBreakdownLabel(null)}
                onFocus={() => setActiveBreakdownLabel(item.label)}
                onMouseEnter={() => setActiveBreakdownLabel(item.label)}
                onMouseLeave={() => setActiveBreakdownLabel(null)}
                style={{ width: `${Math.min(100, width)}%` }}
                title={`${item.label}: ${money(item.value)}`}
                aria-label={`${item.label}: ${money(item.value)}`}
                tabIndex={0}
              />
            );
          })}
        </div>

        <div className="costLegend">
          {breakdown.map((item) => (
            <span
              className={
                activeBreakdownLabel === item.label ? "costLegendActive" : undefined
              }
              key={item.label}
            >
              <i className={item.className} aria-hidden="true" />
              {item.label}: {money(item.value)}
            </span>
          ))}
        </div>
      </section>

      <section className="calculatorNarrative" aria-labelledby="plain-summary">
        <p className="eyebrow">Plain English Summary</p>
        <h2 id="plain-summary" className="section-title">
          The operating read.
        </h2>
        <p className="body-large">
          At your current selling price of {money(values.sellingPrice)}, each
          sale generates {money(calculations.profitPerSale)} in gross profit,
          giving you a {percent(calculations.grossMargin)} gross margin.
        </p>
        <p className="body-large">
          Adjust the selling price to see the margin change, or enter the
          margin you want and the calculator will solve the price for you.
        </p>
      </section>

      <section className="discountPanel" aria-labelledby="discount-impact">
        <div className="calculatorPanelHeader">
          <p className="eyebrow">Discount Impact</p>
          <h2 id="discount-impact" className="section-title">
            Test what a discount really costs.
          </h2>
        </div>

        <label className="discountSlider">
          <span>Discount: {discount}%</span>
          <input
            aria-label="Discount percentage"
            max="25"
            min="0"
            onChange={(event) =>
              handleDiscountChange(Number(event.currentTarget.value))
            }
            onInput={(event) =>
              handleDiscountChange(Number(event.currentTarget.value))
            }
            step="5"
            type="range"
            value={discount}
          />
        </label>

        <div className="discountTicks" aria-label="Discount presets">
          {discountOptions.map((tick) => (
            <button
              className={discount === tick ? "discountTickActive" : undefined}
              key={tick}
              onClick={() => handleDiscountChange(tick)}
              type="button"
            >
              {tick}%
            </button>
          ))}
        </div>

        <div className="discountCards">
          <article>
            <span>New Selling Price</span>
            <strong>{money(calculations.discountedPrice)}</strong>
          </article>
          <article>
            <span>New Margin</span>
            <strong>{percent(calculations.discountedMargin)}</strong>
          </article>
          <article>
            <span>New Profit per Sale</span>
            <strong>{money(calculations.discountedProfit)}</strong>
          </article>
          <article>
            <span>Profit Difference</span>
            <strong>{money(calculations.profitDifference)}</strong>
          </article>
        </div>

        <div className="calculatorInsight">
          <p className="body">
            A {discount}% discount reduces revenue by {discount}%, but reduces
            profit per sale by {percent(calculations.profitReduction)}. That
            gap is often overlooked when discounts are treated as harmless.
          </p>
        </div>
      </section>
    </div>
  );
}
