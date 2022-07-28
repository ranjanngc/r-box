import RBoxBase from './RBoxBase'

export default class RBoxEventManager extends RBoxBase {

    attachEvents = (child, attr, prop)=> {

        if(['value', 'checked'].indexOf(attr) !== -1) {
        
            child.addEventListener('input', (ev) => {

                window[this._bind][prop] = (typeof(window[this._bind][prop]) === 'boolean') ? ev.target.checked : ev.target.value;
            })
        }
    };
}