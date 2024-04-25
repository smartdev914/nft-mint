import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, setProvider, Wallet } from '@coral-xyz/anchor';
import { zodResolver } from "@hookform/resolvers/zod"
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import { clusterApiUrl, Connection, PublicKey, sendAndConfirmTransaction, SendTransactionError } from "@solana/web3.js";
import { Keypair } from '@solana/web3.js';
import { PlusIcon, TrashIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectTrigger, SelectValue } from "@/components/ui/select"
import { Networks } from "@/config/enum"
import { MintNft } from'@/idl/mint_nft';
import idl from '@/idl/mint_nft.json';
import ConnectWalletButton from "./connect-wallet-button"
import { NetworkSelect } from "./network-select"
import { IconButton } from "./ui/icon-button"
import { useToast } from "./ui/toast"

const PROGRAM_ID_DEV_NET = '3B1E88qLCVqEuSzx9ToZwEd9SjDT3ZnD1xv3tr6iSjeS';
const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);
// const owner = Keypair.fromSecretKey(
//   Uint8Array.from([
//     207, 10, 30, 18, 231, 158, 148, 233, 3, 79, 51, 28, 226, 14, 100, 105, 40,
//     0, 21, 124, 124, 37, 49, 141, 113, 227, 15, 163, 144, 153, 110, 52, 85,
//     113, 67, 66, 112, 198, 158, 22, 99, 2, 166, 247, 216, 182, 177, 142, 234,
//     93, 67, 185, 207, 163, 44, 128, 109, 143, 105, 244, 159, 28, 46, 196,
//   ])
// );

const formSchema = z.object({
  name: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(32, `The maximum allowed length for this field is 32 characters`),
  symbol: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(10, `The maximum allowed length for this field is 10 characters`),

  uri: z
    .string({ required_error: "This field is required." })
    .trim()
    .max(256, `The maximum allowed length for this field is 256 characters`),
  attributes: z
    .array(
      z.object({
        trait_type: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(10, `The maximum allowed length for this field is 10 characters`),
        value: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(32, `The maximum allowed length for this field is 32 characters`),
      })
    )
    .optional(),
  network: z.enum(Networks),
})

export function MintNFTForm() {
  const { toast } = useToast()
  const { connected, publicKey, sendTransaction, signTransaction } = useWallet()
  const [program, setProgram] = useState<anchor.Program>()

  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  useEffect(() => {
    let provider: anchor.Provider

    try {
      provider = anchor.getProvider()
    } catch {
      provider = new anchor.AnchorProvider(connection, wallet as Wallet, {})
      anchor.setProvider(provider)
    }

    const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID_DEV_NET)
    setProgram(program)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      uri: "",
      network: "devnet",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const title = values.name;
    const symbol = values.symbol;
    const uri =values.uri;
    try {
      if (!publicKey || !program || !signTransaction) {
        toast({
          variant: "warning",
          title: "Please connect to your wallet",
        })
        return
      }
      const tokenAddress = await anchor.utils.token.associatedAddress({
        mint: mintKeypair.publicKey,
        owner: publicKey,
      });

      const metadataAddress = (
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mintKeypair.publicKey.toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];

      const masterEditionAddress = (
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mintKeypair.publicKey.toBuffer(),
            Buffer.from('edition'),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];

      const tsx = await program.methods
        .mint(title, symbol, uri)
        .accounts({
          masterEdition: masterEditionAddress,
          metadata: metadataAddress,
          mint: mintKeypair.publicKey,
          tokenAccount: tokenAddress,
          mintAuthority: publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .transaction();
       const latestBlockhash = await connection.getLatestBlockhash();
        tsx.feePayer = publicKey;
        tsx.recentBlockhash = latestBlockhash.blockhash
        tsx.partialSign(mintKeypair);

      const signature = await sendTransaction(tsx, connection);

      await connection.confirmTransaction(signature, "confirmed")

      toast({
        variant: "success",
        title: "NFT created successfully",
        description: (
          <a
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://translator.shyft.to/tx/${signature}?cluster=${values.network}`}
          >
            View transaction
          </a>
        ),
      })
    } catch (error) {
      toast({
        variant: "error",
        title: "Error :(",
        description: "Unknown error",
      })
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-5 flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-card">
            {/* name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="NFT name" error={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* symbol */}
            <FormField
              control={form.control}
              name="symbol"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="NFT symbol" error={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* uri url */}
            <FormField
              control={form.control}
              name="uri"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>URI</FormLabel>
                  <FormControl>
                    <Input placeholder="URI" error={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    URI pointing to an external URL defining the asset — e.g. the game&apos;s main site.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* attributes */}
            {fields.map((field, index) => (
              <div className="flex w-full items-center gap-6" key={field.id}>
                <FormField
                  control={form.control}
                  name={`attributes.${index}.trait_type`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Trait type</FormLabel>
                      <FormControl>
                        <Input fullWidth placeholder="Trait type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`attributes.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input fullWidth placeholder="Trait value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <IconButton
                  onClick={(event) => {
                    event.stopPropagation()
                    event.preventDefault()
                    remove(index)
                  }}
                  className="shrink-0 self-end"
                >
                  <TrashIcon />
                </IconButton>
              </div>
            ))}

            <Button
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                append({ trait_type: "", value: "" })
              }}
              size="sm"
              endDecorator={<PlusIcon />}
              className="self-start"
            >
              Add attributes
            </Button>

            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <FormControl>
                    <NetworkSelect onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                      </FormControl>
                    </NetworkSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            {connected ? (
              <Button loading={form.formState.isSubmitting} type="submit">
                Create
              </Button>
            ) : (
              <ConnectWalletButton>Connect Wallet</ConnectWalletButton>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
