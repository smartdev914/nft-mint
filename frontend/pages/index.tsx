import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { CreateTreeForm } from "@/components/create-tree-form"
import { Typography } from "@/components/ui/typography"
import { getMerkleTreeByOwner } from "@/libs/shyft"
import { CreateMerkleTreeResult } from "@/types"

export default function HomePage() {
  const { publicKey } = useWallet()
  const [merkleTrees, setMerkleTrees] = useState<CreateMerkleTreeResult[]>([])

  const fetchCollections = async () => {
    if (publicKey?.toBase58()) {
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
        <Typography as="h4" level="h6" className="mb-6 font-bold">
          Your Merkle Tree
        </Typography>
        <div className="mb-4 grid grid-cols-4 gap-4">
          {merkleTrees.map((merkleTree) => {
            return (
              <div
                key={merkleTree.merkleTreeAddress}
                className="relative flex w-full max-w-[20rem] flex-col rounded-xl bg-gradient-to-tr from-gray-900 to-gray-800 bg-clip-border p-8 text-white shadow-md shadow-gray-900/20"
              >
                <ul className="circles">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
                <div className="p-0">
                  <ul className="flex flex-col gap-4">
                    <li className="flex items-center gap-4">
                      <span className="rounded-full border border-white/20 bg-white/20 p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-3 w-3"
                        >
                          <path d="M4.5 12.75l6 6 9-13.5"></path>
                        </svg>
                      </span>
                      <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                        Address:{" "}
                        {merkleTree.treeAddress.substring(0, 5) +
                          "..." +
                          merkleTree.treeAddress.substr(merkleTree.treeAddress.length - 5)}
                      </p>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="rounded-full border border-white/20 bg-white/20 p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-3 w-3"
                        >
                          <path d="M4.5 12.75l6 6 9-13.5"></path>
                        </svg>
                      </span>
                      <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                        Max Depth: {merkleTree.maxDepth}
                      </p>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="rounded-full border border-white/20 bg-white/20 p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-3 w-3"
                        >
                          <path d="M4.5 12.75l6 6 9-13.5"></path>
                        </svg>
                      </span>
                      <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased">
                        Max Buffer Size: {merkleTree.maxBufferSize}
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="z-30 mt-6 p-0">
                  <a
                    className="block w-full cursor-pointer select-none rounded-lg bg-white px-7 py-3.5 text-center align-middle font-sans text-sm font-bold uppercase text-primary-500 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:opacity-[0.85] focus:shadow-none active:scale-100 active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://translator.shyft.to/address/${merkleTree.treeAddress}?cluster=devnet`}
                  >
                    View detail
                  </a>
                </div>
              </div>
            )
          })}
        </div>
        <Typography as="h4" level="h6" className="mb-2 font-bold">
          Create Merkle Tree
        </Typography>
      </div>
      <CreateTreeForm />
    </>
  )
}
