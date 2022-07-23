export function slideOut(node, { duration = 2000, pixels = 100}) {
    let top = node.offsetTop - parseFloat(getComputedStyle(node).marginTop);
    let left = node.offsetLeft;
    return {
        duration,
        css(t, u) {
            // Remove the element from the normal flow so that it doesn't interfere with the
            // placement of the new element, but position it exactly where it was.
            return `position:absolute;top:${top}px;left:${left}px;opacity:${t};transform:translateX(-${Math.floor(pixels*u)}px)`;
        }
    }
}

export function slideIn(node, { duration = 2000, pixels = 100 }) {
    return {
        duration,
        css(t, u) {
            return `transform:translateX(${Math.floor(pixels*u)}px);opacity:${t}`;
        }
    }
}