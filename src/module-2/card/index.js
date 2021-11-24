export default class Card {
  element;

  constructor ({
    id = '',
    images = [],
    title = '',
    rating = 0,
    price = 0,
    category = '',
    brand = ''
  } = {}) {
    this.id = id;
    this.images = images;
    this.title = title;
    this.rating = rating;
    this.price = price;
    this.category = category;
    this.brand = brand;

    this.render();
  }

  getTemplate () {
    return `
      <div class="product-card">
        <div class="product-img-wrapper">
          <img class="product-img" src="${this.images[0]}">
        </div>

        <div class="product-price-wrapper">
          <div class="product-rating">
            <span class="product-rating-text">${this.rating}</span>
          </div>
          <span class="product-price">${this.price}$</span>
        </div>

        <div class="product-title">
          <h3 class="product-name">${this.title}r</h3>
          <span class="product-description">${this.category} | ${this.brand}</span>
        </div>

        <div class="product-buttons-block">
          <button class="product-btn btn btn-default btn-m">
            <span class="product-wishlist">WISHLIST</span>
          </button>
          <button class="product-btn btn btn-primary btn-m">
            <span class="product-cart">ADD TO CART</span>
          </button>
        </div>
      </div>    
    `;
  }

  render () {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-element", "body");
    wrapper.setAttribute("id", this.id);
    wrapper.classList.add("product_wrapper");
    wrapper.innerHTML = this.getTemplate ();

    this.element = wrapper;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
