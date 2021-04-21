import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/, {
    message: 'Password too weak',
  }) //apply regular expressions to verify that the password is good enough
  password: string;
}

/* 
      Note this regular expression means:

      At least one digit [0-9]
      At least one lowercase character [a-z]
      At least one uppercase character [A-Z]
      At least 8 characters in length, but no more than 20.

*/
