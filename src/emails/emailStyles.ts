import type { CSSProperties } from "react";

export const emailColors = {
  accent: "#d78d2d",
  background: "#171818",
  muted: "#8a8680",
  panel: "#1e1f1f",
  text: "#e5e2da",
};

export const emailSans =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const emailSerif = 'Georgia, "Times New Roman", Times, serif';

export const emailParagraph = {
  color: emailColors.text,
  fontFamily: emailSans,
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 20px",
};

export const emailGreeting = {
  color: emailColors.text,
  fontFamily: emailSerif,
  fontSize: "20px",
  fontWeight: 400,
  lineHeight: "1.4",
  margin: "0 0 20px",
};

export const emailSignoff = {
  color: emailColors.muted,
  fontFamily: emailSans,
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "28px 0 0",
};

export const emailLink = {
  color: emailColors.accent,
  textDecoration: "underline",
};

export const emailFieldLabel = {
  color: emailColors.muted,
  fontFamily: emailSans,
  fontSize: "12px",
  letterSpacing: "0.04em",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

export const emailFieldValue = {
  color: emailColors.text,
  fontFamily: emailSans,
  fontSize: "15px",
  lineHeight: "1.5",
  margin: "0 0 20px",
};

export const emailQuote = {
  borderLeft: `3px solid ${emailColors.accent}`,
  color: emailColors.text,
  fontFamily: emailSerif,
  fontSize: "16px",
  fontStyle: "italic" as const,
  lineHeight: "1.6",
  margin: "0 0 24px",
  padding: "4px 0 4px 16px",
};

export const emailDivider: CSSProperties = {
  appearance: "none",
  border: "none",
  borderTop: "1px solid rgba(229, 226, 218, 0.08)",
  height: "1px",
  margin: "0 0 20px",
  width: "100%",
};
