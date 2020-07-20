import { CollectionReference, QuerySnapshot } from '@google-cloud/firestore'
import { Nested, NestedId } from '../../common'
import { FirestoreContext } from './FirestoreContext'
import { IdGenerationStrategy } from './IdGenerationStrategy'
import { ReferenceStrategy } from './ReferenceStrategy'

export type NestedCollectionContext<Entity, Model> = FirestoreContext<
  Entity,
  Nested<Model>,
  NestedId
> & {
  getAllOf(parentId: string): Promise<QuerySnapshot>
}
export const NestedCollectionContext = <Entity, Model>(
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
})
