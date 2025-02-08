(function (
  w, d, c
) {
  var
    err = function (err) { return c.error(`Calculator Error: ${err}`) },
    log = c.log;

  var Example = {

    // oninit: function(vnode) {
    //   c.log('initialized');
    // },
    // oncreate: function(vnode) {
    //   console.log('DOM created')
    // },
    // onbeforeupdate: function(newVnode, oldVnode) {
    //   return true
    // },
    // onupdate: function(vnode) {
    //   console.log('DOM updated')
    // },
    // onbeforeremove: function(vnode) {
    //   console.log('exit animation can start')
    //   return new Promise(function(resolve) {
    //     // call after animation completes
    //     resolve()
    //   })
    // },
    // onremove: function(vnode) {
    //   console.log('removing DOM element')
    // },
    // view: function (vnode) {
    //   return m('div', 'Hello')
    // }

  }

  var SliderX = {
    view: function (vnode) {
      var _id = vnode.attrs.id;
      var _min = vnode.attrs.min;
      var _max = vnode.attrs.max;
      var _value = vnode.attrs.value;
      var _onchange = vnode.attrs.onchange;
      var output = m('div', { id: _id + '_display', title: _id, class: 'slider_display' }, `${_value}`);
      var input = m('input', {
        type: 'range', title: _id, class: 'slider_input', id: _id, min: _min, max: _max, value: _value,
        onchange: function (e) {
          sliderValue = input.dom.value;
        },
        oncreate: function (vnode) {
          vnode.dom.addEventListener('input', function () {
            output.dom.textContent = input.dom.value;
          });
        },
      });
      return m('div', { class: 'slider' }, [input, output])
    }
  }

  var sliderValue = 15;

  function reset() {
    sliderValue = 15;
  }

  var Hello = {
    view: function () {
      return m('div.c-display._pa._radius-x25r', [
        m('a._btnlink._small', { href: '#!/calculator', onclick: reset }, 'Open Calculator'),
      ]);
    }
  };

  function blink(opt, content) {
    return m('a._btnlink._smaller', opt, content);
  }

  function itext(opt, content) {
    return m('i._itext', m('i.itext', opt, content));
  }

  var countVal = 10;
  var sliderVal = 10;

  function Slider(initial_vnode) {
    var min = initial_vnode.attrs.min || 0;
    var icount = initial_vnode.attrs.value || min;
    var count = (icount < min) ? min : icount;
    function increment() { count += 1; }
    function decrement() {
      // count -= 1;
      count = (count > min) ? count - 1 : min;
    }

    return {
      view: function (vnode) {
        return m('table.c-slider', m('tr', [
          m('td.c-slider-value', count),
          m('td', m('button', { onclick: decrement }, '-')),
          m('td', m('button', { onclick: increment }, '+')),
        ]))
      }
    }
  }

  function Count(initial_vnode) {
    var min = initial_vnode.attrs.min || 0;
    var icount = initial_vnode.attrs.value || min;
    var count = (icount < min) ? min : icount;
    function increment() { count += 1; }
    function decrement() {
      // count -= 1;
      count = (count > min) ? count - 1 : min;
    }

    return {
      view: function (vnode) {
        return m('table.c-count._inline-block', m('tr', [
          m('td.c-count-value', count),
          m('td', m('button', { onclick: decrement }, '-')),
          m('td', m('button', { onclick: increment }, '+')),
        ]));
      }
    }
  }

  var Calculator = {
    view: function () {
      return [
        m('div.c-display._pa._radius-x25r', [
          m('a.c-close._btnlink._small._no-pad._lh-0', { href: '#!/hello', title: 'Close Calculator' }, itext('×')),
          m('h3._h6._no-margin', 'Takaful Calculator'), m('hr'),
          m(SliderX, { id: 'sliderValueX', min: 0, max: 100, value: sliderValue }),
          m('div', [
            m('span.c-row-label', 'Slider'),
            m(Slider, { id: 'sliderValue', min: 0, max: 100, value: sliderVal }),
          ]),
          m('div', [
            m('span.c-row-label', 'Count'),
            m(Count, { min: 0, value: countVal }),
          ]),
          m('hr'),
          blink({ href: '#!/hello' }, 'Close'), ' ',
        ]),
      ]
    }
  };

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
      log(`load_calculator_to: dom: `, calculator);
      e = calculator;
    }
    if (!e) { return err('Fail to load calculator. No DOM found.'); }
    loadAppTo(e);
  });

})(
  window,
  document,
  console
);