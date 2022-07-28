import RBoxEventManager from './RBoxEventManager';
import { RBoxDataType } from './RBoxTypes';

export default class RBoxInterpolator extends RBoxEventManager {
    
    polate = (node) => {

        if(node.textContent.indexOf('${') > -1) {

            const tc = node.textContent.replace('${', '').replace('}','').replace(' ', '').trim();
            
            let reactOn = JSON.parse(node.getAttribute('react-on') ?? "[]");
            reactOn.push(tc)

            const ipl = {el: node, polate: true, bind: () => {

                if(typeof(this._data[tc]) === 'function'){return this._data[tc]();}
                return `${this._data[tc]}`
            }};

            reactOn.forEach(p => {
                this._data.bindmap[p] = this._data.bindmap[tc] || [] as Array<RBoxDataType>;
                this._data.bindmap[p].push(ipl);
            });
            
            node.innerHTML = ipl.bind();
        }
    };
}