import RBoxParser from "./RBoxParser";

export default class RBoxProxy extends RBoxParser {
    
    setup = () => {

        window[this._bind] = new Proxy(this._data, {

            set(target, prop, value) {

                target[prop] = value;

                target.bindmap[prop] && target.bindmap[prop].forEach((child)=> {

                    const attrValue = typeof(target[child.bind]) === 'function' ? target[child.bind]() : target[child.bind];
                    child.el.setAttribute(child.attr, attrValue);

                    if(typeof(attrValue) === 'boolean') {
        
                        attrValue ? 
                            child.el.setAttribute(child.attr, 'true') : 
                            child.el.removeAttribute(child.attr);
                    }

                    if(child.el[child.attr]){

                        child.el[child.attr] = attrValue;
                    }
                });
                
                if(target.interpolation[prop]) {
                    
                    target.interpolation[prop].forEach((child)=>{
                        
                        child.el.innerHTML = child.text(); 
                    })
                }
    
              return true;
            }
        })
    };
}