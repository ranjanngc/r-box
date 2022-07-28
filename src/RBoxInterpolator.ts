import RBoxEventManager from './RBoxEventManager';

export default class RBoxInterpolator extends RBoxEventManager {

    polate = (node) => {

        if(node.textContent.indexOf('${') > -1) {

            const prop = node.textContent.replace('${', '').replace('}','').replace(' ', '').trim();
            
            let reactOn = JSON.parse(node.getAttribute('react-on') ?? "[]");
            reactOn.push(prop)

            const ipl = {el: node, text: () => {

                if(typeof(this._data[prop]) === 'function'){return this._data[prop]();}
                return `${this._data[prop]}`
            }};

            reactOn.forEach(p => {
                this._data.interpolation[p] = this._data.interpolation[prop] || [];
                this._data.interpolation[p].push(ipl);
            });
            

            node.innerHTML = ipl.text();
        }
    };
}