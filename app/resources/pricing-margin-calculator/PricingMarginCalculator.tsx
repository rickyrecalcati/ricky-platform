"use client";

import { useMemo, useState } from "react";
import {
  calculatePricing,
  clampNumber,
  getPricingHealth,
  pricingPresets,
  recommendedSellingPrice,
  roundToCents,
  type PricingBreakdownItem,
  type PricingBreakdownLabels,
  type PricingInputs,
} from "../../../lib/pricingMargin";

type CalculatorMode =
  | "Calculate Margin"
  | "Calculate Selling Price"
  | "Profit Planner";

type CostInput = {
  key: keyof PricingInputs;
  label: string;
  help: string;
  prefix?: string;
  suffix?: string;
  step?: string;
  max?: string;
};

type PresetKey = keyof typeof pricingPresets;

type IndustryPreset = {
  key: PresetKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  unitSingular: string;
  unitPlural: string;
  unitLabel: string;
  sellingPriceLabel: string;
  variableFields: CostInput[];
  monthlyFields: CostInput[];
  breakdownLabels: PricingBreakdownLabels;
};

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

const numberFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const modes: CalculatorMode[] = [
  "Calculate Margin",
  "Calculate Selling Price",
  "Profit Planner",
];

const sellingPriceInput: CostInput = {
  key: "sellingPrice",
  label: "Selling Price",
  help: "Current price charged to the customer.",
  prefix: "$",
};

const targetMarginInput: CostInput = {
  key: "targetMargin",
  label: "Target Gross Margin",
  help: "The margin you want the sale to produce.",
  suffix: "%",
  max: "99",
};

const discountOptions = [0, 5, 10, 15, 20, 25];

