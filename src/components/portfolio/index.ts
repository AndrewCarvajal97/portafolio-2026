/**
 * Portfolio Components Index
 *
 * Re-exports all portfolio components for convenient importing.
 */

// Note: Astro components are imported directly in .astro files
// This file serves as documentation of available components

export const PORTFOLIO_COMPONENTS = {
  Carousel3D: './Carousel3D.astro',
  ProjectInfo: './ProjectInfo.astro',
  PortfolioHeader: './PortfolioHeader.astro',
  ControlsHint: './ControlsHint.astro',
  EducationSection: './EducationSection.astro'
} as const;
