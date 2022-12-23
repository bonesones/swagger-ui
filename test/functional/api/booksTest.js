const chai = require('chai');
const server = require("../../../index");
const chaiHttp =  require("chai-http");
const { resetWatchers } = require('nodemon/lib/monitor/watch');
const should = chai.should();

chai.use(chaiHttp)
 
describe('/GET book', () => {
    it('should GET all the books', done => {
        chai.request(server)
            .get("/api/book")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    })
})

describe('/POST book', () => {
    it('should POST one book', done => {
        const book = {
          name: "Celebration",
          giveDate: "27.09.2022",
          backDate: "08.01.2023",
          author: "Любомир Федотов",
          tags: [
            "Научная фантастика",
            "Ужасы",
            "Приключения",
            "Романтика",
            "Фантастика"
          ],
          year: 1994
        };

        chai.request(server)
            .post('/api/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property("success").eql(true);
                done();
            })
    })
});

describe("/GET book :id", () => {
    it('should GET book by id', done => {
        chai.request(server)
            .get('/api/book/3')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                res.body.book.should.have.property('id').eql(3);
                done();

            })
    })
})

describe("/PUT book :id", () => {
    const book = {
        name: "Take a Bow",
        giveDate: "01.06.2022",
        backDate: "30.06.2023",
        author: "Прокл Лыткин",
    }
    it('should update book by PUT', done => {
        chai.request(server)
            .put('/api/book/3')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql("book has been edited")
                done()
            })
    })
})


