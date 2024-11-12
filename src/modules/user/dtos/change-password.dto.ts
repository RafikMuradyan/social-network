import { UnprocessableEntityException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { validateOrReject } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The current password of the user.',
    example: 'OldPass123!',
  })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'The new password the user wants to set.',
    example: 'NewPass456!',
  })
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description:
      'Confirmation of the new password. Must match the new password.',
    example: 'NewPass456!',
  })
  @IsNotEmpty()
  confirmPassword: string;

  constructor(data: Partial<ChangePasswordDto>) {
    Object.assign(this, data);
  }

  async validate(): Promise<void> {
    if (this.newPassword !== this.confirmPassword) {
      throw new UnprocessableEntityException(
        'New password and confirm password must match',
      );
    }
    await validateOrReject(this);
  }
}
