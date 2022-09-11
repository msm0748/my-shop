<<<<<<< HEAD
import { useEffect, useCallback } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> 1c5be0c63f543e4f521b68feab6ecf75e3824d39
import axios from "axios";
import { useRouter } from "next/router";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../../fBase";
import Loading from "../../../components/Template/Loding";

<<<<<<< HEAD
export default function KakaoAuth() {
  const router = useRouter();
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    getToken(code);
  }, []);
  const getToken = async (code) => {
    try {
      const {
        data: { access_token }, // 구조 분해 할당을 통해 access_token 값만 추출
      } = await axios({
        url: "https://kauth.kakao.com/oauth/token",
        method: "post",
        params: {
          grant_type: "authorization_code",
          client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
          redirect_uri: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/oauth/kakao`,
          code: code,
        },
      });
      getFirebaseCustomToken(access_token);
    } catch (err) {
      console.log(err);
    }
  };

  const getFirebaseCustomToken = async (access_token) => {
    try {
      const {
        data: { result },
      } = await axios({
        url: "/api/kakao",
        method: "post",
        data: { access_token: access_token },
      });
      signInWithCustomToken(auth, result)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          alert(errorCode);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex justify-center align-center">
      <Loading />
    </div>
  );
=======
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
                redirect_uri: "https://my-shop-brown.vercel.app/oauth/kakao",
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
        });

        signInWithCustomToken(auth, result)
            .then(() => {
                router.push("/");
            })
            .catch((error) => {
                const errorCode = error.code;
                alert(errorCode);
            });
    };
>>>>>>> 1c5be0c63f543e4f521b68feab6ecf75e3824d39
}
