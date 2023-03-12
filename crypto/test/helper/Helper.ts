type ReadonlyPartialPick<T, K extends keyof T> = Readonly<Partial<T>> & Pick<T, K>;
type ReadonlyPick<T, K extends keyof T> = Readonly<Pick<T, K>>;

//** Excluding array types with array keys accessors */
type GrowToSize<T, N extends number, A extends T[], L extends number = A['length']> =
  L extends N ? A : L extends 10 ? T[] : GrowToSize<T, N, [...A, T]>;

type FixedArray<T, N extends number> = GrowToSize<T, N, []>;

type ExcludeIterableWithKeys<T, N extends number> = {
  [P in keyof T as P extends keyof FixedArray<T, N> ? never : P]: T[P]
}

type ReadonlyExcludeIterableWithKeys<T> = ExcludeIterableWithKeys<Readonly<T>, 10>
//** Excluding array types with array keys accessors */

export {
  ReadonlyPartialPick,
  ReadonlyPick,
  ReadonlyExcludeIterableWithKeys
};
