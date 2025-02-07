(function (
  w, d, c, app
) {

  var clicks = 0;
  
  function count() { clicks++; }
  
  function add() { clicks++; }
  
  function minus() { clicks--; }
  
  var rangeValue  = 25;
  var sliderValue = 15;

  function reset() {
    rangeValue  = 25;
    sliderValue = 15;
    clicks = 0;   
  }

  function _m(_tag, _class, _content) {
    return m(_tag, { class: _class }, _content);
  }

  function _button(_onclick, _content) {
    return m('button', { onclick: _onclick }, 'Button');
  }

  function _blink(_onclick, _content) {
    return m('a', { class: '_btnlink _small', onclick: _onclick }, _content);
  }

  function _blinka(_href, _content) {
    return m('a', { class: '_btnlink _small', href: _href }, _content);
  }

  function _itext(_content) {
    return m('i', { class: '_itext' }, m('i', { class: 'itext' }, _content));
  }

  var Slider = {
    // oninit: function(vnode) {
    //   c.log("initialized");
    // },
    // oncreate: function(vnode) {
    //   console.log("DOM created")
    // },
    // onbeforeupdate: function(newVnode, oldVnode) {
    //   return true
    // },
    // onupdate: function(vnode) {
    //   console.log("DOM updated")
    // },
    // onbeforeremove: function(vnode) {
    //   console.log("exit animation can start")
    //   return new Promise(function(resolve) {
    //     // call after animation completes
    //     resolve()
    //   })
    // },
    // onremove: function(vnode) {
    //   console.log("removing DOM element")
    // },
    view: function (vnode) {
      var _id = vnode.attrs.id;
      var _min = vnode.attrs.min;
      var _max = vnode.attrs.max;
      var _value = vnode.attrs.value;
      var _onchange = vnode.attrs.onchange;
      var output = m("div", { id: _id+'_display', title:_id, class: 'slider_display' }, `${_value}`);
      var input = m("input", {
        type: 'range', title: _id, class: 'slider_input', id: _id, min: _min, max: _max, value: _value,
        onchange:function (e) {
          sliderValue = input.dom.value;
        },
        oncreate: function (vnode) {
          vnode.dom.addEventListener('input', function () {
            output.dom.textContent = input.dom.value;
          });
        },
      });
      return m("div", { class: 'slider' }, [ input, output ])
    }
  }

  var Hello = {
    view: function () {
      return m('div', { class: 'c-display _pa _radius-x25r' }, [
        m('a', { class: '_btnlink _small', href: '#!/calculator', onclick: reset }, 'Open Calculator'),
      ]);
    }
  };

  var Calculator = {
    view: function () {
      return [
        m('div', { class: 'c-display _pa _radius-x25r' }, [
          m('a', { id: 'c-close', class: '_btnlink _small _no-pad _lh-0', href: '#!/hello', title: 'Close Calculator' }, _itext('×')),
          _m('h3', '_h6 _no-margin', 'Takaful Calculator'), _m('hr'),
          m(Slider, { id: 'sliderValue', min: 0, max: 100, value: sliderValue }),
          m('span', 'Clicks : '),
          m('span', clicks),
          _m('hr'),
          _blink(add, _itext('+')),' ',
          _blink(minus, _itext('-')),' ',
        ]),
      ]
    }
  };

  m.route(app, '/hello', {
    '/hello': Hello,
    '/calculator': Calculator,
  })

})(
  window,
  document,
  console,
  document.getElementById('calculator')
);