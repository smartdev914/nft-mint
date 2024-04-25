import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { MintNFTForm } from "@/components/mint-nft-form"
import { Typography } from "@/components/ui/typography"
import { getCollectionsByOwner, getMerkleTreeByOwner } from "@/libs/shyft"
import { CreateMerkleTreeResult, UploadResult } from "@/types"

export default function HomePage() {
  const { publicKey } = useWallet()
  const [collections, setCollections] = useState<UploadResult[]>([])
  const [merkleTrees, setMerkleTrees] = useState<CreateMerkleTreeResult[]>([])
  
  return (
    <>
      <div className="mb-10">
      </div>
      <MintNFTForm collections={collections} merkleTrees={merkleTrees} />
    </>
  )
}
