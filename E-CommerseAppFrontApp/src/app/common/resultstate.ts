import { Result } from "./result";

export class Resultstate {
    constructor(
        public success:Result,
        public error:Result,
        public warning:Result){}
}
