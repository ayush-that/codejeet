---
title: "How to Solve Sum of All Odd Length Subarrays — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sum of All Odd Length Subarrays. Easy difficulty, 83.9% acceptance rate. Topics: Array, Math, Prefix Sum."
date: "2028-05-05"
category: "dsa-patterns"
tags: ["sum-of-all-odd-length-subarrays", "array", "math", "prefix-sum", "easy"]
---

# How to Solve Sum of All Odd Length Subarrays

This problem asks us to calculate the sum of all contiguous subarrays (subsequences) of odd length from a given array of positive integers. While the brute force approach is straightforward, the optimal solution requires recognizing a mathematical pattern that makes this an O(n) problem. What makes this problem interesting is that it appears to require O(n³) work at first glance, but can be solved efficiently by counting how many times each element contributes to the final sum.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider `arr = [1, 4, 2, 5, 3]`. We need to sum all odd-length subarrays:

**Length 1 subarrays:** [1], [4], [2], [5], [3] → Sum = 1 + 4 + 2 + 5 + 3 = 15

**Length 3 subarrays:**

- [1, 4, 2] → Sum = 7
- [4, 2, 5] → Sum = 11
- [2, 5, 3] → Sum = 10
  Total for length 3 = 7 + 11 + 10 = 28

**Length 5 subarrays:**

- [1, 4, 2, 5, 3] → Sum = 15
  Total for length 5 = 15

**Final answer:** 15 + 28 + 15 = 58

Now let's think about how each element contributes. Element `4` (at index 1) appears in:

- All subarrays starting at index 0, 1 that include index 1 and have odd length
- All subarrays ending at index 1, 2, 3, 4 that include index 1 and have odd length

The key insight: For an element at index `i`, the number of odd-length subarrays containing it equals the number of ways to choose an odd number of elements to its left combined with an odd number to its right, OR an even number to its left combined with an even number to its right.

## Brute Force Approach

The most straightforward solution is to generate all possible odd-length subarrays and sum them. We can do this with three nested loops:

1. Outer loop for starting index
2. Middle loop for ending index (incrementing by 2 to ensure odd length)
3. Inner loop to sum elements from start to end

While this approach is easy to understand and implement, it has O(n³) time complexity, which becomes impractical for larger arrays (n > 1000). The brute force solution helps us understand the problem but isn't efficient enough for interview settings where optimal solutions are expected.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def sumOddLengthSubarrays_brute(arr):
    """
    Brute force solution: Generate all odd-length subarrays and sum them.
    This is straightforward but inefficient for large inputs.
    """
    n = len(arr)
    total_sum = 0

    # Iterate through all possible starting indices
    for start in range(n):
        # Only consider odd lengths: 1, 3, 5, ...
        # End index must be start + length - 1 < n
        for length in range(1, n - start + 1, 2):
            end = start + length - 1
            # Sum the current subarray
            for i in range(start, end + 1):
                total_sum += arr[i]

    return total_sum
