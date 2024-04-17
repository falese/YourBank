import { createElement } from 'react';

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

var styles = {"container":"_1Lxpd","background":"_38Bir","button":"_2hTXI","table":"_FnYjQ","table-striped":"_3NyrT","card":"_xsi02"};

var _excluded = ["variant", "children"],
  _excluded2 = ["hasBackground", "children"],
  _excluded3 = ["children"];
var Button = function Button(_ref) {
  var _ref$variant = _ref.variant,
    variant = _ref$variant === void 0 ? 'primary' : _ref$variant,
    children = _ref.children,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  var className = styles.button + " " + (variant === 'primary' ? styles.primary : styles.secondary);
  return createElement("button", Object.assign({
    className: className
  }, props), children);
};
var Container = function Container(_ref2) {
  var hasBackground = _ref2.hasBackground,
    children = _ref2.children,
    props = _objectWithoutPropertiesLoose(_ref2, _excluded2);
  var className = styles.container + " " + (hasBackground ? styles.background : '');
  return createElement("div", Object.assign({
    className: className
  }, props), children);
};
var Table = function Table(_ref3) {
  var data = _ref3.data,
    columns = _ref3.columns;
  return createElement("table", {
    className: styles.table
  }, createElement("thead", null, createElement("tr", null, columns.map(function (column) {
    return createElement("th", {
      key: column.key
    }, column.title);
  }))), createElement("tbody", null, data.map(function (item, index) {
    return createElement("tr", {
      key: index
    }, columns.map(function (column) {
      return createElement("td", {
        key: index + "_" + column.key
      }, item[column.key]);
    }));
  })));
};
var Card = function Card(_ref4) {
  var children = _ref4.children,
    props = _objectWithoutPropertiesLoose(_ref4, _excluded3);
  return createElement("div", Object.assign({
    className: styles.card
  }, props), children);
};

export { Button, Card, Container, Table };
//# sourceMappingURL=index.modern.js.map
