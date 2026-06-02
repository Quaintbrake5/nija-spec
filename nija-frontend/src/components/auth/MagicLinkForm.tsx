import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import './MagicLinkForm.css';

const magicLinkSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

export interface MagicLinkFormProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading?: boolean;
}

export const MagicLinkForm = ({ onSubmit, isLoading = false }: MagicLinkFormProps) => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = async (data: MagicLinkFormData) => {
    await onSubmit(data.email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="magic-link-form" role="status" aria-live="polite">
        <div className="magic-link-form__success">
          <CheckCircle className="magic-link-form__success-icon" size={48} aria-hidden="true" />
          <h2 className="magic-link-form__success-title">Check your email</h2>
          <p className="magic-link-form__success-message">
            We sent a magic link to <strong>{getValues('email')}</strong>.
            Click the link in the email to sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="magic-link-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      aria-labelledby="magic-link-title"
    >
      <h2 id="magic-link-title" className="magic-link-form__title">
        Sign in with Magic Link
      </h2>
      <p className="magic-link-form__description">
        Enter your email address and we'll send you a link to sign in without a password.
      </p>

      <div className="magic-link-form__field">
        <label htmlFor="magic-link-email" className="magic-link-form__label">
          Email address
        </label>
        <input
          id="magic-link-email"
          type="email"
          className={`magic-link-form__input ${errors.email ? 'magic-link-form__input--error' : ''}`}
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'magic-link-email-error' : undefined}
          disabled={isLoading || isSubmitting}
          {...register('email')}
        />
        {errors.email && (
          <span id="magic-link-email-error" className="magic-link-form__error" role="alert">
            <Mail size={14} aria-hidden="true" />
            {errors.email.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="magic-link-form__submit"
        disabled={isLoading || isSubmitting}
        aria-busy={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? (
          <Loader2 className="magic-link-form__spinner" size={18} aria-hidden="true" />
        ) : (
          <Send size={18} aria-hidden="true" />
        )}
        {isLoading || isSubmitting ? 'Sending...' : 'Send Magic Link'}
      </button>
    </form>
  );
};

export default MagicLinkForm;
