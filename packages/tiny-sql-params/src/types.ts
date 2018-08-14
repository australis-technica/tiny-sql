import { ParameterOptions, TediousType } from "tedious";
/** */
export type TediousParameter = {
    name: string;
    type: TediousType;
    value: any;
    options?: ParameterOptions;
};
/** */
export interface Indexer {
    [key: string]: any;
}
/**
 * 
 */
export type KeyFilter<T extends { [key: string]: any }, TK extends keyof T & string> = (key: TK, x: T) => boolean;
