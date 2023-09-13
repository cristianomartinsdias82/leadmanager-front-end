import { PromptActionButton } from "./prompt-action-button";

export interface CustomPromptParameters
{
    title?: string;
    description?: string;
    actionButtons: PromptActionButton[];
}
