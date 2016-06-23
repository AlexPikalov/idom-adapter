import {El, ElVoid, Text, ipatch} from 'idom-adaptor';

let items = [];
let t = 'hi'
let view  = {items, t};

view.keyup = function (e) {
    this.items.unshift(e.target.value);
    ipatch(document.querySelector('div'), render());
}

function render() {
    let dom = (<div>
        <label>Type some text:</label>
        <input data-xid="input" type="text" value={view.t} onkeyup={view.keyup.bind(view)} />
        <ul>
            {items.map((i, j) => <li data-xid={i}>{j.toString()} - {i.toString()}</li>)}
        </ul>
        </div>)
    dom.beforeAttach = function () {
        console.log('before attach');
    }
    dom.afterAttach = function () {
        console.log('after attach');
    }
    return dom
}

ipatch(document.querySelector('div'), render());
