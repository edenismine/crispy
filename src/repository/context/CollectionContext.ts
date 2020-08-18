import { CollectionReference, QuerySnapshot } from '@google-cloud/firestore'
import { Operator } from '../query'
import { FirestoreContext } from './FirestoreContext'
import { IdGenerationStrategy } from './IdGenerationStrategy'
import { QueryableContext } from './QueryableContext'
import { ReferenceStrategy } from './ReferenceStrategy'

export type CollectionContext<
  Entity extends Record<string, unknown>,
  Model,
  ID
> = QueryableContext<Entity, Model, ID> & {
  getAll(): Promise<QuerySnapshot>
}
export const CollectionContext = <
  Entity extends Record<string, unknown>,
  Model,
  ID
>(
  collection: CollectionReference,
  referenceStrategy: ReferenceStrategy<ID>,
  idGenerationStrategy: IdGenerationStrategy<Model>,
): CollectionContext<Entity, Model, ID> => ({
  ...FirestoreContext(collection, referenceStrategy, idGenerationStrategy),
  getAll: () => collection.get(),
  getMatching: ({ operators }) => {
    let acc: FirebaseFirestore.Query = collection
    while (operators.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const op: Operator<Entity> = operators.shift()!
      if (op._tag === 'in') {
        acc = acc.where(op.key as string, op._tag, op.values)
      } else {
        acc = acc.where(op.key as string, op._tag, op.value)
      }
    }
    return acc.get()
  },
})
