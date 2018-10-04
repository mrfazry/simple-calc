import { createStore, applyMiddleware } from 'redux';
import reducer from "../reducers";

const initialState = {
  firstOperand: ["0"],
  operator: "",
  secondOperand: []
};
export const store = createStore(reducer, initialState);