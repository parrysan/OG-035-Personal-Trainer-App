/**
 * OS-000 Design System Viewer
 * Drop this page into any project at /design-system to see all available
 * components rendered with that project's theme.
 *
 * Usage in Next.js App Router:
 *   app/design-system/page.jsx — import and render <DesignSystemPage />
 */
import { Button } from './Button';
import { Card, CardImage, CardTitle, CardBody } from './Card';
import { Hero } from './Hero';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { Section, SectionTitle } from './Section';

function ComponentBlock({ name, source = 'os-000', isNew = false, children }) {
  return (
    <div className="mb-[var(--spacing-12)] pb-[var(--spacing-12)] border-b border-[var(--color-border-subtle)]">
      <div className="flex items-center gap-[var(--spacing-3)] mb-[var(--spacing-6)]">
        <h3 className="font-[var(--font-primary)] text-[var(--text-xl)] font-[var(--weight-bold)] text-[var(--color-text)]">
          {name}
        </h3>
        <span className={`px-2 py-0.5 rounded-[var(--radius-full)] text-[var(--text-xs)] font-[var(--weight-medium)] ${
          isNew
            ? 'bg-[var(--color-error)] text-[var(--color-white)]'
            : 'bg-[var(--color-cta)] text-[var(--color-text-inverse)]'
        }`}>
          {isNew ? 'NEW' : 'OS-000'}
        </span>
      </div>
      <div className="space-y-[var(--spacing-6)]">
        {children}
      </div>
    </div>
  );
}

function TokenSwatch({ name, value, type = 'color' }) {
  if (type === 'color') {
    return (
      <div className="flex items-center gap-[var(--spacing-3)]">
        <div className="w-10 h-10 rounded-[var(--radius-md)] border border-[var(--color-border)]" style={{ backgroundColor: value }} />
        <div>
          <p className="text-[var(--text-sm)] font-[var(--weight-medium)] text-[var(--color-text)]">{name}</p>
          <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] font-[var(--font-mono)]">{value}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-baseline gap-[var(--spacing-3)]">
      <code className="text-[var(--text-xs)] text-[var(--color-text-muted)] font-[var(--font-mono)] w-40">{name}</code>
      <span className="text-[var(--text-sm)] text-[var(--color-text)]">{value}</span>
    </div>
  );
}

export default function DesignSystemPage({ projectName = 'Project', newComponents = [] }) {
  const sampleLinks = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-subtle)] py-[var(--spacing-8)] px-[var(--spacing-6)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <p className="text-[var(--text-xs)] font-[var(--weight-medium)] uppercase tracking-[var(--tracking-caps)] text-[var(--color-accent)] mb-[var(--spacing-2)]">
            OS-000 Design System
          </p>
          <h1 className="font-[var(--font-primary)] text-[var(--text-3xl)] font-[var(--weight-bold)] text-[var(--color-text)]">
            {projectName} — Component Library
          </h1>
          <p className="mt-[var(--spacing-2)] text-[var(--text-base)] text-[var(--color-text-secondary)]">
            All available components rendered in this project&apos;s theme.
          </p>
        </div>
      </div>

      <div className="max-w-[var(--container-max)] mx-auto py-[var(--spacing-12)] px-[var(--spacing-6)]">

        {/* ── Tokens ───────────────────────────────────── */}
        <ComponentBlock name="Design Tokens — Colours">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-4)]">
            <TokenSwatch name="Accent" value="var(--color-accent)" />
            <TokenSwatch name="CTA" value="var(--color-cta)" />
            <TokenSwatch name="Highlight" value="var(--color-highlight)" />
            <TokenSwatch name="Background" value="var(--color-bg)" />
            <TokenSwatch name="Bg Secondary" value="var(--color-bg-secondary)" />
            <TokenSwatch name="Text" value="var(--color-text)" />
            <TokenSwatch name="Text Secondary" value="var(--color-text-secondary)" />
            <TokenSwatch name="Border" value="var(--color-border)" />
          </div>
        </ComponentBlock>

        {/* ── Buttons ──────────────────────────────────── */}
        <ComponentBlock name="Button">
          <div className="flex flex-wrap gap-[var(--spacing-4)] items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="gold">Gold</Button>
          </div>
          <div className="flex flex-wrap gap-[var(--spacing-4)] items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </ComponentBlock>

        {/* ── Cards ────────────────────────────────────── */}
        <ComponentBlock name="Card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-6)]">
            <Card variant="default">
              <CardTitle>Default Card</CardTitle>
              <CardBody>A card with subtle border and shadow. Lifts on hover.</CardBody>
            </Card>
            <Card variant="elevated">
              <CardTitle>Elevated Card</CardTitle>
              <CardBody>No border, medium shadow. Feels like it floats.</CardBody>
            </Card>
            <Card variant="bordered">
              <CardTitle>Bordered Card</CardTitle>
              <CardBody>Strong border, no shadow. Structured and contained.</CardBody>
            </Card>
          </div>
        </ComponentBlock>

        {/* ── Hero ─────────────────────────────────────── */}
        <ComponentBlock name="Hero — Centered">
          <Hero
            headline="Build something meaningful"
            subtitle="A headline that captures attention and a subtitle that gives just enough context to click."
            cta="Get Started"
            ctaHref="#"
            secondaryCta="Learn More"
            secondaryCtaHref="#"
            variant="centered"
          />
        </ComponentBlock>

        <ComponentBlock name="Hero — Split">
          <Hero
            headline="Your story, beautifully told"
            subtitle="The split hero puts text and imagery side by side. Perfect for products, portfolios, and landing pages."
            cta="See Work"
            ctaHref="#"
            image="https://placehold.co/600x400/e5e7eb/6b7280?text=Project+Image"
            imageAlt="Project showcase"
            variant="split"
          />
        </ComponentBlock>

        {/* ── Nav ──────────────────────────────────────── */}
        <ComponentBlock name="Navigation">
          <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
            <Nav
              brand={projectName}
              links={sampleLinks}
              cta="Contact"
              ctaHref="#"
            />
          </div>
        </ComponentBlock>

        {/* ── Section ──────────────────────────────────── */}
        <ComponentBlock name="Section">
          <Section bg="secondary" padding="sm">
            <SectionTitle subtitle="Sections provide consistent spacing, max-width, and background options.">
              Section Title
            </SectionTitle>
            <p className="text-[var(--color-text-secondary)]">Content goes here.</p>
          </Section>
        </ComponentBlock>

        {/* ── Footer ───────────────────────────────────── */}
        <ComponentBlock name="Footer — Simple">
          <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
            <Footer brand={projectName} variant="simple" />
          </div>
        </ComponentBlock>

        {/* ── New Components (project-specific) ────────── */}
        {newComponents.length > 0 && (
          <>
            <h2 className="font-[var(--font-primary)] text-[var(--text-2xl)] font-[var(--weight-bold)] text-[var(--color-text)] mt-[var(--spacing-16)] mb-[var(--spacing-8)]">
              Project-Specific Components
            </h2>
            {newComponents.map(({ name, render }) => (
              <ComponentBlock key={name} name={name} isNew>
                {render()}
              </ComponentBlock>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
