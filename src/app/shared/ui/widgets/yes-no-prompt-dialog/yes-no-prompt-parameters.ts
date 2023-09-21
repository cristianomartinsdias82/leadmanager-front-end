export interface YesNoPromptParameters
{
    title: string;
    question: string;
    yesCaption: string,
    noCaption: string,
    onYesClick?: () => void;
    onNoClick?: () => void;
}
