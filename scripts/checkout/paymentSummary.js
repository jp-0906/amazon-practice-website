import { products } from '../../data/products.js';
import { cart } from "../../data/cart-class.js";
import { formatCurrency } from '../utils/money.js';
import { getDeliveryPrice } from '../../data/deliveryOptions.js';
import { orders } from '../../data/orders.js';

const TAX = 0.10;

export function renderPaymentSummary() {
    const totalItems = cart.calculateCartQuantity();
    let totalBeforeShipping = 0;
    let totalShipping = 0;
    let totalBeforeTax = 0;
    let totalTax = 0;
    let totalAmount = 0;
    cart.cartItems.forEach(cartItem => {
        const { productId, quantity, deliveryOptionId } = cartItem;

        totalBeforeShipping += getItemTotalAmount(productId, quantity);
        totalShipping += getDeliveryPrice(deliveryOptionId);
    });

    totalBeforeTax = totalBeforeShipping + totalShipping;
    totalTax = totalBeforeTax * TAX;
    totalAmount = formatCurrency(totalBeforeTax + totalTax);
    totalTax = formatCurrency(totalTax);
    totalBeforeTax = formatCurrency(totalBeforeTax);
    totalShipping = formatCurrency(totalShipping);
    totalBeforeShipping = formatCurrency(totalBeforeShipping);

    const paymentSummaryElement = document.querySelector('.js-payment-summary');

    paymentSummaryElement.innerHTML = paymentSummaryHTMLTemplate(totalItems, 
        totalBeforeShipping,
        totalShipping,
        totalBeforeTax,
        totalTax,
        totalAmount
    );

    const placeOrderButtonElement = document.querySelector('.js-place-order-button');

    if (totalItems <= 0) {
        placeOrderButtonElement.classList.add('disabled');
        return;
    }

    placeOrderButtonElement.addEventListener('click', async () => {
        try {
            const response = await fetch('https://supersimplebackend.dev/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cart: cart.cartItems
                })
            });

            const order = await response.json();
            orders.addOrder(order);
        }
        catch(error) {
            console.log('Unexpected error. Please try again later.');
        }

        cart.clear();
        window.location.href = 'orders.html';
    });
}

function getItemTotalAmount(id, quantity) {
    let total = 0;
    products.forEach(product => {
       if (product.id === id) {
        total = product.priceCents;
        return;
       } 
    });

    return total * quantity;
}

function paymentSummaryHTMLTemplate(totalItems, 
    totalBeforeShipping, 
    totalShipping, 
    totalBeforeTax, 
    totalTax, 
    totalAmount) {
    const HTMLTemplate = `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${totalItems}):</div>
            <div class="payment-summary-money js-total-before-shipping">$${totalBeforeShipping}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money js-total-shipping">$${totalShipping}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money js-total-before-tax">$${totalBeforeTax}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money js-total-tax">$${totalTax}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money js-total-amount">$${totalAmount}</div>
        </div>

        <button class="place-order-button button-primary js-place-order-button">
            Place your order
        </button>
    `;

    return HTMLTemplate;
}