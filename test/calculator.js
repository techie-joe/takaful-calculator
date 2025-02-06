(function (
  w, d, c, app
) {

  var clicks = 0;

  function count() { clicks++; }

  function add() { clicks++; }

  function minus() { clicks--; }

  function reset() { clicks=0; }

  function _m(_tag, _class, _content) {
    return m(_tag, { class: _class }, _content);
  }

  function _button(_onclick, _content) {
    return m("button", { onclick: _onclick }, "Button");
  }

  function _blink(_onclick, _content) {
    return m("a", { class: "_btnlink _small", onclick: _onclick }, _content);
  }

  function _blinka(_href, _content) {
    return m("a", { class: "_btnlink _small", href: _href }, _content);
  }

  function _itext(_content) {
    return m("i", { class: "_itext" }, m("i", { class: "itext" }, _content));
  }

  var Hello = {
    view: function () {
      return m("div", { id: "c-display", class: "_pa _outline _radius-x25r" }, [
        m("a", { class: "_btnlink _small", href: "#!/calculator", onclick: reset }, "Open Calculator"),
      ]);
    }
  };

  var Calculator = {
    view: function () {
      return [
        m("div", { id: "c-display", class: "_pa _outline _radius-x25r" }, [
          m("a", { id: "c-close", class: "_btnlink _small _no-pad _lh-0", href: "#!/hello", title: "Close Calculator" }, _itext('×') ),
          _m("h3", "_h6 _no-margin", "Takaful Calculator"), _m("hr"),
          m("span", "Count : "),
          m("span", clicks),
          _m("hr"),
          _blink(add, _itext('+'))," ",
          _blink(minus, _itext('-'))," ",
        ]),
      ]
    }
  };

  m.route(app, "/hello", {
    "/hello": Hello,
    "/calculator": Calculator,
  })

})(
  window,
  document,
  console,
  document.getElementById('calculator')
);