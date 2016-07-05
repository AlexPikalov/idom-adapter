# idom-adaptor
It provides very simple adaptors for [Incremental DOM](http://google.github.io/incremental-dom).

## Abstract classes (interfaces)
There are few abstract classes which in fact provide usefull interfaces for further patches.

* `AttachableNode` is an abstract class that has one empty method `attach`
* `AbstractEl` implements `AttachableNode` and has following methods: `patch` - empty method that should be implemented in concrete elements, `attach` - implementation of AttachableNode's `attach` method, `beforeAttach` and `afterAttach` - life-cicle hooks are being invoked before and after element rendering respectively.

## Concrete classes
These classes are just tiny wrappers over Incremental DOM's `elementOpen`/`elementClose`, `elementVoid` and `text`

* `new El(el, attrs, children, id)` - adaptor for non-empty elements. It takes following arguments: `el` - tag name (required), `attrs` - `{staticAttrs: [], dynamicAttrs: []}` (optional), `children` - array that can contain any class that implements `AttachableNode` (optional), `id` - Incrementa DOM's key (optional). On attach it attaches chilred recursively. It implements `AbstractEl`.
* `new ElVoid(el, attrs, id)` - adaptor for `elementVoid`. It takes following arguments: `el` - tag name (required), `attrs` - `{staticAttrs: [], dynamicAttrs: []}` (optional), `id` - Incrementa DOM's key (optional). It implements `AbstractEl`.
* `new Text(text)` - adaptor for `text`. It takes only one argument the text that will be rendered. Implements `AttachableNode` interface.

## Helpers
* `ipatch(hostEl, el, data)` - wrapper over Incremental DOM's patch. `hostEl` - HTML element where `el` will be rendered, `el` is an adaptor that implements `AttachableNode` interface. Data is a data that will be passed to `patch` function as a third argument.
* `data-xid` - HTML attribute for passing a key to Incremental DOM function calls, i.e. `<div data-xid="foo"></div>` -> `new El('div', {staticAttrs: ['data-xid', 'foo'], dynamicAttrs: []}, [], 'foo')` that is effectively equivalent to `elementOpen('div', 'foo', ['data-xid', 'foo']);elementClose('div');`

## Get from JSX
More details about JSX itself can be found in [specification](https://facebook.github.io/jsx/)

There is a [Babel plugin](https://github.com/AlexPikalov/babel-plugin-transform-idom-jsx) that converts JSX into plain JavaScript + idom adaptors.
