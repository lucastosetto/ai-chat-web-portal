/**
 * Typography system matching mobile app specifications
 * Source: mobile app's Typography.tsx
 */

export const typography = {
  h1: {
    fontSize: '32px',
    lineHeight: '38px',
    fontWeight: '700',
  },
  h2: {
    fontSize: '26px',
    lineHeight: '30px',
    fontWeight: '700',
  },
  h3: {
    fontSize: '24px',
    lineHeight: '28px',
    fontWeight: '600',
  },
  h4: {
    fontSize: '18px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  h5: {
    fontSize: '16px',
    lineHeight: '20px',
    fontWeight: '600',
  },
  subheading: {
    fontSize: '14.5px',
    lineHeight: '18px',
    fontWeight: '500',
  },
  body: {
    fontSize: '14.5px',
    lineHeight: '18px',
    fontWeight: '400',
  },
  bodyBold: {
    fontSize: '14.5px',
    lineHeight: '18px',
    fontWeight: '700',
  },
  caption: {
    fontSize: '12.5px',
    lineHeight: '16px',
    fontWeight: '400',
  },
  link: {
    fontSize: '12.5px',
    fontWeight: '500',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
  },
  error: {
    fontSize: '12.5px',
    lineHeight: '16px',
    fontWeight: '400',
  },
  small: {
    fontSize: '12.5px',
    fontWeight: '500',
  },
  medium: {
    fontSize: '14px',
    fontWeight: '400',
  },
} as const;

/**
 * Tailwind typography classes for each variant
 */
export const typographyClasses = {
  h1: 'text-[32px] leading-[38px] font-bold',
  h2: 'text-[26px] leading-[30px] font-bold',
  h3: 'text-[24px] leading-[28px] font-semibold',
  h4: 'text-[18px] leading-[22px] font-semibold',
  h5: 'text-[16px] leading-[20px] font-semibold',
  subheading: 'text-[14.5px] leading-[18px] font-medium',
  body: 'text-[14.5px] leading-[18px] font-normal',
  bodyBold: 'text-[14.5px] leading-[18px] font-bold',
  caption: 'text-[12.5px] leading-[16px] font-normal',
  link: 'text-[12.5px] font-medium text-primary',
  label: 'text-[12px] font-medium',
  error: 'text-[12.5px] leading-[16px] font-normal text-error',
  small: 'text-[12.5px] font-medium',
  medium: 'text-[14px] font-normal',
} as const;

