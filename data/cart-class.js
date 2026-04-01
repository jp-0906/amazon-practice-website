export class Cart {
    cartItems;
    #localStorageKey;

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
        this.loadFromStorage();
    }

    loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
            deliveryOptionId: '1'
        },
        {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1,
            deliveryOptionId: '2'
        }];
    }

    saveToLocalStorage() {
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }

    clear() {
        this.cartItems = [];
        this.saveToLocalStorage();
    }

    addToCart(productId, quantity = 1, isUpdate = false) {
        let isNewItem = true;

        this.cartItems.forEach(cartItem => {
        if (cartItem.productId === productId) {
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
            this.cartItems.push({
                productId: productId,
                quantity: Number(quantity),
                deliveryOptionId: '1'
            })
        }

        this.saveToLocalStorage();
    }

    updateDeliveryOptions(productId, deliveryOptionId) {
        let isExisting = ['1', '2', '3'].includes(deliveryOptionId);

        if (!isExisting) return;
        isExisting = false;

        this.cartItems.forEach(cartItem => {
        if (cartItem.productId === productId) {
            cartItem.deliveryOptionId = deliveryOptionId;
            isExisting = true;
            return;
        }
        });

        if (!isExisting) return;

        this.saveToLocalStorage();
    }

    removeProductFromCart(productId) {
        let index;
        this.cartItems.forEach((cartItem, i) => {
            if (cartItem.productId === productId) {
                index = i;
                return;
            }
        });

        if (index === undefined) return;

        this.cartItems.splice(index, 1);

        this.saveToLocalStorage();
    }

    calculateCartQuantity() {
        let quantity = 0;

        this.cartItems.forEach(cartItem => {
            quantity += cartItem.quantity;
        });

        return quantity;
    }
}

export const cart = new Cart('amazon_cart_storage');

/*

const businessCart = new Cart('amazon_cart_storage_business_oop');

console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);
*/