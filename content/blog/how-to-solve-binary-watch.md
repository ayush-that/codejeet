---
title: "How to Solve Binary Watch — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Binary Watch. Easy difficulty, 65.2% acceptance rate. Topics: Backtracking, Bit Manipulation."
date: "2028-03-02"
category: "dsa-patterns"
tags: ["binary-watch", "backtracking", "bit-manipulation", "easy"]
---

# How to Solve Binary Watch

The Binary Watch problem asks: given an integer `turnedOn` representing how many LEDs are lit on a binary watch, return all possible times the watch could display. The watch has 4 hour LEDs (0-11) and 6 minute LEDs (0-59). What makes this problem interesting is that it combines two classic techniques: bit manipulation and combinatorial generation. While it's labeled "Easy," it tests your ability to systematically generate valid combinations without missing cases or creating invalid times.

## Visual Walkthrough

Let's trace through `turnedOn = 1` step by step to build intuition.

We need exactly 1 LED lit total, which can be either in the hour section or minute section.

**Hour possibilities (4 bits):**

- `0001` = 1 hour
- `0010` = 2 hours
- `0100` = 4 hours
- `1000` = 8 hours

**Minute possibilities (6 bits):**

- `000001` = 1 minute
- `000010` = 2 minutes
- `000100` = 4 minutes
- `001000` = 8 minutes
- `010000` = 16 minutes
- `100000` = 32 minutes

**Valid combinations:**

- Hour LED lit: "1:00", "2:00", "4:00", "8:00"
- Minute LED lit: "0:01", "0:02", "0:04", "0:08", "0:16", "0:32"

So for `turnedOn = 1`, we get 10 possible times. Notice we need to format minutes with leading zeros (e.g., "0:01" not "0:1").

## Brute Force Approach

A truly brute force approach would be to generate all 2¹⁰ = 1024 possible LED patterns, count the 1-bits in each, and if it matches `turnedOn`, convert to time format. While this is technically O(1) since the watch has fixed bits, it's inefficient because we check many invalid patterns.

A more common "naive" mistake would be to generate all combinations without considering the constraints:

1. Hours must be 0-11
2. Minutes must be 0-59
3. Total lit LEDs must equal `turnedOn`

Without these checks, you'd get invalid times like "15:00" (hour 15) or "0:64" (minute 64).

## Optimal Solution

The cleanest solution uses bit counting: iterate through all possible hour (0-11) and minute (0-59) values, count the 1-bits in each using either built-in functions or bit manipulation, and if the sum equals `turnedOn`, format the time.

Why this works: We're essentially doing a constrained search where the constraints (valid hour/minute ranges) are baked into our loops. Each hour-minute pair is a candidate solution; we just need to verify it uses the correct number of LEDs.

<div class="code-group">

```python
# Time: O(12 * 60) = O(1) | Space: O(1) excluding output
class Solution:
    def readBinaryWatch(self, turnedOn: int) -> List[str]:
        result = []

        # Iterate through all possible hours (0-11)
        for hour in range(12):
            # Iterate through all possible minutes (0-59)
            for minute in range(60):
                # Count 1-bits in hour and minute using bin() and count()
                # bin() returns a binary string like '0b1010', we count '1's
                if bin(hour).count('1') + bin(minute).count('1') == turnedOn:
                    # Format minute with leading zero if needed
                    # f-string handles the formatting elegantly
                    result.append(f"{hour}:{minute:02d}")

        return result
```

```javascript
// Time: O(12 * 60) = O(1) | Space: O(1) excluding output
/**
 * @param {number} turnedOn
 * @return {string[]}
 */
var readBinaryWatch = function (turnedOn) {
  const result = [];

  // Helper function to count 1-bits in a number
  const countBits = (num) => {
    let count = 0;
    while (num > 0) {
      // num & 1 checks if the least significant bit is 1
      count += num & 1;
      // Right shift to check next bit
      num >>= 1;
    }
    return count;
  };

  // Iterate through all possible hours (0-11)
  for (let hour = 0; hour < 12; hour++) {
    // Iterate through all possible minutes (0-59)
    for (let minute = 0; minute < 60; minute++) {
      // Check if total bits match turnedOn
      if (countBits(hour) + countBits(minute) === turnedOn) {
        // Format minute with leading zero
        // padStart ensures 2-digit minutes
        result.push(`${hour}:${minute.toString().padStart(2, "0")}`);
      }
    }
  }

  return result;
};
```