```

```javascript
// Time: O(n³) | Space: O(1)
function sumOddLengthSubarraysBrute(arr) {
  /**
   * Brute force solution: Generate all odd-length subarrays and sum them.
   * This is straightforward but inefficient for large inputs.
   */
  const n = arr.length;
  let totalSum = 0;

  // Iterate through all possible starting indices
  for (let start = 0; start < n; start++) {
    // Only consider odd lengths: 1, 3, 5, ...
    // End index must be start + length - 1 < n
    for (let length = 1; start + length - 1 < n; length += 2) {
      const end = start + length - 1;
      // Sum the current subarray
      for (let i = start; i <= end; i++) {
        totalSum += arr[i];
      }
    }
  }

  return totalSum;
}
```

```java
// Time: O(n³) | Space: O(1)
public int sumOddLengthSubarraysBrute(int[] arr) {
    /**
     * Brute force solution: Generate all odd-length subarrays and sum them.
     * This is straightforward but inefficient for large inputs.
     */
    int n = arr.length;
    int totalSum = 0;

    // Iterate through all possible starting indices
    for (int start = 0; start < n; start++) {
        // Only consider odd lengths: 1, 3, 5, ...
        // End index must be start + length - 1 < n
        for (int length = 1; start + length - 1 < n; length += 2) {
            int end = start + length - 1;
            // Sum the current subarray
            for (int i = start; i <= end; i++) {
                totalSum += arr[i];
            }
        }
    }

    return totalSum;
}
```

</div>

## Optimal Solution

The optimal approach uses combinatorial reasoning. For each element at index `i`, we calculate how many odd-length subarrays contain it. The formula is:

`contribution = arr[i] * count` where `count` is the number of odd-length subarrays containing index `i`.

To find `count`, we need to consider:

- How many choices for starting index? We can start at any index from 0 to i (inclusive)
- How many choices for ending index? We can end at any index from i to n-1 (inclusive)
- But we need the subarray length (end - start + 1) to be odd

The mathematical insight: For an element at index `i` in an array of length `n`:

- Number of choices for starting position: `i + 1` (indices 0 through i)
- Number of choices for ending position: `n - i` (indices i through n-1)

The number of odd-length subarrays containing index `i` is:
`((start_choices + 1) // 2) * ((end_choices + 1) // 2) + (start_choices // 2) * (end_choices // 2)`

This formula counts:

1. Odd number of elements to the left × Odd number to the right
2. Even number of elements to the left × Even number to the right

Both cases result in odd total length (odd + odd + 1 = odd, even + even + 1 = odd).

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def sumOddLengthSubarrays(arr):
    """
    Optimal solution using combinatorial counting.
    For each element, calculate how many odd-length subarrays contain it.
    """
    n = len(arr)
    total_sum = 0

    for i in range(n):
        # Number of possible starting indices (0 to i)
        start_choices = i + 1

        # Number of possible ending indices (i to n-1)
        end_choices = n - i

        # Count subarrays with odd number of elements to left AND right of i
        # (odd_left * odd_right) gives subarrays where left+right+1 is odd
        odd_left_odd_right = ((start_choices + 1) // 2) * ((end_choices + 1) // 2)

        # Count subarrays with even number of elements to left AND right of i
        # (even_left * even_right) also gives subarrays where left+right+1 is odd
        even_left_even_right = (start_choices // 2) * (end_choices // 2)

        # Total number of odd-length subarrays containing arr[i]
        count = odd_left_odd_right + even_left_even_right

        # Add contribution of current element
        total_sum += arr[i] * count

    return total_sum
```

```javascript
// Time: O(n) | Space: O(1)
function sumOddLengthSubarrays(arr) {
  /**
   * Optimal solution using combinatorial counting.
   * For each element, calculate how many odd-length subarrays contain it.
   */
  const n = arr.length;
  let totalSum = 0;

  for (let i = 0; i < n; i++) {
    // Number of possible starting indices (0 to i)
    const startChoices = i + 1;

    // Number of possible ending indices (i to n-1)
    const endChoices = n - i;

    // Count subarrays with odd number of elements to left AND right of i
    // (oddLeft * oddRight) gives subarrays where left+right+1 is odd
    const oddLeftOddRight = Math.floor((startChoices + 1) / 2) * Math.floor((endChoices + 1) / 2);

    // Count subarrays with even number of elements to left AND right of i
    // (evenLeft * evenRight) also gives subarrays where left+right+1 is odd
    const evenLeftEvenRight = Math.floor(startChoices / 2) * Math.floor(endChoices / 2);

    // Total number of odd-length subarrays containing arr[i]
    const count = oddLeftOddRight + evenLeftEvenRight;

    // Add contribution of current element
    totalSum += arr[i] * count;
  }

  return totalSum;
}
```

```java
// Time: O(n) | Space: O(1)
public int sumOddLengthSubarrays(int[] arr) {
    /**
     * Optimal solution using combinatorial counting.
     * For each element, calculate how many odd-length subarrays contain it.
     */
    int n = arr.length;
    int totalSum = 0;

    for (int i = 0; i < n; i++) {
        // Number of possible starting indices (0 to i)
        int startChoices = i + 1;

        // Number of possible ending indices (i to n-1)
        int endChoices = n - i;

        // Count subarrays with odd number of elements to left AND right of i
        // (oddLeft * oddRight) gives subarrays where left+right+1 is odd
        int oddLeftOddRight = ((startChoices + 1) / 2) * ((endChoices + 1) / 2);

        // Count subarrays with even number of elements to left AND right of i
        // (evenLeft * evenRight) also gives subarrays where left+right+1 is odd
        int evenLeftEvenRight = (startChoices / 2) * (endChoices / 2);

        // Total number of odd-length subarrays containing arr[i]
        int count = oddLeftOddRight + evenLeftEvenRight;

        // Add contribution of current element
        totalSum += arr[i] * count;
    }

    return totalSum;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing constant-time operations for each element
- The combinatorial calculations (divisions and multiplications) are O(1) operations

**Space Complexity:** O(1)

- We only use a few integer variables (`total_sum`, `n`, `i`, and temporary calculation variables)
- No additional data structures that scale with input size

This is optimal because we must at least examine each element once to include it in our calculation, making O(n) the best possible time complexity.

## Common Mistakes

1. **Off-by-one errors in index calculations:** When counting start and end choices, remember that `start_choices = i + 1` (indices 0 through i) and `end_choices = n - i` (indices i through n-1). A common mistake is using `i` instead of `i + 1` or `n - i - 1` instead of `n - i`.

2. **Incorrect odd/even counting formula:** The formula `((start_choices + 1) // 2) * ((end_choices + 1) // 2) + (start_choices // 2) * (end_choices // 2)` is derived from combinatorial reasoning. Some candidates try to simplify it incorrectly to `((start_choices * end_choices) + 1) // 2`, which only works for certain cases.

3. **Integer division vs float division:** In languages like Python 3, `//` performs integer division (floor division), while `/` performs float division. Using the wrong operator can lead to incorrect results. In Java and JavaScript, integer division truncates toward zero, which works correctly for positive numbers.

4. **Forgetting that array elements are positive integers:** While not strictly necessary for the algorithm to work, knowing that all elements are positive helps verify that our counting approach is correct (no cancellation effects from negative numbers).

## When You'll See This Pattern

This combinatorial counting pattern appears in problems where you need to calculate the sum or count of subarrays satisfying certain conditions. Instead of generating all subarrays (which would be O(n²) or worse), you count how many times each element contributes.

Related problems that use similar patterns:

1. **Sum of All Subarrays** (not on LeetCode but common in interviews): Sum of ALL subarrays (not just odd-length). The formula simplifies to `arr[i] * (i + 1) * (n - i)` since every subarray containing element i contributes arr[i] to the sum.

2. **Sum of Squares of Special Elements** (LeetCode Easy): Similar counting approach where you need to count how many times each element appears based on its position and divisibility conditions.

3. **Product of Array Except Self** (LeetCode Medium): While not identical, it shares the "consider each element's contribution" mindset, breaking the problem into left and right parts.

4. **Subarray Sum Equals K** (LeetCode Medium): Uses prefix sums and hash maps, but shares the theme of avoiding O(n²) subarray enumeration by finding smarter ways to count.

## Key Takeaways

1. **Think in terms of element contributions:** Instead of enumerating all subarrays (which is O(n²) at minimum), calculate how many valid subarrays contain each element. This often reduces the problem to O(n).

2. **Combinatorial counting is powerful:** For subarray problems, the number of subarrays containing element at index i is often `(i + 1) * (n - i)` for all subarrays, with variations based on length constraints. Understanding this formula helps solve many similar problems.

3. **Break problems into symmetric parts:** The insight that "odd length = (odd left + odd right) OR (even left + even right)" demonstrates how breaking a condition into cases can simplify the counting.

4. **Test with small examples:** Always verify your formula with small arrays (n=1, 2, 3, 4) to catch off-by-one errors before implementing.

Related problems: [Sum of Squares of Special Elements](/problem/sum-of-squares-of-special-elements)
