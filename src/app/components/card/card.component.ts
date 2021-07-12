import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { AuthenticationService, AlertService } from '../../services';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  cardForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  cardList:any[] =[];
  enterCardArea= true;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    
    
  }

  ngOnInit() {
  
    this.cardForm = this.formBuilder.group({
      name: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('[0-9]{16}')]],
      expiryDate:['', [Validators.required, Validators.pattern('[0-1]{1}[0-9]{1}/[2]{1}[0]{1}[2]{1}[0-9]{1}')]]
    });

  
  
  }

  // convenience getter for easy access to form fields
  get f() { return this.cardForm.controls; }

  addCard(){
    this.cardList.push({
      name: this.f.name.value,
      cardNumber : this.f.cardNumber.value,
      expiryDate : this.f.expiryDate.value

    })
    this.f.name.reset();
    this.f.name.markAsPristine();
    this.f.cardNumber.reset();
    this.f.cardNumber.markAsPristine();
    this.f.expiryDate.reset();
    this.f.expiryDate.markAsPristine();
  }

  deleteCard(index:number){
    this.cardList.splice(index,1);
    if(this.cardList.length==0){
      this.enterCardArea= true;
      this.f.name.reset();
      this.f.name.markAsPristine();
      this.f.cardNumber.reset();
    this.f.cardNumber.markAsPristine();
    this.f.expiryDate.reset();
    this.f.expiryDate.markAsPristine();
    }
  }
  toggleCard(){
    this.enterCardArea= true;
   
  }

  
  onSubmit() {
    this.submitted = true;
    if(this.cardForm.valid){
      this.enterCardArea= false;
      this.addCard();
    }

  
    // stop here if form is invalid
    if (this.cardForm.invalid) {
      return;
    }

    this.loading = true;
  }

}
