import { Demand } from "./demand";
import { ValueType } from "./value-type";

type StringTypes = ValueType.STRING | ValueType.PATH;
type NumberTypes = ValueType.NUMBER | ValueType.INTEGER;
type BooleanTypes = ValueType.BOOLEAN;

export interface Setting<T> {
  type: T extends string ? StringTypes : T extends number ? NumberTypes : T extends boolean ? BooleanTypes : any;
  demand: Demand;
  environment?: string;
  parameter?: string;
  default?: T;
}