import { TediousParameter } from "./types";

export default function isTediousParamLike(x: any): x is TediousParameter {
    return x && x.name && x.value && x.type && x.type.type && x.type.name
  }