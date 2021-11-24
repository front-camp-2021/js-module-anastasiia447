export default class CardsList {
  element;

  constructor ({data = [], Component = {}}) {
    this.data = data;
    this.Component = Component;

    this.render();
  }

  getcardslist(wrapper, cardsData) {
    if (cardsData.length < 1) {
      const container = document.createElement("h2");
      container.classList.add("product-wrapper");
      container.innerText = "No products found";
      wrapper.append(container); 
    } else {
      cardsData.forEach((item) => {
        const { element } = new this.Component(item);
        
        if (element) {
          wrapper.append(element);
        }
      });
    }
  }

  update(updateData) {
    if (!this.element) {
      return;
    }

    this.element.innerHTML = "";
    this.data = updateData;

    this.getcardslist(this.element, this.data);
  }

  render() {
    const listWrapper = document.createElement("div");
    listWrapper.classList.add("product-list");

    this.element = listWrapper;
    this.getcardslist(this.element, this.data);
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
