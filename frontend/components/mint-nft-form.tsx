import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { PlusIcon, TrashIcon } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Networks } from "@/config/enum"
import { mintNFT } from "@/libs/shyft"
import { CreateMerkleTreeResult, UploadResult } from "@/types"
import ConnectWalletButton from "./connect-wallet-button"
import { NetworkSelect } from "./network-select"
import { IconButton } from "./ui/icon-button"
import { useToast } from "./ui/toast"

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
  collection: z.string().trim(),
  collectionMint: z.string().trim(),
  metadataAccount: z.string({ required_error: "This field is required." }).trim(),
  masterEditionAccount: z.string({ required_error: "This field is required." }).trim(),
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
  treeKeypair: z.string({ required_error: "This field is required." }).trim(),
  network: z.enum(Networks),
})

export function MintNFTForm(props: { collections: UploadResult[]; merkleTrees: CreateMerkleTreeResult[] }) {
  const { toast } = useToast()
  const { connected, publicKey } = useWallet()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      uri: "",
      collection: "",
      collectionMint: "",
      metadataAccount: "",
      masterEditionAccount: "",
      treeKeypair: "",
      network: "devnet",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try {
      if (!publicKey) {
        toast({
          variant: "warning",
          title: "Please connect to your wallet",
        })
        return
      }
      const response = await mintNFT({
        owner: publicKey.toBase58(),
        treeKeypair: values.treeKeypair,
        collectionMint: values.collectionMint,
        network: values.network,
        masterEditionAccount: values.masterEditionAccount,
        metadataAccount: values.metadataAccount,
        name: values.name,
        symbol: values.symbol,
        uri: values.uri,
      })

      if (response) {
        toast({
          variant: "success",
          title: "Your NFT minted successfully",
          description: (
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://translator.shyft.to/address/${values.collectionMint}?cluster=${values.network}`}
            >
              View transaction
            </a>
          ),
        })
      } else {
        toast({
          variant: "error",
          title: "Error :(",
          description: "Unknown error",
        })
      }
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

            <FormField
              control={form.control}
              name="collection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose collection</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        const collectionSelected = props.collections.find((collection) => `${collection.id}` === value)
                        if (collectionSelected) {
                          form.setValue("collectionMint", collectionSelected.collectionMint)
                          form.setValue("metadataAccount", collectionSelected.metadataAccount)
                          form.setValue("masterEditionAccount", collectionSelected.masterEditionAccount)
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select collection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        position="popper"
                        sideOffset={8}
                        className="!w-[var(--radix-select-trigger-width)]"
                      >
                        {props.collections.map((collection) => (
                          <SelectItem key={collection.id} value={`${collection.id}`}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* collection address */}
            <FormField
              control={form.control}
              name="collectionMint"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Collection address</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Collection address" error={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    On-chain address of the collection represented by an NFT, with max_supply of 0.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Metadata Account */}
            <FormField
              control={form.control}
              name="metadataAccount"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Metadata Account</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Metadata Account" error={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Metadata Account On-chain address of the collection represented by an NFT, with max_supply of 0.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Master Edition Account */}
            <FormField
              control={form.control}
              name="masterEditionAccount"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel> Master Edition Account</FormLabel>
                  <FormControl>
                    <Input disabled placeholder=" Master Edition Account" error={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Master Edition Account On-chain address of the collection represented by an NFT, with max_supply of
                    0.
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

            {/* merkle tree */}
            <FormField
              control={form.control}
              name="treeKeypair"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merkle tree</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Merkle tree address" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        position="popper"
                        sideOffset={8}
                        className="!w-[var(--radix-select-trigger-width)]"
                      >
                        {props.merkleTrees.map((merkleTre) => (
                          <SelectItem key={merkleTre.id} value={`${merkleTre.treeAddress}`}>
                            {merkleTre.treeAddress}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
