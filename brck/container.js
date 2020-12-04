class Container extends Lmnt {
    constructor({id=null, classes=[], attributes={}, children=[]}={}) {
        classes.unshift('container')
        super('div', {id:id, classes:classes, attributes:attributes, children:children})
    }
}