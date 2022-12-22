const express = require('express');
const { faker } = require('@faker-js/faker/locale/ru')
const jsonfile = require('jsonfile');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();
const port = 3500;

const path = './books.json';

const genres = ["Фантастика", "Научная фантастика", "Приключения", "Романтика", "Драма", "Ужасы"]

const createBookData = function() {
    return {
        id: faker.datatype.uuid(),
        name: faker.music.songName(),
        giveDate: faker.date.past().toLocaleDateString("ru"),
        backDate: faker.date.future().toLocaleDateString("ru"),
        author: faker.name.fullName(),
        tags: faker.helpers.arrayElements(genres),
        year: faker.date.past(30).getFullYear()
    }
}

const users = Array.from({ length: 50 }).map(() => createBookData());
jsonfile.writeFileSync(path, users, { spaces: 2 })

app.get('/api/book', (req, res) => {
    const books = jsonfile.readFileSync(path);
    
    return res.status(200).json({
        success: true,
        books: books
    })
})

app.get('/api/book/:id', (req, res) => {
    const books = jsonfile.readFileSync(path);
    const book = books.filter(({ id }) => id === req.params.id );
    res.send(book);
})

app.post('/api/book', urlencodedParser, (req, res) => {
    const books = jsonfile.readFileSync(path);
    const book = {
        id: faker.datatype.uuid(),
        name: req.body.name,
        giveDate: req.body.giveDate,
        backDate: req.body.backDate,
        author: req.body.author,
        tags: req.body.tags?.split(', '),
        year: req.body.year

    }

    books.push(book)

    jsonfile.writeFileSync(path, books, { spaces: 2 });
    
    return res.status(200).json({
        success: true,
        book: book
    });
})

app.delete('/api/book/:id', (req, res) => {
    const books = jsonfile.readFileSync(path);
    const bookIndex = books.findIndex(({ id }) => id === req.params.id);

    if(bookIndex === -1) {
        res.send('book not found');
        return;
    }

    books.splice(bookIndex, 1);

    jsonfile.writeFileSync(path, books, { spaces: 2 });

    res.send('book has been deleted');
})

app.put('/api/book/:id', urlencodedParser, (req, res) => {
    const books = jsonfile.readFileSync(path);
    const bookIndex = books.findIndex(({ id }) => id === req.params.id);

    if(bookIndex === -1) {
        res.send('book not found');
        return;
    }

    const targetBook = books[bookIndex];

    books[bookIndex] = {
        id: targetBook.id,
        name: req.body.name ?? targetBook.name,
        giveDate: req.body.giveDate ?? targetBook.giveDate,
        backDate: req.body.backDate ?? targetBook.backDate,
        author: req.body.author ?? targetBook.author,
        tags: req.body.tags?.split(', ') ?? targetBook.tags,
        year: req.body.year ?? targetBook.year
    }

    jsonfile.writeFileSync(path, books, { spaces: 2 });
    res.send("Book has been edited");

})

app.listen(port, () => console.log('started'))

module.exports = app