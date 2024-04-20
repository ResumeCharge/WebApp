import firebase, {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  resetUser,
  setIsUserSignedIn,
  setUser,
} from "../../store/reducers/userSlice";
import { store } from "../../store/store";
import {
  getUser,
  saveUser,
} from "../../microservices/user-service/userService.api";
import { User } from "../../microservices/user-service/userService.interface";

/*<--- SIGN IN --->*/
export const signInWithUserEmailAndPassword = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const databaseUser = await getUser();
    if (!databaseUser) {
      await saveUserToDb(user);
      /*set the user as signed in even the save to db fails*/
      handleSignInSuccess(databaseUser);
    } else {
      store.dispatch(setUser({ ...databaseUser, isSignedIn: true }));
    }
    return true;
  } catch (err) {}
  store.dispatch(resetUser());
  return false;
};

export const signInUserWithGoogle = async () => {
  const googleAuthProvider = new GoogleAuthProvider();
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const user = result.user;
    //check if this is the first time the user signed in with google
    const databaseUser = await getUser();
    if (!databaseUser) {
      await saveUserToDb(user);
      /*set the user as signed in even the save to db fails*/
      handleSignInSuccess(databaseUser);
    }
    store.dispatch(setIsUserSignedIn(true));
    return true;
  } catch (err) {}
  store.dispatch(resetUser());
  return false;
};

const handleSignInSuccess = (user: User | null) => {
  const updatedUser = {
    ...user,
    isSignedIn: true,
  };
  store.dispatch(setUser({ user: updatedUser }));
};

/*<--- SIGN UP --->*/
interface ISignUpResponse {
  successful: boolean;
  errorMessage?: unknown;
}

export const signUp = async (
  email: string,
  password: string
): Promise<ISignUpResponse> => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    /*If we can't save the user to the db, delete the user from firebase to
     * allow the user to retry creating the user*/
    try {
      await saveUser();
      store.dispatch(
        setUser({
          isSignedIn: true,
          userId: user.uid,
          createdAt: user.metadata.creationTime,
          lastLoginAt: user.metadata.lastSignInTime,
          email,
        })
      );
      return { successful: true };
    } catch (err) {
      await deleteFirebaseUser(user);
      return {
        successful: false,
        errorMessage:
          "There was a problem creating your account. Please try again later.",
      };
    }
  } catch (err) {
    return { successful: false, errorMessage: err };
  }
};

const deleteFirebaseUser = async (user: firebase.User) => {
  deleteUser(user)
    .then(() => {})
    .catch((error) => {
      alert(
        "There was a problem creating your account. Please contact support if the issue persists."
      );
    });
};

export const saveUserToDb = async (user: firebase.User) => {
  if (!user.email) throw new Error("Cannot save user, no email found");
  await saveUser();
};

/*<--- SIGN OUT --->*/
export const signOut = async () => {
  const auth = getAuth();
  await auth.signOut();
};
