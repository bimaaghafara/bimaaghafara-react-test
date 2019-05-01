# bimaaghafara-react-test
[You can live preview the App and source code on StackBlitz ⚡️](https://stackblitz.com/edit/bimaaghafara-react-test)

#or if you want to run locally:
1. npm install
2. npm start
3. open in browser: http://localhost:3000/

#App logic:
1. handleInputChange()
   when user type something in input field it will trigger handleInputChange().
2. generateOutput().
   when user click "Generate Output" button, it will trigger generateOutput ().
3. isFormValid()
   inside generateOutput(), isFormValid() will be evaluated, if isFormValid() return true then it will do createGroups(), otherwise it will show error message in UI.
4. createGroups()
   this function will create 'groups' as a wrapper of seats group from left to right.
5. identifySeatType()
   inside createGroups(), identifySeatType() will be evaluated to to identify seat type (window, aisle, or middle) for each seat.
6. identifyPassengersNumber()
   inside identifyPassengersNumber(), each passengerNumber seat will be filled  with number between 1 and sumPassengers.

for detail you can look at ./src/index.js
