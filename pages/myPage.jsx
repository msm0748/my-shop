import { useRouter } from "next/router";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { db } from "../fBase";
import { doc, updateDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "../store/userSlice";

export default function MyPage() {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
      // password,
      phone: "",
      address: "",
      detailAddress: "",
    },
    onSubmit: (values) => {
      const { name, phone, address, detailAddress } = values;
      updateDoc(doc(db, "user", user.docId), {
        name,
        phone,
        address,
        detailAddress,
        createdAt: Date.now(),
      })
        .then(() => {
          dispatch(
            getUserInfo({
              ...user,
              name,
              phone,
              address,
              detailAddress,
            })
          );
          alert("개인 정보 수정이 완료되었습니다.");
          router.push("/");
        })
        .catch((err) => console.log(err));
    },
  });
  useEffect(() => {
    if (user) {
      formik.setFieldValue("name", user.name ? user.name : "");
      formik.setFieldValue("phone", user.phone ? user.phone : "");
      formik.setFieldValue("address", user.address ? user.address : "");
      formik.setFieldValue("detailAddress", user.detailAddress ? user.detailAddress : "");
    }
  }, [user]);

  return (
    <div>
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0">
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-lg sm:max-w-lg sm:rounded-lg">
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 undefined">
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
                  value={formik.values.name}
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 undefined">
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
            </div>
            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 undefined">
                휴대폰번호
              </label>
              <div className="flex flex-col items-start">
                <input
                  id="phone"
                  type="number"
                  name="phone"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 undefined">
                집주소
              </label>
              <div className="flex flex-col items-start">
                <input
                  id="address"
                  type="text"
                  name="address"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-700 undefined">
                상세주소
              </label>
              <div className="flex flex-col items-start">
                <input
                  id="detailAddress"
                  type="text"
                  name="detailAddress"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.detailAddress}
                />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <button
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                type="submit"
              >
                변경 사항 저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
