import RBoxEventManager from './RBoxEventManager';

export default class RBoxInterpolator extends RBoxEventManager {
    
    polate = (node) => {

        if(node.textContent.indexOf('${') > -1) {

            const tc = node.textContent.replace('${', '').replace('}','').replace(' ', '').trim();
            
            let reactOn = JSON.parse(node.getAttribute('react-on') ?? "[]");
            reactOn.push(tc)

            const ipl = {el: node, text: () => {

                if(typeof(this._data[tc]) === 'function'){return this._data[tc]();}
                return `${this._data[tc]}`
            }};

            reactOn.forEach(p => {
                this._data.interpolation[p] = this._data.interpolation[tc] || [];
                this._data.interpolation[p].push(ipl);
            });
            
            node.innerHTML = ipl.text();
        }
    };
}