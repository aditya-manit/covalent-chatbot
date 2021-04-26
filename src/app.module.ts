import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module'
import { LineController } from './controllers/line.controller'
import { FacebookController } from './controllers/facebook.controller'
import { MessageModule } from './domain/message/message.module'
import { WebController } from './controllers/web.controller'
import { WebModule } from './domain/web/web.module'
@Module({
  imports: [
    DatabaseModule,
    MessageModule,
    WebModule
  ],
  controllers: [LineController, FacebookController, WebController],
})
export class AppModule { }