const industryPresets: Record<PresetKey, IndustryPreset> = {
  coffee: {
    key: "coffee",
    label: "Coffee Shop",
    eyebrow: "Coffee Shop",
    title: "A unit-level view of the counter.",
    description:
      "Model the economics of one coffee, then check whether monthly volume covers rent, utilities and overheads.",
    unitSingular: "coffee",
    unitPlural: "coffees",
    unitLabel: "Coffee",
    sellingPriceLabel: "Coffee Selling Price",
    variableFields: [
      {
        key: "productCost",
        label: "Coffee Beans Cost",
        help: "Beans used for one coffee.",
        prefix: "$",
      },
      {
        key: "secondaryCost",
        label: "Milk Cost",
        help: "Milk or alternative milk used for one coffee.",
        prefix: "$",
      },
      {
        key: "packaging",
        label: "Cup & Lid",
        help: "Disposable cup, lid and sleeve per coffee.",
        prefix: "$",
      },
      {
        key: "labourCost",
        label: "Labour per Coffee",
        help: "Direct labour allocated to making and serving one coffee.",
        prefix: "$",
      },
      {
        key: "paymentFee",
        label: "Card Processing Fee",
        help: "Card fee charged on the coffee selling price.",
        suffix: "%",
        max: "99",
      },
    ],
    monthlyFields: [
      {
        key: "monthlyRent",
        label: "Monthly Rent",
        help: "Rent for the cafe or kiosk.",
        prefix: "$",
      },
      {
        key: "utilities",
        label: "Utilities",
        help: "Electricity, water, gas and similar monthly costs.",
        prefix: "$",
      },
      {
        key: "monthlyOverheads",
        label: "Other Monthly Overheads",
        help: "Insurance, cleaning, subscriptions and other recurring costs.",
        prefix: "$",
      },
      {
        key: "monthlySales",
        label: "Expected Coffees Sold per Month",
        help: "Estimated monthly coffee volume.",
        step: "1",
      },
      {
        key: "profitGoal",
        label: "Monthly Profit Goal",
        help: "Profit target after coffee costs and monthly overheads.",
        prefix: "$",
      },
    ],
    breakdownLabels: {
      productCost: "Coffee beans",
      secondaryCost: "Milk",
      packaging: "Cup & lid",
      labourCost: "Labour",
      paymentFees: "Card fees",
      profit: "Profit",
    },
  },
  restaurant: {
    key: "restaurant",
    label: "Restaurant Meal",
    eyebrow: "Restaurant Meal",
    title: "Price one dish without ignoring service.",
    description:
      "Separate food, kitchen labour, front-of-house labour and venue costs so the meal price reflects the full operating model.",
    unitSingular: "meal",
    unitPlural: "meals",
    unitLabel: "Meal",
    sellingPriceLabel: "Meal Selling Price",
    variableFields: [
      {
        key: "productCost",
        label: "Food Cost",
        help: "Ingredients used to produce one meal.",
        prefix: "$",
      },
      {
        key: "labourCost",
        label: "Kitchen Labour",
        help: "Direct kitchen labour allocated to one meal.",
        prefix: "$",
      },
      {
        key: "frontOfHouseLabour",
        label: "Front of House Labour",
        help: "Service labour allocated to one meal.",
        prefix: "$",
      },
      {
        key: "packaging",
        label: "Packaging / Takeaway",
        help: "Takeaway container or packaging cost when relevant.",
        prefix: "$",
      },
      {
        key: "paymentFee",
        label: "Payment Processing Fee",
        help: "Card or payment fee charged on the meal price.",
        suffix: "%",
        max: "99",
      },
    ],
    monthlyFields: [
      {
        key: "monthlyRent",
        label: "Monthly Rent",
        help: "Venue rent for the month.",
        prefix: "$",
      },
      {
        key: "utilities",
        label: "Utilities",
        help: "Power, gas, water and venue running costs.",
        prefix: "$",
      },
      {
        key: "monthlySales",
        label: "Expected Meals Sold",
        help: "Expected number of meals sold per month.",
        step: "1",
      },
      {
        key: "profitGoal",
        label: "Monthly Profit Goal",
        help: "Target profit after food, labour and fixed costs.",
        prefix: "$",
      },
    ],
    breakdownLabels: {
      productCost: "Food cost",
      labourCost: "Kitchen labour",
      frontOfHouseLabour: "Front of house",
      packaging: "Takeaway packaging",
      paymentFees: "Payment fees",
      profit: "Profit",
    },
  },
  retail: {
    key: "retail",
    label: "Retail Product",
    eyebrow: "Retail Product",
    title: "Account for the quiet costs of selling online.",
    description:
      "Include purchase cost, inbound shipping, packaging, marketplace fees and returns allowance before judging the product margin.",
    unitSingular: "unit",
    unitPlural: "units",
    unitLabel: "Product",
    sellingPriceLabel: "Selling Price",
    variableFields: [
      {
        key: "productCost",
        label: "Product Purchase Cost",
        help: "Wholesale or purchase cost for one unit.",
        prefix: "$",
      },
      {
        key: "shipping",
        label: "Shipping In",
        help: "Inbound freight or landed shipping cost per unit.",
        prefix: "$",
      },
      {
        key: "packaging",
        label: "Packaging",
        help: "Mailer, box, inserts or packing material per order.",
        prefix: "$",
      },
      {
        key: "marketplaceFee",
        label: "Marketplace Fees",
        help: "Platform commission or marketplace percentage fee.",
        suffix: "%",
        max: "99",
      },
      {
        key: "paymentFee",
        label: "Card Processing Fee",
        help: "Payment processing fee charged on the selling price.",
        suffix: "%",
        max: "99",
      },
      {
        key: "returnsAllowance",
        label: "Returns Allowance",
        help: "Expected returns, refunds or replacement cost per unit.",
        prefix: "$",
      },
    ],
    monthlyFields: [
      {
        key: "fixedCosts",
        label: "Monthly Fixed Costs",
        help: "Warehousing, software, insurance and other recurring costs.",
        prefix: "$",
      },
      {
        key: "monthlySales",
        label: "Expected Units Sold",
        help: "Expected number of units sold per month.",
        step: "1",
      },
      {
        key: "profitGoal",
        label: "Monthly Profit Goal",
        help: "Target profit after unit costs and fixed costs.",
        prefix: "$",
      },
    ],
    breakdownLabels: {
      productCost: "Product cost",
      shipping: "Shipping in",
      packaging: "Packaging",
      marketplaceFees: "Marketplace fees",
      paymentFees: "Card fees",
      returnsAllowance: "Returns",
      profit: "Profit",
    },
  },
  consulting: {
    key: "consulting",
    label: "Consulting Service",
    eyebrow: "Consulting Service",
    title: "Price a project around capacity, not wishful thinking.",
    description:
      "Connect project fees with delivery hours, labour cost and monthly business overheads so each engagement has a clear contribution.",
    unitSingular: "project",
    unitPlural: "projects",
    unitLabel: "Project",
    sellingPriceLabel: "Project Fee",
    variableFields: [
      {
        key: "labourHours",
        label: "Direct Labour Hours",
        help: "Hours required to deliver one project.",
        step: "0.25",
      },
      {
        key: "hourlyCost",
        label: "Hourly Cost",
        help: "Internal labour cost per delivery hour.",
        prefix: "$",
      },
    ],
    monthlyFields: [
      {
        key: "softwareCost",
        label: "Software Cost per Month",
        help: "Tools, subscriptions and systems used to deliver the work.",
        prefix: "$",
      },
      {
        key: "marketingCost",
        label: "Marketing Cost per Month",
        help: "Monthly acquisition and marketing spend.",
        prefix: "$",
      },
      {
        key: "monthlyOverheads",
        label: "Other Monthly Costs",
        help: "Admin, insurance, accounting and other recurring costs.",
        prefix: "$",
      },
      {
        key: "monthlySales",
        label: "Expected Projects per Month",
        help: "Expected number of completed projects per month.",
        step: "1",
      },
      {
        key: "profitGoal",
        label: "Monthly Profit Goal",
        help: "Target profit after delivery labour and monthly costs.",
        prefix: "$",
      },
    ],
    breakdownLabels: {
      labourCost: "Delivery labour",
      profit: "Profit",
    },
  },
};

