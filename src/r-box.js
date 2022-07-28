class RBox_1 extends HTMLElement {

    _bind       = null;
    _data       = null;

    constructor() {

      super();

      this._bind        = this.getAttribute("data-bind");
      this._data        = {...window[this._bind], map: {}, interpolation: {}};
      
      this.parseChild(this);

      this.attachProxy();
    };
    
    parseChild = (node) => {

        if(node.childNodes){

            this.parseNodes(node.childNodes);
        }
    };

    parseNodes = (nodes) => {

        nodes.forEach(node => {

            for(let data in node.dataset){

                this.init(node, data);
            }
    
            this.polate(node);
            this.parseChild(node);
        });
    };

    init(node, attr) {

        const prop = node.dataset[attr];
        
        
        const fn = {el: node, attr: attr, bind: prop};
        
        let reactOn = JSON.parse(node.getAttribute('react-on') ?? "[]");
        reactOn.push(prop)
        reactOn.forEach(p => {
            this._data.map[p] = this._data.map[prop] || [];
            this._data.map[p].push(fn);
        })
        node.setAttribute(attr, (typeof(this._data[prop]) === 'function' ? this._data[prop](): this._data[prop]));
        this.attachEvents(node, attr, prop);
    };

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

    attachProxy = () => {

        window[this._bind] = new Proxy(this._data, {

            set(target, prop, value) {

                target[prop] = value;

                target.map[prop] && target.map[prop].forEach((child)=>{
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

    attachEvents = (child, attr, prop)=> {

        if(['value', 'checked'].indexOf(attr) !== -1) {
        
            child.addEventListener('input', (ev) => {

                window[this._bind][prop] = (typeof(window[this._bind][prop]) === 'boolean') ? ev.target.checked : ev.target.value;
            })
        }
    };
};
  
customElements.define("r-box", RBox);
