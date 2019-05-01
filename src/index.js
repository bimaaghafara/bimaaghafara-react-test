import React, { Component } from 'react';
import { render } from 'react-dom';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seatsInput: "[ [3,2], [4,3], [2,3], [3,4] ]",
      seatsInputValidity: true,
      seatsInputErrorMessage: '',
      sumPassengers: 30,
      sumPassengersValidity: true,
      sumPassengersErrorMessage: '',
      showErrors: false,
      groups: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const id = event.target.id;
    const value = event.target.value;
    this.setState({
      [id]: value,
      [id + 'Validity']: true
    });
  }

  identifyPassengersNumber(groups, sumPassengers) {
    const maxRow = Math.max.apply(null, groups.map(el => el.sumRow));
    let passengerNumber = 1;
    const iterateBySeatType = (seatType) => {
      for (let row=0; row<maxRow; row++) {
        if (passengerNumber > sumPassengers) {break}
        for (let groupIndex=0; groupIndex<groups.length; groupIndex++) {
          if (passengerNumber > sumPassengers) {break}
          const group = groups[groupIndex];
          if (row < group.sumRow) {
            for (let col=0; col<group.sumCol; col++){
              if (passengerNumber > sumPassengers) {break}
              const seatIndex = group.seats.findIndex(seat => seat.row===row && seat.col===col);
              const seat = group.seats[seatIndex];
              if (seat.type === seatType) {
                seat.passengerNumber = passengerNumber;
                passengerNumber++;
              }
            }
          }
        };
      }
    }
    iterateBySeatType('aisle');
    iterateBySeatType('window');
    iterateBySeatType('middle');
    setTimeout(() => {
      this.setState({groups: groups}, () => {
        // you can inspect this.state.groups after successfully generate output
        // this code will print this.state.groups in console
        console.clear();
        console.log(this.state.groups);
      });
    }, 100)
  }

  identifySeatType(groupIndex, groupLength, colIndex, groupSumCol) {
    const isLeftWindow = groupIndex===0 && colIndex===0;
    const isRightWindow = groupIndex===groupLength-1 && colIndex===groupSumCol-1;
    const isFirstColInGroup = colIndex===0;
    const isLastColInGroup = colIndex===groupSumCol-1;
    if (isLeftWindow || isRightWindow) {
      return 'window'
    } if (isFirstColInGroup || isLastColInGroup) {
      return 'aisle'
    } else {
      return 'middle'
    }
  
  }

  createGroups = (seatsInput) => {
    const groups = JSON.parse(seatsInput);
    return groups.map((group, groupIndex) => {
      let seats = [];
      const sumCol = group[0];
      const sumRow = group[1];
      for (let row=0; row<sumRow; row++) {
        for (let col=0; col<sumCol; col++) {
          seats.push({
            row: row,
            col: col,
            type: this.identifySeatType(groupIndex, groups.length, col, sumCol),
            passengerNumber: null
          }) 
        }
      }
      return {
        sumCol: sumCol,
        sumRow: sumRow,
        seats: seats
      };
    });
  }

  generateOutput = () => {
    this.setState({groups: []});
    if (this.isFormValid()) {
      this.setState({
        groups: this.createGroups(this.state.seatsInput)
      }, () => {
        this.identifyPassengersNumber(this.state.groups, this.state.sumPassengers);
      })
    } else {
      this.setState({showErrors: true});
    }
  }

  isAllChildIsArray(array) {
    let _return = true;
    array.forEach(child => _return = _return && Array.isArray(child));
    return _return;
  }

  isFormValid() {
    let seatsInput;
    let sumPassengersValidity = true;
    let seatsInputValidity = true;
    let maxPassengers = 0;
    let seatsInputErrorMessage;
    let sumPassengersErrorMessage;

    // validate seatsInput
    try {
      seatsInput = JSON.parse(this.state.seatsInput);
      if (!Array.isArray(seatsInput)) {
        seatsInputValidity = false;
      } else {
        seatsInput.forEach(child => {
          seatsInputValidity = seatsInputValidity && Array.isArray(child) && child.length === 2 && child[0]>0 && child[1]>0;
        });
      }
      seatsInputErrorMessage = seatsInputValidity? '' : 'Please enter valid 2D array with positive number only! For example: \n- [ [2,5] ]  \n- [ [3,2], [4,2] ]  \n- [ [4,2], [2,3], [5,6] ] \n- etc...';
    } catch (error) {
      seatsInputValidity = false;
      seatsInputErrorMessage = error.message;
    }

    // validate sumPassengers when seatsInput is valid
    if (seatsInputValidity) {
      if (this.state.sumPassengers > 0) {
        seatsInput.forEach(group => maxPassengers += group[0]*group[1]);
        sumPassengersValidity = this.state.sumPassengers > maxPassengers? false : true;
        sumPassengersErrorMessage = sumPassengersValidity? '' : `Based on your seats input, maximum passengers is ${maxPassengers}!`;
      } else {
        sumPassengersValidity = false;
        sumPassengersErrorMessage = 'Passengers number must be greater than zero!'
      }
    }

    // update state
    this.setState({
      seatsInputValidity: seatsInputValidity,
      seatsInputErrorMessage: seatsInputErrorMessage,
      sumPassengersValidity: sumPassengersValidity,
      sumPassengersErrorMessage: sumPassengersErrorMessage
    });

    // result of form validity
    return seatsInputValidity && sumPassengersValidity;
  }

  render() {
    return (
      <div className="container">

        <h2 className="page-title">Airplane Seating Algorithm</h2>

        <div className="form-group">
          <label>Seats Input</label>
          <input type="text" className="form-control" id="seatsInput" value={this.state.seatsInput} onChange={this.handleInputChange} />
          {(this.state.showErrors && !this.state.seatsInputValidity) &&
            <div className="error-message">   
              Error: {this.state.seatsInputErrorMessage}
            </div>
          }
        </div>

        <div className="form-group">
          <label>Total Passengers</label>
          <input type="number" min="1" className="form-control" id="sumPassengers" value={this.state.sumPassengers} onChange={this.handleInputChange} />
          {(this.state.showErrors && !this.state.sumPassengersValidity) &&
            <div className="error-message">
              Error: {this.state.sumPassengersErrorMessage}
            </div>
          }
        </div>

        <div className="generate-output-wrapper">
          <button onClick={() => this.generateOutput()} className="btn btn-success">Generate Output</button>
        </div>

        <div className="group-wrapper">
          {this.state.groups.map((group, groupIndex) =>
            <div key={`group-${groupIndex}`} className="group">
              <div className="title">Group {groupIndex}</div>
              {group.seats.map((seat, seatIndex) =>
                <div key={`seat-${seatIndex}`} className={`seat ${seatIndex%group.sumCol===0 ? 'clearfix' : ''} ${seat.type}`}>
                  {seat.passengerNumber}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
