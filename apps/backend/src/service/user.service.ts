import { UserDatabase } from '../database/index.ts';
import { ValidationUtils } from '../utils/index.ts';
import { bcrypt, GQLError } from '../deps.ts';
import { UpdateUser, ErrorType } from '../models.ts';

/**
 * Contains all methods for creating, updating and deleting, which are 
 * associated with user model.
 */
export class UserService {
  constructor(private users: UserDatabase) {}

  async updateUser(props: UpdateUser) {
    if (!props._id || !props.changes) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    const user = await this.users.getUser(props._id);
    if (!user) {
      throw new GQLError(ErrorType.USER_DOES_NOT_EXIST);
    }

    const changes = props.changes;

    if (changes.password) {
      if (!ValidationUtils.isPasswordValid(changes.password)) {
        throw new GQLError(ErrorType.INVALID_PASSWORD_FORMAT);
      }
      const password = changes.password;
      const salt = await bcrypt.genSalt(8);
      changes.password = await bcrypt.hash(password, salt);
    }

    if (changes.email) {      
      if (!ValidationUtils.isEmailValid(changes.email)) {
        throw new GQLError(ErrorType.INVALID_EMAIL_FORMAT);
      }

      if (await this.users.getUserByEmail(changes.email)) {
        throw new GQLError(ErrorType.USER_ALREADY_EXISTS);
      }

      changes.email = changes.email.toLowerCase();
    }

    return await this.users.updateUser(user._id, changes);
  }

  async deleteUser(id: string) {
    if (!id) {
      throw new GQLError(ErrorType.INCORRECT_REQUEST);
    }

    const user = await this.users.getUser(id);
    if (!user) {
      throw new GQLError(ErrorType.USER_DOES_NOT_EXIST);
    }

    return await this.users.deleteUser(user._id);
  }
}
