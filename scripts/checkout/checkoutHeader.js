import { cart } from "../../data/cart-class.js";

export function renderCheckoutHeader() {
    const headerTotalItemsElement = document.querySelector('.js-checkout-header-middle-section');
    headerTotalItemsElement.innerHTML = `
    Checkout (<a class="return-to-home-link" href="./">
        ${cart.calculateCartQuantity()} items
    </a>)`;
}