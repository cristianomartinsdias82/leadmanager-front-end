import { Inconsistency } from "src/app/core/inconsistency";

export interface NotificationPanelParameters
{
    showHeader: boolean,
    headerMessage: string;
    inconsistencies?: Inconsistency[];
    closeButtonCaption?: string;
    onCloseClick?: () => void;
}