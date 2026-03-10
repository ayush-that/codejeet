---
title: "How to Solve Day of the Week — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Day of the Week. Easy difficulty, 59.0% acceptance rate. Topics: Math."
date: "2027-08-30"
category: "dsa-patterns"
tags: ["day-of-the-week", "math", "easy"]
---

# How to Solve Day of the Week

Given a date (day, month, year), determine what day of the week it falls on. While this seems straightforward, the challenge lies in accounting for leap years and the irregular lengths of months. The Gregorian calendar has specific rules: leap years occur every 4 years, except for years divisible by 100 unless they're also divisible by 400. This problem tests your ability to implement calendar logic correctly.

## Visual Walkthrough

Let's trace through an example: **March 15, 2023**

We need a reference point. A common approach uses January 1, 1971, which was a Friday. We'll calculate how many days have passed since then.

**Step 1: Count years from 1971 to 2022**

- For each year from 1971 to 2022, add 365 days
- For leap years (divisible by 4, except centuries unless divisible by 400), add 1 extra day
- 1972, 1976, 1980... 2020 are leap years
- That's 52 years × 365 = 18,980 days
- Plus 13 leap years = 18,993 days

**Step 2: Count months in 2023 up to February**

- January: 31 days
- February: 28 days (2023 isn't a leap year)
- Total: 31 + 28 = 59 days

**Step 3: Add days in March**

- Add 15 days

**Step 4: Calculate total days**

- Total = 18,993 + 59 + 15 = 19,067 days

**Step 5: Determine day of week**

- January 1, 1971 was Friday (day 5 in 0-6 where 0=Sunday)
- Days passed: 19,067
- Day of week = (5 + 19,067) % 7 = 19,072 % 7
- 19,072 ÷ 7 = 2,724 remainder 4
- 4 corresponds to Wednesday (0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday... wait, let's recalculate)

Actually, let me correct this: If January 1, 1971 was Friday, and we index days as 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, then:

- Day index = (5 + total_days) % 7
- 5 + 19,067 = 19,072
- 19,072 % 7 = 4
- 4 = Thursday

So March 15, 2023 was a Thursday (which is correct!).

## Brute Force Approach

A truly brute force approach would be to start from a known date and literally count days one by one until reaching the target date. This would involve:

1. Starting from a reference date (like January 1, 1971)
2. Incrementing one day at a time
3. Tracking month transitions and leap years
4. Stopping when reaching the target date

The problem with this approach is efficiency. For dates far in the future (like year 3000), we'd need to iterate through thousands of days. Even for moderate dates, this is O(n) where n is the number of days between the reference and target dates, which could be over 100,000 operations. While technically correct, this is inefficient and not what interviewers expect.

## Optimal Solution

The optimal solution uses direct calculation with careful handling of leap years. We'll:

1. Use January 1, 1971 as our reference (a Friday)
2. Calculate total days from reference to target date
3. Account for leap years correctly
4. Use modulo 7 to find the day of week

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
class Solution:
    def dayOfTheWeek(self, day: int, month: int, year: int) -> str:
        # Days of week for mapping index to name
        days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        # Days in each month for non-leap years
        month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        # Helper function to check if a year is a leap year
        def is_leap_year(y):
            # Leap year rules:
            # 1. Divisible by 4
            # 2. But not divisible by 100, unless also divisible by 400
            return (y % 4 == 0 and y % 100 != 0) or (y % 400 == 0)

        # Calculate days from 1971-01-01 (which was a Friday)
        total_days = 0

        # Step 1: Add days for complete years from 1971 to year-1
        for y in range(1971, year):
            total_days += 365
            if is_leap_year(y):
                total_days += 1  # Add extra day for leap year

        # Step 2: Add days for complete months in the current year
        for m in range(1, month):  # Up to but not including current month
            total_days += month_days[m - 1]

            # If February and current year is leap year, add extra day
            if m == 2 and is_leap_year(year):
                total_days += 1

        # Step 3: Add days in the current month
        total_days += day - 1  # -1 because we start counting from day 1

        # January 1, 1971 was a Friday (index 5 in our array)
        # Calculate day index: (5 + total_days) % 7
        # We use 5 because Friday is index 5 in our days array
        day_index = (5 + total_days) % 7

        return days[day_index]
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @return {string}
 */
var dayOfTheWeek = function (day, month, year) {
  // Days of week for mapping index to name
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Days in each month for non-leap years
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Helper function to check if a year is a leap year
  const isLeapYear = (y) => {
    // Leap year rules:
    // 1. Divisible by 4
    // 2. But not divisible by 100, unless also divisible by 400
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  };

  // Calculate days from 1971-01-01 (which was a Friday)
  let totalDays = 0;

  // Step 1: Add days for complete years from 1971 to year-1
  for (let y = 1971; y < year; y++) {
    totalDays += 365;
    if (isLeapYear(y)) {
      totalDays += 1; // Add extra day for leap year
    }
  }

  // Step 2: Add days for complete months in the current year
  for (let m = 1; m < month; m++) {
    // Up to but not including current month
    totalDays += monthDays[m - 1];

    // If February and current year is leap year, add extra day
    if (m === 2 && isLeapYear(year)) {
      totalDays += 1;
    }
  }

  // Step 3: Add days in the current month
  totalDays += day - 1; // -1 because we start counting from day 1

  // January 1, 1971 was a Friday (index 5 in our array)
  // Calculate day index: (5 + total_days) % 7
  // We use 5 because Friday is index 5 in our days array
  const dayIndex = (5 + totalDays) % 7;

  return days[dayIndex];
};
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public String dayOfTheWeek(int day, int month, int year) {
        // Days of week for mapping index to name
        String[] days = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

        // Days in each month for non-leap years
        int[] monthDays = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

        // Helper function to check if a year is a leap year
        boolean isLeapYear(int y) {
            // Leap year rules:
            // 1. Divisible by 4
            // 2. But not divisible by 100, unless also divisible by 400
            return (y % 4 == 0 && y % 100 != 0) || (y % 400 == 0);
        }

        // Calculate days from 1971-01-01 (which was a Friday)
        int totalDays = 0;

        // Step 1: Add days for complete years from 1971 to year-1
        for (int y = 1971; y < year; y++) {
            totalDays += 365;
            if (isLeapYear(y)) {
                totalDays += 1;  // Add extra day for leap year
            }
        }

        // Step 2: Add days for complete months in the current year
        for (int m = 1; m < month; m++) {  // Up to but not including current month
            totalDays += monthDays[m - 1];

            // If February and current year is leap year, add extra day
            if (m == 2 && isLeapYear(year)) {
                totalDays += 1;
            }
        }

        // Step 3: Add days in the current month
        totalDays += day - 1;  // -1 because we start counting from day 1

        // January 1, 1971 was a Friday (index 5 in our array)
        // Calculate day index: (5 + total_days) % 7
        // We use 5 because Friday is index 5 in our days array
        int dayIndex = (5 + totalDays) % 7;

        return days[dayIndex];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- The year loop runs at most (year - 1971) times, but since year has a limited range (1971 ≤ year ≤ 2100 in typical constraints), this is effectively constant time
- The month loop runs at most 11 times (for December dates)
- All other operations are constant time

**Space Complexity: O(1)**

- We use a fixed-size array for days of week (7 elements)
- We use a fixed-size array for month days (12 elements)
- A few integer variables for counting
- No data structures that grow with input size

## Common Mistakes

1. **Incorrect leap year calculation**: The most common error is forgetting the "divisible by 100 but not 400" exception. Many candidates implement `year % 4 == 0` only, which would incorrectly mark years like 1900 as leap years (they're not).

2. **Off-by-one errors in day counting**: When adding days for the current month, remember to subtract 1 (we count from day 1, not day 0). Similarly, when looping through months, use `< month` not `<= month` since we're counting complete months before the current one.

3. **Wrong reference day or indexing**: January 1, 1971 was a Friday. If you use a different reference or misindex your days array, you'll get wrong results. Always verify with a known test case.

4. **Forgetting to handle February in leap years**: When counting days for months in the current year, you need to check if it's a leap year when reaching February. Some candidates add the leap day only when counting years, forgetting it affects February in the target year too.

## When You'll See This Pattern

This "cumulative counting with special rules" pattern appears in various calendar and date-related problems:

1. **LeetCode 1360: Number of Days Between Two Dates** - Similar logic of counting days between dates, requiring the same leap year handling.

2. **LeetCode 1185: Day of the Week** - This is literally the same problem, just with different constraints.

3. **LeetCode 1118: Number of Days in a Month** - Requires determining if a year is leap to return correct days for February.

4. **LeetCode 1154: Day of the Year** - Counting days from January 1 to a given date, using the same month accumulation logic.

The core pattern involves: establishing a reference point, defining accumulation rules (with exceptions like leap years), and carefully handling boundary conditions.

## Key Takeaways

1. **Calendar problems require meticulous attention to rules**: Leap year rules, month lengths, and reference points must be precisely implemented. Always test edge cases like century years (1900, 2000).

2. **Break complex calculations into steps**: Count years, then months, then days. This modular approach makes the logic clearer and easier to debug.

3. **Use a known reference date**: Instead of trying to derive formulas from scratch, pick a known date and count forward/backward. This is more reliable than trying to remember complex day-of-week algorithms.

4. **Test with multiple cases**: Always verify your solution with dates you know the answer to, including leap years, century boundaries, and month transitions.

[Practice this problem on CodeJeet](/problem/day-of-the-week)
