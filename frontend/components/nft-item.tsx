import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"
import { Typography } from "@/components/ui/typography"
import { NFT } from "@/pages/view"
import { Network } from "@/types"

type NFTItemProps = {
  nft: NFT
  network: Network
}

export function NFTItem({ nft, network }: NFTItemProps) {
  console.log(nft)
  return (
    <a
      href={`https://translator.shyft.to/address/${nft.id}?cluster=${network}&compressed=true`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <AspectRatio>
          <img
            className="h-auto w-full object-cover"
            src={nft.content.json_uri ?? ""}
            alt={nft.content.metadata.name}
          />
        </AspectRatio>
        <div className="w-full p-5">
          <Typography className="mb-2 font-semibold">{nft.content.metadata.name}</Typography>
          <Typography as="p" color="secondary" level="body4" className="line-clamp-2 text-ellipsis">
            {nft.content.metadata.symbol}
          </Typography>
        </div>
      </div>
    </a>
  )
}

export function NFTItemSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <AspectRatio>
        <Skeleton className="h-full w-full" />
      </AspectRatio>
      <div className="p-5">
        <Skeleton className="mb-2 h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
