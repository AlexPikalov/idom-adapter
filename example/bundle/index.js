'use strict';

var _idomAdaptor = require('idom-adaptor');

var items = [];
var t = 'hi';
var view = { items: items, t: t };

view.keyup = function (e) {
    this.items.unshift(e.target.value);
    (0, _idomAdaptor.ipatch)(document.querySelector('div'), render());
};

function render() {
    var dom = new _idomAdaptor.El('div', {
        'staticAttrs': [],
        'dynamicAttrs': []
    }, [new _idomAdaptor.Text('\n        '), new _idomAdaptor.El('label', {
        'staticAttrs': [],
        'dynamicAttrs': []
    }, [new _idomAdaptor.Text('Type some text:')]), new _idomAdaptor.Text('\n        '), new _idomAdaptor.ElVoid('input', {
        'staticAttrs': ['data-xid', 'input', 'type', 'text'],
        'dynamicAttrs': ['value', view.t, 'onkeyup', view.keyup.bind(view)]
    }, 'input'), new _idomAdaptor.Text('\n        '), new _idomAdaptor.El('ul', {
        'staticAttrs': [],
        'dynamicAttrs': []
    }, [new _idomAdaptor.Text('\n            '), items.map(function (i, j) {
        return new _idomAdaptor.El('li', {
            'staticAttrs': [],
            'dynamicAttrs': []
        }, [j.toString(), new _idomAdaptor.Text(' - '), i.toString()]);
    }), new _idomAdaptor.Text('\n        ')]), new _idomAdaptor.Text('\n        ')]);
    dom.beforeAttach = function () {
        console.log('before attach');
    };
    dom.afterAttach = function () {
        console.log('after attach');
    };
    return dom;
}

(0, _idomAdaptor.ipatch)(document.querySelector('div'), render());