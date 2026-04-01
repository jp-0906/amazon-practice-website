import { cart } from '../../data/cart-class.js';

const productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';

describe('test suite: addToCart', () => {
    beforeEach(() => {
        spyOn(localStorage, 'setItem');
    });

    it('adds a new product to the cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });
        cart.loadFromStorage();

        cart.addToCart(productId, 1);
        expect(cart.cartItems.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart.cartItems[0].productId).toEqual(productId);
        expect(cart.cartItems[0].quantity).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'amazon_cart_storage', 
            `[{"productId":"${productId}","quantity":1,"deliveryOptionId":"1"}]`
        );
    });
    it('adds an existing product to the cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: productId,
                quantity: 1,
                deliveryOptionId: '1'
            }]);
        });
        cart.loadFromStorage();

        cart.addToCart(productId, 1);
        expect(cart.cartItems.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart.cartItems[0].productId).toEqual(productId);
        expect(cart.cartItems.filter(cartItem => cartItem.productId === productId)[0].quantity).toEqual(2);
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'amazon_cart_storage', 
            `[{"productId":"${productId}","quantity":2,"deliveryOptionId":"1"}]`
        );
    });
    it('update quantity of a product', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: productId,
                quantity: 5,
                deliveryOptionId: '1'
            }]);
        });
        cart.loadFromStorage();

        cart.addToCart(productId, 3, true);
        expect(cart.cartItems.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart.cartItems[0].productId).toEqual(productId);
        expect(cart.cartItems.filter(cartItem => cartItem.productId === productId)[0].quantity).toEqual(3);
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'amazon_cart_storage', 
            `[{"productId":"${productId}","quantity":3,"deliveryOptionId":"1"}]`
        );
    });
});

describe('test suite: remove a product from the cart', () => {
    beforeEach(() => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
        return JSON.stringify([{
            productId: productId,
            quantity: 5,
            deliveryOptionId: '1'
            }]);
        });
        
        cart.loadFromStorage();
        spyOn(localStorage, 'setItem');
    });

    it('remove a productId that is in the cart', () => {
        cart.removeProductFromCart(productId);
        expect(cart.cartItems.length).toEqual(0);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('amazon_cart_storage', '[]');
    });
    it('remove a productId that is not in the cart', () =>{
        cart.removeProductFromCart('non-existing-product-id');
        expect(cart.cartItems.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(cart.cartItems).toEqual([{
            productId: productId,
            quantity: 5,
            deliveryOptionId: '1'
        }]);
    });
});

describe('test suite: update delivery option', () => {
    beforeEach(() => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: productId,
                quantity: 2,
                deliveryOptionId: '1'
            }]);
        });
        spyOn(localStorage, 'setItem');
        cart.loadFromStorage();
    });

    it('update delivery option of a product in the cart', () => {
        cart.updateDeliveryOptions(productId, '2');
        expect(cart.cartItems[0].productId).toEqual(productId);
        expect(cart.cartItems[0].quantity).toEqual(2);
        expect(cart.cartItems[0].deliveryOptionId).toEqual('2');
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('amazon_cart_storage', `[{"productId":"${productId}","quantity":2,"deliveryOptionId":"2"}]`);
    });
    it('update delivery option of a product that is not in the cart', () => {
        cart.updateDeliveryOptions('non-existing-product', '2');
        expect(cart.cartItems[0].productId).toEqual(productId);
        expect(cart.cartItems[0].quantity).toEqual(2);
        expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(cart.cartItems).toEqual([{
            productId: productId,
            quantity: 2,
            deliveryOptionId: '1'
        }]);
    });
    it('update delivery option of a product in the cart with a non existing deliveryOptionId', () => {
        cart.updateDeliveryOptions(productId, '4');
        expect(cart.cartItems[0].productId).toEqual(productId);
        expect(cart.cartItems[0].quantity).toEqual(2);
        expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
        expect(cart.cartItems).toEqual([{
            productId: productId,
            quantity: 2,
            deliveryOptionId: '1'
        }]);
    });
});