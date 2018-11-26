import { Connection } from "tedious";
import isConnection from "./is-connection";

const isPromise = (x: any): x is Promise<any> => x && typeof x.then === "function";

const isFunction = (x: any): x is Function => { return typeof x === "function" };

export type  Connectable = (() => Promise<Connection>) | Promise<Connection> | Connection | (() => Connection)

export default (connect: Connectable): Promise<Connection> => {

    if (isConnection(connect))
        return Promise.resolve(connect);

    if (isPromise(connect)) {
        return connect;
    }

    if (isFunction(connect)) {
        const c = connect();
        if (isPromise(c)) return c;
        if (isConnection(c)) return Promise.resolve(c);
    }
    
    return Promise.reject(new Error("Invalid Connect Type"));
}