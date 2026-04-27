let cart = JSON.parse(localStorage.getItem("cart")) || [];

const itemsContainer = document.getElementById("checkoutItems");
const totalContainer = document.getElementById("checkoutTotal");

// ─── TOTAL CALCULATION ───
function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// ─── RENDER CART ───
function renderCheckout() {
  if (!cart.length) {
    itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalContainer.innerText = "Total: $0.00";
    return;
  }

  itemsContainer.innerHTML = cart
    .map(
      (item) =>
        `<div class="checkout-item">
          ${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}
        </div>`
    )
    .join("");

  totalContainer.innerText = "Total: $" + getTotal().toFixed(2);
}

// ─── CUSTOMER INFO ───
function getCustomerInfo() {
  return {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value
  };
}

// ─── PAYPAL BUTTON ───
function loadPayPal() {
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: getTotal().toFixed(2)
          }
        }]
      });
    },

    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {

        const order = {
          customer: getCustomerInfo(),
          cart: cart,
          payment: details,
          orderId: Date.now()
        };

        localStorage.setItem("lastOrder", JSON.stringify(order));
        localStorage.removeItem("cart");

        window.location.href = "/success.html";
      });
    }

  }).render("#paypal-button-container");
}

// ─── INIT ───
renderCheckout();
loadPayPal();
