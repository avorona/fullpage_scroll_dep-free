
import FullPagePaginator from './paginate';

let fpS = new FullPagePaginator({


  sectionToScrollParent: '.js-fp-scroll',
  scrollDelay: 1000,
  initalPermission: true,
  nav: true,
  generateNav: true,
  triggersToNav: false


});

// document.addEventListener('click', function() {

//   fpS.goToSection(2);

// });
