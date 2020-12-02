window.onload = function () {
    const rem = document.getElementById('demo');

    rem.addEventListener('mousemove', mouseMove, false);

    /**
     * mouse move event
     * @param {MouseEvent} ev mouse event
     */
    function mouseMove(ev) {
        const { clientX, clientY } = ev;
        const { offsetWidth, offsetHeight } = rem;

        const position = `${clientX - offsetWidth / 8}px ${clientY - offsetHeight / 8}px`;

        rem.style.maskPosition = position;
        rem.style.webkitMaskPosition = position;
    }
}