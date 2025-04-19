import { Tooltip } from "./tooltip"

export interface PromptActionButton {
    caption: string,
    action: () => void,
    matColor?: string
    tooltip?: Tooltip,
    fullWidth?: boolean
    horizontalPosition?: null | 'right' | 'left' | 'center'
}