function money(value: number) {
  if (!Number.isFinite(value)) {
    return "Not viable";
  }

  if (Object.is(value, -0)) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(value);
}

function percent(value: number) {
  if (!Number.isFinite(value)) {
    return "Not viable";
  }

  return `${percentFormatter.format(Object.is(value, -0) ? 0 : value)}%`;
}

function countWithUnit(value: number, singular = "sale", plural = "sales") {
  if (!Number.isFinite(value) || value < 0) {
    return "Not viable";
  }

  const rounded = Math.ceil(value);
  return `${numberFormatter.format(rounded)} ${
    rounded === 1 ? singular : plural
  }`;
}

function salesNumber(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "Not viable";
  }

  return numberFormatter.format(Math.ceil(value));
}

function titleCaseFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function safeInputValue(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function NumericInput({
  input,
  value,
  onChange,
}: {
  input: CostInput;
  value: number;
  onChange: (key: keyof PricingInputs, value: number) => void;
}) {
  return (
    <label className="calculatorField">
      <span className="calculatorFieldLabel">{input.label}</span>
      <span className="calculatorFieldHelp">{input.help}</span>
      <span className="calculatorInputWrap">
        {input.prefix ? <span aria-hidden="true">{input.prefix}</span> : null}
        <input
          inputMode="decimal"
          max={input.max}
          min="0"
          name={input.key}
          onChange={(event) =>
            onChange(input.key, Number(event.currentTarget.value))
          }
          step={input.step ?? "0.01"}
          type="number"
          value={safeInputValue(value)}
        />
        {input.suffix ? <span aria-hidden="true">{input.suffix}</span> : null}
      </span>
    </label>
  );
}

function MetricCard({
  label,
  unit,
  value,
}: {
  label: string;
  unit?: string;
  value: string;
}) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
      {unit && value !== "Not viable" ? <small>{unit}</small> : null}
    </article>
  );
}

function modeCopy(mode: CalculatorMode, preset: IndustryPreset) {
  if (mode === "Calculate Selling Price") {
    return {
      eyebrow: "Target Price",
      title: `Price the ${preset.unitSingular} for the margin you want.`,
      primaryLabel: `Recommended ${preset.unitLabel} Price`,
    };
  }

  if (mode === "Profit Planner") {
    return {
      eyebrow: "Monthly Plan",
      title: `Can the ${preset.unitPlural} support the goal?`,
      primaryLabel: "Estimated Monthly Profit",
    };
  }

  return {
    eyebrow: "Margin Check",
    title: `What each ${preset.unitSingular} actually earns.`,
    primaryLabel: "Gross Margin",
  };
}

