---
title: "How to Solve Day of the Year — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Day of the Year. Easy difficulty, 49.6% acceptance rate. Topics: Math, String."
date: "2027-08-02"
category: "dsa-patterns"
tags: ["day-of-the-year", "math", "string", "easy"]
---

# How to Solve Day of the Year

This problem asks you to calculate the ordinal day number (1-365 or 366) for any given Gregorian calendar date. While it seems straightforward, the challenge lies in correctly handling leap years and the varying lengths of months. The Gregorian calendar has specific rules: a year is a leap year if it's divisible by 4, but not by 100, unless it's also divisible by 400. This nuance makes the problem interesting—it tests your attention to detail with calendar logic and edge cases.

## Visual Walkthrough

Let's trace through the date `"2020-02-28"` (a leap year) step by step:

1. **Parse the date**: Extract year = 2020, month = 2, day = 28
2. **Check for leap year**:
   - 2020 ÷ 4 = 505 (divisible by 4 ✓)
   - 2020 ÷ 100 = 20.2 (not divisible by 100 ✓)
   - Since it's divisible by 4 but not 100, it's a leap year
3. **Calculate days in previous months**:
   - Month 1 (January): 31 days
   - Total before February: 31 days
4. **Add current month's days**: 28 days in February so far
5. **Final calculation**: 31 + 28 = 59
6. **Result**: February 28, 2020 is the 59th day of the year

Now let's check `"2020-02-29"` (the leap day):

- Same process, but day = 29
- Calculation: 31 + 29 = 60
- February 29, 2020 is the 60th day

For `"2021-02-28"` (non-leap year):

- 2021 ÷ 4 = 505.25 (not divisible by 4)
- Not a leap year
- Calculation: 31 + 28 = 59 (same as leap year February 28)
- But February 29, 2021 doesn't exist!

## Brute Force Approach

A truly brute force approach would be to simulate counting each day from January 1, but that's clearly inefficient (O(365) time). However, many candidates might try an approach that doesn't properly handle leap years or month lengths.

**Common naive mistakes:**

1. Using a simple array of month lengths without adjusting for leap years
2. Forgetting that February has 29 days in leap years
3. Not validating that the date exists (e.g., February 29 in non-leap years)

The naive approach would be to create an array of month lengths: `[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]` and sum the first `month-1` elements, then add the day. This works for non-leap years but fails for leap years after February.

## Optimal Solution

The optimal solution uses a cumulative sum approach with a leap year adjustment. We create an array of month lengths, sum the days in all months before the current month, then add the current day. For leap years and months after February, we add 1 extra day.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def dayOfYear(date: str) -> int:
    # Step 1: Parse the date string into year, month, and day
    # Split by '-' and convert to integers
    year, month, day = map(int, date.split('-'))

    # Step 2: Define days in each month for a non-leap year
    # Index 0 is January, index 1 is February, etc.
    days_in_month = [31, 28, 31, 30, 31, 30,
                     31, 31, 30, 31, 30, 31]

    # Step 3: Check if it's a leap year
    # Gregorian calendar rule: divisible by 4, but not by 100 unless also by 400
    is_leap_year = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)

    # Step 4: Calculate total days before current month
    # Sum all days in months before the current month (0-indexed)
    total_days = 0
    for i in range(month - 1):  # month-1 because we want months BEFORE current
        total_days += days_in_month[i]

    # Step 5: Add the current month's days
    total_days += day

    # Step 6: Adjust for leap year if month is after February
    # February is month 2 (1-indexed), so we check if month > 2
    if is_leap_year and month > 2:
        total_days += 1  # Add the leap day

    return total_days
