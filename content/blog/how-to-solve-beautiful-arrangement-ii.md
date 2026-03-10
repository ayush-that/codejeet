---
title: "How to Solve Beautiful Arrangement II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Beautiful Arrangement II. Medium difficulty, 61.0% acceptance rate. Topics: Array, Math."
date: "2028-04-16"
category: "dsa-patterns"
tags: ["beautiful-arrangement-ii", "array", "math", "medium"]
---

# How to Solve Beautiful Arrangement II

This problem asks us to construct a list of `n` distinct integers from `1` to `n` such that the absolute differences between consecutive elements produce exactly `k` distinct values. The challenge lies in designing a sequence that generates exactly `k` unique differences—not just any sequence, but one that uses all numbers from 1 to `n` exactly once. What makes this interesting is that it's a constructive problem: we're not searching for an existing arrangement but building one from scratch using mathematical insight.

## Visual Walkthrough

Let's walk through an example with `n = 8` and `k = 4`. We need to arrange numbers 1 through 8 so that the absolute differences between consecutive numbers produce exactly 4 distinct values.

One effective strategy is to alternate between high and low numbers to create large differences, then gradually reduce the variation. Here's how we might think about it:

1. Start with 1, then jump to 8: difference = 7
2. From 8, drop to 2: difference = 6
3. From 2, jump to 7: difference = 5
4. From 7, drop to 3: difference = 4

We've used differences 7, 6, 5, 4 so far. That's already 4 distinct differences (k = 4), so we need to maintain these differences without introducing new ones. The remaining numbers (4, 5, 6) should be arranged in increasing order: 4, 5, 6, which gives differences of 1.

The final sequence: [1, 8, 2, 7, 3, 6, 4, 5]
Differences: [7, 6, 5, 4, 3, 2, 1] → Wait, that's 7 distinct differences, not 4!

Actually, let's recalculate carefully:

- |1-8| = 7
- |8-2| = 6
- |2-7| = 5
- |7-3| = 4
- |3-6| = 3
- |6-4| = 2
- |4-5| = 1

That's 7 distinct differences. We need exactly 4. The issue is that after we create the first 4 differences (7, 6, 5, 4), we continued the alternating pattern, which created new differences (3, 2, 1).

The correct approach: After creating k distinct differences, arrange the remaining numbers in monotonic order so they only produce difference 1, which we've already seen. Let's try again:

Start: [1]
Add 8 (diff 7): [1, 8]
Add 2 (diff 6): [1, 8, 2]  
Add 7 (diff 5): [1, 8, 2, 7]
Add 3 (diff 4): [1, 8, 2, 7, 3]

Now we have 4 distinct differences: 7, 6, 5, 4. Remaining numbers: 4, 5, 6. Arrange them in increasing order after 3: [1, 8, 2, 7, 3, 4, 5, 6]

Check differences:

- |1-8| = 7
- |8-2| = 6
- |2-7| = 5
- |7-3| = 4
- |3-4| = 1 (already seen in the sequence? No, this is new!)
- |4-5| = 1
- |5-6| = 1

We have differences: 7, 6, 5, 4, 1 → That's 5 distinct values, not 4. The problem is that difference 1 wasn't in our initial set.

The key insight: We need to make sure that after creating k distinct differences, all remaining differences are 1, which should already be in our set. So we need difference 1 to be one of the first k differences.

Let's try a different pattern that includes 1 early. Start with 1, then 2 (diff 1), then n (diff n-2), then 3 (diff n-3), and so on.

For n=8, k=4:
Start: [1]
Add 2 (diff 1): [1, 2]
Add 8 (diff 6): [1, 2, 8]
Add 3 (diff 5): [1, 2, 8, 3]
Add 7 (diff 4): [1, 2, 8, 3, 7]

Differences so far: 1, 6, 5, 4 → That's 4 distinct differences! Remaining: 4, 5, 6. Arrange in increasing order: [1, 2, 8, 3, 7, 4, 5, 6]

Check differences:

- |1-2| = 1
- |2-8| = 6
- |8-3| = 5
- |3-7| = 4
- |7-4| = 3 (New! We have 5 distinct differences now)

Still not working. The issue is that when we add the remaining numbers in order, we might create new differences. We need a better approach.

## Brute Force Approach

