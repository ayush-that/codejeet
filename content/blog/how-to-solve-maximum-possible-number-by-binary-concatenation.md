---
title: "How to Solve Maximum Possible Number by Binary Concatenation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Possible Number by Binary Concatenation. Medium difficulty, 65.5% acceptance rate. Topics: Array, Bit Manipulation, Enumeration."
date: "2029-01-07"
category: "dsa-patterns"
tags:
  [
    "maximum-possible-number-by-binary-concatenation",
    "array",
    "bit-manipulation",
    "enumeration",
    "medium",
  ]
---

# How to Solve Maximum Possible Number by Binary Concatenation

This problem asks us to take three integers, convert each to binary, and concatenate these binary strings in some order to form the largest possible resulting number when interpreted as binary. The challenge lies in determining the optimal concatenation order without actually trying all permutations through brute force. What makes this interesting is that the "best" order isn't simply sorting by numeric value—it depends on how the binary representations interact when concatenated.

## Visual Walkthrough

Let's work through an example: `nums = [1, 2, 3]`

**Step 1: Convert each number to binary:**

- 1 → "1"
- 2 → "10"
- 3 → "11"

**Step 2: Consider different concatenation orders:**

- Order [1, 2, 3]: "1" + "10" + "11" = "11011" = 27 in decimal
- Order [1, 3, 2]: "1" + "11" + "10" = "11110" = 30 in decimal
- Order [2, 1, 3]: "10" + "1" + "11" = "10111" = 23 in decimal
- Order [2, 3, 1]: "10" + "11" + "1" = "10111" = 23 in decimal
- Order [3, 1, 2]: "11" + "1" + "10" = "11110" = 30 in decimal
- Order [3, 2, 1]: "11" + "10" + "1" = "11101" = 29 in decimal

**Step 3: Find the maximum:**
The maximum value is 30, achieved with orders [1, 3, 2] and [3, 1, 2].

**Key Insight:** Notice that "1" + "11" = "111" is larger than "11" + "1" = "111" (they're equal in this case). But more importantly, when comparing "10" and "1", "1" + "10" = "110" (6) while "10" + "1" = "101" (5). This suggests we need a custom comparison: for two binary strings A and B, we should place A before B if A+B > B+A (when both are interpreted as binary strings).

## Brute Force Approach

The most straightforward approach is to generate all 6 permutations (3! = 6) of the three numbers, convert each to binary, concatenate them, convert the binary string back to decimal, and track the maximum. While this works for exactly 3 numbers (making it O(3! × 3 × L) where L is binary length), it doesn't scale well conceptually and doesn't teach us the underlying pattern.

However, let's think about what a naive candidate might try: simply sorting the numbers in descending order and concatenating. For our example [1, 2, 3], descending order [3, 2, 1] gives "11101" = 29, which is NOT the maximum (30). So simple numeric sorting fails.

## Optimized Approach

The key insight is that this is essentially a **custom sorting problem**. We need to sort the numbers according to a comparator that determines which order produces a larger concatenated binary string.

For two numbers `a` and `b` with binary representations `bin_a` and `bin_b`:

- If `bin_a + bin_b` (concatenation) > `bin_b + bin_a`, then `a` should come before `b`
- Otherwise, `b` should come before `a`

This is similar to the "Largest Number" problem (LeetCode 179), but with binary instead of decimal.

**Why this works:** When we're trying to maximize the final binary string, we want the most significant bits to be 1s as early as possible. By comparing concatenations directly, we account for how the binary representations interact—specifically, how the bits of one number combine with the bits of another when placed adjacent.

**Step-by-step reasoning:**

1. Convert all numbers to binary strings (without '0b' prefix)
2. Sort these binary strings using a custom comparator that compares `a+b` vs `b+a`
3. Concatenate the sorted binary strings
4. Convert the resulting binary string back to decimal

**Edge Cases:**

- If all numbers are 0, the result should be 0
- The binary representation of 0 is "0" (not an empty string)
- Numbers can be up to 10^7, so their binary representation length is at most 24 bits

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) - fixed 3 elements, but O(n log n) for general case
# Space: O(1) - fixed storage for 3 binary strings
def max_possible_number(nums):
    """
    Returns the maximum possible number by concatenating binary representations
    of the three input numbers in some order.
    """
    # Step 1: Convert all numbers to binary strings without '0b' prefix
    # We use bin(x)[2:] to get the binary representation
    bin_strs = [bin(num)[2:] for num in nums]

    # Step 2: Sort using custom comparator
    # For 3 elements, we can manually check all comparisons
    # The comparator: a comes before b if a+b > b+a (lexicographically for binary)

    # We'll implement a simple bubble-sort-like approach for clarity
    # since we only have 3 elements
    arr = bin_strs[:]  # Make a copy to sort

    # Compare and swap elements to get them in correct order
    # First, ensure arr[0] and arr[1] are in correct order
    if arr[0] + arr[1] < arr[1] + arr[0]:
        arr[0], arr[1] = arr[1], arr[0]

    # Then ensure arr[1] and arr[2] are in correct order
    if arr[1] + arr[2] < arr[2] + arr[1]:
        arr[1], arr[2] = arr[2], arr[1]

    # Finally, ensure arr[0] and arr[1] are still in correct order
    if arr[0] + arr[1] < arr[1] + arr[0]:
        arr[0], arr[1] = arr[1], arr[0]

    # Step 3: Concatenate the sorted binary strings
    result_bin = ''.join(arr)

    # Step 4: Convert binary string to decimal integer
    # Handle edge case where result might be empty (shouldn't happen with 3 numbers)
    if not result_bin:
        return 0

    return int(result_bin, 2)

