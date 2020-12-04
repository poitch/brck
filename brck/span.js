class Span extends Lmnt {
    constructor({id=null, classes=[], attributes={}, children=[], text=null, html=null}={}) {
        super('span', {id:id, classes:classes, attributes:attributes, children:children, text:text, html:html})
    }
}