A brute force solution would generate all permutations of numbers 1 through n, calculate the set of absolute differences for each permutation, and check if the size of that set equals k. This approach has factorial time complexity O(n!), which is completely impractical for n up to 10^4 (as in the problem constraints).

Even for small n like 10, there are 3,628,800 permutations to check. For n=20, there are over 2.4 quintillion permutations. Clearly, we need a constructive approach rather than a search-based one.

## Optimized Approach

The key insight is that we can construct the sequence in a specific pattern that guarantees exactly k distinct differences. Here's the reasoning:

1. The maximum number of distinct differences we can have with n numbers is n-1 (all differences from 1 to n-1).
2. We want exactly k distinct differences.
3. We can create a sequence that produces differences: 1, k, 2, k-1, 3, k-2, ...

Here's the construction algorithm:

- Start with two pointers: `left = 1` and `right = n`
- Initialize result array
- For the first k elements:
  - If i is odd, take from `left` and increment `left`
  - If i is even, take from `right` and decrement `right`
- For the remaining elements (after k elements):
  - If the last taken number was from the left, continue taking from `left` in increasing order
  - If the last taken number was from the right, continue taking from `right` in decreasing order

Why this works:

- The alternating pattern between extremes creates differences: k, k-1, k-2, ..., 1
- After k elements, we have exactly k distinct differences
- The remaining elements are taken in monotonic order, producing only difference 1, which is already in our set

Let's test with n=8, k=4:

- Start: left=1, right=8
- i=1 (odd): take 1 → [1], left=2
- i=2 (even): take 8 → [1,8], right=7, diff=|1-8|=7
- i=3 (odd): take 2 → [1,8,2], left=3, diff=|8-2|=6
- i=4 (even): take 7 → [1,8,2,7], right=6, diff=|2-7|=5

We have 3 differences so far: 7, 6, 5. We need one more distinct difference. The next would be:

- i=5: Last taken was from right (7), so we continue from right in decreasing order
- Take 6 → [1,8,2,7,6], diff=|7-6|=1
- Take 5 → [1,8,2,7,6,5], diff=|6-5|=1
- Take 4 → [1,8,2,7,6,5,4], diff=|5-4|=1
- Take 3 → [1,8,2,7,6,5,4,3], diff=|4-3|=1

Differences: 7, 6, 5, 1, 1, 1, 1 → Only 4 distinct values: 7, 6, 5, 1. Perfect!

Wait, we have 4 distinct differences, but we wanted them to be: k, k-1, k-2, ..., 1. Here we have 7, 6, 5, 1. That's k=4, k-1=3, k-2=2, and 1. But we got 7, 6, 5, 1. The values are different but the count is correct.

Actually, for n=8, the maximum difference is 7, so when k=4, we get differences: 7, 6, 5, 1. For k=3, we'd get: 7, 6, 1. For k=2: 7, 1. For k=1: 1.

