---
title: "How to Solve Unique 3-Digit Even Numbers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Unique 3-Digit Even Numbers. Easy difficulty, 69.2% acceptance rate. Topics: Array, Hash Table, Recursion, Enumeration."
date: "2028-09-30"
category: "dsa-patterns"
tags: ["unique-3-digit-even-numbers", "array", "hash-table", "recursion", "easy"]
---

# How to Solve Unique 3-Digit Even Numbers

You're given an array of digits (0-9) and need to count how many distinct three-digit even numbers can be formed using these digits. The challenge is that you can only use each digit once per number, there can't be leading zeros, and you need to avoid counting duplicates. What makes this interesting is balancing the constraints: ensuring the last digit is even, the first digit isn't zero, and all digits come from your available pool.

## Visual Walkthrough

Let's walk through an example: `digits = [1, 2, 2, 3]`

We need to form 3-digit even numbers. The last digit must be even (0, 2, 4, 6, or 8), the first digit can't be 0, and all digits must come from our available digits.

**Step 1: Identify available even digits for the last position**
From `[1, 2, 2, 3]`, our even digits are: `2` and `2` (two copies of 2)

**Step 2: For each possible last digit, build valid numbers**

- Using the first `2` as last digit: Remaining digits are `[1, 2, 3]`
  - Possible first digits (non-zero): `1`, `2`, `3`
  - For each first digit, pick a middle digit from remaining:
    - First=1: Middle can be 2 or 3 → 122, 132
    - First=2: Middle can be 1 or 3 → 212, 232
    - First=3: Middle can be 1 or 2 → 312, 322
  - That's 6 numbers ending with this `2`

- Using the second `2` as last digit: Remaining digits are `[1, 2, 3]`
  - This gives the exact same 6 numbers as above!
  - We need to track uniqueness

**Step 3: Remove duplicates**
From our generated numbers: 122, 132, 212, 232, 312, 322
These are all distinct, so answer = 6

The key insight: we need to systematically generate all valid combinations while avoiding duplicates.

## Brute Force Approach

A naive approach would be to generate all permutations of 3 digits from the array, check if each forms a valid 3-digit even number, and store unique results. While conceptually simple, this has serious problems:

1. **Combinatorial explosion**: With n digits, there are nP₃ = n!/(n-3)! permutations. For n=10, that's 720 permutations; for n=100, it's 970,200!
2. **Duplicate handling**: With duplicate digits in the input, we'd generate identical numbers multiple times and need to deduplicate.
3. **Inefficiency**: We'd generate many invalid numbers (those starting with 0 or ending with odd digits) only to discard them.

The brute force would work for very small inputs but fails the efficiency requirements for larger ones. Let's see the optimal approach instead.

## Optimal Solution

The optimal approach uses systematic enumeration with careful constraints. We'll iterate through all possible combinations of three distinct positions in the digits array, ensuring:

1. The last digit is even
2. The first digit isn't 0
3. We don't count duplicate numbers

We use a set to track unique numbers and triple nested loops to pick digits for hundreds, tens, and units positions.

<div class="code-group">

```python
# Time: O(n³) but n ≤ 10, so effectively O(1) | Space: O(1) for fixed input size
def countUniqueThreeDigitEvenNumbers(digits):
    """
    Count distinct 3-digit even numbers that can be formed from given digits.

    Args:
        digits: List of integers 0-9

    Returns:
        Integer count of unique valid numbers
    """
    n = len(digits)
    unique_numbers = set()  # Use set to automatically handle duplicates

    # Iterate through all possible combinations of three positions
    for i in range(n):  # Hundreds place
        # Skip if digit is 0 (no leading zero)
        if digits[i] == 0:
            continue

        for j in range(n):  # Tens place
            # Ensure we use different positions
            if j == i:
                continue

            for k in range(n):  # Units place (must be even)
                # Skip if position already used or digit not even
                if k == i or k == j or digits[k] % 2 != 0:
                    continue

                # Form the 3-digit number: hundreds*100 + tens*10 + units
                number = digits[i] * 100 + digits[j] * 10 + digits[k]
                unique_numbers.add(number)  # Set automatically handles duplicates

    return len(unique_numbers)
```

