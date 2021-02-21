"use strict"

/**
 Implement a full-width menu/navigation bar on top of the page
 Get the menu elements from a JS function
 Depending on the total width of the menu items, show a showMore button (with a dropdown) 
 or just show the elements
 *  */  

class Menu {
  constructor(elements, attributes, width) {
    this._elements = elements;
    this._attributes = attributes;
    this._width = width;
  }

  get elements() {
    return this._elements;
  }

  get attributes() {
    return this._attributes;
  }

  get width() {
    return this._width;
  }

  get conifg() {
    return {
      elements: this.elements,
      attributes: this.attributes,
      width: this.width
    }
  }

  set elements(elements) {
    this._elements = elements;
  }

  set attributes(attributes) {
    this._attributes = attributes;
  }

  set width(width) {
    this._width = width;
  }

  setConfig(elements, attributes, width) {
    this.elements = elements;
    this.attributes = attributes;
    this.width = width;
  }
}

const baseURL = 'http://localhost:3000';

function fetchingNavbar () {
  const headersOptions = {
    "Content-Type": 'application/json'
  }

  const headers = new Headers(headersOptions);

  const requestOptions = {
    method: 'GET',
    headers,
    mode: 'cors',
    cache: 'default'
  }

  const request = new Request(`${baseURL}/navbar`, requestOptions);

  return fetch(request)
    .then(response => response.json())
    .then(data => data)
    .catch(e => console.error(e));
}

function setAttributes(el, attributes) {
  for (const key in attributes) {
    el.setAttribute(key, attributes[key]);
  }
  return el;
}

function navbarElement (attributes) {
  const navElement = document.querySelector('nav');

  setAttributes(navElement, attributes);

  return navElement;
}

function createChildren(parentEl, elements) {
  parentEl = document.createElement(parentEl);

  if (elements && elements.length) {
    for (const el of elements) {
      parentEl.appendChild(el);
    }
  } else {
    parentEl.appendChild(elements);
  }

  return parentEl;
}


function createUnorderedList ({ ...props }) {
  const { children, attributes } = props;

  const ulEl = createChildren('ul', children);
  setAttributes(ulEl, attributes || null);

  return ulEl;
}

function createList ({ ...props }) {
  const { children, attributes, width } = props;

  const liEl = createChildren('li', children);
  setAttributes(liEl, attributes || null);

  liEl.style.width = `${width}px`;

  return liEl;
}

function createAnchor (element) {
  const anchorEl = document.createElement('a');

  anchorEl.innerHTML = element;

  return anchorEl;
}

function createMenuList ({ ...props }) {
  const { elements, attributes, width } = props;

  const list = [];

  for (const element of elements) {
    const listConfig = {
      children: createAnchor(element),
      attributes: {
        class: 'nav-item'
      },
      width
    }
    list.push(createList(listConfig));
  }

  return createUnorderedList({ children: list, attributes });
}

function craeteDropdownMenuList (config) {
  const anchorMore = createAnchor('More');
  const { elements, attributes, width: { itemWidth, moreListWidth } } = config;

  const menuList = createMenuList({ elements, attributes, width: itemWidth });

  const listConfig = {
    children: [anchorMore, menuList],
    attributes: {
      class: 'dropdown-list'
    },
    width: moreListWidth
  }

  return createList(listConfig);
}

async function makeNavbar () {
  const navElement = navbarElement({ class: 'navbar', role: 'navigation' });

  const navbar = await fetchingNavbar();

  // Use the Fetch API
  // fetch(request)
  // .then(response => response.json())
  // .then(data => {
  const { itemWidth, menuWidth, navElements } = navbar; // use data from then() method if you want to use Fetch APi directly here insead of this approach
  let menuList;

  let menu = new Menu();

  const menuAttributes = {
    class: 'nav-items',
    "aria-label": 'menu'
  };

  if ((navElements.length * itemWidth) <= menuWidth) {
    menu.setConfig(navElement, menuAttributes, itemWidth);
    menuList = createMenuList(menu.conifg);  
  } else {
    let size = menuWidth / itemWidth;

    const navElementsSliced = navElements.slice(0, parseInt(size));

    menu.setConfig(navElementsSliced, menuAttributes, itemWidth);
    menuList = createMenuList(menu.conifg);

    const elements = navElements.slice(size);
    const remainingWidth = Math.round((size % 1) * itemWidth);
    const moreListWidth = remainingWidth < 33 ? 60 : remainingWidth;

    menu.setConfig(elements, { class: 'dropdown', "aria-label": 'submenu' }, { moreListWidth, itemWidth });
    menuList.appendChild(craeteDropdownMenuList(menu.conifg));
  }

  navElement.appendChild(menuList);
  // })
  // .catch(err => console.error(err));
}

window.onload = makeNavbar();
// home. articles. blog posts. More >
// 															  about me
//                                projects
//                                portfolio
