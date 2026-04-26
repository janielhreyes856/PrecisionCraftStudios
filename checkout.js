<script src="checkout.js">
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const summary = document.getElementById("orderSummary");
const paypalContainer = document.getElementById("paypalFormContainer");

function renderOrder() {
  let total = 0;

  summary.innerHTML = cart.map(item => {
    total += item.price * item.quantity;

    return `
      <div class="checkout-item">
        ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
      </div>
    `;
  }).join("");

  summary.innerHTML += `<h3>Total: $${total.toFixed(2)}</h3>`;

  buildPayPalForm(cart);
}

function buildPayPalForm(cart) {
  let form = `
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post">
      <input type="hidden" name="cmd" value="_cart">
      <input type="hidden" name="upload" value="1">
      <input type="hidden" name="business" value="YOUR_PAYPAL_EMAIL@gmail.com">
  `;

  cart.forEach((item, index) => {
    let i = index + 1;

    form += `
      <input type="hidden" name="item_name_${i}" value="${item.name}">
      <input type="hidden" name="amount_${i}" value="${item.price}">
      <input type="hidden" name="quantity_${i}" value="${item.quantity}">
    `;
  });

  form += `
      <button type="submit" class="checkout-btn">
        Pay with PayPal
      </button>
    </form>
  `;

  paypalContainer.innerHTML = form;
}

renderOrder();
</script>
