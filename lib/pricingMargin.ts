export type PricingInputs = {
  productCost: number;
  secondaryCost: number;
  labourCost: number;
  frontOfHouseLabour: number;
  labourHours: number;
  hourlyCost: number;
  packaging: number;
  shipping: number;
  otherCosts: number;
  paymentFee: number;
  marketplaceFee: number;
  returnsAllowance: number;
  sellingPrice: number;
  targetMargin: number;
  fixedCosts: number;
  monthlyRent: number;
  utilities: number;
  monthlyOverheads: number;
  softwareCost: number;
  marketingCost: number;
  monthlySales: number;
  profitGoal: number;
  discount: number;
};

export type PricingHealthState =
  | "Strong"
  | "Viable"
  | "Needs attention"
  | "Unsustainable";

export type PricingBreakdownItem = {
  label: string;
  value: number;
  className: string;
  kind: "cost" | "profit";
};

export type PricingBreakdownLabels = Partial<{
  productCost: string;
  secondaryCost: string;
  labourCost: string;
  frontOfHouseLabour: string;
  packaging: string;
  shipping: string;
  otherCosts: string;
  returnsAllowance: string;
  paymentFees: string;
  marketplaceFees: string;
  profit: string;
}>;

export const defaultPricingInputs: PricingInputs = {
  productCost: 25,
  secondaryCost: 0,
  labourCost: 8,
  frontOfHouseLabour: 0,
  labourHours: 0,
  hourlyCost: 0,
  packaging: 2,
  shipping: 6,
  otherCosts: 1.5,
  paymentFee: 2.2,
  marketplaceFee: 0,
  returnsAllowance: 0,
  sellingPrice: 79,
  targetMargin: 60,
  fixedCosts: 8000,
  monthlyRent: 0,
  utilities: 0,
  monthlyOverheads: 0,
  softwareCost: 0,
  marketingCost: 0,
  monthlySales: 300,
  profitGoal: 10000,
  discount: 10,
};

export const pricingPresets: Record<
  string,
  {
    label: string;
    values: PricingInputs;
  }
> = {
  coffee: {
    label: "Coffee shop",
    values: {
      productCost: 0.82,
      secondaryCost: 0.58,
      labourCost: 1.1,
      frontOfHouseLabour: 0,
      labourHours: 0,
      hourlyCost: 0,
      packaging: 0.35,
      shipping: 0,
      otherCosts: 0,
      paymentFee: 1.8,
      marketplaceFee: 0,
      returnsAllowance: 0,
      sellingPrice: 5.5,
      targetMargin: 62,
      fixedCosts: 0,
      monthlyRent: 7200,
      utilities: 1800,
      monthlyOverheads: 3500,
      softwareCost: 0,
      marketingCost: 0,
      monthlySales: 5200,
      profitGoal: 8000,
      discount: 10,
    },
  },
  restaurant: {
    label: "Restaurant meal",
    values: {
      productCost: 14,
      secondaryCost: 0,
      labourCost: 6.5,
      frontOfHouseLabour: 2.8,
      labourHours: 0,
      hourlyCost: 0,
      packaging: 0,
      shipping: 0,
      otherCosts: 0,
      paymentFee: 2.1,
      marketplaceFee: 0,
      returnsAllowance: 0,
      sellingPrice: 42,
      targetMargin: 40,
      fixedCosts: 0,
      monthlyRent: 26000,
      utilities: 5200,
      monthlyOverheads: 10800,
      softwareCost: 0,
      marketingCost: 0,
      monthlySales: 1800,
      profitGoal: 18000,
      discount: 10,
    },
  },
  retail: {
    label: "Retail product",
    values: {
      productCost: 32,
      secondaryCost: 0,
      labourCost: 0,
      frontOfHouseLabour: 0,
      labourHours: 0,
      hourlyCost: 0,
      packaging: 2.5,
      shipping: 7,
      otherCosts: 0,
      paymentFee: 2.4,
      marketplaceFee: 12,
      returnsAllowance: 3,
      sellingPrice: 99,
      targetMargin: 48,
      fixedCosts: 15000,
      monthlyRent: 0,
      utilities: 0,
      monthlyOverheads: 0,
      softwareCost: 0,
      marketingCost: 0,
      monthlySales: 420,
      profitGoal: 12000,
      discount: 10,
    },
  },
  consulting: {
    label: "Consulting service",
    values: {
      productCost: 0,
      secondaryCost: 0,
      labourCost: 0,
      frontOfHouseLabour: 0,
      labourHours: 6,
      hourlyCost: 95,
      packaging: 0,
      shipping: 0,
      otherCosts: 0,
      paymentFee: 1.9,
      marketplaceFee: 0,
      returnsAllowance: 0,
      sellingPrice: 1800,
      targetMargin: 55,
      fixedCosts: 0,
      monthlyRent: 0,
      utilities: 0,
      monthlyOverheads: 3000,
      softwareCost: 1800,
      marketingCost: 4200,
      monthlySales: 18,
      profitGoal: 15000,
      discount: 10,
    },
  },
};

