export function objectsAtomicallyEqual<T extends { [key: string]: any }>(obj: T, otherObj: T): boolean {

    if ((obj === undefined && otherObj !== undefined) || (otherObj === undefined && obj !== undefined))
        return false;

    if (otherObj === undefined && obj === undefined)
        return true;

    let haveEqualPropsValues = true;

    for (const key in obj)
    {
        if (obj[key] !== otherObj[key]) {
            haveEqualPropsValues = false;
            break;
        }
    }
    
    return haveEqualPropsValues;
}