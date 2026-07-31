"use client";

import { useMemo, useState } from "react";
import {
  calculateCompoundInterest,
  calculateWaitingCosts,
  clampCompoundInputs,
  defaultCompoundInputs,
  formatFrequencyLabel,
  type CompoundInputs,
  type CompoundYearRow,
  type CompoundingFrequency,
  type ContributionFrequency,
  type ContributionTiming,
} from "../../../lib/compoundInterest";

type NumericField = {
  key: keyof Pick<
    CompoundInputs,
    | "initialInvestment"
    | "regularContribution"
    | "annualReturn"
    | "years"
    | "annualFee"
    | "annualInflation"
  >;
  label: string;
  help: string;
  prefix?: string;
  suffix?: string;
  step?: string;
  min?: string;
  max?: string;
};

const moneyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const preciseMoneyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const contributionOptions: {
  label: string;
  value: ContributionFrequency;
}[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Fortnightly", value: "fortnightly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const compoundingOptions: {
  label: string;
  value: CompoundingFrequency;
}[] = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Half-yearly", value: "half-yearly" },
  { label: "Annually", value: "annually" },
];

const timingOptions: {
  label: string;
  value: ContributionTiming;
}[] = [
  { label: "Beginning of period", value: "beginning" },
  { label: "End of period", value: "end" },
];

const startingFields: NumericField[] = [
  {
    key: "initialInvestment",
    label: "Initial Investment",
    help: "The amount already invested on day one.",
    prefix: "$",
    min: "0",
  },
  {
    key: "regularContribution",
    label: "Regular Contribution",
    help: "The amount added at the selected frequency.",
    prefix: "$",
    min: "0",
  },
];

const growthFields: NumericField[] = [
  {
    key: "annualReturn",
    label: "Expected Annual Return",
    help: "A planning assumption, not a forecast.",
    suffix: "%",
    min: "-99",
    max: "100",
  },
  {
    key: "years",
    label: "Investment Period",
    help: "How long the plan runs.",
    suffix: "years",
    step: "1",
    min: "0",
    max: "80",
  },
];

const advancedFields: NumericField[] = [
  {
    key: "annualFee",
    label: "Annual Management Fee",
    help: "An ongoing percentage fee applied through the investment period.",
    suffix: "%",
    min: "0",
    max: "20",
  },
  {
    key: "annualInflation",
    label: "Expected Annual Inflation",
    help: "Used to estimate purchasing power in today's dollars.",
    suffix: "%",
    min: "-10",
    max: "30",
  },
];

function money(value: number, precise = false) {
  if (!Number.isFinite(value) || Object.is(value, -0)) {
    return precise ? preciseMoneyFormatter.format(0) : moneyFormatter.format(0);
  }

  return precise ? preciseMoneyFormatter.format(value) : moneyFormatter.format(value);
}

function percent(value: number) {
  if (!Number.isFinite(value) || Object.is(value, -0)) {
    return "0.0%";
  }

  return `${percentFormatter.format(value)}%`;
}

function compactNumber(value: number) {
  if (!Number.isFinite(value) || Object.is(value, -0)) {
    return "0";
  }

  return numberFormatter.format(value);
}

function updateNumber(
  inputs: CompoundInputs,
  key: NumericField["key"],
  value: number,
) {
  return clampCompoundInputs({
    ...inputs,
    [key]: value,
  });
}

function NumericInput({
  field,
  inputs,
  onChange,
}: {
  field: NumericField;
  inputs: CompoundInputs;
  onChange: (next: CompoundInputs) => void;
}) {
  const value = inputs[field.key];
  const invalid =
    (field.min !== undefined && value < Number(field.min)) ||
    (field.max !== undefined && value > Number(field.max));

  return (
    <label className="compoundField">
      <span className="compoundFieldLabel">{field.label}</span>
      <span className="compoundFieldHelp">{field.help}</span>
      <span className="compoundInputWrap" data-invalid={invalid}>
        {field.prefix ? <span aria-hidden="true">{field.prefix}</span> : null}
        <input
          aria-invalid={invalid}
          inputMode="decimal"
          max={field.max}
          min={field.min}
          name={field.key}
          onChange={(event) =>
            onChange(updateNumber(inputs, field.key, Number(event.currentTarget.value)))
          }
          step={field.step ?? "0.01"}
          type="number"
          value={Number.isFinite(value) ? value : 0}
        />
        {field.suffix ? <span aria-hidden="true">{field.suffix}</span> : null}
      </span>
    </label>
  );
}

