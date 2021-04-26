import {
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
    Body,
    Query,
    HttpCode,
    HttpStatus,
    Get,
    Patch,
    Headers,
    Param,
    HttpException,
    Delete,
    Res
} from '@nestjs/common'
import { classToPlain } from 'class-transformer'
import { query } from 'express';
import { MessageService } from 'src/domain/message/message.service';

@Controller(`${process.env.SERVICE_NAME}/line`)
export class LineController {
    constructor(
        private readonly messageService: MessageService
    ) { }

    @Post('/')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createReport(@Body() body) {
        this.messageService.lineMessage(body)
        return {}
    }
    


}
