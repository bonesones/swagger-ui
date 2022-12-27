const express = require('express');
const { faker } = require('@faker-js/faker/locale/ru')
const jsonfile = require('jsonfile');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid')
const { TokenExpiredError } = jwt;
const dotenv = require('dotenv');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
 
dotenv.config()
process.env.TOKEN_SECRET;

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = [
    {
        username: "test",
        password: 1111,
        refreshToken: uuidv4(),
        expiresIn: undefined
    }
]

const path = './books.json';

const generateAccessToken = function(username) {
    return jwt.sign({username: username}, process.env.TOKEN_SECRET, {expiresIn: "5s"});
}

const checkExpiredToken = function(user) {
    return new Date > user.expiresIn ? true : false;
}

const refreshAccessToken = function(req, res) {
    const { refreshToken: requestToken} = req.body;

    if(requestToken === null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    const refreshToken = users.findIndex(({ refreshToken }) => refreshToken === requestToken);

    if(refreshToken === -1) {
        return res.status(403).json({ message: "Refresh token is not in database!" });
    }

    const isExpired = checkExpiredToken(users[refreshToken]);

    if(isExpired) {
        const newToken = generateAccessToken(users[refreshToken].username);
        users[refreshToken].token = newToken;
        const date = new Date()
        users[refreshToken].expiresIn = date.setSeconds(date.getSeconds() + 40)

        return res.status(200).json({
            message: "token has been updated",
            token: newToken,
        })
    }
}

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                if(err instanceof TokenExpiredError){
                    refreshAccessToken(user[0].refreshToken)
                    return res.sendStatus(401);
                }
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


const createBookData = function(index) {
    const genres = ["Фантастика", "Научная фантастика", "Приключения", "Романтика", "Драма", "Ужасы"]
    return {
        id: index + 1,
        name: faker.music.songName(),
        giveDate: faker.date.past().toLocaleDateString("ru"),
        backDate: faker.date.future().toLocaleDateString("ru"),
        author: faker.name.fullName(),
        tags: faker.helpers.arrayElements(genres),
        year: faker.date.past(30).getFullYear()
    }
}

const books = Array.from({ length: 50 }).map((_, index) => createBookData(index));
jsonfile.writeFileSync(path, books, { spaces: 2 })

app.get('/api/book', authenticateJWT, (req, res) => {
    const books = jsonfile.readFileSync(path);
    
    return res.status(200).json({
        success: true,
        books: books
    })
})

a

app.post('/login', (req, res) => {
    const { username: loginUsername, password: loginPassword } = req.body;
    const user = users.find(({username, password}) => username === loginUsername && password === loginPassword);

    if(user) {
        const accessToken = generateAccessToken(user.username)
        res.json({
            accessToken
        });
    } else {
        res.send('Username or password is incorrect')
    }

})

app.get('/api/book/:id', authenticateJWT, (req, res) => {
    const books = jsonfile.readFileSync(path);
    const book = books.find(({ id }) => id == req.params.id)
    return res.status(200).json({
        success: true,
        book: book
    });
})

app.post('/api/book', authenticateJWT, (req, res) => {
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

app.delete('/api/book/:id', authenticateJWT, (req, res) => {
    const books = jsonfile.readFileSync(path);
    const bookIndex = books.findIndex(({ id }) => id == req.params.id);


    if(bookIndex === -1) {
        res.send('book not found');
        return;
    }

    books.splice(bookIndex, 1);

    jsonfile.writeFileSync(path, books, { spaces: 2 });

    return res.status(200).json({
        success: true,
        message: 'book has been deleted'
    })
})

app.put('/api/book/:id', authenticateJWT, (req, res) => {
    const books = jsonfile.readFileSync(path);
    const bookIndex = books.findIndex(({ id }) => id == req.params.id);


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
    return res.status(200).json({
        status: "success",
        message: "book has been edited"
    })

})

app.listen(port, () => console.log('started'))

module.exports = app