import { DocumentReference } from '@google-cloud/firestore'

export type Referenced<T = Record<string, unknown>> = {
  readonly data: T
  readonly ref: DocumentReference
}
export const Referenced = <T>(
  data: T,
  ref: DocumentReference,
): Referenced<T> => ({ data, ref })
