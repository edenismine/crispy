import { CollectionReference, DocumentReference } from '@google-cloud/firestore'
import { Identifiable, Nested } from '../../common'

export type IdGenerationStrategy<T = Record<string, unknown>> = (
  collection: CollectionReference,
  model: T,
) => DocumentReference

type Defaults = {
  readonly CollectionAuto: IdGenerationStrategy
  readonly IdentifiableCollection: IdGenerationStrategy<Identifiable>
  readonly NestedCollectionAuto: <T>(
    nestedCollectionName: string,
  ) => IdGenerationStrategy<Nested<T>>
  readonly IdentifiableNestedCollection: <T>(
    nestedCollectionName: string,
  ) => IdGenerationStrategy<Identifiable<Nested<T>>>
}

export const IdGenerationStrategy: Defaults = {
  CollectionAuto: (collection, _) => collection.doc(),
  IdentifiableCollection: (collection, model) => collection.doc(model.id),
  NestedCollectionAuto: (nestedCollectionName) => (collection, model) =>
    collection.doc(model.parentId).collection(nestedCollectionName).doc(),
  IdentifiableNestedCollection: (nestedCollectionName) => (collection, model) =>
    collection
      .doc(model.parentId)
      .collection(nestedCollectionName)
      .doc(model.id),
}
