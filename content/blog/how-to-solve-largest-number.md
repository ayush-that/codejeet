---
title: "How to Solve Largest Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Number. Medium difficulty, 42.6% acceptance rate. Topics: Array, String, Greedy, Sorting."
date: "2026-12-14"
category: "dsa-patterns"
tags: ["largest-number", "array", "string", "greedy", "medium"]
---

# How to Solve Largest Number

Given a list of non-negative integers, we need to arrange them to form the largest possible number and return it as a string. The challenge lies in determining the correct ordering—it's not simply sorting by numeric value (e.g., 9 vs. 34: 9 should come before 34 because "934" > "349"). This problem tests your understanding of custom sorting and string manipulation.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 30, 34, 5, 9]`

If we sort normally in descending order, we get: `[34, 30, 9, 5, 3]` → "3430953"

But the largest number is actually "9534330". Let's see why:

We need to compare pairs of numbers based on their concatenated forms:

- Compare "3" and "30": "330" vs. "303" → "330" > "303", so 3 should come before 30
- Compare "30" and "34": "3034" vs. "3430" → "3430" > "3034", so 34 should come before 30
- Compare "34" and "5": "345" vs. "534" → "534" > "345", so 5 should come before 34
- Compare "5" and "9": "59" vs. "95" → "95" > "59", so 9 should come before 5

Following this pairwise comparison logic, the sorted order becomes: `[9, 5, 34, 3, 30]` → "9534330"

## Brute Force Approach

A brute force solution would generate all permutations of the numbers, convert each permutation to a string, and keep track of the maximum. For an array of length n, there are n! permutations, making this approach O(n! × n) time complexity—completely impractical for even moderately sized inputs.

What some candidates might try is sorting the numbers in descending order by their numeric values. This fails because it doesn't account for how numbers combine when concatenated. For example, with `[3, 30, 34]`, numeric sorting gives `[34, 30, 3]` → "34303", but the correct answer is "34330" (from `[34, 3, 30]`).

## Optimized Approach

The key insight is that we need a custom comparator for sorting. For any two numbers a and b, we should compare their concatenations in both orders: "a"+"b" vs. "b"+"a". If "a"+"b" > "b"+"a", then a should come before b in our sorted array.

This works because:

1. It handles cases where numbers have different lengths but share prefixes (like 3 vs. 30)
2. It's transitive: if a > b and b > c by this comparison, then a > c
3. It naturally handles the edge case of leading zeros (if all numbers are 0, we get "0" not "00...0")

We convert all numbers to strings first because:

- String comparison is lexicographic, which works perfectly for our concatenation test
- It avoids integer overflow when dealing with large concatenated numbers
- It's more efficient than repeatedly converting numbers during comparisons

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
# n = length of nums array
def largestNumber(nums):
    """
    Arrange numbers to form the largest possible number.

    Approach:
    1. Convert all numbers to strings for easy concatenation
    2. Sort using custom comparator: for strings a and b, compare a+b vs b+a
    3. Join sorted strings
    4. Handle edge case where result starts with '0' (all numbers are 0)
    """

    # Step 1: Convert to strings
    # This allows us to concatenate easily and compare lexicographically
    str_nums = [str(num) for num in nums]

    # Step 2: Custom sort
    # We define a comparator function that compares concatenated strings
    # If a+b > b+a, then a should come before b (descending order)
    # We use a custom key function with functools.cmp_to_key for Python 3
    def compare(a, b):
        # Compare concatenations in both orders
        if a + b > b + a:
            return -1  # a comes before b
        elif a + b < b + a:
            return 1   # b comes before a
        else:
            return 0   # equal

    # Sort using our custom comparator
    # Note: We need to convert the comparator to a key function for Python's sort
    from functools import cmp_to_key
    str_nums.sort(key=cmp_to_key(compare))

    # Step 3: Join all strings
    result = ''.join(str_nums)

    # Step 4: Handle edge case where result starts with '0'
    # This happens when all numbers are 0, e.g., [0, 0, 0] -> "000" -> "0"
    if result[0] == '0':
        return '0'

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
// n = length of nums array
function largestNumber(nums) {
  /**
   * Arrange numbers to form the largest possible number.
   *
   * Approach:
   * 1. Convert all numbers to strings for easy concatenation
   * 2. Sort using custom comparator: for strings a and b, compare a+b vs b+a
   * 3. Join sorted strings
   * 4. Handle edge case where result starts with '0' (all numbers are 0)
   */

  // Step 1: Convert to strings
  // This allows us to concatenate easily and compare lexicographically
  const strNums = nums.map((num) => num.toString());

  // Step 2: Custom sort
  // We define a comparator function that compares concatenated strings
  // If a+b > b+a, then a should come before b (descending order)
  strNums.sort((a, b) => {
    // Compare concatenations in both orders
    const order1 = a + b;
    const order2 = b + a;

    // Return negative if a should come before b
    // Return positive if b should come before a
    // Return 0 if equal
    if (order1 > order2) {
      return -1;
    } else if (order1 < order2) {
      return 1;
    } else {
      return 0;
    }
  });

  // Step 3: Join all strings
  let result = strNums.join("");

  // Step 4: Handle edge case where result starts with '0'
  // This happens when all numbers are 0, e.g., [0, 0, 0] -> "000" -> "0"
  if (result[0] === "0") {
    return "0";
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
// n = length of nums array
import java.util.*;

class Solution {
    public String largestNumber(int[] nums) {
        /**
         * Arrange numbers to form the largest possible number.
         *
         * Approach:
         * 1. Convert all numbers to strings for easy concatenation
         * 2. Sort using custom comparator: for strings a and b, compare a+b vs b+a
         * 3. Join sorted strings
         * 4. Handle edge case where result starts with '0' (all numbers are 0)
         */

        // Step 1: Convert to strings
        // This allows us to concatenate easily and compare lexicographically
        String[] strNums = new String[nums.length];
        for (int i = 0; i < nums.length; i++) {
            strNums[i] = String.valueOf(nums[i]);
        }

        // Step 2: Custom sort
        // We define a comparator that compares concatenated strings
        // If a+b > b+a, then a should come before b (descending order)
        Arrays.sort(strNums, new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                // Compare concatenations in both orders
                String order1 = a + b;
                String order2 = b + a;

                // Return negative if a should come before b
                // Return positive if b should come before a
                // Return 0 if equal
                // Note: compareTo returns negative if order1 < order2,
                // but we want descending order, so we reverse the comparison
                return order2.compareTo(order1);
            }
        });

        // Step 3: Join all strings
        // Edge case: if the largest number is "0", the result should be "0"
        if (strNums[0].equals("0")) {
            return "0";
        }

        StringBuilder result = new StringBuilder();
        for (String numStr : strNums) {
            result.append(numStr);
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Converting all numbers to strings: O(n)
- Sorting with custom comparator: O(n log n) comparisons, where each comparison takes O(k) time (k = average string length). However, since string lengths are bounded by the number of digits in the largest number (which is constant for practical purposes), we consider comparisons O(1), giving us O(n log n) overall.
- Building the final string: O(n)

**Space Complexity: O(n)**

- We store string representations of all numbers: O(n)
- The sorting algorithm may use additional space (typically O(log n) for quicksort or O(n) for mergesort in worst case)
- The final result string: O(n)

## Common Mistakes

1. **Not handling the all-zeros case**: If all numbers are 0, the result would be "000...0" instead of "0". Always check if the first character of your result is '0' after sorting.

2. **Using numeric comparison instead of string concatenation comparison**: Sorting by numeric value fails for cases like 3 vs. 30. Remember: "330" > "303", so 3 > 30 in our custom ordering.

3. **Forgetting to convert to strings before sorting**: Trying to implement the comparator with integers requires concatenating them as strings anyway, so it's cleaner to convert everything to strings first.

4. **Incorrect comparator implementation**: The comparator must compare a+b vs b+a, not just a vs b. Also ensure you're returning the correct sign for your language's sorting function (negative when a should come before b in most languages).

## When You'll See This Pattern

This custom sorting pattern appears in problems where the ordering depends on relationships between elements rather than their individual values:

1. **Reorder Data in Log Files (LeetCode 937)**: Sort logs with custom rules—letter logs before digit logs, with specific tie-breaking rules.

2. **Meeting Rooms II (LeetCode 253)**: While not exactly the same, it uses sorting with a custom key (start times) and then processes with a priority queue.

3. **Non-overlapping Intervals (LeetCode 435)**: Sort intervals by end time to maximize non-overlapping intervals.

The key insight is recognizing when standard sorting isn't sufficient and you need to define what "greater than" means for your specific problem.

## Key Takeaways

1. **Custom comparators solve ordering problems**: When standard sorting doesn't work, define exactly how two elements should be compared for your specific use case.

2. **String manipulation often simplifies number problems**: Converting numbers to strings avoids overflow issues and makes concatenation natural.

3. **Always test edge cases**: The all-zeros case is a classic trap. Test with [0,0], [0], and mixed cases like [0,1,0].

Related problems: [Smallest Value of the Rearranged Number](/problem/smallest-value-of-the-rearranged-number), [Find the Key of the Numbers](/problem/find-the-key-of-the-numbers)
