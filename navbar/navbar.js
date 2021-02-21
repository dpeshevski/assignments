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

function createAnchor (element) {
  const anchorEl = document.createElement('a');

  anchorEl.innerHTML = element;

  return anchorEl;
}

function createMenuList ({ elements, attributes, width }) {
  const list = [];

  for (const element of elements) {
    list.push(createList(createAnchor(element), width));
  }

  return createUnorderedList(list, attributes || null);
}

function craeteDropdownMenuList (config) {
  const anchorMore = createAnchor('More');
  const attributes = { "class": "dropdown", "aria-label": "submenu" };

  const { elements, width: { itemWidth, moreListWidth } } = config;

  const menuList = createMenuList({ elements, attributes, width: itemWidth });

  return createList([anchorMore, menuList], moreListWidth);
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

  let menuConfig = {}; 

  if ((navElements.length * itemWidth) <= menuWidth) {
    menuConfig = {
      elements: navElements,
      width: itemWidth
    };
  
    menuList = createMenuList(menuConfig);  
  } else {
    let size = menuWidth / itemWidth;

    const navElementsSliced = navElements.slice(0, parseInt(size));

    menuConfig = {
      elements: navElementsSliced,
      width: itemWidth
    };

    menuList = createMenuList(menuConfig);

    const elements = navElements.slice(size);
    const remainingWidth = Math.round((size % 1) * itemWidth);
    const moreListWidth = remainingWidth > 0 && remainingWidth < 33 ? 60 : remainingWidth;

    const dropDownMenuConfig = {
      elements,
      width: {
        moreListWidth,
        itemWidth
      }
    };

    menuList.appendChild(craeteDropdownMenuList(dropDownMenuConfig));
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
