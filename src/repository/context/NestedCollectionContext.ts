import { CollectionReference, QuerySnapshot } from '@google-cloud/firestore'
import { Nested, NestedId } from '../../common'
import { Operator } from '../query'
import { FirestoreContext } from './FirestoreContext'
import { IdGenerationStrategy } from './IdGenerationStrategy'
import { NestedQueryableContext } from './NestedQueryableContext'
import { ReferenceStrategy } from './ReferenceStrategy'

export type NestedCollectionContext<
  Entity extends Record<string, unknown>,
  Model
> = NestedQueryableContext<Entity, Model> & {
  getAllOf(parentId: string): Promise<QuerySnapshot>
}
export const NestedCollectionContext = <
  Entity extends Record<string, unknown>,
  Model
>(
  nestedCollectionName: string,
  parentCollection: CollectionReference,
  referenceStrategy: ReferenceStrategy<NestedId>,
  idGenerationStrategy: IdGenerationStrategy<Nested<Model>>,
): NestedCollectionContext<Entity, Model> => ({
  ...FirestoreContext(
    parentCollection,
    referenceStrategy,
    idGenerationStrategy,
  ),
  getAllOf: (parentId) =>
    parentCollection.doc(parentId).collection(nestedCollectionName).get(),
  getMatchingOf: (parentId, { operators }) => {
    let acc: FirebaseFirestore.Query = parentCollection
      .doc(parentId)
      .collection(nestedCollectionName)
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