function summaryText(
  mode: CalculatorMode,
  inputs: PricingInputs,
  results: ReturnType<typeof calculatePricing>,
  preset: IndustryPreset,
) {
  if (mode === "Calculate Selling Price") {
    if (!Number.isFinite(results.recommendedSellingPrice)) {
      return [
        "The target margin is not viable with the current fee structure.",
        "Lower the target margin or reduce percentage-based fees before using the recommended price.",
      ];
    }

    return [
      `To reach a ${percent(inputs.targetMargin)} gross margin, the recommended selling price is ${money(
        results.recommendedSellingPrice,
      )}.`,
      `At that price, each ${preset.unitSingular} would contribute ${money(
        results.targetProfitPerSale,
      )} before fixed expenses.`,
    ];
  }

  if (results.profitPerSale <= 0) {
    return [
      `At a selling price of ${money(inputs.sellingPrice)}, each ${preset.unitSingular} loses ${money(
        Math.abs(results.profitPerSale),
      )} before fixed expenses.`,
      "Break-even and target-profit volumes cannot be reached until the price rises or the costs come down.",
    ];
  }

  if (mode === "Profit Planner") {
    return [
      `At a selling price of ${money(inputs.sellingPrice)}, every ${preset.unitSingular} contributes ${money(
        results.profitPerSale,
      )} before fixed expenses, giving you a gross margin of ${percent(
        results.grossMargin,
      )}.`,
      `With monthly fixed costs of ${money(results.fixedCosts)}, you need approximately ${countWithUnit(
        results.breakEvenSales,
        preset.unitSingular,
        preset.unitPlural,
      )} per month to break even.`,
      `To reach your monthly profit target of ${money(
        inputs.profitGoal,
      )}, you need approximately ${countWithUnit(
        results.targetProfitSales,
        preset.unitSingular,
        preset.unitPlural,
      )}.`,
    ];
  }

  return [
    `At a selling price of ${money(inputs.sellingPrice)}, every ${preset.unitSingular} contributes ${money(
      results.profitPerSale,
    )} before fixed expenses, giving you a gross margin of ${percent(
      results.grossMargin,
    )}.`,
    "Use Calculate Selling Price if you want the tool to solve the price from a target margin.",
  ];
}

function breakdownDetails(
  item: PricingBreakdownItem,
  sellingPrice: number,
  variableCost: number,
) {
  const percentOfPrice =
    sellingPrice > 0 ? (item.value / sellingPrice) * 100 : 0;
  const percentOfCost =
    item.kind === "cost" && variableCost > 0 ? (item.value / variableCost) * 100 : 0;

  return {
    percentOfPrice,
    percentOfCost,
  };
}

