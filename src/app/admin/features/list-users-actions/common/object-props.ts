//https://stackoverflow.com/questions/43389414/how-to-iterate-over-keys-of-a-generic-object-in-typescript
export interface ObjectProps<T> {
    [index: string]: T
}