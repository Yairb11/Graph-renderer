/**
 * Canvas painting for the graph: axes, region colors and the recursive
 * subdivision described in Jeff Tupper's two dimensional graphing paper.
 */

const REGION_COLORS = Object.freeze({
    [COMPARISON.EQUAL]: { inside: COLORS.WHITE, outside: COLORS.WHITE, boundary: COLORS.BLACK },
    [COMPARISON.GREATER]: { inside: COLORS.BLACK, outside: COLORS.WHITE, boundary: COLORS.RED },
    [COMPARISON.LESS]: { inside: COLORS.WHITE, outside: COLORS.BLACK, boundary: COLORS.RED },
    [COMPARISON.GREATER_EQUAL]: { inside: COLORS.BLACK, outside: COLORS.WHITE, boundary: COLORS.BLACK },
    [COMPARISON.LESS_EQUAL]: { inside: COLORS.WHITE, outside: COLORS.BLACK, boundary: COLORS.BLACK },
    [COMPARISON.NOT_EQUAL]: { inside: COLORS.BLACK, outside: COLORS.BLACK, boundary: COLORS.WHITE }
});

/**
 * Greatest common divisor, used to pick the largest starting block size.
 * @param {number} a - First value.
 * @param {number} b - Second value.
 * @returns {number} - The greatest common divisor of both values.
 */
