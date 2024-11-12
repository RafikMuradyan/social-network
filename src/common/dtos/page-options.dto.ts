import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../enums';

export class PageOptionsDto {
  @ApiProperty({
    description: 'The order in which to sort the results.',
    example: Order.DESC,
    enum: Order,
    required: false,
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @ApiProperty({
    description: 'The page number for pagination.',
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiProperty({
    description: 'The number of items per page.',
    example: 10,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