export default function PricingMarginCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("Calculate Selling Price");
  const [activePresetKey, setActivePresetKey] = useState<PresetKey>("retail");
  const [inputs, setInputs] = useState<PricingInputs>(pricingPresets.retail.values);
  const [activeBreakdownLabel, setActiveBreakdownLabel] = useState<string | null>(
    null,
  );

  const activePreset = industryPresets[activePresetKey];
  const results = useMemo(
    () => calculatePricing(inputs, activePreset.breakdownLabels),
    [activePreset.breakdownLabels, inputs],
  );
  const pricingHealth = useMemo(
    () =>
      getPricingHealth(
        inputs,
        activePreset.unitSingular,
        activePreset.unitPlural,
      ),
    [activePreset.unitPlural, activePreset.unitSingular, inputs],
  );
  const copy = modeCopy(mode, activePreset);
  const summary = summaryText(mode, inputs, results, activePreset);
  const activeBreakdown = results.breakdown.find(
    (item) => item.label === activeBreakdownLabel,
  );

  const handleChange = (key: keyof PricingInputs, value: number) => {
    setInputs((current) => {
      const max = key === "paymentFee" || key === "targetMargin" ? 99 : undefined;
      const nextValue = clampNumber(value, 0, max);
      const next = {
        ...current,
        [key]: nextValue,
      };

      if (key === "targetMargin") {
        const price = recommendedSellingPrice(next);
        if (Number.isFinite(price)) {
          next.sellingPrice = roundToCents(price);
        }
      }

      if (key === "sellingPrice" && mode === "Calculate Selling Price") {
        const nextResults = calculatePricing(next);
        next.targetMargin = clampNumber(
          roundToCents(nextResults.grossMargin),
          0,
          99,
        );
      }

      return next;
    });
  };

  const handleDiscountChange = (value: number) => {
    handleChange("discount", clampNumber(value, 0, 100));
  };

  const loadPreset = (presetKey: string) => {
    const key = presetKey as PresetKey;
    setActivePresetKey(key);
    setInputs(pricingPresets[key].values);
    setActiveBreakdownLabel(null);
  };

  const primaryValue =
    mode === "Calculate Selling Price"
      ? money(results.recommendedSellingPrice)
      : mode === "Profit Planner"
        ? money(results.estimatedMonthlyProfit)
        : percent(results.grossMargin);
  const marginExampleCost =
    mode === "Calculate Selling Price" ? results.targetTrueCost : results.trueCost;
  const marginExamplePrice =
    mode === "Calculate Selling Price"
      ? results.recommendedSellingPrice
      : inputs.sellingPrice;
  const marginExampleProfit =
    mode === "Calculate Selling Price"
      ? results.targetProfitPerSale
      : results.profitPerSale;
  const marginExampleMargin =
    marginExamplePrice > 0
      ? (marginExampleProfit / marginExamplePrice) * 100
      : 0;
  const marginExampleMarkup =
    marginExampleCost > 0 ? (marginExampleProfit / marginExampleCost) * 100 : 0;

  const displayedInputs =
    mode === "Calculate Selling Price"
      ? [
          {
            ...sellingPriceInput,
            label: activePreset.sellingPriceLabel,
            help: `Current price charged for one ${activePreset.unitSingular}.`,
          },
          ...activePreset.variableFields,
          targetMarginInput,
        ]
      : mode === "Profit Planner"
        ? [
            {
              ...sellingPriceInput,
              label: activePreset.sellingPriceLabel,
              help: `Current price charged for one ${activePreset.unitSingular}.`,
            },
            ...activePreset.variableFields,
            ...activePreset.monthlyFields,
          ]
        : [
            ...activePreset.variableFields,
            {
              ...sellingPriceInput,
              label: activePreset.sellingPriceLabel,
              help: `Current price charged for one ${activePreset.unitSingular}.`,
            },
          ];

  const supportingCards =
    mode === "Calculate Selling Price"
      ? [
            [
              `Estimated Profit per ${activePreset.unitLabel}`,
              money(results.targetProfitPerSale),
            ],
            ["Target Margin", percent(inputs.targetMargin)],
            ["Markup", percent(results.targetMarkup)],
            ["Variable Cost Before Fees", money(results.variableCost)],
        ]
      : mode === "Profit Planner"
        ? [
            [`Profit per ${activePreset.unitLabel}`, money(results.profitPerSale)],
            [
              `Break-even ${titleCaseFirst(activePreset.unitPlural)}`,
              salesNumber(results.breakEvenSales),
            ],
            [
              `${titleCaseFirst(activePreset.unitPlural)} for Target Profit`,
              salesNumber(results.targetProfitSales),
            ],
            ["Monthly Revenue", money(results.monthlyRevenue)],
          ]
        : [
            [`True Cost per ${activePreset.unitLabel}`, money(results.trueCost)],
            [`Profit per ${activePreset.unitLabel}`, money(results.profitPerSale)],
            ["Markup", percent(results.markup)],
            ["Payment Fees", money(results.paymentFeeAmount)],
          ];

  return (
    <div className="calculatorShell">
      <section className="calculatorModePanel" aria-label="Calculation mode">
        {modes.map((item) => (
          <button
            aria-pressed={mode === item}
            className={mode === item ? "calculatorModeActive" : undefined}
            key={item}
            onClick={() => setMode(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </section>

      <section className="calculatorPresetPanel" aria-labelledby="calculator-presets">
        <div>
          <p className="eyebrow">Business Type</p>
          <h2 id="calculator-presets" className="section-title">
            Choose the business you want to model.
          </h2>
          <p className="body">
            {activePreset.description}
          </p>
        </div>
        <div className="presetActions">
          {Object.values(industryPresets).map((preset) => (
            <button
              aria-pressed={activePresetKey === preset.key}
              className={
                activePresetKey === preset.key ? "presetActionActive" : undefined
              }
              key={preset.key}
              onClick={() => loadPreset(preset.key)}
              type="button"
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setInputs(pricingPresets[activePresetKey].values)}
            type="button"
          >
            Reset {activePreset.unitLabel}
          </button>
        </div>
      </section>

      <section className="calculatorWorkspace">
        <div className="calculatorInputsPanel" aria-labelledby="calculator-inputs">
          <div className="calculatorPanelHeader">
            <p className="eyebrow">Inputs</p>
            <h2 id="calculator-inputs" className="section-title">
              {mode === "Profit Planner"
                ? `${activePreset.unitLabel} price, costs and monthly plan.`
                : mode === "Calculate Selling Price"
                  ? `${activePreset.unitLabel} costs and target margin.`
                  : `${activePreset.unitLabel} costs and current price.`}
            </h2>
          </div>

          <div className="calculatorFieldsGrid">
            {displayedInputs.map((input) => (
              <NumericInput
                input={input}
                key={input.key}
                onChange={handleChange}
                value={inputs[input.key]}
              />
            ))}
          </div>
        </div>

        <div className="calculatorResultsPanel" aria-labelledby="calculator-results">
          <div className="calculatorPanelHeader">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="calculator-results" className="section-title">
              {copy.title}
            </h2>
          </div>

          <div className="calculatorHeroMetric" aria-live="polite">
            <span>{copy.primaryLabel}</span>
            <strong>{primaryValue}</strong>
          </div>

          <div className="calculatorSummaryCards">
            {supportingCards.map(([label, value, unit]) => (
              <MetricCard key={label} label={label} unit={unit} value={value} />
            ))}
          </div>
        </div>
      </section>

      <section className="pricingHealthPanel" aria-labelledby="pricing-health">
        <div>
          <p className="eyebrow">Pricing Health</p>
          <h2 id="pricing-health" className="section-title">
            {pricingHealth.state}
          </h2>
        </div>
        <ul>
          {pricingHealth.notes.map((note) => (
            <li className="body" key={note}>
              {note}
            </li>
          ))}
        </ul>
      </section>

      <section className="calculatorBreakdownPanel" aria-labelledby="cost-breakdown">
        <div>
          <p className="eyebrow">Cost Breakdown</p>
          <h2 id="cost-breakdown" className="section-title">
            Where each dollar goes.
          </h2>
          <p className="body">
            {activePreset.unitLabel} selling price:{" "}
            <strong>{money(inputs.sellingPrice)}</strong>
          </p>
        </div>

        <div
          className="costStack"
          aria-label={`Cost breakdown for a selling price of ${money(
            inputs.sellingPrice,
          )}`}
        >
          {results.breakdown.map((item) => {
            const width =
              inputs.sellingPrice > 0
                ? Math.max(0, (item.value / inputs.sellingPrice) * 100)
                : 0;

            if (width <= 0) {
              return null;
            }

            return (
              <button
                className={`costSegment ${item.className}`}
                key={item.label}
                onBlur={() => setActiveBreakdownLabel(null)}
                onClick={() => setActiveBreakdownLabel(item.label)}
                onFocus={() => setActiveBreakdownLabel(item.label)}
                onMouseEnter={() => setActiveBreakdownLabel(item.label)}
                onMouseLeave={() => setActiveBreakdownLabel(null)}
                style={{ width: `${Math.min(100, width)}%` }}
                title={`${item.label}: ${money(item.value)}`}
                type="button"
              >
                <span className="srOnly">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="costLegend">
          {results.breakdown.map((item) => {
            const details = breakdownDetails(
              item,
              inputs.sellingPrice,
              results.variableCost,
            );

            return (
              <button
                className={
                  activeBreakdownLabel === item.label
                    ? "costLegendActive"
                    : undefined
                }
                key={item.label}
                onClick={() => setActiveBreakdownLabel(item.label)}
                onFocus={() => setActiveBreakdownLabel(item.label)}
                onMouseEnter={() => setActiveBreakdownLabel(item.label)}
                onMouseLeave={() => setActiveBreakdownLabel(null)}
                type="button"
              >
                <i className={item.className} aria-hidden="true" />
                <span>
                  {item.label}: {money(item.value)}
                </span>
                <small>{percent(details.percentOfPrice)} of price</small>
              </button>
            );
          })}
        </div>

        <div className="breakdownTooltip" aria-live="polite">
          {activeBreakdown ? (
            <>
              <strong>{activeBreakdown.label}</strong>
              <span>{money(activeBreakdown.value)}</span>
              <span>
                {percent(
                  breakdownDetails(
                    activeBreakdown,
                    inputs.sellingPrice,
                    results.variableCost,
                  ).percentOfPrice,
                )}{" "}
                of selling price
              </span>
              {activeBreakdown.kind === "cost" ? (
                <span>
                  {percent(
                    breakdownDetails(
                      activeBreakdown,
                      inputs.sellingPrice,
                      results.variableCost,
                    ).percentOfCost,
                  )}{" "}
                  of variable costs before fees
                </span>
              ) : null}
            </>
          ) : (
            <span>Hover, tap or focus a segment to inspect it.</span>
          )}
        </div>
      </section>

      <section className="calculatorNarrative" aria-labelledby="plain-summary">
        <p className="eyebrow">Plain English Summary</p>
        <h2 id="plain-summary" className="section-title">
          The operating read.
        </h2>
        {summary.map((line) => (
          <p className="body-large" key={line}>
            {line}
          </p>
        ))}
      </section>

      <section className="discountPanel" aria-labelledby="discount-impact">
        <div className="calculatorPanelHeader">
          <p className="eyebrow">Discount Impact</p>
          <h2 id="discount-impact" className="section-title">
            Test what a discount really costs.
          </h2>
        </div>

        <label className="discountSlider">
          <span>Discount: {inputs.discount}%</span>
          <input
            aria-label="Discount percentage"
            max="50"
            min="0"
            onChange={(event) =>
              handleDiscountChange(Number(event.currentTarget.value))
            }
            onInput={(event) =>
              handleDiscountChange(Number(event.currentTarget.value))
            }
            step="5"
            type="range"
            value={Math.min(inputs.discount, 50)}
          />
        </label>

        <label className="discountManualInput">
          <span>Enter discount manually</span>
          <span className="calculatorInputWrap">
            <input
              inputMode="decimal"
              max="100"
              min="0"
              name="discount"
              onChange={(event) =>
                handleDiscountChange(Number(event.currentTarget.value))
              }
              step="0.1"
              type="number"
              value={safeInputValue(inputs.discount)}
            />
            <span aria-hidden="true">%</span>
          </span>
        </label>

        <div className="discountTicks" aria-label="Discount presets">
          {discountOptions.map((tick) => (
            <button
              className={inputs.discount === tick ? "discountTickActive" : undefined}
              key={tick}
              onClick={() => handleDiscountChange(tick)}
              type="button"
            >
              {tick}%
            </button>
          ))}
        </div>

        <div className="discountCards">
          <MetricCard
            label={`Original ${activePreset.unitLabel} Price`}
            value={money(inputs.sellingPrice)}
          />
          <MetricCard label="Discounted Price" value={money(results.discountedPrice)} />
          <MetricCard label="Original Profit" value={money(results.profitPerSale)} />
          <MetricCard label="Discounted Profit" value={money(results.discountedProfit)} />
          <MetricCard
            label={`Profit Lost per ${activePreset.unitLabel}`}
            value={money(results.profitLostPerSale)}
          />
          <MetricCard label="Profit Reduction" value={percent(results.profitReduction)} />
          <MetricCard
            label={`Additional ${activePreset.unitPlural} Required`}
            value={salesNumber(results.additionalSalesRequired)}
          />
        </div>

        <div className="calculatorInsight">
          <p className="body">
            A {inputs.discount}% discount reduces revenue by {inputs.discount}%.
            In this scenario, it reduces profit per sale by{" "}
            {percent(results.profitReduction)}.
          </p>
          <p className="body">
            {results.discountedProfit <= 0
              ? "The discounted sale produces zero or negative profit, so extra volume cannot recover the lost gross profit."
              : `To earn the same total gross profit at the discounted price, you need about ${countWithUnit(
                  results.additionalSalesRequired,
                  activePreset.unitSingular,
                  activePreset.unitPlural,
                )} beyond the current monthly volume.`}
          </p>
        </div>
      </section>

      <section className="marginEducation" aria-labelledby="margin-markup">
        <div className="educationHeader">
          <p className="eyebrow">Margin vs Markup</p>
          <h2 id="margin-markup" className="section-title">
            Two numbers that are easy to confuse.
          </h2>
          <p className="body">
            These figures use the current {activePreset.unitSingular} inputs,
            so the explanation changes as your price and costs change.
          </p>
        </div>

        <div className="marginExample">
          <article>
            <span>True Cost</span>
            <strong>{money(marginExampleCost)}</strong>
          </article>
          <article>
            <span>Selling Price</span>
            <strong>{money(marginExamplePrice)}</strong>
          </article>
          <article>
            <span>Profit</span>
            <strong>{money(marginExampleProfit)}</strong>
          </article>
        </div>

        <div className="educationCopyGrid">
          <article className="educationTextCard">
            <span>Margin</span>
            <p className="body-large">
              Margin compares profit with selling price. Here,{" "}
              {money(marginExampleProfit)} profit divided by{" "}
              {money(marginExamplePrice)} creates a {percent(marginExampleMargin)}{" "}
              margin.
            </p>
          </article>
          <article className="educationTextCard">
            <span>Markup</span>
            <p className="body-large">
              Markup compares profit with cost. The same{" "}
              {money(marginExampleProfit)} profit divided by{" "}
              {money(marginExampleCost)} creates a {percent(marginExampleMarkup)}{" "}
              markup.
            </p>
          </article>
        </div>
      </section>

      <section
        className="marginEducation educationSplitPanel"
        aria-labelledby="fixed-variable-costs"
      >
        <div className="educationHeader">
          <p className="eyebrow">Cost Structure</p>
          <h2 id="fixed-variable-costs" className="section-title">
            Variable costs decide the {activePreset.unitSingular}. Fixed costs
            decide the month.
          </h2>
        </div>

        <div className="educationMetricGrid">
          <article>
            <span>Variable Cost per {activePreset.unitLabel}</span>
            <strong>{money(results.trueCost)}</strong>
            <p className="body">
              Costs that move with each {activePreset.unitSingular}, including
              fees.
            </p>
          </article>
          <article>
            <span>Monthly Fixed Costs</span>
            <strong>{money(results.fixedCosts)}</strong>
            <p className="body">
              Costs that exist before the first {activePreset.unitSingular} is
              sold.
            </p>
          </article>
          <article>
            <span>Break-even {titleCaseFirst(activePreset.unitPlural)}</span>
            <strong>{salesNumber(results.breakEvenSales)}</strong>
            <p className="body">
              The monthly volume required before profit starts.
            </p>
          </article>
        </div>
      </section>

      <section className="marginEducation" aria-labelledby="pricing-mistakes">
        <div className="educationHeader">
          <p className="eyebrow">Common Mistakes</p>
          <h2 id="pricing-mistakes" className="section-title">
            Most pricing errors begin before the price is entered.
          </h2>
        </div>

        <div className="mistakeGrid">
          <article className="educationTextCard">
            <span>Margin vs Markup</span>
            <p className="body">
              A {percent(marginExampleMarkup)} markup does not mean a{" "}
              {percent(marginExampleMarkup)} margin. In this scenario, the
              margin is {percent(marginExampleMargin)}.
            </p>
          </article>
          <article className="educationTextCard">
            <span>Discounting Profit</span>
            <p className="body">
              A {inputs.discount}% discount reduces profit per{" "}
              {activePreset.unitSingular} by {percent(results.profitReduction)},
              which is why discounts deserve caution.
            </p>
          </article>
          <article className="educationTextCard">
            <span>Small Costs</span>
            <p className="body">
              Fees, packaging and delivery look harmless alone. Together, they
              decide whether the {activePreset.unitSingular} is worth selling.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
