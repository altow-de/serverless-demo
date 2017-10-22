<template>
  <div class="container">
    <div class="jumbotron">
      <h1 class="display-3">your Dyndns!</h1>
      <p class="lead" @click="updateList()">use it, (it is cheap)!</p>
      <p>
        <a class="btn btn-success btn-lg" v-if="!authenticated"  @click="login()" href="#" role="button">Signup</a>
        <a class="btn btn-primary btn-lg" v-if="!authenticated"  @click="login()" href="#" role="button">Login</a>
        <a class="btn btn-primary btn-lg" v-if="authenticated"  @click="logout()" href="#" role="button">Logout</a>
      </p>
    </div>
    <div v-if="authenticated && payer">

      <a @click="addItem()" class="btn btn-primary btn-large" ><span class="glyphicon glyphicon-plus"></span></a>
      
      <form class="form well" v-if="upsert">
        <div class="form-group">
          <label>Subdomain</label>
          <input class="form-control" v-model="domain">
        </div>
        <div class="form-group">
          <label>Address</label>
          <input class="form-control" v-model="address">
        </div>
        <div class="form-group">
          <label>UToken</label>
          <input class="form-control" v-model="utoken">
        </div>
        <div class="form-group">
          <label>PToken</label>
          <input class="form-control" v-model="ptoken">
        </div>
        <button @click.prevent="save({subdomain: domain, address, updateToken: `${utoken}:${ptoken}`})" class="btn btn-default">Save</button>
      </form>

      <table class="table table-striped">
        <thead>
          <tr><th>Domain</th><th>address</th><th>updatetoken</th><th>actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="domain in domains" :key="domain.subdomain">
            <td>{{domain.subdomain}}.{{conf.R53_HOSTED_ZONE}}</td>
            <td>{{domain.address}}</td>
            <td>{{domain.updateToken}}</td>
            <td>
              <span @click="editItem(domain)" class="glyphicon glyphicon-edit"></span>
              <span @click="remove(domain)" class="glyphicon glyphicon-remove"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <checkout v-show="authenticated && payer === false">

    </checkout>

  </div>
</template>

<script>

  import AuthService from '../lib/AuthService'
  import Conf from '../../conf'
  import * as API from '../lib/API'
  import Checkout from './Checkout.vue'
  
  const auth = new AuthService()
  const { login, logout, authenticated, authNotifier } = auth
  
  export default {
    components: { Checkout },
    data () {
      auth.handleAuthentication()
      authNotifier.on('authChange', authState => {
        this.authenticated = authState.authenticated
        this.updateUserInfo()
      })
      if (authenticated) {
        this.updateUserInfo()
      }
      return {
        conf:Conf,
        auth,
        authenticated,
        upsert: false,
        domain: '',
        address: '',
        utoken: '',
        ptoken: '',
        payer: null,
        domains: []
      }
    },
    methods: {
      login,
      logout,
      addItem() {
        this.upsert = true
        this.domain = ''
        this.address = ''
        this.utoken = ''
        this.ptoken = ''
      },
      editItem(domain) {
        this.upsert = true
        this.domain = domain.subdomain
        this.address = domain.address
        const token = atob(domain.updateToken).split(":")
        this.utoken = token[0]
        this.ptoken = token[1]
      },
      async save(domain) {
        domain.updateToken = btoa(domain.updateToken)
        await API.upsert(domain)
        this.upsert = false
        this.updateUserInfo()
      },
      async remove(domain) {
        await API.remove(domain)
        this.updateUserInfo()
      },
      async updateUserInfo () {
        this.domains = await API.getDomains()
        this.payer = (await API.getUser()).payer
      }
  }
  }
</script>

<style lang="scss">
  @import '~bootstrap/dist/css/bootstrap.min.css';
  body {
    padding-top: 40px;
  }
</style>