"use client";

import { toast } from "sonner";
import { StyledButton } from "src/components/StyledButton/StyledButton.component";
import { useDeployHookMutation } from "src/hooks/mutations/useDeployHookMutation";

interface DeployButtonProps {
  deployHook: string;
  label: string;
}

export const DeployButton = (props: DeployButtonProps) => {
  const { deployHook, label } = props;
  const deployHookMutation = useDeployHookMutation();

  const handleDeploy = () => {
    deployHookMutation.mutate(deployHook, {
      onSuccess: () => {
        toast.success("Refresh successfully triggered");
      },
      onError: () => {
        toast.error("Failed to refresh");
      },
    });
  };

  const isRefreshing =
    deployHookMutation.isPending || deployHookMutation.isSuccess;

  return (
    <StyledButton
      isDisabled={isRefreshing}
      onPress={handleDeploy}
      variant={isRefreshing ? "contained" : "outlined"}
      color="dark"
    >
      {isRefreshing ? "Refreshing (wait ~2min)" : label}
    </StyledButton>
  );
};
