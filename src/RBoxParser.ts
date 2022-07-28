import RBoxInterpolator from './RBoxInterpolator';

export default class RBoxParser extends RBoxInterpolator {
    
    parse = (node) => {

        if(node.childNodes){

            this.bind(node.childNodes);
        }
    };

    bind = (nodes) => {

        nodes.forEach(node => {

            for(let data in node.dataset){

                this.init(node, data);
            }
    
            this.polate(node);
            this.parse(node);
        });
    };

    init(node, attr) {

        const prop = node.dataset[attr];
        const fn = {el: node, attr: attr, bind: prop};
        
        let reactOn = JSON.parse(node.getAttribute('react-on') ?? "[]");
        reactOn.push(prop)
        reactOn.forEach(p => {

            this._data.bindmap[p] = this._data.bindmap[prop] || [];
            this._data.bindmap[p].push(fn);
        })
        node.setAttribute(attr, (typeof(this._data[prop]) === 'function' ? this._data[prop](): this._data[prop]));
        this.attachEvents(node, attr, prop);
    };
}