function greatestCommonDivisor(a, b) {
    return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

/**
 * Fills a rectangle of the canvas, converting from graph orientation
 * where the Y axis grows upwards.
 * @param {string} color - Fill color of the rectangle.
 * @param {number[]} block - Pixel bounds as [left, right, bottom, top].
 */
function paintArea(color, block) {
    const [left, right, bottom, top] = block;
    const canvasTop = CANVAS.HEIGHT - top;
    const canvasBottom = CANVAS.HEIGHT - bottom;

    fill(color);
    noStroke();
    rect(left, canvasTop, right - left, canvasBottom - canvasTop);
}

/**
 * Draws the X and Y axes whenever the origin falls inside the viewport.
 */
function drawAxes() {
    let zeroLine;

    if (VIEWPORT.left <= 0 && VIEWPORT.right >= 0) {
        zeroLine = Math.floor(CANVAS.HEIGHT * (0 - VIEWPORT.bottom) / (VIEWPORT.top - VIEWPORT.bottom));
        paintArea(COLORS.GRAY, [0, CANVAS.WIDTH, zeroLine - PIXEL / 2, zeroLine + PIXEL / 2]);
    }

    if (VIEWPORT.bottom <= 0 && VIEWPORT.top >= 0) {
        zeroLine = Math.floor(CANVAS.WIDTH * (0 - VIEWPORT.left) / (VIEWPORT.right - VIEWPORT.left));
        paintArea(COLORS.GRAY, [zeroLine - PIXEL / 2, zeroLine + PIXEL / 2, 0, CANVAS.HEIGHT]);
    }
}

/**
 * Evaluates the equation at the four corners of a block.
 * @param {number[]} block - Pixel bounds as [left, right, bottom, top].
 * @param {Array<string|number>} leftTokens - Left side in reverse polish notation.
 * @param {Array<string|number>} rightTokens - Right side in reverse polish notation.
 * @returns {boolean[]} - Whether the left side wins at each corner of the block.
 */
function cornerStates(block, leftTokens, rightTokens) {
    const ratioX = (VIEWPORT.right - VIEWPORT.left) / CANVAS.WIDTH;
    const ratioY = (VIEWPORT.top - VIEWPORT.bottom) / CANVAS.HEIGHT;
    const left = block[0] * ratioX + VIEWPORT.left;
    const right = block[1] * ratioX + VIEWPORT.left;
    const bottom = block[2] * ratioY + VIEWPORT.bottom;
    const top = block[3] * ratioY + VIEWPORT.bottom;

    return [
        isLeftGreater(left, bottom, leftTokens, rightTokens),
        isLeftGreater(right, bottom, leftTokens, rightTokens),
        isLeftGreater(left, top, leftTokens, rightTokens),
        isLeftGreater(right, top, leftTokens, rightTokens)
    ];
}

/**
 * Paints one block according to the state of its corners, and reports whether
 * the boundary of the equation crosses it.
 * @param {number[]} block - Pixel bounds as [left, right, bottom, top].
 * @param {Array<string|number>} leftTokens - Left side in reverse polish notation.
 * @param {Array<string|number>} rightTokens - Right side in reverse polish notation.
 * @param {number} comparison - The COMPARISON value of the equation.
 * @returns {boolean} - Whether the corners disagree, so the block needs splitting.
 */
function paintBlock(block, leftTokens, rightTokens, comparison) {
    const states = cornerStates(block, leftTokens, rightTokens);
    const palette = REGION_COLORS[comparison];

    if (states.every(Boolean)) {
        paintArea(palette.inside, block);
        return false;
    }

    if (!states.some(Boolean)) {
        paintArea(palette.outside, block);
        return false;
    }

    paintArea(palette.boundary, block);
    return true;
}

/**
 * Splits a block into its four quadrants.
 * @param {number[]} block - Pixel bounds as [left, right, bottom, top].
 * @returns {Array<number[]>} - The four smaller blocks.
 */
function splitBlock(block) {
    const [left, right, bottom, top] = block;
    const half = (right - left) / 2;

    return [
        [left, left + half, bottom, bottom + half],
        [left + half, right, bottom, bottom + half],
        [left, left + half, bottom + half, top],
        [left + half, right, bottom + half, top]
    ];
}

/**
 * Builds the grid of starting blocks, sized so the canvas divides evenly
 * down to single pixels.
 * @returns {Array<number[]>} - The initial blocks covering the whole canvas.
 */
function initialBlocks() {
    const shared = greatestCommonDivisor(CANVAS.WIDTH / PIXEL, CANVAS.HEIGHT / PIXEL);
    const power = Math.floor(Math.log2(
        greatestCommonDivisor(shared, Math.pow(2, Math.floor(Math.log2(shared))))));
    const size = Math.pow(2, power);

    const blocks = [];
    for (let column = 0; column * size < CANVAS.WIDTH; column += 1)
        for (let row = 0; row * size < CANVAS.HEIGHT; row += 1)
            blocks.push([column * size, (column + 1) * size, row * size, (row + 1) * size]);

    return blocks;
}

/**
 * Plots the equation by painting blocks and subdividing only the ones the
 * boundary passes through, until they reach a single pixel.
 * @param {Array<string|number>} leftTokens - Left side in reverse polish notation.
 * @param {Array<string|number>} rightTokens - Right side in reverse polish notation.
 * @param {number} comparison - The COMPARISON value of the equation.
 */
function plotEquation(leftTokens, rightTokens, comparison) {
    paintArea(COLORS.RED, [0, CANVAS.WIDTH, 0, CANVAS.HEIGHT]);

    const blocks = initialBlocks();
    let index = 0;

    while (index < blocks.length) {
        const block = blocks[index];
        const crossesBoundary = paintBlock(block, leftTokens, rightTokens, comparison);
        if (crossesBoundary && block[1] - block[0] > PIXEL)
            blocks.push(...splitBlock(block));
        index += 1;
    }
}

/**
 * Renders a full frame: the plotted equation with the axes drawn on top.
 * @param {Array<string|number>} leftTokens - Left side in reverse polish notation.
 * @param {Array<string|number>} rightTokens - Right side in reverse polish notation.
 * @param {number} comparison - The COMPARISON value of the equation.
 */
function renderGraph(leftTokens, rightTokens, comparison) {
    plotEquation(leftTokens, rightTokens, comparison);
    drawAxes();
}
