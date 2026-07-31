export type ContributionFrequency = "weekly" | "fortnightly" | "monthly" | "yearly";
export type CompoundingFrequency = "monthly" | "quarterly" | "half-yearly" | "annually";
export type ContributionTiming = "beginning" | "end";

export type CompoundInputs = {
  initialInvestment: number;
  regularContribution: number;
  contributionFrequency: ContributionFrequency;
  annualReturn: number;
  years: number;
  compoundingFrequency: CompoundingFrequency;
  annualFee: number;
  annualInflation: number;
  contributionTiming: ContributionTiming;
};

export type CompoundYearRow = {
  year: number;
  openingBalance: number;
  contributions: number;
  investmentReturn: number;
  fees: number;
  closingBalance: number;
  inflationAdjustedBalance: number;
  contributionsToDate: number;
  growthToDate: number;
  feesToDate: number;
};

export type CompoundResult = {
  finalValue: number;
  totalContributions: number;
  totalGrowth: number;
  totalFees: number;
  inflationAdjustedValue: number;
  growthShareOfFinal: number;
  rows: CompoundYearRow[];
};

export type WaitingCostResult = {
  delayYears: number;
  reducedContributionPeriod: number;
  contributionsNotMade: number;
  finalValueReduction: number;
  compoundGrowthForgone: number;
};

const CONTRIBUTIONS_PER_YEAR: Record<ContributionFrequency, number> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
  yearly: 1,
};

const COMPOUNDS_PER_YEAR: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  "half-yearly": 2,
  annually: 1,
};

const EPSILON = 1e-10;
const MAX_YEARS = 80;
const MAX_RATE = 100;
const MIN_RATE = -99;

export const defaultCompoundInputs: CompoundInputs = {
  initialInvestment: 10000,
  regularContribution: 500,
  contributionFrequency: "monthly",
  annualReturn: 7,
  years: 25,
  compoundingFrequency: "monthly",
  annualFee: 0.4,
  annualInflation: 2.5,
  contributionTiming: "end",
};

