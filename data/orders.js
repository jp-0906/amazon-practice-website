import { formatCurrency } from '../scripts/utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

class Orders {
    orderItems;
    #localStorageKey;

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
        this.loadFromStorage();
    }

    addOrder(order) {
        this.orderItems.unshift(order);
        this.saveToStorage();
    }

    loadFromStorage() {
        this.orderItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
        this.orderItems.forEach((orderItem) => {
            const { totalCostCents, orderTime, products} = orderItem;
            orderItem['price'] = this.getPrice(totalCostCents);
            orderItem['orderDate'] = this.getDate(orderTime);
            orderItem['products'] = this.getDeliveryProgressPCT(products, orderTime);
        });
    }

    saveToStorage() {
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.orderItems));
    }

    getPrice(totalCostCents) {
        return `$${formatCurrency(totalCostCents)}`;
    }

    getDate(orderTime) {
        return `${dayjs(orderTime).format('MMMM D')}`;
    }

    getDeliveryProgressPCT(products, orderTime) {
        orderTime = dayjs(orderTime);
        const currentTime = dayjs().diff(orderTime);

        products.forEach(product => {
            const { estimatedDeliveryTime } = product;
            const deliveryTime = dayjs(estimatedDeliveryTime).diff(orderTime);
            product['deliveryDatePCT'] = Math.round(((currentTime / deliveryTime) * 100));
        });

        return products;
    }

    getOrder(orderId) {
        let matchingOrder;

        this.orderItems.forEach(orderItem => {
            if (orderId === orderItem.id) {
                matchingOrder = orderItem;
                return;
            }
        });

        return matchingOrder;
    }

    getOrderProduct(matchingOrder, productId) {
        let matchingProduct;

        matchingOrder.products.forEach(product => {
            if (product.productId === productId) {
                matchingProduct = product;
                return;
            }
        });

        return matchingProduct;
    }
}

export const orders = new Orders('amazon_orders_storage');