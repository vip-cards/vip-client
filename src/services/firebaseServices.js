import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { t } from "i18next";
import toastPopup from "../helpers/toastPopup";
import store from "../store";
import clientServices from "./clientServices";
import jwt_decode from "jwt-decode";
import { authActions } from "../store/auth-slice";
import { useNavigate } from "react-router";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API,
  authDomain: process.env.REACT_APP_AUTH,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGE,
  messagingSenderId: process.env.REACT_APP_MESSAGING,
  appId: process.env.REACT_APP_APPID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const Gprovider = new GoogleAuthProvider();
export const FBprovider = new FacebookAuthProvider();
export const Twtrprovider = new TwitterAuthProvider();
export const auth = getAuth(app);

const socialLoginProviders = {
  facebook: {
    app: FBprovider,
    class: FacebookAuthProvider,
  },
  google: {
    app: Gprovider,
    class: GoogleAuthProvider,
  },
  twitter: {
    app: Twtrprovider,
    class: TwitterAuthProvider,
  },
};

export const useSocialLogin = () => {
  if (localStorage.getItem("i18nextLng") === "en") {
    auth.languageCode = "ar";
  } else {
    auth.languageCode = "en";
  }

  const navigate = useNavigate();
  return (platform) => {
    if (!Object.keys(socialLoginProviders).includes(platform)) {
      throw Error(platform + " is not existed in the available platforms");
    }
    signInWithPopup(auth, socialLoginProviders[platform].app)
      .then((result) => {
        const credential =
          socialLoginProviders[platform].class.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        return user;
      })
      .then(async (user) => {
        const { data } =
          platform === "twitter"
            ? await clientServices.loginByTwitter({
                userName: user.displayName,
              })
            : await clientServices.loginBy({
                name: { en: user.displayName },
                email: user.email,
                googleId: user.uid,
                image: user.photoURL,
              });
        return data;
      })
      .then((data) => {
        if (data.success && data.code === 200) {
          toastPopup.success(t("Success"));
          const tokenDecoded = jwt_decode(data.token);

          store.dispatch(
            authActions.login({
              token: data.token,
              userId: tokenDecoded._id,
              userRole: tokenDecoded.role,
              userData: data.record,
            })
          );
          navigate("/");
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        if (errorCode === "auth/account-exists-with-different-credential")
          toastPopup.error("You have logged In with different provider");
      });
  };
};
