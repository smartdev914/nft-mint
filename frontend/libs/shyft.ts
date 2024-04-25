import {
  BaseResponse,
  BurnNFTRequestBody,
  BurnNFTResult,
  CreateMerkleTreeRequestBody,
  CreateMerkleTreeResult,
  MintNFTRequestBody,
  MintNFTResult,
  Network,
  Nft,
  TransferNFTRequestBody,
  TransferNFTResult,
  UploadMetadataRequestBody,
  UploadResult,
} from "@/types"
import fetcher from "./fetcher"
import { API_ENDPOINT } from "@/config/api"
import { NFT } from "@/pages/view"

export function createTree(body: CreateMerkleTreeRequestBody) {
  return fetcher<CreateMerkleTreeResult>(`${API_ENDPOINT}/api/merkel-tree`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
    body: JSON.stringify(body),
  })
}

export function mintNFT(body: MintNFTRequestBody) {
  return fetcher<MintNFTResult>(`${API_ENDPOINT}/api/nft`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
    body: JSON.stringify(body),
  })
}

export function transferNFT(body: TransferNFTRequestBody) {
  return fetcher<BaseResponse<TransferNFTResult>>(`${API_ENDPOINT}/sol/v1/nft/compressed/transfer`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

export function burnNFT(body: BurnNFTRequestBody) {
  return fetcher<BaseResponse<BurnNFTResult>>(`${API_ENDPOINT}/sol/v1/nft/compressed/burn`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

export function getCollectionsByOwner(addressOwner: string) {
  return fetcher<UploadResult[]>(`${API_ENDPOINT}/api/collection/${addressOwner}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
  })
}

export function getMerkleTreeByOwner(addressOwner: string) {
  return fetcher<CreateMerkleTreeResult[]>(`${API_ENDPOINT}/api/merkel-tree/${addressOwner}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
  })
}

export function getNftsByOwner(addressOwner: string) {
  return fetcher<BaseResponse<{ nfts: Nft[] }>>(`${API_ENDPOINT}/api/nft/${addressOwner}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
  })
}

export function readAllNFTs(wallet: string) {
  return fetcher<{ items: NFT[] }>(`${API_ENDPOINT}/api/nft/${wallet}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
  })
}

export function readNFT(nftAddress: string, network: Network) {
  return fetcher<BaseResponse<Nft>>(
    `${API_ENDPOINT}/sol/v1/nft/compressed/read?network=${network}&nft_address=${nftAddress}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  )
}

export function upload(file: File) {
  const formdata = new FormData()
  formdata.append("file", file, file.name)

  return fetcher<BaseResponse<UploadResult>>(`${API_ENDPOINT}/sol/v1/storage/upload`, {
    method: "POST",
    headers: {
      // "content-type": "application/json",
    },
    body: formdata,
  })
}

export function uploadMetadata(metadata: UploadMetadataRequestBody) {
  return fetcher<UploadResult>(`${API_ENDPOINT}/api/collection`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
    body: JSON.stringify(metadata),
  })
}
