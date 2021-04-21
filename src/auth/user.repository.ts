import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
//library to encrypt the password with salt
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    //get the credentials
    const { username, password } = authCredentialsDto;

    //check if the username exists in the database
    //meth1 but this method do 2 queries
    /* const find = await this.find({ username });
    if (find.length > 0) {
      throw new ConflictException('username already Exists');
    } */

    //generate the salt
    const salt = await bcrypt.genSalt();
    //console.log(salt);

    //Create a new user
    const user = this.create({
      username,
      salt, //store the salt
      password: await this.hashPassword(password, salt), //store the hashed password
    });
    //console.log(user.password);

    //meth2 with only one query
    try {
      //save it to the database
      await this.save(user);
    } catch (error) {
      //console.log(error.code);
      if (error.code == 23505) {
        //duplicate username
        throw new ConflictException('username already Exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
