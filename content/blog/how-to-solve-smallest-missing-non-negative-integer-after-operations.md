---
title: "How to Solve Smallest Missing Non-negative Integer After Operations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest Missing Non-negative Integer After Operations. Medium difficulty, 55.9% acceptance rate. Topics: Array, Hash Table, Math, Greedy."
date: "2027-03-20"
category: "dsa-patterns"
tags:
  [
    "smallest-missing-non-negative-integer-after-operations",
    "array",
    "hash-table",
    "math",
    "medium",
  ]
---

# How to Solve Smallest Missing Non-negative Integer After Operations

You're given an array `nums` and an integer `value`. You can repeatedly add or subtract `value` from any element. Your task is to find the smallest non-negative integer that cannot be formed by applying these operations to elements in the array. This is essentially finding the MEX (Minimum EXcluded value) of the transformed array.

What makes this problem interesting is that each number can be transformed into infinitely many values through the operations, but they all share the same remainder when divided by `value`. The challenge is to systematically determine which non-negative integers are reachable from these equivalence classes.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 4, 5]` with `value = 3`.

First, let's understand what numbers each element can become:

- `1` can become `1, 4, 7, 10, ...` (all numbers ≡ 1 mod 3)
- `2` can become `2, 5, 8, 11, ...` (all numbers ≡ 2 mod 3)
- `3` can become `0, 3, 6, 9, ...` (all numbers ≡ 0 mod 3)
- `4` can become `1, 4, 7, 10, ...` (all numbers ≡ 1 mod 3)
- `5` can become `2, 5, 8, 11, ...` (all numbers ≡ 2 mod 3)

Now, let's build the reachable numbers systematically:

**Remainder 0 group** (from `3`): We can make `0, 3, 6, 9, ...`

- Smallest: 0
- Next: 3
- Next: 6, etc.

**Remainder 1 group** (from `1` and `4`): We can make `1, 4, 7, 10, ...`

- Smallest: 1
- Next: 4
- Next: 7, etc.

**Remainder 2 group** (from `2` and `5`): We can make `2, 5, 8, 11, ...`

- Smallest: 2
- Next: 5
- Next: 8, etc.

Now let's find the MEX by checking numbers in order:

1. Can we make 0? Yes (from remainder 0 group)
2. Can we make 1? Yes (from remainder 1 group)
3. Can we make 2? Yes (from remainder 2 group)
4. Can we make 3? Yes (from remainder 0 group)
5. Can we make 4? Yes (from remainder 1 group)
6. Can we make 5? Yes (from remainder 2 group)
7. Can we make 6? Yes (from remainder 0 group)
8. Can we make 7? Yes (from remainder 1 group)
9. Can we make 8? Yes (from remainder 2 group)

Wait, we seem to be able to make all numbers! But let's think carefully: For each remainder group, we can only generate numbers starting from the smallest number with that remainder that appears in `nums`. For remainder 0, the smallest is 0 (from 3). For remainder 1, the smallest is 1. For remainder 2, the smallest is 2.

The key insight: For each remainder `r`, we can generate numbers in the sequence: `smallest_r, smallest_r + value, smallest_r + 2*value, ...`

So the reachable numbers are:

- Remainder 0: 0, 3, 6, 9, ...
- Remainder 1: 1, 4, 7, 10, ...
- Remainder 2: 2, 5, 8, 11, ...

These cover all non-negative integers! So the MEX is the first number that's not in any of these sequences. Since we have all remainders covered starting from their minimum values, we can make every non-negative integer. The answer would be the next number after the maximum reachable number, which in this case would be determined by the formula we'll derive.

Actually, let me correct this: The MEX is the smallest non-negative integer NOT reachable. Since we can make 0, 1, 2, 3, 4, 5, 6, 7, 8, ... we can make ALL numbers. So the answer should be the next number in sequence, which would be 9 in this case? No, 9 is reachable (from remainder 0: 0, 3, 6, 9, ...).

The real insight is that for each remainder, we need to find the smallest number with that remainder in `nums`. Then we can generate: `smallest_r, smallest_r + value, smallest_r + 2*value, ...`

The MEX will be the smallest number `x` such that for its remainder `r = x % value`, we have `x < smallest_r`. Let's test this:

For `x = 0`: remainder 0, `smallest_0 = 0`, `0 >= 0` ✓ reachable
For `x = 1`: remainder 1, `smallest_1 = 1`, `1 >= 1` ✓ reachable
For `x = 2`: remainder 2, `smallest_2 = 2`, `2 >= 2` ✓ reachable
For `x = 3`: remainder 0, `smallest_0 = 0`, `3 >= 0` ✓ reachable
... and so on.

Since all `smallest_r` are ≤ their corresponding remainders, all numbers are reachable. The MEX would be determined by continuing this process.

## Brute Force Approach

A brute force approach would be to simulate the process of generating reachable numbers until we find a gap. We could:

1. Generate all numbers reachable from each element in `nums`
2. Collect them in a set
3. Start from 0 and check each integer until we find one not in the set

However, this is impractical because:

- Each element can generate infinitely many numbers (by repeatedly adding/subtracting `value`)
- Even if we bound the search, we don't know how far to search
- The time complexity would be unbounded

A slightly better but still inefficient approach would be to use BFS/DFS to explore reachable numbers, but this would still be exponential in the worst case.

The key realization that makes this problem solvable is the modular arithmetic insight: all numbers reachable from a given element `num` have the same remainder modulo `value`.

## Optimized Approach

The optimal solution relies on these key insights:

1. **Modular Equivalence**: After any number of operations, any element `num` can only become numbers that are congruent to `num % value` modulo `value`.

2. **Smallest Starting Point**: For each remainder `r` (0 ≤ r < value), we only care about the smallest number in `nums` with remainder `r`, because:
   - If we have a number `x` with remainder `r`, we can generate `x, x ± value, x ± 2*value, ...`
   - The smallest non-negative number we can generate with remainder `r` is `r` itself (if we have a number that gives us remainder `r`)
   - But actually, it's the smallest number in `nums` with remainder `r`, because we can only subtract `value` from it, not make it arbitrarily small

3. **Systematic Checking**: For a candidate MEX `mex`, check if it's reachable:
   - Compute its remainder: `r = mex % value`
   - Look up the smallest number with remainder `r` in `nums`
   - If that smallest number exists and is ≤ `mex`, then `mex` is reachable (we can reach it by starting from that number and adding multiples of `value`)
   - Otherwise, `mex` is not reachable

4. **Binary Search Pattern**: We can use a greedy approach starting from 0 and incrementally build the answer, or we can think in terms of finding the smallest `mex` where the condition fails.

The algorithm:

1. Group numbers by their remainder modulo `value`
2. For each remainder group, find the smallest number
3. Starting from `mex = 0`, check if it's reachable using the rule above
4. If reachable, increment `mex` and continue
5. Stop when we find the first unreachable `mex`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(value)
def findSmallestInteger(nums, value):
    """
    Find the smallest non-negative integer that cannot be formed
    by adding/subtracting multiples of 'value' to elements in nums.

    Approach:
    1. Group numbers by remainder modulo 'value'
    2. For each remainder, track the smallest number with that remainder
    3. For candidate MEX, check if smallest number with same remainder ≤ candidate
    4. If yes, candidate is reachable; increment and continue
    5. If no, candidate is the answer
    """
    # Step 1: Initialize an array to store the smallest number for each remainder
    # We use a large initial value (infinity) to indicate no number with that remainder
    min_vals = [float('inf')] * value

    # Step 2: Process each number in nums
    for num in nums:
        # Compute remainder (ensure it's non-negative)
        remainder = num % value
        if remainder < 0:
            remainder += value

        # Update the minimum value for this remainder
        if num < min_vals[remainder]:
            min_vals[remainder] = num

    # Step 3: Find the MEX using greedy approach
    mex = 0
    while True:
        # Get remainder of current candidate
        remainder = mex % value

        # Check if we have a number with this remainder
        if min_vals[remainder] == float('inf'):
            # No number with this remainder, so mex is unreachable
            return mex

        # Check if mex is reachable from the smallest number with this remainder
        # mex is reachable if: smallest_number ≤ mex
        # Because we can add multiples of value to reach mex
        if min_vals[remainder] > mex:
            # Smallest number with this remainder is larger than mex
            # We cannot reach mex because we can only add multiples of value
            # to the smallest number, which would give us numbers ≥ smallest_number
            return mex

        # mex is reachable, try next candidate
        mex += 1
```

