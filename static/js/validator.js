/**
 * Validation of the user's equation: locates the comparison operator,
 * splits the equation into two sides and rejects malformed math syntax.
 */

/**
 * Detects which comparison operator the input uses.
 * The input is valid only when exactly one comparison appears, so the
 * positions of the overlapping symbols ('>' inside '>=') must line up.
 * @param {number[]} positions - Index of every comparison symbol, -1 when absent.
 * @param {...number} expected - Indices of the symbols that must be present.
 * @returns {boolean} - Whether only the expected symbols were found.
 */
function containsOnly(positions, ...expected) {
    return positions.every((position, index) =>
        expected.includes(index) ? position !== -1 : position === -1);
}

/**
 * Finds the comparison kind used by the equation.
 * @param {string} equation - The user's equation without spaces.
 * @returns {number} - A COMPARISON value, or COMPARISON.NONE when ambiguous.
 */
function findComparisonKind(equation) {
    const at = COMPARISON_SYMBOLS.map((symbol) => equation.search(symbol));

    if (containsOnly(at, 0))
        return COMPARISON.EQUAL;
    if (containsOnly(at, 1))
        return COMPARISON.GREATER;
    if (containsOnly(at, 2))
        return COMPARISON.LESS;
    if (containsOnly(at, 0, 1, 3) && at[0] === at[1] + 1 && at[1] === at[3])
        return COMPARISON.GREATER_EQUAL;
    if (containsOnly(at, 0, 2, 4) && at[0] === at[2] + 1 && at[2] === at[4])
        return COMPARISON.LESS_EQUAL;
    if (containsOnly(at, 1, 2, 5) && at[2] === at[1] + 2 && at[1] === at[5])
        return COMPARISON.NOT_EQUAL;

    return COMPARISON.NONE;
}

/**
 * Splits the equation around its comparison operator.
 * @param {string} equation - The user's equation without spaces.
 * @returns {object} - {comparison, leftSide, rightSide}; comparison is
 *                     COMPARISON.NONE with empty sides when the split fails.
 */
function splitEquation(equation) {
    const failure = { comparison: COMPARISON.NONE, leftSide: '', rightSide: '' };
    const comparison = findComparisonKind(equation);
    if (comparison === COMPARISON.NONE)
        return failure;

    const sides = equation.split(COMPARISON_SYMBOLS[comparison]);
    if (sides.length !== 2 || sides[0] === '' || sides[1] === '')
        return failure;

    const rightHasComparison = COMPARISON_SYMBOLS.some((symbol) => sides[1].search(symbol) !== -1);
    if (rightHasComparison)
        return failure;

    return { comparison: comparison, leftSide: sides[0], rightSide: sides[1] };
}

/**
 * Checks that every parenthesis is closed and that no pair is left empty.
 * @param {string} expression - One side of the equation.
 * @returns {boolean} - Whether the parentheses are balanced.
 */
function hasBalancedParentheses(expression) {
    let depth = 0;
    let lastOpening = -1;

    for (let i = 0; i < expression.length; i++) {
        const character = expression[i];
        if (character === '(') {
            lastOpening = i;
            depth += 1;
        } else if (character === ')') {
            if (lastOpening === -1 || lastOpening + 1 === i)
                return false;
            depth -= 1;
        }
    }

    return depth === 0;
}

/**
 * Checks one side of the equation against the math syntax this renderer supports.
 * @param {string} expression - One side of the equation.
 * @returns {boolean} - Whether the expression is well formed.
 */
function hasValidSyntax(expression) {
    const knownTokens = /^(arcsinh|arccosh|arctanh|sinh|cosh|tanh|abs|sin|cos|tan|arctan|arcsin|arccos|ln|log|sqrt|x|y|e|pi|\d+(\.\d+)?|[\+\-\*\/\^\(\)])+$/;
    const functionWithoutCall = /(arcsinh|arccosh|arctanh|arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|abs|ln|log|sqrt)(?![h\(])/;
    const repeatedOperator = /[\+\-\*'\/\^]{2,}/;
    const leadingOperator = /^[\+\*\/\^]/;
    const trailingOperator = /[\+\-\*\/\^]$/;
    const operatorAfterOpening = /\([\+\*\/\^]/;
    const operatorBeforeClosing = /[\+\-\*\/\^]\)/;
    const missingOperator = /\d[a-zA-Z(]|\)[a-zA-Z(]|[xye][xye]|[xye]\(|[a-zA-Z)]\d/;
    const missingOperatorAroundPi = /\d(pi)|\)(pi)|[xye](pi)|(pi)[xye]|(pi)\(|(pi)\d/;

    const rejections = [
        functionWithoutCall,
        repeatedOperator,
        leadingOperator,
        trailingOperator,
        operatorAfterOpening,
        operatorBeforeClosing,
        missingOperator,
        missingOperatorAroundPi
    ];

    if (!knownTokens.test(expression))
        return false;

    return !rejections.some((pattern) => pattern.test(expression));
}

/**
 * Normalizes and fully validates the user's equation.
 * @param {string} input - The raw text typed by the user.
 * @returns {object} - {valid, leftSide, rightSide, comparison}.
 */
function analyzeInput(input) {
    const failure = { valid: false, leftSide: '', rightSide: '', comparison: COMPARISON.NONE };
    const equation = input.replaceAll(' ', '').toLowerCase();

    const sides = splitEquation(equation);
    if (sides.comparison === COMPARISON.NONE)
        return failure;

    if (!hasBalancedParentheses(sides.leftSide) || !hasBalancedParentheses(sides.rightSide))
        return failure;

    if (!hasValidSyntax(sides.leftSide) || !hasValidSyntax(sides.rightSide))
        return failure;

    return {
        valid: true,
        leftSide: sides.leftSide,
        rightSide: sides.rightSide,
        comparison: sides.comparison
    };
}
