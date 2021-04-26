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
import { MessageService } from 'src/domain/message/message.service';

@Controller(`${process.env.SERVICE_NAME}/facebook`)
export class FacebookController {
    constructor(
        private readonly messageService: MessageService
    ) { }

    @Post('/')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createReport(@Res() res, @Body() body) {
        this.messageService.facebookMessage(body)
        return res.status(HttpStatus.OK).send({})
    }
    @Get('/')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getReport(@Res() res, @Query() query) {
        if (query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
            return res.status(HttpStatus.OK).send(query['hub.challenge'])
        } else return res.status(HttpStatus.NOT_FOUND).send({})

    }


}
