import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  eventDate: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}
