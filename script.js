'use strict';

// Modal window
const 
  modalWindow = document.querySelector('.modal-window'),
  overlay = document.querySelector('.overlay'),
  btnCloseModalWindow = document.querySelector('.btn--close-modal-window'),
  btnsOpenModalWindow = document.querySelectorAll('.btn--show-modal-window');

// btn learn more
const 
  btnLearnMore = document.querySelector(`.btn--scroll-to`),
  section1 = document.querySelector(`#section--1`);

// hover nav menu
const 
  navLinksMenu = document.querySelector(`.nav__links`),
  navLinks = document.querySelectorAll(`.nav__link`),
  navText = document.querySelector(`.nav__text`),
  navLogo = document.querySelector(`.nav__logo`);

// Tabs
const 
  tabsContainer = document.querySelector(`.operations__tab-container`),
  tabs = document.querySelectorAll(`.operations__tab`),
  tabContents = document.querySelectorAll(`.operations__content`);

// Sticky nav
const 
  nav = document.querySelector(`.nav`),
  header = document.querySelector(`.header`); 

// pop up sections
const 
  sections = document.querySelectorAll(`.section`);

// lazy loading
const 
  images = document.querySelectorAll(`.services__img[data-src]`)

// slider
const 
  leftArrow = document.querySelector(`.slider__btn--left`),
  rightArrow = document.querySelector(`.slider__btn--right`),
  slides = document.querySelectorAll(`.slide`),
  dotsContainer = document.querySelector(`.dots`);
///////////////////////////////////////

// Modal window
const openModalWindow = function () {
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModalWindow.length; i++)
  btnsOpenModalWindow[i].addEventListener('click', openModalWindow);

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

// btn learn more
btnLearnMore.addEventListener(`click`, () => {
  section1.scrollIntoView({behavior: "smooth"})
})

// scroll to sections from nav
navLinksMenu.addEventListener(`click`, (e) => {
  e.preventDefault();
  const el = e.target;
  if (el.classList.contains(`nav__link`) && el.getAttribute(`href`) != `#`) {
    document.querySelector(el.getAttribute(`href`)).scrollIntoView({behavior: `smooth`})
  }
});
// hover nav menu
const hoverNav = function (e) {
  e.preventDefault();
  if (e.target.closest(`.nav__link`)) {
    navLinks.forEach(link => {
      link.style.opacity = this;
    });
    e.target.style.opacity = 1;
    navText.style.opacity = this;
    navLogo.style.opacity = this;
  }
}
navLinksMenu.addEventListener(`mouseover`, hoverNav.bind(0.4));
navLinksMenu.addEventListener(`mouseout`,  hoverNav.bind(1));

// Tabs
tabsContainer.addEventListener(`click`, (e) => {
  const clickedButton = e.target.closest(`.operations__tab`);

  if (!clickedButton) return;
  tabs.forEach(tab => {
    tab.classList.remove(`operations__tab--active`);
  });
  tabContents.forEach(content => {
    content.classList.remove(`operations__content--active`)
  })
  clickedButton.classList.add(`operations__tab--active`);

  document.querySelector(`.operations__content--${clickedButton.dataset.tab}`).classList.add(`operations__content--active`);
});

// sticky nav
const getStickyNav = function (entries, observer) {
  if (entries[0].isIntersecting) {
    nav.classList.remove(`sticky`);
  } else {
    nav.classList.add(`sticky`);
  }
};
const observerOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`
};
const stickyObserver = new IntersectionObserver (getStickyNav, observerOptions); 
stickyObserver.observe(header);

// pop up sections
const popUpSection = (entries) => {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  sectionObserver.unobserve(entry.target);
};
const popUpSectionOptions = {
  root: null,
  threshold: 0.2
};
const sectionObserver = new IntersectionObserver (popUpSection, popUpSectionOptions);
sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`)
})

// lazy loading 
const lazyLoad = (entries, observe) => {
  const entry = entries[0];
  const target = entry.target; 
  if (!entry.isIntersecting) return;
  target.src = target.dataset.src
  target.addEventListener(`load`, () => {
    target.classList.remove(`lazy-img`);
  })
  observe.unobserve(target)
}
const lazyObserver = new IntersectionObserver(
  lazyLoad, 
  {
    root: null,
    threshold: 1
  }
)

images.forEach(img => {
  lazyObserver.observe(img)
})

// dots under the slider
const createDots = () => {
  slides.forEach((_,index) => {
    dotsContainer.insertAdjacentHTML(
      `beforeend`, 
      `<button class = "dots__dot" data-slide = "${index}"></button>`);
  })
}
createDots();

dotsContainer.addEventListener(`click`, (e) => {
  const target = e.target
  if (target.closest(`.dots__dot`)) {
    changeSlide(target.dataset.slide)
  }
});
const activateCurrentDot = (slide) => {
  document.querySelectorAll(`.dots__dot`).forEach(item => {
    item.classList.remove(`dots__dot--active`)
  });
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add(`dots__dot--active`)
};

// slider
let currentSlideIndex = 0;

const changeSlide = (currentSlideIndex) => {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - currentSlideIndex)}%)`;
  })
  activateCurrentDot(currentSlideIndex)
}
changeSlide(0)

const moveToRight = () => {
  currentSlideIndex++;
  if (currentSlideIndex === slides.length) {
    currentSlideIndex = 0
  }
  changeSlide(currentSlideIndex)
};

const moveToLeft = () => {
  if (currentSlideIndex === 0) {
    currentSlideIndex = slides.length;
  }
  currentSlideIndex--;
  changeSlide(currentSlideIndex);
};
rightArrow.addEventListener(`click`, moveToRight);
leftArrow.addEventListener(`click`, moveToLeft)

document.addEventListener(`keydown`, (e) => {
  if (e.key == `ArrowRight`) {
    moveToRight()
  }
  if (e.key == `ArrowLeft`) {
    moveToLeft()
  }
})