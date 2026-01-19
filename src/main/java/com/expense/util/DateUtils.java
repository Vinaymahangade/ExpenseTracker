package com.expense.util;

import java.time.LocalDate;
import java.time.YearMonth;

public class DateUtils {

    private DateUtils() {
        // Utility class
    }

    // First day of current month
    public static LocalDate getStartOfCurrentMonth() {
        return YearMonth.now().atDay(1);
    }

    // Last day of current month
    public static LocalDate getEndOfCurrentMonth() {
        return YearMonth.now().atEndOfMonth();
    }

    // Check if a date falls in current month
    public static boolean isInCurrentMonth(LocalDate date) {
        if (date == null) {
            return false;
        }
        return YearMonth.from(date).equals(YearMonth.now());
    }
}
