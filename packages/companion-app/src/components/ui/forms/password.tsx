import { forwardRef } from 'react';
// {errors.email && <span role="alert">{errors.email.message}</span>}
type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string;
  error?: string;
};

const Password = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div>
      <label>{label}</label>
      <input
        type="password"
        ref={ref}
        {...props}
        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
      />
      {error && <span role="alert">{error}</span>}
    </div>
  )
);

Password.displayName = 'Password';
export default Password;
