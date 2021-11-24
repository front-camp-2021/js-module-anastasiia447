export default class FiltersList {
  element;

  constructor({ title = "", list = [] } = {}) {
    this.title = title;
    this.list = list;

    this.render();
    this.addEventListeners();
  }

  render() {
    const filterWrapper = document.createElement("div");
    filterWrapper.innerHTML = this.filterTemplate;

    this.element = filterWrapper.firstElementChild;
  }

  update(list) {
    this.list = list;
    const element = this.element.querySelector("[data-element]");
    element.innerHTML = this.filterItems;
  }

  get filterTemplate() {
    return `
      <form class="filter__item">
        <h5 class="filter__item-title">${this.title}</h5>
        <div data-element="body">
          ${this.filterItems}
        </div>
      </form>
    `;
  }

  get filterItems() {
    const result = this.list.map((item) => {
      return `
        <div class="filter__item-group" >
          <input type="checkbox" class="filter__item-checkbox" value="${item.value}" id="${item.value}" ${item.checked ? "checked" : ""}>
          <label class="filter__item-label" for="${item.value}">${item.title}</label>
        </div>
      `;
    });

    return result.join("");
  }

  reset() {
    this.element.reset();
  }

  addEventListeners() {
    this.element.addEventListener("change", (event) => {
      const eventName = event.target.checked ? "add-filter" : "remove-filter";

      this.element.dispatchEvent(
        new CustomEvent(eventName, {
          bubbles: true,
          detail: event.target.value,
        })
      );
    });
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
