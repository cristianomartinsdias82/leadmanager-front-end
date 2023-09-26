import { Inconsistency } from "src/app/shared/core/api-response/inconsistency";

export interface NotificationPanelParameters
{
    showHeader: boolean,
    headerMessage: string;
    inconsistencies?: Inconsistency[];
    closeButtonCaption?: string;
    onCloseClick?: () => void;
}