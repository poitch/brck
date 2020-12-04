class Link extends Lmnt {
    constructor(href, {id=null, classes=[], attributes={}, children=[], text=null, html=null}={}) {
        attributes['href'] = href
        super('a', {id:id, classes:classes, attributes:attributes, children:children, text:text, html:html})
    }
}