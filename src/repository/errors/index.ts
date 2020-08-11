type RepositoryErrorType =
  | 'NoSuchEntityError'
  | 'DataAccessError'
  | 'UnknownError'
  | 'ValueError'

export type RepositoryErrorHandler = (reason: unknown) => RepositoryError
export const RepositoryErrorHandler = {
  defaultHandler: (reason: unknown): RepositoryError => {
    console.error(reason)
    return reason instanceof RepositoryError
      ? reason
      : RepositoryError.ofAny('DataAccessError', reason)
  },
}

export class RepositoryError extends Error {
  private static readonly defaultMessage: {
    [key in RepositoryErrorType]: string
  } = {
    NoSuchEntityError: 'No such entity exists',
    DataAccessError: 'An error occurred while acessing the data layer',
    UnknownError: 'An unknown error occurred',
    ValueError: 'An illegal or invalid error was supplied',
  }

  private constructor(
    public readonly type: RepositoryErrorType,
    public readonly message: string = RepositoryError.defaultMessage[type],
    public readonly reason?: Error,
    public readonly name: string = 'RepositoryError.' + type,
  ) {
    super(message)
  }

  public static of(
    type: RepositoryErrorType,
    message?: string,
  ): RepositoryError {
    return new RepositoryError(type, message)
  }

  public static ofError(
    type: RepositoryErrorType,
    error: Error,
  ): RepositoryError {
    return new RepositoryError(type, error.message, error)
  }

  public static ofAny(
    type: RepositoryErrorType,
    obj: unknown,
  ): RepositoryError {
    const error = obj instanceof Error ? obj : new Error(`${obj}`)
    return new RepositoryError(type, error.message, error)
  }

  toString(): string {
    return this.name + ': ' + this.message
  }
}
