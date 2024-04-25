import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectTrigger, SelectValue } from "@/components/ui/select"
import { Networks } from "@/config/enum"
import { uploadMetadata } from "@/libs/shyft"
import ConnectWalletButton from "./connect-wallet-button"
import { NetworkSelect } from "./network-select"
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
  sellerFeeBasisPoints: z.string({ required_error: "This field is required." }),
  uri: z
    .string({ required_error: "This field is required." })
    .trim()
    .max(256, `The maximum allowed length for this field is 256 characters`)
    .optional(),
  network: z.enum(Networks),
})

export function CollectionForm() {
  const { toast } = useToast()
  const { connected, publicKey } = useWallet()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      sellerFeeBasisPoints: '0',
      uri: "",
      network: "devnet",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)

      if (!publicKey) {
        toast({
          variant: "warning",
          title: "Please connect to your wallet",
        })
        return
      }

      await uploadMetadata({
        name: values.name,
        symbol: values.symbol,
        sellerFeeBasisPoints: Number(values?.sellerFeeBasisPoints) ?? 0,
        uri: values?.uri ?? "",
        addressCreator: publicKey.toBase58(),
      }).then((response) => {
        if (response) toast({
          variant: "success",
          title: "Collection created successfully",
          description: (
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://translator.shyft.to/address/${response.metadataAccount}?cluster=${values.network}`}
            >
              View transaction
            </a>
          ),
        })
      }).catch(() => {
        toast({
          variant: "error",
          title: "Error :(",
          description: "Unknown error",
        })
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
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Collection Name" error={fieldState.invalid} {...field} />
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

            {/* external url */}
            <FormField
              control={form.control}
              name="uri"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>URI</FormLabel>
                  <FormControl>
                    <Input placeholder="External URL" error={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    URI pointing to an external URL defining the asset — e.g. the game&apos;s main site.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* sellerFeeBasisPoints */}
            <FormField
              control={form.control}
              name="sellerFeeBasisPoints"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Seller Fee Basis Points</FormLabel>
                  <FormControl>
                    <Input type={"number"} placeholder="Seller Fee Basis Points" error={fieldState.invalid} {...field} />
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
                Create Collection
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