```java
// Time: O(12 * 60) = O(1) | Space: O(1) excluding output
import java.util.*;

class Solution {
    public List<String> readBinaryWatch(int turnedOn) {
        List<String> result = new ArrayList<>();

        // Iterate through all possible hours (0-11)
        for (int hour = 0; hour < 12; hour++) {
            // Iterate through all possible minutes (0-59)
            for (int minute = 0; minute < 60; minute++) {
                // Integer.bitCount() efficiently counts 1-bits
                if (Integer.bitCount(hour) + Integer.bitCount(minute) == turnedOn) {
                    // Format minute with leading zero
                    // String.format ensures proper formatting
                    result.add(String.format("%d:%02d", hour, minute));
                }
            }
        }

        return result;
    }
}
```

</div>

**Alternative approach using precomputation:** We could precompute bit counts for 0-11 and 0-59 to avoid counting bits repeatedly. This trades a small amount of memory for slightly faster execution, though both are O(1) with small constants.

## Complexity Analysis

**Time Complexity:** O(12 × 60) = O(720) = O(1).  
We iterate through 12 possible hours and 60 possible minutes, resulting in 720 iterations. Each iteration involves bit counting (O(1) since numbers are bounded by 11 and 59) and string formatting (O(1)). Since the watch has fixed constraints, this is constant time.

**Space Complexity:** O(1) excluding the output array.  
We only use a few variables for iteration and bit counting. The result array stores up to all valid times, but this is considered output space and typically not counted in space complexity analysis. If we do count it, worst-case space is O(12 × 60) = O(720) when `turnedOn` allows all combinations (though in practice, maximum valid combinations are fewer).

## Common Mistakes

1. **Forgetting minute formatting:** Returning "0:1" instead of "0:01". The problem expects two-digit minutes. Always use proper formatting (`:02d` in Python, `padStart(2, '0')` in JavaScript, `%02d` in Java).

2. **Including invalid hours/minutes:** Some candidates try to generate bit patterns directly without range checking. Remember: hour bits represent 0-11, minute bits represent 0-59. Patterns like `1100` (12 hours) or `111100` (60 minutes) are invalid.

3. **Off-by-one in loops:** Using `<= 11` instead of `< 12` is fine for hours, but using `<= 60` instead of `< 60` for minutes would include invalid minute 60.

4. **Inefficient bit counting:** While `bin(num).count('1')` is fine for small numbers, in interviews you might be asked to implement bit counting manually. Know how to do it with shifting (`num >>= 1`) or Brian Kernighan's algorithm (`num &= (num - 1)`).

## When You'll See This Pattern

This problem combines **constrained enumeration** with **bit counting**:

1. **Letter Combinations of a Phone Number (Medium):** Similar combinatorial generation where you build all valid combinations from digits to letters, respecting mapping constraints.

2. **Number of 1 Bits (Easy):** The bit counting technique used here is exactly the same problem. Practice counting bits efficiently.

3. **Subsets (Medium):** Generating all combinations of k items from n possibilities. Here we're generating all ways to place `turnedOn` bits across 10 positions, subject to hour/minute constraints.

The core pattern: when you need to generate all valid combinations subject to constraints, consider iterating through the valid output space and checking constraints, rather than generating all possibilities and filtering.

## Key Takeaways

1. **Constrained enumeration approach:** When the search space is small (like 720 possibilities), brute force checking all valid candidates is often the simplest and cleanest solution.

2. **Bit counting is a fundamental skill:** Many problems involve counting set bits. Know both the built-in methods and manual implementations using bit operations.

3. **Watch your formatting:** Interviewers notice details like proper time formatting. Always check output format requirements carefully.

Related problems: [Letter Combinations of a Phone Number](/problem/letter-combinations-of-a-phone-number), [Number of 1 Bits](/problem/number-of-1-bits)
