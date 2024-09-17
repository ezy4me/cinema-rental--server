import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty()
  filename: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  data: Buffer;
}