```javascript
// Time: O(n) | Space: O(value)
function findSmallestInteger(nums, value) {
  /**
   * Find the smallest non-negative integer that cannot be formed
   * by adding/subtracting multiples of 'value' to elements in nums.
   *
   * Approach:
   * 1. Group numbers by remainder modulo 'value'
   * 2. For each remainder, track the smallest number with that remainder
   * 3. For candidate MEX, check if smallest number with same remainder ≤ candidate
   * 4. If yes, candidate is reachable; increment and continue
   * 5. If no, candidate is the answer
   */

  // Step 1: Initialize an array to store the smallest number for each remainder
  // We use Infinity to indicate no number with that remainder
  const minVals = new Array(value).fill(Infinity);

  // Step 2: Process each number in nums
  for (const num of nums) {
    // Compute remainder (ensure it's non-negative)
    let remainder = num % value;
    if (remainder < 0) {
      remainder += value;
    }

    // Update the minimum value for this remainder
    if (num < minVals[remainder]) {
      minVals[remainder] = num;
    }
  }

  // Step 3: Find the MEX using greedy approach
  let mex = 0;
  while (true) {
    // Get remainder of current candidate
    const remainder = mex % value;

    // Check if we have a number with this remainder
    if (minVals[remainder] === Infinity) {
      // No number with this remainder, so mex is unreachable
      return mex;
    }

    // Check if mex is reachable from the smallest number with this remainder
    // mex is reachable if: smallestNumber ≤ mex
    // Because we can add multiples of value to reach mex
    if (minVals[remainder] > mex) {
      // Smallest number with this remainder is larger than mex
      // We cannot reach mex because we can only add multiples of value
      // to the smallest number, which would give us numbers ≥ smallestNumber
      return mex;
    }

    // mex is reachable, try next candidate
    mex++;
  }
}
```

