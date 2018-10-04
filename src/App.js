import React, { Component } from 'react';
//import update from 'immutability-helper';
//import math from 'mathjs';
import { store } from './store';
import {
  setFirstOperand,
  setSecondOperand,
  setOperator
} from './actions';
import './App.css';

class DisplayArea extends Component {
  filterInputDisplay(firstOperand, operator, secondOperand) {
    let result;
    if(operator === "" && secondOperand === "") {
      result = firstOperand;
    } else if(operator !== "" && secondOperand === "") {
      result = operator;
    } else {
      result = secondOperand;
    }
    return result;
  }
  filterResultDisplay(firstOperand, operator, secondOperand) {
    let result = "";
    result = "" + firstOperand;
    if(operator !== "") {
      result = result + " " + operator;
      if(secondOperand !== "") {
        result = result + " " + secondOperand;
      }
    }
    return result;
  }
  render() {
    const firstOperand = store.getState().firstOperand.join('');
    const operator = store.getState().operator;
    const secondOperand = store.getState().secondOperand.join('');
    const inputDisplay = this.filterInputDisplay(firstOperand, operator, secondOperand);
    const resultDisplay = this.filterResultDisplay(firstOperand, operator, secondOperand);
    return (
      <div className="display-area">
        <ResultArea text={resultDisplay} />
        <IndividualInputArea text={inputDisplay}/>
      </div>
    );
  }
}

class ResultArea extends Component {
  render() {
    return (
      <div>
        <p className="result-area">
          {this.props.text}
        </p>
      </div>
    );
  }
}

class IndividualInputArea extends Component {
  render() {
    return (
      <div>
        <p className="individual-input-area">
          {this.props.text}
        </p>
      </div>
    );
  }
}

class ButtonGroup extends Component {
  render() {
    const buttonData = [
      { id: "zero", text: "0" },
      { id: "one", text: "1" },
      { id: "two", text: "2" },
      { id: "three", text: "3" },
      { id: "four", text: "4" },
      { id: "five", text: "5" },
      { id: "six", text: "6" },
      { id: "seven", text: "7" },
      { id: "eight", text: "8" },
      { id: "nine", text: "9" },
      { id: "decimal", text: "." },
      { id: "percent", text: "%" },
      { id: "add", text: "+" },
      { id: "subtract", text: "-" },
      { id: "multiply", text: "x" },
      { id: "divide", text: "/" },
      { id: "equal", text: "=" },
      { id: "clear", text: "AC" },
      { id: "backspace", text: "<=" }
    ];
    
    return (
      <div className="button-group">
        {buttonData.map((value, index) => (
          <Button key={`btn-${index}`} buttonId={value.id} buttonText={value.text} />
        ))}
      </div>
      
    );
  }
}

