import { LeadDataCaptionMap, SerializedLeadData } from "../models/serialized-lead-data";
import { DataItem } from "./data-item";
import { ObjectProps } from "./object-props";

export const getLeadDataAsDataItems = (
  source:ObjectProps<SerializedLeadData>,
  other?:ObjectProps<SerializedLeadData>) => {

  const dataItems: DataItem[] = [];
      Object.keys(source)
            .filter(key => ['Id','CreatedAt','CreatedUserId','UpdatedAt','UpdatedUserId','RowVersion'].indexOf(key) === -1)
            .forEach(key => {
              dataItems.push({
                caption: LeadDataCaptionMap[key],
                data: source[key].toString(),
                hasChanges: !other ? undefined : source[key] !== other[key]
              })
            });

      return dataItems;
}