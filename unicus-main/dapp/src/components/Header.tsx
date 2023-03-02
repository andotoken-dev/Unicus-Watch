import { Web3Button } from "@web3modal/react";
import Link from "next/link";
import Image from "next/image";
import { TiSocialFacebook, TiSocialTwitter } from "react-icons/ti";
import { GrInstagram } from "react-icons/gr";
import { RiMessengerFill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import classNames from "classnames";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="flex w-full flex-row items-center justify-between px-8 pt-4 pb-8">
      <nav className="flex flex-grow flex-row items-center justify-between gap-x-4">
        <Link href="/">
          <Image
            src="/Logo_H.png"
            alt="Logo"
            width={602 / 2.5}
            height={173 / 2.5}
          />
        </Link>
        <div className="hidden flex-row items-center gap-x-4 md:flex">
          <Link
            href="/"
            className="w-12 text-center text-lg font-light hover:underline lg:w-20"
          >
            Home
          </Link>
          <Link
            href="/mint"
            className="w-20 text-center text-lg font-light hover:underline"
          >
            Mint
          </Link>
          <Link
            href="https://unicuswatch.com/"
            className="w-18 text-center text-lg font-light hover:underline lg:w-20"
            target={"_blank"}
          >
            Project
          </Link>
          <Link
            className="rounded-full border-[3px] p-[2px]"
            href="https://fb.com/unicuswatch"
            target={"_blank"}
          >
            <TiSocialFacebook className="text-2xl" />
          </Link>
          <Link
            className="rounded-full border-[3px] p-[2px]"
            href="https://twitter.com/unicuswatch"
            target={"_blank"}
          >
            <TiSocialTwitter className="text-2xl" />
          </Link>
          <Link
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] p-[2px]"
            href="https://instagram.com/unicuswatch"
            target={"_blank"}
          >
            <GrInstagram className="text-lg" />
          </Link>
          <Link
            className={classNames(
              "flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] p-[2px]",
              " cursor-default border-gray-500 text-gray-500"
            )}
            href="https://telegram.com"
            target={"_blank"}
            onClick={(e) => e.preventDefault()}
          >
            <FaTelegramPlane className="text-xl" />
          </Link>
          <Web3Button label="Connect" icon="hide" />
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)}>
            <HiMenuAlt2 className="text-4xl" />
          </button>
        </div>
        <nav
          className={classNames(
            isOpen ? "right-0" : "-right-full",
            "fixed top-0  z-50 flex h-screen w-full flex-col items-center overflow-y-auto bg-dark pt-6 transition-all duration-300 ease-in-out"
          )}
        >
          <Image
            src="/Logo_H.png"
            alt="Logo"
            width={602 / 2.5}
            height={173 / 2.5}
          />
          <Link
            className="mt-4 w-full py-4 text-center hover:bg-light"
            href="/"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            className="w-full py-4 text-center hover:bg-light"
            href="/mint"
            onClick={() => setIsOpen(false)}
          >
            Mint
          </Link>
          <Link
            className="w-full py-4 text-center hover:bg-light"
            href="https://unicuswatch.com/"
            target="_blank"
            onClick={() => setIsOpen(false)}
          >
            Project
          </Link>
          <div className="flex flex-row gap-x-4 pt-4 pb-6">
            <Link
              className="rounded-full border-[3px] p-[2px]"
              href="https://fb.com/unicuswatch/"
              target={"_blank"}
            >
              <TiSocialFacebook className="text-2xl" />
            </Link>
            <Link
              className="rounded-full border-[3px] p-[2px]"
              href="https://twitter.com/unicuswatch"
              target={"_blank"}
            >
              <TiSocialTwitter className="text-2xl" />
            </Link>
            <Link
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] p-[2px]"
              href="https://instagram.com/unicuswatch"
              target={"_blank"}
            >
              <GrInstagram className="text-lg" />
            </Link>
            <Link
              className={classNames(
                "flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] p-[2px]",
                " cursor-default border-gray-500 text-gray-500"
              )}
              href="https://telegram.com"
              target={"_blank"}
              onClick={(e) => e.preventDefault()}
            >
              <FaTelegramPlane className="text-xl" />
            </Link>
          </div>
          <Web3Button label="Connect" icon="hide" />
          <button
            className="mt-4 w-full py-4 text-center hover:bg-light"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </nav>
      </nav>
    </header>
  );
};

export default Header;
