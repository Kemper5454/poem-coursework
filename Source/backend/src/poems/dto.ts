import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreatePoemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsInt()
  author_id: number;

  @IsInt()
  genre_id: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}

export class UpdatePoemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsInt()
  author_id: number;

  @IsInt()
  genre_id: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}