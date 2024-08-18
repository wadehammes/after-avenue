import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";

export const useSendContactEmailApiMutation = () => {
  const mutation = useMutation({
    mutationFn: api.sendEmail.contact,
  });

  return mutation;
};
