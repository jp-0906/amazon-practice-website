class Car {
    carId;
    #brand;
    #model;
    color;
    #speed = 0;
    acceleration = 5;
    topSpeed = 200;
    isTrunkOpen = false;

    get brand() {
        return this.#brand;
    }
    get model() {
        return this.#model;
    }
    get speed() {
        return this.#speed;
    }

    constructor(carDetails) {
        this.carId = carDetails.carId;
        this.#brand = carDetails.brand;
        this.#model = carDetails.model;
        this.color = carDetails.color;
    }

    displayInfo() {
        const carSpeedElement = document.querySelector(`.js-car-speed-${this.carId}`);
        carSpeedElement.innerHTML = `${this.#brand} ${this.#model}, Speed: ${this.#speed} km/h`;
    }

    go() {
        if (this.#speed < this.topSpeed) {
            this.#speed += this.acceleration;
        }
    }

    brake() {
        if (this.#speed > 0) {
            this.#speed -= this.acceleration;
        }
    }

    openTrunk() {
        if (this.#speed === 0) {
            this.isTrunkOpen = true;
            const carTrunkElement = document.querySelector(`.js-car-trunk-${this.carId}`);
            carTrunkElement.innerHTML = '&gt;';
        }
    }

    closeTrunk() {
        this.isTrunkOpen = false;
        const carTrunkElement = document.querySelector(`.js-car-trunk-${this.carId}`);
        carTrunkElement.innerHTML = '&minus;';
    }

    carHTMLInfo() {
        return `
        <div class="js-car-${this.carId}" style="
            position: relative;
            font-size: 100px; 
            color: ${this.color};
        ">
            <div class="js-car-speed-${this.carId}" style="
                position: absolute;
                top: 50px;
                font-size: 10px;
            ">${this.#brand} ${this.#model}, Speed: ${this.#speed} km/h</div>
            <div class="js-car-trunk-${this.carId}" style="
                position: absolute;
                top: 60px;
                font-size: 50px;
                color: blue;
            ">&minus;</div>
            <div>&#127950;</div>
        </div>`;
    }

    updateCarPosition() {
        const carElement = document.querySelector(`.js-car-${this.carId}`);
        let currentPosition = Number(carElement.style.marginLeft.replace('px', ''));
        carElement.style.marginLeft = (this.#speed + currentPosition) + 'px';
        if (currentPosition > 1000) { 
            carElement.style.marginLeft = '0px';
        }
    }
}

class RaceCar extends Car {
    topSpeed = 300;

    constructor(carDetails) {
        super(carDetails);
        this.acceleration = carDetails.acceleration;
    }

    openTrunk() {
        return '';
    }

    closeTrunk() {
        return '';
    }

    carHTMLInfo() {
        return `
        <div class="js-car-${this.carId}" style="
            position: relative;
            font-size: 100px; 
            color: ${this.color};
        ">
            <div class="js-car-speed-${this.carId}" style="
                position: absolute;
                top: 50px;
                font-size: 10px;
            ">${this.brand} ${this.model}, Speed: ${this.speed} km/h</div>
            <div>&#127950;</div>
        </div>`;
    }
}

const cars = [{
    brand: 'Toyota', 
    model: 'Corolla', 
    color: 'red'
},
{
    brand: 'Tesla', 
    model: 'Model 3', 
    color: 'black'
},
{
    brand: 'McLaren', 
    model: 'F1',
    color: 'gold',
    acceleration: 20,
    type: 'Race Car'
}].map((car, index) => {
    car['carId'] = index + 1;
    console.log(car);

    if (car.type === 'Race Car') {
        return new RaceCar(car);
    }

    return new Car(car);
});

const bodyElement = document.querySelector('body');
bodyElement.innerHTML = '';

cars.forEach((car) => {
    bodyElement.innerHTML += car.carHTMLInfo();
});

bodyElement.innerHTML = `
    <div><input class="js-player" type="Number" value="1"></div>
    ${bodyElement.innerHTML}
`;

let player = 0;
const playerInputElement = document.querySelector('.js-player');
playerInputElement.addEventListener('change', () => {
    player = Number(playerInputElement.value) - 1;
});

bodyElement.addEventListener('keydown', event => {
    console.log(player);
    const car = cars[player];
    switch (event.key) {
        case '1': case '2': case '3':
            const playerInputElement = document.querySelector('.js-player');
            playerInputElement.value = event.key;
            player = Number(playerInputElement.value) - 1;
            break; 
        case 'b':
            car.brake();
            car.displayInfo();
            break;
        case ' ':
            car.go();
            car.displayInfo();
            car.updateCarPosition();
            break;
        case 'z':
            car.openTrunk();
            break;
        case 'x':
            car.closeTrunk();
            break; 
    }
});