```java
// Time: O(n) | Space: O(value)
class Solution {
    public int findSmallestInteger(int[] nums, int value) {
        /**
         * Find the smallest non-negative integer that cannot be formed
         * by adding/subtracting multiples of 'value' to elements in nums.
         *
         * Approach:
         * 1. Group numbers by remainder modulo 'value'
         * 2. For each remainder, track the smallest number with that remainder
         * 3. For candidate MEX, check if smallest number with same remainder ≤ candidate
         * 4. If yes, candidate is reachable; increment and continue
         * 5. If no, candidate is the answer
         */

        // Step 1: Initialize an array to store the smallest number for each remainder
        // We use Integer.MAX_VALUE to indicate no number with that remainder
        int[] minVals = new int[value];
        for (int i = 0; i < value; i++) {
            minVals[i] = Integer.MAX_VALUE;
        }

        // Step 2: Process each number in nums
        for (int num : nums) {
            // Compute remainder (ensure it's non-negative)
            int remainder = num % value;
            if (remainder < 0) {
                remainder += value;
            }

            // Update the minimum value for this remainder
            if (num < minVals[remainder]) {
                minVals[remainder] = num;
            }
        }

        // Step 3: Find the MEX using greedy approach
        int mex = 0;
        while (true) {
            // Get remainder of current candidate
            int remainder = mex % value;

            // Check if we have a number with this remainder
            if (minVals[remainder] == Integer.MAX_VALUE) {
                // No number with this remainder, so mex is unreachable
                return mex;
            }

            // Check if mex is reachable from the smallest number with this remainder
            // mex is reachable if: smallestNumber ≤ mex
            // Because we can add multiples of value to reach mex
            if (minVals[remainder] > mex) {
                // Smallest number with this remainder is larger than mex
                // We cannot reach mex because we can only add multiples of value
                // to the smallest number, which would give us numbers ≥ smallestNumber
                return mex;
            }

            // mex is reachable, try next candidate
            mex++;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through all `n` elements once to compute remainders and track minimum values: O(n)
- We then iterate through candidate MEX values until we find the answer: In the worst case, this could be O(n + value), but in practice it's much less since we return as soon as we find an unreachable MEX
- Overall, the dominant term is O(n)

**Space Complexity: O(value)**

- We maintain an array of size `value` to store the minimum value for each remainder
- No other significant data structures are used
- The space is independent of `n`, depending only on `value`

## Common Mistakes

1. **Not handling negative remainders correctly**: In Python and JavaScript, `-1 % 3 = -1`, not `2`. You must adjust negative remainders to be in the range `[0, value-1]`.

2. **Infinite loop in MEX search**: Forgetting to increment `mex` or not having a proper termination condition can cause infinite loops. Always ensure your while loop has a clear exit condition.

3. **Incorrect reachability check**: The condition `min_vals[remainder] ≤ mex` is crucial. Some candidates mistakenly check `min_vals[remainder] == mex` or other variations. Remember: if the smallest number with remainder `r` is `x`, we can reach any number `≥ x` that has remainder `r` by adding multiples of `value`.

4. **Overlooking the case where a remainder has no numbers**: If no number in `nums` has a particular remainder `r`, then any number with remainder `r` is unreachable. The first such number (which is `r` itself) should be the MEX.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Modular Arithmetic Grouping**: Problems where operations preserve some modular property. Similar to:
   - **LeetCode 1590: Make Sum Divisible by P** - Grouping prefix sums by remainder
   - **LeetCode 974: Subarray Sums Divisible by K** - Counting subarrays with sum divisible by K using remainder tracking

2. **MEX (Minimum Excluded Value) Problems**: Finding the smallest missing non-negative integer:
   - **LeetCode 41: First Missing Positive** - Finding the smallest missing positive integer
   - **LeetCode 2155: Find Missing Observations** - Related to expected sums and missing values

3. **Greedy Construction**: Building up a solution incrementally:
   - **LeetCode 330: Patching Array** - Greedily adding numbers to cover all ranges
   - **LeetCode 179: Largest Number** - Greedy sorting-based construction

## Key Takeaways

1. **Modular equivalence is powerful**: When operations add/subtract a fixed value, think about remainders modulo that value. All reachable values from a starting number share the same remainder.

2. **For MEX problems, think incrementally**: Start from 0 and check each integer in sequence. Often there's a greedy approach where you can determine reachability efficiently without simulating all possibilities.

3. **Group and conquer**: When dealing with many elements that can be transformed, group them by invariant properties (like remainder modulo `value`). This reduces the problem complexity significantly.

Related problems: [First Missing Positive](/problem/first-missing-positive)
