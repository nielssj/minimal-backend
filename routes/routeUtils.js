
function makeValidationError(validationResult) {
  return { message: 'INVALID_INPUT', errors: validationResult.errors };
}

module.exports = { makeValidationError };
