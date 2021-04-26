import { Module } from '@nestjs/common'
import { addressProviders } from '../message/message.provider'
import {WebService} from './web.service'
import { DatabaseModule } from '../../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [WebService, ...addressProviders],
  exports: [WebService],
})
export class WebModule {}
