"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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

type TooltipContent = {
  title: string;
  text: string;
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

const blankPricingInputs: PricingInputs = {
  productCost: 0,
  secondaryCost: 0,
  labourCost: 0,
  frontOfHouseLabour: 0,
  labourHours: 0,
  hourlyCost: 0,
  packaging: 0,
  shipping: 0,
  otherCosts: 0,
  paymentFee: 0,
  marketplaceFee: 0,
  returnsAllowance: 0,
  sellingPrice: 0,
  targetMargin: 0,
  fixedCosts: 0,
  monthlyRent: 0,
  utilities: 0,
  monthlyOverheads: 0,
  softwareCost: 0,
  marketingCost: 0,
  monthlySales: 0,
  profitGoal: 0,
  discount: 10,
};

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

const tooltipByKey: Partial<Record<keyof PricingInputs, TooltipContent>> = {
  targetMargin: {
    title: "Target Gross Margin",
    text: "The share of selling price left after direct costs. Example: $40 profit on a $100 sale is a 40% margin.",
  },
  paymentFee: {
    title: "Card Processing Fee",
    text: "The percentage charged by a payment provider. Example: a 2% fee on a $100 sale costs $2.",
  },
  marketplaceFee: {
    title: "Marketplace Fees",
    text: "The commission charged by a selling platform. Example: a 12% marketplace fee on a $100 sale costs $12.",
  },
  returnsAllowance: {
    title: "Returns Allowance",
    text: "A per-sale estimate for refunds, replacements or returns. Example: allowing $3 per unit protects margin before returns happen.",
  },
  fixedCosts: {
    title: "Monthly Fixed Costs",
    text: "Costs that stay even when sales are low. Example: $8,000 in rent and software must be covered before profit begins.",
  },
  monthlyRent: {
    title: "Monthly Rent",
    text: "A fixed monthly cost for the site or venue. Example: $7,000 rent still exists before the first sale.",
  },
  monthlyOverheads: {
    title: "Monthly Overheads",
    text: "Recurring costs outside direct production. Example: insurance, cleaning and subscriptions might add $2,000 per month.",
  },
  softwareCost: {
    title: "Software Cost",
    text: "Monthly tools needed to run or deliver the work. Example: $500 in subscriptions is a fixed cost, not a per-sale cost.",
  },
  marketingCost: {
    title: "Marketing Cost",
    text: "Monthly spend used to attract customers. Example: $2,000 in ads must be covered by gross profit.",
  },
  monthlySales: {
    title: "Expected Monthly Volume",
    text: "The number of units you expect to sell in a month. Example: 300 units at $50 equals $15,000 revenue.",
  },
  profitGoal: {
    title: "Monthly Profit Goal",
    text: "The profit target after variable and fixed costs. Example: $10,000 profit requires enough volume after break-even.",
  },
};

function tooltipForLabel(label: string): TooltipContent | undefined {
  const normalized = label.toLowerCase();

  if (normalized.includes("markup")) {
    return {
      title: "Markup",
      text: "Markup compares profit with cost. Example: $50 cost sold for $75 has a 50% markup.",
    };
  }

  if (normalized.includes("margin")) {
    return tooltipByKey.targetMargin;
  }

  if (normalized.includes("variable cost")) {
    return {
      title: "Variable Cost",
      text: "Costs that move with each sale. Example: product, packaging and card fees increase when volume increases.",
    };
  }

  if (normalized.includes("break-even")) {
    return {
      title: "Break-even",
      text: "The sales volume where gross profit covers fixed costs. Example: $8,000 fixed costs divided by $40 profit needs 200 sales.",
    };
  }

  if (normalized.includes("card") || normalized.includes("processing")) {
    return tooltipByKey.paymentFee;
  }

  if (normalized.includes("marketplace")) {
    return tooltipByKey.marketplaceFee;
  }

  if (normalized.includes("returns")) {
    return tooltipByKey.returnsAllowance;
  }

  if (normalized.includes("fixed cost")) {
    return tooltipByKey.fixedCosts;
  }

  return undefined;
}

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

function markupFromCost(profit: number, cost: number) {
  return cost > 0 && Number.isFinite(profit) ? (profit / cost) * 100 : 0;
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

function numericValue(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "Not viable";
  }

  return numberFormatter.format(Math.ceil(value));
}

function titleCaseFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildVolumeScenarios(monthlySales: number) {
  const baseVolume = Math.max(1, Math.round(monthlySales || 100));
  const multipliers = [0.5, 1, 1.5, 2];

  return multipliers.map((multiplier) =>
    Math.max(1, Math.round(baseVolume * multiplier)),
  );
}

function calculateAtVolume(
  inputs: PricingInputs,
  volume: number,
  labels: PricingBreakdownLabels,
) {
  return calculatePricing(
    {
      ...inputs,
      monthlySales: Math.max(0, Math.round(volume)),
    },
    labels,
  );
}

function safeInputValue(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function NumericInput({
  activeTooltip,
  input,
  onTooltipToggle,
  value,
  onChange,
}: {
  activeTooltip: string | null;
  input: CostInput;
  onTooltipToggle: (id: string) => void;
  value: number;
  onChange: (key: keyof PricingInputs, value: number) => void;
}) {
  const tooltip = tooltipByKey[input.key] ?? tooltipForLabel(input.label);
  const tooltipId = `input-${String(input.key)}`;

  return (
    <label className="calculatorField">
      <span className="calculatorFieldLabel">
        {input.label}
        {tooltip ? (
          <InfoTooltip
            active={activeTooltip === tooltipId}
            content={tooltip}
            id={tooltipId}
            onToggle={onTooltipToggle}
          />
        ) : null}
      </span>
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
  activeTooltip,
  label,
  onTooltipToggle,
  tooltipId,
  unit,
  value,
}: {
  activeTooltip?: string | null;
  label: string;
  onTooltipToggle?: (id: string) => void;
  tooltipId?: string;
  unit?: string;
  value: string;
}) {
  const tooltip = tooltipForLabel(label);
  const cardTooltipId =
    tooltipId ?? `metric-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <article>
      <span>
        {label}
        {tooltip && onTooltipToggle ? (
          <InfoTooltip
            active={activeTooltip === cardTooltipId}
            content={tooltip}
            id={cardTooltipId}
            onToggle={onTooltipToggle}
          />
        ) : null}
      </span>
      <strong>{value}</strong>
      {unit && value !== "Not viable" ? <small>{unit}</small> : null}
    </article>
  );
}

function InfoTooltip({
  active,
  content,
  id,
  onToggle,
}: {
  active: boolean;
  content: TooltipContent;
  id: string;
  onToggle: (id: string) => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [bubbleStyle, setBubbleStyle] = useState<CSSProperties>({});

  const updateBubblePosition = useCallback((button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    const width = Math.min(280, window.innerWidth - 32);
    const horizontalPadding = 16;
    const estimatedHeight = 134;
    const verticalPadding = 16;
    const left = Math.min(
      window.innerWidth - width / 2 - horizontalPadding,
      Math.max(width / 2 + horizontalPadding, rect.left + rect.width / 2),
    );
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldOpenAbove =
      spaceBelow < estimatedHeight + verticalPadding &&
      rect.top > estimatedHeight + verticalPadding;
    const top = shouldOpenAbove
      ? Math.max(verticalPadding, rect.top - estimatedHeight - 12)
      : Math.min(
          window.innerHeight - verticalPadding - estimatedHeight,
          rect.bottom + 12,
        );

    setBubbleStyle({
      "--tooltip-left": `${left}px`,
      "--tooltip-top": `${top}px`,
      "--tooltip-width": `${width}px`,
    } as CSSProperties);
  }, []);

  const openTooltip = useCallback(
    (button: HTMLButtonElement) => {
      updateBubblePosition(button);
      onToggle(id);
    },
    [id, onToggle, updateBubblePosition],
  );

  const closeTooltipForHover = () => {
    if (window.matchMedia("(hover: hover)").matches) {
      onToggle("");
    }
  };

  useEffect(() => {
    const button = triggerRef.current;

    if (!button) {
      return undefined;
    }

    const openFromNativeEvent = (event: Event) => {
      event.stopPropagation();
      openTooltip(button);
    };

    button.addEventListener("click", openFromNativeEvent);
    button.addEventListener("pointerdown", openFromNativeEvent);
    button.addEventListener("touchstart", openFromNativeEvent);

    return () => {
      button.removeEventListener("click", openFromNativeEvent);
      button.removeEventListener("pointerdown", openFromNativeEvent);
      button.removeEventListener("touchstart", openFromNativeEvent);
    };
  }, [openTooltip]);

  return (
    <span
      className={`tooltipWrap${active ? " tooltipActive" : ""}`}
      style={bubbleStyle}
    >
      <button
        aria-describedby={`${id}-tooltip`}
        aria-expanded={active}
        aria-label={`Explain ${content.title}`}
        className="tooltipTrigger"
        ref={triggerRef}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          openTooltip(event.currentTarget);
        }}
        onFocus={(event) => {
          openTooltip(event.currentTarget);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onToggle("");
          }
        }}
        onMouseEnter={(event) => {
          openTooltip(event.currentTarget);
        }}
        onMouseLeave={closeTooltipForHover}
        onMouseDown={(event) => {
          event.stopPropagation();
          openTooltip(event.currentTarget);
        }}
        onMouseMove={(event) => {
          openTooltip(event.currentTarget);
        }}
        onMouseOver={(event) => {
          openTooltip(event.currentTarget);
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          openTooltip(event.currentTarget);
        }}
        onPointerEnter={(event) => {
          openTooltip(event.currentTarget);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") {
            closeTooltipForHover();
          }
        }}
        onPointerMove={(event) => {
          openTooltip(event.currentTarget);
        }}
        onTouchStart={(event) => {
          event.stopPropagation();
          openTooltip(event.currentTarget);
        }}
        type="button"
      >
        ?
      </button>
      <span className="tooltipBubble" id={`${id}-tooltip`} role="tooltip">
        <strong className="tooltipTitle">{content.title}</strong>
        {content.text}
      </span>
    </span>
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
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [volumeScenarios, setVolumeScenarios] = useState<number[]>(() =>
    buildVolumeScenarios(pricingPresets.retail.values.monthlySales),
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
  const volumeRows = useMemo(
    () =>
      volumeScenarios.map((volume) => ({
        volume,
        results: calculateAtVolume(
          inputs,
          volume,
          activePreset.breakdownLabels,
        ),
      })),
    [activePreset.breakdownLabels, inputs, volumeScenarios],
  );
  const handleChange = (key: keyof PricingInputs, value: number) => {
    setInputs((current) => {
      const max =
        key === "paymentFee" ||
        key === "marketplaceFee" ||
        key === "targetMargin"
          ? 99
          : undefined;
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

  const handleTooltipToggle = (id: string) => {
    setActiveTooltip(id === "" ? null : id);
  };

  const loadPreset = (presetKey: string) => {
    const key = presetKey as PresetKey;
    setActivePresetKey(key);
    setInputs(pricingPresets[key].values);
    setVolumeScenarios(buildVolumeScenarios(pricingPresets[key].values.monthlySales));
    setActiveBreakdownLabel(null);
  };

  const resetActiveInputs = () => {
    setInputs(blankPricingInputs);
    setVolumeScenarios(buildVolumeScenarios(blankPricingInputs.monthlySales));
    setActiveBreakdownLabel(null);
  };

  const handleVolumeScenarioChange = (index: number, value: number) => {
    setVolumeScenarios((current) =>
      current.map((volume, itemIndex) =>
        itemIndex === index ? Math.round(clampNumber(value, 0)) : volume,
      ),
    );
  };

  const resetVolumeScenarios = () => {
    setVolumeScenarios(buildVolumeScenarios(inputs.monthlySales));
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
    markupFromCost(marginExampleProfit, marginExampleCost);

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
            [
              "Markup",
              percent(
                markupFromCost(
                  results.targetProfitPerSale,
                  results.targetTrueCost,
                ),
              ),
            ],
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
            [
              "Markup",
              percent(markupFromCost(results.profitPerSale, results.trueCost)),
            ],
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
            onClick={resetActiveInputs}
            type="button"
          >
            Reset {activePreset.unitLabel}
          </button>
        </div>
        <p className="presetNote body">
          Typical starting values. Edit them to match your business.
        </p>
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
                activeTooltip={activeTooltip}
                input={input}
                key={input.key}
                onChange={handleChange}
                onTooltipToggle={handleTooltipToggle}
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
            {supportingCards.map(([label, value, unit], index) => (
              <MetricCard
                activeTooltip={activeTooltip}
                key={label}
                label={label}
                onTooltipToggle={handleTooltipToggle}
                tooltipId={`summary-${index}-${label
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}`}
                unit={unit}
                value={value}
              />
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

      <section className="breakEvenHighlight" aria-labelledby="break-even-highlight">
        <div>
          <p className="eyebrow">
            Break-even
            <InfoTooltip
              active={activeTooltip === "highlight-break-even"}
              content={
                tooltipForLabel("Break-even Units") as TooltipContent
              }
              id="highlight-break-even"
              onToggle={handleTooltipToggle}
            />
          </p>
          <h2 id="break-even-highlight" className="section-title">
            {numericValue(results.breakEvenSales)}
          </h2>
        </div>
        <div>
          <p className="body-large">
            {Number.isFinite(results.breakEvenSales)
              ? `You need approximately ${countWithUnit(
                  results.breakEvenSales,
                  activePreset.unitSingular,
                  activePreset.unitPlural,
                )} per month before the business stops losing money.`
              : "Break-even cannot be reached until each sale produces positive profit."}
          </p>
          <a href="#cost-breakdown">See cost breakdown</a>
        </div>
      </section>

      <section className="scenarioPanel" aria-labelledby="volume-comparison">
        <div className="scenarioHeader">
          <p className="eyebrow">Volume Scenarios</p>
          <h2 id="volume-comparison" className="section-title">
            What happens when volume changes?
          </h2>
          <p className="body">
            Compare revenue, variable cost, fixed cost and net profit at
            different monthly volumes. The rows use your current price and cost
            inputs.
          </p>
        </div>

        <div className="volumeTableWrap">
          <table className="volumeTable">
            <caption className="srOnly">
              Profit outcomes at different monthly volumes
            </caption>
            <thead>
              <tr>
                <th scope="col">Volume</th>
                <th scope="col">Revenue</th>
                <th scope="col">
                  Variable Cost
                  <InfoTooltip
                    active={activeTooltip === "volume-variable-cost"}
                    content={tooltipForLabel("Variable Cost") as TooltipContent}
                    id="volume-variable-cost"
                    onToggle={handleTooltipToggle}
                  />
                </th>
                <th scope="col">
                  Fixed Costs
                  <InfoTooltip
                    active={activeTooltip === "volume-fixed-costs"}
                    content={tooltipForLabel("Fixed Costs") as TooltipContent}
                    id="volume-fixed-costs"
                    onToggle={handleTooltipToggle}
                  />
                </th>
                <th scope="col">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {volumeRows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <label>
                      <span className="srOnly">
                        Monthly {activePreset.unitPlural} for scenario {index + 1}
                      </span>
                      <input
                        inputMode="numeric"
                        min="0"
                        onChange={(event) =>
                          handleVolumeScenarioChange(
                            index,
                            Number(event.currentTarget.value),
                          )
                        }
                        step="1"
                        type="number"
                        value={row.volume}
                      />
                    </label>
                  </td>
                  <td>{money(row.results.monthlyRevenue)}</td>
                  <td>{money(row.results.monthlyVariableCosts)}</td>
                  <td>{money(row.results.fixedCosts)}</td>
                  <td>{money(row.results.estimatedMonthlyProfit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="textButton" onClick={resetVolumeScenarios} type="button">
          Reset volume steps
        </button>
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
            activeTooltip={activeTooltip}
            label={`Original ${activePreset.unitLabel} Price`}
            onTooltipToggle={handleTooltipToggle}
            tooltipId="discount-original-price"
            value={money(inputs.sellingPrice)}
          />
          <MetricCard
            activeTooltip={activeTooltip}
            label="Discounted Price"
            onTooltipToggle={handleTooltipToggle}
            tooltipId="discount-discounted-price"
            value={money(results.discountedPrice)}
          />
          <MetricCard
            activeTooltip={activeTooltip}
            label="Original Profit"
            onTooltipToggle={handleTooltipToggle}
            tooltipId="discount-original-profit"
            value={money(results.profitPerSale)}
          />
          <MetricCard
            activeTooltip={activeTooltip}
            label="Discounted Profit"
            onTooltipToggle={handleTooltipToggle}
            tooltipId="discount-discounted-profit"
            value={money(results.discountedProfit)}
          />
          <MetricCard
            activeTooltip={activeTooltip}
            label={`Profit Lost per ${activePreset.unitLabel}`}
            onTooltipToggle={handleTooltipToggle}
            tooltipId="discount-profit-lost"
            value={money(results.profitLostPerSale)}
          />
          <MetricCard
            activeTooltip={activeTooltip}
            label="Profit Reduction"
            onTooltipToggle={handleTooltipToggle}
            tooltipId="discount-profit-reduction"
            value={percent(results.profitReduction)}
          />
          <MetricCard
            activeTooltip={activeTooltip}
            label={`Additional ${activePreset.unitPlural} Required`}
            onTooltipToggle={handleTooltipToggle}
            tooltipId="discount-additional-volume-required"
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
            <span>
              True Cost
              <InfoTooltip
                active={activeTooltip === "education-true-cost"}
                content={tooltipForLabel("Variable Cost") as TooltipContent}
                id="education-true-cost"
                onToggle={handleTooltipToggle}
              />
            </span>
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
            <span>
              Margin
              <InfoTooltip
                active={activeTooltip === "education-margin"}
                content={tooltipForLabel("Margin") as TooltipContent}
                id="education-margin"
                onToggle={handleTooltipToggle}
              />
            </span>
            <p className="body-large">
              Margin compares profit with selling price. Here,{" "}
              {money(marginExampleProfit)} profit divided by{" "}
              {money(marginExamplePrice)} creates a {percent(marginExampleMargin)}{" "}
              margin.
            </p>
          </article>
          <article className="educationTextCard">
            <span>
              Markup
              <InfoTooltip
                active={activeTooltip === "education-markup"}
                content={tooltipForLabel("Markup") as TooltipContent}
                id="education-markup"
                onToggle={handleTooltipToggle}
              />
            </span>
            <p className="body-large">
              Markup compares profit with cost. The same{" "}
              {money(marginExampleProfit)} profit divided by{" "}
              {money(marginExampleCost)} creates a {percent(marginExampleMarkup)}{" "}
              markup.
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
