import { cart } from '../data/cart-class.js';

export function updateCartQuantity() {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  cartQuantityElement.innerHTML = cart.calculateCartQuantity(); 
}