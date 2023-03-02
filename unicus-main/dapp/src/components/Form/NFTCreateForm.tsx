// React
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
// Web3
import {
  useAccount,
  useContract,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
  useWaitForTransaction,
} from "wagmi";
// Data & API
import { contracts } from "@/utils/contracts";
import { api } from "@/utils/api";
// Styling and third party libraries
import classNames from "classnames";
import { useForm, type SubmitHandler } from "react-hook-form";
import { BigNumber } from "ethers";
import { formatEther } from "@ethersproject/units";

type FormValues = {
  image: FileList | null;
  name: string;
  serial: string;
  model: string;
  year: number;
  case: string;
  extras: string;
};

const baseContract = {
  address: contracts.UnicusNFT.address,
  abi: contracts.UnicusNFT.abi,
};

const NFTCreateForm = () => {
  const router = useRouter();
  const [isDragged, setIsDragged] = useState(false);
  const [hadError, setHadError] = useState(false);
  // Contract Connection
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const contract = useContract({
    address: contracts.UnicusNFT.address,
    abi: contracts.UnicusNFT.abi,
    signerOrProvider: signer,
  });

  // upload IMG to IPFS
  const {
    mutate: createNFT,
    data,
    isLoading,
  } = api.nft.createNFTData.useMutation();

  const { data: contractData } = useContractReads({
    contracts: [
      {
        ...baseContract,
        functionName: "totalSupply",
      },
      {
        ...baseContract,
        functionName: "creators",
        args: address ? [address] : undefined,
      },
      {
        ...baseContract,
        functionName: "publicFee",
      },
    ],
  });

  const { config, error: configError } = usePrepareContractWrite({
    address: contracts.UnicusNFT.address,
    abi: contracts.UnicusNFT.abi,
    functionName: "mint",
    args: typeof data == "string" ? [data] : undefined,
    overrides: {
      from: address,
      value: contractData?.[1] ? 0 : contractData?.[2],
    },
    enabled: !!data,
  });
  const {
    write,
    isLoading: writeLoading,
    isSuccess,
    data: writeSendData,
  } = useContractWrite(config);

  const { data: receiptData, isLoading: receiptLoading } =
    useWaitForTransaction({
      hash: writeSendData?.hash,
      onSuccess: (data) => {
        const transferId = data.logs[0]?.topics[3];
        if (!transferId) return;
        const id = BigNumber.from(transferId).toNumber();
        void router.push(`/view?id=${id}`);
      },
    });

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      image: null,
      name: "",
      serial: "",
      model: "",
      year: new Date().getFullYear(),
      case: "",
      extras: "",
    },
  });

  useEffect(() => {
    if (
      configError &&
      (configError as unknown as { code: string }).code !== "MISSING_ARGUMENT"
    )
      setHadError(true);
  }, [configError]);

  const submit: SubmitHandler<FormValues> = (data) => {
    if (!data.image || data.image.length !== 1 || !contract) return;
    const baseImg = data.image[0];
    if (!baseImg) return;
    const reader = new FileReader();
    reader.readAsDataURL(baseImg);
    reader.onload = () => {
      const base64 = reader.result?.toString();
      if (!base64) return;
      window.localStorage.setItem(
        "nft_img",
        JSON.stringify({
          image: base64,
          id: contractData?.[0]?.add(1).toString(),
        })
      );
      createNFT({
        file: base64,
        obj: {
          name: data.name,
          serial: data.serial,
          model: data.model,
          year: data.year,
          case: data.case,
          extras: data.extras,
          fileType: baseImg.type,
          fileName: baseImg.name,
        },
      });
    };
  };

  const imageFile = watch("image");

  register("image", {
    required: true,
    validate: {
      lessThan15MB: (fileList) => {
        if (!fileList || fileList.length !== 1) return false;
        return (
          (fileList[0]?.size || 1000000000) / 1024 / 1024 < 10 ||
          "File size must be less than 15MB"
        );
      },
      imageFormat: (fileList) => {
        if (!fileList || fileList.length !== 1) return false;
        // validate that image format is any image format using regex
        return (
          /^image\/(jpeg|png|gif|bmp|svg\+xml)$/i.test(
            fileList[0]?.type || ""
          ) || "File must be an image"
        );
      },
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="flex w-full flex-col items-center gap-y-4"
      onSubmit={handleSubmit(submit)}
    >
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full flex-col pb-2">
          <label htmlFor="serial" className="pb-1 text-center capitalize">
            Name<span className="text-red-500">&nbsp;*</span>
          </label>
          <input
            type="text"
            {...register("name", {
              required: true,
              minLength: {
                value: 5,
                message: "Minimum of 5 Characters required",
              },
            })}
            className="w-full rounded-[18px] bg-gray-600 py-2 text-center"
          />
          {errors?.name && (
            <p className="pt-1 text-center text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="flex w-[80%] flex-row items-center justify-center gap-x-3 tracking-wide">
          <div>ID to MINT:</div>
          <div
            className="animate-pulse text-3xl font-bold"
            suppressHydrationWarning
          >
            {contractData?.[0]?.add(1)?.toString()}
          </div>
        </div>

        <label htmlFor="image" className="pb-1 text-center capitalize">
          image<span className="text-red-500">&nbsp;*</span>
        </label>
        <div
          className={classNames(
            "flex h-[calc(860px/2.5)] w-[calc(640px/2.5)] flex-col items-center justify-center rounded-[18px] border-dashed text-sm md:h-[calc(860px/2)] md:w-[calc(640px/2)]",
            "cursor-pointer overflow-hidden text-center",
            isDragged
              ? "border-4 border-blue-500 bg-gray-200 text-black hover:border-blue-200"
              : "border-2 border-gray-400 bg-gray-600 hover:border-blue-500"
          )}
          onClick={() => {
            inputRef.current?.click();
          }}
          onDragEnter={() => {
            setIsDragged(true);
          }}
          onDragLeave={() => {
            setIsDragged(false);
          }}
          onDragOver={(e) => {
            setIsDragged(true);
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragged(false);
            if (e.dataTransfer.files.length == 1)
              setValue("image", e.dataTransfer.files, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
          }}
        >
          {(imageFile?.length == 1 && imageFile[0] && (
            <img
              src={URL.createObjectURL(imageFile[0])}
              className="h-full w-full object-cover"
              alt="img to upload"
            />
          )) || (
            <>
              PNG, JPG, GIF. (max 15MB)
              <br />
              Drag and Drop your image
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          ref={inputRef}
          onChange={(e) =>
            setValue(
              "image",
              e.target.files && e.target.files.length == 1
                ? e.target.files
                : null,
              { shouldValidate: true, shouldDirty: true, shouldTouch: true }
            )
          }
        />

        {errors?.image && (
          <p className="pt-1 text-center text-sm text-red-500">
            {errors.image.message}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col">
        <label htmlFor="serial" className="pb-1 text-center capitalize">
          serial<span className="text-red-500">&nbsp;*</span>
        </label>
        <input
          type="text"
          {...register("serial", {
            required: true,
            minLength: {
              value: 5,
              message: "Minimum of 5 Characters required",
            },
          })}
          className="w-full rounded-[18px] bg-gray-600 py-2 text-center"
        />
        {errors?.serial && (
          <p className="pt-1 text-center text-sm text-red-500">
            {errors.serial.message}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col">
        <label htmlFor="model" className="pb-1 text-center capitalize">
          model<span className="text-red-500">&nbsp;*</span>
        </label>
        <input
          type="text"
          {...register("model", {
            required: true,
            minLength: {
              value: 5,
              message: "Minimum of 5 Characters required",
            },
          })}
          className="w-full rounded-[18px] bg-gray-600 py-2 text-center"
        />
        {errors?.model && (
          <p className="pt-1 text-center text-sm text-red-500">
            {errors.model.message}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col">
        <label htmlFor="year" className="pb-1 text-center capitalize">
          year<span className="text-red-500">&nbsp;*</span>
        </label>
        <input
          type="number"
          {...register("year", {
            required: true,
            valueAsNumber: true,
            validate: {
              thisYearOrEarlier: (year) => {
                if (!year) return false;
                return (
                  year <= new Date().getFullYear() || "Year must be in the past"
                );
              },
            },
          })}
          className="w-full rounded-[18px] bg-gray-600 py-2 text-center"
        />
        {errors?.year && (
          <p className="pt-1 text-center text-sm text-red-500">
            {errors.year.message}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col">
        <label htmlFor="case" className="pb-1 text-center capitalize">
          case<span className="text-red-500">&nbsp;*</span>
        </label>
        <input
          type="text"
          {...register("case", {
            required: true,
            minLength: {
              value: 5,
              message: "Minimum of 5 Characters required",
            },
          })}
          className="w-full rounded-[18px] bg-gray-600 py-2 text-center"
        />
        {errors?.case && (
          <p className="pt-1 text-center text-sm text-red-500">
            {errors.case.message}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col">
        <label htmlFor="extras" className="pb-1 text-center capitalize">
          extras<span className="text-red-500">&nbsp;*</span>
        </label>
        <input
          type="text"
          {...register("extras", {
            required: true,
            minLength: {
              value: 5,
              message: "Minimum of 5 Characters required",
            },
          })}
          className="w-full rounded-[18px] bg-gray-600 py-2 text-center"
        />
        {errors?.extras && (
          <p className="pt-1 text-center text-sm text-red-500">
            {errors.extras.message}
          </p>
        )}
      </div>
      {!data && typeof data !== "string" && (
        <>
          <button
            type="submit"
            disabled={
              !isValid ||
              isLoading ||
              (hadError && !!configError) ||
              hadError ||
              !signer
            }
            className={classNames(
              "ctaButton mt-2 w-full py-3 uppercase",
              "disabled:cursor-not-allowed",
              isLoading ? "animate-pulse" : "animate-none"
            )}
          >
            {(isLoading && "...Uploading") || "Upload to IPFS"}
          </button>
          <div className="w-full text-center text-sm text-yellow-600">
            Please double check that the ID in the image matches the ID above
          </div>
        </>
      )}
      {hadError && configError ? (
        <p className="pt-1 text-center text-sm text-red-500">
          {(configError as unknown as { reason: string }).reason}
        </p>
      ) : null}
      {typeof data == "string" && !configError && !isLoading && write ? (
        <button
          className={classNames(
            "cta2Button mt-2 w-full px-3 py-2",
            writeLoading || receiptLoading ? "animate-pulse" : "animate-none"
          )}
          disabled={writeLoading || isSuccess}
          onClick={() => {
            if (!writeLoading && !receiptLoading) write();
          }}
        >
          {writeLoading || receiptLoading ? "...Minting" : "Mint"}
        </button>
      ) : null}
      <div>
        {receiptData && (
          <>
            {BigNumber.from(receiptData.logs[0]?.topics[3] || "0").toString()}
          </>
        )}
      </div>
      {!(contractData?.[1] || false) && (
        <div className="text-center text-white">
          You will be charged {formatEther(contractData?.[2] || "0")}&nbsp;BNB
          for the creation of this NFT.
        </div>
      )}
    </form>
  );
};

export default NFTCreateForm;
