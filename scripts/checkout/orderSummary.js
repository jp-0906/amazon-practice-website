import { products } from '../../data/products.js';
import { cart } from '../../data/cart-class.js';
import { deliveryOptions, getDeliveryDays } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export function renderOrderSummary() {
    const orderSummaryElement = document.querySelector('.js-order-summary');
    orderSummaryElement.innerHTML = '';

    cart.cartItems.forEach(cartItem => {
        const { productId, quantity, deliveryOptionId } = cartItem
        orderSummaryElement.innerHTML += checkOutItemHTMLTemplate(productId, quantity, deliveryOptionId);
    });

    if (cart.cartItems.length === 0) {
        orderSummaryElement.innerHTML = emptyCartHTMLTemplate();
        return;
    }

    setCartContainerEvents();
}

function setCartContainerEvents() {
    const cartContainerElement = document.querySelectorAll('.js-cart-item-container');

    cartContainerElement.forEach(cartContainer => {
        const { productId } = cartContainer.dataset;
        const updateButtonElement = cartContainer.querySelector('.js-update-quantity');
        const saveButtonElement = cartContainer.querySelector('.js-save-quantity');
        const deleteButtonElement = cartContainer.querySelector('.js-delete-quantity');
        const deliveryOptions = cartContainer.querySelectorAll(`[name="${productId}-delivery-option"]`);

        updateButtonElement.addEventListener('click', () => {
            const quantityLabelElement = cartContainer.querySelector('.js-quantity-label');
            const quantityInputElement = cartContainer.querySelector('.js-new-quantity-input');
            const saveButtonElement = cartContainer.querySelector('.js-save-quantity');

            updateButtonElement.classList.add('hidden');
            quantityLabelElement.classList.add('hidden');
            quantityInputElement.classList.remove('hidden');
            saveButtonElement.classList.remove('hidden');
            quantityInputElement.value = quantityLabelElement.innerHTML;

            quantityInputElement.addEventListener('keydown', event => {
                if (event.key === 'Enter') {
                    saveQuantity(productId, cartContainer, updateButtonElement);
                }
            });
        });

        saveButtonElement.addEventListener('click', () => {
            saveQuantity(productId, cartContainer, updateButtonElement);
        });

        deleteButtonElement.addEventListener('click', () => {
            cart.removeProductFromCart(productId);
            renderOrderSummary();
            renderPaymentSummary();
            renderCheckoutHeader();
        });
        
        deliveryOptions.forEach(option => {
            option.addEventListener('change', () => {
                setDeliveryDate(cartContainer, option.id);
                cart.updateDeliveryOptions(productId, option.id);
                renderPaymentSummary();
                renderCheckoutHeader();
            });
        });
    });
}

function saveQuantity(productId, cartContainer, updateButtonElement) {
    const quantityLabelElement = cartContainer.querySelector('.js-quantity-label');
    const quantityInputElement = cartContainer.querySelector('.js-new-quantity-input');
    const saveButtonElement = cartContainer.querySelector('.js-save-quantity');
    const validationLabel1Element = cartContainer.querySelector('.js-validation-label-1');
    const validationLabel2Element = cartContainer.querySelector('.js-validation-label-2');

    validationLabel1Element.classList.add('hidden');
    validationLabel2Element.classList.add('hidden');

    if (Number(quantityInputElement.value) < 1) {
        validationLabel1Element.classList.remove('hidden');
        return;
    }
    else if (Number(quantityInputElement.value) > 999) {
        validationLabel2Element.classList.remove('hidden');
        return;
    }

    updateButtonElement.classList.remove('hidden');
    quantityLabelElement.classList.remove('hidden');
    quantityInputElement.classList.add('hidden');
    saveButtonElement.classList.add('hidden');

    quantityLabelElement.innerHTML = quantityInputElement.value;

    cart.addToCart(productId, quantityInputElement.value, true);
    renderPaymentSummary();
    renderCheckoutHeader();
}

function setDeliveryDate(cartContainer, deliveryOptionId) {
    const deliveryDateElement = cartContainer.querySelector('.js-delivery-date');
    const deliveryDate = dayjs().add(getDeliveryDays(deliveryOptionId), 'days').format('dddd, MMMM D');
    deliveryDateElement.innerHTML = `Delivery date: ${deliveryDate}`;
}

function checkOutItemHTMLTemplate(productId, quantity, deliveryOptionId) {
    let matchingItem
    products.forEach(product => {
        if (product.id === productId) {
            matchingItem = product;
            return;
        }
    });

    const { 
        image, 
        name, 
        priceCents,
    } = matchingItem;

    const price = formatCurrency(priceCents);
    const HTMLTemplate = `
        <div class="cart-item-container js-cart-item-container" data-product-id="${productId}">
            <div class="delivery-date js-delivery-date">
                Delivery date: ${dayjs().add(getDeliveryDays(deliveryOptionId), 'days').format('dddd, MMMM D')}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${image}">

                <div class="cart-item-details">
                <div class="product-name js-product-name">
                    ${name}
                </div>
                <div class="product-price js-product-price">
                    ${matchingItem.getPrice()}
                </div>
                <div class="product-quantity js-product-quantity">
                    <span>
                        Quantity: <span class="quantity-label js-quantity-label">${quantity}</span>
                        <input class="new-quantity-input hidden js-new-quantity-input" 
                        type="number" 
                        name="quantity" 
                        min="1" 
                        max="999"
                        value="${quantity}">
                    </span>
                    <span class="update-quantity-link link-primary js-update-quantity">
                        Update
                    </span>
                    <span class="save-quantity-link link-primary js-save-quantity hidden">
                        Save
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-quantity">
                        Delete
                    </span>
                </div>
                    <div class="validation-label-1 hidden js-validation-label-1">
                        Quantity can't be less than 1
                    </div>
                    <div class="validation-label-2 hidden js-validation-label-2">
                        Quantity can't be greater than 999
                    </div>
                </div>
                ${deliveryOptionsHTMLTemplate(deliveryOptionId, productId)}
            </div>
        </div>
    `

    return HTMLTemplate;
}

function deliveryOptionsHTMLTemplate(deliveryOptionId, productId) {
    let HTMLTemplate = '';

    deliveryOptions.forEach(deliveryOption => {
        let { id, deliveryDays, priceCents } = deliveryOption;
        deliveryDays = getDeliveryDays(id);
        HTMLTemplate += `
            <div class="delivery-option">
                <input type="radio" ${id === deliveryOptionId ? 'checked' : ''}
                class="delivery-option-input"
                id="${id}"
                name="${productId}-delivery-option">
                <div>
                    <div class="delivery-option-date">
                        ${dayjs().add(deliveryDays, 'days').format('dddd, MMMM D')}
                    </div>
                    <div class="delivery-option-price">
                        ${priceCents === 0 ? 'FREE' : `$${formatCurrency(priceCents)} -`} Shipping
                    </div>
                </div>
            </div>
        `;
    });

    HTMLTemplate = `
        <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            ${HTMLTemplate}
        </div>
    `

    return HTMLTemplate;
}

function emptyCartHTMLTemplate() {
    const HTMLTemplate = `
        <div class="empty-cart-message">
            Your cart is empty.
        </div>
        <a class="button-primary view-products-link" href="./">
            View products
        </a>
    `;

    return HTMLTemplate;
}
