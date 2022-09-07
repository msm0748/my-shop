import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../../fBase";

export default function Kakao() {
  const router = useRouter();
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    getToken(code);
  }, []);
  const getToken = async (code) => {
    const {
      data: { access_token },
    } = await axios({
      url: `https://kauth.kakao.com/oauth/token`,
      method: "post",
      params: {
        grant_type: "authorization_code",
        client_id: "74a4303eee0b4f4a236a6e528ab42fbe",
        redirect_uri: "http://localhost:3000/oauth/kakao",
        code: code,
      },
    });
    const {
      data: { result },
    } = await axios({
      url: "/api/kakao",
      method: "post",
      data: { access_token: access_token },
      withCredentials: true,
    }).then((res) => {
      return res;
    });

    signInWithCustomToken(auth, result)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  return <div>카카오</div>;
}
