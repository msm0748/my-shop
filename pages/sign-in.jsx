import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import { auth } from "../fBase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/router";
import { RiKakaoTalkFill } from "react-icons/ri";

const validationSchema = yup.object().shape({
    email: yup
        .string()
        .email("이메일 형식이 아닙니다.")
        .required("이메일은 필수 입력 항목입니다."),
    password: yup
        .string()
        .required("비밀번호는 필수 입력 항목입니다.")
        .min(6, "비밀번호는 최소 6자리를 입력해야 합니다."),
});

export default function Login() {
    const router = useRouter();
    const [errMessage, setErrorMessage] = useState("");
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: (values) => {
            signInWithEmailAndPassword(auth, values.email, values.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    router.push("/");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setErrorMessage(errorCode);
                });
            // console.log(values.email);
        },
    });
    const onKakaoSignUpHandler = () => {
        router.push(
            "https://kauth.kakao.com/oauth/authorize?client_id=74a4303eee0b4f4a236a6e528ab42fbe&redirect_uri=http://localhost:3000/oauth/kakao&response_type=code"
        );
    };
    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            <a
                                href="#"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            ></a>
                        </p>
                    </div>
                    <form
                        className="mt-8 space-y-6"
                        onSubmit={formik.handleSubmit}
                    >
                        <input
                            type="hidden"
                            name="remember"
                            defaultValue="true"
                        />
                        <div className="-space-y-px rounded-md shadow-sm">
                            <div>
                                <label
                                    htmlFor="email-address"
                                    className="sr-only"
                                >
                                    이메일
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="이메일"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <p>{formik.errors.email}</p>
                            )}

                            <div>
                                <label htmlFor="password" className="sr-only">
                                    비밀번호
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-4 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="비밀번호"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.password &&
                                formik.errors.password && (
                                    <p>{formik.errors.password}</p>
                                )}
                        </div>
                        {errMessage && <p>{errMessage}</p>}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    기억하기
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    비밀번호 찾기
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-4 px-4 text-sm font-medium text-white hover:bg-yellow-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
                            >
                                로그인
                            </button>
                            <Link href="/sign-up">
                                <a className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-4 px-4 text-sm font-medium text-white hover:bg-yellow-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 my-3 transition-colors duration-300">
                                    회원가입
                                </a>
                            </Link>

                            <button
                                aria-label="Login with Google"
                                type="button"
                                className="flex items-center justify-center w-full py-3 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 dark:border-gray-400 focus:ring-violet-400 bg-yellow-300"
                                onClick={onKakaoSignUpHandler}
                            >
                                <RiKakaoTalkFill size={25} />
                                <p>카카오로 시작하기</p>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
