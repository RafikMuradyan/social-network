import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchUsersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(120)
  minAge?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(120)
  maxAge?: number;
}
