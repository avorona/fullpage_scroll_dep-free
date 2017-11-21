import PubSub from 'pubsub-js';

PubSub.subscribe( 'scrollToSection', function(msg, data) {

 

  let pagSelector=data.selector;

  let pagLinks = [].slice.call(document.querySelectorAll(pagSelector));
  //   console.log(pagLinks);

  pagLinks.forEach(function(el) {

    el.classList.remove('is-active');

  });
    

  let pagLinkActive=pagLinks.find(function(el) {

    let elDataNumeral = +el.getAttribute('data-scroll-to');
        


    if (elDataNumeral === data.to) return true;

  });

  pagLinkActive.classList.add('is-active');



});
