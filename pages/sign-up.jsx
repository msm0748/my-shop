import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import { auth, db } from "../fBase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiKakaoTalkFill } from "react-icons/ri";

const validationSchema = yup.object().shape({
    name: yup.string().required("이름은 필수 입력 항목입니다."),
    email: yup
        .string()
        .email("이메일 형식이 아닙니다.")
        .required("이메일은 필수 입력 항목입니다."),
    password: yup
        .string()
        .required("비밀번호는 필수 입력 항목입니다.")
        .min(6, "비밀번호는 최소 6자리를 입력해야 합니다."),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref("password"), null], "패스워드가 일치하지 않습니다."),
    agreeCheck1: yup
        .boolean()
        .oneOf([true], "이용약관과 개인정보 수집 및 이용에 동의해주세요."),
    agreeCheck2: yup
        .boolean()
        .oneOf([true], "만 14세 미만은 가입할 수 없습니다."),
});

export default function SignUp() {
    const router = useRouter();
    const [doubleSubmitFlag, setDoubleSubmitFlag] = useState(true); // 중복 submit 제거
    const onKakaoSignUpHandler = () => {
        router.push(
            "https://kauth.kakao.com/oauth/authorize?client_id=74a4303eee0b4f4a236a6e528ab42fbe&redirect_uri=http://localhost:3000/oauth/kakao&response_type=code"
        );
    };
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            all_check: false,
            agreeCheck1: false,
            agreeCheck2: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            setDoubleSubmitFlag(false);
            if (doubleSubmitFlag === true) {
                const { name, email, password } = values;
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                } catch (err) {
                    const errCode = err.code;
                    setDoubleSubmitFlag(true);
                    alert(errCode);
                    return false;
                }
                // 아래 코드 경우의 수 체크해봐야 함
                // ex) 위 코드가 성공이고 아래코드가 실패일때
                try {
                    await addDoc(collection(db, "user"), {
                        name,
                        email,
                        createdAt: Date.now(),
                    });
                    alert("회원가입에 성공했습니다.");
                    router.push("/");
                } catch (err) {
                    setDoubleSubmitFlag(true);
                    alert(err);
                    return false;
                }
                setDoubleSubmitFlag(true);
            }
        },
    });
    const onCheckAllHandler = (e) => {
        formik.handleChange(e);
        formik.setFieldValue("agreeCheck1", e.target.checked);
        formik.setFieldValue("agreeCheck2", e.target.checked);
    };
    return (
        <div>
            <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0">
                {/* <div>
          <a href="/">
            <h3 className="text-4xl font-bold text-purple-600">Logo</h3>
          </a>
        </div> */}
                <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-lg sm:max-w-lg sm:rounded-lg">
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                이름
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-600 mt-2">
                                    {formik.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                이메일
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-600 mt-2">
                                    {formik.errors.email}
                                </p>
                            )}
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                비밀번호
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.password &&
                                formik.errors.password && (
                                    <p className="text-red-600 mt-2">
                                        {formik.errors.password}
                                    </p>
                                )}
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                비밀번호 확인
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.password_confirmation &&
                                formik.errors.password_confirmation && (
                                    <p className="text-red-600 mt-2">
                                        {formik.errors.password_confirmation}
                                    </p>
                                )}
                        </div>
                        <div className="my-4">
                            <div className="flex items-center mb-2">
                                <input
                                    id="all_check"
                                    name="all_check"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={onCheckAllHandler}
                                    onBlur={formik.handleBlur}
                                    checked={
                                        formik.values.agreeCheck1 === true &&
                                        formik.values.agreeCheck2 === true
                                    }
                                />
                                <label
                                    htmlFor="all_check"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    모두 동의합니다.
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    id="agreeCheck1"
                                    name="agreeCheck1"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    checked={formik.values.agreeCheck1}
                                />
                                <label
                                    htmlFor="agreeCheck1"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    (필수){" "}
                                    <a
                                        href="/policy"
                                        target="_blank"
                                        className="text-sky-500"
                                    >
                                        이용약관
                                    </a>
                                    과{" "}
                                    <a
                                        href="/signupPrivacy"
                                        target="_blank"
                                        className="text-sky-500"
                                    >
                                        개인정보 수집 및 이용
                                    </a>
                                    에 동의합니다.
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    id="agreeCheck2"
                                    name="agreeCheck2"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    checked={formik.values.agreeCheck2}
                                />
                                <label
                                    htmlFor="agreeCheck2"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    (필수) 만 14세 이상입니다.
                                </label>
                            </div>
                        </div>
                        {/* 한번에 두개 에러 표출이 안됨 */}
                        {formik.touched.agreeCheck1 &&
                            formik.errors.agreeCheck1 && (
                                <p className="text-red-600 mt-2">
                                    {formik.errors.agreeCheck1}
                                </p>
                            )}
                        {formik.touched.agreeCheck2 &&
                            formik.errors.agreeCheck2 && (
                                <p className="text-red-600 mt-2">
                                    {formik.errors.agreeCheck2}
                                </p>
                            )}

                        <div className="flex items-center mt-4">
                            <button
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                                type="submit"
                            >
                                회원가입
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-grey-600">
                        Already have an account?{" "}
                        <span>
                            <Link href="/sign-in">
                                <a className="text-purple-600 hover:underline">
                                    Log in
                                </a>
                            </Link>
                        </span>
                    </div>
                    <div className="flex items-center w-full my-4">
                        <hr className="w-full" />
                        <p className="px-3 ">OR</p>
                        <hr className="w-full" />
                    </div>
                    <div className="my-6 space-y-2">
                        <button
                            aria-label="Login with Google"
                            type="button"
                            className="flex items-center justify-center w-full p-2 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 dark:border-gray-400 focus:ring-violet-400 bg-yellow-300"
                            onClick={onKakaoSignUpHandler}
                        >
                            <RiKakaoTalkFill size={25} />
                            <p>카카오로 시작하기</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
