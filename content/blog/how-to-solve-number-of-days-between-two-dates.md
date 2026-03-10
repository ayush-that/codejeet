---
title: "How to Solve Number of Days Between Two Dates — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Days Between Two Dates. Easy difficulty, 52.4% acceptance rate. Topics: Math, String."
date: "2028-01-12"
category: "dsa-patterns"
tags: ["number-of-days-between-two-dates", "math", "string", "easy"]
---

# How to Solve Number of Days Between Two Dates

This problem asks you to calculate the exact number of days between two given dates in `YYYY-MM-DD` format. While it seems straightforward, the challenge lies in correctly handling leap years and the varying number of days in each month. The key insight is that you can't simply count days by iterating through all dates (which would be inefficient), but rather need a mathematical approach that accounts for calendar complexities.

## Visual Walkthrough

Let's trace through an example: `date1 = "2019-06-29"` and `date2 = "2019-06-30"`

**Step 1: Parse the dates**

- `date1`: Year = 2019, Month = 06, Day = 29
- `date2`: Year = 2019, Month = 06, Day = 30

**Step 2: Convert each date to total days since a reference point**
We'll use a common technique: calculate days from year 0 to each date, then subtract.

For `date1` (2019-06-29):

- Days from years: Sum of days in years 0 through 2018
- Days from months Jan-May 2019: 31 + 28 + 31 + 30 + 31 = 151 days
- Days in June: 29
- Total days to `date1`: Days from years + 151 + 29

For `date2` (2019-06-30):

- Same years and months as `date1`
- Days in June: 30
- Total days to `date2`: Days from years + 151 + 30

**Step 3: Calculate difference**

- Difference = `date2_total` - `date1_total` = 1 day

Now let's try a more complex example: `date1 = "2020-01-15"`, `date2 = "2020-03-10"`

For `date1`:

- Days from years 0-2019
- Days in Jan 2020: 15 days

For `date2`:

- Same years as `date1`
- Days Jan 2020: 31 days
- Days Feb 2020: 29 days (2020 is a leap year!)
- Days in Mar 2020: 10 days
- Total: 31 + 29 + 10 = 70 days

Difference = 70 - 15 = 55 days

## Brute Force Approach

A naive approach would be to start from the earlier date and count forward day by day until reaching the later date:

1. Parse both dates into year, month, day components
2. Determine which date comes first
3. Increment the earlier date by one day at a time, counting each increment
4. Stop when reaching the later date

**Why this fails:**

- **Time complexity**: In the worst case (dates far apart, like 1900-01-01 to 2100-12-31), you'd need to iterate through ~73,000 days
- **Leap year handling**: You'd need to correctly handle February having 28 or 29 days each time you cross February
- **Month boundaries**: You'd need to handle month transitions (e.g., Jan 31 → Feb 1)

While this approach would technically work, it's extremely inefficient for dates that are centuries apart. Interviewers expect the optimal mathematical solution.

## Optimal Solution

The optimal approach converts each date to the total number of days from a fixed reference date (like year 0), then subtracts. The key is having helper functions to:

1. Check if a year is a leap year
2. Calculate days in each month (accounting for leap years)
3. Convert a full date to total days since reference

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
class Solution:
    def daysBetweenDates(self, date1: str, date2: str) -> int:
        # Helper function to check if a year is a leap year
        def is_leap_year(year: int) -> bool:
            # Leap year rules:
            # 1. Divisible by 4
            # 2. But not divisible by 100, unless also divisible by 400
            return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

        # Helper function to get days in a month for a given year
        def days_in_month(year: int, month: int) -> int:
            # Days in each month (1-indexed, January = 1)
            month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            # Adjust February for leap years
            if month == 2 and is_leap_year(year):
                return 29
            return month_days[month - 1]  # -1 because list is 0-indexed

        # Convert a date string to total days since year 0
        def date_to_days(date: str) -> int:
            # Parse the date string
            year, month, day = map(int, date.split('-'))
            total_days = 0

            # Add days from all years before the current year
            for y in range(year):
                total_days += 366 if is_leap_year(y) else 365

            # Add days from all months before the current month in current year
            for m in range(1, month):  # From January to month-1
                total_days += days_in_month(year, m)

            # Add days in the current month
            total_days += day

            return total_days

        # Calculate days for both dates and return absolute difference
        days1 = date_to_days(date1)
        days2 = date_to_days(date2)
        return abs(days1 - days2)
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * @param {string} date1
 * @param {string} date2
 * @return {number}
 */
