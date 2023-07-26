document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCart', function () {
    return {
      showCart: false,         // Show cart flag
      makePayment: false,     // Make payment flag
      userHistory: '',        // User cart history
      pizzaTypes: [],         // Various pizza types
      featuredpizzasList: [], // Featured pizzas list
      cartId: '',             // Cart ID
      cart: { total: 0 },     // User's shopping cart
      checkOutMessage: '',    // Checkout message
      openHistory: false,     // Flag to open cart history
      Amount: 0,              // Payment amount
      counter: 0,             // Counter for pizzas
      hideCart: false,        // Hide cart flag
      username: '',           // User's username
      pepperoniPizza: 0,      // Count for pepperoni pizza

      init() {
        axios
          .get('https://pizza-api.projectcodex.net/api/pizzas')
          .then((result) => {
            this.pizzaTypes = result.data.pizzas; // Get various pizza types from API
          })
          .then(() => {
            this.username = localStorage['username'];
            this.cart_id = localStorage['cart_id'];
            this.featuredPizzas(); // Fetch featured pizzas
            this.getUserHistory(); // Fetch user cart history
            return this.createCart(); // Create user's cart
          });
      },

      featuredPizzas() {
        return axios
          .get(`https://pizza-api.projectcodex.net/api/pizzas/featured?username=${this.username}`)
          .then((result) => {
            this.featuredpizzasList = result.data; // Get featured pizzas
            console.log(this.featuredpizzasList);
          });
      },

      postfeaturedPizzas(pizza) {
        return axios
          .post('https://pizza-api.projectcodex.net/api/pizzas/featured', {
            "username": this.username,
            "pizza_id": pizza
          })
          .then((result) => {
            console.log(result.data);
          })
          .then(() => {
            return this.featuredPizzas();
          });
      },

      createCart() {
        if (!this.username) {
          return; // If no username, return
        }

        const username = localStorage['username'];
        const cartId = localStorage['cartId'];

        if (cartId && username) {
          this.cartId = cartId;
          this.username = username;
        } else {
          return axios
            .get(`https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`)
            .then((result) => {
              this.cartId = result.data.cart_code;
              console.log(this.cartId);
              localStorage['cartId'] = this.cartId;
              localStorage['username'] = this.username;
            });
        }
      },

      getUserHistory() {
        axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/username/${this.username}`)
          .then((result) => {
            this.userHistory = result.data; // Get user's cart history
            console.log(result.data);
          });
      },

      showCartContent() {
        const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;

        axios
          .get(url)
          .then((result) => {
            this.cart = result.data; // Show user's cart content
          });
      },

      buyPizza(pizza) {
        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
            cart_code: this.cartId,
            pizza_id: pizza.id
          })
          .then(() => {
            this.counter++;
            this.message = "Pizza has been ADDED to the cart.";
            this.showCartContent();
          });
      },

      removePizza(pizza) {
        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
            cart_code: this.cartId,
            pizza_id: pizza.id
          })
          .then(() => {
            this.counter--;
            this.message = "Pizza has REMOVED from the cart";
            this.showCartContent();
          });
      },

      payment(pizza) {
        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', {
            cart_code: this.cartId,
          })
          .then(() => {
            if (this.Amount >= this.cart.total) {
              this.checkOutMessage = 'Payment Successful!';
              this.change = this.Amount - this.cart.total;
              setTimeout(() => {
                this.cart.total = 0;
                this.checkOutMessage = '';
                this.cartId = '';
                localStorage['cartId'] = '';
                this.username = localStorage['username'];
                window.location.reload();
                this.createCart();
              }, 5000);
            } else if (this.Amount < this.cart.total) {
              this.checkOutMessage = 'Unfortunately, you have insufficient funds.';
              setTimeout(() => {
                this.checkOutMessage = '';
              }, 4000);
            }
          });
      },

      login() {
        if (this.username.length > 5) {
          this.createCart();
          alert("Greetings");
        } else {
          alert("This is too short to process.");
        }
      },

      logout() {
        if (confirm("Logging out..?") == true) {
          this.cart_id = '';
          this.username = '';
          this.name = '';
          localStorage['username'] = '';
        } else {
          this.cart_id = localStorage['cart_id'];
          this.username = localStorage['username'];
        }
      }
    };
  });
});
