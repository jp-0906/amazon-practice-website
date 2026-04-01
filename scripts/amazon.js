import { cart } from '../data/cart-class.js';
import { products, loadProductsFetch, filterProducts } from '../data/products.js';
import { updateCartQuantity } from './mainHeader.js';

let filteredProducts;

loadPage();

async function loadPage() {
  await loadProductsFetch();
  renderProducts();
}

function renderProducts() {
    const url = new URL(window.location.href);
    const searchValues = url.searchParams.get('search');
    filteredProducts = products;

    if (searchValues !== null) {
      const searchBar = document.querySelector('.js-search-bar');
      searchBar.value = searchValues;
      filteredProducts = filterProducts(searchValues);
    }

    const productGridElement = document.querySelector('.js-product-grid');
    productGridElement.innerHTML = '';
    filteredProducts.forEach(product => {
        productGridElement.innerHTML += productContainerTemplate(product);
    });

    setPageEvents();

    updateCartQuantity();
}

function setPageEvents() {
  const addedToCartIDs = {};

  //no need to clear this event since using the search bar regenerate the html elements
  document.querySelectorAll('.js-add-to-cart').forEach(buttonElement => {
      buttonElement.addEventListener('click', () => {
          const { productId } = buttonElement.dataset;
          const quantitySelectorElement = document.querySelector('.js-quantity-selector-' + productId);
          const quantity = Number(quantitySelectorElement.value);

          cart.addToCart(productId, quantity);
          updateCartQuantity();

          const addedToCartElement = document.querySelector('.js-added-to-cart-' + productId);
          addedToCartElement.classList.add('visible');

          if (productId in addedToCartIDs) clearTimeout(addedToCartIDs[productId]);

          addedToCartIDs[productId] = setTimeout(() => {
            addedToCartElement.classList.remove('visible');
          }, 2000);
      });
  });

  //need eventlistener clean up because the header does not regenerate after searching
  const searchBar = document.querySelector('.js-search-bar');
  const searchButton = document.querySelector('.js-search-button');

  const searchBarHandler = event => {
    if (event.key === 'Enter') {
      searchBar.removeEventListener('keydown', searchBarHandler);
      searchButton.removeEventListener('click', searchButtonHandler);
      searchValue(searchBar.value);
    }
  };

  const searchButtonHandler = () => {
    searchBar.removeEventListener('keydown', searchBarHandler);
    searchButton.removeEventListener('click', searchButtonHandler);
    searchValue(searchBar.value);
  };

  searchBar.addEventListener('keydown', searchBarHandler);
  searchButton.addEventListener('click', searchButtonHandler);
}

function searchValue(searchValue) {
  // let url = 'amazon.html';

  // if (searchValue.length > 0) {
  //   url += `?search=${searchValue}`;
  // }

  // window.location.href = url;

  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('search', searchValue);
  window.history.pushState({}, '', currentUrl);

  loadPage();
}

function productContainerTemplate(productObject) {
    const { 
        id,
        image, 
        name, 
        rating
    } = productObject;

    const count = rating['count'];

    const containerHTML = `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${productObject.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${count}
            </div>
          </div>

          <div class="product-price">
            ${productObject.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${productObject.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" 
          data-product-id="${id}">
            Add to Cart
          </button>
        </div>
    `

    return containerHTML;
}