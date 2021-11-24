import Card from "../../module-2/card/index.js";
import CardsList from "../../module-3/cards-list-v1/index.js";
import Pagination from "../../module-5/pagination/index.js";
import SideBar from "../../module-4/side-bar/index.js";
import Search from "../search/index.js";
import { request } from "./request/index.js";
import { prepareFilters } from "./prepare-filters/index.js";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export default class Page {
  element;
  subElements = {};
  components = {};
  pageLimit = 10;
  totalPages = 100;
  filters = new URLSearchParams();

  constructor() {
    this.filters.set("_page", "1");
    this.filters.set("_limit", this.pageLimit);
    this.onInitialize();
  }

  onInitialize() {
    this.render();
    this.getSubElements();
    this.initializeComponents();
    this.renderComponents();
    this.initializeRequestedData();
    this.initializeEvents();
  }

  getRendering() {
    return `
    <div class="wrapper">
      <header class="header">
        <div class="header-logo">
          <div class="header-logo-text">Online Store</div>
        </div>
      </header>
      <ul class="breadcrumbs">
        <li class="breadcrumbs-item">
          <a href="/" class="breadcrumbs-home"></a>
        </li>
        <li class="breadcrumbs-item">
          <a href="/eCommerce" class="breadcrumbs-link">eCommerce</a>
        </li>
        <li class="breadcrumbs-item">
          <span class="breadcrumbs-current">Electronics</span>
        </li>
      </ul>
      <div class="category">
        <div class="category-row">
          <aside class="category-sidebar" data-element="sidebar">
            <!-- SideBar -->
          </aside>
          <main class="category-main">
            <div class="search">
              <div class="search-results">
                <span class="search-results-text">7,618 results found</span>
                <button class="result">
                <i style="color: white"class="far fa-heart"></i>
                </button>
              </div>
              <div data-element="search">
              </div>
              <!-- Search -->
            </div>
            <div data-element="cardslist">
            <!-- Products -->
            </div>
          </main>
        </div>
      </div>
      <div data-element="pagination">
      <!-- pagination -->
      </div>
    </div>
    `;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.getRendering;
    this.element = wrapper.firstElementChild;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    this.subElements = result;
  }

  initializeComponents() {
    const search = new Search();
    const cardslist = new CardsList({ data: [], Component: Card });
    const sidebar = new SideBar();
    const pagination = new Pagination();

    this.components = {
      search,
      cardslist,
      sidebar,
      pagination,
    };
  }

  renderComponents() {
    Object.keys(this.components).forEach((component) => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      if (element) {
        root.append(element);
      }
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
    this.subElements = {};
    this.filters = new URLSearchParams();

    for (const component of Object.values(this.components)) {
      component.destroy();
    }

    this.components = {};
  }

  async initializeRequestedData() {
    try {
      const productsData = await this.productsRequest();
      const brandsData = await this.filtersRequest("brands");
      const categoriesData = await this.filtersRequest("categories");

      const categoriesFilter = prepareFilters(categoriesData, "category");
      const brandsFilter = prepareFilters(brandsData, "brand");

      this.components.sidebar.update(categoriesFilter, brandsFilter);
      this.components.cardslist.update(productsData);
    } catch (error) {
      console.error(`An error occurred while initialize loaded data: ${error}`);
    }
  }

  async productsRequest() {
    try {
      const url = new URL("products", BACKEND_URL);
      url.search = this.filters;

      const response = await fetch(url);
      const totalPages = parseInt(response.headers.get("X-Total-Count"), 10);

      if (totalPages !== this.totalPages) {
        this.totalPages = totalPages;
      }

      this.components.pagination.update({
        totalPages: Math.ceil(totalPages / this.pageLimit),
        currentPage: parseInt(this.filters.get("-page")),
      });

      return await response.json();
    } catch (error) {
      console.error(`An error occurred while request products data: ${error}`);
    }
  }

  async filtersRequest(query = "") {
    try {
      const url = new URL(query, BACKEND_URL);
      const [data, error] = await request(url);

      if (error) {
        throw new Error(error);
      }

      return data;
    } catch (error) {
      console.error(`An error occurred while loading filters data: ${error}`);
    }
  }

  initializeEvents() {
    this.components.sidebar.element.addEventListener(
      "add-filter",
      async (event) => {
        const [filterKey, filterProperty] = event.detail.split("=");
        this.filters.set("-page", "1");

        this.filters.append(filterKey, filterProperty);
        this.updateProductsList();
      }
    );

    this.components.sidebar.element.addEventListener(
      "remove-filter",
      (event) => {
        const [filterKey, filterProperty] = event.detail.split("=");
        const filters = this.filters
          .getAll(filterKey)
          .filter((item) => item !== filterProperty);

        if (filters.length > 0) {
          this.filters.set(filterKey, filters);
        } else {
          this.filters.delete(filterKey);
        }

        this.updateProductsList();
      }
    );

    this.components.sidebar.element.addEventListener("clear-filters", () => {
      this.resetFilters();
      this.components.search.clear();

      this.updateProductsList();
    });

    this.components.pagination.element.addEventListener(
      "page-changed",
      (event) => {
        this.filters.set("-page", event.detail);

        this.updateProductsList();
      }
    );

    this.components.sidebar.element.addEventListener(
      "range-selected",
      (event) => {
        this.filters.set("-page", "1");
        const { filterName, value } = event.detail;
        const gte = `${filterName}-gte`;
        const lte = `${filterName}-lte`;

        this.filters.set(gte, value.from);
        this.filters.set(lte, value.to);

        this.updateProductsList();
      }
    );

    this.components.search.element.addEventListener(
      "search-filter",
      async (event) => {
        this.filters.set("-page", "1");
        this.filters.set("q", event.detail);

        this.updateProductsList();
      }
    );
  }

  async updateProductsList() {
    const products = await this.productsRequest();
    this.components.cardslist.update(products);
  }

  resetFilters() {
    this.filters = new URLSearchParams();
    this.filters.set("-page", "1");
    this.filters.set("-limit", this.pageLimit);
  }
}