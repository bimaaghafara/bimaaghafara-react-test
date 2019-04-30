import React, { Component } from 'react';
import { render } from 'react-dom';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seatsInput: "[ [3,2], [4,3], [2,3], [3,4] ]",
      sumPassengers: 0,
      groups: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const id = event.target.id;
    const value = event.target.value;
    this.setState({[id]: value}, () => {
      // for debugging only, try to change total passengers field
      if (id === 'sumPassengers') {
        this.generateOutput();
      }
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
      this.setState({groups: groups});
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
    let colOffset = 0;
    return groups.map((group, groupIndex) => {
      let seats = [];
      const sumCol = group[0];
      const sumRow = group[1];
      if (groupIndex > 0) {
        colOffset += groups[groupIndex-1][0];
      }
      for (let row=0; row<sumRow; row++) {
        for (let col=0; col<sumCol; col++) {
          seats.push({
            row: row,
            col: col,
            type: this.identifySeatType(groupIndex, groups.length, col, sumCol)
          }) 
        }
      }
      return {
        colOffset: colOffset,
        sumCol: sumCol,
        sumRow: sumRow,
        seats: seats
      };
    });
  }

  generateOutput = () => {
    this.setState({
      groups: this.createGroups(this.state.seatsInput)
    }, () => {
      this.identifyPassengersNumber(this.state.groups, this.state.sumPassengers);
    })
  }

  componentWillMount() {
    this.generateOutput();
  }

  render() {
    return (
      <div className="container">

        <div className="form-group">
          <label>Seats Input</label>
          <input type="text" className="form-control" id="seatsInput" value={this.state.seatsInput} onChange={this.handleInputChange} />
        </div>

        <div className="form-group">
          <label>Total Passengers</label>
          <input type="number" min="0" className="form-control" id="sumPassengers" value={this.state.sumPassengers} onChange={this.handleInputChange} />
        </div>

        <div className="form-group">
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
