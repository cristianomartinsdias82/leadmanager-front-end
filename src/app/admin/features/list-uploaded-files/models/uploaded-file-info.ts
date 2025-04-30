export interface UploadedFileInfo {
    id: string;
    fileId: string;
    userId: string;
    fileName: string;
    createdAt: string;
    pathOrContainerName?: string
}