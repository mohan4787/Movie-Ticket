export interface IConfigParams {
    headers?: {
        "Authorization"?: string | null;
        "Content-Type"?: string | null;
    }
    params?: {
        [key: string]: unknown;
    }
}