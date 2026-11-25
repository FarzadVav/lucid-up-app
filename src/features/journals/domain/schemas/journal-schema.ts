import * as v from 'valibot';

export function createJournalFormSchema(requireCategory: boolean) {
  return v.object({
    title: v.pipe(
      v.string('Please enter a journal title.'),
      v.trim(),
      v.nonEmpty('Please enter a journal title.')
    ),
    content: v.pipe(
      v.string('Please write your journal content.'),
      v.check((value) => value.trim().length > 0, 'Please write your journal content.')
    ),
    categoryId: requireCategory
      ? v.pipe(
          v.nullable(v.string()),
          v.check(
            (value) => typeof value === 'string' && value.length > 0,
            'Please select a category.'
          )
        )
      : v.nullable(v.string()),
  });
}

export const journalCreateSchema = createJournalFormSchema(false);
export const journalUpdateSchema = createJournalFormSchema(true);

export type JournalFormInput = v.InferInput<typeof journalCreateSchema>;
export type JournalFormOutput = v.InferOutput<typeof journalCreateSchema>;
