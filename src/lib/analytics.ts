export enum ActionTypes {
  Click = "click",
  CTAClick = "cta_clicked",
  StartProjectFormSubmitted = "submit_start_project_form",
}

export enum EventTypes {
  Click = "click",
  FormSubmit = "formSubmit",
}

interface SegmentEventProps {
  [key: string]: string | number | boolean;
  action: string | ActionTypes;
  category: string;
  label: string;
  value: string | boolean;
}

interface TrackEventProps {
  event: EventTypes;
  properties: SegmentEventProps;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const trackEvent = ({ event, properties }: TrackEventProps) =>
  window.dataLayer?.push({ event, ...properties });