export function clampNumber(value: number, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

export function roundToCents(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(value.toFixed(2));
}

export function variableCostBeforeFee(inputs: PricingInputs) {
  return (
    inputs.productCost +
    inputs.secondaryCost +
    inputs.labourCost +
    inputs.frontOfHouseLabour +
    inputs.labourHours * inputs.hourlyCost +
    inputs.packaging +
    inputs.shipping +
    inputs.otherCosts +
    inputs.returnsAllowance
  );
}

export function fixedCostTotal(inputs: PricingInputs) {
  return (
    inputs.fixedCosts +
    inputs.monthlyRent +
    inputs.utilities +
    inputs.monthlyOverheads +
    inputs.softwareCost +
    inputs.marketingCost
  );
}

export function recommendedSellingPrice(inputs: PricingInputs) {
  const feeRate = (inputs.paymentFee + inputs.marketplaceFee) / 100;
  const targetMarginRate = inputs.targetMargin / 100;
  const denominator = 1 - feeRate - targetMarginRate;

  if (denominator <= 0) {
    return Infinity;
  }

  return variableCostBeforeFee(inputs) / denominator;
}

export function calculatePricing(
  inputs: PricingInputs,
  labels: PricingBreakdownLabels = {},
) {
  const variableCost = variableCostBeforeFee(inputs);
  const fixedCosts = fixedCostTotal(inputs);
  const paymentFeeRate = inputs.paymentFee / 100;
  const marketplaceFeeRate = inputs.marketplaceFee / 100;
  const totalFeeRate = paymentFeeRate + marketplaceFeeRate;
  const paymentFeeAmount = inputs.sellingPrice * paymentFeeRate;
  const marketplaceFeeAmount = inputs.sellingPrice * marketplaceFeeRate;
  const trueCost = variableCost + paymentFeeAmount + marketplaceFeeAmount;
  const profitPerSale = inputs.sellingPrice - trueCost;
  const grossMargin =
    inputs.sellingPrice > 0 ? (profitPerSale / inputs.sellingPrice) * 100 : 0;
  const markup = trueCost > 0 ? (profitPerSale / trueCost) * 100 : 0;
  const monthlyRevenue = inputs.sellingPrice * inputs.monthlySales;
  const monthlyVariableCosts = trueCost * inputs.monthlySales;
  const monthlyGrossProfit = profitPerSale * inputs.monthlySales;
  const estimatedMonthlyProfit = monthlyGrossProfit - fixedCosts;
  const breakEvenSales =
    profitPerSale > 0 ? fixedCosts / profitPerSale : Infinity;
  const targetProfitSales =
    profitPerSale > 0
      ? (fixedCosts + inputs.profitGoal) / profitPerSale
      : Infinity;
  const targetPrice = recommendedSellingPrice(inputs);
  const targetPaymentFeeAmount = Number.isFinite(targetPrice)
    ? targetPrice * totalFeeRate
    : Infinity;
  const targetTrueCost = variableCost + targetPaymentFeeAmount;
  const targetProfitPerSale = Number.isFinite(targetPrice)
    ? targetPrice - targetTrueCost
    : Infinity;
  const targetMarkup =
    targetTrueCost > 0 && Number.isFinite(targetProfitPerSale)
      ? (targetProfitPerSale / targetTrueCost) * 100
      : 0;
  const discountedPrice = inputs.sellingPrice * (1 - inputs.discount / 100);
  const discountedFeeAmount = discountedPrice * totalFeeRate;
  const discountedTrueCost = variableCost + discountedFeeAmount;
  const discountedProfit = discountedPrice - discountedTrueCost;
  const discountedMargin =
    discountedPrice > 0 ? (discountedProfit / discountedPrice) * 100 : 0;
  const profitLostPerSale = profitPerSale - discountedProfit;
  const profitReduction =
    profitPerSale > 0 ? (profitLostPerSale / profitPerSale) * 100 : 0;
  const salesToMatchGrossProfit =
    discountedProfit > 0 && monthlyGrossProfit > 0
      ? monthlyGrossProfit / discountedProfit
      : Infinity;
  const additionalSalesRequired =
    Number.isFinite(salesToMatchGrossProfit)
      ? Math.max(0, salesToMatchGrossProfit - inputs.monthlySales)
      : Infinity;

  const rawCostItems: PricingBreakdownItem[] = [
    {
      label: labels.productCost ?? "Product cost",
      value: inputs.productCost,
      className: "segmentProduct",
      kind: "cost" as const,
    },
    {
      label: labels.secondaryCost ?? "Secondary cost",
      value: inputs.secondaryCost,
      className: "segmentSecondary",
      kind: "cost" as const,
    },
    {
      label: labels.labourCost ?? "Labour",
      value: inputs.labourCost + inputs.labourHours * inputs.hourlyCost,
      className: "segmentLabour",
      kind: "cost" as const,
    },
    {
      label: labels.frontOfHouseLabour ?? "Service labour",
      value: inputs.frontOfHouseLabour,
      className: "segmentServiceLabour",
      kind: "cost" as const,
    },
    {
      label: labels.packaging ?? "Packaging",
      value: inputs.packaging,
      className: "segmentPackaging",
      kind: "cost" as const,
    },
    {
      label: labels.shipping ?? "Shipping",
      value: inputs.shipping,
      className: "segmentShipping",
      kind: "cost" as const,
    },
    {
      label: labels.otherCosts ?? "Other costs",
      value: inputs.otherCosts,
      className: "segmentOther",
      kind: "cost" as const,
    },
    {
      label: labels.returnsAllowance ?? "Returns allowance",
      value: inputs.returnsAllowance,
      className: "segmentReturns",
      kind: "cost" as const,
    },
    {
      label: labels.paymentFees ?? "Processing fees",
      value: paymentFeeAmount,
      className: "segmentFees",
      kind: "cost" as const,
    },
    {
      label: labels.marketplaceFees ?? "Marketplace fees",
      value: marketplaceFeeAmount,
      className: "segmentMarketplace",
      kind: "cost" as const,
    },
  ];

  const costItems = rawCostItems
    .filter((item) => item.value > 0)
    .sort((first, second) => second.value - first.value);

  const breakdown: PricingBreakdownItem[] = [
    ...costItems,
    {
      label: labels.profit ?? "Profit",
      value: Math.max(0, profitPerSale),
      className: "segmentProfit",
      kind: "profit",
    },
  ];

  return {
    variableCost,
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
    fixedCosts,
    recommendedSellingPrice: targetPrice,
    targetPaymentFeeAmount,
    targetTrueCost,
    targetProfitPerSale,
    targetMarkup,
    discountedPrice,
    discountedProfit,
    discountedMargin,
    profitLostPerSale,
    profitReduction,
    additionalSalesRequired,
    breakdown,
  };
}

export function getPricingHealth(
  inputs: PricingInputs,
  unitSingular = "sale",
  unitPlural = "sales",
) {
  const results = calculatePricing(inputs);
  const notes: string[] = [];
  let state: PricingHealthState = "Viable";

  if (results.profitPerSale <= 0) {
    return {
      state: "Unsustainable" as const,
      notes: [
        "Each sale loses money before fixed expenses.",
        "Break-even and target-profit volumes cannot be reached until price or costs change.",
      ],
    };
  }

  notes.push("Your price covers variable costs.");

  if (inputs.monthlySales <= 0) {
    return {
      state: "Needs attention" as const,
      notes: [
        ...notes,
        `Expected monthly ${unitPlural} are zero, so fixed costs are not covered.`,
      ],
    };
  }

  if (results.estimatedMonthlyProfit < 0) {
    state = "Needs attention";
    notes.push("Expected monthly sales do not cover fixed costs.");
    if (Number.isFinite(results.breakEvenSales)) {
      notes.push(
        `You need ${Math.ceil(
          results.breakEvenSales - inputs.monthlySales,
        ).toLocaleString("en-AU")} additional monthly ${
          Math.ceil(results.breakEvenSales - inputs.monthlySales) === 1
            ? unitSingular
            : unitPlural
        } to break even.`,
      );
    }
  } else if (results.estimatedMonthlyProfit >= inputs.profitGoal) {
    state = "Strong";
    notes.push("Expected monthly sales cover fixed costs.");
    notes.push("Expected monthly profit reaches the target entered.");
  } else {
    state = "Viable";
    notes.push("Expected monthly sales cover fixed costs.");
    notes.push("Expected monthly profit is below the target entered.");
  }

  if (results.profitReduction >= 40) {
    if (state === "Strong") {
      state = "Viable";
    }
    notes.push("The selected discount removes a large share of profit per sale.");
  }

  return { state, notes };
}
