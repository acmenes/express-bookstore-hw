/* Integration tests for books */

process.env.NODE_ENV = "test"

const request = require("supertest");

const app = require("../app")
const db = require("../db")

//isbn sample book
let book_isbn;

beforeEach(async () => {
    let result = await db.query(`
    INSERT INTO books
    isbn, amazon_url, author, language, pages, publisher, title, year)
    VALUES (
        '11111111',
        'https://amazon.com/testbook',
        'Me I am the author',
        'english',
        '500',
        'I published it',
        'My book',
        '2021')
        RETURNING isbn`);

    book_isbn = result.rows[0].isbn;
});

describe("POST /books", async function (){
    const response = await request(app)
    .post(`/books`)
    .send({
        isbn: '11111111',
        amazon_url: "https://amazon.com/testbook",
        author: "me",
        language: "english",
        pages: 500,
        publisher: "me",
        title: "my book",
        year: 2021
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.book).toHaveProperty("isbn");
});

describe("PUT /books/:id", async function() {
    test("no incorrect updates", async function(){
        const response = await request(app)
        .put(`/books/${book_isbn}`)
        .send({
          isbn: '11111111',
          badField: "DO NOT ADD ME!",
          amazon_url: "https://no.com",
          author: "bad update",
          language: "english",
          pages: 1000,
          publisher: "no",
          title: "bad",
          year: 2021
        });
    expect(response.statusCode).toBe(400);
    })
})

