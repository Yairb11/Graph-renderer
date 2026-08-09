/**
 * p5.js entry point and the public API used by the page to draw an equation.
 */

/**
 * Creates the empty canvas with the default viewport when the page loads.
 */
function setup() {
    createCanvas(CANVAS.WIDTH, CANVAS.HEIGHT).parent('canvas-holder');
    background(COLORS.WHITE);
    drawAxes();
}

/**
 * Validates an equation, tokenizes both of its sides and draws it on the canvas.
 * @param {string} input - The equation typed by the user.
 * @param {number} left - Minimum X of the viewport.
 * @param {number} right - Maximum X of the viewport.
 * @param {number} bottom - Minimum Y of the viewport.
 * @param {number} top - Maximum Y of the viewport.
 * @returns {object} - {ok} on success, {ok, message} when the equation is rejected.
 */
function createGraph(input, left, right, bottom, top) {
    const analysis = analyzeInput(input);
    if (!analysis.valid)
        return { ok: false, message: 'Try again' };

    const leftTokens = tokenize(analysis.leftSide);
    const rightTokens = tokenize(analysis.rightSide);

    VIEWPORT.left = left;
    VIEWPORT.right = right;
    VIEWPORT.bottom = bottom;
    VIEWPORT.top = top;

    renderGraph(leftTokens, rightTokens, analysis.comparison);
    return { ok: true };
}
