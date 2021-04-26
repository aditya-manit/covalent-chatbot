import { Document } from 'mongoose';
export interface Address extends Document {
  userId: string
  address: string
  network: string
  name:string
}
