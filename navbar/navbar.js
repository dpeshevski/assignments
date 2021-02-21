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

  setAttributes(ulEl, attributes || null);

  return ulEl;
}

function createList ({ children, attributes, width }) {
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

function createMenuList ({ elements, attributes, width }) {
  const list = [];

  for (const element of elements) {
    const listConfig = {
      children: createAnchor(element),
      attributes: {
        class: "nav-item"
      },
      width
    }
    list.push(createList(listConfig));
  }

  return createUnorderedList(list, attributes);
}

function craeteDropdownMenuList (config) {
  const anchorMore = createAnchor('More');
  const attributes = { class: "dropdown", "aria-label": "submenu" };

  const { elements, width: { itemWidth, moreListWidth } } = config;

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

function fetchingData (request) {
  return fetch(request)
    .then(response => response.json())
    .then(data => data)
    .catch(e => console.error(e));
}

async function makeNavbar () {
  const navElement = navbarElement({ class: "navbar", role: "navigation" });

  const navbarResponseData = await fetchingData(request);

  // Use the Fetch API
  // fetch(request)
  // .then(response => response.json())
  // .then(data => {
  const { itemWidth, menuWidth, navElements } = navbarResponseData; // use data from then() method if you want to use Fetch APi directly here insead of this approach
  let menuList;

  let menuConfig = {}; 

  const menuAttributes = {
    class: "nav-items",
    "aria-label": "menu"
  };

  if ((navElements.length * itemWidth) <= menuWidth) {
    menuConfig = {
      elements: navElements,
      attributes: menuAttributes,
      width: itemWidth
    };

    menuList = createMenuList(menuConfig);  
  } else {
    let size = menuWidth / itemWidth;

    const navElementsSliced = navElements.slice(0, parseInt(size));

    menuConfig = {
      elements: navElementsSliced,
      attributes: menuAttributes,
      width: itemWidth
    };

    menuList = createMenuList(menuConfig);

    const elements = navElements.slice(size);
    const remainingWidth = Math.round((size % 1) * itemWidth);
    const moreListWidth = remainingWidth < 33 ? 60 : remainingWidth;

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
