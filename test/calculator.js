(function (
  w, d, c
) {
  var
    save = {},
    err = function (err) { return c.error(`Calculator Error: ${err}`) },
    log = c.log,
    xxx = undefined;

  // ===========================================================

  var
    hr = m('hr'),
    ems = {};

  [
    'div', 'table', 'tr', 'td', 'b'
  ].forEach(function (tag) {
    ems[tag] = function (opt, content) {
      if (arguments.length === 1) { content = opt; opt = {}; }
      return m(tag, opt, content);
    };
  });

  var
    div = ems.div,
    table = ems.table,
    tr = ems.tr,
    td = ems.td,
    b = ems.b;

  function vd(label, value) {
    return tr([td(label), td(':'), td(value)])
  }

  [
    ['cDisplay', 'div.c-display._pa._radius-x25r'],
    ['blink', 'a._btnlink._smaller']
  ].forEach(function (tag) {
    ems[tag[0]] = function (opt, content) {
      if (arguments.length === 1) { content = opt; opt = {}; }
      return m(tag[1], opt, content);
    };
  });

  var
    cDisplay = ems.cDisplay,
    blink = ems.blink;

  function itext(opt, content) {
    if (arguments.length === 1) { content = opt; opt = {}; }
    return m('i._itext', m('i.itext', opt, content));
  }

  function closeButton(opt = {}, title = 'Close') {
    if (arguments.length === 1) { title = opt; opt = {}; }
    opt.href = '#!/start';
    opt.title = title;
    return m('a.c-close._btnlink._small._no-pad._lh-0', opt, itext('×'))
  }

  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function inRange(vnode) {
    var
      val = vnode.attrs.value,
      min = vnode.attrs.min,
      max = vnode.attrs.max;

    if (max < min) {
      let _min = min;
      min = max;
      max = _min;
    }
    if (val) {
      if (min) { val = val < min ? min : val; }
      if (max) { val = val > max ? max : val; }
    } else {
      val = min ? min : max ? max : val;
    }

    // log(min, max, val)
    return { val, min, max }
  }

  // ===========================================================

  function Glider(initial_vnode) {
    var min = initial_vnode.attrs.min;
    var max = initial_vnode.attrs.max;
    var val = initial_vnode.attrs.value;
    return {
      view: function (vnode) {
        var output = m('div.c-slider-display', `${val}`);
        var input = m('input[type=range].c-slider-input', {
          min: min, max: max, value: val,
          oninput: function (e) {
            val = Number(e.target.value);
            initial_vnode.attrs._onupdate(val);
          }
        });
        return m('div._p.c-full-slider', [output, input])
      }
    }
  }

  function Slider(initial_vnode) {

    var { val, min, max } = inRange(initial_vnode);

    function decrement() { val = (val > min) ? (val - 1) : min; val = val > max ? max : val; }
    function increment() { val = (val < max) ? (val + 1) : max; val = val < min ? min : val; }

    return {
      onupdate: function (vnode) {
        initial_vnode.attrs._onupdate(val);
      },
      view: function (vnode) {
        return m('table.c-slider', { id: initial_vnode.attrs.id }, m('tr', [
          // m('td.c-slider-value', val),
          m('td.c-count-value', m('input[type=number].c-input', {
            value: val,
            oncreate: function (_vnode) {
              function updateInput(e) {
                let v = _vnode.dom.value;
                v = isNaN(v) ? val : Number(v);
                val = v < min ? min : v > max ? max : v;
                m.redraw();
              }
              _vnode.dom.addEventListener('change', updateInput);
              _vnode.dom.addEventListener('keyup', updateInput);
            },
          })),
          m('td', m('button', { onclick: decrement }, '-')),
          m('td', m('button', { onclick: increment }, '+')),
          m('td', { style: 'width:100%' }, m('input[type=range].c-slider-input', {
            title: initial_vnode.attrs.title,
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

  function Values() {
    return m('table._mono', [
      vd('Glider', formatNumber(glider)),
      vd('Slider', formatNumber(slider)),
      vd('Slidex', formatNumber(slidex)),
      vd('Count', formatNumber(count)),
      vd('Number', formatNumber(number)),
    ]);
  }

  function Calculator(initial_vnode) {

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

  var Hello = {
    view: function () {
      return cDisplay([
        m('a._btnlink._small', { href: '#!/calculator' }, 'Open Calculator'), ' ',
        m('a._btnlink._small', { href: '#!/test' }, 'Test'), ' ',
        m('a._btnlink._small', { href: '#!/test2' }, 'Test 2'), ' ',
        hr,
        Values(),
        m('table._mono', [
          vd('test_v', formatNumber(test_v)),
        ]),
      ]);
    }
  };

  var test_v = 1;

  function Test(initial_vnode) {
    return {
      view: function (vnode) {
        return cDisplay([
          closeButton(),
          div(b('Test')), hr,
          m('table._mono', [
            vd('input', m('input[type=number]', {
              value: test_v,
              oninput: function (e) {
                test_v = e.target.value;
              }
            })),
            vd('test_v', formatNumber(test_v)),
          ]),
          hr,
          blink({ href: '#!/start' }, 'Close'), ' ',
        ])
      }
    }
  }

  var glider = 20;
  var slider = 10;
  var slidex = 90;
  var count = 100;
  var number = 1001;

  function Test2(initial_vnode) {
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
            m('span.c-count-value', glider),
          ]),
          m('div.i_row', [
            m('span.c-row-label', 'Slider'),
            m(Slider, {
              id: 'slider', min: 0, max: 100, value: slider,
              _onupdate: function (val) {
                slider = val;
                m.redraw();
              }
             }),
          ]),
          m('div.i_row', [
            m('span.c-row-label', 'Slidex'),
            m(Slider, {
              id: 'slidex', min: 0, max: 100, value: slidex,
              _onupdate: function (val) {
                slidex = val;
                m.redraw();
              }
            }),
          ]),
          m('div.i_row', [
            m('span.c-row-label', 'Count'),
            m(Count, {
              id: 'count', min: 0, max: 200, value: count,
              _onupdate: function (val) {
                count = val;
                m.redraw();
              }
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
                    var min = 0;
                    var max = 99999;
                    let v = Number(e.target.value);
                    number = v < min ? min : v > max ? max : v;
                  }
                })
              ),
            ])),
          ]),
          hr,
          Values(),
          hr,
          blink({ href: '#!/start' }, 'Close'), ' ',
        ])
      }
    }
  }

  function Count(initial_vnode) {

    var { val, min, max } = inRange(initial_vnode);

    function decrement() { val = (val > min) ? (val - 1) : min; val = val > max ? max : val; }
    function increment() { val = (val < max) ? (val + 1) : max; val = val < min ? min : val; }

    return {
      onupdate: function (vnode) {
        initial_vnode.attrs._onupdate(val);
      },
      view: function (vnode) {
        return m('table.c-count._inline-block', { id: initial_vnode.attrs.id }, m('tr', [
          // m('td.c-count-value', val),
          m('td.c-count-value',
            m('input[type=number].c-input', {
              value: val, min: min, max: max,
              oninput: function (e) {
                // val = e.target.value;
                let v = Number(e.target.value);
                val = v < min ? min : v > max ? max : v;
              }
            }
            )),
          m('td', m('button', { onclick: decrement }, '-')),
          m('td', m('button', { onclick: increment }, '+')),
        ]));
      }
    }
  }

  // ===========================================================

  function loadAppTo(e) {

    m.route(e, '/test2', {
      '/start': Hello,
      '/test': Test,
      '/test2': Test2,
      '/calculator': Calculator,
    });

  }

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

    loadAppTo(e);

  });

})(
  window,
  document,
  console
);