import { Connection, ConnectionConfig } from "tedious";
import toPromise from "./to-promise";
/**
 * Create connection factory, always *new*
 */
export default function connectFactory(args: ConnectionConfig) {    
  /** */
  return () => toPromise(new Connection(args));
}