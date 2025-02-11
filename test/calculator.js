(function (
  w, d, c
) {
  var
    fun = {},
    log = c.log;

  // ===========================================================
  // Functions
  // ===========================================================

  function has(v) { return v !== undefined }

  function err(err) { return c.error(`Calculator Error: ${err}`) }

  function getNumberFrom(input) {
    let
      min = input.min || -Infinity,
      max = input.max || Infinity,
      val = Number(input.value);
    return Math.max(min, Math.min(max, val));
  }

  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // ===========================================================
  // Components
  // ===========================================================


  function createFun(input) {
    let [tag, sel] = [input, input];
    if (Array.isArray(input)) { [tag, sel] = input; }
    return fun[tag] = function (opt, content) {
      if (arguments.length === 1) { content = opt; opt = {}; }
      return m(sel, opt, content);
    };
  }

  [
    'div', 'table', 'tr', 'td', 'b',
    ['cDisplay', 'div.c-display._pa._radius-x25r'],
    ['blink', 'a._btnlink._smaller'],
    ['irow', 'div.i_row'],
    ['ilabel', 'span.c-input-label'],
    ['itable', 'table.c-input-table'],
    ['itd', 'td.c-input-td'],
    ['vtd', 'td.c-value-td'],
  ].forEach(createFun);

  var
    hr = m('hr'),
    {
      div, table, tr, td, b,
      cDisplay, blink,
      irow, ilabel, itable, itd,
      vtd,
    } = fun;

  function vd(label, value) {
    return tr([td(label), td(':'), td(value)])
  }

  function itext(opt, content) {
    if (arguments.length === 1) { content = opt; opt = {}; }
    return m('i._itext', m('i.itext', opt, content));
  }

  function closeButton(input, href = '#!/start') {
    var opt = { href: href, title: 'Close' };
    if (typeof input === 'string') { opt.title = input }
    else if (typeof input === 'object') { opt = input }
    return m('a.c-close._btnlink._small._no-pad._lh-0', opt, itext('×'))
  }

  function iSlider(val, key, opt) {
    opt.value = val[key];
    _oninput = opt.oninput;
    opt.oninput = function (e) {
      val[key] = Number(e.target.value);
      if (typeof _oninput === 'function') { _oninput(e) }
    };
    var reverse_tag = opt.reverse ? '.c-reverse' : '';
    return m('input[type=range].c-slider-input' + reverse_tag, opt)
  }

  function iNumber(val, key, opt) {
    var { min, max } = opt;

    if (max < min) { [min, max] = [max, min]; }

    var v = val[key];
    if (has(v)) { v = Math.max(min || -Infinity, Math.min(max || Infinity, v)); }
    else { v = (has(min) ? min : has(max) ? max : 0); }

    opt.value = val[key] = v;

    _oninput = opt.oninput;
    opt.oninput = function (e) {
      val[key] = getNumberFrom(e.target);
      if (typeof _oninput === 'function') { _oninput(e) }
    };

    return m('input[type=number].c-input', opt)
  }

  function Glider(val, key, opt) {

    var { id, min, max, iclass, reverse } = opt;

    var tip = ((val[key] - min) / (max - min) * 99);
    var tips = reverse ? { right: `${tip}%` } : { left: `${tip}%` };

    var output = m('div.c-glider-display',
      m('span.c-glider-display-text',
        { style: tips },
        `${formatNumber(val[key])}`)
    );

    var inputSlider = iSlider(val, key, {
      id: id + '-slider', min: min, max: max, reverse: reverse,
    });

    var inputNumber = iNumber(val, key, {
      id: id + '-input', min: min, max: max, class: iclass,
    });

    return [
      // m('pre._pre',`[ Glider: (${key}:${val[key]}) ]\n${JSON.stringify(opt)}`),
      m('span.c-value', inputNumber),
      m('div.c-glider._pt-x5r._pb', [
        output,
        inputSlider
      ]),
    ];
  }

  function initClicker(val, key, opt) {

    var { min, max, reverse } = opt;

    var decrement = function () { val[key] = Math.max(min, val[key] - 1); }
    var increment = function () { val[key] = Math.min(max, val[key] + 1); }

    if (reverse) { [decrement, increment] = [increment, decrement] }

    var incrementButton = m('button.c-sr-button', { onclick: decrement }, '-');
    var decrementButton = m('button.c-sr-button', { onclick: increment }, '+');

    return { increment, decrement, incrementButton, decrementButton }

  }

  function Slider(val, key, opt) {

    var { id, min, max, iclass, reverse } = opt;

    var { increment, decrement, incrementButton, decrementButton } = initClicker(val, key, opt)

    var inputNumber = iNumber(val, key, {
      id: id + '-number', min: min, max: max, class: iclass,
    });

    var inputSlider = iSlider(val, key, {
      id: id + '-slider', min: min, max: max, reverse: reverse,
    });

    return [
      // m('pre._pre', `[ Slider: (${key}:${val[key]}) ]\n${JSON.stringify(opt)}`),
      m('span.c-value', inputNumber),
      itable({ id: id + '-table', class: 'c-slider' }, m('tr', [
        m('td', incrementButton),
        m('td', decrementButton),
        m('td.c-slider-td', inputSlider),
      ])) // itable
    ];
  }

  function Counter(val, key, opt) {

    var { id, min, max, iclass } = opt;

    var { increment, decrement, incrementButton, decrementButton } = initClicker(val, key, opt)

    var inputNumber = iNumber(val, key, {
      id: id + '-number', min: min, max: max, class: iclass,
    });

    return [
      // m('pre._pre', `[ Counter: (${key}:${val[key]}) ]\n${JSON.stringify(opt)}`),
      m('span.c-value', inputNumber),
      itable({ id: id + '-table', class: 'c-counter' }, m('tr', [
        m('td', incrementButton),
        m('td', decrementButton),
      ])) // itable
    ];

  }

  // function Sample(initial_vnode) {
  //   return {
  //     oninit: function (vnode) {
  //       c.log('initialized');
  //     },
  //     oncreate: function (vnode) {
  //       console.log('DOM created')
  //     },
  //     onbeforeupdate: function (newVnode, oldVnode) {
  //       return true
  //     },
  //     onupdate: function (vnode) {
  //       console.log('DOM updated')
  //     },
  //     onbeforeremove: function (vnode) {
  //       console.log('exit animation can start')
  //       return new Promise(function (resolve) {
  //         // call after animation completes
  //         resolve()
  //       })
  //     },
  //     onremove: function (vnode) {
  //       console.log('removing DOM element')
  //     },
  //     view: function (vnode) {
  //       return m('div', 'Hello')
  //     }
  //   }
  // }

  // ===========================================================
  // Start Page
  // ===========================================================

  var
    vars = {},
    route = {};

  route['/start'] = function Start(initial_vnode) {
    var btn = createFun(['btn', 'a._btnlink._small']);
    return {
      view: function (vnode) {
        return cDisplay([
          btn({ href: '#!/calculator', class: 'primary-button' }, 'Open Calculator'), ' ',
          hr,
          btn({ href: '#!/test1' }, 'Test Glider'), ' ',
          btn({ href: '#!/test2' }, 'Test Slider'), ' ',
          btn({ href: '#!/test3' }, 'Test Counter'), ' ',
          btn({ href: '#!/test4' }, 'Test Input'), ' ',
          hr,
          m('pre._pre', JSON.stringify(vars, null, 2)),
        ]);
      }
    }
  };

  // ===========================================================
  // Test Pages
  // ===========================================================

  vars.glider = 20;
  vars.glidex = 20;

  route['/test1'] = function TestGlider(initial_vnode) {
    return {
      view: function (vnode) {
        return cDisplay([
          closeButton(),
          div(b('Test Glider')), hr,
          irow([
            ilabel('Glider'),
            Glider(vars, 'glider', {
              id: 'glider', min: 0, max: 100
            }),
          ]),
          irow([
            ilabel('Glidex'),
            Glider(vars, 'glidex', {
              id: 'glidex', min: 0, max: 100, reverse: true
            }),
          ]),
          hr,
          m('table._mono', [
            vd('Glider', formatNumber(vars.glider)),
            vd('Glidex', formatNumber(vars.glidex)),
          ]),
          hr,
          blink({ href: '#!/start' }, 'Close'), ' ',
        ])
      }
    }
  }

  vars.slider = 10;
  vars.slidex = 10;

  route['/test2'] = function TestSlider(initial_vnode) {
    return {
      view: function (vnode) {
        return cDisplay([
          closeButton(),
          div(b('Test Slider')), hr,
          irow([
            ilabel('Slider'),
            Slider(vars, 'slider', {
              id: 'slider', min: 0, max: 100, iclass: 'c-w2',
            }),
          ]),
          irow([
            ilabel('Slidex'),
            Slider(vars, 'slidex', {
              id: 'slidex', min: 0, max: 100, iclass: 'c-w2', reverse: true,
            }),
          ]),
          hr,
          m('table._mono', [
            vd('Slider', formatNumber(vars.slider)),
            vd('Slidex', formatNumber(vars.slidex)),
          ]),
          hr,
          blink({ href: '#!/start' }, 'Close'), ' ',
        ])
      }
    }
  }

  vars.counter = 100;

  route['/test3'] = function TestCounter(initial_vnode) {
    return {
      view: function (vnode) {
        return cDisplay([
          closeButton(),
          div(b('Test Counter')), hr,
          irow([
            ilabel('Counter'),
            Counter(vars, 'counter', {
              id: 'counter', min: 0, max: 200, iclass: 'c-w2',
            }),
          ]),
          hr,
          m('table._mono', [
            vd('Counter', formatNumber(vars.counter)),
          ]),
          hr,
          blink({ href: '#!/start' }, 'Close'), ' ',
        ])
      }
    }
  }

  vars.number = 2000000;
  vars.nombor = 1000000000;

  route['/test4'] = function TestInput(initial_vnode) {
    return {
      view: function (vnode) {
        return cDisplay([
          closeButton(),
          div(b('Test Input')), hr,
          irow([
            ilabel('Number'),
            iNumber(vars, 'number', {
              id: 'number', class: 'c-w3', min: 0, max: 99999,
            })
          ]),
          irow([
            ilabel('Nombor'),
            m('input[type=number]', {
              id: 'nombor',
              value: vars.nombor,
              oninput: function (e) { vars.nombor = getNumberFrom(e.target); }
            })
          ]),
          hr,
          m('table._mono', [
            vd('Number', formatNumber(vars.number)),
            vd('Nombor', formatNumber(vars.nombor)),
          ]),
          hr,
          blink({ href: '#!/start' }, 'Close'), ' ',
        ])
      }
    }
  };

  // vars.keyX = value;
  // 
  // route['/testX'] = function TestX(initial_vnode) {
  //   return {
  //     view: function (vnode) {
  //       return cDisplay([
  //         closeButton(),
  //         div(b('Test X')), hr,
  //         hr,
  //         m('table._mono', [
  //           // vd('keyX', formatNumber(vars.keyX)),
  //         ]),
  //         hr,
  //         blink({ href: '#!/start' }, 'Close'), ' ',
  //       ])
  //     }
  //   }
  // }

  // ===========================================================
  // Calculator Page
  // ===========================================================
  
  route['/calculator'] = function Calculator(initial_vnode) {
    var vars = {
      monthlyIncome: 3500,
      monthlyContribution: 120,
      coverage: 570000,
      age: 25,
      savings: 210000
    };
    return {
      view: function (vnode) {
        return cDisplay([
          closeButton('Close Calculator'),
          m('div#c-intro', m('span', 'Takaful Calculator')),
          // -----------------------------------------------
          irow([
            ilabel('Coverage'),
            Glider(vars, 'coverage', {
              id: 'coverage', min: 50000, max: 900000,
            }),
          ]),
          // -----------------------------------------------
          irow([
            ilabel('Savings'),
            Glider(vars, 'savings', {
              id: 'savings', min: 0, max: 999000,
            }),
          ]),
          // -----------------------------------------------
          irow([
            ilabel('Monthly Income'),
            iNumber(vars, 'monthlyIncome', {
              id: 'monthlyIncome', min: 0, max: 99999,
            })
          ]),
          // -----------------------------------------------
          irow([
            ilabel('Monthly Contribution'),
            Slider(vars, 'monthlyContribution', {
              id: 'monthlyContribution', min: 0, max: 2000, iclass: 'c-w3',
            }),
          ]),
          // -----------------------------------------------
          irow([
            ilabel('Age'),
            Slider(vars, 'age', {
              id: 'age', min: 18, max: 90, reverse: false, iclass: 'c-w3',
            }),
          ]),
          // -----------------------------------------------
          hr,
          m('table._mono', [
            // vd('keyX', formatNumber(vars.keyX)),
          ]),
          hr,
          blink({ href: '#!/start', class: 'primary-button', title: 'Proceed to the next step' }, 'Submit Application'), ' ',
          blink({ href: '#!/start', title: 'Cancel application' }, 'Cancel'), ' ',
        ])
      }
    }
  }

  // ===========================================================
  // Routing
  // ===========================================================

  var routeStart = '/start';

  var _windowOnload = window.onload;

  w.addEventListener('load', function (event) {

    if (typeof _windowOnload === 'function') { _windowOnload(event); }

    log('The entire page is fully loaded, including all deferred scripts.');
    // log(calculator,load_calculator_to);

    var e;

    if (w.load_calculator_to) {
      log(`load_calculator_to: id: ${w.load_calculator_to}`);
      e = d.getElementById(w.load_calculator_to);
    }

    else if (calculator) {
      log(`load_calculator_to: dom: `, w.calculator);
      e = w.calculator;
    }

    if (!e) { return err('Fail to load calculator. No DOM found.'); }

    log(`routeStart : ${routeStart}`);
    m.route(e, routeStart, route);

  });

})(
  window,
  document,
  console
);