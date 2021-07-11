import { Component, OnInit, Input } from '@angular/core';
import { foodItem } from '../../interfaces';
import { CartService, AuthenticationService, AlertService, UserService } from '../../services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public cartItems: foodItem[] = [];
  public errorItem: boolean = false;
  public dishName2: any = null;
  public description2: any = null;
  public dishName3: any = null;
  public description3: any = null;

  constructor(
    private CartService: CartService, 
    private router: Router, 
    private alertService: AlertService,
) {

    
  }

  public ngOnInit(): void {

    this.cartItems = this.CartService.getCartItems();
  }

  public total(): number {
    return this.cartItems.reduce((total, item) => total + item.cost, 0);

  }


  public addToCart(item): void {
    if (this.cartItems.indexOf(item) === -1) {
      this.cartItems.push(item);
      this.errorItem = false;
    }
    else if (this.cartItems.indexOf(item) > -1) {
      this.errorItem = true;
    }
  }

  public placeOrder(): void {
    this.CartService.placeOrder(this.cartItems).subscribe(
      data => {
        this.alertService.success('Order Placed SuccessFully', true);
        if(this.cartItems[1]){
          this.dishName2 = this.cartItems[1].dishName;
          this.description2 = this.cartItems[1].description;
        }
        if(this.cartItems[2]){
          this.dishName3 = this.cartItems[2].dishName;
          this.description3 = this.cartItems[2].description;
        }
        this.router.navigate(['/home/track-order'],
        {
          queryParams:{
            dishName:  this.cartItems[0].dishName,
            description: this.cartItems[0].description,
            dishName2 : this.dishName2,
            description2: this.description2,
            dishName3 : this.dishName3,
            description3: this.description3,

          },
      

        }
        );
        this.CartService.emptyCart();
      },
      error => {
        this.alertService.error(error);
      });
  }


  public removeItem(item): void {
    var index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }
}
