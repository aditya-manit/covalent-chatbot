import * as mongoose from 'mongoose'

import configuration from '../config/configuration'

export enum databaseProvidersName {
  DATABASE_CONNECTION = 'DATABASE_CONNECTION'
}

export const databaseProviders = [
  {
    provide: databaseProvidersName.DATABASE_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(configuration().mongoURI),
  },
]