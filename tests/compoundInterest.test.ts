import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateCompoundInterest,
  calculateWaitingCosts,
  defaultCompoundInputs,
  type CompoundInputs,
} from "../lib/compoundInterest";

const baseInputs: CompoundInputs = {
  ...defaultCompoundInputs,
  initialInvestment: 1000,
  regularContribution: 0,
  annualReturn: 10,
  years: 2,
  annualFee: 0,
  annualInflation: 0,
  compoundingFrequency: "annually",
};

test("calculates simple lump-sum annual compounding", () => {
  const result = calculateCompoundInterest(baseInputs);

  assert.equal(result.finalValue, 1210);
  assert.equal(result.totalContributions, 1000);
  assert.equal(result.totalGrowth, 210);
  assert.equal(result.rows.length, 2);
});

test("calculates monthly recurring contributions at the end of each period", () => {
  const result = calculateCompoundInterest({
    ...baseInputs,
    initialInvestment: 0,
    regularContribution: 100,
    contributionFrequency: "monthly",
    annualReturn: 0,
    years: 1,
    compoundingFrequency: "monthly",
  });

  assert.equal(result.finalValue, 1200);
  assert.equal(result.totalContributions, 1200);
  assert.equal(result.totalGrowth, 0);
});

test("beginning-of-period contributions earn more than end-of-period contributions", () => {
  const ending = calculateCompoundInterest({
    ...baseInputs,
    initialInvestment: 0,
    regularContribution: 100,
    contributionFrequency: "monthly",
    annualReturn: 8,
    years: 10,
    compoundingFrequency: "monthly",
    contributionTiming: "end",
  });
  const beginning = calculateCompoundInterest({
    ...baseInputs,
    initialInvestment: 0,
    regularContribution: 100,
    contributionFrequency: "monthly",
    annualReturn: 8,
    years: 10,
    compoundingFrequency: "monthly",
    contributionTiming: "beginning",
  });

  assert.ok(beginning.finalValue > ending.finalValue);
});

test("supports weekly and fortnightly contribution frequencies", () => {
  const weekly = calculateCompoundInterest({
    ...baseInputs,
    initialInvestment: 0,
    regularContribution: 10,
    contributionFrequency: "weekly",
    annualReturn: 0,
    years: 1,
  });
  const fortnightly = calculateCompoundInterest({
    ...baseInputs,
    initialInvestment: 0,
    regularContribution: 20,
    contributionFrequency: "fortnightly",
    annualReturn: 0,
    years: 1,
  });

  assert.equal(weekly.totalContributions, 520);
  assert.equal(fortnightly.totalContributions, 520);
});

test("fees reduce the portfolio throughout the investment period", () => {
  const noFee = calculateCompoundInterest({ ...baseInputs, annualFee: 0 });
  const withFee = calculateCompoundInterest({ ...baseInputs, annualFee: 1 });

  assert.ok(withFee.finalValue < noFee.finalValue);
  assert.ok(withFee.totalFees > 0);
});

test("inflation-adjusted value discounts the future balance", () => {
  const result = calculateCompoundInterest({
    ...baseInputs,
    annualInflation: 3,
  });

  assert.ok(result.inflationAdjustedValue < result.finalValue);
});

test("negative returns are handled without NaN or Infinity", () => {
  const result = calculateCompoundInterest({
    ...baseInputs,
    annualReturn: -5,
    years: 5,
  });

  assert.ok(Number.isFinite(result.finalValue));
  assert.ok(result.finalValue < baseInputs.initialInvestment);
});

test("waiting cost only includes valid delay periods", () => {
  const waits = calculateWaitingCosts({
    ...defaultCompoundInputs,
    years: 4,
  });

  assert.deepEqual(
    waits.map((item) => item.delayYears),
    [1, 3],
  );
});
