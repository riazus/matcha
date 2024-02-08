import { object, string } from "zod";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangeEmailMutation } from "../app/api/api";
import { Box } from "@mui/material";
import FormInput from "../components/FormInput";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import { toast } from "react-toastify";

const emailSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  confirmEmail: string().min(1, "Please confirm your email"),
}).refine((data) => data.email === data.confirmEmail, {
  path: ["confirmEmail"],
  message: "Emails do not match",
});

interface ChangeEmailForm {
  email: string;
  confirmEmail: string;
}

function ChangeEmailSettings() {
  const [changeEmail, { isLoading, isSuccess }] = useChangeEmailMutation();
  const methods = useForm<ChangeEmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (!isLoading && isSuccess) {
      reset();
      toast.warning(
        "We saved your new email! You have to verify it by access to" +
          " your new email address and follow the instructions"
      );
    }
  }, [isLoading, isSuccess, reset]);

  const onSubmitForm: SubmitHandler<ChangeEmailForm> = (values) => {
    changeEmail(values.email);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmitForm)} noValidate>
        <FormInput name="email" label="Email" type="string" />
        <FormInput name="confirmEmail" label="Confirm Email" type="string" />

        <LoadingButton type="submit" loading={isLoading}>
          Change Email
        </LoadingButton>
      </Box>
    </FormProvider>
  );
}

export default ChangeEmailSettings;
