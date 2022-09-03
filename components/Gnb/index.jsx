/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BsFillCartCheckFill } from "react-icons/bs";
import { FaDoorOpen } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../../fBase";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const userInfo = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl: "/images/profile.png",
};
const navigation = [
  { name: "Shop", href: "/shop", current: false },
  { name: "Q&A", href: "/questions", current: false },
];
const userNavigation = [
  { name: "My page", href: "/myPage" },
  { name: "Sign out", href: "/sing-out" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Gnb() {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const onLogOutHandler = (e) => {
    e.preventDefault();
    signOut(auth);
    router.push("/");
  };
  console.log("렌더링");
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link href="/">
                        <a className="flex">
                          <Image className="block" src="/images/logo.png" alt="Your Company" width={45} height={45} />
                        </a>
                      </Link>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link href={item.href} key={item.name}>
                            <a
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "px-3 py-2 rounded-md text-xl font-light"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <Link href="/cart">
                        <a className="rounded-full bg-gray-800 p-1 text-white hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">View notifications</span>
                          <BsFillCartCheckFill className="h-6 w-6" aria-hidden="true" />
                        </a>
                      </Link>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          {isLoggedIn ? (
                            <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="sr-only">Open user menu</span>
                              <div className="h-8 w-8 rounded-full"></div>
                              <Image src="/images/profile.png" alt="프로필" layout="fill" objectFit="cover" />
                            </Menu.Button>
                          ) : (
                            <Link href="/log-in">
                              <a className="text-white">
                                <FaDoorOpen size={25} />
                              </a>
                            </Link>
                          )}
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  // 경고로 인한 a태그 onclick으로 이동
                                  // <Link href={item.href}>
                                  <a
                                    onClick={(e) => {
                                      e.preventDefault();
                                      router.push(item.href);
                                    }}
                                    href=""
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                  // </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button
                      className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      aria-expanded="true"
                    >
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                {({ close }) => (
                  <>
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                      {navigation.map((item) => (
                        <Link href={item.href} key={item.name}>
                          <Disclosure.Button
                            onClick={() => close()}
                            //   key={item.name}
                            as="a"
                            //   href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "block px-3 py-2 rounded-md text-base font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Disclosure.Button>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-700 pt-4 pb-3">
                      <div className="flex items-center px-5">
                        <div className="flex-shrink-0 flex">
                          <Image src={userInfo.imageUrl} alt="프로필" width={30} height={30} />
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium leading-none text-white">{userInfo.name}</div>
                          <div className="text-sm font-medium leading-none text-gray-400">{userInfo.email}</div>
                        </div>
                        <Link href="/cart">
                          <a
                            className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-white hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            onClick={() => close()}
                          >
                            <span className="sr-only">View notifications</span>
                            <BsFillCartCheckFill className="h-6 w-6" aria-hidden="true" />
                          </a>
                        </Link>
                      </div>
                      <div className="mt-3 space-y-1 px-2">
                        {userNavigation.map((item) => (
                          <Link href={item.href} key={item.name}>
                            <Disclosure.Button
                              onClick={() => close()}
                              as="a"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                            >
                              {item.name}
                            </Disclosure.Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header> */}
      </div>
    </>
  );
}
