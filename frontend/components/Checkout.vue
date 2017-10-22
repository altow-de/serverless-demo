<template>
  <div>
    <div v-show="show">
      <h2>dyndns dienst freischalten</h2>
      <p>für nur 3,99€</p>
      <form v-on:submit.prevent.capture="onSubmit" ref="checkout">
      </form>
    </div>
  </div>
</template>

<script>
import * as API from '../lib/API'
import Conf from '../../conf.json'
export default {
  data () {
    return {
      show: true
    }
  },
  methods: {
    onSubmit() { }
  },
  async mounted () {
    if (window.location.search.indexOf("stripeToken") === -1 ) {
      const buyScript = document.createElement('script');
      buyScript.setAttribute('src', "https://checkout.stripe.com/checkout.js")
      buyScript.setAttribute('class', "stripe-button")
      buyScript.setAttribute('data-key', Conf.STRIPE_PUBLISHABLE_KEY)
      buyScript.setAttribute('data-amount', "399")
      buyScript.setAttribute('data-name', "Stripe.com")
      buyScript.setAttribute('data-description', "Widget")
      buyScript.setAttribute('data-image', "https://stripe.com/img/documentation/checkout/marketplace.png")
      buyScript.setAttribute('data-locale', "auto")
      buyScript.setAttribute('data-zip-code', "true")
      this.$refs['checkout'].appendChild(buyScript)
    } else {
      this.show = false 
      await API.buy(window.location.search)
      window.location.href = '/' 
    }

  }
}
</script>
