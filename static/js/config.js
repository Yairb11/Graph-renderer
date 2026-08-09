/**
 * Shared constants for the graph renderer: canvas size, viewport bounds,
 * colors, comparison kinds and the supported math function names.
 */

const CANVAS = Object.freeze({
    WIDTH: 1280,
    HEIGHT: 720
});

const PIXEL = 1;

const VIEWPORT = {
    left: -10,
    right: 10,
    bottom: -10,
    top: 10
};

const COLORS = Object.freeze({
    BLACK: '#000000',
    WHITE: '#ffffff',
    RED: '#ff0000',
    GRAY: '#757575'
});

const COMPARISON = Object.freeze({
    NONE: -1,
    EQUAL: 0,
    GREATER: 1,
    LESS: 2,
    GREATER_EQUAL: 3,
    LESS_EQUAL: 4,
    NOT_EQUAL: 5
});

const COMPARISON_SYMBOLS = Object.freeze(['=', '>', '<', '>=', '<=', '>/<']);

const MATH_FUNCTIONS = Object.freeze([
    'sin', 'cos', 'tan',
    'sinh', 'cosh', 'tanh',
    'arcsin', 'arccos', 'arctan',
    'arcsinh', 'arccosh', 'arctanh',
    'abs', 'ln', 'log', 'sqrt'
]);

const CONSTANT_TOKENS = Object.freeze({
    e: Math.E,
    pi: Math.PI
});
