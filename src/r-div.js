class RDiv extends HTMLElement {
    _itemKey      = null;
    _select       = null;
    _dataObject   = null;
    _items        = [{key: '-1', value: 'empty'}];
    _clonedDataObject = null;
    _objectMap    = {};

    constructor(){
      super();

      this._itemKey     = this.getAttribute(":items");
      this._dataObject  = this.getAttribute(":bind");
      this._select      = document.createElement('select');
      this.bindObject   = window[this._dataObject];
      
      this._clonedDataObject = {...this.bindObject, map: {}};
      
      this.childNodes.forEach((child) => {
  
        for(let data in child.dataset){
            this.parse(child, data);
        }   
      })
    }
    
    parse(child, data) {

      const prop = child.dataset[data];
      
      this._clonedDataObject.map[prop] = this._clonedDataObject.map[prop] || [];
      this._clonedDataObject.map[prop].push({el: child, attr: data, bind: prop});

      child.setAttribute(data, this._clonedDataObject[prop]);
      
      if(data === 'value') {
        
        child.addEventListener('input', (ev) => {

          window[this._dataObject][prop] = ev.target.value;
        })
      }
      
      if(data === 'checked'){

        child.addEventListener('input', (ev) => {

          window[this._dataObject][prop] = ev.target.checked;
        })
      }
      
      window[this._dataObject] = new Proxy(this._clonedDataObject, {

        set(target, prop, value) {

          target.map[prop].forEach((child)=>{
            target[prop] = value;
  
            if(typeof(target[child.bind]) === 'boolean') {

              target[child.bind] ? child.el.setAttribute(child.attr, 'true') : child.el.removeAttribute(child.attr);
            }
            else {

              child.el.setAttribute(child.attr, target[child.bind]);
            }
          });

          child.setAttribute(data, value);
          target[prop] = value;

          return true;
        }
      })
    }
  };
  
  customElements.define("r-div", RDiv);
console.log('r-div initialized');
