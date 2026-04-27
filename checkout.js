document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const itemsContainer = document.getElementById("checkoutItems");
  const totalContainer = document.getElementById("checkoutTotal");
  const paypalContainer = document.getElementById("paypal-button-container");

  // ─── CALCULATE TOTAL ───
  function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  // ─── RENDER CHECKOUT ITEMS ───
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

  // ─── PAYPAL BUTTON ───
  function loadPayPal() {
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: getTotal().toFixed(2),
                },
              },
            ],
          });
        },

        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert(
              "Payment successful! " + details.payer.name.given_name
            );

            localStorage.removeItem("cart");
            window.location.href = "/success.html";
          });
        },
      })
      .render("#paypal-button-container");
  }

  renderCheckout();
  loadPayPal();
});
