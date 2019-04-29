import React, { Component } from 'react';
import { render } from 'react-dom';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seatsInput: "[[3,2], [4,3], [2,3], [3,4]]",
      groups: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const id = event.target.id;
    const value = event.target.value;
    this.setState({[id]: value});
  }

  createGroups = (seatsInput) => {
    return JSON.parse(seatsInput).map((group) => {
      let seats = [];
      const col = group[0];
      const row = group[1];
      for (let r=0; r<row; r++) {
        for (let c=0; c<col; c++) {
          seats.push({row:r, col:c}) 
        }
      }
      return {
        col: col,
        row: row,
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
      <div class="container">

        <div className="form-group">
          <label>Seats Input</label>
          <input type="text" className="form-control" id="seatsInput" value={this.state.seatsInput} onChange={this.handleInputChange} />
        </div>

        <div className="form-group">
          <button onClick={() => this.calculate()} class="btn btn-success">Calculate</button>
        </div>

        {this.state.groups.map((group, groupIndex) =>
          <div class="group">
            <div>Group {groupIndex}</div>
            <br></br>
            {group.seats.map((seat, seatIndex) =>
              <div className={seatIndex % group.col === 0 ? 'seat clearfix' : 'seat'}>x</div>
            )}
          </div>
        )}

      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
