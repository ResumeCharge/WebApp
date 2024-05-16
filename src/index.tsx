import React from "react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/roboto";
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  User,
} from "firebase/auth";
import { createRoot } from "react-dom/client";
import { store } from "./store/store";
import { setUser } from "./store/reducers/userSlice";
import {
  getUser,
  IDbUser,
  updateUser,
} from "./microservices/user-service/userService.api";

const firebaseConfig = {
  apiKey: "AIzaSyAPRJ7ZwygOhb9qas0cWmsKO_3FTM45xwI",
  authDomain: "resumecharge.firebaseapp.com",
  projectId: "resumecharge",
  storageBucket: "resumecharge.appspot.com",
  messagingSenderId: "599337269164",
  appId: "1:599337269164:web:f9fd7421e9b2e944b6ac09",
  measurementId: "G-LQPD1W8G8R",
};

const container = document.getElementById("root");
const root = createRoot(container!);

async function initializeFirestore() {
  /*We wrap the firebase logic in a try/catch to allow the site to load even
   * if we cannot access firebase. In that case, the user will not be able to
   * login but will still be able to browse the site */
  try {
    initializeApp(firebaseConfig);
    const auth = getAuth();
    auth.languageCode = "it";
    await setPersistence(auth, browserLocalPersistence);
    if (auth.currentUser) {
      await setUserAttributesInRedux(auth.currentUser);
    }
    /*We have to wait for the auth state to change before we render to
     * ensure that the current auth state is loaded properly. Skipping
     * this step will cause the GuardedRoute component to stop working,
     * as it executes before the auth state has a chance to be set. */
    auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        setUserAttributesInRedux(user);
      } else {
        store.dispatch(setUser({}));
      }
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    });
  } catch (error) {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

async function setUserAttributesInRedux(user: User) {
  const dbUser = await loadUserFromDatabase(user);

  store.dispatch(setUser(dbUser));
}

/**
 * Reconcile differences between the firebase records and our db record.
 * Firebase record is considered the source of truth.
 * **/
async function reconcileUserRecord(dbUser: IDbUser, firebaseUser: User) {
  if (dbUser.isEmailVerified !== firebaseUser.emailVerified) {
    dbUser.isEmailVerified = firebaseUser.emailVerified;
    await updateUser({ isEmailVerified: true });
  }
}

async function loadUserFromDatabase(firebaseUser: User) {
  const dbUser = await getUser();
  if (dbUser != null) {
    await reconcileUserRecord(dbUser, firebaseUser);
    store.dispatch(setUser({ ...dbUser, isSignedIn: true }));
  } else {
    store.dispatch(setUser({ isSignedIn: false }));
  }
}

initializeFirestore().then(() => {});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
