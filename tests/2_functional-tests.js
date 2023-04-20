const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzles = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
const expect = chai.expect

chai.use(chaiHttp);

const puzzleStringBadChar        = '1,5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3.7'
const puzzleStringNotSolvable    = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.377'
const puzzleStringTooShort       = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'


suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: puzzles[0][0]})
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body)
                    .to.have.property('solution', puzzles[0][1])
                done()
            })
    })

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: ""})
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body)
                    .to.have.property('error', 'Required field missing')
                done()
            })
        })           

            
    test(`Solve a puzzle with invalid characters: POST request to /api/solve
    `, (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: puzzleStringBadChar})
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body)
                    .to.have.property('error', 'Invalid characters in puzzle')
                done()
            }) 
        })           


    test(`Solve a puzzle with incorrect length: POST request to /api/solve' }`, (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: puzzleStringTooShort})
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body)
                    .to.have.property('error', 'Expected puzzle to be 81 characters long')
                done()
            })
        })  
        
    test(`Solve a puzzle that cannot be solved: POST request to /api/solve' }`, (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: puzzleStringNotSolvable})
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body)
                    .to.have.property('error', 'Puzzle cannot be solved')
                done()
            })
        })
        
    test(`Check a puzzle placement with all fields: POST request to /api/check`, (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({puzzle: puzzles[0][0], coordinate: "A2", value: "3" })
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                done()
            })
        }) 

    test(`Check a puzzle placement with single placement conflict: POST request to /api/check`, (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzles[0][0], coordinate: "E4", value: "4"})
        .end((err, res) => {
            expect(res.status).to.be.equal(200)
            expect(res.body)
                .to.have.haveOwnProperty('valid', false)
            expect(res.body)
                .to.have.deep.property('conflict', ['row'])
            done()
            })             
        }) 

    test(`Check a puzzle placement with multiple placement conflicts: POST request to /api/check`, (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzles[0][0], coordinate: "B1", value: "6"})
        .end((err, res) => {
            expect(res.status).to.be.equal(200)
            expect(res.body)
                .to.have.haveOwnProperty('valid', false)
            expect(res.body)
                .to.have.deep.property('conflict', ['row', 'region'])
            done()
            })             
        }) 

    test(`Check a puzzle placement with all placement conflicts: POST request to /api/check`, (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzles[0][0], coordinate: "A5", value: "1"})
        .end((err, res) => {
            expect(res.status).to.be.equal(200)
            expect(res.body)
                .to.have.haveOwnProperty('valid', false)
            expect(res.body)
                .to.have.deep.property('conflict', ['column', 'row', 'region'])
            done()
            })             
        }) 

    test(`Check a puzzle placement with missing required fields: POST request to /api/check`, (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzles[0][0], coordinate: "A5", value: ""})
        .end((err, res) => {
            expect(res.status).to.be.equal(200)
            expect(res.body)
                .to.have.property('error', 'Required field(s) missing')
            done()
            })             
        })

    test(`Check a puzzle placement with invalid characters: POST request to /api/check`, (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzleStringBadChar, coordinate: "A5", value: "1"})
        .end((err, res) => {
            expect(res.status).to.be.equal(200)
            expect(res.body)
                .to.have.property('error', 'Invalid characters in puzzle')
            done()
            })         
        })

    test(`Check a puzzle placement with incorrect length: POST request to /api/check`, (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzleStringTooShort, coordinate: "A5", value: "1"})
        .end((err, res) => {
            expect(res.status).to.be.equal(200)
            expect(res.body)
                .to.have.property('error', 'Expected puzzle to be 81 characters long')
            done()
            })         
        })

    test(`Check a puzzle placement with invalid placement coordinate: POST request to /api/check`, (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzles[0][0], coordinate: "Z5", value: "1"})
        .end((err, res) => {
            expect(res.status).to.be.equal(200)
            expect(res.body)
                .to.have.property('error', 'Invalid coordinate')
                
                chai
                .request(server)
                .post('/api/check')
                .send({puzzle: puzzles[0][0], coordinate: "A11", value: "1"})
                .end((err, res) => {
                    expect(res.status).to.be.equal(200)
                    expect(res.body)
                    .to.have.property('error', 'Invalid coordinate')

                    chai
                    .request(server)
                    .post('/api/check')
                    .send({puzzle: puzzles[0][0], coordinate: "A0", value: "1"})
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200)
                        expect(res.body)
                            .to.have.property('error', 'Invalid coordinate')

                            chai
                            .request(server)
                            .post('/api/check')
                            .send({puzzle: puzzles[0][0], coordinate: "AA1", value: "1"})
                            .end((err, res) => {
                                expect(res.status).to.be.equal(200)
                                expect(res.body)
                                    .to.have.property('error', 'Invalid coordinate')
                                done()
                                }) 
                    })
                }) 
            })   
        })

        test(`Check a puzzle placement with invalid placement value: POST request to /api/check`, (done) => {
            chai
            .request(server)
            .post('/api/check')
            .send({puzzle: puzzles[0][0], coordinate: "A5", value: "d"})
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body)
                    .to.have.property('error', 'Invalid value')
                    
                    chai
                    .request(server)
                    .post('/api/check')
                    .send({puzzle: puzzles[0][0], coordinate: "A5", value: "10"})
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200)
                        expect(res.body)
                            .to.have.property('error', 'Invalid value')
                            
                            chai
                            .request(server)
                            .post('/api/check')
                            .send({puzzle: puzzles[0][0], coordinate: "A5", value: "0"})
                            .end((err, res) => {
                                expect(res.status).to.be.equal(200)
                                expect(res.body)
                                    .to.have.property('error', 'Invalid value')
                                })
                            done()
                        })
                })
        })
    
/*           
    Waiting: 
    Waiting: If value submitted to /api/check is already placed in puzzle on that coordinate, the returned value will be an object containing a valid property with true if value is not conflicting.
    Waiting: If the puzzle submitted to /api/check contains values which are not numbers or periods, the returned value will be { error: 'Invalid characters in puzzle' }
    Waiting: If the puzzle submitted to /api/check is greater or less than 81 characters, the returned value will be { error: 'Expected puzzle to be 81 characters long' }
    Waiting: If the object submitted to /api/check is missing puzzle, coordinate or value, the returned value will be { error: 'Required field(s) missing' }
    Waiting: If the coordinate submitted to api/check does not point to an existing grid cell, the returned value will be { error: 'Invalid coordinate'}
    Waiting: If the value submitted to /api/check is not a number between 1 and 9, the returned value will be { error: 'Invalid value' } */
});

