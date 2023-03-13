import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { Standartresponse } from 'src/app/common/standartresponse';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  public response!: Standartresponse;
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = '';
  searchMode: boolean = false;
  searchKeyword: string = '';
  products: Product[] = [];

  //properties for pagination
  totalElements: number = 0;
  totalPages!: number;
  thePageSize: number = 10; 
  thePageNumber: number = 1; 

  constructor(private service: ProductService,private cartService: CartService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listOfProducts();
    });
    
  }

  listOfProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    //const CategoryId: number = this.route.snapshot.paramMap.get('id');
    console.log(this.searchMode)
    if (this.searchMode) {
      this.handleSeacrhedProducts();
    }
    else {
      this.handleProductsByCategory();
      //this.handleProduct();
    }
  }

  handleProduct() {
    this.service.getProductList().subscribe((data) => {
      this.response = data;
    });
  }

  handleProductsByCategory() {
    this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    
    this.service
      .getProductListPaginate(this.currentCategoryId,this.thePageNumber-1,this.thePageSize)
      .subscribe((data) => {
        this.products = data.content;
        this.thePageNumber = data.number+1; // the number of page 
        this.thePageSize = data.size;
        this.totalElements = data.totalElements;
        this.totalPages= data.totalPages;
      });
  }

  handleSeacrhedProducts() {
    this.searchKeyword = this.route.snapshot.paramMap.get('keyword')!;

    this.service.getSearchedProducts(this.searchKeyword,this.thePageNumber-1,this.thePageSize)
    .subscribe((data) => {
      this.products = data.content;
      this.thePageNumber = data.number+1; // the number of page 
      this.thePageSize = data.size;
      this.totalElements = data.totalElements;
      this.totalPages= data.totalPages;
    });
  }

  updatePageSize(thePageSize: string) {
      this.thePageSize =+ thePageSize;
      this.thePageNumber = 1;
      this.listOfProducts();
  }

  addToCart(theProduct :Product){
    const cartItem = new CartItem(theProduct);
    this.cartService.addToCart(cartItem);
  }
}
