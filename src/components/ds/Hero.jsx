/**
 * OS-000 Hero Component
 * Full-width hero section with headline, subtitle, and CTA.
 * Variants: centered, left-aligned, split (text + image)
 */
import { Button } from './Button';

export function Hero({
  headline,
  subtitle,
  cta,
  ctaHref,
  ctaVariant = 'primary',
  secondaryCta,
  secondaryCtaHref,
  image,
  imageAlt = '',
  variant = 'centered',
  className = '',
}) {
  const base = 'w-full py-[var(--spacing-20)] px-[var(--spacing-6)]';

  if (variant === 'split') {
    return (
      <section className={`${base} ${className}`}>
        <div className="max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-12)] items-center">
          <div>
            <h1 className="font-[var(--font-primary)] text-[var(--text-4xl)] lg:text-[var(--text-5xl)] font-[var(--weight-bold)] leading-[var(--leading-tight)] text-[var(--color-text)] mb-[var(--spacing-6)]">
              {headline}
            </h1>
            {subtitle && (
              <p className="text-[var(--text-lg)] text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--spacing-8)] max-w-lg">
                {subtitle}
              </p>
            )}
            <div className="flex flex-wrap gap-[var(--spacing-4)]">
              {cta && <Button href={ctaHref} variant={ctaVariant} size="lg">{cta}</Button>}
              {secondaryCta && <Button href={secondaryCtaHref} variant="outline" size="lg">{secondaryCta}</Button>}
            </div>
          </div>
          {image && (
            <div className="relative">
              <img src={image} alt={imageAlt} className="w-full rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]" />
            </div>
          )}
        </div>
      </section>
    );
  }

  // centered or left-aligned
  const alignment = variant === 'centered' ? 'text-center items-center' : 'text-left items-start';

  return (
    <section className={`${base} ${className}`}>
      <div className={`max-w-[var(--container-max)] mx-auto flex flex-col ${alignment}`}>
        <h1 className="font-[var(--font-primary)] text-[var(--text-4xl)] lg:text-[var(--text-5xl)] font-[var(--weight-bold)] leading-[var(--leading-tight)] text-[var(--color-text)] mb-[var(--spacing-6)] max-w-3xl">
          {headline}
        </h1>
        {subtitle && (
          <p className="text-[var(--text-lg)] text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--spacing-8)] max-w-2xl">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap gap-[var(--spacing-4)]">
          {cta && <Button href={ctaHref} variant={ctaVariant} size="lg">{cta}</Button>}
          {secondaryCta && <Button href={secondaryCtaHref} variant="outline" size="lg">{secondaryCta}</Button>}
        </div>
      </div>
    </section>
  );
}
