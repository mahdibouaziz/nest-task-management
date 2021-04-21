import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    //get the credentials
    const { username, password } = authCredentialsDto;

    //Create a new user
    const user = this.create({ username, password });

    //save it to the database
    await this.save(user);
  }
}
