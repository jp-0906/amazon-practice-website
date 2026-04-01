import { loadProductsFetch, OrderProduct } from "../data/products.js";
import { orders } from '../data/orders.js';
import { updateCartQuantity } from "./mainHeader.js";

loadPage();

async function loadPage() {
    await loadProductsFetch();
    renderTracking();
    updateCartQuantity();
}

function renderTracking() {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId');
    const trackingProduct = new OrderProduct(orders.getOrderProduct(orders.getOrder(orderId), productId));

    const mainContainer = document.querySelector('.main');
    mainContainer.innerHTML = generateTrackingHTMLTemplate(trackingProduct);
    setProgressBar(trackingProduct.deliveryDatePCT);
}

function generateTrackingHTMLTemplate(trackingProduct) {
    const { name, quantity, image, deliveryDatePCT } = trackingProduct;

    const HTMLTemplate = `
        <div class="order-tracking">
            <a class="back-to-orders-link link-primary" href="orders.html">
                View all orders
            </a>

            <div class="delivery-date">
                ${trackingProduct.getDeliveryDate(true)}
            </div>

            <div class="product-info">
                ${name}
            </div>

            <div class="product-info">
                Quantity: ${quantity}
            </div>

            <img class="product-image" src="${image}">

            <div class="progress-labels-container">
                <div class="progress-label ${deliveryDatePCT <= 49 ? 'current-status' : ''}">
                    Preparing
                </div>
                <div class="progress-label ${deliveryDatePCT >= 50 && deliveryDatePCT <= 99 ? 'current-status' : ''}">
                    Shipped
                </div>
                <div class="progress-label ${deliveryDatePCT >= 100 ? 'current-status' : ''}">
                    Delivered
                </div>
            </div>

            <div class="progress-bar-container">
                <div class="progress-bar js-progress-bar"></div>
            </div>
        </div>
    `;

    return HTMLTemplate;
}

function setProgressBar(pct) {
    const progressBar = document.querySelector('.js-progress-bar');
    progressBar.style.width = '0';

    setTimeout(() => {
        progressBar.style.width = `${pct}%`;
    }, 300);
}