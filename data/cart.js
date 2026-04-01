import { deliveryOptions } from "./deliveryOptions.js";

const LOCAL_STORAGE = 'amazon_cart_storage';
export let cart; 

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE)) || [];
}

export function addToCart(productId, quantity, isUpdate = false) {
  let isNewItem = true;

  cart.forEach(cartItem => {
    if (cartItem.id === productId) {
      isNewItem = false;
      if (isUpdate) {
        cartItem.quantity = Number(quantity);
      }
      else {
        cartItem.quantity += Number(quantity);
      }
      return;
    }
  });

  if (isNewItem) {
    cart.push({
      id: productId,
      quantity: Number(quantity),
      deliveryOptionId: '1'
    })
  }
  
  saveToLocalStorage();
}

export function updateDeliveryOptions(productId, deliveryOptionId) {
  let isExisting = deliveryOptions.some(deliveryOptionIds => deliveryOptionIds.id === deliveryOptionId);

  if (!isExisting) return;
  isExisting = false;

  cart.forEach(cartItem => {
    if (cartItem.id === productId) {
      cartItem.deliveryOptionId = deliveryOptionId;
      isExisting = true;
      return;
    }
  });

  if (!isExisting) return;

  saveToLocalStorage();
}

export function removeProductFromCart(productId) {
  let index;
  cart.forEach((cartItem, i) => {
      if (cartItem.id === productId) {
          index = i;
          return;
      }
  });

  if (index === undefined) return;

  cart.splice(index, 1);

  saveToLocalStorage();
}

export function calculateCartQuantity() {
  let quantity = 0;
  
  cart.forEach(cartItem => {
    quantity += cartItem.quantity;
  });

  return quantity;
}

function saveToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE, JSON.stringify(cart));
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response);
    fun();
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

export async function loadCartFetch() {
  const response = fetch('https://supersimplebackend.dev/cart'
  ).then(response => {
    return response.text();
  }).then(text => {
    console.log(text);
    return text;
  });

  return response;
}