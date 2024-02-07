import { object, string } from "zod";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePasswordBody } from "../types/api/accounts";
import { useUpdatePasswordSettingsMutation } from "../app/api/api";
import { Box } from "@mui/material";
import FormInput from "./FormInput";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import { toast } from "react-toastify";

const identificationSchema = object({
  oldPassword: string().min(1, "Password is required"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirmPassword: string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

function ChangeIdentificationSettings() {
  const [updatePassword, { isLoading, isSuccess }] =
    useUpdatePasswordSettingsMutation();
  const methods = useForm<UpdatePasswordBody>({
    resolver: zodResolver(identificationSchema),
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (!isLoading && isSuccess) {
      reset();
      toast.success("Password successfully changed!");
    }
  }, [isLoading, isSuccess, reset]);

  const onSubmitForm: SubmitHandler<UpdatePasswordBody> = (values) => {
    updatePassword(values);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmitForm)} noValidate>
        <FormInput name="oldPassword" label="Old Password" type="password" />
        <FormInput name="password" label="Password" type="password" />
        <FormInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
        />

        <LoadingButton type="submit" loading={isLoading}>
          Update Password
        </LoadingButton>
      </Box>
    </FormProvider>
  );
}

export default ChangeIdentificationSettings;
