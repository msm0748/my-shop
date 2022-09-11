import axios from "axios";
import firebaseAdmin from "firebase-admin";
import serviceAccount from "./test-988dd-firebase-adminsdk-51eus-b410abd9c2.json";
import { db } from "../../fBase.js";
import { addDoc, collection } from "firebase/firestore";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
}

const getAccessToken = async (state, code) => {
  try {
    const {
      data: { access_token },
    } = await axios({
      url: "https://nid.naver.com/oauth2.0/token",
      method: "get",
      params: {
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
        code: code,
        state: state,
      },
    });
    return access_token;
  } catch (e) {
    console.log(e);
  }
};

const getUserInfo = (access_token) => {
  return axios.get("https://openapi.naver.com/v1/nid/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

async function updateOrCreateUser(userId, email, displayName, photoURL) {
  console.log("updating or creating a firebase user");
  const updateParams = {
    provider: "NAVER",
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
}

async function createFirebaseToken(access_token) {
  return await getUserInfo(access_token)
    .then((response) => {
      const body = response.data.response;
      const userId = `naver:${body.id}`;
      if (!userId) {
        return res.status(404).send({
          message: "There was no user with the given access token.",
        });
      }
      return updateOrCreateUser(userId, body.email, body.name, body.profile_image);
    })
    .then((userRecord) => {
      const userId = userRecord.uid;
      console.log(`creating a custom firebase token based on uid ${userId}`);
      return firebaseAdmin.auth().createCustomToken(userId, { provider: "NAVER" });
    });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { state, code } = req.body;
    const access_token = await getAccessToken(state, code);
    const result = await createFirebaseToken(access_token);

    return res.status(200).json({
      result,
    });
  }
}
