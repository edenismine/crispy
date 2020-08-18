import { FirestoreContext } from './FirestoreContext'
import { QuerySnapshot } from '@google-cloud/firestore'
import { Query } from '../query'

export type QueryableContext<
  Entity extends Record<string, unknown>,
  Model,
  ID
> = FirestoreContext<Entity, Model, ID> & {
  getMatching(query: Query<Entity>): Promise<QuerySnapshot>
}
