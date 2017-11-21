



export default class FullPagePaginator {
  // thanks  @akella for prototype
  constructor(settings) {
    this.scroll = {
      delay: settings.scrollDelay,
      permission: settings.initalPermission,
      targetParent: settings.sectionToScrollParent || '.js-fp-scroll',
      direction: 1,
      itemData: 'data-scroll'
    },
    this.nav = {
      base: settings.nav,
      generate: settings.generateNav || false,
      parent: settings.triggersToNav || '.js-fp-nav',
      itemData: 'data-scroll-to',
      itemDataSelector: '[data-scroll-to]'
    };
    this.navItem;
    this.section = {
      current: 0,
      next: 0,
      amount: 0,

    },

    this.initialize();

  }

  initialize() {

    this.initializePages();

  }

  initializePages() {

    let self = this;

    let sectionParent = document.querySelector(self.scroll.targetParent);

    // console.log(sectionParent.children);

    let sections = [].slice.call(sectionParent.children);

    let sectionAmount = sections.length;

    this.section.amount = sectionAmount;
    this.section.current = 0;
    this.section.next = 1;

    self.addDataAttributes(self.scroll.targetParent, 'data-scroll');

    if (self.nav.generate || self.nav.base) {

      if (self.nav.generate && self.nav.base) {

        self.generateNav(sectionParent);

        self.addDataAttributes(self.nav.parent, self.nav.itemData);

        let navItem = document.querySelectorAll(self.nav.itemData);

        self.navItem = navItem;

      } else if (!self.nav.generate && self.nav.base) {

        self.addDataAttributes(self.nav.parent, self.nav.itemData);

        let navItem = document.querySelectorAll(self.nav.itemData);

        self.navItem = navItem;

      } 

    } 

    this.bindEvents();
  }


  generateNav(wrapper) {

    let self=this;

    let w=wrapper;

    let nav = document.createElement('nav');
    nav.classList.add('pagination');
    let list = document.createElement('div');
    list.classList.add('pagination__list', 'js-fp-nav');

    for (let j = 0; j < self.section.amount; j++) {

      let item = document.createElement('button');
      item.classList.add('pagination__item');

      list.appendChild(item);
    }

    nav.appendChild(list);
    // console.log(sectionParent, nav, list);
    w.appendChild(nav);

  }

  addDataAttributes(parent, dataAttr) {

    let p = parent;
    let atr = dataAttr;

    let pIt = document.querySelectorAll(p);

    if (pIt.length===0) return;

 
    let it = [].slice.call(pIt[0].children);

    it.forEach(function(e, i) {

      e.setAttribute(atr, i);

      if (i === 0) {
        e.classList.add('is-active');

      }

    });

  }

  bindEvents() {

    this.scrollEvent();

    if (this.nav.base) this.clickEvent();
   
  }


  throttle(func, wait = 100) {


    let timer = null;
    return function(...args) {
      if (timer === null) {
        timer = setTimeout(() => {
          func.apply(this, args);
          timer = null;
        }, wait);
      }
    };

  }

  scrollEvent() {

    let self = this;

    let delay=this.scroll.delay;


    const throttled = self.throttle(scrollToSection, delay);
    window.addEventListener('wheel', throttled);
  



    function scrollToSection(event) {
      
      // console.log(self.scroll.permission);
      if (!self.scroll.permission) return;

      let current = self.section.current;
      let next = self.section.next;
      let amount = self.section.amount;
      let direction = self.scroll.direction;
      
      direction = event.deltaY > 0 ? 1 : -1;

      self.scroll.direction=direction;

      console.log(self.scroll.direction);

      next = current + direction;
      self.section.next = next;

      // console.log(current, next, amount);

      if (next > amount - 1 || next < 0) return;

      self.scroll.permission = false;

      self.animateTransitions();

      self.section.current = self.section.next;
      self.scroll.permission = true;

    }
   

  }

  animateTransitions() {

    let self = this;


    self.animateScroll({
      from: self.section.current,
      to: self.section.next,
    });

    if (self.nav.base) {
      // console.log(self.nav.base);

      self.animateNav({

        from: self.section.current,
        to: self.section.next,
        selector: self.nav.itemDataSelector

      });
    }

   
  }

  animateScroll(data) {
 
    let self=this;

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
    let direction = self.scroll.direction;

    self.animateFadeOut(currentSection,direction);
    self.animateFadeIn(nextSection,direction);


  }

  animateFadeOut(target, direction) {
    console.log(direction);

    if (direction > 0) {

      target.style.top = '-100%';


    } else if (direction < 0) {

      target.style.top = '100%';


    }

    target.classList.toggle('is-active');
    
  }
  
  animateFadeIn(target, direction) {

    console.log(direction);

    if (direction>0) {

      target.style.top='0';


    } else if (direction<0) {

      target.style.top = '0';


    }


    target.classList.add('is-active');
    


  }

  animateNav(data) {

    

    let pagSelector = data.selector;

    let pagLinks = [].slice.call(document.querySelectorAll(pagSelector));
    //   console.log(pagLinks);

    pagLinks.forEach(function(el) {

      el.classList.remove('is-active');

    });


    let pagLinkActive = pagLinks.find(function(el) {

      let elDataNumeral = +el.getAttribute('data-scroll-to');

      if (elDataNumeral === data.to) return true;

    });

    pagLinkActive.classList.add('is-active');

  }



  clickEvent() {

    let self = this;
    let delay = self.scroll.delay;
  
    let itemSelector = self.nav.itemDataSelector;

    let pagItem = document.querySelectorAll(itemSelector);

    const throttled = self.throttle(clickToSection, delay);

    // console.log(throttled);
    pagItem.forEach(function(el) {
    
      el.addEventListener('click', throttled );

    });


    function clickToSection(event) {

      event.preventDefault();

      if (!self.scroll.permission) return;

      self.scroll.permission = false;

      let target = event.target;
      // console.log(event);

      let targetData = target.getAttribute(self.nav.itemData);

      self.section.next = +targetData;

      if (self.section.next !== self.section.current) {

        // console.log(self.section.next, self.section.current);

        if (self.section.current > self.section.next) {


          self.scroll.direction = -1;

        } else {

          self.scroll.direction = 1;

        }

        




        




        self.animateTransitions();

     
        self.section.current = self.section.next;

        // console.log(self.section.next, self.section.current);


      }

      self.scroll.permission = true;

    }


  }



}
