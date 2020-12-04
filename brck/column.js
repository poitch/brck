class Column extends Lmnt {
    constructor({id=null, classes=[], attributes={}, children=[]}={}) {
        classes.unshift('col')
        super('div', {id:id, classes:classes, attributes:attributes, children:children})
    }
}