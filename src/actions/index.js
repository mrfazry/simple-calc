export const FIRST_OPERAND_SET = 'FIRST_OPERAND_SET';
export const SECOND_OPERAND_SET = 'SECOND_OPERAND_SET';
export const OPERATOR_SET = 'OPERATOR_SET';

export function setFirstOperand(value) {
  return {
    type: FIRST_OPERAND_SET,
    value
  };
}

export function setSecondOperand(value) {
  return {
    type: SECOND_OPERAND_SET,
    value
  };
}

export function setOperator(value) {
  return {
    type: OPERATOR_SET,
    value
  };
}