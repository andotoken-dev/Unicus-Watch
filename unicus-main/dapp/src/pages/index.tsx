import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { BiTransfer } from "react-icons/bi";
import { MdNewReleases } from "react-icons/md";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import classNames from "classnames";
import { contracts } from "@/utils/contracts";

const features = [
  {
    name: "Create an NFT of your Watch",
    icon: <MdNewReleases size={24} />,
  },
  {
    name: "Transfer your NFT to your wallet",
    icon: <BiTransfer size={24} />,
  },
  {
    name: "Store or view your NFT",
    icon: <BsFillBookmarkCheckFill size={24} />,
  },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>UnicusWatch Dapp</title>
        <meta
          name="description"
          content="Dapp for UnicusWatch, view and mint your own NFTs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="overflow-hidden pb-16 lg:pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-grow flex-row justify-center lg:justify-between ">
              {/* ;Text & buttons */}

              <div className="basis-1/8">
                <div className="md:self-center lg:max-w-lg">
                  <p className="text-white-900 mt-2 text-center text-4xl  tracking-wider sm:text-4xl lg:text-left">
                    UNICUS WATCH
                  </p>
                  <p className="text-white-500 sm:text-6l mt-2 pb-6 text-center text-2xl tracking-wide lg:text-left">
                    NFT Platform built on BSC.
                  </p>

                  <div className="m-2 p-2 lg:hidden lg:w-[16rem]">
                    <Image
                      src="/assets/NFT_boxes.png"
                      alt="Product aALSAT SDscreenshot"
                      className="w-sm max-w-[100%] rounded-xl "
                      width={2432 / 4}
                      height={1442 / 4}
                    />
                  </div>

                  <dl className="text-white-600 mt-8 mb-6 flex flex-col flex-nowrap items-center space-y-6 text-base leading-7 lg:items-start">
                    {features.map((feature) => (
                      <div
                        key={feature.name}
                        className="flex flex-row flex-nowrap items-center"
                      >
                        <div className="mx-4">{feature.icon}</div>
                        <dt className="text-white-400 text-lg">
                          {feature.name}
                        </dt>
                      </div>
                    ))}

                    {/*botones*/}
                    <div className="mt-8 flex gap-x-4 ">
                      <Link
                        href="/mint"
                        className={classNames(
                          "ctaButton ctaHover min-w-[125px] py-2 text-center text-xl font-semibold",
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        )}
                      >
                        Mint
                      </Link>
                      <Link
                        href="/view"
                        className={classNames(
                          "cta2Button cta2Hover min-w-[125px] py-2 text-center text-xl font-semibold",
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        )}
                      >
                        View
                      </Link>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="hidden lg:block lg:basis-1/2 ">
                <Image
                  src="/assets/NFT_boxes.png"
                  alt="Product screenshot"
                  className="flex-2 w-[34rem] max-w-none rounded-xl  sm:w-[36rem] md:-ml-4 lg:-ml-0"
                  width={2432}
                  height={1442}
                />
              </div>
            </div>
          </div>
          <div className="mx-auto my-12 max-w-7xl px-6 lg:px-8">
            <div>
              <p className="text-white-500 my-4 mt-2 text-center text-2xl font-light tracking-wide sm:text-3xl">
                On the mission to bring NFTs to the watch industry.
              </p>
              <p className=" text-white-500 my-4  mt-2 whitespace-pre-wrap text-center leading-8 md:leading-10 lg:whitespace-pre">
                Unique watch is an NFT platform built on Binance Smart Chain
                focusing {"\n"} highly on user experience and ease of use to
                create NFTs of their High End Watches
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center">
            <h6>
              <span className="text-white-500">Contract Address:</span>
            </h6>
            <Link
              href={`https://bscscan.com/address/${contracts.UnicusNFT.address}`}
              className="text-white-500 my-4 mt-2  overflow-x-clip text-ellipsis whitespace-pre-wrap text-center text-sm leading-8 underline md:text-base md:leading-10 lg:whitespace-pre"
              target="_blank"
            >
              {contracts.UnicusNFT.address}
            </Link>
            <Link
              className="ctaButton ctaHover min-w-[125px] py-2 px-4 text-center text-xl font-semibold"
              href={`https://bscscan.com/address/${contracts.UnicusNFT.address}`}
              target="_blank"
            >
              View on BSCScan
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
