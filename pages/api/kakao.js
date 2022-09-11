import axios from "axios";
// Firebase setup
import firebaseAdmin from "firebase-admin";
// you should manually put your service-account.json in the same folder app.js
// is located at.
import serviceAccount from "./test-988dd-firebase-adminsdk-51eus-b410abd9c2.json";
import { db } from "../../fBase.js";
import { addDoc, collection } from "firebase/firestore";

// Kakao API request url to retrieve user profile based on access token
const requestMeUrl = "https://kapi.kakao.com/v2/user/me?secure_resource=true";

// Initialize FirebaseApp with service-account.json
if (!firebaseAdmin.apps.length) {
<<<<<<< HEAD
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
=======
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
    });
>>>>>>> 1c5be0c63f543e4f521b68feab6ecf75e3824d39
}

/**
 * requestMe - Returns user profile from Kakao API
 *
 * @param  {String} kakaoAccessToken Access token retrieved by Kakao Login API
 * @return {Promiise<Response>}      User profile response in a promise
 */
function requestMe(kakaoAccessToken) {
<<<<<<< HEAD
  console.log("Requesting user profile from Kakao API server.");
  return axios({
    method: "GET",
    headers: { Authorization: "Bearer " + kakaoAccessToken },
    url: requestMeUrl,
  });
=======
    console.log("Requesting user profile from Kakao API server.");
    return axios({
        method: "GET",
        headers: { Authorization: "Bearer " + kakaoAccessToken },
        url: requestMeUrl,
    });
>>>>>>> 1c5be0c63f543e4f521b68feab6ecf75e3824d39
}

/**
 * updateOrCreateUser - Update Firebase user with the give email, create if
 * none exists.
 *
 * @param  {String} userId        user id per app
 * @param  {String} email         user's email address
 * @param  {String} displayName   user
 * @param  {String} photoURL      profile photo url
 * @return {Prommise<UserRecord>} Firebase user record in a promise
 */
function updateOrCreateUser(userId, email, displayName, photoURL) {
<<<<<<< HEAD
  console.log("updating or creating a firebase user");
  const updateParams = {
    provider: "KAKAO",
    displayName: displayName,
  };
  if (displayName) {
    updateParams["displayName"] = displayName;
  } else {
    updateParams["displayName"] = email;
  }
  if (photoURL) {
    updateParams["photoURL"] = photoURL;
  }
  console.log(updateParams, "updateParams");
  return firebaseAdmin
    .auth()
    .updateUser(userId, updateParams)
    .catch(async (error) => {
      if (error.code === "auth/user-not-found") {
        updateParams["uid"] = userId;
        if (email) {
          updateParams["email"] = email;
        }
        await addDoc(collection(db, "user"), {
          name: updateParams.displayName,
          email: updateParams.email,
          photoURL: updateParams.photoURL,
          uid: updateParams.uid,
          createdAt: Date.now(),
        });
        return firebaseAdmin.auth().createUser(updateParams); // 신규 유저 생성
      }
      throw error;
    });
=======
    console.log("updating or creating a firebase user");
    const updateParams = {
        provider: "KAKAO",
        displayName: displayName,
    };
    if (displayName) {
        updateParams["displayName"] = displayName;
    } else {
        updateParams["displayName"] = email;
    }
    if (photoURL) {
        updateParams["photoURL"] = photoURL;
    }
    console.log(updateParams, "updateParams");
    return firebaseAdmin
        .auth()
        .updateUser(userId, updateParams)
        .catch(async (error) => {
            if (error.code === "auth/user-not-found") {
                updateParams["uid"] = userId;
                if (email) {
                    updateParams["email"] = email;
                }
                await addDoc(collection(db, "user"), {
                    name: updateParams.displayName,
                    email: updateParams.email,
                    photoURL: updateParams.photoURL,
                    uid: updateParams.uid,
                    createdAt: Date.now(),
                });
                return firebaseAdmin.auth().createUser(updateParams); // 신규 유저 생성
            }
            throw error;
        });
>>>>>>> 1c5be0c63f543e4f521b68feab6ecf75e3824d39
}

/**
 * createFirebaseToken - returns Firebase token using Firebase Admin SDK
 *
 * @param  {String} kakaoAccessToken access token from Kakao Login API
 * @return {Promise<String>}                  Firebase token in a promise
 */
async function createFirebaseToken(kakaoAccessToken) {
<<<<<<< HEAD
  return await requestMe(kakaoAccessToken)
    .then((response) => {
      const body = response.data;
      const userId = `kakao:${body.id}`;
      if (!userId) {
        return res.status(404).send({
          message: "There was no user with the given access token.",
        });
      }
      let nickname = null;
      let profileImage = null;
      if (body.properties) {
        nickname = body.properties.nickname;
        profileImage = body.properties.profile_image;
      }
      return updateOrCreateUser(userId, body.kakao_account.email, nickname, profileImage);
    })
    .then((userRecord) => {
      const userId = userRecord.uid;
      console.log(`creating a custom firebase token based on uid ${userId}`);
      return firebaseAdmin.auth().createCustomToken(userId, { provider: "KAKAO" });
    });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { access_token } = req.body;
    const result = await createFirebaseToken(access_token);
    return res.status(200).json({
      result,
    });
  }
=======
    return await requestMe(kakaoAccessToken)
        .then((response) => {
            const body = response.data;
            const userId = `kakao:${body.id}`;
            if (!userId) {
                return res.status(404).send({
                    message: "There was no user with the given access token.",
                });
            }
            let nickname = null;
            let profileImage = null;
            if (body.properties) {
                nickname = body.properties.nickname;
                profileImage = body.properties.profile_image;
            }
            return updateOrCreateUser(
                userId,
                body.kakao_account.email,
                nickname,
                profileImage
            );
        })
        .then((userRecord) => {
            const userId = userRecord.uid;
            console.log(
                `creating a custom firebase token based on uid ${userId}`
            );
            return firebaseAdmin
                .auth()
                .createCustomToken(userId, { provider: "KAKAO" });
        });
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { access_token } = req.body;
        const result = await createFirebaseToken(access_token);
        return res.status(200).json({
            result,
        });
    }
>>>>>>> 1c5be0c63f543e4f521b68feab6ecf75e3824d39
}
