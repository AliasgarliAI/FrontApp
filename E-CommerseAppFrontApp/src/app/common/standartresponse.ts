import { Product } from "./product";
import { Resultstate } from "./resultstate";

export class Standartresponse {
    constructor(
        public product:any,
        public result :Resultstate
    ){}
}
