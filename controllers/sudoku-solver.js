class SudokuSolver {

  validate(puzzleString) {
    const regex = /^[\d.]+$/i
    const validChars = !!puzzleString.match(regex)
    if (!validChars) { return { error: 'char'}}
    if (puzzleString.length !== 81) {return { error: 'length' }}
    
    const checkedValues = puzzleString.split('').map( (value, i) => {
      if (value == '.') { return true}
      const column            = this.getColumn(i)
      const row               = this.getRow(i)
      const tempPuzzleString  = puzzleString.substring(0, i) + "." + puzzleString.substring(i + 1)
      
      if (!this.checkRowPlacement(tempPuzzleString, row, column, value))    { return false }
      if (!this.checkColPlacement(tempPuzzleString, row, column, value))    { return false }
      if (!this.checkRegionPlacement(tempPuzzleString, row, column, value)) { return false }
      return true
    })
    
    if (checkedValues.includes(false)) { return false }

    return true
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const puzzleRowValues     = getRowAsArrayFromPuzzleString(puzzleString, row)
    return !puzzleRowValues.includes(value.toString())
  }

  checkColPlacement(puzzleString, row, column, value) {
    const puzzleColValues     = getColAsArrayFromPuzzleString(puzzleString, row, column)
    return !puzzleColValues.includes(value.toString())
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzleRegionValues  = getRegionAsArrayFromPuzzleString(puzzleString, row, column)
    return !puzzleRegionValues.includes(value.toString())
  }

  solve(puzzleString) {
    //
    const valueArray = [1,2,3,4,5,6,7,8,9]
    const solvingPuzzleArrayAfter = puzzleString.split('')
    const solvedPuzzleRegex = /^[\d]{81}$/i
    const solvedNumbers= {}
    let keepGoing = true

    let puzzleStringChangedThisLoop = false
    let puzzleIsSolved = false

    let loopCount = 0
    
    const timer = new Date()
    do {
      loopCount++
      const solvingPuzzleArrayBefore = [...solvingPuzzleArrayAfter]
      solvingPuzzleArrayBefore.forEach( (value, index) => {
        const possibleDigits = []

        if(value != ".") {return }
        // solvingTheDot()
        possibleDigits.push(...valueArray.map((v) => {
          return canNumberBePlacedInCoordinate(solvingPuzzleArrayAfter.join(''), v, index)
        }))

        if ( possibleDigits.filter(bool => bool == true).length > 1) {return false}
        const myNumber = possibleDigits.findIndex(bool => bool == true) + 1 // for Debug can be shortened
        solvedNumbers[Object.keys(solvedNumbers).length] = {coordinate: getCoordinate(index), value: myNumber, loopCount}
        solvingPuzzleArrayAfter[index] = myNumber.toString()
      })
      const puzzleStringToCheck = solvingPuzzleArrayAfter.join('')
      puzzleIsSolved = !!puzzleStringToCheck.match(solvedPuzzleRegex) // for Debug can be shortened
      if (Object.keys(solvedNumbers).length > 0) {
        puzzleStringChangedThisLoop = solvedNumbers[Object.keys(solvedNumbers).length-1].loopCount == loopCount
      }
      keepGoing = !puzzleIsSolved && puzzleStringChangedThisLoop && Date.now() - timer <= 200

    } while ( keepGoing );

      //console.log(Date.now() - timer);
      if (!!solvingPuzzleArrayAfter.join('').match(solvedPuzzleRegex)) {return solvingPuzzleArrayAfter.join('')}
      return 'error'
    
  }
  getRow(index) {
    return Math.floor(index / 9) + 1
  }
  
  getColumn(index) {
    return (index % 9 ) + 1
  }

  generateASudoku() {
    let puzzle = ".".repeat(81).split('')
    let puzzleIncomplete = true
    let validPosition = false
    let keepGoing = true
    let timer = new Date()
    let numDots = 0

    do {
      if ( numDots == 40) { 
        puzzle = [] 
        puzzle = ".".repeat(81).split('')
      }
      validPosition = false
  
      const randomValue     = Math.floor(Math.random() * 9 + 1)
      const randomIndex  = Math.floor(Math.random() * 81) - 1
  
      if (puzzle[randomIndex] == '.') {
        const row = this.getRow(randomIndex)
        const column = this.getColumn(randomIndex)
  
        this.checkColPlacement(puzzle.join(''), row, column, randomValue )        ? validPosition = true : validPosition = false
        if(validPosition == true) 
          { this.checkRowPlacement(puzzle.join(''), row, column, randomValue )    ? validPosition = true : validPosition = false }
        if(validPosition == true) 
          { this.checkRegionPlacement(puzzle.join(''), row, column, randomValue ) ? validPosition = true : validPosition = false }
        if(validPosition == true)
          { 
            puzzle[randomIndex] = randomValue
            puzzleIncomplete = this.solve(puzzle.join('')) == 'error'
          }
    }
      numDots = puzzle.filter( v => v == '.').length
      keepGoing = puzzleIncomplete && Date.now() - timer < 1000 && numDots < 40
    } while (puzzleIncomplete)
    let goodPuzzle = false    
    

    const newPuzzle = puzzle.join('')
    const validPuzzle = solver.validate(newPuzzle)

    return validPuzzle ? newPuzzle : false
  }
}

const solver = new SudokuSolver()

function getCoordinate(index) {
  const row     = String.fromCharCode(solver.getRow(index) + 64)
  const column  = solver.getColumn(index)
  return row + column
}
function canNumberBePlacedInCoordinate(puzzle, v, index) {
  const row     = solver.getRow(index)
  const column  = solver.getColumn(index)
  if (!solver.checkColPlacement(puzzle, row, column, v))     {return false}
  if (!solver.checkRegionPlacement(puzzle, row, column, v))  {return false}
  if (!solver.checkRowPlacement(puzzle, row, column, v))     {return false}
  return true
}



function getRowAsArrayFromPuzzleString(puzzleString, row) {
  return puzzleString.split('', row * 9).slice(-9)
}

function getColAsArrayFromPuzzleString(puzzleString, row, col) {
  return puzzleString.split('').filter( (val, i) => {
     return (i + 1) % 9 ==  col 
  })
} 


function getRegionAsArrayFromPuzzleString(puzzleString, row, column) {
  const regionColHelper = ( Math.floor((column - 1) / 3))
  const regionRowHelper = ( Math.floor((row - 1)  / 3) * 3 )
  const region = regionColHelper + regionRowHelper // Region [0,1,2,3,4,5,6,7,8]
  return puzzleString.split('').filter( (val, i) => { 
    const iColHelper = Math.floor((i - ( Math.floor(i / 9) * 9 )) / 3)
    const iRowHelper = Math.floor(i / (9 * 3))
    return region == (iColHelper + (iRowHelper * 3) )
  })
}

function isValueOfCoordinateAllowed(puzzleString, row, column) {
  const stringPositionOfCoordinate = (column - 1) + (row - 1) * 9
  return puzzleString.charAt(stringPositionOfCoordinate) == "."
}
module.exports = SudokuSolver
