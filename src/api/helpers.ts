export enum FetchMethods {
  Post = "POST",
}

interface FetchOptions {
  body?: string;
  method?: FetchMethods;
  headers?: Record<string, unknown>;
  authKey?: string;
}

const fetchOptions = ({
  body,
  headers,
  method = FetchMethods.Post,
  authKey,
}: FetchOptions) => {
  let authorization = {};

  if (authKey) {
    authorization = { Authorization: `Bearer ${authKey}` };
  }

  return {
    method,
    headers: {
      "Content-Type": "application/json; charset=utf-8",

      Accept: "application/json",
      ...authorization,
      ...headers,
    },
    body,
  };
};

export const fetchResponse = async <T>(
  endpoint: Promise<Response>,
): Promise<T> => {
  const res = await endpoint;

  return res.json();
};

const parseApiError = async (response: Response): Promise<string> => {
  const errorData = (await response.json().catch(() => ({}))) as {
    error?: string;
  };

  return errorData.error || `Request failed with status ${response.status}`;
};

export const postJson = async <T>(url: string, body: unknown): Promise<T> => {
  const response = await fetch(
    url,
    fetchOptions({
      method: FetchMethods.Post,
      body: JSON.stringify(body),
    }),
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return fetchResponse<T>(Promise.resolve(response));
};
