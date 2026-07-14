import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";
import { absoluteUrl } from "../lib/seo";

type WelcomeEmailProps = {
  latestBalanceSheetUrl: string;
};

const colors = {
  cream: "#f4efe6",
  creamSoft: "#fffaf0",
  ink: "#090909",
  charcoal: "#171512",
  gold: "#caa64c",
  muted: "#5f574d",
  line: "#ded3bf",
};

const links = {
  scalingHospitality: absoluteUrl("/books/scaling-hospitality"),
  noRobotsRequired: absoluteUrl("/books/no-robots-required"),
  secondAct: absoluteUrl("/books/the-second-act"),
  investmentThesis: absoluteUrl("/resources/investment-thesis-template"),
  businessHealth: absoluteUrl("/resources/business-health-scorecard"),
  aiProductivity: absoluteUrl("/resources/ai-productivity-toolkit"),
  betterSystems: absoluteUrl(
    "/articles/why-better-systems-build-better-businesses",
  ),
  systemService: absoluteUrl("/articles/the-system-is-the-service"),
};

const pageStyle: CSSProperties = {
  margin: 0,
  backgroundColor: colors.cream,
  color: colors.ink,
  fontFamily: "Arial, Helvetica, sans-serif",
};

const containerStyle: CSSProperties = {
  width: "100%",
  maxWidth: "640px",
  margin: "0 auto",
  padding: "36px 20px",
};

const publicationStyle: CSSProperties = {
  backgroundColor: "#fff8ea",
  border: `1px solid ${colors.line}`,
  borderRadius: "14px",
  overflow: "hidden",
};

const mastheadStyle: CSSProperties = {
  backgroundColor: colors.ink,
  padding: "26px 30px",
};

const eyebrowStyle: CSSProperties = {
  margin: "0 0 14px",
  color: colors.gold,
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.2em",
  lineHeight: "1.4",
  textTransform: "uppercase",
};

const headingStyle: CSSProperties = {
  margin: 0,
  color: colors.creamSoft,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "38px",
  fontWeight: 500,
  lineHeight: "1.08",
};

const contentStyle: CSSProperties = {
  padding: "32px 30px 34px",
};

const textStyle: CSSProperties = {
  margin: "0 0 18px",
  color: colors.charcoal,
  fontSize: "16px",
  lineHeight: "1.75",
};

const sectionTitleStyle: CSSProperties = {
  margin: "30px 0 16px",
  color: colors.ink,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "23px",
  fontWeight: 500,
  lineHeight: "1.24",
};

const itemStyle: CSSProperties = {
  margin: "0 0 18px",
  paddingLeft: "18px",
  borderLeft: `2px solid ${colors.gold}`,
};

const itemTitleStyle: CSSProperties = {
  margin: "0 0 4px",
  color: colors.ink,
  fontSize: "15px",
  fontWeight: 800,
  lineHeight: "1.45",
};

const itemTextStyle: CSSProperties = {
  margin: 0,
  color: colors.muted,
  fontSize: "15px",
  lineHeight: "1.65",
};

const ctaStyle: CSSProperties = {
  display: "inline-block",
  margin: "10px 0 24px",
  padding: "14px 22px",
  borderRadius: "999px",
  backgroundColor: colors.ink,
  color: colors.creamSoft,
  fontSize: "14px",
  fontWeight: 800,
  textDecoration: "none",
};

const linkSectionStyle: CSSProperties = {
  margin: "0 0 24px",
};

const linkTitleStyle: CSSProperties = {
  margin: "0 0 10px",
  color: colors.ink,
  fontSize: "13px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  lineHeight: "1.4",
  textTransform: "uppercase",
};

const linkStyle: CSSProperties = {
  display: "block",
  margin: "0 0 8px",
  color: colors.charcoal,
  fontSize: "15px",
  fontWeight: 700,
  lineHeight: "1.5",
  textDecoration: "none",
};

const footerStyle: CSSProperties = {
  margin: "22px 0 0",
  color: colors.muted,
  fontSize: "12px",
  lineHeight: "1.7",
  textAlign: "center",
};

function ContentItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Section style={itemStyle}>
      <Text style={itemTitleStyle}>{title}</Text>
      <Text style={itemTextStyle}>{children}</Text>
    </Section>
  );
}

function LinkGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{ href: string; label: string }>;
}) {
  return (
    <Section style={linkSectionStyle}>
      <Text style={linkTitleStyle}>{title}</Text>
      {items.map((item) => (
        <Link href={item.href} key={item.href} style={linkStyle}>
          {item.label}
        </Link>
      ))}
    </Section>
  );
}

export default function WelcomeEmail({
  latestBalanceSheetUrl,
}: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to Balance Sheet from Ricky Recalcati.</Preview>
      <Body style={pageStyle}>
        <Container style={containerStyle}>
          <Section style={publicationStyle}>
            <Section style={mastheadStyle}>
              <Text style={eyebrowStyle}>Balance Sheet</Text>
              <Heading as="h1" style={headingStyle}>
                Welcome to Balance Sheet.
              </Heading>
            </Section>

            <Section style={contentStyle}>
              <Text style={textStyle}>Hi,</Text>

              <Text style={textStyle}>Thanks for subscribing.</Text>

              <Text style={textStyle}>
                Every Monday you&apos;ll receive Balance Sheet — my weekly
                review of what mattered in markets, business and investing.
              </Text>

              <Text style={textStyle}>
                There&apos;s no hype, no clickbait and no stock pumping.
              </Text>

              <Text style={textStyle}>
                Instead, you&apos;ll receive thoughtful analysis, practical
                business lessons and long-term investing ideas designed to help
                you make better decisions.
              </Text>

              <Heading as="h2" style={sectionTitleStyle}>
                What you&apos;ll receive every Monday:
              </Heading>

              <ContentItem title="The Week in Markets">
                The stories that actually mattered.
              </ContentItem>

              <ContentItem title="Business Breakdown">
                One company worth studying.
              </ContentItem>

              <ContentItem title="My Take">
                Not just what happened.
                <br />
                Why I think it matters.
              </ContentItem>

              <ContentItem title="One Practical Lesson">
                A business or investing idea you can apply immediately.
              </ContentItem>

              <Hr
                style={{
                  borderColor: colors.line,
                  margin: "30px 0",
                }}
              />

              <Heading as="h2" style={sectionTitleStyle}>
                While you&apos;re here...
              </Heading>

              <Text style={textStyle}>
                Explore some of the most popular content on the site.
              </Text>

              <LinkGroup
                title="Books"
                items={[
                  {
                    href: links.scalingHospitality,
                    label: "Scaling Hospitality",
                  },
                  {
                    href: links.noRobotsRequired,
                    label: "No Robots Required",
                  },
                  {
                    href: links.secondAct,
                    label: "The Second Act",
                  },
                ]}
              />

              <LinkGroup
                title="Resources"
                items={[
                  {
                    href: links.investmentThesis,
                    label: "Investment Thesis Template",
                  },
                  {
                    href: links.businessHealth,
                    label: "Business Health Scorecard",
                  },
                  {
                    href: links.aiProductivity,
                    label: "AI Productivity Toolkit",
                  },
                ]}
              />

              <LinkGroup
                title="Articles"
                items={[
                  {
                    href: links.betterSystems,
                    label: "Why Better Systems Build Better Businesses",
                  },
                  {
                    href: links.systemService,
                    label: "The System Is the Service",
                  },
                ]}
              />

              <Button href={latestBalanceSheetUrl} style={ctaStyle}>
                Read the latest Balance Sheet →
              </Button>

              <Text style={textStyle}>Thanks again for joining.</Text>

              <Text style={textStyle}>
                I&apos;m looking forward to sharing Balance Sheet with you every
                Monday.
              </Text>

              <Text style={{ ...textStyle, marginBottom: 0 }}>
                — Ricky Recalcati
              </Text>
            </Section>
          </Section>

          <Text style={footerStyle}>
            You&apos;re receiving this email because you subscribed at
            RickyRecalcati.com.
            <br />
            Unsubscribe anytime.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
