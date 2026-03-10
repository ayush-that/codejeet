---
title: "How to Solve Sequential Digits — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sequential Digits. Medium difficulty, 65.3% acceptance rate. Topics: Enumeration."
date: "2028-06-15"
category: "dsa-patterns"
tags: ["sequential-digits", "enumeration", "medium"]
---

# How to Solve Sequential Digits

A sequential digit number has each digit exactly one greater than the previous digit (like 123, 4567, or 89). Given a range [low, high], we need to return all sequential digit numbers within that range, sorted. The challenge is generating these numbers efficiently without checking every number in the range, which could be computationally expensive for large ranges.

## Visual Walkthrough

Let's trace through an example with low = 100, high = 300.

**What are sequential digits?**

- Valid: 123 (1→2→3), 234 (2→3→4), 45 (4→5)
- Invalid: 124 (2→4 is +2), 321 (decreasing), 112 (1→1 is +0)

**How do we generate them systematically?**
We can think of them as sequences starting from different digits:

- Starting with 1: 12, 123, 1234, 12345, 123456, 1234567, 12345678, 123456789
- Starting with 2: 23, 234, 2345, 23456, 234567, 2345678, 23456789
- Starting with 3: 34, 345, 3456, 34567, 345678, 3456789
- ... up to starting with 8: 89

For our range [100, 300]:

1. Check sequences starting with 1: 123 fits (100 ≤ 123 ≤ 300)
2. Check sequences starting with 2: 234 fits (100 ≤ 234 ≤ 300)
3. Check sequences starting with 3: 345 doesn't fit (345 > 300)
4. Also check shorter sequences: 12 (too small), 23 (too small), 34 (fits!), 45 (fits!), 56 (fits!), 67 (fits!), 78 (fits!), 89 (fits!)

Wait, we need to be careful! 34, 45, 56, 67, 78, 89 are all between 100 and 300? No, 34 is less than 100. Let's think more carefully...

Actually, we need to consider both the starting digit AND the length of the sequence. Let's generate all possible sequential numbers systematically:

For each starting digit (1-8) and each length (2-9):

- Starting digit 1, length 2: 12 (too small)
- Starting digit 1, length 3: 123 (fits!)
- Starting digit 1, length 4: 1234 (too large)
- Starting digit 2, length 2: 23 (too small)
- Starting digit 2, length 3: 234 (fits!)
- Starting digit 2, length 4: 2345 (too large)
- Starting digit 3, length 2: 34 (too small)
- Starting digit 3, length 3: 345 (too large)

So for [100, 300], we get: 123, 234

## Brute Force Approach

A naive approach would be to iterate through every number from low to high, check if it has sequential digits, and add it to the result if it does.

**Why this is inefficient:**

1. We might check millions of numbers unnecessarily
2. Checking if a number has sequential digits requires converting it to a string or extracting digits
3. Most numbers in a large range won't be sequential

**The inefficiency becomes clear with an example:**
If low = 10 and high = 10^9, we'd check nearly a billion numbers, but there are only 36 possible sequential digit numbers total (8 starting digits × (8 possible lengths for digit 1, 7 for digit 2, etc.) minus some overlaps).

**Brute force code structure:**

```python
def sequentialDigits(low, high):
    result = []
    for num in range(low, high + 1):
        s = str(num)
        is_sequential = True
        for i in range(len(s) - 1):
            if int(s[i]) + 1 != int(s[i + 1]):
                is_sequential = False
                break
        if is_sequential:
            result.append(num)
    return result
```

This has O((high-low) × d) time complexity where d is the average number of digits - far too slow for large ranges.

## Optimized Approach

The key insight is that **there are only 36 possible sequential digit numbers total** (from 12 to 123456789). We can generate all of them once and filter those within [low, high].

**Why only 36?**

- Shortest sequential number: 12 (2 digits)
- Longest sequential number: 123456789 (9 digits)
- For each starting digit (1-8), we can create sequences of length 2 up to (10 - starting digit)
- Total count: (8 + 7 + 6 + 5 + 4 + 3 + 2 + 1) = 36

**Generation strategy:**

1. For each starting digit from 1 to 8
2. For each length from 2 to (10 - starting digit)
3. Build the number by adding consecutive digits
4. Check if it's within [low, high]

**Alternative approach:**
We can also generate using a sliding window of digits "123456789":

- Take substring of length 2: 12, 23, 34, ..., 89
- Take substring of length 3: 123, 234, 345, ..., 789
- And so on up to length 9: 123456789

This is cleaner because we're just taking substrings of a constant string.

## Optimal Solution

We'll use the sliding window approach on the string "123456789". For each possible length (2 to 9), we slide a window of that length across the string, convert the substring to a number, and check if it's within our range.

<div class="code-group">

```python
# Time: O(1) - fixed 36 iterations | Space: O(1) - fixed 36 results max
def sequentialDigits(low, high):
    """
    Generate all sequential digit numbers in [low, high] using sliding window.
    """
    result = []
    # All sequential digits are substrings of this base string
    digits = "123456789"

    # Try all possible lengths from 2 to 9 digits
    for length in range(2, 10):
        # Slide window of current length across the digits string
        for start in range(0, 10 - length):
            # Extract substring and convert to integer
            num = int(digits[start:start + length])

            # Check if number is within our target range
            if low <= num <= high:
                result.append(num)
            # Since we generate numbers in increasing order,
            # we can break early if num exceeds high
            elif num > high:
                # For this length, all subsequent numbers will be larger
                # But we can't break the outer loop because shorter lengths
                # might still have valid numbers
                break

    return result
```

