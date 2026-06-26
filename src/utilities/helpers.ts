type DiffResult<T> = {
  toSave: T[];
  toDelete: T[];
};

// A function that takes two arrays and generates two differences
// one for values to save and one for values to delete from the database.
export function diffArrays<T, K>(
  draft: T[],
  saved: T[],
  getKey: (item: T) => K,
): DiffResult<T> {
  const savedKeys = new Set(saved.map(getKey));
  const draftKeys = new Set(draft.map(getKey));

  const toSave = draft.filter((item) => !savedKeys.has(getKey(item)));
  const toDelete = saved.filter((item) => !draftKeys.has(getKey(item)));

  return { toSave, toDelete };
}
