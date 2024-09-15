import React from "react"
import "./App.css"
import { Navbar } from "./layouts/Navbar"
import { Footer } from "./layouts/Footer"
import { HomePage } from "./layouts/homePage/HomePage"
import { SearchBooksPage } from "./layouts/searchBooksPage/SearchBooksPage"

export const App = () => {
  return (
    <>
      <Navbar />
      {/* <HomePage /> */}
      <SearchBooksPage />
      <Footer />
    </>
  )
}
