import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SelectTrigger, SelectValue } from "@/components/ui/select"
import { Networks } from "@/config/enum"
import { createTree } from "@/libs/shyft"
import { getTreeOptions } from "@/utils/get-tree-options"
import ConnectWalletButton from "./connect-wallet-button"
import { NetworkSelect } from "./network-select"
import { NodeSelect } from "./node-select"
import { useToast } from "./ui/toast"

const formSchema = z.object({
  number_of_nodes: z
    .string({ required_error: "Required.", invalid_type_error: "Required" })
    .min(1, "Number of nodes must be greater than 1.")
    .max(1073741824, `Number of nodes must be less than 1073741824.`),
  network: z.enum(Networks),
})

export function CreateTreeForm() {
  const { toast } = useToast()
  const { connected, publicKey } = useWallet()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number_of_nodes: '{ "maxDepth": 30, "maxBufferSize": 2048 }',
      network: "devnet",
    },
  })

  const numOfNodes = form.watch("number_of_nodes")

  const treeOptions = getTreeOptions(numOfNodes ?? '{ "maxDepth": 30, "maxBufferSize": 2048 }')

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!publicKey) {
        toast({
          variant: "warning",
          title: "Please connect to your wallet",
        })
        return
      }
      const { maxDepth, maxBufferSize } = getTreeOptions(values.number_of_nodes)
      const response = await createTree({
        owner: publicKey.toBase58(),
        network: values.network,
        maxDepth: maxDepth,
        maxBufferSize: maxBufferSize,
      })

      if (response.treeAddress) {
        toast({
          variant: "success",
          title: "Merkel tree created successfully",
          description: (
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://translator.shyft.to/address/${response.treeAddress}?cluster=${values.network}`}
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
            <FormField
              control={form.control}
              name="number_of_nodes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Nodes</FormLabel>
                  <FormControl>
                    <NodeSelect onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of nodes" />
                        </SelectTrigger>
                      </FormControl>
                    </NodeSelect>
                  </FormControl>
                   {numOfNodes ? (
                    <FormDescription>{`max_depth = ${treeOptions.maxDepth}, max_buffer_size = ${treeOptions.maxBufferSize}, canopy_depth = ${treeOptions.maxDepth - 5}`}</FormDescription>
                  ) : null}
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
