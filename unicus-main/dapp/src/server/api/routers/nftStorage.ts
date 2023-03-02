import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
 import { NFTStorage, File } from "nft.storage";

const NFTWatchObject = z.object({
  name: z.string().min(5),
  serial: z.string().min(5),
  model: z.string().min(5),
  year: z.number().max(new Date().getFullYear()),
  case: z.string().min(5),
  extras: z.string(),
  fileType: z.string().regex(/^image\/(jpeg|png|gif|bmp|svg\+xml)$/),
  fileName: z.string().regex(/^[^\\/:\*\?"<>\|]+(\.[^\\/:\*\?"<>\|]+)*$/)
}).required();

export const nftStorageRouter = createTRPCRouter({
  createNFTData: publicProcedure
    .input(z.object({
      file: z.string().transform((val) => Buffer.from(val.replace(/^data:image\/\w+;base64,/, ""), 'base64')),
      obj: NFTWatchObject,
    }))
    .mutation(async ({ input }) => {
      const { file, obj } = input;
      if(!process.env.NFT_STORAGE_KEY)
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "NFT_STORAGE_KEY is not set"
        });
      const fileExtension = obj.fileName.match(/\.[^/.]+$/)?.[0];

      if(!fileExtension)
          return new TRPCError({
            code: "BAD_REQUEST",
            message: "File extension not found"
          });
      const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });
      const cid = await client.store(
        {
          name: obj.name,
          description: `Unicus Watch NFT: \nSerial: ${obj.serial},\nModel: ${obj.model},\nYear: ${obj.year},\nCase: ${obj.case},\nExtras: ${obj.extras}`,
          image: new File([file], `${obj.name.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}${fileExtension}`, { type: obj.fileType }),
          attributes:[
            {
              trait_type: "Serial",
              value: obj.serial
            },
            {
              trait_type: "Model",
              value: obj.model
            },
            {
              trait_type: "Year",
              value: obj.year
            },
            {
              trait_type: "Case",
              value: obj.case
            },
            {
              trait_type: "Extras",
              value: obj.extras
            }
          ]
        }
      )
      console.log(cid);
      return cid.url.replace("ipfs://", "");
    }),
});