```javascript
// Time: O(n³) but n ≤ 10, so effectively O(1) | Space: O(1) for fixed input size
function countUniqueThreeDigitEvenNumbers(digits) {
  /**
   * Count distinct 3-digit even numbers that can be formed from given digits.
   *
   * @param {number[]} digits - Array of integers 0-9
   * @return {number} Count of unique valid numbers
   */
  const n = digits.length;
  const uniqueNumbers = new Set(); // Use Set to automatically handle duplicates

  // Iterate through all possible combinations of three positions
  for (let i = 0; i < n; i++) {
    // Hundreds place
    // Skip if digit is 0 (no leading zero)
    if (digits[i] === 0) {
      continue;
    }

    for (let j = 0; j < n; j++) {
      // Tens place
      // Ensure we use different positions
      if (j === i) {
        continue;
      }

      for (let k = 0; k < n; k++) {
        // Units place (must be even)
        // Skip if position already used or digit not even
        if (k === i || k === j || digits[k] % 2 !== 0) {
          continue;
        }

        // Form the 3-digit number: hundreds*100 + tens*10 + units
        const number = digits[i] * 100 + digits[j] * 10 + digits[k];
        uniqueNumbers.add(number); // Set automatically handles duplicates
      }
    }
  }

  return uniqueNumbers.size;
}
```

```java
// Time: O(n³) but n ≤ 10, so effectively O(1) | Space: O(1) for fixed input size
import java.util.HashSet;
import java.util.Set;

public class Solution {
    public int countUniqueThreeDigitEvenNumbers(int[] digits) {
        /**
         * Count distinct 3-digit even numbers that can be formed from given digits.
         *
         * @param digits: Array of integers 0-9
         * @return Integer count of unique valid numbers
         */
        int n = digits.length;
        Set<Integer> uniqueNumbers = new HashSet<>();  // Use Set to automatically handle duplicates

        // Iterate through all possible combinations of three positions
        for (int i = 0; i < n; i++) {  // Hundreds place
            // Skip if digit is 0 (no leading zero)
            if (digits[i] == 0) {
                continue;
            }

            for (int j = 0; j < n; j++) {  // Tens place
                // Ensure we use different positions
                if (j == i) {
                    continue;
                }

                for (int k = 0; k < n; k++) {  // Units place (must be even)
                    // Skip if position already used or digit not even
                    if (k == i || k == j || digits[k] % 2 != 0) {
                        continue;
                    }

                    // Form the 3-digit number: hundreds*100 + tens*10 + units
                    int number = digits[i] * 100 + digits[j] * 10 + digits[k];
                    uniqueNumbers.add(number);  // Set automatically handles duplicates
                }
            }
        }

        return uniqueNumbers.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n³) in theory, but practically O(1) since n ≤ 10

- We have three nested loops over n elements each: O(n³)
- However, the problem constraints typically limit n to at most 10 (digits 0-9)
- With n=10, that's 10³ = 1000 iterations, which is constant time
- Even if we consider all permutations, 10P₃ = 720 maximum valid combinations to check

**Space Complexity**: O(1) for fixed input size, or O(U) where U is number of unique valid numbers

- We store unique numbers in a set
- Maximum possible unique 3-digit even numbers is 9 × 10 × 5 = 450
- This is constant regardless of input size
- Auxiliary space for loops and variables is O(1)

## Common Mistakes

1. **Forgetting to check for leading zeros**: Many candidates correctly check that the last digit is even but forget that the first digit can't be 0. A number like "012" is not a valid 3-digit number.

2. **Not handling duplicate digits properly**: With inputs like `[2, 2, 2]`, some candidates might count 222 multiple times. Using a set to store results (as we do) or carefully tracking used indices solves this.

3. **Using the same digit multiple times in a number**: When picking positions i, j, k, you must ensure i ≠ j ≠ k. Forgetting these checks leads to invalid numbers using the same digit twice.

4. **Inefficient duplicate checking**: Some candidates store all generated numbers in a list and check `if number not in list` for each new number. This is O(n) per check! Using a set gives O(1) lookups.

## When You'll See This Pattern

This combinatorial enumeration pattern appears in many problems where you need to generate valid combinations or permutations with constraints:

1. **"Combination Sum" problems** (LeetCode 39, 40): Similar systematic enumeration to find combinations that sum to a target, though usually with recursion/backtracking.

2. **"Letter Combinations of a Phone Number"** (LeetCode 17): Generating all possible letter combinations from phone digits uses similar exhaustive enumeration.

3. **"Permutations"** (LeetCode 46, 47): Generating all permutations of an array, especially when dealing with duplicates (LeetCode 47).

The core pattern is: when you need to explore all valid combinations/permutations of a limited size from a given set, nested loops (for small fixed sizes) or backtracking (for variable sizes) are the go-to approaches.

## Key Takeaways

1. **Constraint-first enumeration**: When generating combinations with multiple constraints (even last digit, no leading zero), apply the most restrictive constraints first. Here, we check the last digit is even early to prune invalid branches.

2. **Use appropriate data structures for uniqueness**: Sets automatically handle duplicates, making them perfect for problems requiring distinct results from potentially duplicate inputs.

3. **Know when brute force is acceptable**: For small fixed output sizes (like 3-digit numbers), sometimes the simple O(n³) approach is fine and more readable than complex optimizations. Always consider input constraints before over-engineering.

Related problems: [Finding 3-Digit Even Numbers](/problem/finding-3-digit-even-numbers)
