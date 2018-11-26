import { Connection } from "tedious";
const isConnection = (x: any): x is Connection => {
  return x instanceof Connection;
};
export default isConnection;