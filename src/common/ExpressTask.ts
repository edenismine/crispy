import { Request, Response } from 'express'
import { Task } from 'fp-ts/lib/Task'

export type ExpressTask = (req: Request, res: Response) => Task<void>
