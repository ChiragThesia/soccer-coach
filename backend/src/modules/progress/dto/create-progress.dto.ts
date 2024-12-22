import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateProgressDto {
  @IsNumber()
  @Min(4)
  @Max(18)
  athleteAge: number;

  @IsNumber()
  @Min(0)
  @Max(1000)
  juggles: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  kickDistance: number;

  @IsOptional()
  videoUrl?: string;
}
