class TableRow extends Lmnt {
    constructor({id=null, classes=[], attributes={}, children=[], itemCount=0, itemBuilder=null}={}) {
        super('tr', {id:id, classes:classes, attributes:attributes, children:children, itemCount: itemCount, itemBuilder:itemBuilder})
    }
}

class TableColumn extends Lmnt {
    constructor({id=null, classes=[], attributes={}, children=[], text=null, html=html}={}) {
        super('td', {id:id, classes:classes, attributes:attributes, children:children, text:text, html:html})
    }
}

class _TableHeader extends Lmnt {
    constructor({id=null, classes=[], text}={}) {
        super('th', {id:id, classes:classes, text:text})
    }    
}

class _TableHead extends Lmnt {
    constructor({id=null, classes=[], attributes={}, columns=[]}={}) {
        var children = []
        $.each(columns, function(_, name) {
            children.push(new _TableHeader({text:name}))
        })
        super('thead', {id:id, classes:classes, attributes:attributes, children:children})
    }
}

class _TableBody extends Lmnt {
    constructor({id=null, classes=[], attributes={}, children=[], itemCount=0, itemBuilder=null}={}) {
        super('tbody', {id:id, classes:classes, attributes:attributes, children:children, itemCount: itemCount, itemBuilder:itemBuilder})
    }
}

class Table extends Lmnt {
    constructor({id=null, classes=[], attributes={}, columns=[], children=[], itemCount=0, itemBuilder=null}={}) {
        classes.unshift('table')
        var tableChildren = []
        if (columns.length > 0) {
            tableChildren.push(new _TableHead({columns:columns}))
        }
        tableChildren.push(new _TableBody({children:children, itemCount:itemCount, itemBuilder: itemBuilder}))
        super('table', {id:id, classes:classes, attributes:attributes, children:tableChildren})
    }
}