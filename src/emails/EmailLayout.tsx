import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";
import { emailBrandmarkSrc } from "src/emails/emailBrandmark";
import { emailLogoSrc } from "src/emails/emailLogo";
import { emailColors, emailLink, emailSans } from "src/emails/emailStyles";

const main = {
  backgroundColor: emailColors.background,
  fontFamily: emailSans,
};

const container = {
  margin: "0 auto",
  maxWidth: "520px",
  padding: "32px 20px",
};

const panel = {
  backgroundColor: emailColors.panel,
  borderRadius: "10px",
  padding: "36px 32px 32px",
};

const logo = {
  display: "block",
  height: "auto",
  margin: "0 0 32px",
  maxWidth: "179px",
};

const footer = {
  margin: "28px 0 0",
  textAlign: "center" as const,
};

const brandmark = {
  display: "block",
  height: "auto",
  margin: "0 auto 12px",
  width: "28px",
};

const footerText = {
  color: emailColors.muted,
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0",
};

interface EmailLayoutProps {
  children: ReactNode;
  preview: string;
}

export const EmailLayout = (props: EmailLayoutProps) => {
  const { children, preview } = props;
  const year = new Date().getFullYear();

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={panel}>
            <Link href="https://www.afteravenue.com">
              <Img
                alt="After Avenue"
                height={24}
                src={emailLogoSrc}
                style={logo}
                width={179}
              />
            </Link>
            {children}
          </Section>
          <Section style={footer}>
            <Img
              alt=""
              height={28}
              src={emailBrandmarkSrc}
              style={brandmark}
              width={28}
            />
            <Text style={footerText}>
              &copy; {year} After Avenue
              <br />
              <Link href="https://www.afteravenue.com" style={emailLink}>
                afteravenue.com
              </Link>
              {" · "}
              <Link href="mailto:hello@afteravenue.com" style={emailLink}>
                hello@afteravenue.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
