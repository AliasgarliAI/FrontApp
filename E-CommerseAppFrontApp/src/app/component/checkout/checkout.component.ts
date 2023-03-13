import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { City } from 'src/app/common/city';
import { Country } from 'src/app/common/country';
import { ShopformService } from 'src/app/services/shopform.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonth: number[] = [];
  countries :Country[]=[];
  shippingAddressCities :City[]=[];
  billingAddressCities : City[]=[];

  constructor(
    private formBuilder: FormBuilder,
    private shopFormSevice: ShopformService
  ) {}

  ngOnInit(): void {
    //personal details
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),

      //adress details shipping
      shippingAddress: this.formBuilder.group({
        street: [''],
        country: [''],
        city: [''],
        zipCode: [''],
      }),

      // adress details billing
      billingAddress: this.formBuilder.group({
        street: [''],
        country: [''],
        city: [''],
        zipCode: [''],
      }),

      creditType: this.formBuilder.group({
        cardType: [''],
        cardHolder: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    const startMonth = new Date().getMonth() + 1;
    this.shopFormSevice.getCreditCardMonths(startMonth).subscribe(data=>{
      this.creditCardMonth = data;
    })

    this.shopFormSevice.getCreditCardYears().subscribe(data=>{
      this.creditCardYears =data;
    })

    this.getCountryList();
  }
  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }
  copyShippingAdressToBilling(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  handleMonthAndYears(){
     const currentYear :number = new Date().getFullYear();
     const selectedYear:number = Number(this.checkoutFormGroup.controls['creditType'].value.expirationYear);

     let startMonth :number =1
     if(currentYear === selectedYear){
       startMonth= new Date().getMonth()+1;
      //getting months for current year
     }
     this.shopFormSevice.getCreditCardMonths(startMonth).subscribe(data =>this.creditCardMonth = data);
  }

  getCountryList(){
    this.shopFormSevice.getCountryList().subscribe(data =>this.countries = data);
  }


  getCityByCountry(formGroupName:string){
    const formGroup =this.checkoutFormGroup.get(formGroupName);
    const countryId = formGroup?.value.country.countryId;
    if (formGroupName === 'shippingAddress'){
      this.shopFormSevice.getCityListByCountry(countryId).subscribe(data =>this.shippingAddressCities = data);
    }
    else{
      this.shopFormSevice.getCityListByCountry(countryId).subscribe(data =>this.billingAddressCities = data);
    }
    
  }

  // how to create function in javascript
  
  //  how to run angular application on terminal 
}