```

```javascript
// Time: O(1) | Space: O(1)
function dayOfYear(date) {
  // Step 1: Parse the date string into year, month, and day
  // Split by '-' and convert to numbers
  const parts = date.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Step 2: Define days in each month for a non-leap year
  // Index 0 is January, index 1 is February, etc.
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Step 3: Check if it's a leap year
  // Gregorian calendar rule: divisible by 4, but not by 100 unless also by 400
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  // Step 4: Calculate total days before current month
  // Sum all days in months before the current month (0-indexed)
  let totalDays = 0;
  for (let i = 0; i < month - 1; i++) {
    // month-1 because we want months BEFORE current
    totalDays += daysInMonth[i];
  }

  // Step 5: Add the current month's days
  totalDays += day;

  // Step 6: Adjust for leap year if month is after February
  // February is month 2 (1-indexed), so we check if month > 2
  if (isLeapYear && month > 2) {
    totalDays += 1; // Add the leap day
  }

  return totalDays;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int dayOfYear(String date) {
        // Step 1: Parse the date string into year, month, and day
        // Split by '-' and convert to integers
        String[] parts = date.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);
        int day = Integer.parseInt(parts[2]);

        // Step 2: Define days in each month for a non-leap year
        // Index 0 is January, index 1 is February, etc.
        int[] daysInMonth = {31, 28, 31, 30, 31, 30,
                             31, 31, 30, 31, 30, 31};

        // Step 3: Check if it's a leap year
        // Gregorian calendar rule: divisible by 4, but not by 100 unless also by 400
        boolean isLeapYear = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);

        // Step 4: Calculate total days before current month
        // Sum all days in months before the current month (0-indexed)
        int totalDays = 0;
        for (int i = 0; i < month - 1; i++) {  // month-1 because we want months BEFORE current
            totalDays += daysInMonth[i];
        }

        // Step 5: Add the current month's days
        totalDays += day;

        // Step 6: Adjust for leap year if month is after February
        // February is month 2 (1-indexed), so we check if month > 2
        if (isLeapYear && month > 2) {
            totalDays += 1;  // Add the leap day
        }

        return totalDays;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- Parsing the date string: O(1) since the string has fixed length
- Looping through months: At most 11 iterations (when month = 12), which is constant
- All other operations (arithmetic, comparisons) are O(1)
- Even though we have a loop, it's bounded by 12 iterations maximum, so it's constant time

**Space Complexity: O(1)**

- We use a fixed-size array of 12 integers for month lengths
- A few integer variables for year, month, day, and counters
- No data structures that grow with input size

## Common Mistakes

1. **Incorrect leap year logic**: Using only `year % 4 == 0` without handling the century rule. The Gregorian calendar excludes years divisible by 100 unless they're also divisible by 400. Year 1900 was NOT a leap year, but 2000 WAS.

2. **Off-by-one errors with month indexing**: Forgetting that arrays are 0-indexed but months are 1-indexed. When summing months before the current month, we need to sum `days_in_month[0]` through `days_in_month[month-2]` (inclusive).

3. **Adding leap day for all months in leap years**: Adding 1 for January or February in leap years. The leap day (February 29) only affects dates after February 28. March 1 in a leap year is day 61, not 60.

4. **Not using cumulative sum**: Some candidates try to calculate using division/modulo with average month lengths, which fails due to varying month lengths. The cumulative sum approach is simpler and more reliable.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Date/Time Calculations**: Problems involving calendar calculations often use similar logic. For example:
   - **LeetCode 1185. Day of the Week**: Find the day of the week for any date (uses Zeller's congruence or similar cumulative day counting)
   - **LeetCode 1360. Number of Days Between Two Dates**: Calculate the difference between two dates using similar day-counting logic

2. **Cumulative Sum/Precomputation**: Precomputing values (like month lengths) and using cumulative sums is a common optimization pattern:
   - **LeetCode 303. Range Sum Query - Immutable**: Uses prefix sums to answer range queries quickly
   - **LeetCode 238. Product of Array Except Self**: Uses prefix and suffix products

3. **Parsing and Validation**: Many problems require parsing formatted strings and validating inputs:
   - **LeetCode 65. Valid Number**: Validate if a string is a valid number
   - **LeetCode 8. String to Integer (atoi)**: Convert string to integer with validation

## Key Takeaways

1. **Calendar problems often involve lookup tables**: When dealing with dates, predefine arrays for month lengths, day names, or other recurring patterns rather than computing them dynamically.

2. **Pay attention to edge cases in rules**: The Gregorian leap year rule has exceptions (century years). Always test edge cases: year 2000 (leap), 1900 (not leap), 2020 (leap), 2100 (not leap).

3. **Cumulative sums simplify counting problems**: Instead of counting from scratch each time, precompute running totals. This pattern appears in many domains beyond date calculations.

[Practice this problem on CodeJeet](/problem/day-of-the-year)
