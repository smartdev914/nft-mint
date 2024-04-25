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

  const fetchCollections = async () => {
    if (publicKey?.toBase58()) {
      await getCollectionsByOwner(publicKey.toBase58()).then((response) => {
        setCollections(response)
      })

      await getMerkleTreeByOwner(publicKey.toBase58()).then((response) => {
        setMerkleTrees(response)
      })
    }
  }
  useEffect(() => {
    fetchCollections()
  }, [publicKey])
  
  return (
    <>
      <div className="mb-10">
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Mint cNFT
        </Typography>
      </div>
      <MintNFTForm collections={collections} merkleTrees={merkleTrees} />
    </>
  )
}
