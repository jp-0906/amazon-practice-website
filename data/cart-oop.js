function Cart(localStorageKey) {
    const cart = {
        cartItems: undefined,
        LOCAL_STORAGE: localStorageKey,
        loadFromStorage() {
            this.cartItems = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE)) || [{
                id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                quantity: 2,
                deliveryOptionId: '1'
            },
            {
                id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                quantity: 1,
                deliveryOptionId: '2'
            }];
        },
        saveToLocalStorage() {
            localStorage.setItem(this.LOCAL_STORAGE, JSON.stringify(this.cartItems));
        },
        addToCart(productId, quantity, isUpdate = false) {
            let isNewItem = true;

            this.cartItems.forEach(cartItem => {
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
                this.cartItems.push({
                    id: productId,
                    quantity: Number(quantity),
                    deliveryOptionId: '1'
                })
            }

            this.saveToLocalStorage();
        },
        updateDeliveryOptions(productId, deliveryOptionId) {
            let isExisting = ['1', '2', '3'].includes(deliveryOptionId);

            if (!isExisting) return;
            isExisting = false;

            this.cartItems.forEach(cartItem => {
            if (cartItem.id === productId) {
                cartItem.deliveryOptionId = deliveryOptionId;
                isExisting = true;
                return;
            }
            });

            if (!isExisting) return;

            this.saveToLocalStorage();
        },
        removeProductFromCart(productId) {
            let index;
            this.cartItems.forEach((cartItem, i) => {
                if (cartItem.id === productId) {
                    index = i;
                    return;
                }
            });

            if (index === undefined) return;

            this.cartItems.splice(index, 1);

            this.saveToLocalStorage();
        },
        calculateCartQuantity() {
            let quantity = 0;

            this.cartItems.forEach(cartItem => {
                quantity += cartItem.quantity;
            });

            return quantity;
        }
    };

    return cart;
}

const cart = Cart('amazon_cart_storage_oop');
const businessCart = Cart('amazon_cart_storage_business_oop');

cart.loadFromStorage();
businessCart.loadFromStorage();

console.log(cart);
console.log(businessCart);