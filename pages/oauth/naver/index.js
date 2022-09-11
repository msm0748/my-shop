import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../../fBase";
import Loading from "../../../components/Template/Loding";

export default function NaverAuth() {
  const router = useRouter();
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const code = params.get("code");
    const state = params.get("state");
    getFirebaseCustomToken(state, code);
  }, []);
  const getFirebaseCustomToken = async (state, code) => {
    try {
      const {
        data: { result },
      } = await axios({
        url: "/api/naver",
        method: "post",
        data: { state, code },
      });
      signInWithCustomToken(auth, result)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          alert(errorCode);
        });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex justify-center align-center">
      <Loading />
    </div>
  );
}
