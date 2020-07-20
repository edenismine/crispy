import { Referenced } from '../utils'
import { Adapter } from '../../common'

export type EntityWriter<Entity, Model> = Adapter<Referenced<Model>, Entity>
