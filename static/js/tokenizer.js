/**
 * Turns one side of the equation into reverse polish notation using the
 * Shunting Yard algorithm, so the evaluator can run it as a simple stack machine.
 */

const OPERATOR_PRIORITY = Object.freeze({
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3,
    'neg': 4
});

const RIGHT_ASSOCIATIVE = Object.freeze(['^', 'neg']);

/**
 * Splits an expression into numbers, names and single character operators.
 * A '-' that opens the expression or a parenthesis becomes the unary 'neg'.
 * @param {string} expression - One side of the equation.
 * @returns {Array<string|number>} - The scanned tokens in reading order.
 */
function scanTokens(expression) {
    const isDigit = (character) => (character >= '0' && character <= '9') || character === '.';
    const isLetter = (character) => character >= 'a' && character <= 'z';

    const tokens = [];
    let i = 0;

    while (i < expression.length) {
        const character = expression[i];

        if ('+-*/^()'.includes(character)) {
            const isUnaryMinus = character === '-' &&
                (tokens.length === 0 || tokens[tokens.length - 1] === '(');
            tokens.push(isUnaryMinus ? 'neg' : character);
            i += 1;
        } else if (isDigit(character)) {
            let digits = '';
            while (i < expression.length && isDigit(expression[i])) {
                digits += expression[i];
                i += 1;
            }
            tokens.push(parseFloat(digits));
        } else if (isLetter(character)) {
            let name = '';
            while (i < expression.length && isLetter(expression[i])) {
                name += expression[i];
                i += 1;
            }
            tokens.push(name);
        } else
            i += 1;
    }

    return tokens;
}

/**
 * Decides whether the operator on top of the stack is applied before the incoming one.
 * @param {string} stackTop - Operator or function currently on top of the stack.
 * @param {string} incoming - Operator being pushed.
 * @returns {boolean} - Whether the stack top should be popped first.
 */
function popsBefore(stackTop, incoming) {
    if (MATH_FUNCTIONS.includes(stackTop))
        return true;
    if (OPERATOR_PRIORITY[stackTop] > OPERATOR_PRIORITY[incoming])
        return true;
    return OPERATOR_PRIORITY[stackTop] === OPERATOR_PRIORITY[incoming] &&
        !RIGHT_ASSOCIATIVE.includes(incoming);
}

/**
 * Converts an expression into reverse polish notation.
 * @param {string} expression - One side of the equation.
 * @returns {Array<string|number>} - The expression in reverse polish notation.
 * @throws {Error} - If the parentheses do not match.
 */
function tokenize(expression) {
    const tokens = scanTokens(expression);
    const output = [];
    const operators = [];

    const isValue = (token) =>
        typeof token === 'number' || token === 'x' || token === 'y' || token in CONSTANT_TOKENS;

    for (const token of tokens) {
        if (isValue(token))
            output.push(token);
        else if (MATH_FUNCTIONS.includes(token))
            operators.push(token);
        else if (token in OPERATOR_PRIORITY) {
            while (operators.length > 0 &&
                   operators[operators.length - 1] !== '(' &&
                   popsBefore(operators[operators.length - 1], token))
                output.push(operators.pop());
            operators.push(token);
        } else if (token === '(')
            operators.push(token);
        else if (token === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(')
                output.push(operators.pop());
            if (operators.length === 0)
                throw new Error('Mismatched parentheses');
            operators.pop();
        }
    }

    while (operators.length > 0) {
        const operator = operators.pop();
        if (operator === '(' || operator === ')')
            throw new Error('Mismatched parentheses');
        output.push(operator);
    }

    return output;
}
