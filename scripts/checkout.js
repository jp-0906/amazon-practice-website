import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { renderCheckoutHeader } from './checkout/checkoutHeader.js';
import { loadProducts, loadProductsFetch } from '../data/products.js';
import { loadCart, loadCartFetch } from '../data/cart.js';
// import '../data/cart-class.js';
// import '../data/car.js';
// import '../data/backend-practice.js';

loadPage();

async function loadPage() {
    try {
        // throw 'error1';

        const values = await Promise.all([
            loadProductsFetch().then(() => 'value1'),
            loadCartFetch()
        ]);

        console.log(values);
    }
    catch (error) {
        console.log('Unexpected error. Please try again later.');
    }
    

    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();
}

/*
Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })
]).then((values) => {
    console.log(values);
    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();
});
*/

/*
loadProducts(() => {
    loadCarts(() => {
        renderOrderSummary();
        renderPaymentSummary();
        renderCheckoutHeader();
    });
});
*/