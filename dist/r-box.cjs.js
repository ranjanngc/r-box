'use strict';

class RBoxBase extends HTMLElement {
}

class RBoxEventManager extends RBoxBase {
    constructor() {
        super(...arguments);
        this.attachEvents = (child, attr, prop) => {
            if (['value', 'checked'].indexOf(attr) !== -1) {
                child.addEventListener('input', (ev) => {
                    window[this._bind][prop] = (typeof (window[this._bind][prop]) === 'boolean') ? ev.target.checked : ev.target.value;
                });
            }
        };
    }
}

class RBoxInterpolator extends RBoxEventManager {
    constructor() {
        super(...arguments);
        this.polate = (node) => {
            var _a;
            if (node.textContent.indexOf('${') > -1) {
                const tc = node.textContent.replace('${', '').replace('}', '').replace(' ', '').trim();
                let reactOn = JSON.parse((_a = node.getAttribute('react-on')) !== null && _a !== void 0 ? _a : "[]");
                reactOn.push(tc);
                const ipl = { el: node, polate: true, bind: () => {
                        if (typeof (this._data[tc]) === 'function') {
                            return this._data[tc]();
                        }
                        return `${this._data[tc]}`;
                    } };
                reactOn.forEach(p => {
                    this._data.bindmap[p] = this._data.bindmap[tc] || [];
                    this._data.bindmap[p].push(ipl);
                });
                node.innerHTML = ipl.bind();
            }
        };
    }
}

class RBoxParser extends RBoxInterpolator {
    constructor() {
        super(...arguments);
        this.parse = (node) => {
            if (node.childNodes) {
                this.bind(node.childNodes);
            }
        };
        this.bind = (nodes) => {
            nodes.forEach(node => {
                for (let data in node.dataset) {
                    this.init(node, data);
                }
                this.polate(node);
                this.parse(node);
            });
        };
    }
    init(node, attr) {
        var _a;
        const prop = node.dataset[attr];
        const fn = { el: node, attr: attr, bind: prop };
        let reactOn = JSON.parse((_a = node.getAttribute('react-on')) !== null && _a !== void 0 ? _a : "[]");
        reactOn.push(prop);
        reactOn.forEach(p => {
            this._data.bindmap[p] = this._data.bindmap[prop] || [];
            this._data.bindmap[p].push(fn);
        });
        node.setAttribute(attr, (typeof (this._data[prop]) === 'function' ? this._data[prop]() : this._data[prop]));
        this.attachEvents(node, attr, prop);
    }
    ;
}

class RBoxProxy extends RBoxParser {
    constructor() {
        super(...arguments);
        this.setup = () => {
            window[this._bind] = new Proxy(this._data, {
                set(target, prop, value) {
                    target[prop] = value;
                    target.bindmap[prop] && target.bindmap[prop].forEach((child) => {
                        let attrValue = typeof (target[child.bind]) === 'function' ? target[child.bind]() : target[child.bind];
                        if (typeof (child.bind) === 'function') {
                            // A DIRTY HACK
                            attrValue = child.bind();
                        }
                        if (child.polate) {
                            child.el.innerText = attrValue;
                        }
                        else {
                            child.el.setAttribute(child.attr, attrValue);
                            if (typeof (attrValue) === 'boolean') {
                                attrValue ?
                                    child.el.setAttribute(child.attr, 'true') :
                                    child.el.removeAttribute(child.attr);
                            }
                            if (child.el[child.attr]) {
                                child.el[child.attr] = attrValue;
                            }
                        }
                    });
                    return true;
                }
            });
        };
    }
}

class RBox extends RBoxProxy {
    constructor() {
        super();
        this._bind = this.getAttribute("data-bind") || '';
        this._data = Object.assign(Object.assign({}, window[this._bind]), { bindmap: {} });
        this.parse(this);
        this.setup();
    }
    ;
}

customElements.define("r-box", RBox);