class Button extends Component {
  /*
      0     0       tetep             operand = operand
      0     1-9     0 ilang + 1-9     operand = button
      0     .       0 + .             operand = operand + button
      
      1-9   apapun  1-9 + apapun      operand = operand + button x4

      ada.  0       . + 0             operand = operand + button
      ada.  1-9     . + 1-9           operand = operand + button
      ada.  .       tetep             operand = operand
      
      if  0 && 1-9 
            operand = button
      if  (0 && 0) || (. && .)
            operand = operand
      else
            operand = operand + button
  */
  isEmpty(operator) {
    return operator === "";
  }
  isZero(operand) { // this can be operand or buttonPressed
    return operand === "0";
  }
  isNumber(buttonPressed) {
    return /\d/.test(buttonPressed);
  }
  hasDecimal(operand) {
    return /\d+\.\d*/.test(operand);
  }
  isDecimal(buttonPressed) {
    return buttonPressed === ".";
  }
  appendOperand(buttonPressed) {
    let operand, newOperand;
    let operator = store.getState().operator;
    if(this.isEmpty(operator)) {
      operand = store.getState().firstOperand.join('');
    } else {
      operand = store.getState().secondOperand.join('');
    }
    if(operand.length < 13) {
      if(this.isZero(operand) && this.isNumber(buttonPressed)) {
        newOperand = buttonPressed;
      } else if( (this.isZero(operand) && this.isZero(buttonPressed)) || (this.hasDecimal(operand) && this.isDecimal(buttonPressed)) ) {
        newOperand = operand;
      } else if( this.isEmpty(operand) && this.isDecimal(buttonPressed) ) {
        newOperand = "0" + buttonPressed;
      } else {
        newOperand = operand + buttonPressed;
      }
  
      let newNewOperand = newOperand.split('');
      if(this.isEmpty(operator)) {
        store.dispatch(setFirstOperand(newNewOperand));
      } else {
        store.dispatch(setSecondOperand(newNewOperand));
      }
    }
  }
  calculateByOperator(firstOperand, operator, secondOperand, buttonPressed) {
    let result;
    switch(operator) {
      case "+":
        result = +firstOperand + +secondOperand;
        break;
      case "-":
        result = +firstOperand - +secondOperand;
        break;
      case "x":
        result = +firstOperand * +secondOperand;
        break;
      case "/":
        result = +firstOperand / +secondOperand;
        break;
      default:
        break;
    }
    let newFirstOperand = ("" + result).split('');
    let newOperator = buttonPressed;
    let newSecondOperand = [];
    store.dispatch(setFirstOperand(newFirstOperand));
    store.dispatch(setOperator(newOperator));
    store.dispatch(setSecondOperand(newSecondOperand));
  }
  addOperator(buttonPressed) {
    /* 
      op1 opr op2   hasil
      -----------------------
      0   ""  []    setOpr
      0   ""  ada   mustahil
      0   ada []    setOpr
      0   ada ada   calculate, setOp1 = hasil calculate. setOp2 = []
      ada ""  []    setOpr
      ada ""  ada   mustahil
      ada ada []    setOpr
      ada ada ada   calculate, setOp1 = hasil calculate, setOp2 = []
      
      if  op2 == ada
            calculate, setOp1, setOp2
      else
          setOpr
      
    */
    let firstOperand = store.getState().firstOperand.join('');
    let secondOperand = store.getState().secondOperand.join('');
    let operator = store.getState().operator;

    if(this.isEmpty(secondOperand)) {
      store.dispatch(setOperator(buttonPressed));
    //let newSecondOperand = ["0"];
    //store.dispatch(setSecondOperand(newSecondOperand));
    } else if( (!this.isEmpty(operator)) && (!this.isEmpty(secondOperand)) ) {
      this.calculateByOperator(firstOperand, operator, secondOperand, buttonPressed);
    }
  }
  calculatePercent() {
    /*  percent dipencet
      op1   opr   op2   hasil
      papun gada  gada  op1/100
      papun gada  ada   mustahil
      papun ada   gada  do nothing
      papun ada   ada   op2/100   

    */ 
    let firstOperand = store.getState().firstOperand.join('');
    let secondOperand = store.getState().secondOperand.join('');
    let operator = store.getState().operator;
    if(this.isEmpty(operator)) {
      firstOperand = +firstOperand / 100;
      let newFirstOperand = ("" + firstOperand).split('');
      store.dispatch(setFirstOperand(newFirstOperand));
    } else if( (!this.isEmpty(operator)) && (!this.isEmpty(secondOperand)) ) {
      secondOperand = +secondOperand / 100;
      let newSecondOperand = ("" + secondOperand).split('');
      store.dispatch(setSecondOperand(newSecondOperand));
    }
  }
  calculateByEqual() {
    let firstOperand = store.getState().firstOperand.join('');
    let secondOperand = store.getState().secondOperand.join('');
    let operator = store.getState().operator;
    if( (!this.isEmpty(operator)) && (!this.isEmpty(secondOperand)) ) {
      let result;
      switch(operator) {
        case "+":
          result = +firstOperand + +secondOperand;
          break;
        case "-":
          result = +firstOperand - +secondOperand;
          break;
        case "x":
          result = +firstOperand * +secondOperand;
          break;
        case "/":
          result = +firstOperand / +secondOperand;
          break;
        default:
          break;
      }
      let newFirstOperand = ("" + result).split('');
      let newOperator = "";
      let newSecondOperand = [];
      store.dispatch(setFirstOperand(newFirstOperand));
      store.dispatch(setOperator(newOperator));
      store.dispatch(setSecondOperand(newSecondOperand));
    }
  }
  clearAll() {
    let newFirstOperand = ["0"];
    let newOperator = "";
    let newSecondOperand = [];
    store.dispatch(setFirstOperand(newFirstOperand));
    store.dispatch(setOperator(newOperator));
    store.dispatch(setSecondOperand(newSecondOperand));
  }
  removeLastElement() {
    let firstOperand = store.getState().firstOperand.join('');
    let secondOperand = store.getState().secondOperand.join('');
    let operator = store.getState().operator;
    if(!this.isEmpty(secondOperand)) {
      let newSecondOperand = ((""+(+secondOperand)).slice(0, -1)).split('');
      store.dispatch(setSecondOperand(newSecondOperand));
    } else if( this.isEmpty(secondOperand) && !this.isEmpty(operator) ) {
      let newOperator = "";
      store.dispatch(setOperator(newOperator));
    } else if( firstOperand.length === 1){
      let newFirstOperand = ["0"];
      store.dispatch(setFirstOperand(newFirstOperand));
    } else {
      let newFirstOperand = ((""+(+firstOperand)).slice(0, -1)).split('');
      store.dispatch(setFirstOperand(newFirstOperand));
    }
  }
  dispatchButtonAction(buttonPressed) {
    switch(buttonPressed) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case ".":
        this.appendOperand(buttonPressed);
        break;
      case "%":
        this.calculatePercent();
        break;
      case "+":
      case "-":
      case "x":
      case "/":
        this.addOperator(buttonPressed);
        break;
      case "=":
        this.calculateByEqual();
        break;
      case "AC":
        this.clearAll();
        break;
      case "<=":
        this.removeLastElement();
        break;
      default:
        break;
    }
  }
  render() {
    return (
      <button
        id={this.props.buttonId}
        type="button"
        value={this.props.buttonText}
        onClick={this.dispatchButtonAction.bind(this, this.props.buttonText)}
        >
        {this.props.buttonText}
      </button>
    );
  }
}

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <div className="calc">
          <DisplayArea />
          <ButtonGroup />
        </div>
      </div>
    );
  }
}

export default App;
