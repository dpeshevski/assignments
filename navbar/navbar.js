"use strict"

/**
 Implement a full-width menu/navigation bar on top of the page
 Get the menu elements from a JS function
 Depending on the total width of the menu items, show a showMore button (with a dropdown) 
 or just show the elements
 *  */  

class Menu {
  constructor(tagName, elements, attributes, width) {
    this._tagName = tagName;
    this._elements = elements;
    this._attributes = attributes;
    this._width = width;
  }

  get tagName() {
    return this._tagName;
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
      tagName: this.tagName,
      elements: this.elements,
      attributes: this.attributes,
      width: this.width
    }
  }

  set tagName(value) {
    this._tagName = value;
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

  setConfig(tagName, elements, attributes, width) {
    this.tagName = tagName;
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

function createList({ ...props }) {
  const { tagName, elements, attributes, width } = props;

  const listEl = createChildren(tagName, elements);
  setAttributes(listEl, attributes || null);

  listEl.style.width = `${width}px` || '';

  return listEl;
}

function createAnchor (element) {
  const anchorEl = document.createElement('a');

  anchorEl.innerHTML = element;

  return anchorEl;
}

function createMenuList ({ ...props }) {
  const { tagName: { parent, child }, elements, attributes, width } = props;

  const listElements = [];

  const menu = new Menu();

  for (const element of elements) {
    menu.setConfig(child, createAnchor(element), { class: 'nav-item'}, width);

    listElements.push(createList(menu.conifg));
  }

  return createList({ tagName: parent, elements: listElements, attributes });
}

function craeteDropdownMenuList (config) {
  const anchorMore = createAnchor('More');
  const { tagName, elements, attributes, width: { itemWidth, moreListWidth } } = config;

  const menuList = createMenuList({ tagName, elements, attributes, width: itemWidth });

  const menu = new Menu();

  menu.setConfig(tagName.child, [anchorMore, menuList], { class: 'dropdown-list' }, moreListWidth);

  return createList({ tagName: tagName.parent, ...menu.conifg });
}

async function makeNavbar () {
  const navElement = navbarElement({ class: 'navbar', role: 'navigation' });

  const navbar = await fetchingNavbar();

  const { tagName, itemWidth, menuWidth, navElements } = navbar;
  let menuList;

  let menu = new Menu();

  const menuAttributes = {
    class: 'nav-items',
    "aria-label": 'menu'
  };

  if ((navElements.length * itemWidth) <= menuWidth) {
    menu.setConfig(tagName, navElements, menuAttributes, itemWidth);
    menuList = createMenuList(menu.conifg);  
  } else {
    let size = menuWidth / itemWidth;

    const navElementsSliced = navElements.slice(0, parseInt(size));
    menu.setConfig(tagName, navElementsSliced, menuAttributes, itemWidth);
    menuList = createMenuList(menu.conifg);

    const elements = navElements.slice(size);
    const remainingWidth = Math.round((size % 1) * itemWidth);
    const moreListWidth = remainingWidth < 33 ? 60 : remainingWidth;

    menu.setConfig(tagName, elements, { class: 'dropdown', "aria-label": 'submenu' }, { moreListWidth, itemWidth });
    menuList.appendChild(craeteDropdownMenuList(menu.conifg));
  }

  navElement.appendChild(menuList);
}

window.onload = makeNavbar();
// home. articles. blog posts. More >
// 															  about me
//                                projects
//                                portfolio