```javascript
// Time: O(1) - fixed 36 iterations | Space: O(1) - fixed 36 results max
function sequentialDigits(low, high) {
  /**
   * Generate all sequential digit numbers in [low, high] using sliding window.
   */
  const result = [];
  // All sequential digits are substrings of this base string
  const digits = "123456789";

  // Try all possible lengths from 2 to 9 digits
  for (let length = 2; length <= 9; length++) {
    // Slide window of current length across the digits string
    for (let start = 0; start <= 9 - length; start++) {
      // Extract substring and convert to integer
      const num = parseInt(digits.substring(start, start + length), 10);

      // Check if number is within our target range
      if (low <= num && num <= high) {
        result.push(num);
      } else if (num > high) {
        // For this length, all subsequent numbers will be larger
        // Break only the inner loop
        break;
      }
    }
  }

  return result;
}
```

```java
// Time: O(1) - fixed 36 iterations | Space: O(1) - fixed 36 results max
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> sequentialDigits(int low, int high) {
        /**
         * Generate all sequential digit numbers in [low, high] using sliding window.
         */
        List<Integer> result = new ArrayList<>();
        // All sequential digits are substrings of this base string
        String digits = "123456789";

        // Try all possible lengths from 2 to 9 digits
        for (int length = 2; length <= 9; length++) {
            // Slide window of current length across the digits string
            for (int start = 0; start <= 9 - length; start++) {
                // Extract substring and convert to integer
                int num = Integer.parseInt(digits.substring(start, start + length));

                // Check if number is within our target range
                if (low <= num && num <= high) {
                    result.add(num);
                } else if (num > high) {
                    // For this length, all subsequent numbers will be larger
                    // Break only the inner loop
                    break;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We generate at most 36 numbers (8+7+6+5+4+3+2+1 = 36)
- Each generation involves substring extraction and integer conversion, both O(length) but length ≤ 9
- Total operations are bounded by a constant, independent of input size

**Space Complexity: O(1)**

- We store at most 36 results in the output list
- The digits string is constant size (9 characters)
- No recursion or dynamic data structures that grow with input

**Why constant time matters:**
Even if low = 10 and high = 10^9, our algorithm still does the same 36 iterations. The brute force would do ~1 billion iterations.

## Common Mistakes

1. **Off-by-one errors in loop boundaries:**
   - Starting digit should go from 1 to 8 (not 9, since we need at least 2 digits)
   - When using substring approach, window start goes from 0 to 9-length (inclusive)
   - Example mistake: `for start in range(0, 9 - length)` misses the last valid start position

2. **Forgetting that numbers must be sorted:**
   - Our approach naturally generates numbers in sorted order because we iterate by increasing length and increasing starting position
   - If you use a different generation order, you might need to sort at the end
   - The problem explicitly requires sorted output

3. **Incorrect handling of single-digit numbers:**
   - Single-digit numbers (1-9) are NOT sequential digits by definition (need at least 2 digits)
   - Some candidates might include them, but the problem says "each digit is one more than the previous" - with only one digit, there's no "previous"

4. **Not breaking early when num > high:**
   - Since we generate numbers in increasing order for each length, once we exceed high, we can break the inner loop
   - But we can't break the outer loop because shorter lengths might still have valid numbers
   - Example: low=1000, high=2000. Length 4 gives 1234, 2345 (both >2000), but length 3 gives 123 (too small) and 234, 345,... 789 (all <1000)

## When You'll See This Pattern

This problem uses **enumeration of a constrained solution space** - a pattern where instead of searching through all possibilities, we identify that valid solutions come from a small, well-defined set that we can generate systematically.

**Related LeetCode problems:**

1. **"Letter Combinations of a Phone Number" (LeetCode 17)**
   - Similar pattern: Instead of generating all possible strings, we systematically combine digits with their corresponding letters
   - Both problems involve generating combinations from a fixed set of possibilities

2. **"Combination Sum" (LeetCode 39)**
   - While more complex, it also involves systematically exploring a solution space
   - The key insight is recognizing how to generate candidates without duplication

3. **"Permutations" (LeetCode 46)**
   - Another enumeration problem where we generate all permutations systematically
   - Both require careful tracking of what's been used/generated

The core technique is recognizing when the solution space is small enough to enumerate completely, rather than searching through a much larger space.

## Key Takeaways

1. **Look for constrained solution spaces:** When a problem seems to require checking many possibilities, check if the valid solutions follow a pattern that makes them few in number. Sequential digits have a very specific structure that limits them to just 36 possibilities.

2. **Precomputation is powerful:** If you can generate all valid answers independently of the input range, you can filter them quickly. This is often faster than generating answers specific to each input.

3. **String manipulation for digit problems:** When dealing with digit patterns, converting to strings or character arrays often simplifies the logic. The sliding window on "123456789" is cleaner than arithmetic digit generation.

Remember: Interviewers love seeing candidates who recognize when brute force is unnecessary and find the mathematical or structural insight that simplifies the problem.

[Practice this problem on CodeJeet](/problem/sequential-digits)
