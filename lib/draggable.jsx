let currentTarget
let currentSource

const debug = false

const _debounceTimers = {}
function debounce (key, callback) {
    if (_debounceTimers[key] === undefined) {
        _debounceTimers[key] = window.requestAnimationFrame(() => {
            callback()
            delete _debounceTimers[key]
        })
    }
}

function getDraggable (node) {
    for (let target = node; !target.classList.contains('InfernoFormlib-DragContainer'); target = target.parentNode) {
        if (target.parentNode.classList.contains('InfernoFormlib-DragContainer')) {
            return target
        }
    }
    return undefined
}


export function handleDragStart (e) {
    const draggable = getDraggable(e.target)
    currentSource = currentTarget = draggable.getAttribute('data-drag-index')

    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'
    // e.dataTransfer.setData('text', e.target.getAttribute('data-drag-index'))

    draggable.classList.add('InfernoFormlib-DragItem--isDragging')
    
    debug && _dragDebug(draggable, e)
}

let currentMouseY
export function handleDragOver (e) {
    if (e.preventDefault) e.preventDefault()

        if (currentMouseY === e.clientY) return
        currentMouseY = e.clientY
        e.dataTransfer.dropEffect = 'move'

        const draggable = getDraggable(e.target)
    
        debug && console.log("OVER: " + currentTarget + ":" + (_isAfter(draggable, e) ? 'after' : 'before'))
        _updateDragMarkers(draggable, e)

        debug && _dragDebug(draggable, e)

    // Only call this once on each animation frame and if the mouse has moved vertically
/*    debounce('handleDragOver', () => {
        if (currentMouseY === e.clientY) return
        currentMouseY = e.clientY
        e.dataTransfer.dropEffect = 'move'

        const draggable = getDraggable(e.target)
    
        _updateDragMarkers(draggable, e)

        debug && _dragDebug(draggable, e)
    }) */
}

export function handleDragEnter (e) {
    const draggable = getDraggable(e.target)
    if (draggable === undefined) return

    if (currentTarget !== draggable.getAttribute('data-drag-index')) {
        currentTarget = draggable.getAttribute('data-drag-index')
    }
    // _updateDragMarkers(draggable, e)
}

export function handleDragLeave (e) {
    const draggable = getDraggable(e.target)
    _clearDragMarkers(draggable, 'before', 'after')
}

export function handleDragEnd (e) {
    const draggable = getDraggable(e.target)
    draggable.classList.remove('InfernoFormlib-DragItem--isDragging')
}

export function handleDrop (e) {
    e.stopPropagation()

    const draggable = getDraggable(e.target)
    if (draggable === undefined) return
    _clearDragMarkers(draggable, 'before', 'after')

    if (currentTarget !== currentSource) {
        debug && console.log("DROP: " + currentTarget + ":" + (_isAfter(draggable, e) ? 'after' : 'before'))
        this.props.onDrop(currentSource, parseInt(currentTarget) + (_isAfter(draggable, e) ? 1 : 0))
    }
    currentTarget = currentSource = undefined
}

function _updateDragMarkers (el, e) {
    if (!el.classList.contains('InfernoFormlib-DragItem--isDragging')) {
        if (_isAfter(el, e)) {
            // Below middle
            _setDragMarkers(el, 'after')
            _clearDragMarkers(el, 'before')
        } else {
            // Above middle
            _setDragMarkers(el, 'before')
            _clearDragMarkers(el, 'after')
        }
    }
}

function _isAfter (el, e) {
    const boundRect = el.getBoundingClientRect()
    return (e.clientY > boundRect.top + boundRect.height / 2)
}

function _setDragMarkers (el) {
    const tmp = [...arguments]
    // Remove first argument
    tmp.shift()
    tmp.forEach((suffix) => {
        !el.classList.contains('InfernoFormlib-DragItem--' + suffix) && el.classList.add('InfernoFormlib-DragItem--' + suffix)
    })
}

function _clearDragMarkers (el) {
    const tmp = [...arguments]
    // Remove first argument
    tmp.shift()
    tmp.forEach((suffix) => {
        el.classList.contains('InfernoFormlib-DragItem--' + suffix) && el.classList.remove('InfernoFormlib-DragItem--' + suffix)
    })
}

function _dragDebug (el, e) {
    // TODO: Add a marker to show where the drag line is
    const boundRect = el.getBoundingClientRect()
    const dTop = el.offsetTop
    const dHeight = el.offsetHeight
    let dbgEl = document.getElementById('dragDebug')
    if (!dbgEl) {
        // Add to DOM
        dbgEl = document.createElement('div')
        dbgEl.setAttribute('id', 'dragDebug')
        dbgEl.setAttribute('style', 'position: absolute; left: 0; right: 0; height: 2px; background-color: red')
        document.body.appendChild(dbgEl, document.body)
    }
    dbgEl.style.top = window.scrollY + boundRect.top + 'px'

    let mouseEl = document.getElementById('mouseDragDebug')
    if (!mouseEl) {
        // Add to DOM
        mouseEl = document.createElement('div')
        mouseEl.setAttribute('id', 'mouseDragDebug')
        mouseEl.setAttribute('style', 'position: absolute; left: 0; right: 0; height: 2px; background-color: green')
        document.body.appendChild(mouseEl, document.body)
    }
    console.log(window.scrollY + e.clientY - boundRect.height / 2)
    mouseEl.style.top = window.scrollY + e.clientY + 'px'
}

// TODO: getAnimationFrame!!!