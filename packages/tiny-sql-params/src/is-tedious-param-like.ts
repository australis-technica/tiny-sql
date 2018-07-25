import { TediousParams } from "./types";

export default function isTediousParamLike(x: any): x is TediousParams {
    return x && x.name && x.value && x.type && x.type.type && x.type.name
  }