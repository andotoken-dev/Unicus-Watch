import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mt-12 bg-dark pt-8">
      <nav className="flex w-full max-w-[1200px] flex-col items-center justify-between px-8 pt-4 pb-8 md:mx-auto md:flex-row">
        <div className="pb-4">
          <Link href="/">
            <Image
              src="/Logo_H.png"
              alt="Logo"
              width={602 / 3.2}
              height={173 / 3.2}
            />
          </Link>
          <p className="mt-2 hidden whitespace-pre md:block">
            Need support email us at:
            {"\n"}
            support@unicuswatch.com
          </p>
        </div>
        <div>
          <p className="text-white-900 my-1 hidden text-center text-lg font-semibold md:block md:text-left">
            Unicus Watch
          </p>
          <Link
            href="/"
            className="my-4 block text-center font-light hover:underline md:text-left"
          >
            NFT Platform
          </Link>
          <Link
            href="https://unicuswatch.com/"
            className="my-4 block text-center font-light hover:underline md:text-left"
            target={"_blank"}
          >
            Website
          </Link>

          {/* <Web3Button label="Connect" icon="hide" /> */}
        </div>
        <div>
          <p className="text-white-900 my-1 text-center text-lg font-semibold md:text-left">
            Information
          </p>
          <Link
            href="https://unicuswatch.com/privacypolicy"
            target={"_blank"}
            className="my-4 block text-center font-light hover:underline md:text-left"
          >
            Privacy
          </Link>
          <Link
            href="https://unicuswatch.com/termsandconditions"
            className="my-4 block text-center font-light hover:underline md:text-left"
            target={"_blank"}
          >
            Terms and Conditions
          </Link>

          {/* <Web3Button label="Connect" icon="hide" /> */}
        </div>
        <p className="mt-2 whitespace-pre md:hidden">
          Need support email us at:
          {"\n"}
          <a href="mailto:support@unicuswatch.com">support@unicuswatch.com</a>
        </p>
      </nav>
      <div className="pb-5 text-center text-sm text-slate-500">
        <p>2023 by Unicus Watch. All rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
