export const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
);

export const passwordRegex = RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
);

export class ValidationUtils {
  static isPasswordValid = (password: string) => {
    return passwordRegex.test(password);
  };

  static isEmailValid = (email: string) => {
    return emailRegex.test(email);
  };
}
