export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type BaseResponse<T> = {
  success: boolean
  message: string
  result: T
}

export type Network = "mainnet-beta" | "devnet" | "testnet"

export type CreateMerkleTreeRequestBody = {
  network: Network
  owner: string
  maxDepth: number
  maxBufferSize: number
}

export type CreateMerkleTreeResult = {
  merkleTreeAddress: ReactNode
  createdAt: string
  deletedAt: null
  id: number
  maxBufferSize: number
  maxDepth: number
  network: string
  owner: string
  treeAddress: string
  treeAuthority: string
  treeKeypair: string
  updatedAt: string
}

export type MintNFTRequestBody = {
  network: Network
  treeKeypair: string
  collectionMint: string
  metadataAccount: string
  masterEditionAccount: string
  name: string
  symbol: string
  uri: string
  owner: string
}

export type MintNFTResult = {
  id: number
  updatedAt: string
  createdAt: string
  deletedAt: string
  name: string
  uri: string
  symbol: string
  owner: string
  collectionId: number
  treeId: number
}

export type TransferNFTRequestBody = {
  network: Network
  merkle_tree: string
  nft_address: string
  sender: string
  receiver: string
}

export type TransferNFTResult = {
  encoded_transaction: string
  signers: Array<string>
}

export type BurnNFTRequestBody = {
  network: string
  merkle_tree: string
  nft_address: string
  wallet_address: string
}

export type BurnNFTResult = {
  encoded_transaction: string
  signers: Array<string>
}

export type CollectionInfo = {
  address?: string
  verified?: boolean
  name?: string
  family?: string
}

export type NftFile = {
  uri: string
  type: string
}

export type Creator = {
  address: string
  verified: boolean
  share: number
}

export type Nft = {
  name: string
  description: string
  symbol: string
  image_uri: string
  royalty: number
  mint: string
  attributes: { [k: string]: string | number }
  owner: string
  update_authority: string
  cached_image_uri: string
  animation_url: string
  cached_animation_url: string
  metadata_uri: string
  creators: Creator[]
  collection: CollectionInfo
  attributes_array: any
  files: NftFile[]
  external_url: string
  is_loaded_metadata: boolean
  primary_sale_happened: boolean
  is_mutable: boolean
}

export type UploadResult = {
  id: number
  name: string
  uri: string
  sellerFeeBasisPoints: number
  addressCreator: string
  collectionMint: string
  metadataAccount: string
  masterEditionAccount: string
  owner: string
}

export type UploadMetadataRequestBody = {
  name: string
  symbol: string
  sellerFeeBasisPoints: number
  uri: string
  addressCreator: string
}
