import { Connection } from 'mongoose';
import { AddressSchema } from './address.schema';
import { databaseProvidersName } from '../../database/database.providers'

export enum addressProvidersName {
    ADDRESS_MODEL = 'ADDRESS_MODEL'
}

export const addressProviders = [
  {
    provide: addressProvidersName.ADDRESS_MODEL,
    useFactory: (connection: Connection) => connection.model('Address', AddressSchema),
    inject: [databaseProvidersName.DATABASE_CONNECTION],
  },
];