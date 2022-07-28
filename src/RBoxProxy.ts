import RBoxParser from "./RBoxParser";
import { TBoxBindMap } from "./RBoxTypes";

export default class RBoxProxy extends RBoxParser {
    
    setup = () => {

        window[this._bind] = new Proxy(this._data, {

            set(target, prop, value) {

                target[prop] = value;
                const exec = 'function';
                target.bindmap[prop] && target.bindmap[prop].forEach((child: TBoxBindMap)=> {

                    let attrValue = typeof(target[child.bind]) === exec ? target[child.bind]() : target[child.bind];
                    if(typeof(child.bind) === exec){

                        // A DIRTY HACK
                        attrValue = (child.bind as unknown as Function)();
                    }
                    
                    if(child.polate) {
                        child.el.innerText = attrValue; 
                    }
                    else {
                        child.el.setAttribute(child.attr, attrValue);

                        if(typeof(attrValue) === 'boolean') {
            
                            attrValue ? 
                                child.el.setAttribute(child.attr, 'true') : 
                                child.el.removeAttribute(child.attr);
                        }

                        if(child.el[child.attr]){

                            child.el[child.attr] = attrValue;
                        }
                    }
                });
                
                return true;
            }
        })
    };
}