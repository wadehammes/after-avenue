import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";

export const useDeployHookMutation = () => {
  return useMutation({
    mutationFn: (deployHook: string) => api.deploy.triggerHook(deployHook),
  });
};
