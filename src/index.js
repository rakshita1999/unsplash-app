import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css'

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const { Component } = React;
const { render } = ReactDOM;
var searchquery;

const LOAD_STATE = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  LOADING: "LOADING"
};

class App extends Component {
  constructor(props) {
    super(props);
    _defineProperty(
      this,
      "submitSearch",

      event => {
        event.preventDefault();
        searchquery = document.getElementById("box").value;
        if (searchquery) this.state.updated = true;
        else this.state.updated = false;
        console.log("Button was clicked!");
        this.fetchPhotos(1);
      }
    );
    this.state = {
      photos: [],
      totalPhotos: 0,
      perPage: 5,
      currentPage: 1,
      count: 0,
      updated: false,
      loadState: LOAD_STATE.LOADING
    };
  }
  componentDidMount() {
    this.fetchPhotos(this.state.currentPage);
  }
  fetchPhotos(page) {
    var self = this;
    const { perPage } = this.state;
    const { appId } = this.props;
    var baseUrl;
    const options = {
      params: {
        client_id: appId,
        page: page,
        per_page: perPage,
        query: searchquery
      }
    };
    this.setState({ loadState: LOAD_STATE.LOADING });
    if (this.state.updated === false) {
      baseUrl = "https://api.unsplash.com/photos/curated";
      axios
        .get(baseUrl, options)
        .then(response => {
          self.setState({
            photos: response.data,
            totalPhotos: parseInt(response.headers["x-total"]),
            currentPage: page,
            loadState: LOAD_STATE.SUCCESS
          });
        })
        .catch(() => {
          this.setState({ loadState: LOAD_STATE.ERROR });
        });
    } else {
      baseUrl = "https://api.unsplash.com/search/photos";
      axios
        .get(baseUrl, options)
        .then(response => {
          self.setState({
            photos: response.data.results,
            totalPhotos: parseInt(response.headers["x-total"]),
            currentPage: page,
            loadState: LOAD_STATE.SUCCESS
          });
        })
        .catch(() => {
          this.setState({ loadState: LOAD_STATE.ERROR });
        });
    }
  }

  render() {
    return React.createElement(
      "div",
      { className: "app" },
      React.createElement(
        "div",
        { className: "search" },
        React.createElement(
          "form",
          { className: "search1" },
          React.createElement("input", {
            type: "text",
            placeholder: " search..",
            id: "box"
          }),
          React.createElement(
            "a",
            { href: "#" },
            React.createElement(
              "button",
              {
                className: "button",
                placeholder: "search",
                onClick: this.submitSearch
              },
              "\uD83D\uDD0D"
            )
          )
        )
      ),

      React.createElement(Pagination, {
        current: this.state.currentPage,
        total: this.state.totalPhotos,
        perPage: this.state.perPage,
        onPageChanged: this.fetchPhotos.bind(this)
      }),

      this.state.loadState === LOAD_STATE.LOADING
        ? React.createElement("div", { className: "loader" })
        : React.createElement(List, { data: this.state.photos })
    );
  }
}

const ListItem = ({ photo }) => {
  return React.createElement(
    "div",
    { key: photo.id, className: "grid__item card" },
    React.createElement(
      "div",
      { className: "card__body" },
      React.createElement("img", { src: photo.urls.small, alt: "" })
    ),

    React.createElement(
      "div",
      { className: "card__footer media" },
      React.createElement("img", {
        src: photo.user.profile_image.small,
        alt: "",
        className: "media__obj"
      }),
      React.createElement(
        "div",
        { className: "media__body" },
        React.createElement(
          "a",
          { href: photo.user.portfolio_url, target: "_blank" },
          photo.user.name
        )
      )
    )
  );
};

const List = ({ data }) => {
  var items = data.map(photo =>
    React.createElement(ListItem, { key: photo.id, photo: photo })
  );
  return React.createElement("div", { className: "grid" }, items);
};

class Pagination extends Component {
  pages() {
    var pages = [];
    for (var i = this.rangeStart(); i <= this.rangeEnd(); i++) {
      pages.push(i);
    }
    return pages;
  }

  rangeStart() {
    var start = this.props.current - this.props.pageRange;
    return start > 0 ? start : 1;
  }

  rangeEnd() {
    var end = this.props.current + this.props.pageRange;
    var totalPages = this.totalPages();
    return end < totalPages ? end : totalPages;
  }

  totalPages() {
    return Math.ceil(this.props.total / this.props.perPage);
  }

  nextPage() {
    return this.props.current + 1;
  }

  prevPage() {
    return this.props.current - 1;
  }

  hasFirst() {
    return this.rangeStart() !== 1;
  }

  hasLast() {
    return this.rangeEnd() < this.totalPages();
  }

  hasPrev() {
    return this.props.current > 1;
  }

  hasNext() {
    return this.props.current < this.totalPages();
  }

  changePage(page) {
    this.props.onPageChanged(page);
  }

  render() {
    return React.createElement(
      "div",
      { className: "pagination" },
      React.createElement(
        "div",
        { className: "pagination__left" },
        React.createElement(
          "a",
          {
            href: "#",
            className: !this.hasPrev() ? "hidden" : "",
            onClick: e => this.changePage(this.prevPage())
          },
          "Prev"
        )
      ),

      React.createElement(
        "div",
        { className: "pagination__mid" },
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            { className: !this.hasFirst() ? "hidden" : "" },
            React.createElement(
              "a",
              { href: "#", onClick: e => this.changePage(1) },
              "1"
            )
          ),

          React.createElement(
            "li",
            { className: !this.hasFirst() ? "hidden" : "" },
            "..."
          ),

          this.pages().map((page, index) => {
            return React.createElement(
              "li",
              { key: index },
              React.createElement(
                "a",
                {
                  href: "#",
                  onClick: e => this.changePage(page),
                  className: this.props.current === page ? "current" : ""
                },
                page
              )
            );
          }),

          React.createElement(
            "li",
            { className: !this.hasLast() ? "hidden" : "" },
            "..."
          ),
          React.createElement(
            "li",
            { className: !this.hasLast() ? "hidden" : "" },
            React.createElement(
              "a",
              { href: "#", onClick: e => this.changePage(this.totalPages()) },
              this.totalPages()
            )
          )
        )
      ),

      React.createElement(
        "div",
        { className: "pagination__right" },
        React.createElement(
          "a",
          {
            href: "#",
            className: !this.hasNext() ? "hidden" : "",
            onClick: e => this.changePage(this.nextPage())
          },
          "Next"
        )
      )
    );
  }
}
Pagination.defaultProps = {
  pageRange: 2
};

render(
  React.createElement(App, {
    appId: "2db28eec55a4d596ead5f1616ec51fd22163412ab27906b7a9a6e6c8ebf23031"
  }),

  document.getElementById("mount-point")
);
