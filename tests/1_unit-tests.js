const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const Solver = require('../controllers/sudoku-solver.js');
const { Test } = require('mocha');
let solver = new Solver
const puzzles = require('../controllers/puzzle-strings.js').puzzlesAndSolutions

const inputValidator = require('../routes/api.js')

// Test Values
const puzzleStringGood          = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const puzzleStringBad           = '1,5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const puzzleStringTooShort      = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....92691'
const coordinateGood            = 'C5'
const puzzleStringUnsolvable    = '1.1..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'


suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        assert.isTrue(solver.validate(puzzleStringGood))
    })
    
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        assert.propertyVal(solver.validate(puzzleStringBad), 'error', 'char')
    })

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        assert.propertyVal(solver.validate(puzzleStringTooShort), 'error', 'length')
    })

    test('Logic handles a valid row placement', () => {
        assert.isTrue(solver.checkRowPlacement(puzzleStringGood, 2, 2, 4))
    })

    test('Logic handles an invalid row placement', () => {
        assert.isFalse(solver.checkRowPlacement(puzzleStringGood, 2, 2, 6))
    })

    test('Logic handles a valid column placement', () => {
        assert.isTrue(solver.checkColPlacement(puzzleStringGood, 9, 6, 5))
    })

    test('Logic handles an invalid column placement', () => {
        assert.isFalse(solver.checkColPlacement(puzzleStringGood, 9, 6, 8))
    })
    
    test('Logic handles a valid region (3x3 grid) placement', () => {
        assert.isTrue(solver.checkRegionPlacement(puzzleStringGood, 8, 2, 8))
    })

    test('Logic handles an invalid region (3x3 grid) placement', () => {
        assert.isFalse(solver.checkRegionPlacement(puzzleStringGood, 8, 2, 6))
    })

    test('Valid puzzle strings pass the solver', () => {
        assert.isTrue(solver.validate(puzzleStringGood))
    })

    test('Invalid puzzle strings pass the solver', () => {
        assert.isFalse(solver.validate(puzzleStringUnsolvable))
    })

    test('Solver returns the expected solution for an incomplete puzzle', () => {
        assert.equal(solver.solve(puzzles[0][0]), puzzles[0][1])
        assert.equal(solver.solve(puzzles[1][0]), puzzles[1][1])
        assert.equal(solver.solve(puzzles[2][0]), puzzles[2][1])
        assert.equal(solver.solve(puzzles[3][0]), puzzles[3][1])
        assert.equal(solver.solve(puzzles[4][0]), puzzles[4][1])
    })
});