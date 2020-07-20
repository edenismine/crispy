import { FieldValue, Timestamp } from '@google-cloud/firestore'

export function fromTimestampOrFieldValue(time: Timestamp | FieldValue): Date {
  return time instanceof Timestamp ? time.toDate() : new Date()
}
