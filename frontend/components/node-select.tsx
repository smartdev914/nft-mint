import { SelectProps } from "@radix-ui/react-select"
import React, { PropsWithChildren } from "react"
import { Select, SelectContent, SelectItem } from "./ui/select"

type NodeSelect = SelectProps & PropsWithChildren

export function NodeSelect({ children, ...rest }: SelectProps) {
  return (
    <Select {...rest}>
      {children}
      <SelectContent position="popper" sideOffset={8} className="!w-[var(--radix-select-trigger-width)]">
        <SelectItem value='{"maxDepth": 3, "maxBufferSize": 8}'> 8 nodes</SelectItem>
        <SelectItem value='{ "maxDepth": 14, "maxBufferSize": 64 }'> 16,384 nodes</SelectItem>
        <SelectItem value='{ "maxDepth": 17, "maxBufferSize": 64 }'> 131,072 nodes</SelectItem>
        <SelectItem value='{ "maxDepth": 20, "maxBufferSize": 256 }'> 1,048,576 nodes</SelectItem>
        <SelectItem value='{ "maxDepth": 30, "maxBufferSize": 2048 }'> 1,073,741,824 nodes</SelectItem>
      </SelectContent>
    </Select>
  )
}
