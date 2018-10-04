//import { combineReducers } from 'redux';
import {
  FIRST_OPERAND_SET,
	SECOND_OPERAND_SET,
	OPERATOR_SET
} from '../actions';

export default (state, action) => {
	//console.log(action);
  switch (action.type) {
		case FIRST_OPERAND_SET:
			return {
				...state,
				firstOperand: action.value
			};
		case SECOND_OPERAND_SET:
			return {
				...state,
				secondOperand: action.value
			};
		case OPERATOR_SET:
			return {
				...state,
				operator: action.value
			}
		default:
	  	return state;
  }
}