import { useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { db, storage } from "../fBase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

export default function Shop() {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [attachment, setAttachment] = useState();
  const [doubleSubmitFlag, setDoubleSubmitFlag] = useState(true); // 중복 submit 제거
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const formik = useFormik({
    initialValues: {
      subject: "",
      content: "",
      price: "",
    },
    onSubmit: async (values) => {
      setDoubleSubmitFlag(false);
      if (doubleSubmitFlag === true) {
        if (user === null) {
          alert("로그인 후 이용해주세요.");
          return router.push("/sign-in");
        }
        const { subject, content, price } = values;
        const attachmentRef = ref(storage, `${user.uid}/${uuidv4()}`);
        const response = await uploadString(attachmentRef, attachment, "data_url");
        const attachmentUrl = await getDownloadURL(response.ref);
        try {
          await addDoc(collection(db, "product"), {
            email: user.email,
            name: user.name,
            subject,
            content,
            price,
            attachmentUrl,
            createdAt: Date.now(),
          });
          setDoubleSubmitFlag(true);
          alert("저장되었습니다.");
          router.push("/shop");
        } catch (err) {
          console.log(err);
        }
      }
    },
  });
  // const onSubmit = async (e) => {
  //     e.preventDefault();
  //     const attachmentRef = ref(storage, `${user.uid}/${uuidv4()}`);
  //     const response = await uploadString(
  //         attachmentRef,
  //         attachment,
  //         "data_url"
  //     );
  //     const attachmentUrl = await getDownloadURL(response.ref);
  //     console.log(attachmentUrl);
  // };
  return (
    <div className="bg-white">
      <form onSubmit={formik.handleSubmit}>
        <input type="file" accept="image/*" onChange={onFileChange} />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="" />
          </div>
        )}
        <label htmlFor="base-input" className="block mb-2 text-xl font-medium text-gray-900 dark:text-gray-300">
          제목
        </label>
        <input
          type="text"
          id="base-input"
          name="subject"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <label htmlFor="base-input" className="block mb-2 text-xl font-medium text-gray-900 dark:text-gray-300">
          가격
        </label>
        <input
          type="number"
          id="base-input"
          name="price"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <label htmlFor="message" className="block mb-2 text-xl font-medium text-gray-900 dark:text-gray-400">
          내용
        </label>
        <textarea
          id="message"
          rows="4"
          name="content"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          style={{ height: "350px" }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        ></textarea>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 float-right">
          글작성
        </button>
      </form>
    </div>
  );
}
