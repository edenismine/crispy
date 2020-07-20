import { CollectionReference, DocumentReference } from '@google-cloud/firestore'
import { NestedId } from '../../common'

export type ReferenceStrategy<ID = string> = (
  collection: CollectionReference,
  id: ID,
) => DocumentReference

type Defaults = {
  readonly Collection: ReferenceStrategy
  readonly NestedCollection: (
    nestedCollectionName: string,
  ) => ReferenceStrategy<NestedId>
}

export const ReferenceStrategy: Defaults = {
  Collection: (collection, id) => collection.doc(id),
  NestedCollection: (nestedCollectionName) => (collection, { id, parentId }) =>
    collection.doc(parentId).collection(nestedCollectionName).doc(id),
}
