/**
 * Type declarations for the cssstudio package.
 * CSS Studio provides a visual editor for CSS and HTML changes.
 */

declare module "cssstudio" {
  /**
   * Starts the CSS Studio visual editor panel.
   * Must only be called in development mode.
   */
  export function startStudio(): void;
}
