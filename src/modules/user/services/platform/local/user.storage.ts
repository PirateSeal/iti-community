import { TypedLocalStorage } from 'src/modules/common/TypedLocalStorage';
import { UserRegistration } from 'src/modules/user/user.model';

export class UserLocalStorage extends TypedLocalStorage<{ [id: string]: UserRegistration }> {
  private static StorageKey = "iti.user";

  constructor() {
    super(UserLocalStorage.StorageKey, {});
  }
}
