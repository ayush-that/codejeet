---
title: "How to Solve Number of Valid Clock Times — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Valid Clock Times. Easy difficulty, 47.9% acceptance rate. Topics: String, Enumeration."
date: "2028-12-19"
category: "dsa-patterns"
tags: ["number-of-valid-clock-times", "string", "enumeration", "easy"]
---

# How to Solve Number of Valid Clock Times

You're given a time string like `"??:??"` where question marks represent unknown digits, and you need to count how many valid 24-hour times could match that pattern. What makes this interesting is that each position has different constraints: hours tens digit can only be 0-2, minutes tens digit only 0-5, etc., and these constraints interact — if the hours tens digit is 2, the hours ones digit can only be 0-3.

## Visual Walkthrough

Let's trace through `"2?:?0"` step by step:

1. **Parse positions**: `time[0]='2'`, `time[1]='?'`, `time[2]=':'`, `time[3]='?'`, `time[4]='0'`

2. **Hours tens (position 0)**: Fixed at '2', so we have 1 possibility.

3. **Hours ones (position 1)**: Since hours tens is '2', hours can only be 20-23. So position 1 can be 0, 1, 2, or 3. That's 4 possibilities.

4. **Minutes tens (position 3)**: Can be 0-5 (since minutes go 00-59). That's 6 possibilities.

5. **Minutes ones (position 4)**: Fixed at '0', so 1 possibility.

6. **Multiply possibilities**: `1 × 4 × 6 × 1 = 24` valid times.

The key insight: we can't just multiply 10 for each '?' because positions have different ranges, and some positions' ranges depend on other positions' values.

## Brute Force Approach

A naive approach would generate all possible times from "00:00" to "23:59" (1440 possibilities), check each against the pattern, and count matches. For each candidate time:

1. Convert to string format "hh:mm"
2. Check if each digit matches the corresponding pattern digit (either equal or pattern has '?')
3. Count matches

While this works (1440 checks is trivial), it's inefficient and misses the point of the problem. Interviewers expect you to recognize that we can compute the answer directly by analyzing constraints, not by brute force enumeration.

## Optimal Solution

We can solve this by analyzing each position's possible values based on the pattern and constraints:

1. **Hours tens digit (position 0)**:
   - If fixed digit: 1 possibility
   - If '?': can be 0, 1, or 2 → 3 possibilities

2. **Hours ones digit (position 1)**:
   - If fixed digit: 1 possibility
   - If '?': depends on hours tens:
     - If hours tens is 0 or 1: can be 0-9 → 10 possibilities
     - If hours tens is 2: can be 0-3 → 4 possibilities

3. **Minutes tens digit (position 3)**:
   - If fixed digit: 1 possibility
   - If '?': can be 0-5 → 6 possibilities

4. **Minutes ones digit (position 4)**:
   - If fixed digit: 1 possibility
   - If '?': can be 0-9 → 10 possibilities

We multiply possibilities, but must handle the dependency between positions 0 and 1 carefully.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def countTime(time):
    """
    Count valid 24-hour times matching the pattern.

    Args:
        time: String in format "hh:mm" with digits or '?'

    Returns:
        Number of valid times matching the pattern
    """
    # Count possibilities for hours tens digit (position 0)
    if time[0] == '?':
        # Can be 0, 1, or 2
        hour_tens = 3
    else:
        # Fixed digit, only 1 possibility
        hour_tens = 1

    # Count possibilities for hours ones digit (position 1)
    if time[1] == '?':
        if time[0] == '?':
            # Both positions are '?'
            # Hours can be 00-23, which is 24 possibilities
            # We'll handle this special case separately
            hour_ones = 1  # Placeholder, will compute differently
        elif time[0] == '2':
            # Hours tens is 2, so hours ones can be 0-3
            hour_ones = 4
        else:
            # Hours tens is 0 or 1, so hours ones can be 0-9
            hour_ones = 10
    else:
        # Fixed digit, only 1 possibility
        hour_ones = 1

    # Special case: both hour digits are '?'
    if time[0] == '?' and time[1] == '?':
        # Hours can be 00-23 = 24 possibilities
        # We've counted hour_tens=3 and hour_ones=1, but need 24 total
        # So we'll set hour_tens=24 and hour_ones=1
        hour_tens = 24
        hour_ones = 1

    # Count possibilities for minutes tens digit (position 3)
    if time[3] == '?':
        # Can be 0-5
        minute_tens = 6
    else:
        # Fixed digit, only 1 possibility
        minute_tens = 1

    # Count possibilities for minutes ones digit (position 4)
    if time[4] == '?':
        # Can be 0-9
        minute_ones = 10
    else:
        # Fixed digit, only 1 possibility
        minute_ones = 1

    # Total possibilities = product of all independent possibilities
    return hour_tens * hour_ones * minute_tens * minute_ones
