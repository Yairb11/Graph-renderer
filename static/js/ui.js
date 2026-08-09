/**
 * Connects the page controls to the renderer: reads the form, reports
 * problems inline and captions the canvas with the plotted equation.
 */

/**
 * Shows a message under the equation field and marks the field as invalid.
 * @param {string} message - The problem to show to the user.
 */
function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.hidden = false;
    document.getElementById('user_input').setAttribute('aria-invalid', 'true');
}

/**
 * Clears any message currently shown under the equation field.
 */
function clearError() {
    const error = document.getElementById('error');
    error.textContent = '';
    error.hidden = true;
    document.getElementById('user_input').removeAttribute('aria-invalid');
}

/**
 * Reads a numeric field of the form.
 * @param {string} id - Identifier of the input element.
 * @returns {number} - The value of the field, NaN when it is empty.
 */
function readNumber(id) {
    return parseFloat(document.getElementById(id).value);
}

/**
 * Draws the equation currently typed in the form.
 */
function plotFromForm() {
    const equation = document.getElementById('user_input').value;
    const left = readNumber('L_border');
    const right = readNumber('R_border');
    const bottom = readNumber('B_border');
    const top = readNumber('T_border');

    if (right - left <= 0 || top - bottom <= 0) {
        showError('Try again: the maximum of each range must be greater than its minimum');
        return;
    }

    const result = createGraph(equation, left, right, bottom, top);
    if (!result.ok) {
        showError(result.message);
        return;
    }

    clearError();
    document.getElementById('output').textContent = equation;
}

document.getElementById('graph').addEventListener('click', plotFromForm);

document.getElementById('user_input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter')
        plotFromForm();
});
