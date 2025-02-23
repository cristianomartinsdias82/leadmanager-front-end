import { Tooltip } from "./tooltip"

export interface PromptActionButton {
    caption: string,
    action: () => void,
    matColor?: string
    tooltip?: Tooltip
}
