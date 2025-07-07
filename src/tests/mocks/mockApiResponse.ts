import type { MockedFunction } from "jest-mock";

// biome-ignore lint/suspicious/noExplicitAny: false positive
export function mockApiResponse<T extends (...args: any[]) => any>(
  responseResult: boolean | boolean[],
  mockApiEndpoint: MockedFunction<T>,
  // biome-ignore lint/suspicious/noExplicitAny: false positive
  resolvedResponse: Awaited<any>,
  // biome-ignore lint/suspicious/noExplicitAny: false positive
  rejectedResponse: Awaited<any>,
) {
  const responseResults =
    typeof responseResult === "boolean" ? [responseResult] : responseResult;

  responseResults.forEach((result, index) => {
    const isLast = index === responseResults.length - 1;

    if (result) {
      if (isLast) {
        mockApiEndpoint.mockResolvedValue(resolvedResponse);
      } else {
        mockApiEndpoint.mockResolvedValueOnce(resolvedResponse);
      }
    } else if (isLast) {
      mockApiEndpoint.mockRejectedValue(rejectedResponse);
    } else {
      mockApiEndpoint.mockRejectedValueOnce(rejectedResponse);
    }
  });
}
