import './animate';
import FullPagePaginator from './paginate';
import './navigate';




let fpS = new FullPagePaginator({

  sectionToScrollParent: '.js-fp-scroll',
  scrollDelay: 2000,
  initalPermission: true,
  nav: true,
  generateNav: false,
  triggersToNav: false


});

