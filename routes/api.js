'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  const errMessageMissingPuzzle = { error: 'Required field missing' }
  const errMessageMissingFields = { error: 'Required field(s) missing' }
  const errMessageBadChars      = { error: 'Invalid characters in puzzle' }
  const errMessageBadLength     = { error: 'Expected puzzle to be 81 characters long' }
  const errMessageUnsolvalbe    = { error: 'Puzzle cannot be solved' }
  const errMessageBadValue      = { error: 'Invalid value' }
  const errMessageBadCoordinate = { error: 'Invalid coordinate' }
  const validFalse              = { valid: 'false' }
  const validTrue               = { valid: 'true' }
  const unexpectedError         = { error: 'unexpected error in solve.validate()' }

  

  app.route('/api/check')
    .post((req, res) => {
      const puzzleString  = req.body.puzzle
      const coordinate    = req.body.coordinate
      const value         = req.body.value
      if (  coordinate    === "" |
            value         === "" |
            puzzleString  === "")
      {
       res.send(errMessageMissingFields) 
       return
      }
      if (!valueIsValid(value)) { 
        res.json(errMessageBadValue) 
        return
      }
      if (!coordinateIsValid(coordinate)) { 
        res.json(errMessageBadCoordinate) 
        return
      }

      const result = solver.validate(puzzleString)

      if (result.error == "char")   { return res.json(errMessageBadChars)}
      if (result.error == "length") { return res.json(errMessageBadLength)}
      if (result       ==  false)   { return res.json(validFalse)}

      const row = getRow(coordinate)
      const column = getCol(coordinate)
      const index = positionInPuzzleString(row, column)
      const newPuzzleString = puzzleString.substring(0, index ) + '.' + puzzleString.substring(index + 1)
      const goodColPlacement    = solver.checkColPlacement(newPuzzleString, row, column, value)
      const goodRowPlacement    = solver.checkRowPlacement(newPuzzleString, row, column, value)
      const goodRegionPlacement = solver.checkRegionPlacement(newPuzzleString, row, column, value)
      const conflictArray = []
      if ( !goodColPlacement )    { conflictArray.push('column') }
      if ( !goodRowPlacement )    { conflictArray.push('row') }
      if ( !goodRegionPlacement ) { conflictArray.push('region') }

      if( conflictArray.length > 0 ) { return res.json( { valid: false, conflict: conflictArray } )}

      return res.json({ valid: true })
      
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (  req.body.puzzle == "" | !req.body.puzzle)   { return res.json(errMessageMissingPuzzle) }

      const valid = solver.validate(req.body.puzzle)
      if (  valid.error == "char")    { return res.json(errMessageBadChars) }
      if (  valid.error == "length")  { return res.json(errMessageBadLength) }
      if (  valid != true )           { return res.json(errMessageUnsolvalbe) }
      res.json({ solution: solver.solve(req.body.puzzle) })
    });
};

function getCol(coordinate) { // CHECK
  return coordinate.split("").pop().toString()
}

function getRow(coordinate){ // CHECK
    return coordinate.charCodeAt(0) - 64
}

function coordinateIsValid(coordinate) { // CHECK 
  const regex = /^[a-i][1-9]$/i
  return !!coordinate.match(regex)
}

function valueIsValid(value) { // CHECK
  const regex = /^[1-9]$/i
  return !!value.match(regex)
}

function positionInPuzzleString(row, column) {
  return (column - 1) + ((row - 1) * 9)
}
