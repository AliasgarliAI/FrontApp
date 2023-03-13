import { Injectable } from '@angular/core';
import { Subject, VirtualTimeScheduler } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[]=[];
  totalPrice:Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem){
    let alreadyExistInCart :boolean =false;
    let existingCartItem :any = undefined;

    if(this.cartItems.length>0){
      existingCartItem = this.cartItems.find(theCartItem=>theCartItem.id==cartItem.id);
    }

    alreadyExistInCart =(existingCartItem !== undefined);

    if(alreadyExistInCart){
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(cartItem);
    }
    this.computeCartTotals()
  }
  computeCartTotals() {
      let totalPriceValue:number =0;
      let totalQuantity:number= 0;

      for (let item of this.cartItems){
          totalPriceValue+=item.unitPrice * item.quantity;
          totalQuantity+=item.quantity;
      }
      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantity);
  }
  incrementQuantity(theCartItem:CartItem){
    this.addToCart(theCartItem);
  }
  decrementQuantity(theCartItem:CartItem){
      theCartItem.quantity--;

      if(theCartItem.quantity === 0){
        this.remove(theCartItem);
      }
      else{
        this.computeCartTotals();
      }
  }
  remove(theCartItem:CartItem){
    const index = this.cartItems.findIndex(item => item.id === theCartItem.id);

    if(index > -1){
      this.cartItems.splice(index,1);
      this.computeCartTotals();
    }
  }
}
