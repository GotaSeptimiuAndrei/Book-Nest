import Book from "./Book"

class ShelfCurrentLoans {
  book: Book
  daysLeft: number

  constructor(book: Book, daysLeft: number) {
    this.book = book
    this.daysLeft = daysLeft
  }
}

export default ShelfCurrentLoans
