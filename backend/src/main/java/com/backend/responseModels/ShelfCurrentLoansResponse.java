package com.backend.responseModels;

import com.backend.entity.Book;
import lombok.Data;

@Data
public class ShelfCurrentLoansResponse {
    public Book book;
    private int daysLeft;

    public ShelfCurrentLoansResponse(Book book, int daysLeft) {
        this.book = book;
        this.daysLeft = daysLeft;
    }
}
