import React from "react";
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

function Nav() {
  return (
    <nav className="bg-[#F5F7FA]">
      <div
        className="container mx-auto max-w-[1320px] relative h-auto p-2 flex flex-col
      md:flex-row md:justify-between md:items-center"
      >
        <div className="">
          <button className="text-black bg-gray-300 px-3 py-2">
            <FaBars />
          </button>
        </div>
        <div className="">
          <div
            className=" flex flex-col 
        md:flex-row md:my-5"
          >
            {itemNav.map((item: itemNavInf) => {
              return (
                <button
                  key={item.id}
                  className="px-4 py-2 mx-3 my-2 rounded-lg bg-gray-300 "
                >
                  <Link href={item.link} className="text-black">
                    {item.name}
                  </Link>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col my-t md:flex-row">
          {itemNavLogin.map((item: itemNavInf) => {
            return (
              <div className="my-2 md:mx-4" key={item.id}>
                <button className="px-4 py-2 rounded-lg bg-gray-300">
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
