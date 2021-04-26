import { Get, Controller, Render, Query } from '@nestjs/common';
import { WebService } from 'src/domain/web/web.service';

@Controller(`${process.env.SERVICE_NAME}/web`)
export class WebController {
  constructor(
    private readonly webService: WebService
  ) { }
  @Get(`/transactions`)
  async transaction(@Query() query) {
    const response = await this.webService.transaction(query.id, query.page)
    return response
  }

  @Get(`/portfolios`)
  async portfolio(@Query() query) {
    const response = await this.webService.portfolio(query.id)
    return response
  }
}
