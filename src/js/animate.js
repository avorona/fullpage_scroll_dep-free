import PubSub from 'pubsub-js';
import {
  TimelineMax
} from 'gsap';



PubSub.subscribe('scrollToSection', function(msg, data) {

  let from = data.from;
  let to = data.to;

  let sections = [].slice.call(document.querySelectorAll('[data-scroll]'));



  function filterSection(all, atr, value) {

    let r = all.find(function(el) {

      let elDataNumeral = +el.getAttribute(atr);

      if (elDataNumeral === value) return true;

    });

    return r;

  }

  let currentSection = filterSection(sections, 'data-scroll', from);

  let nextSection = filterSection(sections, 'data-scroll', to);



  // console.log(currentSection, nextSection);



  new TimelineMax()
    .set(currentSection, {
      zIndex: 20
    })
    .set(nextSection, {
      zIndex: 30
    });


  let tl = new TimelineMax();
  tl

    .fromTo(currentSection, 0.5, {
      y: '0%',
      opacity: 1
    }, {
      y: '-100%',
      opacity: 0
    })
    .fromTo(nextSection, 0.5, {
      y: '100%',
      opacity: 1
    }, {
      y: '0%',
      opacity: 1
    }, 0);


});