var daysBetweenDates = function (date1, date2) {
  // Helper function to check if a year is a leap year
  const isLeapYear = (year) => {
    // Leap year rules:
    // 1. Divisible by 4
    // 2. But not divisible by 100, unless also divisible by 400
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  };

  // Helper function to get days in a month for a given year
  const daysInMonth = (year, month) => {
    // Days in each month (1-indexed, January = 1)
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Adjust February for leap years
    if (month === 2 && isLeapYear(year)) {
      return 29;
    }
    return monthDays[month - 1]; // -1 because array is 0-indexed
  };

  // Convert a date string to total days since year 0
  const dateToDays = (date) => {
    // Parse the date string
    const [yearStr, monthStr, dayStr] = date.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);

    let totalDays = 0;

    // Add days from all years before the current year
    for (let y = 0; y < year; y++) {
      totalDays += isLeapYear(y) ? 366 : 365;
    }

    // Add days from all months before the current month in current year
    for (let m = 1; m < month; m++) {
      totalDays += daysInMonth(year, m);
    }

    // Add days in the current month
    totalDays += day;

    return totalDays;
  };

  // Calculate days for both dates and return absolute difference
  const days1 = dateToDays(date1);
  const days2 = dateToDays(date2);
  return Math.abs(days1 - days2);
};
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    // Helper function to check if a year is a leap year
    private boolean isLeapYear(int year) {
        // Leap year rules:
        // 1. Divisible by 4
        // 2. But not divisible by 100, unless also divisible by 400
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    }

    // Helper function to get days in a month for a given year
    private int daysInMonth(int year, int month) {
        // Days in each month (1-indexed, January = 1)
        int[] monthDays = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        // Adjust February for leap years
        if (month == 2 && isLeapYear(year)) {
            return 29;
        }
        return monthDays[month - 1];  // -1 because array is 0-indexed
    }

    // Convert a date string to total days since year 0
    private int dateToDays(String date) {
        // Parse the date string
        String[] parts = date.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);
        int day = Integer.parseInt(parts[2]);

        int totalDays = 0;

        // Add days from all years before the current year
        for (int y = 0; y < year; y++) {
            totalDays += isLeapYear(y) ? 366 : 365;
        }

        // Add days from all months before the current month in current year
        for (int m = 1; m < month; m++) {
            totalDays += daysInMonth(year, m);
        }

        // Add days in the current month
        totalDays += day;

        return totalDays;
    }

    public int daysBetweenDates(String date1, String date2) {
        // Calculate days for both dates and return absolute difference
        int days1 = dateToDays(date1);
        int days2 = dateToDays(date2);
        return Math.abs(days1 - days2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- Parsing the date strings: O(1) since dates have fixed format
- `dateToDays` function:
  - Year loop runs for `year` iterations, but since year has an upper bound (9999 in Gregorian calendar), this is O(1)
  - Month loop runs at most 11 times (January to November), which is O(1)
- All operations are bounded by constant factors

**Space Complexity: O(1)**

- We use only a fixed amount of extra space:
  - A few integer variables for year, month, day
  - A small fixed-size array for month days (12 elements)
  - No data structures that grow with input size

## Common Mistakes

1. **Incorrect leap year calculation**: The most common error is forgetting the "divisible by 400" exception. Remember: year 1900 was NOT a leap year (divisible by 100 but not 400), while year 2000 WAS a leap year (divisible by 400).

2. **Off-by-one errors in month calculations**: When summing days from months before the current month, make sure to loop from 1 to `month-1`, not from 0 to `month` or from 1 to `month`. Also remember that array indices start at 0, so `monthDays[month-1]` gives the days for month `month`.

3. **Not using absolute value**: The problem asks for the number of days between two dates, which should always be positive. If you subtract without taking the absolute value, you might return a negative number when `date1` is after `date2`.

4. **Inefficient year counting**: Some candidates try to optimize by calculating days using formulas like `365*year + year/4 - year/100 + year/400`. While this works, it's error-prone. The clear loop approach is easier to understand and debug, and still O(1) since year is bounded.

## When You'll See This Pattern

This "convert to common reference point" pattern appears in several time-related problems:

1. **Count Days Spent Together (LeetCode 2409)**: Similar to this problem but with multiple date ranges. You convert all dates to day numbers and find overlaps.

2. **Day of the Year (LeetCode 1154)**: Convert a date to the day number within its year (1-365/366), which is a simpler version of our `dateToDays` function.

3. **Number of Days Between Two Dates (LeetCode 1360)**: This is literally the same problem!

The core pattern is: when dealing with dates or times, convert everything to a common unit (seconds, minutes, days since epoch) to make calculations straightforward.

## Key Takeaways

1. **Convert to a common reference**: When comparing dates or times, convert each to a common unit (like days since a fixed point) rather than trying to calculate differences directly.

2. **Leap year rules are specific**: Remember the complete rule: divisible by 4, but not by 100 unless also divisible by 400. This tripped up many real-world systems (like Microsoft Excel in early versions).

3. **Test edge cases**: Always test with dates that cross leap years, month boundaries, and century boundaries. A good test suite would include: same day, consecutive days, dates in same month, dates across February in leap/non-leap years, dates across centuries.

Related problems: [Count Days Spent Together](/problem/count-days-spent-together)
