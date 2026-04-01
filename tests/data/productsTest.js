import { Product, Clothing, Appliance }  from '../../data/products.js';

let products;

afterEach(() => {
    //document.querySelector('body').innerHTML = '';
});

describe('test suite: product class', () => {
    beforeEach(() => {
        products = [
            {
                id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                image: "images/products/athletic-cotton-socks-6-pairs.jpg",
                name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
                rating: {
                stars: 4.5,
                count: 87
                },
                priceCents: 1090,
                keywords: [
                    "socks",
                    "sports",
                    "apparel"
                ]
            },
            {
                id: "3ebe75dc-64d2-4137-8860-1f5a963e534b",
                image: "images/products/6-piece-white-dinner-plate-set.jpg",
                name: "6 Piece White Dinner Plate Set",
                rating: {
                stars: 4,
                count: 37
                },
                priceCents: 2067,
                keywords: [
                    "plates",
                    "kitchen",
                    "dining"
                ]
            }
        ].map(product => new Product(product));
    });

    it('get price', () => {
        const price1 = products[0].getPrice();
        const price2 = products[1].getPrice();

        expect(price1).toEqual('$10.90');
        expect(price2).toEqual('$20.67');
    });

    it('get star url', () => {
        const starUrl1 = products[0].getStarsUrl();
        const starUrl2 = products[1].getStarsUrl();

        expect(starUrl1).toEqual('images/ratings/rating-45.png');
        expect(starUrl2).toEqual('images/ratings/rating-40.png');
    });
});

describe('test suite: clothing class', () => {
    beforeEach(() => {
        products = [
            {
                id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
                image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
                name: "Adults Plain Cotton T-Shirt - 2 Pack",
                rating: {
                stars: 4.5,
                count: 56
                },
                priceCents: 799,
                keywords: [
                "tshirts",
                "apparel",
                "mens"
                ],
                type: "clothing",
                sizeChartLink: "images/clothing-size-chart.png"
            }
        ].map(product => new Clothing(product));
    });

    it('get clothing size URL', () => {
        const URL = products[0].extraInfoHTML();

        expect(URL).toContain('images/clothing-size-chart.png');
    });
});

describe('test suite: appliance class', () => {
    beforeEach(() => {
        products = [
            {
                id: "54e0eccd-8f36-462b-b68a-8182611d9add",
                image: "images/products/black-2-slot-toaster.jpg",
                name: "2 Slot Toaster - Black",
                rating: {
                stars: 5,
                count: 2197
                },
                priceCents: 1899,
                keywords: [
                "toaster",
                "kitchen",
                "appliances"
                ],
                type: "appliance",
                instructionsLink: "images/appliance-instructions.png",
                warrantyLink: "images/appliance-warranty.png"
            }
        ].map(product => new Appliance(product));
    });

    it('get instruction and warranty URL', () => {
        const URL = products[0].extraInfoHTML();

        expect(URL).toContain('images/appliance-instructions.png');
        expect(URL).toContain('images/appliance-warranty.png');
    });
});