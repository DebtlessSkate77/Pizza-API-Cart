// When the Alpine.js is initialized, set up the data for the 'historicalWidget' component
document.addEventListener('alpine:init', () => {
  Alpine.data('historicalWidget', function () {
    return {
      // Initialize variables
      name: '',
      username: localStorage['username'],
      pizzas: [],
      showUserHistory: '',
      openUserHistory: false,

      // Initialization function for the component
      init() {
        // Fetch pizza data from the API
        axios
          .get('https://pizza-api.projectcodex.net/api/pizzas')
          .then((result) => {
            this.pizzas = result.data.pizzas;
          })
          .then(() => {
            // Call the function to fetch user's order history
            this.UserHistory();
          });
      },

      // Function to fetch user's order history
      UserHistory() {
        // Fetch the user's order history based on their username
        axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/username/${this.username}`)
          .then((result) => {
            // Store the user's order history data in the 'showUserHistory' variable
            this.showUserHistory = result.data;
            console.log(this.showUserHistory); // Log the fetched data to the console
          });
      },
    };
  });
});
