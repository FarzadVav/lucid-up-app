import * as v from 'valibot';

export const categoryFormSchema = v.object({
  title: v.pipe(
    v.string('Please enter a category title.'),
    v.trim(),
    v.nonEmpty('Please enter a category title.')
  ),
});

export type CategoryFormInput = v.InferInput<typeof categoryFormSchema>;
export type CategoryFormOutput = v.InferOutput<typeof categoryFormSchema>;
