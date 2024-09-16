import React from "react"
import "./App.css"
import { Navbar } from "./layouts/Navbar"
import { Footer } from "./layouts/Footer"
import { HomePage } from "./layouts/homePage/HomePage"
import { SearchBooksPage } from "./layouts/searchBooksPage/SearchBooksPage"
import { Redirect, Route, Switch } from "react-router-dom"
import { BookCheckoutPage } from "./layouts/bookCheckoutPage/BookCheckoutPage"

export const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home" />
          </Route>

          <Route path="/home" component={HomePage} />

          <Route path="/search" component={SearchBooksPage} />

          <Route path="/checkout/:bookId" component={BookCheckoutPage} />
        </Switch>
      </div>

      <Footer />
    </div>
  )
}
