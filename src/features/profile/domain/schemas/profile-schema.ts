import * as v from 'valibot';

export const profileSchema = v.object({
  fullName: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(120, 'Full name must be 120 characters or fewer.'),
    v.transform((value) => (value.length > 0 ? value : null))
  ),
});

export type ProfileFormInput = v.InferInput<typeof profileSchema>;
export type ProfileFormOutput = v.InferOutput<typeof profileSchema>;
