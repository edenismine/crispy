import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Transaction,
} from '@google-cloud/firestore'
import { IdGenerationStrategy } from './IdGenerationStrategy'
import { ReferenceStrategy } from './ReferenceStrategy'

export type FirestoreContext<Entity, Model, ID> = {
  getRef(id: ID): DocumentReference
  getNewRef(model: Model): DocumentReference
  create(
    newRef: DocumentReference,
    entity: Entity,
    tx?: Transaction,
  ): Promise<unknown>
  get(id: ID, tx?: Transaction): Promise<DocumentSnapshot>
  remove(id: ID, tx?: Transaction): Promise<unknown>
  update(id: ID, entity: Entity, tx?: Transaction): Promise<unknown>
}
export const FirestoreContext = <Entity, Model, ID>(
  collection: CollectionReference,
  referenceStrategy: ReferenceStrategy<ID>,
  idGenerationStrategy: IdGenerationStrategy<Model>,
): FirestoreContext<Entity, Model, ID> => ({
  getRef: (id) => referenceStrategy(collection, id),
  getNewRef: (model) => idGenerationStrategy(collection, model),
  create: async (newRef, entity, tx) =>
    tx ? tx.create(newRef, entity) : newRef.create(entity),
  get: async (id, tx) =>
    ((ref) => (tx ? tx.get(ref) : ref.get()))(
      referenceStrategy(collection, id),
    ),
  remove: async (id, tx) =>
    ((ref) => (tx ? tx.delete(ref) : ref.delete()))(
      referenceStrategy(collection, id),
    ),
  update: async (id, entity, tx) =>
    ((ref) => (tx ? tx.update(ref, entity) : ref.update(entity)))(
      referenceStrategy(collection, id),
    ),
})
