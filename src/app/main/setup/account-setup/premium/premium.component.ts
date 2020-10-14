import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
declare var Stripe; // : stripe.StripeStatic;

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {

  @Input() amount: number;
  @Input() description: string;
  @ViewChild('cardElement') cardElement: ElementRef;

  stripe; // : stripe.Stripe;
  card;
  cardErrors;

  loading = false;
  confirmation;
  
  constructor() { }

  ngOnInit() {
    this.stripe = Stripe('pk_test_51H4kluDAYHPlNmPfjGyO6EQdHxrjiKXkhmLGux1B5PFwiO17ciZeCvXlOiKoZjiZb1YKy6IGBfNgJMzFzyXRd9hf00Eb3zXQQ1');
    const elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) => {
        this.cardErrors = error && error.message;
    });
  }

  async handleForm(e) {
    e.preventDefault();

    const { source, error } = await this.stripe.createSource(this.card);
    console.log(source);
    if (error) {
      console.log(error);
      // Inform the customer that there was an error.
      this.cardErrors = error.message;
    } else {
      // Send the token to your server.
      this.loading = true;
      console.log(source);
      // const user = await this.auth.getUser();
      // const fun = this.functions.httpsCallable('stripeCreateCharge');
      // this.confirmation = await fun({ source: source.id, uid: user.uid, amount: this.amount }).toPromise();
      this.loading = false;

    }
  }

  openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51H4kluDAYHPlNmPfjGyO6EQdHxrjiKXkhmLGux1B5PFwiO17ciZeCvXlOiKoZjiZb1YKy6IGBfNgJMzFzyXRd9hf00Eb3zXQQ1',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: 2000
    });

  }


}
