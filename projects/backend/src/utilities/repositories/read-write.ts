//  https://hackernoon.com/generic-repository-with-typescript-and-node-js-731c10a1b98e

import { IRead } from "./read";
import { IWrite } from "./write";

export interface IReadWrite<T> extends IRead<T>, IWrite<T> {
}