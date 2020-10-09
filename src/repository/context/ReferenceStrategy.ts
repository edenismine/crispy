import { CollectionReference, DocumentReference } from '@google-cloud/firestore'
import { NestedId } from '../../common'
import { RepositoryError } from '../errors'

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
  Collection: (collection, id) => {
    if (!id)
      throw RepositoryError.of(
        'ValueError',
        'Value for argument "id" is not a valid resource path. "id" must be a non-empty string',
      )
    return collection.doc(id)
  },
  NestedCollection: (nestedCollectionName) => (
    collection,
    { id, parentId },
  ) => {
    if (!id)
      throw RepositoryError.of(
        'ValueError',
        'Value for argument "id" is not a valid resource path. "id" must be a non-empty string',
      )
    if (!nestedCollectionName)
      throw RepositoryError.of(
        'ValueError',
        'Value for argument "nestedCollectionName" is not a valid resource path. "nestedCollectionName" must be a non-empty string',
      )
    if (!parentId)
      throw RepositoryError.of(
        'ValueError',
        'Value for argument "parentId" is not a valid resource path. "parentId" must be a non-empty string',
      )
    return collection.doc(parentId).collection(nestedCollectionName).doc(id)
  },
}
