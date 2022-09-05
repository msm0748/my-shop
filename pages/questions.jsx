import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { db } from "../fBase";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { DateTime } from "luxon";

export default function Questions() {
  const router = useRouter();
  const [list, setList] = useState([]);
  const user = useSelector((state) => state.user.user);
  // const [isLoggedIn, setIsLoggedIn]
  useEffect(() => {
    onSnapshot(query(collection(db, "review"), orderBy("createdAt", "desc")), (results) => {
      const newList = [];
      results.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        newList.push(data);
      });
      setList(newList);
    });
  }, []);
  const onCreateHandler = (e) => {
    if (user === null) {
      e.preventDefault();
      alert("로그인 후 이용해주세요.");
      router.push("/sign-in");
    }
  };
  return (
    <>
      <div className="flex justify-between">
        <div className="relative md:w-1/3 mb-6">
          <form>
            <input
              type="search"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:shadow-outline text-gray-600 font-medium"
              placeholder="Search..."
            />
            <div className="absolute top-0 left-0 inline-flex items-center p-2">
              {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-gray-400"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect
                                x="0"
                                y="0"
                                width="24"
                                height="24"
                                stroke="none"
                            ></rect>
                            <circle cx="10" cy="10" r="7"></circle>
                            <line x1="21" y1="21" x2="15" y2="15"></line>
                        </svg> */}
            </div>
          </form>
        </div>
        <span className="sm:block">
          <Link href="/create">
            <a
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onCreateHandler}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                x-description="Heroicon name: mini/pencil"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"></path>
              </svg>
              글쓰기
            </a>
          </Link>
          {/* <button type="button"></button> */}
        </span>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative mb-7">
        <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
          <colgroup>
            <col />
            <col />
            <col style={{ width: "50%" }} />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr className="text-left">
              <th className="bg-indigo-100 sticky top-0 border-b border-indigo-200 px-6 py-4 text-gray-700 font-bold tracking-wider text-xs">
                No.
              </th>
              <th className="bg-indigo-100 sticky top-0 border-b border-indigo-200 px-6 py-4 text-gray-700 font-bold tracking-wider text-xs">
                Category
              </th>
              <th className="bg-indigo-100 sticky top-0 border-b border-indigo-200 px-6 py-4 text-gray-700 font-bold tracking-wider text-xs">
                Subject
              </th>
              <th className="bg-indigo-100 sticky top-0 border-b border-indigo-200 px-6 py-4 text-gray-700 font-bold tracking-wider text-xs">
                Writer
              </th>
              <th className="bg-indigo-100 sticky top-0 border-b border-indigo-200 px-6 py-4 text-gray-700 font-bold tracking-wider text-xs">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.id}>
                <td className="border-dashed border-t border-gray-300">
                  <span className="text-gray-700 px-6 py-3 flex items-center">{index}</span>
                </td>
                <td className="border-dashed border-t border-gray-300">
                  <span className="text-gray-700 px-6 py-3 flex items-center">{item.category}</span>
                </td>
                <td className="border-dashed border-t border-gray-300">
                  <span className="text-gray-700 px-6 py-3 flex items-center">
                    <Link href={`/questions/${item.id}`}>
                      <a>{item.subject}</a>
                    </Link>
                  </span>
                </td>
                <td className="border-dashed border-t border-gray-300">
                  <span className="text-gray-700 px-6 py-3 flex items-center">
                    {item.name.replace(/(?<=.{1})./gi, "*")}
                  </span>
                </td>
                <td className="border-dashed border-t border-gray-300">
                  <span className="text-gray-700 px-6 py-3 flex items-center">
                    {DateTime.fromMillis(item.createdAt).toFormat("yyyy-LL-dd HH:mm:ss")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <a
            href="#"
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </a>
          <a
            href="#"
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </a>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
              <span className="font-medium">97</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a
                href="#"
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
              <a
                href="#"
                aria-current="page"
                className="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
              >
                1
              </a>
              <a
                href="#"
                className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              >
                2
              </a>
              <a
                href="#"
                className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex"
              >
                3
              </a>
              <a
                href="#"
                className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex"
              >
                4
              </a>
              <a
                href="#"
                className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              >
                5
              </a>
              <a
                href="#"
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
