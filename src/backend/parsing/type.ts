import {type ValuesOf} from "../utils/typetools";

export type SymbolWrapper = ValuesOf<{
  [K in keyof never]: {
    type: K
    meta: (K extends `consonant` ? {
          emphatic: boolean,
        } : never)
    value: never[K]
  }
}>;
