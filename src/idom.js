import {elementOpen, elementClose, elementVoid, patch, text} from 'incremental-dom'

class AttachableNode {
    constructor() {}
    attach() {
        throw new Error('AttachableNode is abstract node and cannot be attached');
    }
}

class AbstractEl extends AttachableNode {
    constructor(el, attrs={staticAttrs: null, dynamicAttrs: []}, id=null) {
        super();
        this._el = el;
        this._attrs = attrs;
        this._id = id;
    }

    beforeAttach() {}

    afterAttach() {}

    _patch() {
        throw new Error('AbstractEl is abstract and cannot be rendered or attached');
    }

    attach() {
        this.beforeAttach(this);
        this._patch();
        this.afterAttach(this);
    }
}

// Void Element
export class ElVoid extends AbstractEl {
    constructor(el, attrs, id) {
        super(el, attrs, id);
    }

    _patch() {
        elementVoid(this._el, this._id, this._attrs.staticAttrs, ...this._attrs.dynamicAttrs);
    }
}

// Non-void element
export class El extends AbstractEl {
    constructor(el, attrs, children, id) {
        super(el, attrs, id);
        this._children = children || [];
    }

    _patch() {
        elementOpen(this._el, this._id, this._attrs.staticAttrs, ...this._attrs.dynamicAttrs);
        flatten(this._children)
            .map(child => child instanceof AttachableNode ? child : new Text(child))
            .forEach(child => this._renderChild(child))
        elementClose(this._el);
    }

    _renderChild(child) {
        if (child instanceof AttachableNode) {
            child.attach();
        } else {
            throw new Error('Unexpected type of child. A child should implement method attach()');
        }
    }
}

// Text node
export class Text extends AttachableNode {
    constructor(txt) {
        super();
        this._text = txt;
    }

    attach() {
        this._patch();
    }

    _patch() {
        text(this._text);
    }
}

export function ipatch(hostEl, el, data) {
    return patch(hostEl, () => el.attach(), data);
}

// [[..., [...]], ..., [...]] -> [...]
function flatten(array) {
    return array.reduce((m, item) => {
        if (Array.isArray(item)) {
            return m.concat(flatten(item));
        } else {
            m.push(item);
            return m;
        }
    }, []);
}
