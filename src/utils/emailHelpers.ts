import {
  isLocalEnvironment,
  isNonProductionContactEnvironment,
  isStagingEnvironment,
} from "src/utils/helpers";

const PRODUCTION_CONTACT_SUBMISSION_TO = "After Avenue <hello@afteravenue.com>";

const isLocalDevResendRouting = (): boolean =>
  isLocalEnvironment() || process.env.NODE_ENV === "development";

const isResendOnlyContactRouting = (): boolean =>
  isNonProductionContactEnvironment();

const parseRecipientList = (value: string): string[] =>
  value
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

const resolveNotificationOverride = (): string | string[] | undefined => {
  const devTo = process.env.RESEND_DEV_TO_EMAIL?.trim();

  if (isLocalDevResendRouting() && devTo) {
    return devTo;
  }

  if (isStagingEnvironment()) {
    const testRecipients = process.env.RESEND_TEST_RECIPIENTS?.trim();
    if (testRecipients) {
      return parseRecipientList(testRecipients);
    }
    if (devTo) {
      return devTo;
    }
  }

  return undefined;
};

const firstRecipient = (recipients: string | string[]): string | undefined => {
  if (Array.isArray(recipients)) {
    return recipients[0];
  }
  return recipients;
};

export const isNotificationRecipientOverrideActive = (): boolean =>
  resolveNotificationOverride() !== undefined;

const getNotificationTo = (
  productionTo: string | string[],
): string | string[] => resolveNotificationOverride() ?? productionTo;

export const getContactFormSubmissionTo = (): string | string[] | null => {
  const override = resolveNotificationOverride();
  if (override) {
    return override;
  }
  if (isResendOnlyContactRouting()) {
    return null;
  }
  return PRODUCTION_CONTACT_SUBMISSION_TO;
};

export const getContactFormConfirmationTo = ({
  email,
  name,
}: {
  email: string;
  name: string;
}): string | null => {
  const submitter = `${name} <${email}>`;

  if (isResendOnlyContactRouting()) {
    const override = resolveNotificationOverride();
    if (!override) {
      return null;
    }
    return firstRecipient(override) ?? null;
  }

  const overrideTo = getNotificationTo(submitter);
  if (typeof overrideTo === "string" && overrideTo !== submitter) {
    return overrideTo;
  }
  if (Array.isArray(overrideTo)) {
    return overrideTo[0] ?? submitter;
  }
  return submitter;
};

export const shouldSkipResendAudienceSync = (): boolean =>
  isResendOnlyContactRouting();
