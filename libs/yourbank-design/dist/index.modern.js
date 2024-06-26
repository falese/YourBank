import { createElement } from 'react';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
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

var styles = {"header":"_1aDvk","logo":"_Lw2P8","container":"_1Lxpd","cardContainer":"_2PVO1","background":"_38Bir","button":"_2hTXI","table":"_FnYjQ","table-striped":"_3NyrT","card":"_xsi02","cardHeader":"_2cQtw","headerContent":"_oI8tQ","cardTitle":"_2yKGs","underHeaderIcon":"_TN3it","cardContent":"_2ZnC8","cardFooter":"_2PuQp","icon":"_2Vept","icon-red":"_EipcL","icon-white":"_2MHdX"};

var _excluded = ["variant", "children"],
  _excluded2 = ["headerIcon", "headerTitle", "footer", "children", "underHeaderIcon"];
var Header = function Header() {
  return createElement("header", {
    className: styles.header
  }, createElement("h1", {
    className: styles.logo
  }, "YourBank"));
};
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
  var useCardStyle = _ref2.useCardStyle,
    children = _ref2.children;
  var className = useCardStyle ? styles.cardContainer : styles.container;
  return createElement("div", {
    className: className
  }, children);
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
  var headerIcon = _ref4.headerIcon,
    headerTitle = _ref4.headerTitle,
    footer = _ref4.footer,
    children = _ref4.children,
    underHeaderIcon = _ref4.underHeaderIcon,
    props = _objectWithoutPropertiesLoose(_ref4, _excluded2);
  return createElement("div", Object.assign({
    className: styles.card
  }, props), (headerIcon || headerTitle || underHeaderIcon) && createElement("div", {
    className: styles.cardHeader
  }, createElement("div", {
    className: styles.headerContent
  }, headerIcon, headerTitle && createElement("h2", {
    className: styles.cardTitle
  }, headerTitle)), underHeaderIcon && createElement("div", {
    className: styles.underHeaderIcon
  }, underHeaderIcon)), createElement("div", {
    className: styles.cardContent
  }, children), footer && createElement("div", {
    className: styles.cardFooter
  }, footer));
};
var iconPaths = {
  building: 'M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z',
  dollar: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  exclamation: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z',
  question: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm0-4h-2v-4c0-1.1.9-2 2-2s2 .9 2 2h-2v4z',
  logo: 'M12,2L15,8L21,9L16,13L17,19L12,16L7,19L8,13L3,9L9,8L12,2Z',
  money: 'M4.319,8.257c-0.242,0-0.438,0.196-0.438,0.438c0,0.243,0.196,0.438,0.438,0.438c0.242,0,0.438-0.196,0.438-0.438C4.757,8.454,4.561,8.257,4.319,8.257 M7.599,10.396c0,0.08,0.017,0.148,0.05,0.204c0.034,0.056,0.076,0.104,0.129,0.144c0.051,0.04,0.112,0.072,0.182,0.097c0.041,0.015,0.068,0.028,0.098,0.04V9.918C7.925,9.927,7.832,9.958,7.747,10.02C7.648,10.095,7.599,10.22,7.599,10.396 M15.274,6.505H1.252c-0.484,0-0.876,0.392-0.876,0.876v7.887c0,0.484,0.392,0.876,0.876,0.876h14.022c0.483,0,0.876-0.392,0.876-0.876V7.381C16.15,6.897,15.758,6.505,15.274,6.505M1.69,7.381c0.242,0,0.438,0.196,0.438,0.438S1.932,8.257,1.69,8.257c-0.242,0-0.438-0.196-0.438-0.438S1.448,7.381,1.69,7.381M1.69,15.269c-0.242,0-0.438-0.196-0.438-0.438s0.196-0.438,0.438-0.438c0.242,0,0.438,0.195,0.438,0.438S1.932,15.269,1.69,15.269M14.836,15.269c-0.242,0-0.438-0.196-0.438-0.438s0.196-0.438,0.438-0.438s0.438,0.195,0.438,0.438S15.078,15.269,14.836,15.269M15.274,13.596c-0.138-0.049-0.283-0.08-0.438-0.08c-0.726,0-1.314,0.589-1.314,1.314c0,0.155,0.031,0.301,0.08,0.438H2.924c0.049-0.138,0.081-0.283,0.081-0.438c0-0.726-0.589-1.314-1.315-1.314c-0.155,0-0.3,0.031-0.438,0.08V9.053C1.39,9.103,1.535,9.134,1.69,9.134c0.726,0,1.315-0.588,1.315-1.314c0-0.155-0.032-0.301-0.081-0.438h10.678c-0.049,0.137-0.08,0.283-0.08,0.438c0,0.726,0.589,1.314,1.314,1.314c0.155,0,0.301-0.031,0.438-0.081V13.596z M14.836,8.257c-0.242,0-0.438-0.196-0.438-0.438s0.196-0.438,0.438-0.438s0.438,0.196,0.438,0.438S15.078,8.257,14.836,8.257 M12.207,13.516c-0.242,0-0.438,0.196-0.438,0.438s0.196,0.438,0.438,0.438s0.438-0.196,0.438-0.438S12.449,13.516,12.207,13.516 M8.812,11.746c-0.059-0.043-0.126-0.078-0.199-0.104c-0.047-0.017-0.081-0.031-0.117-0.047v1.12c0.137-0.021,0.237-0.064,0.336-0.143c0.116-0.09,0.174-0.235,0.174-0.435c0-0.092-0.018-0.17-0.053-0.233C8.918,11.842,8.87,11.788,8.812,11.746 M18.78,3.875H4.757c-0.484,0-0.876,0.392-0.876,0.876V5.19c0,0.242,0.196,0.438,0.438,0.438c0.242,0,0.438-0.196,0.438-0.438V4.752H18.78v7.888h-1.315c-0.242,0-0.438,0.196-0.438,0.438c0,0.243,0.195,0.438,0.438,0.438h1.315c0.483,0,0.876-0.393,0.876-0.876V4.752C19.656,4.268,19.264,3.875,18.78,3.875 M8.263,8.257c-1.694,0-3.067,1.374-3.067,3.067c0,1.695,1.373,3.068,3.067,3.068c1.695,0,3.067-1.373,3.067-3.068C11.33,9.631,9.958,8.257,8.263,8.257 M9.488,12.543c-0.062,0.137-0.147,0.251-0.255,0.342c-0.108,0.092-0.234,0.161-0.378,0.209c-0.123,0.041-0.229,0.063-0.359,0.075v0.347H8.058v-0.347c-0.143-0.009-0.258-0.032-0.388-0.078c-0.152-0.053-0.281-0.128-0.388-0.226c-0.108-0.098-0.191-0.217-0.25-0.359c-0.059-0.143-0.087-0.307-0.083-0.492h0.575c-0.004,0.219,0.046,0.391,0.146,0.518c0.088,0.109,0.207,0.165,0.388,0.185v-1.211c-0.102-0.031-0.189-0.067-0.3-0.109c-0.136-0.051-0.259-0.116-0.368-0.198c-0.109-0.082-0.198-0.183-0.265-0.306c-0.067-0.123-0.101-0.275-0.101-0.457c0-0.159,0.031-0.298,0.093-0.419c0.062-0.121,0.146-0.222,0.252-0.303S7.597,9.57,7.735,9.527C7.85,9.491,7.944,9.474,8.058,9.468V9.134h0.438v0.333c0.114,0.005,0.207,0.021,0.319,0.054c0.134,0.04,0.251,0.099,0.351,0.179c0.099,0.079,0.178,0.18,0.237,0.303c0.059,0.122,0.088,0.265,0.088,0.427H8.916c-0.007-0.169-0.051-0.297-0.134-0.387C8.712,9.968,8.626,9.932,8.496,9.919v1.059c0.116,0.035,0.213,0.074,0.333,0.118c0.145,0.053,0.272,0.121,0.383,0.203c0.111,0.083,0.2,0.186,0.268,0.308c0.067,0.123,0.101,0.273,0.101,0.453C9.581,12.244,9.549,12.406,9.488,12.543',
  chart: 'M10.281,1.781C5.75,1.781,2.062,5.469,2.062,10s3.688,8.219,8.219,8.219S18.5,14.531,18.5,10S14.812,1.781,10.281,1.781M10.714,2.659c3.712,0.216,6.691,3.197,6.907,6.908h-6.907V2.659z M10.281,17.354c-4.055,0-7.354-3.298-7.354-7.354c0-3.911,3.067-7.116,6.921-7.341V10c0,0.115,0.045,0.225,0.127,0.305l5.186,5.189C13.863,16.648,12.154,17.354,10.281,17.354M15.775,14.882l-4.449-4.449h6.295C17.522,12.135,16.842,13.684,15.775,14.882',
  logo2: 'M0 592v592h1179V0H0v592zm324.9-219h48.6l5.4 8.7c6.9 11.3 21.5 35.3 37.3 61.3 6.9 11.3 14.3 23.4 16.6 27 2.2 3.6 5.4 8.7 7 11.5 4.9 8.5 24.8 41 27.6 45.1 2.1 3.1 2.6 3.5 2.7 1.9.1-1.1.1-36.5-.1-78.8l-.2-76.7h46.5c41.5 0 46.6.2 47.1 1.6.8 2.1.8 518.8 0 524.8l-.7 4.6-46.1-.2-46.1-.3-.5-105-.5-105-4.4-7c-10.8-17.3-30.6-49.3-38.6-62.5-15.8-26.1-67.2-110-72.5-118.5-2.1-3.3-8.7-14-14.6-23.7-27.9-45.3-34.4-55.9-41.6-67.4-14.3-22.9-24.8-40.5-24.8-41.6 0-.5.7-.7 1.6-.4.9.3 23.5.6 50.3.6zm481 1.6c23.3 3.4 38.6 8.1 57.8 17.8 22.1 11 42.6 27.6 55.4 44.8 11.9 16 20.8 36.6 24.6 56.8 2.5 13.9 2.3 42-.5 55.5-7 34.3-28.5 66.2-58.2 86.2-2.7 1.8-5 3.7-5 4.1 0 .4 2.9 2.4 6.4 4.4 40.2 23.5 66.3 62.7 70.6 106.1 2.2 22.6-2.1 45-12.9 67.2-18.8 38.3-51.9 66.1-94.2 79-23.3 7.1-19.3 6.8-113.1 7.2l-84.8.4V373h71.6c59.8 0 73.4.3 82.3 1.6z'
};
var Icon = function Icon(_ref5) {
  var icon = _ref5.icon,
    _ref5$color = _ref5.color,
    color = _ref5$color === void 0 ? 'red' : _ref5$color,
    className = _ref5.className,
    style = _ref5.style;
  var path = iconPaths[icon];
  var iconClassName = "" + (className || '');
  return createElement("svg", {
    className: iconClassName,
    style: _extends({
      width: '100%',
      height: '100%',
      fill: color
    }, style),
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg'
  }, createElement("path", {
    d: path
  }));
};
var LogoComponent = function LogoComponent(_ref6) {
  var className = _ref6.className,
    style = _ref6.style;
  return createElement("svg", {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 1179 1184',
    className: className,
    style: style,
    fill: 'currentColor'
  }, createElement("path", {
    d: 'M0 592v592h1179V0H0v592zm324.9-219h48.6l5.4 8.7c6.9 11.3 21.5 35.3 37.3 61.3 6.9 11.3 14.3 23.4 16.6 27 2.2 3.6 5.4 8.7 7 11.5 4.9 8.5 24.8 41 27.6 45.1 2.1 3.1 2.6 3.5 2.7 1.9.1-1.1.1-36.5-.1-78.8l-.2-76.7h46.5c41.5 0 46.6.2 47.1 1.6.8 2.1.8 518.8 0 524.8l-.7 4.6-46.1-.2-46.1-.3-.5-105-.5-105-4.4-7c-10.8-17.3-30.6-49.3-38.6-62.5-15.8-26.1-67.2-110-72.5-118.5-2.1-3.3-8.7-14-14.6-23.7-27.9-45.3-34.4-55.9-41.6-67.4-14.3-22.9-24.8-40.5-24.8-41.6 0-.5.7-.7 1.6-.4.9.3 23.5.6 50.3.6zm481 1.6c23.3 3.4 38.6 8.1 57.8 17.8 22.1 11 42.6 27.6 55.4 44.8 11.9 16 20.8 36.6 24.6 56.8 2.5 13.9 2.3 42-.5 55.5-7 34.3-28.5 66.2-58.2 86.2-2.7 1.8-5 3.7-5 4.1 0 .4 2.9 2.4 6.4 4.4 40.2 23.5 66.3 62.7 70.6 106.1 2.2 22.6-2.1 45-12.9 67.2-18.8 38.3-51.9 66.1-94.2 79-23.3 7.1-19.3 6.8-113.1 7.2l-84.8.4V373h71.6c59.8 0 73.4.3 82.3 1.6z'
  }), createElement("path", {
    d: 'M743 641.5v179.7l33.3-.5c37-.4 37.9-.6 51.3-7.6 16.7-8.6 29.5-24.2 33-39.9 2.2-9.8 1.5-26.1-1.5-34.4-5.5-15.8-20.9-32.2-38.6-41-11.4-5.7-19.8-8-38.7-10.3l-4.8-.6V585.2l7.8-.7c24.1-2.1 41.6-10.5 54-25.9 9.6-11.9 13.2-22 13.2-37 0-11.9-1.4-17.8-6.5-27.6-7-13.1-19.6-23.2-36-28.7-7.8-2.7-8.6-2.7-37.2-3.1l-29.3-.3v179.6z'
  }));
};

export default Header;
export { Button, Card, Container, Icon, LogoComponent, Table };
//# sourceMappingURL=index.modern.js.map
