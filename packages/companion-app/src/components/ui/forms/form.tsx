import type {
  SubmitHandler,
  UseFormReturn,
  UseFormProps,
} from 'react-hook-form';
import type { SchemaOf } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type FormProps<TFormValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  useFormProps?: UseFormProps<TFormValues>;
  validationSchema?: SchemaOf<TFormValues>;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;

export const Form = <
  TFormValues extends Record<string, any> = Record<string, any>
>({
  onSubmit,
  children,
  useFormProps,
  validationSchema,
  ...formProps
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    ...useFormProps,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      noValidate
      {...formProps}
      className="space-y-4"
    >
      {children(methods)}
    </form>
  );
};
