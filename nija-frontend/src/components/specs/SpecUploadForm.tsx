import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import './SpecUploadForm.css';

const specUploadSchema = z.object({
  content: z
    .string()
    .min(1, 'Specification content is required')
    .min(50, 'Specification content must be at least 50 characters'),
});

type SpecUploadFormData = z.infer<typeof specUploadSchema>;

export interface SpecUploadFormProps {
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
  projectId: string;
}

export const SpecUploadForm = ({ onSubmit, isLoading = false }: SpecUploadFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SpecUploadFormData>({
    resolver: zodResolver(specUploadSchema),
    defaultValues: {
      content: '',
    },
  });

  const contentValue = watch('content');
  const lineCount = contentValue ? contentValue.split('\n').length : 0;

  const handleFormSubmit = async (data: SpecUploadFormData) => {
    await onSubmit(data.content);
  };

  return (
    <form
      className="spec-upload-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      aria-labelledby="spec-upload-title"
    >
      <h2 id="spec-upload-title" className="sr-only">
        Upload Specification
      </h2>

      <div className="spec-upload-form__field">
        <label htmlFor="spec-content" className="spec-upload-form__label">
          Specification Content (Markdown)
        </label>
        <textarea
          id="spec-content"
          className={`spec-upload-form__textarea ${errors.content ? 'spec-upload-form__textarea--error' : ''}`}
          placeholder="# API Specification&#10;&#10;## Endpoints&#10;&#10;### GET /api/users&#10;..."
          aria-invalid={errors.content ? 'true' : 'false'}
          aria-describedby={errors.content ? 'spec-content-error' : 'spec-content-helper'}
          disabled={isLoading || isSubmitting}
          {...register('content')}
        />
        {errors.content && (
          <span id="spec-content-error" className="spec-upload-form__error" role="alert">
            <AlertCircle size={14} aria-hidden="true" />
            {errors.content.message}
          </span>
        )}
        {!errors.content && (
          <span id="spec-content-helper" className="spec-upload-form__helper">
            {lineCount} line{lineCount !== 1 ? 's' : ''} &middot; Paste or type your specification in Markdown format.
          </span>
        )}
      </div>

      <div className="spec-upload-form__actions">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading || isSubmitting}
          leftIcon={!isLoading && !isSubmitting ? <Upload size={18} /> : undefined}
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? 'Uploading...' : 'Upload Specification'}
        </Button>
      </div>
    </form>
  );
};

export default SpecUploadForm;
