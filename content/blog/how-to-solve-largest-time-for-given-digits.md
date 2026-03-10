---
title: "How to Solve Largest Time for Given Digits — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Time for Given Digits. Medium difficulty, 35.8% acceptance rate. Topics: Array, String, Backtracking, Enumeration."
date: "2027-05-31"
category: "dsa-patterns"
tags: ["largest-time-for-given-digits", "array", "string", "backtracking", "medium"]
---

# How to Solve Largest Time for Given Digits

You're given an array of exactly 4 digits and need to arrange them into the latest possible valid 24-hour time (format "HH:MM"). The challenge is that you must use each digit exactly once, and the time must be valid (HH: 00-23, MM: 00-59). What makes this interesting is that brute force is actually acceptable here due to the small input size, but the real challenge is implementing it cleanly and handling all edge cases correctly.

## Visual Walkthrough

Let's walk through an example: `[1, 2, 3, 4]`

We need to try all permutations of these 4 digits and check which ones form valid times. The latest valid time will be our answer.

**Step 1: Generate all permutations**

- 1234, 1243, 1324, 1342, 1423, 1432, ...
- There are 4! = 24 permutations total

**Step 2: Check validity for each**
Take "1432":

- HH = 14 (valid, since 14 ≤ 23)
- MM = 32 (valid, since 32 ≤ 59)
- This is a valid time: 14:32

Take "2341":

- HH = 23 (valid)
- MM = 41 (valid)
- This is 23:41, which is later than 14:32

Take "2431":

- HH = 24 (invalid! 24 > 23)
- Skip this permutation

**Step 3: Find the maximum**
After checking all 24 permutations, we find that "2341" gives us 23:41, which is the latest possible valid time from these digits.

The key insight: We need to check ALL permutations, but we can optimize by sorting them or generating them in descending order to find the latest valid time faster.

## Brute Force Approach

The most straightforward approach is to:

1. Generate all permutations of the 4 digits
2. For each permutation, check if it forms a valid time
3. Keep track of the maximum valid time found
4. Format the result as "HH:MM" or return "" if no valid time exists

This is actually acceptable because with only 4 digits, there are only 24 permutations (4! = 24). Even the most naive implementation checking all permutations would be O(24 × 4) = O(96) operations, which is trivial.

However, a "naive" candidate might try to use nested loops to check combinations, which becomes messy with 4 nested loops and duplicate checking. Or they might try to use a greedy approach (always pick the largest digit for each position), which fails because the constraints between hours and minutes are interdependent.

For example, with digits `[0, 0, 3, 9]`:

- Greedy would pick 9 for first hour digit → 9 \_ \_ \_
- But then we might not be able to form valid minutes
- Actually, 09:30 is valid, but 09:03 is earlier than 09:30

## Optimized Approach

While brute force checking all permutations works, we can optimize by:

1. Sorting the digits in descending order first
2. Generating permutations in lexicographically descending order
3. Returning the FIRST valid time we find (which will be the latest)

Alternatively, we can generate all permutations and use string comparison to find the maximum valid time. Since "23:59" > "09:30" in string comparison (lexicographically), we can compare time strings directly.

The key optimization is in how we generate and check permutations. We can:

- Use backtracking to generate permutations
- Prune invalid branches early (e.g., if first digit > 2, skip)
- Use string comparison to find maximum

But given only 24 permutations, even simple brute force is fine. The real "optimization" is writing clean, correct code.

## Optimal Solution

Here's the complete solution using permutation generation and validation:

<div class="code-group">

```python
# Time: O(1) - fixed 24 permutations | Space: O(1) - fixed size storage
def largestTimeFromDigits(arr):
    """
    Find the latest valid 24-hour time using all 4 digits exactly once.

    Approach:
    1. Generate all permutations of the 4 digits
    2. For each permutation, check if it forms a valid time
    3. Track the maximum valid time found
    4. Format as "HH:MM" or return empty string if none valid
    """
    from itertools import permutations

    max_time = -1  # We'll store time as minutes for easy comparison
    result = ""

    # Generate all permutations of the 4 digits
    for perm in permutations(arr):
        # Extract hours and minutes from the permutation
        hours = perm[0] * 10 + perm[1]  # First two digits form HH
        minutes = perm[2] * 10 + perm[3]  # Last two digits form MM

        # Check if this is a valid 24-hour time
        if 0 <= hours <= 23 and 0 <= minutes <= 59:
            # Convert to total minutes for easy comparison
            total_minutes = hours * 60 + minutes

            # Update if this is the latest time so far
            if total_minutes > max_time:
                max_time = total_minutes
                result = f"{hours:02d}:{minutes:02d}"  # Format with leading zeros

    return result
```

