(function (
  w, d, c
) {
  var
    err = function (err) { return c.error(`Calculator Error: ${err}`) },
    log = c.log,
    xxx = undefined;

  // ===========================================================

  function blink(opt, content) {
    return m('a._btnlink._smaller', opt, content);
  }

  function itext(opt, content) {
    return m('i._itext', m('i.itext', opt, content));
  }

  function inRange(vnode) {
    var val = vnode.attrs.value;
    var min = vnode.attrs.min;
    var max = vnode.attrs.max;

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
        var input = m('input.c-slider-input', {
          type: 'range', min: min, max: max, value: val,
          oncreate: function (_vnode) {
            _vnode.dom.addEventListener('input', function (e) {
              val = Number(e.target.value);
              m.redraw();
            });
          },
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
      view: function (vnode) {
        return m('table.c-slider', { id: initial_vnode.attrs.id }, m('tr', [
          // m('td.c-slider-value', val),
          m('td.c-count-value', m('input.c-input', {
            type: 'number', value: val,
            oncreate: function (_vnode) {
              _vnode.dom.addEventListener('change', function (e) {
                let v = _vnode.dom.value;
                v = isNaN(v) ? val : Number(v);
                val = v < min ? min : v > max ? max : v;
                m.redraw();
              });
            },
          })),
          m('td', m('button', { onclick: decrement }, '-')),
          m('td', m('button', { onclick: increment }, '+')),
          m('td', { style: 'width:100%' }, m('input', {
            type: 'range',
            class: 'c-slider-input',
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

  function Count(initial_vnode) {

    var { val, min, max } = inRange(initial_vnode);

    function decrement() { val = (val > min) ? (val - 1) : min; val = val > max ? max : val; }
    function increment() { val = (val < max) ? (val + 1) : max; val = val < min ? min : val; }

    return {
      view: function (vnode) {
        return m('table.c-count._inline-block', { id: initial_vnode.attrs.id }, m('tr', [
          m('td.c-count-value', val),
          m('td.c-count-value', m('input.c-input', {
            type: 'number', min: min, max: max, value: val,
            oncreate: function (_vnode) {
              _vnode.dom.addEventListener('change', function (e) {
                let v = _vnode.dom.value;
                v = isNaN(v) ? val : Number(v);
                val = v < min ? min : v > max ? max : v;
                m.redraw();
              });
            },
          })),
          m('td', m('button', { onclick: decrement }, '-')),
          m('td', m('button', { onclick: increment }, '+')),
        ]));
      }
    }
  }

  function Calculator(initial_vnode) {

    var testVal = 100;
    var countVal = 100;
    var gliderVal = 20;
    var sliderVal = 10;
    var slidexVal = 90;
  
    return {
      view: function () {
        return [
          m('div.c-display._pa._radius-x25r', [
            m('a.c-close._btnlink._small._no-pad._lh-0', { href: '#!/hello', title: 'Close Calculator' }, itext('×')),
            m('h3._h6._no-margin', 'Takaful Calculator'), m('hr'),
            m(Glider, { id: 'glider', min: 0, max: 100, value: gliderVal }),
            m('div', [
              m('span.c-row-label', 'Slider'),
              m(Slider, { id: 'slider', min: 0, max: 100, value: sliderVal }),
            ]),
            m('div', [
              m('span.c-row-label', 'Slidex'),
              m(Slider, { id: 'slidex', min: 0, max: 100, value: slidexVal }),
            ]),
            m('div', [
              m('span.c-row-label', 'Count'),
              m(Count, { id:'count', min: 0, max: 200, value: countVal }),
            ]),
            m('div', [
              m('span.c-row-label', 'Test'),
              m('table.c-count._inline-block', {id:'test'}, m('tr', [
                m('td.c-count-value', testVal),
                m('input', {
                  type: 'number', min: 0, max: 99999, value: testVal,
                  oncreate: function (_vnode) {
                    _vnode.dom.addEventListener('change', function (e) {
                      let v = _vnode.dom.value;
                      testVal = isNaN(v) ? v : Number(v);
                      m.redraw();
                    });
                  },
                }),
              ])),
            ]),
            m('hr'),
            blink({ href: '#!/hello' }, 'Close'), ' ',
          ]),
        ]
      }
    };
  }

  var Hello = {
    view: function () {
      return m('div.c-display._pa._radius-x25r', [
        m('a._btnlink._small', { href: '#!/calculator' }, 'Open Calculator'),
      ]);
    }
  };

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

  // ===========================================================

  function loadAppTo(e) {
    m.route(e, '/calculator', {
      '/hello': Hello,
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
    } else if (calculator) {
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