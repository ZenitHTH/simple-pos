"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";

interface itemNavInf {
  id: number;
  link: string;
  name: string;
}
const itemNav: itemNavInf[] = [
  {
    id: 0,
    link: "/",
    name: "home",
  },
  {
    id: 1,
    link: "/about",
    name: "about",
  },
  {
    id: 2,
    link: "/setting",
    name: "setting",
  },
  {
    id: 3,
    link: "/manage",
    name: "manage",
  },
  {
    id: 4,
    link: "/table",
    name: "table",
  },
];

const itemNavLogin: itemNavInf[] = [
  {
    id: 0,
    link: "/login",
    name: "Login",
  },
  {
    id: 1,
    link: "register",
    name: "Register",
  },
];

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

function Nav() {
  const [toggle, setToggle] = useState(false);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const updateToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    updateToggle();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <nav className="bg-[#F5F7FA]">
      <div
        className="container mx-auto max-w-[1320px] relative h-auto p-2 flex flex-col
      md:flex-row md:justify-between md:items-center "
      >
        <div className="text-xl text-black py-2 px-2">
          {windowSize.innerWidth}
        </div>
        <div className="md:hidden absolute right-5">
          <button className="text-black bg-gray-300 px-3 py-2">
            <FaBars onClick={updateToggle} className="text-xl" />
          </button>
        </div>
        <div
          className={`${toggle! && windowSize.innerWidth < 768 ? "hidden" : "flex"} flex-col md:flex-row`}
        >
          {itemNav.map((item: itemNavInf) => {
            return (
              <div className="my-2 md:mx-4" key={item.id}>
                <button className="px-4 py-2 rounded-lg ">
                  <Link href={item.link} className="text-black text-center">
                    {item.name}
                  </Link>
                </button>
              </div>
            );
          })}
        </div>
        <div
          className={`${toggle! && windowSize.innerWidth < 768 ? "hidden" : "flex"} flex-col md:flex-row`}
        >
          {itemNavLogin.map((item: itemNavInf) => {
            return (
              <div className="my-2 md:mx-4" key={item.id}>
                <button className="px-4 py-2">
                  <Link href={item.link} className="text-black">
                    {item.name}
                  </Link>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
