import { Adapter } from '../../common'
import { Referenced } from '../utils'

export type EntityReader<Entity, Model> = Adapter<Referenced<Entity>, Model>
