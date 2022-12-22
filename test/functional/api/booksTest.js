const chai = require('chai');
const server = require("../../../index");
const chaiHttp =  require("chai-http")
const should = chai.should();

chai.use(chaiHttp)
 
describe('/GET book', () => {
    it('it should GET all the books', done => {
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
    it('It should POST one book', done => {
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
