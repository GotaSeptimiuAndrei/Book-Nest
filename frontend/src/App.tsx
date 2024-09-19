import "./App.css"
import { Navbar } from "./layouts/Navbar"
import { Footer } from "./layouts/Footer"
import { HomePage } from "./layouts/homePage/HomePage"
import { SearchBooksPage } from "./layouts/searchBooksPage/SearchBooksPage"
import { Redirect, Route, Switch, useHistory } from "react-router-dom"
import { BookCheckoutPage } from "./layouts/bookCheckoutPage/BookCheckoutPage"
import { oktaConfig } from "./lib/oktaConfig"
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js"
import { Security, LoginCallback, SecureRoute } from "@okta/okta-react"
import LoginWidget from "./auth/LoginWidget"
import { ReviewListPage } from "./layouts/bookCheckoutPage/reviewListPage/ReviewListPage"
import { ShelfPage } from "./layouts/shelfPage/ShelfPage"
import { MessagesPage } from "./layouts/messagesPage/MessagesPage"

const oktaAuth = new OktaAuth(oktaConfig)

export const App = () => {
  const customAuthHandler = () => {
    history.push("/login")
  }

  const history = useHistory()

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin))
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Security
        oktaAuth={oktaAuth}
        restoreOriginalUri={restoreOriginalUri}
        onAuthRequired={customAuthHandler}
      >
        <Navbar />
        <div className="flex-grow-1">
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>

            <Route path="/home" component={HomePage} />

            <Route path="/search" component={SearchBooksPage} />

            <Route path="/reviewlist/:bookId" component={ReviewListPage} />

            <Route path="/checkout/:bookId" component={BookCheckoutPage} />

            <Route
              path="/login"
              render={() => <LoginWidget config={oktaConfig} />}
            />

            <Route path="/login/callback" component={LoginCallback} />

            <SecureRoute path="/shelf" component={ShelfPage} />

            <SecureRoute path="/messages" component={MessagesPage} />
          </Switch>
        </div>

        <Footer />
      </Security>
    </div>
  )
}
