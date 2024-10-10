import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";

export const useHubspotLeadGenerationFormApiMutation = () => {
  const mutation = useMutation({
    mutationFn: api.hubspot.leadGeneration,
  });

  return mutation;
};
