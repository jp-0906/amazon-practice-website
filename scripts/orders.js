import { orders } from '../data/orders.js';
import { loadProductsFetch, OrderProduct } from '../data/products.js';
import { cart } from '../data/cart-class.js';
import { updateCartQuantity } from './mainHeader.js';

loadPage();

async function loadPage() {
    await loadProductsFetch();
    renderOrders();
    updateCartQuantity();
}

function renderOrders() {
    const ordersGrid = document.querySelector('.js-orders-grid');
    orders.orderItems.forEach((orderItem) => {
        ordersGrid.innerHTML += generateOrderHTMLTemplate(orderItem);
    });

    setOrderEvents();
}

function setOrderEvents() {
    const orderContainers = document.querySelectorAll('.js-order-container');
    orderContainers.forEach(orderContainer => {
        const { orderId } = orderContainer.dataset;
        const productDetails = orderContainer.querySelectorAll('.js-product-details');
        const productActions = orderContainer.querySelectorAll('.js-product-actions');

        productActions.forEach(productAction => {
            const { productId } = productAction.dataset;
            const trackingButton = productAction.querySelector('.js-track-package-button');
            trackingButton.addEventListener('click', () => {
                window.location.href = `tracking.html?orderId=${orderId}&productId=${productId}`;
            });
        });

        productDetails.forEach(productDetail => {
            const { productId } = productDetail.dataset;
            const buyButton = productDetail.querySelector('.js-buy-again-button');
            let messageTimeoutId;
            buyButton.addEventListener('click', () => {
                clearTimeout(messageTimeoutId);
                buyButton.classList.remove('buy-again');
                buyButton.classList.add('added');
                messageTimeoutId = setTimeout(() => {
                    buyButton.classList.add('buy-again');
                    buyButton.classList.remove('added');
                }, 1000);

                cart.addToCart(productId);

                updateCartQuantity();
            })
        });
    });
}

function generateOrderHTMLTemplate(orderItem) {
    console.log(orderItem);
    const { id, products, price, orderDate } = orderItem;
    const HTMLTemplate = `
        <div class="order-container js-order-container" data-order-id=${id}>
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderDate}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>${price}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            
            ${generateProductsHTMLTemplate(products, id)}
          </div>
        </div>
    `;

    return HTMLTemplate;
}

function generateProductsHTMLTemplate(products) {
    let HTMLTemplate = '';
    console.log(products);
    products = products.map(product => new OrderProduct(product));
    products.forEach(product => {
        const { id, quantity, name, image } = product;
        HTMLTemplate += `
            <div class="product-image-container">
                <img src="${image}">
            </div>

            <div class="product-details js-product-details" data-product-id="${id}">
                <div class="product-name">
                    ${name}
                </div>
                <div class="product-delivery-date">
                    ${product.getDeliveryDate()}
                </div>
                <div class="product-quantity">
                    Quantity: ${quantity}
                </div>
                <button class="buy-again-button button-primary buy-again js-buy-again-button">
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                    <span class="added-message">✓ Added</span>
                </button>
            </div>

            <div class="product-actions js-product-actions" data-product-id="${id}">
                <button class="track-package-button button-secondary js-track-package-button">
                    Track package
                </button>
            </div>

        `;
    });

    return HTMLTemplate;
}