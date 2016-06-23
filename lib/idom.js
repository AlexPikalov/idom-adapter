'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Text = exports.El = exports.ElVoid = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.ipatch = ipatch;

var _incrementalDom = require('incremental-dom');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AttachableNode = function () {
    function AttachableNode() {
        _classCallCheck(this, AttachableNode);
    }

    _createClass(AttachableNode, [{
        key: 'attach',
        value: function attach() {
            throw new Error('AttachableNode is abstract node and cannot be attached');
        }
    }]);

    return AttachableNode;
}();

var AbstractEl = function (_AttachableNode) {
    _inherits(AbstractEl, _AttachableNode);

    function AbstractEl(el) {
        var attrs = arguments.length <= 1 || arguments[1] === undefined ? { staticAttrs: null, dynamicAttrs: [] } : arguments[1];
        var id = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        _classCallCheck(this, AbstractEl);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AbstractEl).call(this));

        _this._el = el;
        _this._attrs = attrs;
        _this._id = id;
        return _this;
    }

    _createClass(AbstractEl, [{
        key: 'beforeAttach',
        value: function beforeAttach() {}
    }, {
        key: 'afterAttach',
        value: function afterAttach() {}
    }, {
        key: '_patch',
        value: function _patch() {
            throw new Error('AbstractEl is abstract and cannot be rendered or attached');
        }
    }, {
        key: 'attach',
        value: function attach() {
            this.beforeAttach(this);
            this._patch();
            this.afterAttach(this);
        }
    }]);

    return AbstractEl;
}(AttachableNode);

// Void Element


var ElVoid = exports.ElVoid = function (_AbstractEl) {
    _inherits(ElVoid, _AbstractEl);

    function ElVoid(el, attrs, id) {
        _classCallCheck(this, ElVoid);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ElVoid).call(this, el, attrs, id));
    }

    _createClass(ElVoid, [{
        key: '_patch',
        value: function _patch() {
            _incrementalDom.elementVoid.apply(undefined, [this._el, this._id, this._attrs.staticAttrs].concat(_toConsumableArray(this._attrs.dynamicAttrs)));
        }
    }]);

    return ElVoid;
}(AbstractEl);

// Non-void element


var El = exports.El = function (_AbstractEl2) {
    _inherits(El, _AbstractEl2);

    function El(el, attrs, children, id) {
        _classCallCheck(this, El);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(El).call(this, el, attrs, id));

        _this3._children = children || [];
        return _this3;
    }

    _createClass(El, [{
        key: '_patch',
        value: function _patch() {
            var _this4 = this;

            _incrementalDom.elementOpen.apply(undefined, [this._el, this._id, this._attrs.staticAttrs].concat(_toConsumableArray(this._attrs.dynamicAttrs)));
            flatten(this._children).map(function (child) {
                return child instanceof AttachableNode ? child : new Text(child);
            }).forEach(function (child) {
                return _this4._renderChild(child);
            });
            (0, _incrementalDom.elementClose)(this._el);
        }
    }, {
        key: '_renderChild',
        value: function _renderChild(child) {
            if (child instanceof AttachableNode) {
                child.attach();
            } else {
                throw new Error('Unexpected type of child. A child should implement method attach()');
            }
        }
    }]);

    return El;
}(AbstractEl);

// Text node


var Text = exports.Text = function (_AttachableNode2) {
    _inherits(Text, _AttachableNode2);

    function Text(txt) {
        _classCallCheck(this, Text);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Text).call(this));

        _this5._text = txt;
        return _this5;
    }

    _createClass(Text, [{
        key: 'attach',
        value: function attach() {
            this._patch();
        }
    }, {
        key: '_patch',
        value: function _patch() {
            (0, _incrementalDom.text)(this._text);
        }
    }]);

    return Text;
}(AttachableNode);

function ipatch(hostEl, el, data) {
    return (0, _incrementalDom.patch)(hostEl, function () {
        return el.attach();
    }, data);
}

// [[..., [...]], ..., [...]] -> [...]
function flatten(array) {
    return array.reduce(function (m, item) {
        if (Array.isArray(item)) {
            return m.concat(flatten(item));
        } else {
            m.push(item);
            return m;
        }
    }, []);
}