import { UserSchema } from './../schema/mongo/user.schema.ts';
import { getUserFromDb, addUserToDb } from './../db/user.database.ts';
import { bcrypt, create, GQLError, verify } from "../deps.ts";
import { header, payload } from "../middleware/jwt.ts";

const isPasswordValid = (password: string) => {
  const passwordRegex = RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
  );

  return passwordRegex.test(password);
};

const isEmailValid = (email: string) => {
  const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  return emailRegex.test(email);
};

const doesUserExist = async (
  email: string
) => {
  const user: UserSchema | null = await getUserFromDb(email);

  return user;
};

//MUTATE { email: "x-email", name: "x-name", password: "x-password" }
export const registerUser = async (parent: any, { userRegister }: any, context: any, info: any) => {
  const requestData: any = userRegister;

  if (!requestData.email || !requestData.name || !requestData.password) {
    throw new GQLError({ message: "Your request has the wrong format"});
  }

  if (!isPasswordValid(requestData.password)) {
    throw new GQLError({ message: "Your password needs a minimum of eight characters, at least one letter, one number and a special character"});
  }

  if (!isEmailValid(requestData.email)) {
    throw new GQLError({ message: "Invalid email!"});
  }

  const userExists: UserSchema | null = await doesUserExist(
    requestData.email
  );

  if (!userExists) {
    throw new GQLError("This User already exists");
  }
 
  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(requestData.password, salt);
  const uid = addUserToDb();

  if (uid) {
    return { done: true };
  } else {
    throw new GQLError("Something went wrong");
  }
};

export const loginUser = async (parent: any, { userLogin }: any, context: any, info: any) => {
  const requestData: any = userLogin;

  if (!requestData.email || !requestData.password) {
    throw new GQLError({ message: "Your request has the wrong format"});
  }

  if (!isPasswordValid(requestData.password)) {
    throw new GQLError({ message: "Invalid password!"});
  }

  if (!isEmailValid(requestData.email)) {
    throw new GQLError({ message: "Invalid email!"});
  }

  const user: any | null = await doesUserExist(
    requestData.email
  );

  if (user) {
    const result = await bcrypt.compare(requestData.password, user.password);
    if (result) {
      const payloadWithUser = {
        ...payload,
        email: requestData.email,
      };

      const JWT_SECRET: string | undefined = Deno.env.get("JWT_SECRET");

      if (!JWT_SECRET) {
        throw new GQLError({ message: "Could not generate Token!"});
      }
      const jwt = await create(header, payloadWithUser, JWT_SECRET);
      console.log("jwt created");
      return { token: jwt };
    } else {
      throw new GQLError({ message: "Wrong password!"});
    }
  } else {
    throw new GQLError({ message: "This user does not exist!"});
  }
};

export const validateAuth = async (context: any) => {
  const requestToken: string = context.request.headers.get("Authorization");

  if (!requestToken) {
    return { success: false, status: 403, body: "Auth token required!" };
  }

  try {
    const requestTokenArray = requestToken.split(" ");

    const requestJwtToken = requestTokenArray[1];

    const JWT_SECRET: string | undefined = Deno.env.get("JWT_SECRET");

    if (!JWT_SECRET) {
      return { success: false, status: 403, body: "Could not verify Token!" };
    }

    const jwtData: any = await verify(requestJwtToken, JWT_SECRET, header.alg);

    if (!jwtData.exp) {
      return { success: false, status: 403, body: "Token is corrupt" };
    }

    if (jwtData.exp <= Date.now()) {
      return { success: false, status: 400, body: "Token expired!" };
    }

    return { success: true, email: jwtData.email };
  } catch (error) {
    return { success: false, status: 400, body: "Invalid Token" };
  }
};

export const getUser = async (parent: any, {  }: any, context: any, info: any) => {
  const response: any = await validateAuth(context);

  if (!response.success || !response.email) {
    throw new GQLError({ message: response.body});
  }

  const userData = await getUserFromDb(response.email);

  if(!userData){
    throw new GQLError({ message: "User does not exist!"});
  }
  return { name: userData.name };
};
