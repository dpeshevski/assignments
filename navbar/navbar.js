"use strict"

/**
 Implement a full-width menu/navigation bar on top of the page
 Get the menu elements from a JS function
 Depending on the total width of the menu items, show a showMore button (with a dropdown) 
 or just show the elements
 *  */  

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

const request = new Request('http://localhost:3000/navbar', requestOptions);

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


function createUnorderedList (children, attributes) {
  const ulEl = createChildren('ul', children);

  setAttributes(ulEl, attributes);

  return ulEl;
}

function createList (children, width) {
  const liEl = createChildren('li', children);

  liEl.style.width = `${width}px`;

  return liEl;
}

function createAnchor (child) {
  const anchorEl = document.createElement('a');

  anchorEl.innerHTML = child;

  return anchorEl;
}

function createMenuList (children, attributes, config) {
  const list = [];

  for (const child of children) {
    list.push(createList(createAnchor(child), config.itemWidth));
  }

  return createUnorderedList(list, attributes);
}

function craeteDropdownMenuList (children, config) {
  const anchorMore = createAnchor('More');
  const menuList = createMenuList(children, { "class": "dropdown", "aria-label": "submenu" }, { itemWidth: config.itemWidth });

  return createList([anchorMore, menuList], config.width);
}

function fetchingData (request) {
  return fetch(request)
    .then(response => response.json())
    .then(data => data)
    .catch(e => console.error(e));
}

async function makeNavbar () {
  const navElement = navbarElement({ "role": "navigation" });

  const navbarResponseData = await fetchingData(request);

  // Use the Fetch API
  // fetch(request)
  // .then(response => response.json())
  // .then(data => {
  const { itemWidth, menuWidth, navElements } = navbarResponseData; // use data from then() method if you want to use Fetch APi directly here insead of this approach
  let menuList;

  if ((navElements.length * itemWidth) <= menuWidth) {
    menuList = createMenuList(navElements, null, { itemWidth });  
  } else {
    let size = menuWidth / itemWidth;

    const navs = navElements.slice(0, parseInt(size));
    menuList = createMenuList(navs, null, { itemWidth });

    const dropDownMenuContent = navElements.slice(size);
    const remainingWidth = Math.round((size % 1) * itemWidth);
    const moreListWidth = remainingWidth > 0 && remainingWidth < 33 ? 60 : remainingWidth;
    menuList.appendChild(craeteDropdownMenuList(dropDownMenuContent, { width: moreListWidth, itemWidth }));
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
