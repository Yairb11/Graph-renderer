/**
 * Stack machine that evaluates a tokenized expression at a given point,
 * and compares the two sides of the user's equation there.
 */

const UNARY_OPERATIONS = Object.freeze({
    neg: (value) => -value,
    abs: Math.abs,
    sqrt: Math.sqrt,
    ln: Math.log,
    log: Math.log10,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    arcsin: Math.asin,
    arccos: Math.acos,
    arctan: Math.atan,
    arcsinh: Math.asinh,
    arccosh: Math.acosh,
    arctanh: Math.atanh
});

const BINARY_OPERATIONS = Object.freeze({
    '+': (left, right) => left + right,
    '-': (left, right) => left - right,
    '*': (left, right) => left * right,
    '/': (left, right) => left / right,
    '^': (left, right) => Math.pow(left, right)
});

/**
 * Evaluates a reverse polish expression at one point of the plane.
 * @param {number} x - X coordinate to substitute.
 * @param {number} y - Y coordinate to substitute.
 * @param {Array<string|number>} tokens - Expression in reverse polish notation.
 * @returns {number} - The value of the expression at (x, y).
 */
function evaluateExpression(x, y, tokens) {
    const stack = [];

    for (const token of tokens) {
        if (typeof token === 'number')
            stack.push(token);
        else if (token === 'x')
            stack.push(x);
        else if (token === 'y')
            stack.push(y);
        else if (token in CONSTANT_TOKENS)
            stack.push(CONSTANT_TOKENS[token]);
        else if (token in UNARY_OPERATIONS)
            stack.push(UNARY_OPERATIONS[token](stack.pop()));
        else if (token in BINARY_OPERATIONS) {
            const right = stack.pop();
            const left = stack.pop();
            stack.push(BINARY_OPERATIONS[token](left, right));
        }
    }

    return stack[0];
}

/**
 * Tells whether the left side of the equation exceeds the right side at a point.
 * @param {number} x - X coordinate to substitute.
 * @param {number} y - Y coordinate to substitute.
 * @param {Array<string|number>} leftTokens - Left side in reverse polish notation.
 * @param {Array<string|number>} rightTokens - Right side in reverse polish notation.
 * @returns {boolean} - Whether left minus right is positive at (x, y).
 */
function isLeftGreater(x, y, leftTokens, rightTokens) {
    return evaluateExpression(x, y, leftTokens) - evaluateExpression(x, y, rightTokens) > 0;
}
