"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StyledButton } from "src/components/StyledButton/StyledButton.component";

interface DeployButtonProps {
  deployHook: string;
  label: string;
}

export const DeployButton = (props: DeployButtonProps) => {
  const { deployHook, label } = props;
  const [clicked, setClicked] = useState(false);

  const handleDeploy = async () => {
    try {
      const response = await fetch(deployHook);
      if (response.ok) {
        setClicked(true);
        toast.success("Refresh successfully triggered");
      }
    } catch {
      toast.error("Failed to refresh");
    }
  };

  return (
    <StyledButton
      isDisabled={clicked}
      onPress={handleDeploy}
      variant={clicked ? "contained" : "outlined"}
      color="dark"
    >
      {clicked ? "Refreshing (wait ~2min)" : label}
    </StyledButton>
  );
};
