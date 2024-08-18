import React from "react";

const executeAsyncMock = jest.fn();

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
const ReCAPTCHA = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    executeAsync: executeAsyncMock,
  }));
  return <div data-testid="recaptcha-mock">ReCAPTCHA Mock</div>;
});

export { executeAsyncMock };
export default ReCAPTCHA;
