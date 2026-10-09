import type { CSSProperties, ReactNode } from "react";

export const mockReactEmailModule = () => {
  const actual = jest.requireActual(
    "react-email",
  ) as typeof import("react-email");

  const Html = ({ children, lang }: { children: ReactNode; lang?: string }) => {
    return (
      <div data-email-root="" lang={lang}>
        {children}
      </div>
    );
  };

  const Body = ({
    children,
    style,
  }: {
    children: ReactNode;
    style?: CSSProperties;
  }) => {
    return (
      <div data-email-body="" style={style}>
        {children}
      </div>
    );
  };

  const Head = () => {
    return null;
  };

  const Preview = ({ children }: { children: ReactNode }) => {
    return (
      <span data-email-preview="" hidden>
        {children}
      </span>
    );
  };

  return {
    ...actual,
    Body,
    Head,
    Html,
    Preview,
  };
};
