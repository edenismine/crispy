import { CollectionReference, QuerySnapshot } from '@google-cloud/firestore'
import { ReferenceStrategy } from './ReferenceStrategy'
import { IdGenerationStrategy } from './IdGenerationStrategy'
import { FirestoreContext } from './FirestoreContext'

export type CollectionContext<Entity, Model, ID> = FirestoreContext<
  Entity,
  Model,
  ID
> & {
  getAll(): Promise<QuerySnapshot>
}
export const CollectionContext = <Entity, Model, ID>(
  collection: CollectionReference,
  referenceStrategy: ReferenceStrategy<ID>,
  idGenerationStrategy: IdGenerationStrategy<Model>,
): CollectionContext<Entity, Model, ID> => ({
  ...FirestoreContext(collection, referenceStrategy, idGenerationStrategy),
  getAll: () => collection.get(),
})
