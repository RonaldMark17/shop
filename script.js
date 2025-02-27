// Check if the document is still loading
if (document.readyState == "loading") {
  // If yes, wait until it is fully loaded before executing ready()
  document.addEventListener("DOMContentLoaded", ready);
} else {
  // If it's already loaded, execute ready() immediately
  ready();
}

function ready() {
  // Select all elements with class 'btn-danger' (remove buttons)
  var removeCartItemButtons = document.getElementsByClassName("btn-danger");
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    // Add click event listener to each remove button
    button.addEventListener("click", removeCartItem);
  }

  function addToCartClicked(event) {
    var button = event.target; // Gets the button that was clicked
    var shopItem = button.closest(".shop-item"); // Finds the closest parent element with class 'shop-item'

    // Extracts the item details: title, price, and image source
    var title = shopItem.querySelector(".shop-item-title").innerText; // Gets the item's title
    var price = shopItem.querySelector(".shop-item-price").innerText; // Gets the item's price
    var imageSrc = shopItem.querySelector(".shop-item-image").src; // Gets the item's image source

    // Calls a function to add the item to the cart
    addItemToCart(title, price, imageSrc);

    // Updates the total price of items in the cart
    updateCartTotal();
  }

  function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement("div"); // Creates a new div element for the cart row
    cartRow.classList.add("cart-row"); // Adds the "cart-row" class to the new div

    var cartItems = document.getElementsByClassName("cart-items")[0]; // Selects the container that holds cart items
    var cartItemNames = cartItems.getElementsByClassName("cart-item-title"); // Gets all item titles already in the cart

    // Loops through cart items to check if the item is already in the cart
    for (var i = 0; i < cartItemNames.length; i++) {
      if (
        cartItemNames[i].innerText.replace(/\s+/g, " ").trim() === // Cleans up spaces and trims the text
        title.replace(/\s+/g, " ").trim() // Compares the cleaned title to avoid duplicates
      ) {
        alert("This item is already added to the cart"); // Alerts the user if the item is already in the cart
        return; // Stops execution to prevent duplicate items
      }
    }

    // HTML structure for the cart row, including image, title, price, quantity input, and remove button
    var cartRowContents = `
      <div class="cart-item cart-column">
          <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
          <span class="cart-item-title">${title}</span>
      </div>
      <span class="cart-price cart-column">${price}</span>
      <div class="cart-quantity cart-column">
          <input class="cart-quantity-input" type="number" value="1">
          <button class="btn btn-danger" type="button">REMOVE</button>
      </div>
  `;

    cartRow.innerHTML = cartRowContents; // Inserts the HTML content into the new cart row
    cartItems.append(cartRow); // Appends the new cart row to the cart items container

    // Adds event listener to the "REMOVE" button to remove the item when clicked
    cartRow
      .getElementsByClassName("btn-danger")[0]
      .addEventListener("click", removeCartItem);

    // Adds event listener to the quantity input field to update total when changed
    cartRow
      .getElementsByClassName("cart-quantity-input")[0]
      .addEventListener("change", quantityChanged);
  }

  function updateCartTotal() {
    // Select the cart container
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    // Get all cart rows
    var cartRows = cartItemContainer.getElementsByClassName("cart-row");
    var total = 0;
    // Loop through all cart rows to calculate the total price
    for (var i = 0; i < cartRows.length; i++) {
      var cartRow = cartRows[i];
      var priceElement = cartRow.getElementsByClassName("cart-price")[0];
      var quantityElement = cartRow.getElementsByClassName(
        "cart-quantity-input"
      )[0];
      // Extract price and quantity values
      var price = parseFloat(priceElement.innerText.replace("$", ""));
      var quantity = quantityElement.value;
      // Calculate total price
      total = total + price * quantity;
    }
    // Round the total price to two decimal places
    total = Math.round(total * 100) / 100;
    // Update the total price in the cart
    document.getElementsByClassName("cart-total-price")[0].innerText =
      "$" + total;
  }

  function removeCartItem(event) {
    // Get the clicked button
    var buttonClicked = event.target;
    // Remove the parent row (cart item)
    buttonClicked.parentElement.parentElement.remove();
    // Update the total price after removing an item
    updateCartTotal();
  }

  function quantityChanged(event) {
    // Get the input field that triggered the event
    var input = event.target;
    // Ensure the quantity is a valid number greater than 0
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    // Update the total price after quantity change
    updateCartTotal();
  }

  // Select all quantity input fields
  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    // Add change event listener to each quantity input
    input.addEventListener("change", quantityChanged);
  }

  // Select all "Add to Cart" buttons
  var addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    // Add click event listener to each "Add to Cart" button
    button.addEventListener("click", addToCartClicked);
  }

  // Add click event listener to the purchase button
  document
    .getElementsByClassName("btn-purchase")[0]
    .addEventListener("click", purchaseClicked);

  function purchaseClicked() {
    var cartItems = document.getElementsByClassName("cart-items")[0];
    var totalPrice = parseFloat(
      document.querySelector(".cart-total-price").innerText.replace("$", "")
    );
    var amountPaid = parseFloat(document.getElementById("amount-paid").value);

    if (!cartItems.hasChildNodes()) {
      alert("Your cart is empty!");
      return;
    }

    if (isNaN(amountPaid) || amountPaid < totalPrice) {
      alert("Insufficient funds! Please enter a valid amount.");
      return;
    }

    alert("Thank you for your purchase");

    while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild);
    }

    updateCartTotal();

    // Clear the payment section
    document.getElementById("amount-paid").value = "";
    document.getElementById("change-output").innerText = "";
  }

  document
    .querySelector(".btn-purchase")
    .addEventListener("click", purchaseClicked);

  document
    .getElementById("calculate-change") // Selects the button with ID "calculate-change"
    .addEventListener("click", function () {
      // Adds a click event listener to the button
      var cartItems = document.getElementsByClassName("cart-items")[0]; // Gets the first element with class "cart-items"

      // Checks if the cart is empty
      if (!cartItems.hasChildNodes()) {
        document.getElementById("change-output").innerText =
          "Your cart is empty! Add items before calculating change."; // Displays an error message
        document.getElementById("change-output").style.color = "red"; // Sets text color to red
        return; // Stops execution
      }

      // Gets the total cart price, removing the dollar sign and converting it to a float
      var totalPrice = parseFloat(
        document.querySelector(".cart-total-price").innerText.replace("$", "")
      );

      // Gets the amount paid from the input field and converts it to a float
      var amountPaid = parseFloat(document.getElementById("amount-paid").value);

      // Checks if the input is a valid number
      if (isNaN(amountPaid)) {
        document.getElementById("change-output").innerText =
          "Please input amount paid first!"; // Displays an error message
        document.getElementById("change-output").style.color = "red"; // Sets text color to red
        return; // Stops execution
      }

      // Checks if the amount paid is less than the total price
      if (amountPaid < totalPrice) {
        document.getElementById("change-output").innerText =
          "Insufficient amount paid!"; // Displays an error message
        document.getElementById("change-output").style.color = "red"; // Sets text color to red
        return; // Stops execution
      }

      // Calculates the change to be given
      var change = amountPaid - totalPrice;

      // List of denominations (bills and coins)
      var denominations = [100, 50, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];

      // Initializes the change breakdown message
      var changeBreakdown = "Change: $" + change.toFixed(2) + "\n";

      // Loops through each denomination to determine how many of each to give
      denominations.forEach((denom) => {
        if (change >= denom) {
          // Checks if the change is greater than or equal to the current denomination
          var count = Math.floor(change / denom); // Determines how many of the current denomination fit into the change
          change -= count * denom; // Subtracts the used amount from change
          change = Math.round(change * 100) / 100; // Fixes floating-point precision issues
          changeBreakdown += `${count} x $${denom.toFixed(2)}\n`; // Adds the denomination count to the breakdown message
        }
      });

      // Displays the change breakdown on the webpage
      document.getElementById("change-output").innerText = changeBreakdown;
    });
}
