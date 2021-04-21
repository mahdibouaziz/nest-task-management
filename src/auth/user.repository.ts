import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

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

    //Create a new user
    const user = this.create({ username, password });

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
}
