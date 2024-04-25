import { useWallet } from "@solana/wallet-adapter-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import ConnectWalletButton from "@/components/connect-wallet-button"
import { NetworkSelect } from "@/components/network-select"
import { NFTItem, NFTItemSkeleton } from "@/components/nft-item"
import { Button } from "@/components/ui/button"
import { SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import { Typography } from "@/components/ui/typography"
import { readAllNFTs } from "@/libs/shyft"
import { Network } from "@/types"


export interface NFT {
  interface: string
  id: string
  content: Content
  authorities: Authority[]
  compression: Compression
  grouping: Grouping[]
  royalty: Royalty
  creators: Creator[]
  ownership: Ownership
  supply: Supply
  mutable: boolean
  burnt: boolean
}
interface Content {
  $schema: string
  json_uri: string
  files: any[]
  metadata: Metadata
  links: string
}
interface Metadata {
  name: string
  symbol: string
  token_standard: string
}
interface Authority {
  address: string
  scopes: string[]
}
interface Compression {
  eligible: boolean
  compressed: boolean
  data_hash: string
  creator_hash: string
  asset_hash: string
  tree: string
  seq: number
  leaf_id: number
}
interface Grouping {
  group_key: string
  group_value: string
}
interface Royalty {
  royalty_model: string
  target: any
  percent: number
  basis_points: number
  primary_sale_happened: boolean
  locked: boolean
}
interface Creator {
  address: string
  share: number
  verified: boolean
}
interface Ownership {
  frozen: boolean
  delegated: boolean
  delegate: any
  ownership_model: string
  owner: string
}
interface Supply {
  print_max_supply: number
  print_current_supply: number
  edition_nonce: number
}

export default function Transfer() {
  const { connected, publicKey } = useWallet()
  const [loading, setLoading] = useState(false)
  const [network, setNetwork] = useState<Network>("mainnet-beta")
  const [nfts, setNFTs] = useState<NFT[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (publicKey && network) {
      setLoading(true)
      readAllNFTs(publicKey.toBase58())
        .then((response) => {
          setNFTs(response.items)
        })
        .catch(() => {
          toast({
            variant: "error",
            title: "Error",
            description: "Unknown error",
          })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [network, publicKey, toast])

  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Your cNFTs
        </Typography>

        <div className="w-auto">
          <NetworkSelect value={network} onValueChange={(value) => setNetwork(value as Network)}>
            <SelectTrigger>
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
          </NetworkSelect>
        </div>
      </div>

      {!connected || !publicKey ? (
        <div className="py-10 flex items-center justify-center">
          <ConnectWalletButton>Connect wallet</ConnectWalletButton>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 10 }).map((_, idx) => (
                <NFTItemSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <>
              {nfts.length === 0 ? (
                <div className="py-10  flex flex-col items-center justify-center gap-5">
                  <Typography className="font-semibold" color="secondary">
                    No cNFT
                  </Typography>
                  <Link href="/mint">
                    <Button>Create one</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {nfts.map((nft) => (
                    <NFTItem key={nft.id} nft={nft} network={network} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
