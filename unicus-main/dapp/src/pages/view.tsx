import Layout from "@/components/Layout";
import { contracts } from "@/utils/contracts";
import { BigNumber } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";

type MetaDataType = {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
};

const DetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [manualId, setManualId] = useState<null | number>(() => {
    if (id) return parseInt(id as string);
    else return null;
  });

  const [showImgReload, setShowImgReload] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const { data, isFetching } = useContractReads({
    contracts: [
      {
        address: contracts.UnicusNFT.address,
        abi: contracts.UnicusNFT.abi,
        functionName: "tokenURI",
        args: manualId
          ? [BigNumber.from(manualId.toString())]
          : id
          ? [BigNumber.from(id as string)]
          : undefined,
      },
      {
        address: contracts.UnicusNFT.address,
        abi: contracts.UnicusNFT.abi,
        functionName: "ownerOf",
        args: manualId
          ? [BigNumber.from(manualId.toString())]
          : id
          ? [BigNumber.from(id as string)]
          : undefined,
      },
      {
        address: contracts.UnicusNFT.address,
        abi: contracts.UnicusNFT.abi,
        functionName: "mintOwner",
        args: manualId
          ? [BigNumber.from(manualId.toString())]
          : id
          ? [BigNumber.from(id as string)]
          : undefined,
      },
    ],
  });

  const { config, error: configError } = usePrepareContractWrite({
    address: contracts.UnicusNFT.address,
    abi: contracts.UnicusNFT.abi,
    functionName: "claimMintedToken",
    args: manualId
      ? [BigNumber.from(manualId.toString())]
      : id
      ? [BigNumber.from(id as string)]
      : undefined,
    signer: signer,
  });

  const { write, isSuccess } = useContractWrite(config);
  const [placeHolderImg, setPlaceholderImg] = useState<string | null>(null);

  const [nftData, setNftData] = useState<MetaDataType | null>(null);

  const getNFTMeta = async (ipfsUrl: string) => {
    if (!ipfsUrl) return;
    const urlToFetch = ipfsUrl.replace(
      "ipfs://",
      "https://nftstorage.link/ipfs/"
    );
    const response = await fetch(urlToFetch).then(
      (res) => res.json() as Promise<MetaDataType>
    );
    setNftData(response);
  };

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("effect data", data);
    if (!data) return;
    void getNFTMeta(data[0]);
  }, [data]);

  useEffect(() => {
    if (!id || !window) return;
    const storageImg = window.localStorage.getItem(`nft_img`);
    if (!storageImg) return;
    const nftImg = JSON.parse(storageImg) as { id: string; image: string };
    if (nftImg.id === id.toString()) {
      setPlaceholderImg(nftImg.image);
    }
  }, [id]);

  return (
    <Layout>
      <h1 className="text-center text-3xl font-light tracking-wide">
        Unicus Watch Minting Platform
      </h1>
      <h2 className="pt-8 pb-8 text-center text-2xl font-light tracking-wide">
        {id ? "Take a look at your New NFT" : "Search for your NFT"}
      </h2>
      {!id && (
        <div className="flex flex-col items-center justify-center pb-8">
          <div
            className={
              "flex w-[250px] flex-row items-center rounded-[18px] bg-gray-600 pl-2 focus-within:ring-2 focus-within:ring-blue-500"
            }
            onClick={() => searchRef.current?.select()}
          >
            <input
              type="number"
              step={1}
              className="w-full bg-transparent pr-2 text-center outline-none"
              onChange={(e) => {
                const val = e.target.valueAsNumber;
                if (!searchRef.current) return;
                if (!val || isNaN(val)) searchRef.current.value = "";
              }}
              ref={searchRef}
            />
            <button
              suppressHydrationWarning
              className="cta2Button flex w-[125px] flex-row items-center justify-center px-2 py-3"
              onClick={(e) => {
                e.stopPropagation();
                if (!searchRef.current) return;
                const val = searchRef.current.valueAsNumber;
                if (!val || isNaN(val)) return;
                setManualId(val);
              }}
              disabled={isFetching}
            >
              {isFetching ? (
                <Image src="/puff.svg" height={24} width={24} alt="loading" />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
      )}
      {/* Card Container*/}
      <div className="flex flex-row flex-wrap items-center justify-center">
        {/* Card */}
        <div className="px- flex min-h-[400px] w-[80%] max-w-[400px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-dark shadow-xl">
          {nftData?.image && !showImgReload && (
            <>
              <img
                src={nftData?.image.replace(
                  "ipfs://",
                  "https://nftstorage.link/ipfs/"
                )}
                alt={nftData?.name}
                className="h-full w-full object-cover"
                onError={() => setShowImgReload(true)}
                onLoad={() => setImgLoading(false)}
              />
              {imgLoading && (
                <Image src="/puff.svg" height={50} width={50} alt="loader" />
              )}
            </>
          )}
          {showImgReload &&
            (placeHolderImg ? (
              <img
                src={placeHolderImg}
                alt={nftData?.name}
                className="h-full w-full object-cover"
                onError={() => setPlaceholderImg(null)}
              />
            ) : (
              <div className="flex flex-col">
                <span>Image not ready yet</span>
                <button
                  onClick={() => setShowImgReload(false)}
                  className=" ctaButton mt-2 py-2 px-4 hover:text-black"
                >
                  Try again
                </button>
              </div>
            ))}
        </div>
        <div className="m-6 flex max-w-[400px] flex-col flex-nowrap justify-start p-6">
          <p className="text-white-900 pb-2 text-xl font-bold tracking-tight sm:text-3xl">
            {nftData?.name || "Search for your NFT"}
          </p>
          {data?.[0] && data?.[1] ? (
            <>
              {!configError && write && !isSuccess && data?.[2] === address ? (
                <button
                  className="cta2Button mt-4 py-2"
                  onClick={() => write()}
                >
                  Transfer to Wallet
                </button>
              ) : null}
              {/*  */}
              <p className="text-white-900 mt-3 pt-3 text-xl font-bold tracking-wider sm:text-2xl">
                Creator: Unicus Watch
              </p>
              <p className=" overflow-x-clip text-ellipsis text-base">
                Owner address: {data?.[1]}
              </p>
              {/*  */}
              <p className="text-white-900 mt-3 mb-1 pt-3 text-xl font-bold tracking-wide sm:text-2xl">
                Attributes
              </p>
              {nftData?.attributes.map((attr, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between px-4 py-2 hover:bg-black/25"
                >
                  <p className="pr-2">
                    <strong>{attr.trait_type}:</strong>
                  </p>
                  <p className="pl-4 text-justify">{attr.value}</p>
                </div>
              ))}
            </>
          ) : null}
        </div>
        <div className="flex w-full flex-col items-center justify-center pt-6">
          <h6>
            <span className="text-white-500">Contract Address:</span>
          </h6>
          <Link
            href={`https://bscscan.com/address/${contracts.UnicusNFT.address}`}
            className="text-white-500 my-4  mt-2 overflow-x-clip text-ellipsis whitespace-pre-wrap text-center text-sm leading-8 underline md:text-base md:leading-10 lg:whitespace-pre"
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
  );
};

export default DetailsPage;
