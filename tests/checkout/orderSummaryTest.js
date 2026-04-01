import { renderOrderSummary } from '../../scripts/checkout/orderSummary.js';
import { cart } from '../../data/cart-class.js';
import { products, loadProducts, loadProductsFetch } from '../../data/products.js';
import { formatCurrency } from '../../scripts/utils/money.js';

const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

describe('test suite: renderOrderSummary', () => {
    beforeAll(async () => {
        await loadProductsFetch();
    });

    beforeEach(() => {
        document.querySelector('.js-test-container').innerHTML = `
            <div class="js-order-summary"></div>
            <div class="js-payment-summary"></div>
            <div class="js-checkout-header-middle-section"></div>
        `;

        spyOn(localStorage, 'setItem');
        
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: productId1,
                quantity: 2,
                deliveryOptionId: '1'
            },
            {
                productId: productId2,
                quantity: 1,
                deliveryOptionId: '2'
            }]);
        });

        cart.loadFromStorage();
        renderOrderSummary();
    });

    afterEach(() => {
        document.querySelector('.js-test-container').innerHTML = ``;
    });

    it('displays the cart', () => {
        const cartContainers = document.querySelectorAll('.js-cart-item-container');
        cartContainers.forEach((cartContainer, index) => {
            const { productId } = cartContainer.dataset;
            const productNameElement = cartContainer.querySelector('.js-product-name');
            const productPriceElement = cartContainer.querySelector('.js-product-price');
            const productQuantityElement = cartContainer.querySelector('.js-product-quantity');
            const checkedDeliveryOptionElement = cartContainer.querySelector(`[name="${productId}-delivery-option"]:checked`);
            const productName = products.filter(product => product.id === productId)[0].name;
            const productPrice = formatCurrency(products.filter(product => product.id === productId)[0].priceCents);

            expect(productNameElement.innerText).toEqual(productName);
            expect(productPriceElement.innerText).toEqual(`$${productPrice}`);
            expect(productQuantityElement.innerText).toContain(`Quantity: ${cart.cartItems[index].quantity}`);
            expect(productId).toEqual(cart.cartItems[index].productId);
            expect(checkedDeliveryOptionElement.id).toEqual(cart.cartItems[index].deliveryOptionId);
        });

        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(2);
    });

    it('removes a product', () => {
        const cartContainers = document.querySelectorAll('.js-cart-item-container');
        cartContainers.forEach((cartContainer, index) => {
            if (index === 0) {
                const deleteLinkElement = cartContainer.querySelector('.js-delete-quantity');
                deleteLinkElement.click();
            }
        });

        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(1);
        expect(
            document.querySelector(`.js-cart-item-container[data-product-id="${productId1}"]`)
        ).toEqual(null);
        expect(
            document.querySelector(`.js-cart-item-container[data-product-id="${productId2}"]`)
        ).not.toEqual(null);
        expect(cart.cartItems.length).toEqual(1);
        expect(cart.cartItems[0].productId).toEqual(productId2);
    });

    it('updates the delivery option', () => {
        const cartContainers = document.querySelectorAll('.js-cart-item-container');
        cartContainers.forEach((cartContainer, index) => {
            const { productId } = cartContainer.dataset;
            console.log(cartContainers);
            if (index === 0) {
                const deliveryOptions = cartContainer.querySelectorAll(`[name="${productId}-delivery-option"]`);
                let checkedDeliveryOption;
                console.log(deliveryOptions);
                deliveryOptions.forEach(deliveryOption => {
                    if (deliveryOption.id === '3') {
                        console.log(deliveryOption.id);
                        deliveryOption.click();
                        checkedDeliveryOption = deliveryOption;
                    }
                });

                const array = [];

                expect(checkedDeliveryOption.id).toEqual('3');
                expect(checkedDeliveryOption.checked).toEqual(true);
            }
        });

        const shippingPriceElement = document.querySelector('.js-total-shipping');
        const totalAmountElement = document.querySelector('.js-total-amount');

        expect(shippingPriceElement.innerText).toEqual('$14.98');
        expect(totalAmountElement.innerText).toEqual('$63.50');
    });
});