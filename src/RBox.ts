import RBoxProxy from './RBoxProxy';

export default class RBox extends RBoxProxy {

    constructor() {

        super();
        if(!this.getAttribute("data-bind")){
            console.error('data-bind is a required attribute');
            return;
        } 
        else {
            this._bind = this.getAttribute("data-bind") || '';
            this._data = {...window[this._bind], bindmap: {}, interpolation: {}};
            
            this.parseChild(this);
            this.attachProxy();
        }
    };
    
};
