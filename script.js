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
}

/*function purchaseClicked() {
  // Show alert when purchase is made
  alert("Thank you for your purchase");
  // Select cart items container
  var cartItems = document.getElementsByClassName("cart-items")[0];
  // Remove all child elements (clear the cart)
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  // Update the total price after clearing the cart
  updateCartTotal();
}*/

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

/*function addToCartClicked(event) {
  // Get the clicked button
  var button = event.target;
  // Get the parent shop item container
  var shopItem = button.parentElement.parentElement;
  // Get item title, price, and image source
  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
  // Add item to the cart
  addItemToCart(title, price, imageSrc);
  // Update the total price after adding an item
  updateCartTotal();
}*/

function addToCartClicked(event) {
  var button = event.target;
  var shopItem = button.closest(".shop-item"); // Finds the closest parent with class 'shop-item'

  var title = shopItem.querySelector(".shop-item-title").innerText;
  var price = shopItem.querySelector(".shop-item-price").innerText;
  var imageSrc = shopItem.querySelector(".shop-item-image").src;

  addItemToCart(title, price, imageSrc);
  updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
  var cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (var i = 0; i < cartItemNames.length; i++) {
    if (
      cartItemNames[i].innerText.replace(/\s+/g, " ").trim() ===
      title.replace(/\s+/g, " ").trim()
    ) {
      alert("This item is already added to the cart");
      return;
    }
  }

  // Create HTML structure for the cart row
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

  // Insert the cart row into the cart items container
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);

  // Add event listeners to new remove button and quantity input
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
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

document
  .getElementById("calculate-change")
  .addEventListener("click", function () {
    var cartItems = document.getElementsByClassName("cart-items")[0];
    if (!cartItems.hasChildNodes()) {
      document.getElementById("change-output").innerText =
        "Your cart is empty! Add items before calculating change.";
      document.getElementById("change-output").style.color = "red";
      return;
    }

    var totalPrice = parseFloat(
      document.querySelector(".cart-total-price").innerText.replace("$", "")
    );
    var amountPaid = parseFloat(document.getElementById("amount-paid").value);

    if (isNaN(amountPaid) || amountPaid < totalPrice) {
      document.getElementById("change-output").innerText =
        "Insufficient amount paid!";
      document.getElementById("change-output").style.color = "red";
      return;
    }

    var change = amountPaid - totalPrice;
    var denominations = [100, 50, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
    var changeBreakdown = "Change: $" + change.toFixed(2) + "\n";

    denominations.forEach((denom) => {
      if (change >= denom) {
        var count = Math.floor(change / denom);
        change -= count * denom;
        change = Math.round(change * 100) / 100; // Fix floating-point issues
        changeBreakdown += `${count} x $${denom.toFixed(2)}\n`;
      }
    });

    document.getElementById("change-output").innerText = changeBreakdown;
  });
