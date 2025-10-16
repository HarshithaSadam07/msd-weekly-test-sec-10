const express = require('express');
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "8 seasons", available: true },
  { id: 2, title: "don't you love anymore", available: true },
  { id: 3, title: "2024", available: false },
  { id: 4, title: "The Universe", available: false },
  { id: 5, title: "Stranger things", available: true },
  { id: 6, title: "Beyond you", available: true },
];

let users = [
  { id: 1, name: "Harshitha", borrowed: [] },
  { id: 2, name: "Varshitha", borrowed: [] },
  { id: 3, name: "Jaswika", borrowed: [] },
  { id: 4, name: "Denisha", borrowed: [] },
  { id: 5, name: "Umadevi", borrowed: [] },
  { id: 6, name: "Kavya", borrowed: [] }
];

app.get('/', (req, res) => {
  res.send('Welcome to the Library API! Visit <a href="/books">/books</a> to see all books.');
});

app.get('/books', (req, res) => {
  let html = '<h1>Library Books</h1><ul>';

  books.forEach(book => {
    let status = 'Available';
    if (!book.available) {
      const borrower = users.find(u => u.borrowed.includes(book.id));
      if (borrower) status = `Borrowed by ${borrower.name}`;
      else status = 'Not Available';
    }

    html += `<li>
      <strong>${book.title}</strong> - ${status}
    </li>`;
  });

  html += '</ul>';
  res.send(html);
});

app.post('/users/:uid/borrow/:bid', (req, res) => {
  const user = users.find(u => u.id == req.params.uid);
  const book = books.find(b => b.id == req.params.bid);
  if (!user || !book) return res.status(404).json({ msg: "User or book not found" });
  if (!book.available) return res.status(400).json({ msg: "Book already borrowed" });
  book.available = false;
  user.borrowed.push(book.id);
  res.json({ msg: "Book borrowed!", user, book });
});

app.post('/users/:uid/return/:bid', (req, res) => {
  const user = users.find(u => u.id == req.params.uid);
  const book = books.find(b => b.id == req.params.bid);
  if (!user || !book) return res.status(404).json({ msg: "User or book not found" });
  if (!user.borrowed.includes(book.id)) return res.status(400).json({ msg: "Book not borrowed by user" });
  book.available = true;
  user.borrowed = user.borrowed.filter(id => id !== book.id);
  res.json({ msg: "Book returned!", user, book });
});

app.listen(3000, () => console.log("Server running on port 3000"));
