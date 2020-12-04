function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

class Lmnt {
    constructor(type, {id=null, classes=[], attributes={}, children=[], html=null, text=null, itemCount=0, itemBuilder}={}) {
        this.type = type
        this.id = id
        this.classes = classes
        this.attributes = attributes
        this.children = children
        this.html = html
        this.text = text
        this.itemCount = itemCount
        this.itemBuilder = itemBuilder
        this.cachedChildren = []
    }


    click(callback) {
        this.onClick = callback
        return this
    }

    equal(other) {
        if (this.type != other.type) return false
        if (this.id != other.id) return false
        if (this.classes.length > 0 && intersect(this.classes, other.classes).length == 0) return false
        if (this.html != other.html) return false
        if (this.text != other.text) return false
        if (this.itemCount != other.itemCount) return false
        if (this.children.length != other.children.length) return false
        return true
    }

    deepEqual(other) {
        if (!this.equal(other)) return false
        if (isFunction(this.itemBuilder)) {
            if (!isFunction(other.itemBuilder)) return false
            if (this.itemCount != other.itemCount) return false
            for(var index = 0; index < this.itemCount; index++) {
                if (!this.itemBuilder(index).deepEqual(other.itemBuilder(index))) return false
            }
        } else {
            if (this.children.length != other.children.length) return false
            for(var i = 0; i < this.children.length; i++) {
                if (!this.children[i].deepEqual(other.children[i])) {
                    return false
                }
            }
        }
        return true
    }

    build() {
        var obj = this
        var elt = $('<' + this.type + '>')
        if (this.id) {
            elt.attr('id', this.id)
        }
        $.each(this.classes, function(_, classname) {
            elt.addClass(classname)
        }) 
        $.each(this.attributes, function(key, value) {
            elt.attr(key, value)
        })
        if (isFunction(this.itemBuilder)) {
            this.cachedChildren = []
            for(var index = 0; index < this.itemCount; index++) {
                var child = this.itemBuilder(index)
                this.cachedChildren.push(child)
                elt.append(child.build())
            }
        } else {
            $.each(this.children, function(_, child) {
                elt.append(child.build())
            })
        }
        if (this.html) {
            elt.html(this.html)
        } else if (this.text) {
            elt.text(this.text)
        }
        if (this.onClick) {
            elt.click(this.onClick)
        }
        return elt
    }
}


class Component {
    constructor({container=$(document.body)}={}) {
        if (this.constructor == Component) {
            throw new Error("Abstract class Component cannot be instantiated.")
        }
        this.container = container
        this.initState()
        this.refresh()
    }

    build() {
        throw new Error("Method build() must be implemented.")
    }

    initState() {}

    refresh() {
        var rebuilt = this.build()
        var reelement = rebuilt.build()
        if (this.tree) {
            function compare(left, right, element) {
                // We would end up calling itemBuild on left with the 'context' and thus potentially generating the same content.
                if (!left.equal(right)) return [[right, element]]
                
                // At this point we know the number of children
                if (isFunction(left.itemBuilder)) {
                    var deltas = []
                    for(var index = 0; index < left.cachedChildren.length; index++) {
                        var child = right.itemBuilder(index)
                        // console.log('Compare', left.cachedChildren[index], child)
                        deltas = deltas.concat(compare(left.cachedChildren[index], child, $(element.children()[index])))
                    }
                    return deltas
                }

                var deltas = []
                for(var index = 0; index < left.children.length; index++) {
                    deltas = deltas.concat(compare(left.children[index], right.children[index], $(element.children()[index])))
                }
                return deltas                
            }

            var results = compare(this.tree, rebuilt, this.element)
            // console.log('delta', results)
            if (results.length == 0) {
                // No changes
                return
            }
            // Now we need to go through the list of path
            for(var i = 0; i < results.length; i++) {
                var node = results[i][0]
                var element = results[i][1]
                element.replaceWith(node.build())
            }
            this.tree = rebuilt
            return
        }

        if (this.element) {
            this.element.remove()
            this.element = null
            this.tree = null
        }
        this.tree = this.build()
        this.element = this.tree.build()
        this.container.append(this.element)
    }
}

class brck {
    static Component({container} = {}) {
        return new Component({container:container})
    }

    static Span({id=null, classes=[], attributes={}, children=[], text=null, html=null}={}) {
        return new Span({id:id, classes:classes, attributes:attributes, children:children, text:text, html:html})
    }
    static Link(href, {id=null, classes=[], attributes={}, children=[], text=null, html=null}={}) {
        return new Link(href, {id:id, classes:classes, attributes:attributes, children:children, text:text, html:html})
    }
    static Container({id=null, classes=[], attributes={}, children=[]}={}) {
        return new Container({id:id, classes:classes, attributes:attributes, children:children})
    }
    static Row({id=null, classes=[], attributes={}, children=[]}={}) {
        return new Row({id:id, classes:classes, attributes:attributes, children:children})
    }
    static Column({id=null, classes=[], attributes={}, children=[]}={}) {
        return new Column({id:id, classes:classes, attributes:attributes, children:children})
    }
    static Table({id=null, classes=[], attributes={}, columns=[], children=[], itemCount=0, itemBuilder=null}={}) {
        return new Table({id:id, classes:classes, attributes:attributes, columns:columns, children:children, itemCount: itemCount, itemBuilder:itemBuilder})
    }
    static TableRow({id=null, classes=[], attributes={}, children=[], itemCount=0, itemBuilder=null}={}) {
        return new TableRow({id:id, classes:classes, attributes:attributes, children:children, itemCount: itemCount, itemBuilder:itemBuilder})
    }
    static TableColumn({id=null, classes=[], attributes={}, children=[], text=null, html=null}={}) {
        return new TableColumn({id:id, classes:classes, attributes:attributes, children:children, text:text, html:html})
    }        
}