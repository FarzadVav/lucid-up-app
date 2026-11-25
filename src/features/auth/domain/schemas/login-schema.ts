import * as v from 'valibot';

export const loginSchema = v.object({
  email: v.pipe(
    v.string('Please enter a valid email address.'),
    v.trim(),
    v.toLowerCase(),
    v.nonEmpty('Please enter a valid email address.'),
    v.email('Please enter a valid email address.')
  ),
});

export type LoginFormInput = v.InferInput<typeof loginSchema>;
export type LoginFormOutput = v.InferOutput<typeof loginSchema>;