# Alternative implementation using Python's sort with custom key
def max_possible_number_sort(nums):
    """Alternative implementation using sort with custom comparator."""
    # Convert to binary strings
    bin_strs = [bin(num)[2:] for num in nums]

    # Sort with custom comparator using functools.cmp_to_key
    from functools import cmp_to_key

    def compare(a, b):
        # Return negative if a should come before b
        if a + b > b + a:
            return -1
        elif a + b < b + a:
            return 1
        else:
            return 0

    bin_strs.sort(key=cmp_to_key(compare))

    # Concatenate and convert to decimal
    result_bin = ''.join(bin_strs)
    return int(result_bin, 2) if result_bin else 0
```

```javascript
// Time: O(1) - fixed 3 elements, but O(n log n) for general case
// Space: O(1) - fixed storage for 3 binary strings
function maxPossibleNumber(nums) {
  // Step 1: Convert all numbers to binary strings without '0b' prefix
  // Use toString(2) to get binary representation
  const binStrs = nums.map((num) => num.toString(2));

  // Step 2: Sort using custom comparator
  // For 3 elements, we can manually check all comparisons
  // The comparator: a comes before b if a+b > b+a (lexicographically for binary)

  // Make a copy to sort
  const arr = [...binStrs];

  // Compare and swap elements to get them in correct order
  // First, ensure arr[0] and arr[1] are in correct order
  if (arr[0] + arr[1] < arr[1] + arr[0]) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }

  // Then ensure arr[1] and arr[2] are in correct order
  if (arr[1] + arr[2] < arr[2] + arr[1]) {
    [arr[1], arr[2]] = [arr[2], arr[1]];
  }

  // Finally, ensure arr[0] and arr[1] are still in correct order
  if (arr[0] + arr[1] < arr[1] + arr[0]) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }

  // Step 3: Concatenate the sorted binary strings
  const resultBin = arr.join("");

  // Step 4: Convert binary string to decimal integer
  // Handle edge case where result might be empty
  if (!resultBin) return 0;

  return parseInt(resultBin, 2);
}

// Alternative implementation using sort with custom comparator
function maxPossibleNumberSort(nums) {
  // Convert to binary strings
  const binStrs = nums.map((num) => num.toString(2));

  // Sort with custom comparator
  binStrs.sort((a, b) => {
    // Return negative if a should come before b
    if (a + b > b + a) return -1;
    if (a + b < b + a) return 1;
    return 0;
  });

  // Concatenate and convert to decimal
  const resultBin = binStrs.join("");
  return resultBin ? parseInt(resultBin, 2) : 0;
}
```

```java
// Time: O(1) - fixed 3 elements, but O(n log n) for general case
// Space: O(1) - fixed storage for 3 binary strings
import java.util.Arrays;

