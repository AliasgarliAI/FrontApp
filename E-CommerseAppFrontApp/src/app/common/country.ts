import { City } from "./city";

export class Country {
    constructor(
       public countryId:number,
       public countryName:string,
       public countryCode:string,
       public cities: City[]
    ){}

}
