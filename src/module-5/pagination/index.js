export default class Pagination {
  element;
  subElements = {};
  start = 1;

  constructor({ totalPages = 10, currentPage = 1 } = {}) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;

    this.render();
  }

  getPagination() {
    return `
      <div class="pagination">
        <div class="pagination-previous" data-element="prev-page">
         <a class="pagination-item-link" href="#/previous"><</a>
        </div>
        <div data-element="pagination-items" class="pagination-items">
        </div>
        <div class="pagination-next" data-element="next-page">
         <a class="pagination-item-link" href="#/next">></a>
        </div>
      </div>
    `;
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

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getPagination;
    this.element = element.firstElementChild;

    this.getSubElements();
    this.initializeEvents();

    this.subElements["pagination-items"].innerHTML = this.getPaginationItems();
  }

  dispatchEvent(pageNumber) {
    this.element.dispatchEvent(
      new CustomEvent("page-changed", {
        bubbles: true,
        detail: pageNumber,
      })
    );
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
      this.dispatchEvent(this.currentPage - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.dispatchEvent(this.currentPage + 1);
    }
  }

  initializeEvents() {
    this.element.addEventListener("pointerdown", (event) => {
      const prevPageElement = event.target.closest(
        '[data-element="prev-page"]'
      );
      const nextPageElement = event.target.closest(
        '[data-element="next-page"]'
      );

      if (prevPageElement) {
        this.goToPrevPage();
      }

      if (nextPageElement) {
        this.goToNextPage();
      }
    });

    this.element.addEventListener("pointerdown", (event) => {
      const paginationItemsElement = event.target.closest(
        '[data-element="pagination-items"]'
      );

      if (paginationItemsElement) {
        const pageNumber = parseInt(event.target.dataset.pageNumber, 10);

        if (this.currentPage !== pageNumber) {
          this.currentPage = pageNumber;
          this.dispatchEvent(pageNumber);
        }
      }
    });

    document.addEventListener("page-changed", this.onPageChanged);
  }

  onPageChanged = (event) => {
    const pageNumber = parseInt(event.detail, 10);
    this.update({ totalPages: this.totalPages, currentPage: pageNumber });
  };

  update({ totalPages = this.totalPages, currentPage } = {}) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;

    if (this.totalPages < 1) {
      return;
    }

    this.subElements["pagination-items"].innerHTML = this.getPaginationItems();
  }

  range(start, end) {
    return [...Array(end).keys()].map((el) => el + start);
  }

  getPaginationItems() {
    const pages = this.range(this.start, this.totalPages);

    return pages
      .map((item) => {
        const isActive = item === this.currentPage;

        if (isActive) {
          return `
            <span class="pagination-item-current" data-page-number="${item}">${item}</span>
          `;
        } else {
          return `
            <a class="pagination-item-link" data-page-number="${item}" href="#/page/${item}">${item}</a>
          `;
        }
      })
      .join("");
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    document.removeEventListener("page-changed", this.onPageChanged);
  }
}