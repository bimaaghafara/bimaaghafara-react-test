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
      groups: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const id = event.target.id;
    const value = event.target.value;
    this.setState({[id]: value});
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
            type: this.identifySeatType(groupIndex, groups.length, col, sumCol)
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

  calculate = () => {
    this.setState({
      groups: this.createGroups(this.state.seatsInput)
    })
  }

  render() {
    return (
      <div className="container">

        <div className="form-group">
          <label>Seats Input</label>
          <input type="text" className="form-control" id="seatsInput" value={this.state.seatsInput} onChange={this.handleInputChange} />
        </div>

        <div className="form-group">
          <button onClick={() => this.calculate()} className="btn btn-success">Calculate</button>
        </div>

        {this.state.groups.map((group, groupIndex) =>
          <div key={`group-${groupIndex}`} className="group">
            <div>Group {groupIndex}</div>
            <br></br>
            {group.seats.map((seat, seatIndex) =>
              <div key={`seat-${seatIndex}`} className={`seat ${seatIndex%group.sumCol===0 ? 'clearfix' : ''} ${seat.type}`}>x</div>
            )}
          </div>
        )}

      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
