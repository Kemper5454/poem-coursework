import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsOptional()
  @IsInt()
  birth_year?: number;

  @IsOptional()
  @IsString()
  country?: string;
}

export class UpdateAuthorDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsInt()
  birth_year?: number;

  @IsOptional()
  @IsString()
  country?: string;
}