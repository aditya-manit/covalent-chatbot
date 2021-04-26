import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { addressProviders } from './message.provider'
import { DatabaseModule } from '../../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [MessageService, ...addressProviders],
  exports: [MessageService],
})
export class MessageModule {}
