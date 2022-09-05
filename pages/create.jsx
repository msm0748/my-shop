import { addDoc, collection } from "firebase/firestore";
import { db } from "../fBase.js";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  category: yup.string().required("분류를 선택해 주세요."),
  subject: yup.string().required("제목을 입력해주세요."),
  content: yup.string().required("내용을 입력해주세요."),
});

export default function Create() {
  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  const formik = useFormik({
    initialValues: {
      category: "",
      subject: "",
      content: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (user === null) {
        alert("로그인 후 이용해주세요.");
        return router.push("/sign-in");
      }
      const { category, subject, content } = values;
      console.log(values);
      try {
        await addDoc(collection(db, "review"), {
          email: user.email,
          name: user.name,
          category,
          subject,
          content,
          createdAt: Date.now(),
        });
        alert("저장되었습니다.");
        router.push("/questions");
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex mb-6 items-end justify-between">
        <div style={{ width: "25%" }}>
          <label htmlFor="countries" className="block mb-2 text-xl font-medium text-gray-900 dark:text-gray-400">
            카테고리
          </label>
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="category"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option defaultValue value="">
              선택하세요
            </option>
            <option value="상품">상품</option>
            <option value="주문 / 결제">주문 / 결제</option>
            <option value="배송">배송</option>
            <option value="반품 / 교환">반품 / 교환</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div style={{ width: "70%" }}>
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
        </div>
      </div>
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
  );
}