export function cleanNumber(value: number, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

export function clampCompoundInputs(inputs: CompoundInputs): CompoundInputs {
  return {
    ...inputs,
    initialInvestment: Math.max(0, cleanNumber(inputs.initialInvestment)),
    regularContribution: Math.max(0, cleanNumber(inputs.regularContribution)),
    annualReturn: Math.min(MAX_RATE, Math.max(MIN_RATE, cleanNumber(inputs.annualReturn))),
    years: Math.min(MAX_YEARS, Math.max(0, cleanNumber(inputs.years))),
    annualFee: Math.min(20, Math.max(0, cleanNumber(inputs.annualFee))),
    annualInflation: Math.min(30, Math.max(-10, cleanNumber(inputs.annualInflation))),
  };
}

export function annualContribution(inputs: CompoundInputs) {
  return inputs.regularContribution * CONTRIBUTIONS_PER_YEAR[inputs.contributionFrequency];
}

export function formatFrequencyLabel(frequency: ContributionFrequency) {
  if (frequency === "yearly") {
    return "year";
  }

  return frequency.replace("ly", "");
}

function roundedCurrency(value: number) {
  if (!Number.isFinite(value) || Object.is(value, -0)) {
    return 0;
  }

  return Number(value.toFixed(2));
}

function createContributionTimes(inputs: CompoundInputs) {
  const contributionsPerYear = CONTRIBUTIONS_PER_YEAR[inputs.contributionFrequency];
  const interval = 1 / contributionsPerYear;
  const times: number[] = [];

  if (inputs.regularContribution <= 0 || inputs.years <= 0) {
    return times;
  }

  const firstTime = inputs.contributionTiming === "beginning" ? 0 : interval;

  for (let time = firstTime; time <= inputs.years + EPSILON; time += interval) {
    if (time >= -EPSILON) {
      times.push(Number(time.toFixed(10)));
    }
  }

  return times;
}

function applyReturnAndFee(balance: number, annualReturn: number, annualFee: number, years: number) {
  if (balance <= 0 || years <= 0) {
    return { closingBalance: balance, investmentReturn: 0, fee: 0 };
  }

  const grossReturnRate = Math.pow(1 + annualReturn / 100, years) - 1;
  const grossBalance = balance * (1 + grossReturnRate);

  // Fees are applied to the balance during each compounding interval using an
  // annual management-fee drag converted to the same period. This avoids the
  // unrealistic shortcut of calculating growth first and subtracting one final fee.
  const feeRate = 1 - Math.pow(1 - annualFee / 100, years);
  const fee = Math.max(0, grossBalance * feeRate);
  const closingBalance = grossBalance - fee;

  return {
    closingBalance,
    investmentReturn: grossBalance - balance,
    fee,
  };
}

export function calculateCompoundInterest(rawInputs: CompoundInputs): CompoundResult {
  const inputs = clampCompoundInputs(rawInputs);
  const compoundsPerYear = COMPOUNDS_PER_YEAR[inputs.compoundingFrequency];
  const compoundInterval = 1 / compoundsPerYear;
  const contributionTimes = createContributionTimes(inputs);
  const yearCount = Math.ceil(inputs.years);
  const rows: CompoundYearRow[] = [];

  let contributionIndex = 0;
  let balance = inputs.initialInvestment;
  let totalContributions = inputs.initialInvestment;
  let totalFees = 0;
  let currentTime = 0;

  for (let year = 1; year <= yearCount; year += 1) {
    const yearStart = year - 1;
    const yearEnd = Math.min(year, inputs.years);
    let openingBalance = balance;
    let yearContributions = 0;
    let yearReturn = 0;
    let yearFees = 0;

    if (yearEnd <= yearStart + EPSILON) {
      continue;
    }

    while (
      contributionIndex < contributionTimes.length &&
      contributionTimes[contributionIndex] <= yearStart + EPSILON
    ) {
      if (inputs.contributionTiming === "beginning" && contributionTimes[contributionIndex] <= currentTime + EPSILON) {
        balance += inputs.regularContribution;
        totalContributions += inputs.regularContribution;
        yearContributions += inputs.regularContribution;
      }
      contributionIndex += 1;
    }

    if (yearContributions > 0) {
      openingBalance = balance - yearContributions;
    }

    while (currentTime < yearEnd - EPSILON) {
      const nextCompoundTime = Math.min(
        yearEnd,
        Math.floor(currentTime / compoundInterval + 1 + EPSILON) * compoundInterval,
      );

      while (
        contributionIndex < contributionTimes.length &&
        contributionTimes[contributionIndex] < nextCompoundTime - EPSILON
      ) {
        balance += inputs.regularContribution;
        totalContributions += inputs.regularContribution;
        yearContributions += inputs.regularContribution;
        contributionIndex += 1;
      }

      if (inputs.contributionTiming === "beginning") {
        while (
          contributionIndex < contributionTimes.length &&
          Math.abs(contributionTimes[contributionIndex] - nextCompoundTime) <= EPSILON
        ) {
          balance += inputs.regularContribution;
          totalContributions += inputs.regularContribution;
          yearContributions += inputs.regularContribution;
          contributionIndex += 1;
        }
      }

      const periodYears = nextCompoundTime - currentTime;
      const period = applyReturnAndFee(
        balance,
        inputs.annualReturn,
        inputs.annualFee,
        periodYears,
      );

      balance = period.closingBalance;
      totalFees += period.fee;
      yearReturn += period.investmentReturn;
      yearFees += period.fee;
      currentTime = nextCompoundTime;

      if (inputs.contributionTiming === "end") {
        while (
          contributionIndex < contributionTimes.length &&
          Math.abs(contributionTimes[contributionIndex] - currentTime) <= EPSILON
        ) {
          balance += inputs.regularContribution;
          totalContributions += inputs.regularContribution;
          yearContributions += inputs.regularContribution;
          contributionIndex += 1;
        }
      }
    }

    const inflationAdjustedBalance =
      inputs.annualInflation === 0
        ? balance
        : balance / Math.pow(1 + inputs.annualInflation / 100, yearEnd);
    const growthToDate = balance - totalContributions;

    rows.push({
      year,
      openingBalance: roundedCurrency(openingBalance),
      contributions: roundedCurrency(yearContributions),
      investmentReturn: roundedCurrency(yearReturn),
      fees: roundedCurrency(yearFees),
      closingBalance: roundedCurrency(balance),
      inflationAdjustedBalance: roundedCurrency(inflationAdjustedBalance),
      contributionsToDate: roundedCurrency(totalContributions),
      growthToDate: roundedCurrency(growthToDate),
      feesToDate: roundedCurrency(totalFees),
    });
  }

  const finalValue = roundedCurrency(balance);
  const totalGrowth = roundedCurrency(finalValue - totalContributions);
  const inflationAdjustedValue =
    inputs.annualInflation === 0
      ? finalValue
      : roundedCurrency(finalValue / Math.pow(1 + inputs.annualInflation / 100, inputs.years));

  return {
    finalValue,
    totalContributions: roundedCurrency(totalContributions),
    totalGrowth,
    totalFees: roundedCurrency(totalFees),
    inflationAdjustedValue,
    growthShareOfFinal: finalValue > 0 ? (totalGrowth / finalValue) * 100 : 0,
    rows,
  };
}

export function calculateWaitingCosts(inputs: CompoundInputs, delays = [1, 3, 5, 10]) {
  const cleanInputs = clampCompoundInputs(inputs);
  const baseline = calculateCompoundInterest(cleanInputs);
  const yearlyContribution = annualContribution(cleanInputs);

  return delays
    .filter((delayYears) => cleanInputs.years > delayYears)
    .map<WaitingCostResult>((delayYears) => {
      const delayed = calculateCompoundInterest({
        ...cleanInputs,
        years: cleanInputs.years - delayYears,
      });
      const finalValueReduction = Math.max(0, baseline.finalValue - delayed.finalValue);
      const contributionsNotMade = yearlyContribution * delayYears;

      return {
        delayYears,
        reducedContributionPeriod: cleanInputs.years - delayYears,
        contributionsNotMade: roundedCurrency(contributionsNotMade),
        finalValueReduction: roundedCurrency(finalValueReduction),
        compoundGrowthForgone: roundedCurrency(
          Math.max(0, finalValueReduction - contributionsNotMade),
        ),
      };
    });
}
