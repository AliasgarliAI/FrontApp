import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Routes } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { Resultstate } from '../common/resultstate';
import { Standartresponse } from '../common/standartresponse';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';
  private searchUrl = `${this.baseUrl}/search`;
  constructor(private httpClient: HttpClient) {}

  getProductListByCategory(
    currentCategoryId: number
  ): Observable<Standartresponse> {
    const searchUrl = `${this.searchUrl}/category/${currentCategoryId}`;
    return this.getResponse(searchUrl);
  }
  getProductList(): Observable<Standartresponse> {
    return this.getResponse(this.baseUrl);
  }

  getProductCategories(): Observable<Standartresponse> {
    return this.getResponse(this.categoryUrl);
  }

  getSearchedProducts(searchKeyword: string,thePageNumber:number,thePageSize:number): Observable<GetResponseProducts> {
    return  this.httpClient.get<GetResponseProducts>(`${this.searchUrl}?name=${searchKeyword}&page=${thePageNumber}&size=${thePageSize}`).pipe(map((response) => response));
  }

  getResponse(url: string){
    return this.httpClient
      .get<Standartresponse>(url)
      .pipe(map((response) => response));
  }

  getProduct(productId: number) {
    return  this.httpClient.get<Product>(`${this.baseUrl}/${productId}`).pipe(map((response) => response));
  }

  getProductListPaginate(theCategoryId:number,thePage :number,theSize :number): Observable<GetResponseProducts>{
     let url = `${this.baseUrl}/pages`
     console.log(theCategoryId);
    if(theCategoryId == 0){
        url+=`?page=${thePage}&size=${theSize}`
    }
    else{ 
        url+=`/${theCategoryId}?page=${thePage}&size=${theSize}`
    }
    
    return  this.httpClient.get<GetResponseProducts>(url).pipe(map((response) => response));
  }  

}

interface GetResponseProducts{
  content:Product[];
  totalElements:number;
  totalPages:number;
  size:number;
  number:number;
}