function SelectField<T extends string>({
  help,
  label,
  onChange,
  options,
  value,
}: {
  help: string;
  label: string;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
  value: T;
}) {
  return (
    <label className="compoundField">
      <span className="compoundFieldLabel">{label}</span>
      <span className="compoundFieldHelp">{help}</span>
      <span className="compoundSelectWrap">
        <select
          onChange={(event) => onChange(event.currentTarget.value as T)}
          value={value}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function ResultCard({
  emphasis,
  label,
  note,
  value,
}: {
  emphasis?: boolean;
  label: string;
  note?: string;
  value: string;
}) {
  return (
    <article className={emphasis ? "compoundResultCard compoundResultHero" : "compoundResultCard"}>
      <span>{label}</span>
      <strong>{value}</strong>
      {note ? <p>{note}</p> : null}
    </article>
  );
}

function activeRowOrLast(rows: CompoundYearRow[], activeYear: number | null) {
  return rows.find((row) => row.year === activeYear) ?? rows.at(-1) ?? null;
}

function GrowthChart({
  rows,
}: {
  rows: CompoundYearRow[];
}) {
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const activeRow = activeRowOrLast(rows, activeYear);
  const maxValue = Math.max(...rows.map((row) => row.closingBalance), 1);
  const visibleRows =
    rows.length > 36
      ? rows.filter((row) => row.year === 1 || row.year === rows.length || row.year % Math.ceil(rows.length / 28) === 0)
      : rows;

  return (
    <section className="compoundChartPanel" aria-labelledby="growth-chart-title">
      <div className="compoundPanelHeader">
        <p className="eyebrow">Growth Chart</p>
        <h2 id="growth-chart-title" className="section-title">
          Contributions, growth and portfolio value over time.
        </h2>
      </div>

      <div className="compoundChartLegend" aria-label="Chart legend">
        <span><i className="legendContribution" /> Contributions</span>
        <span><i className="legendGrowth" /> Investment growth</span>
        <span><i className="legendTotal" /> Portfolio value</span>
      </div>

      <div className="compoundChartGrid">
        <div className="compoundChartBars" role="list" aria-label="Year by year portfolio values">
          {visibleRows.map((row) => {
            const totalHeight = Math.max(4, (row.closingBalance / maxValue) * 100);
            const contributionShare =
              row.closingBalance > 0
                ? Math.min(100, (row.contributionsToDate / row.closingBalance) * 100)
                : 0;
            const growthShare = Math.max(0, 100 - contributionShare);

            return (
              <button
                aria-label={`Year ${row.year}: portfolio value ${money(row.closingBalance)}, contributions ${money(row.contributionsToDate)}, growth ${money(row.growthToDate)}`}
                className="compoundChartBar"
                key={row.year}
                onBlur={() => setActiveYear(null)}
                onFocus={() => setActiveYear(row.year)}
                onMouseEnter={() => setActiveYear(row.year)}
                onMouseLeave={() => setActiveYear(null)}
                onPointerDown={() => setActiveYear(row.year)}
                role="listitem"
                type="button"
              >
                <span className="barTrack">
                  <span
                    className="barTotal"
                    style={{ height: `${totalHeight}%` }}
                  >
                    <span
                      className="barContribution"
                      style={{ height: `${contributionShare}%` }}
                    />
                    <span
                      className="barGrowth"
                      style={{ height: `${growthShare}%` }}
                    />
                  </span>
                </span>
                <span className="barYear">{row.year}</span>
              </button>
            );
          })}
        </div>

        {activeRow ? (
          <article className="compoundChartTooltip" aria-live="polite">
            <span>Year {activeRow.year}</span>
            <dl>
              <div>
                <dt>Contributions</dt>
                <dd>{money(activeRow.contributionsToDate)}</dd>
              </div>
              <div>
                <dt>Growth</dt>
                <dd>{money(activeRow.growthToDate)}</dd>
              </div>
              <div>
                <dt>Fees paid</dt>
                <dd>{money(activeRow.feesToDate)}</dd>
              </div>
              <div>
                <dt>Total value</dt>
                <dd>{money(activeRow.closingBalance)}</dd>
              </div>
              <div>
                <dt>After inflation</dt>
                <dd>{money(activeRow.inflationAdjustedBalance)}</dd>
              </div>
            </dl>
          </article>
        ) : null}
      </div>
    </section>
  );
}

function YearTable({ rows }: { rows: CompoundYearRow[] }) {
  const [ascending, setAscending] = useState(true);
  const sortedRows = [...rows].sort((first, second) =>
    ascending ? first.year - second.year : second.year - first.year,
  );

  return (
    <section className="compoundTablePanel" aria-labelledby="year-table-title">
      <div className="compoundPanelHeader compoundTableHeader">
        <div>
          <p className="eyebrow">Year By Year</p>
          <h2 id="year-table-title" className="section-title">
            The path matters as much as the endpoint.
          </h2>
        </div>
        <button
          className="compoundTextButton"
          onClick={() => setAscending((current) => !current)}
          type="button"
        >
          Sort {ascending ? "Newest First" : "Oldest First"}
        </button>
      </div>

      <details className="compoundTableDetails" open>
        <summary>Show year-by-year breakdown</summary>
        <div className="compoundTableWrap">
          <table className="compoundTable">
            <thead>
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Opening Balance</th>
                <th scope="col">Contributions</th>
                <th scope="col">Investment Return</th>
                <th scope="col">Fees</th>
                <th scope="col">Closing Balance</th>
                <th scope="col">After Inflation</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{money(row.openingBalance)}</td>
                  <td>{money(row.contributions)}</td>
                  <td>{money(row.investmentReturn)}</td>
                  <td>{money(row.fees)}</td>
                  <td>{money(row.closingBalance)}</td>
                  <td>{money(row.inflationAdjustedBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function CostOfWaiting({
  inputs,
}: {
  inputs: CompoundInputs;
}) {
  const waitingCosts = calculateWaitingCosts(inputs);
  const fiveYear = waitingCosts.find((item) => item.delayYears === 5) ?? waitingCosts.at(-1);

  return (
    <section className="compoundWaitingPanel" aria-labelledby="waiting-title">
      <div className="compoundPanelHeader">
        <p className="eyebrow">The Cost Of Waiting</p>
        <h2 id="waiting-title" className="section-title">
          The earliest contributions get the longest runway.
        </h2>
      </div>

      {waitingCosts.length > 0 ? (
        <>
          <div className="waitingGrid">
            {waitingCosts.map((item) => (
              <article key={item.delayYears}>
                <span className="waitingDelay">
                  If you wait {item.delayYears} {item.delayYears === 1 ? "year" : "years"}
                </span>
                <p className="waitingMetricLabel">Projected portfolio could be lower by</p>
                <strong>{money(item.finalValueReduction)}</strong>
                <dl className="waitingDetailList">
                  <div>
                    <dt>Time invested</dt>
                    <dd>{compactNumber(item.reducedContributionPeriod)} years</dd>
                  </div>
                  <div>
                    <dt>Contributions missed</dt>
                    <dd>{money(item.contributionsNotMade)}</dd>
                  </div>
                  <div>
                    <dt>Growth missed</dt>
                    <dd>{money(item.compoundGrowthForgone)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
          {fiveYear ? (
            <p className="compoundInsight body-large">
              Waiting {fiveYear.delayYears} {fiveYear.delayYears === 1 ? "year" : "years"} would mean contributing {money(fiveYear.contributionsNotMade)} less, but the projected final portfolio value could be approximately {money(fiveYear.finalValueReduction)} lower because early contributions have less time to compound.
            </p>
          ) : null}
        </>
      ) : (
        <p className="compoundInsight body-large">
          Waiting-cost comparisons appear when the investment period is longer
          than one year.
        </p>
      )}
    </section>
  );
}

function InvestmentSummary({
  inputs,
  result,
}: {
  inputs: CompoundInputs;
  result: ReturnType<typeof calculateCompoundInterest>;
}) {
  const contributionPhrase =
    inputs.regularContribution > 0
      ? `and investing ${money(inputs.regularContribution)} per ${formatFrequencyLabel(inputs.contributionFrequency)}`
      : "with no recurring contributions";
  const periodWord = inputs.years === 1 ? "year" : "years";

  return (
    <section className="compoundNarrative" aria-live="polite">
      <p className="body-large">
        Starting with {money(inputs.initialInvestment)} {contributionPhrase} for {compactNumber(inputs.years)} {periodWord} at an assumed annual return of {percent(inputs.annualReturn)}, your portfolio could grow to approximately {money(result.finalValue)}.
      </p>
      <p className="body-large">
        You would contribute around {money(result.totalContributions)} in total, while approximately {money(result.totalGrowth)} would come from investment growth before inflation.
      </p>
      <p className="body-large">
        After accounting for the selected fee and inflation assumptions, the estimated purchasing power would be approximately {money(result.inflationAdjustedValue)} in today&apos;s dollars.
      </p>
    </section>
  );
}

export default function CompoundInterestCalculator() {
  const [inputs, setInputs] = useState<CompoundInputs>(defaultCompoundInputs);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const cleanInputs = useMemo(() => clampCompoundInputs(inputs), [inputs]);
  const result = useMemo(
    () => calculateCompoundInterest(cleanInputs),
    [cleanInputs],
  );

  const hasValidPlan =
    cleanInputs.years > 0 &&
    (cleanInputs.initialInvestment > 0 || cleanInputs.regularContribution > 0);

  return (
    <div className="compoundCalculatorShell">
      <section className="compoundInputPanel" aria-labelledby="compound-inputs">
        <div className="compoundPanelHeader">
          <p className="eyebrow">Inputs</p>
          <h2 id="compound-inputs" className="section-title">
            Build the plan.
          </h2>
          <p className="body">
            These are editable examples. Use assumptions you can explain, then
            test what changes when time, fees or contributions move.
          </p>
        </div>

        <div className="compoundInputGroups">
          <section className="compoundInputGroup" aria-labelledby="starting-position">
            <h3 id="starting-position">Starting position</h3>
            <div className="compoundFieldsGrid">
              {startingFields.map((field) => (
                <NumericInput
                  field={field}
                  inputs={cleanInputs}
                  key={field.key}
                  onChange={setInputs}
                />
              ))}
              <SelectField<ContributionFrequency>
                help="How often the regular contribution is added."
                label="Contribution Frequency"
                onChange={(frequency) =>
                  setInputs((current) => ({
                    ...current,
                    contributionFrequency: frequency,
                  }))
                }
                options={contributionOptions}
                value={cleanInputs.contributionFrequency}
              />
            </div>
          </section>

          <section className="compoundInputGroup" aria-labelledby="growth-assumptions">
            <h3 id="growth-assumptions">Growth assumptions</h3>
            <div className="compoundFieldsGrid">
              {growthFields.map((field) => (
                <NumericInput
                  field={field}
                  inputs={cleanInputs}
                  key={field.key}
                  onChange={setInputs}
                />
              ))}
              <SelectField<CompoundingFrequency>
                help="How often returns are applied."
                label="Compounding Frequency"
                onChange={(frequency) =>
                  setInputs((current) => ({
                    ...current,
                    compoundingFrequency: frequency,
                  }))
                }
                options={compoundingOptions}
                value={cleanInputs.compoundingFrequency}
              />
            </div>
          </section>
        </div>

        <details
          className="compoundAdvanced"
          onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}
          open={advancedOpen}
        >
          <summary>Advanced Options</summary>
          <div className="compoundFieldsGrid">
            {advancedFields.map((field) => (
              <NumericInput
                field={field}
                inputs={cleanInputs}
                key={field.key}
                onChange={setInputs}
              />
            ))}
            <SelectField<ContributionTiming>
              help="Whether each contribution is added before or after that contribution period."
              label="Contribution Timing"
              onChange={(timing) =>
                setInputs((current) => ({
                  ...current,
                  contributionTiming: timing,
                }))
              }
              options={timingOptions}
              value={cleanInputs.contributionTiming}
            />
          </div>
        </details>
      </section>

      <section className="compoundResultsPanel" aria-labelledby="compound-results">
        <div className="compoundPanelHeader">
          <p className="eyebrow">Projected Result</p>
          <h2 id="compound-results" className="section-title">
            What the plan could become.
          </h2>
        </div>

        {hasValidPlan ? (
          <>
            <ResultCard
              emphasis
              label="Final Portfolio Value"
              note="Nominal value before adjusting for purchasing power."
              value={money(result.finalValue)}
            />
            <div className="compoundResultGrid">
              <ResultCard
                label="Total Contributions"
                note="Money personally contributed."
                value={money(result.totalContributions)}
              />
              <ResultCard
                label="Compound Growth"
                note="Portfolio value above contributions."
                value={money(result.totalGrowth)}
              />
              <ResultCard
                label="Estimated Fees"
                note="Fees deducted through the period."
                value={money(result.totalFees)}
              />
              <ResultCard
                label="After Inflation"
                note="Estimated purchasing power."
                value={money(result.inflationAdjustedValue)}
              />
              <ResultCard
                label="Growth Share"
                note="How much of the final value came from growth."
                value={percent(result.growthShareOfFinal)}
              />
            </div>
            <InvestmentSummary inputs={cleanInputs} result={result} />
          </>
        ) : (
          <p className="compoundEmpty body-large">
            Add an initial investment, a regular contribution and an investment
            period to see a projection.
          </p>
        )}
      </section>

      {hasValidPlan ? (
        <>
          <GrowthChart rows={result.rows} />
          <YearTable rows={result.rows} />
          <CostOfWaiting inputs={cleanInputs} />
        </>
      ) : null}

      <p className="compoundFinePrint body">
        The calculator uses the assumptions entered above and does not account
        for tax, market volatility, transaction costs or changes in personal
        circumstances. Use it to understand relationships between variables,
        not to predict a guaranteed outcome.
      </p>
    </div>
  );
}
