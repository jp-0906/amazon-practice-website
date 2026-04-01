import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export const deliveryOptions = [{
    id: '1',
    deliveryDays: 7,
    priceCents: 0
},
{
    id: '2',
    deliveryDays: 3,
    priceCents: 499
},
{
    id: '3',
    deliveryDays: 1,
    priceCents: 999
}];

export function getDeliveryPrice(id) {
    let priceCents = 0;
    deliveryOptions.forEach(deliveryOption => {
        if (deliveryOption.id === id) {
            priceCents = deliveryOption.priceCents;
            return;
        }
    });

    return priceCents;
}

export function getDeliveryDays(id) {
    let deliveryDays = 0;
    deliveryOptions.forEach(deliveryOption => {
        if (deliveryOption.id === id) {
            let dayCounter = 0;

            while (dayCounter !== deliveryOption.deliveryDays) {
                deliveryDays += 1;
                let weekday = dayjs().add(deliveryDays, 'days').format('ddd');

                if (weekday !== 'Sat' && weekday !== 'Sun') {
                    dayCounter += 1;
                }
            }
            return;
        }
    });

    return deliveryDays;
}