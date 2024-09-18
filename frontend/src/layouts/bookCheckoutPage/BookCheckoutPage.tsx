import { useEffect, useState } from "react"
import Book from "../../models/Book"
import { SpinnerLoading } from "../utils/SpinnerLoading"
import { StarsReview } from "../utils/StarsReview"
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox"
import ReviewModel from "../../models/ReviewModel"
import { LatestReviews } from "./LatestReviews"
import { useOktaAuth } from "@okta/okta-react"
import ReviewRequestModel from "../../models/ReviewRequestModel"

export const BookCheckoutPage = () => {
  const { authState } = useOktaAuth()

  const [book, setBook] = useState<Book>()
  const [isLoading, setIsLoading] = useState(true)
  const [httpError, setHttpError] = useState(null)

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([])
  const [totalStars, setTotalStars] = useState(0)
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)

  const [isReviewLeft, setIsReviewLeft] = useState(false)
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true)

  //Loans Count State
  const [currentLoansCount, setCurrentLoansCount] = useState(0)
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(true)

  // Is Book Check Out
  const [isCheckout, setIsCheckout] = useState(false)
  const [isLoadingBookCheckout, setIsLoadingBookCheckout] = useState(true)

  const bookId = window.location.pathname.split("/")[2]

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `http://localhost:8080/api/books/${bookId}`

      const response = await fetch(baseUrl)

      if (!response.ok) {
        throw new Error("Something went wrong!")
      }

      const responseJson = await response.json()

      const loadedBook: Book = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img
      }

      setBook(loadedBook)
      setIsLoading(false)
    }
    fetchBook().catch((error: any) => {
      setIsLoading(false)
      setHttpError(error.message)
    })
  }, [isCheckout])

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewsUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`

      const responseReviews = await fetch(reviewsUrl)

      if (!responseReviews.ok) {
        throw new Error("Something went wrong!")
      }

      const responseJsonReviews = await responseReviews.json()

      const responseData = responseJsonReviews._embedded.reviews

      const loadedReviews: ReviewModel[] = []

      let weightStarReviews: number = 0

      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          book_id: responseData[key].bookId,
          reviewDescription: responseData[key].reviewDescription
        })

        weightStarReviews = weightStarReviews + responseData[key].rating
      }

      if (loadedReviews) {
        const round = (
          Math.round((weightStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1)
        setTotalStars(Number(round))
      }

      setReviews(loadedReviews)
      setIsLoadingReviews(false)
    }

    fetchBookReviews().catch((error: any) => {
      setIsLoadingReviews(false)
      setHttpError(error.message)
    })
  }, [isReviewLeft])

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/reviews/secure/user/book/?bookId=${bookId}`
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json"
          }
        }
        const userReview = await fetch(url, requestOptions)
        if (!userReview.ok) {
          throw new Error("Something went wrong")
        }
        const userReviewResponseJson = await userReview.json()
        setIsReviewLeft(userReviewResponseJson)
      }
      setIsLoadingUserReview(false)
    }
    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false)
      setHttpError(error.message)
    })
  }, [authState])

  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/books/secure/currentloans/count`
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json"
          }
        }

        const currentLoansResponse = await fetch(url, requestOptions)

        if (!currentLoansResponse.ok) {
          throw new Error("Something went wrong!")
        }

        const currentLoansResponseJson = await currentLoansResponse.json()
        setCurrentLoansCount(currentLoansResponseJson)
      }
      setIsLoadingCurrentLoansCount(false)
    }

    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false)
      setHttpError(error.message)
    })
  }, [authState, isCheckout])

  useEffect(() => {
    const fetchUserCheckoutBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/books/secure/ischeckout/byuser?bookId=${bookId}`
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json"
          }
        }

        const bookCheckout = await fetch(url, requestOptions)

        if (!bookCheckout.ok) {
          throw new Error("Something went wrong!")
        }

        const bookCheckoutResponseJson = await bookCheckout.json()
        setIsCheckout(bookCheckoutResponseJson)
      }
      setIsLoadingBookCheckout(false)
    }

    fetchUserCheckoutBook().catch((error: any) => {
      setIsLoadingBookCheckout(false)
      setHttpError(error.message)
    })
  }, [authState])

  if (
    isLoading ||
    isLoadingReviews ||
    isLoadingCurrentLoansCount ||
    isLoadingBookCheckout ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    )
  }

  async function checkoutBook() {
    const url = `http://localhost:8080/api/books/secure/checkout/?bookId=${book?.id}`
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json"
      }
    }
    const checkoutResponse = await fetch(url, requestOptions)
    if (!checkoutResponse.ok) {
      throw new Error("Something went wrong!")
    }

    setIsCheckout(true)
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0
    if (book?.id) {
      bookId = book.id
    }

    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    )
    const url = `http://localhost:8080/api/reviews/secure`
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewRequestModel)
    }
    const returnResponse = await fetch(url, requestOptions)
    if (!returnResponse.ok) {
      throw new Error("Something went wrong!")
    }
    setIsReviewLeft(true)
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoansCount={currentLoansCount}
            isAuthenticated={authState?.isAuthenticated}
            isCheckout={isCheckout}
            checkoutBook={checkoutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansCount={currentLoansCount}
          isAuthenticated={authState?.isAuthenticated}
          isCheckout={isCheckout}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  )
}
