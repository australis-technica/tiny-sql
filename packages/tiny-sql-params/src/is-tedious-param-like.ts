import { TediousParameter } from "./types";
import { TYPES } from "tedious";

export default function isTediousParameterLike(x: any): x is TediousParameter {  
    return x && x.type && x.type.id && x.type.name && x.type.type
  }