```

```javascript
// Time: O(1) | Space: O(1)
function countTime(time) {
  /**
   * Count valid 24-hour times matching the pattern.
   *
   * @param {string} time - String in format "hh:mm" with digits or '?'
   * @return {number} Number of valid times matching the pattern
   */

  let hourTens, hourOnes, minuteTens, minuteOnes;

  // Count possibilities for hours tens digit (position 0)
  if (time[0] === "?") {
    // Can be 0, 1, or 2
    hourTens = 3;
  } else {
    // Fixed digit, only 1 possibility
    hourTens = 1;
  }

  // Count possibilities for hours ones digit (position 1)
  if (time[1] === "?") {
    if (time[0] === "?") {
      // Both positions are '?'
      // Hours can be 00-23, which is 24 possibilities
      // We'll handle this special case separately
      hourOnes = 1; // Placeholder
    } else if (time[0] === "2") {
      // Hours tens is 2, so hours ones can be 0-3
      hourOnes = 4;
    } else {
      // Hours tens is 0 or 1, so hours ones can be 0-9
      hourOnes = 10;
    }
  } else {
    // Fixed digit, only 1 possibility
    hourOnes = 1;
  }

  // Special case: both hour digits are '?'
  if (time[0] === "?" && time[1] === "?") {
    // Hours can be 00-23 = 24 possibilities
    hourTens = 24;
    hourOnes = 1;
  }

  // Count possibilities for minutes tens digit (position 3)
  if (time[3] === "?") {
    // Can be 0-5
    minuteTens = 6;
  } else {
    // Fixed digit, only 1 possibility
    minuteTens = 1;
  }

  // Count possibilities for minutes ones digit (position 4)
  if (time[4] === "?") {
    // Can be 0-9
    minuteOnes = 10;
  } else {
    // Fixed digit, only 1 possibility
    minuteOnes = 1;
  }

  // Total possibilities = product of all independent possibilities
  return hourTens * hourOnes * minuteTens * minuteOnes;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int countTime(String time) {
        /**
         * Count valid 24-hour times matching the pattern.
         *
         * @param time String in format "hh:mm" with digits or '?'
         * @return Number of valid times matching the pattern
         */

        int hourTens, hourOnes, minuteTens, minuteOnes;

        // Count possibilities for hours tens digit (position 0)
        if (time.charAt(0) == '?') {
            // Can be 0, 1, or 2
            hourTens = 3;
        } else {
            // Fixed digit, only 1 possibility
            hourTens = 1;
        }

        // Count possibilities for hours ones digit (position 1)
        if (time.charAt(1) == '?') {
            if (time.charAt(0) == '?') {
                // Both positions are '?'
                // Hours can be 00-23, which is 24 possibilities
                // We'll handle this special case separately
                hourOnes = 1;  // Placeholder
            } else if (time.charAt(0) == '2') {
                // Hours tens is 2, so hours ones can be 0-3
                hourOnes = 4;
            } else {
                // Hours tens is 0 or 1, so hours ones can be 0-9
                hourOnes = 10;
            }
        } else {
            // Fixed digit, only 1 possibility
            hourOnes = 1;
        }

        // Special case: both hour digits are '?'
        if (time.charAt(0) == '?' && time.charAt(1) == '?') {
            // Hours can be 00-23 = 24 possibilities
            hourTens = 24;
            hourOnes = 1;
        }

        // Count possibilities for minutes tens digit (position 3)
        if (time.charAt(3) == '?') {
            // Can be 0-5
            minuteTens = 6;
        } else {
            // Fixed digit, only 1 possibility
            minuteTens = 1;
        }

        // Count possibilities for minutes ones digit (position 4)
        if (time.charAt(4) == '?') {
            // Can be 0-9
            minuteOnes = 10;
        } else {
            // Fixed digit, only 1 possibility
            minuteOnes = 1;
        }

        // Total possibilities = product of all independent possibilities
        return hourTens * hourOnes * minuteTens * minuteOnes;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform a constant number of character comparisons and arithmetic operations
- The input size is fixed at 5 characters, so even if we used a brute force approach checking all 1440 times, it would still be O(1)

**Space Complexity: O(1)**

- We use only a few integer variables to store counts
- No data structures that grow with input size

## Common Mistakes

1. **Forgetting the dependency between hour digits**: The biggest pitfall is treating positions 0 and 1 independently. If position 0 is '2', position 1 can only be 0-3, not 0-9. Candidates who multiply 10 for each '?' without considering constraints will get wrong answers for patterns like `"2?:??"`.

2. **Missing the "??" special case**: When both hour digits are '?', there are 24 possibilities (00-23), not 3×10=30. Some candidates correctly handle the dependency but forget this edge case.

3. **Incorrect minute constraints**: Minutes tens digit (position 3) can only be 0-5, not 0-9. Candidates sometimes apply the same logic as hour ones digit.

4. **Off-by-one with ranges**: Remember that 0-2 means 3 possibilities, 0-5 means 6 possibilities, 0-9 means 10 possibilities. Double-check your counts.

## When You'll See This Pattern

This problem uses **constrained counting with dependencies** — a pattern that appears whenever you need to count valid combinations where some choices restrict others:

1. **Largest Time for Given Digits (Medium)**: Given 4 digits, arrange them into the largest valid time. Similar constraints apply, but here you're finding the maximum valid arrangement rather than counting possibilities.

2. **Latest Time by Replacing Hidden Digits (Easy)**: Given a time with hidden digits, find the latest valid time. Uses the same time constraints but focuses on maximizing rather than counting.

3. **Sudoku Solver (Hard)**: While more complex, it uses similar constraint propagation — placing a digit in one cell restricts possibilities in related cells.

## Key Takeaways

1. **Break down constraints systematically**: When dealing with structured formats (times, dates, phone numbers), analyze each position's valid range and how positions interact.

2. **Handle dependencies carefully**: When choices in one position affect another, don't just multiply independent counts. Either handle special cases or use conditional logic.

3. **Test edge cases**: Always check patterns like `"??:??"` (all unknown), `"2?:??"` (hour tens fixed at max), and `"0?:??"` (hour tens at minimum).

Related problems: [Largest Time for Given Digits](/problem/largest-time-for-given-digits), [Latest Time by Replacing Hidden Digits](/problem/latest-time-by-replacing-hidden-digits)
