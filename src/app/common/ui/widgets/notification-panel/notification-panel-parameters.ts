import { Inconsistency } from "src/app/common/inconsistency";

export interface NotificationPanelParameters
{
    showHeader: boolean,
    headerMessage: string;
    inconsistencies?: Inconsistency[];
    closeButtonCaption?: string;
    onCloseClick?: () => void;
}