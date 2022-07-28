import RBoxProxy from './RBoxProxy';

export default class RBox extends RBoxProxy {

    constructor() {

        super();
        this._bind = this.getAttribute("data-bind") || '';
        this._data = {...window[this._bind], bindmap: {}, interpolation: {}};
        
        this.parse(this);
        this.setup();
    };
    
};