class Solution {
    public int maxPossibleNumber(int[] nums) {
        // Step 1: Convert all numbers to binary strings without '0b' prefix
        String[] binStrs = new String[3];
        for (int i = 0; i < 3; i++) {
            binStrs[i] = Integer.toBinaryString(nums[i]);
        }

        // Step 2: Sort using custom comparator
        // For 3 elements, we can manually check all comparisons
        // The comparator: a comes before b if a+b > b+a (lexicographically for binary)

        // Make a copy to sort
        String[] arr = binStrs.clone();

        // Compare and swap elements to get them in correct order
        // First, ensure arr[0] and arr[1] are in correct order
        if ((arr[0] + arr[1]).compareTo(arr[1] + arr[0]) < 0) {
            String temp = arr[0];
            arr[0] = arr[1];
            arr[1] = temp;
        }

        // Then ensure arr[1] and arr[2] are in correct order
        if ((arr[1] + arr[2]).compareTo(arr[2] + arr[1]) < 0) {
            String temp = arr[1];
            arr[1] = arr[2];
            arr[2] = temp;
        }

        // Finally, ensure arr[0] and arr[1] are still in correct order
        if ((arr[0] + arr[1]).compareTo(arr[1] + arr[0]) < 0) {
            String temp = arr[0];
            arr[0] = arr[1];
            arr[1] = temp;
        }

        // Step 3: Concatenate the sorted binary strings
        StringBuilder resultBuilder = new StringBuilder();
        for (String s : arr) {
            resultBuilder.append(s);
        }
        String resultBin = resultBuilder.toString();

        // Step 4: Convert binary string to decimal integer
        // Handle edge case where result might be empty
        if (resultBin.isEmpty()) {
            return 0;
        }

        return Integer.parseInt(resultBin, 2);
    }

    // Alternative implementation using Arrays.sort with custom Comparator
    public int maxPossibleNumberSort(int[] nums) {
        // Convert to binary strings
        String[] binStrs = new String[3];
        for (int i = 0; i < 3; i++) {
            binStrs[i] = Integer.toBinaryString(nums[i]);
        }

        // Sort with custom comparator
        Arrays.sort(binStrs, (a, b) -> {
            String ab = a + b;
            String ba = b + a;
            // Reverse order for descending (largest first)
            return ba.compareTo(ab);
        });

        // Concatenate and convert to decimal
        StringBuilder resultBuilder = new StringBuilder();
        for (String s : binStrs) {
            resultBuilder.append(s);
        }
        String resultBin = resultBuilder.toString();

        return resultBin.isEmpty() ? 0 : Integer.parseInt(resultBin, 2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Converting each number to binary: O(log M) per number, where M is the maximum value (up to 10^7, so at most 24 bits)
- Sorting: For exactly 3 numbers, we can do it in O(1) with fixed comparisons. For n numbers, it would be O(n log n) comparisons, with each comparison taking O(L) where L is the maximum binary length
- Concatenation: O(n × L)
- Binary to decimal conversion: O(n × L)

For the specific problem with exactly 3 numbers: **O(1)** time (constant operations).

**Space Complexity:**

- Storing binary strings: O(n × L) where n=3 and L≤24
- Sorting overhead: O(1) for fixed 3 elements
- Overall: **O(1)** (constant space for fixed input size)

## Common Mistakes

1. **Sorting by numeric value instead of concatenation value**: As shown in the example, [3, 2, 1] doesn't necessarily produce the maximum result. Always compare concatenations, not the numbers themselves.

2. **Forgetting to handle the binary representation of 0**: `bin(0)` gives "0b0", so we need `[2:]` to get "0". Some implementations might incorrectly return an empty string or cause conversion errors.

3. **Incorrect binary string comparison**: When comparing `a+b` vs `b+a`, we must compare them as strings, not as numbers. For example, "10" + "1" = "101" should be compared to "1" + "10" = "110" as strings, not as the numbers 101 and 110.

4. **Not considering all permutations in brute force**: With 3 numbers, there are only 6 permutations, but candidates might miss some or incorrectly implement permutation generation.

## When You'll See This Pattern

This pattern of **custom sorting based on concatenation** appears in several problems:

1. **Largest Number (LeetCode 179)**: Almost identical problem but with decimal numbers instead of binary. The solution uses the same comparator: sort strings such that `a+b > b+a`.

2. **Reorder Data in Log Files (LeetCode 937)**: Requires custom sorting of log entries with different comparison rules for letter-logs vs digit-logs.

3. **Custom Sort String (LeetCode 791)**: Sort characters in a string according to a custom order defined by another string.

The core insight is recognizing when the optimal arrangement depends on pairwise relationships rather than individual values. Whenever you need to arrange items to maximize/minimize concatenation or some combined value, think about defining a custom comparator.

## Key Takeaways

1. **Concatenation optimization often requires pairwise comparison**: When trying to maximize a concatenated result, compare `a+b` vs `b+a` to determine which order is better.

2. **Binary representation matters**: Remember that `bin()` in Python includes '0b' prefix, `toString(2)` in JavaScript gives binary without prefix, and `Integer.toBinaryString()` in Java gives binary without prefix.

3. **Small input size allows simpler approaches**: With only 3 elements, we can use simple comparison logic instead of full sorting algorithms, but understanding the general pattern (custom comparator sorting) is what interviewers really want to see.

Related problems: [Concatenation of Consecutive Binary Numbers](/problem/concatenation-of-consecutive-binary-numbers)
