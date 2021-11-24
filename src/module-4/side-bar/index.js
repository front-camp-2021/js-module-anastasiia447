import FiltersList from "../filters-list/index.js";
import DoubleSlider from "../../module-5/double-slider/index.js";

export default class SideBar {
  element;
  SideBarItems = {};

  constructor(categoriesFilter = [], brandFilter = []) {
    this.categoriesFilter = categoriesFilter;
    this.brandFilter = brandFilter;

    this.Sibebar();
    this.render();
    this.insertSidebarItems();
    this.addEventListeners();
  }

  Sibebar() {
    const categoryFilter = new FiltersList({
      title: "Category",
      list: this.categoriesFilter,
    });

    const brandFilter = new FiltersList({
      ttitle: "Brand",
      list: this.brandFilter,
    });

    const priceFilter = new DoubleSlider({
      min: 0,
      max: 85000,
      filterName: "price",
      formatValue(value) {
        return `${value} UAH`;
      },
    });

    const ratingFilter = new DoubleSlider({
      min: 0,
      max: 5,
      precision: 2,
      filterName: "rating", 
    });

    this.sidebar = {
      categoryFilter,
      brandFilter, 
      priceFilter,
      ratingFilter,
    };
  }

  insertSidebarItems() {
    const sidebar_wrapper = this.element.querySelector(".filter-body");

    Object.keys(this.sidebar).forEach((item) => {
      const { element } = this.sidebar[item];
        
      if (element) {
        sidebar_wrapper?.append(element);
      }
    }); 
  }

  update(categoriesFilter = [], brandFilter = []) {
    this.sidebar.brandFilter.update(brandFilter);
    this.sidebar.categoryFilter.update(categoriesFilter);
  }

  getSideBar() {
    return `
      <div class="Filter">
        <h3>Filters</h3>
        <button class="clear">CLEAR ALL FILTERS</button>
      </div>
    `;
  }

  addEventListeners() {
    const ClearFilters = this.element.querySelector("#ClearFilters");
      
    const customDispatch = (event) => {
      this.element.dispatchEvent(
        new CostomEvent("filter-selected", {
          bubbles: true,
          detail: event.detail,
        })
      );
    };

    ClearFilters?.addEventListener("pointerdown", () => {
      for (const item of Object.values(this.sidebar)) {
        item.reset();
      }
      this.element.dispatchEvent(
        new CustomEvent("clear-filters", {
          bubbles: true,
        })
      );
    });

    this.element.addEventListener("add-filter", customDispatch);
    this.element.addEventListener("remove-filter", customDispatch);
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.getSideBar;

    this.element = wrapper.firstElementChild;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.sidebar = {};
  }
}

