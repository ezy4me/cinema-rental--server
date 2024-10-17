import { Controller, Post, Body } from '@nestjs/common';
import { SmtpService } from './smtp.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@common/decorators';

@ApiTags('smtp')
@Controller('smtp')
export class SmtpController {
  constructor(private readonly smtpService: SmtpService) {}

  @Public()
  @Post('send')
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
  ) {
    return this.smtpService.sendMail(to, subject, text);
  }

  @Public()
  @Post('sendself')
  async sendSelfMail(
    @Body('subject') subject: string,
    @Body('text') text: string,
  ) {
    return this.smtpService.sendSelfMail(subject, text);
  }
}