The pattern is: first difference = n-1, second = n-2, ..., k-th = n-k, then all remaining differences are 1.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result array
def constructArray(n, k):
    """
    Constructs an array of length n with elements 1..n arranged
    such that there are exactly k distinct absolute differences
    between consecutive elements.

    The approach uses two pointers (left and right) to alternate
    between extremes, creating large differences initially, then
    fills the rest with monotonic sequence to only produce diff=1.
    """
    result = []
    left, right = 1, n

    # First, create k-1 alternating elements from extremes
    # This creates k distinct differences
    for i in range(k):
        if i % 2 == 0:
            # Even index: take from left
            result.append(left)
            left += 1
        else:
            # Odd index: take from right
            result.append(right)
            right -= 1

    # Now fill the remaining positions
    # If last element was from left, continue from left in increasing order
    # If last element was from right, continue from right in decreasing order
    if k % 2 == 1:
        # Last element was from left (since we start with left at index 0)
        # Add all remaining numbers from left to right in increasing order
        while left <= right:
            result.append(left)
            left += 1
    else:
        # Last element was from right
        # Add all remaining numbers from right to left in decreasing order
        while left <= right:
            result.append(right)
            right -= 1

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function constructArray(n, k) {
  /**
   * Constructs an array of length n with elements 1..n arranged
   * such that there are exactly k distinct absolute differences
   * between consecutive elements.
   *
   * The approach uses two pointers (left and right) to alternate
   * between extremes, creating large differences initially, then
   * fills the rest with monotonic sequence to only produce diff=1.
   */
  const result = [];
  let left = 1,
    right = n;

  // First, create k alternating elements from extremes
  // This creates k distinct differences
  for (let i = 0; i < k; i++) {
    if (i % 2 === 0) {
      // Even index: take from left
      result.push(left);
      left++;
    } else {
      // Odd index: take from right
      result.push(right);
      right--;
    }
  }

  // Now fill the remaining positions
  // If last element was from left, continue from left in increasing order
  // If last element was from right, continue from right in decreasing order
  if (k % 2 === 1) {
    // Last element was from left (since we start with left at index 0)
    // Add all remaining numbers from left to right in increasing order
    while (left <= right) {
      result.push(left);
      left++;
    }
  } else {
    // Last element was from right
    // Add all remaining numbers from right to left in decreasing order
    while (left <= right) {
      result.push(right);
      right--;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the result array
class Solution {
    public int[] constructArray(int n, int k) {
        /**
         * Constructs an array of length n with elements 1..n arranged
         * such that there are exactly k distinct absolute differences
         * between consecutive elements.
         *
         * The approach uses two pointers (left and right) to alternate
         * between extremes, creating large differences initially, then
         * fills the rest with monotonic sequence to only produce diff=1.
         */
        int[] result = new int[n];
        int left = 1, right = n;
        int index = 0;

        // First, create k alternating elements from extremes
        // This creates k distinct differences
        for (int i = 0; i < k; i++) {
            if (i % 2 == 0) {
                // Even index: take from left
                result[index++] = left;
                left++;
            } else {
                // Odd index: take from right
                result[index++] = right;
                right--;
            }
        }

        // Now fill the remaining positions
        // If last element was from left, continue from left in increasing order
        // If last element was from right, continue from right in decreasing order
        if (k % 2 == 1) {
            // Last element was from left (since we start with left at index 0)
            // Add all remaining numbers from left to right in increasing order
            while (left <= right) {
                result[index++] = left;
                left++;
            }
        } else {
            // Last element was from right
            // Add all remaining numbers from right to left in decreasing order
            while (left <= right) {
                result[index++] = right;
                right--;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate exactly n times to fill the result array
- Each iteration does constant work (comparisons and assignments)

**Space Complexity:** O(n) for the output array

- We need to store all n elements in the result
- The algorithm itself uses only O(1) extra space (pointers and indices)

## Common Mistakes

1. **Continuing the alternating pattern for all n elements**: This creates n-1 distinct differences when k < n-1. Remember to switch to monotonic ordering after creating k distinct differences.

2. **Wrong direction for the monotonic fill**: After the alternating phase, you must continue in the same direction (increasing if last was from left, decreasing if last was from right). Otherwise, you'll create a new difference.

3. **Off-by-one in the alternating loop**: The loop should run k times, not k-1 times. Running k-1 times creates only k-1 distinct differences.

4. **Not handling the k=1 case correctly**: When k=1, the alternating phase runs once (taking 1), then we fill the rest in increasing order: [1, 2, 3, ..., n]. This produces only difference 1, which is correct.

## When You'll See This Pattern

This "constructive alternating extremes" pattern appears in problems where you need to create a specific property through arrangement rather than search:

1. **Wiggle Sort II** (LeetCode 324): Arrange array in alternating peaks and valleys. Similar alternating pattern but with different constraints.

2. **Rearrange Array Elements by Sign** (LeetCode 2149): Alternate between positive and negative numbers while maintaining relative order.

3. **Diagonal Traverse** (LeetCode 498): Alternate between upward and downward diagonal traversal in a matrix.

The core idea is recognizing when you can construct a solution by strategically ordering elements rather than searching through possibilities.

## Key Takeaways

1. **Constructive problems often have pattern-based solutions**: Instead of searching, look for a systematic way to build the answer. Test your pattern on small examples.

2. **Extreme values create extreme differences**: To maximize differences, alternate between smallest and largest available numbers. To minimize differences, use consecutive numbers.

3. **Control variation by switching patterns**: Start with high-variation pattern (alternating extremes), then switch to low-variation pattern (monotonic) once you've created enough distinct values.

Related problems: [Beautiful Arrangement](/problem/beautiful-arrangement)
