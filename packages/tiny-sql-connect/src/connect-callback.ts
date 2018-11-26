import { Connection } from "tedious";
import { debugModule } from "@australis/create-debug";
import unwrap, { Connectable } from "./unwrap";
const debug = debugModule(module);
type Callback<T> = (connection: Connection) => Promise<T>;
/** 
 * Help connect (connection) => T to Connectable;
 * To keep source function declaration clean
 * Instead of expecting (connection: Connection|Promise<Connection>|()=> Connection | ()=> Connection)
 * source function simply expects (connection: Connection )=>  { ... }
 */
const connectCallback =     // 
    <T>(callback: Callback<T>) => async (connect: Connectable) => {
        try {                        
            return Promise.resolve(await callback(await unwrap(connect)));
        } catch (e) {
            debug(e);
            return Promise.reject(e);
        }
    }

export default connectCallback;