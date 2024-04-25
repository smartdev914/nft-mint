export type ValidDepthSizePair =
  | { maxDepth: 3; maxBufferSize: 8 }
  | { maxDepth: 5; maxBufferSize: 8 }
  | { maxDepth: 14; maxBufferSize: 64 }
  | { maxDepth: 14; maxBufferSize: 256 }
  | { maxDepth: 14; maxBufferSize: 1024 }
  | { maxDepth: 14; maxBufferSize: 2048 }
  | { maxDepth: 15; maxBufferSize: 64 }
  | { maxDepth: 16; maxBufferSize: 64 }
  | { maxDepth: 17; maxBufferSize: 64 }
  | { maxDepth: 18; maxBufferSize: 64 }
  | { maxDepth: 19; maxBufferSize: 64 }
  | { maxDepth: 20; maxBufferSize: 64 }
  | { maxDepth: 20; maxBufferSize: 256 }
  | { maxDepth: 20; maxBufferSize: 1024 }
  | { maxDepth: 20; maxBufferSize: 2048 }
  | { maxDepth: 24; maxBufferSize: 64 }
  | { maxDepth: 24; maxBufferSize: 256 }
  | { maxDepth: 24; maxBufferSize: 512 }
  | { maxDepth: 24; maxBufferSize: 1024 }
  | { maxDepth: 24; maxBufferSize: 2048 }
  | { maxDepth: 26; maxBufferSize: 512 }
  | { maxDepth: 26; maxBufferSize: 1024 }
  | { maxDepth: 26; maxBufferSize: 2048 }
  | { maxDepth: 30; maxBufferSize: 512 }
  | { maxDepth: 30; maxBufferSize: 1024 }
  | { maxDepth: 30; maxBufferSize: 2048 }

const allPairs: number[][] = [
  [3, 8],
  [5, 8],
  [14, 64],
  [14, 256],
  [14, 1024],
  [14, 2048],
  [15, 64],
  [16, 64],
  [17, 64],
  [18, 64],
  [19, 64],
  [20, 64],
  [20, 256],
  [20, 1024],
  [20, 2048],
  [24, 64],
  [24, 256],
  [24, 512],
  [24, 1024],
  [24, 2048],
  [26, 512],
  [26, 1024],
  [26, 2048],
  [30, 512],
  [30, 1024],
  [30, 2048],
]

export const ALL_DEPTH_SIZE_PAIRS: ValidDepthSizePair[] = allPairs.map((pair) => {
  return {
    maxDepth: pair[0],
    maxBufferSize: pair[1],
  } as ValidDepthSizePair
})

const allDepthSizes = ALL_DEPTH_SIZE_PAIRS.flatMap((pair) => pair.maxDepth).filter(
  (item, pos, self) => self.indexOf(item) == pos
)

const defaultDepthPair = {
  maxDepth: 3,
  maxBufferSize: 8,
}

export const getTreeOptions = (treeNodes: string) => {
  const treeNodesJson = (treeNodes && JSON?.parse(treeNodes)) ?? {}
  const maxDepth = (treeNodesJson as any)?.maxDepth || 14;
  const maxBufferSize = (treeNodesJson as any)?.maxBufferSize || 64;

  return {
    maxDepth,
    maxBufferSize,
  }
}
