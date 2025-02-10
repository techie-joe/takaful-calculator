(function (
  w, d, c
) {
  var
    err = function (err) { return c.error(`Calculator Error: ${err}`) },
    log = c.log;

  // ===========================================================

  var ems = {};

  [
    'div', 'table', 'tr', 'td', 'b',
    ['cDisplay', 'div.c-display._pa._radius-x25r'],
    ['blink', 'a._btnlink._smaller']
  ].forEach(function (input) {
    let [tag, sel] = [input, input];
    if (Array.isArray(input)) {
      [tag, sel] = input;
    }
    ems[tag] = function (opt, content) {
      if (arguments.length === 1) { content = opt; opt = {}; }
      return m(sel, opt, content);
    };
  });

  var
    { cDisplay, blink, div, table, tr, td, b } = ems,
    hr = m('hr');

  function vd(label, value) {
    return tr([td(label), td(':'), td(value)])
  }

  function itext(opt, content) {
    if (arguments.length === 1) { content = opt; opt = {}; }
    return m('i._itext', m('i.itext', opt, content));
  }

  function closeButton(input) {
    var opt = {
      href: '#!/start',
      title: 'Close'
    };
    if (typeof input == 'string') { opt.title = input }
    else if (typeof input == 'object') { opt = input }
    return m('a.c-close._btnlink._small._no-pad._lh-0', opt, itext('×'))
  }

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

  function inRange(vnode) {
    let { value: val, min, max } = vnode.attrs;

    if (max < min) { [min, max] = [max, min]; }

    if (val !== undefined) {
      val = Math.max(min || -Infinity, Math.min(max || Infinity, val));
    } else {
      val = min !== undefined ? min : max !== undefined ? max : 0;
    }

    // log(min, max, val)
    return { val, min, max }
  }

  // ===========================================================

  function Glider(initial_vnode) {

    var { _onupdate } = initial_vnode.attrs;
    var { val, min, max } = inRange(initial_vnode);

    return {
      view: function (vnode) {
        var output = m('div.c-slider-display', `${val}`);
        var input = m('input[type=range].c-slider-input', {
          min: min, max: max, value: val,
          oninput: function (e) {
            val = Number(e.target.value);
            _onupdate(val);
          }
        });
        return m('div._p.c-full-slider', [output, input])
      }
    }
  }

  function Slider(initial_vnode) {

    var { id, title, update } = initial_vnode.attrs;
    var { val, min, max } = inRange(initial_vnode);

    function decrement() { val = Math.max(min, val - 1); update(val); }
    function increment() { val = Math.min(max, val + 1); update(val); }

    return {
      view: function (vnode) {
        return m('table.c-slider', { id: id }, m('tr', [
          // m('td.c-slider-value', val),
          m('td.c-count-value',
            m('input[type=number].c-input', {
              value: val, min: min, max: max,
              oninput: function (e) {
                // number = e.target.value;
                val = getNumberFrom(e.target);
                update(val);
              }
            })
          ),
          m('td', m('button', { onclick: decrement }, '-')),
          m('td', m('button', { onclick: increment }, '+')),
          m('td', { style: 'width:100%' }, m('input[type=range].c-slider-input', {
            title: title,
            min: min, max: max, value: val,
            onchange: function (e) { val = Number(e.target.value); },
            oncreate: function (_vnode) {
              _vnode.dom.addEventListener('input', function (e) {
                val = Number(e.target.value);
                m.redraw();
              });
            },
          }))
        ]))
      }
    }
  }

  function Count(initial_vnode) {

    var { id, update } = initial_vnode.attrs;
    var { val, min, max } = inRange(initial_vnode);

    function decrement() { val = Math.max(min, val - 1); update(val); }
    function increment() { val = Math.min(max, val + 1); update(val); }

    return {
      view: function (vnode) {
        return m('table.c-count._inline-block', { id: id }, m('tr', [
          // m('td.c-count-value', val),
          m('td.c-count-value',
            m('input[type=number].c-input', {
              value: val, min: min, max: max,
              oninput: function (e) {
                // number = e.target.value;
                val = getNumberFrom(e.target);
                update(val);
              }
            })
          ),
          m('td', m('button', { onclick: decrement }, '-')),
          m('td', m('button', { onclick: increment }, '+')),
        ]));
      }
    }
  }

  // var Example = {
  //   oninit: function(vnode) {
  //     c.log('initialized');
  //   },
  //   oncreate: function(vnode) {
  //     console.log('DOM created')
  //   },
  //   onbeforeupdate: function(newVnode, oldVnode) {
  //     return true
  //   },
  //   onupdate: function(vnode) {
  //     console.log('DOM updated')
  //   },
  //   onbeforeremove: function(vnode) {
  //     console.log('exit animation can start')
  //     return new Promise(function(resolve) {
  //       // call after animation completes
  //       resolve()
  //     })
  //   },
  //   onremove: function(vnode) {
  //     console.log('removing DOM element')
  //   },
  //   view: function (vnode) {
  //     return m('div', 'Hello')
  //   }
  // }

  var route = {}, routeStart = '/start';

  route['/start'] = {
    view: function (vnode) {
      return cDisplay([
        m('a._btnlink._small', { href: '#!/calculator' }, 'Open Calculator'), ' ',
        m('a._btnlink._small', { href: '#!/test' }, 'Test'), ' ',
        m('a._btnlink._small', { href: '#!/test2' }, 'Test 2'), ' ',
        hr,
        m('table._mono', [
        ]),
      ]);
    }
  };

  var test_v = 1000;

  route['/test'] = function Test(initial_vnode) {
    return {
      view: function (vnode) {
        return cDisplay([
          closeButton(),
          div(b('Test')), hr,
          m('table._mono', [
            vd('',
              m('input[type=number]', {
                value: test_v,
                oninput: function (e) {
                  // number = e.target.value;
                  test_v = getNumberFrom(e.target);
                }
              })
            ),
            vd('test_v', formatNumber(test_v)),
          ]),
          hr,
          blink({ href: '#!/start' }, 'Close'), ' ',
        ])
      }
    }
  };

  var glider = 20;
  var slider = 10;
  var slidex = 90;
  var count = 100;
  var number = 1001;

  var TestValues = {
    view: function (vnode) {
      return m('table._mono', [
        vd('Glider', formatNumber(glider)),
        vd('Slider', formatNumber(slider)),
        vd('Slidex', formatNumber(slidex)),
        vd('Count', formatNumber(count)),
        vd('Number', formatNumber(number)),
        // vd('test_v', formatNumber(test_v)),
      ]);
    }
  }

  route['/test2'] = function Test2(initial_vnode) {
    return {
      view: function (vnode) {
        return cDisplay([
          closeButton(),
          div(b('Test 2')), hr,
          m('div.i_row', [
            m(Glider, {
              id: 'glider', min: 0, max: 100, value: glider,
              _onupdate: function (val) {
                glider = val;
                m.redraw();
              }
            }),
            m('span.c-row-label', 'Glider'),
            m('span.c-count-value',
              glider
            ),
          ]),
          m('div.i_row', [
            m('span.c-row-label', 'Slider'),
            m(Slider, {
              id: 'slider', min: 0, max: 100, value: slider,
              update: function (val) { slider = val; }
            }),
          ]),
          m('div.i_row', [
            m('span.c-row-label', 'Slidex'),
            m(Slider, {
              id: 'slidex', min: 0, max: 100, value: slidex,
              update: function (val) { slidex = val; }
            }),
          ]),
          m('div.i_row', [
            m('span.c-row-label', 'Count'),
            m(Count, {
              id: 'count', min: 0, max: 200, value: count,
              update: function (val) { count = val; }
            }),
          ]),
          m('div.i_row', [
            m('span.c-row-label', 'Number'),
            m('table.c-count._inline-block', { id: 'number' }, m('tr', [
              // m('td.c-count-value', number),
              m('td.c-count-value',
                m('input[type=number].c-input2', {
                  value: number, min: 0, max: 99999,
                  oninput: function (e) {
                    // number = e.target.value;
                    number = getNumberFrom(e.target);
                  }
                })
              ),
            ])),
          ]),
          hr,
          m(TestValues),
          hr,
          blink({ href: '#!/start' }, 'Close'), ' ',
        ])
      }
    }
  }

  route['/calculator'] = function Calculator(initial_vnode) {

    return {
      onupdate: function (vnode) { m.redraw(); },
      view: function () {
        return [
          cDisplay([
            closeButton('Close Calculator'),
            m('h3._h6._no-margin', 'Takaful Calculator'),
            hr,
            div('Coming soon ..'),
            hr,
            blink({ href: '#!/start' }, 'Close'), ' ',
          ]),
        ]
      }
    };
  }

  // ===========================================================

  w.addEventListener('load', function () {

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