```javascript
// Time: O(1) - fixed 24 permutations | Space: O(1) - fixed size storage
function largestTimeFromDigits(arr) {
  /**
   * Find the latest valid 24-hour time using all 4 digits exactly once.
   *
   * Approach:
   * 1. Generate all permutations of the 4 digits
   * 2. For each permutation, check if it forms a valid time
   * 3. Track the maximum valid time found
   * 4. Format as "HH:MM" or return empty string if none valid
   */

  let maxTime = -1; // Store time as minutes for easy comparison
  let result = "";

  // Helper function to generate permutations using backtracking
  function backtrack(start) {
    if (start === arr.length) {
      // We have a complete permutation
      const hours = arr[0] * 10 + arr[1]; // First two digits form HH
      const minutes = arr[2] * 10 + arr[3]; // Last two digits form MM

      // Check if this is a valid 24-hour time
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        const totalMinutes = hours * 60 + minutes;

        // Update if this is the latest time so far
        if (totalMinutes > maxTime) {
          maxTime = totalMinutes;
          // Format with leading zeros
          result = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        }
      }
      return;
    }

    // Generate permutations by swapping elements
    for (let i = start; i < arr.length; i++) {
      // Swap current element with start element
      [arr[start], arr[i]] = [arr[i], arr[start]];

      // Recursively generate permutations for remaining elements
      backtrack(start + 1);

      // Backtrack: swap back to restore original array
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }

  // Start generating permutations from index 0
  backtrack(0);

  return result;
}
```

```java
// Time: O(1) - fixed 24 permutations | Space: O(1) - fixed size storage
import java.util.*;

class Solution {
    public String largestTimeFromDigits(int[] arr) {
        /**
         * Find the latest valid 24-hour time using all 4 digits exactly once.
         *
         * Approach:
         * 1. Generate all permutations of the 4 digits
         * 2. For each permutation, check if it forms a valid time
         * 3. Track the maximum valid time found
         * 4. Format as "HH:MM" or return empty string if none valid
         */

        int maxTime = -1;  // Store time as minutes for easy comparison
        String result = "";

        // Generate all permutations using backtracking
        generatePermutations(arr, 0, maxTime, result);

        return result;
    }

    private void generatePermutations(int[] arr, int start, int maxTime, String result) {
        if (start == arr.length) {
            // We have a complete permutation
            int hours = arr[0] * 10 + arr[1];  // First two digits form HH
            int minutes = arr[2] * 10 + arr[3];  // Last two digits form MM

            // Check if this is a valid 24-hour time
            if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                int totalMinutes = hours * 60 + minutes;

                // Update if this is the latest time so far
                if (totalMinutes > maxTime) {
                    maxTime = totalMinutes;
                    // Format with leading zeros
                    result = String.format("%02d:%02d", hours, minutes);
                }
            }
            return;
        }

        // Generate permutations by swapping elements
        for (int i = start; i < arr.length; i++) {
            // Swap current element with start element
            swap(arr, start, i);

            // Recursively generate permutations for remaining elements
            generatePermutations(arr, start + 1, maxTime, result);

            // Backtrack: swap back to restore original array
            swap(arr, start, i);
        }
    }

    private void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) - Constant time

- We always have exactly 4 digits, so we generate at most 4! = 24 permutations
- Each permutation check takes O(1) time (constant operations)
- Total operations bounded by 24 × constant = O(1)

**Space Complexity:** O(1) - Constant space

- We use only a few variables to track max time and result
- Recursion depth is at most 4 (for backtracking solutions)
- No additional data structures that scale with input size

Even though we say O(1), in practice it's important to note that 24 permutations is very small, making this approach efficient.

## Common Mistakes

1. **Forgetting to check both hour and minute validity separately**: Hours must be 00-23, minutes must be 00-59. Some candidates check only the combined time or miss one bound.

2. **Not handling leading zeros correctly**: Times like "04:05" must be formatted as "04:05" not "4:5". Use string formatting with `padStart` (JS), `f"{hours:02d}"` (Python), or `String.format("%02d", hours)` (Java).

3. **Assuming greedy approach works**: Trying to place largest digits first doesn't work because of constraints. Example: `[2, 0, 6, 6]` - greedy might try 6 first, but valid time is "20:66" (invalid minutes). Correct answer is "06:26".

4. **Not checking all permutations**: Some candidates try to use sorting and picking, but miss valid combinations. With only 24 permutations, it's safer to check them all.

## When You'll See This Pattern

This problem combines **permutation generation** with **constraint validation**, a pattern seen in:

1. **"Next Permutation" (LeetCode 31)**: Similar permutation manipulation, but focused on finding the next lexicographic permutation.

2. **"Permutations" (LeetCode 46)**: Direct permutation generation problem, which is a core technique used here.

3. **"Valid Sudoku" (LeetCode 36)**: Different domain but similar concept of validating constraints on arranged digits.

4. **"Number of Valid Clock Times" (LeetCode 2437)**: Directly related problem about counting valid times with wildcards.

The core pattern is: when you need to arrange elements to satisfy constraints and the search space is small (n ≤ 10), permutation generation with pruning or full enumeration is often the right approach.

## Key Takeaways

1. **Small search space justifies brute force**: When n is small (especially n ≤ 10), don't overcomplicate - sometimes checking all permutations is the simplest correct solution.

2. **Constraint validation before optimization**: First ensure your solution correctly validates all constraints, then optimize if needed. For interviews, correctness is more important than micro-optimizations.

3. **Permutation generation is a fundamental skill**: Mastering backtracking for permutations (swap, recurse, backtrack) is essential for many combinatorial problems.

4. **Time as comparable integer**: Converting time to total minutes (hours × 60 + minutes) makes comparison straightforward without custom comparison functions.

Related problems: [Number of Valid Clock Times](/problem/number-of-valid-clock-times)
