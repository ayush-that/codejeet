---
title: "How to Solve Minimum Deletions to Make Array Divisible — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Deletions to Make Array Divisible. Hard difficulty, 60.0% acceptance rate. Topics: Array, Math, Sorting, Heap (Priority Queue), Number Theory."
date: "2028-10-05"
category: "dsa-patterns"
tags: ["minimum-deletions-to-make-array-divisible", "array", "math", "sorting", "hard"]
---

# How to Solve Minimum Deletions to Make Array Divisible

This problem asks us to find the minimum deletions from `nums` so that the smallest remaining element divides every number in `numsDivide`. The challenge lies in efficiently finding which candidate from `nums` can serve as this divisor, and determining how many deletions we need to make it the smallest element.

What makes this interesting: We're not just checking divisibility—we need the _smallest_ element in `nums` after deletions to be the divisor. This means we must consider elements in sorted order and find the first one that works.

## Visual Walkthrough

Let's trace through an example:

- `nums = [4,3,2,6]`
- `numsDivide = [8,12,18]`

**Step 1: Understanding the goal**  
We need to delete elements from `nums` until the smallest remaining number divides ALL numbers in `numsDivide` (8, 12, 18).

**Step 2: Check candidates in order**  
First, sort `nums`: `[2,3,4,6]`

Check 2: Does 2 divide all numbers in `numsDivide`?

- 8 ÷ 2 = 4 ✓
- 12 ÷ 2 = 6 ✓
- 18 ÷ 2 = 9 ✓
  Yes! 2 divides all of them.

**Step 3: Count deletions needed**  
To make 2 the smallest element, we need to delete all elements smaller than 2. There are none.  
We also need to delete elements equal to 2? No—we keep at least one 2.  
Actually, we just need to delete all elements _before_ 2 in the sorted array. Since 2 is already first, deletions = 0.

**Another example**: `nums = [3,5,9]`, `numsDivide = [6,12,18]`

Sorted `nums`: `[3,5,9]`

Check 3: Does 3 divide all?

- 6 ÷ 3 = 2 ✓
- 12 ÷ 3 = 4 ✓
- 18 ÷ 3 = 6 ✓
  Yes! Deletions = 0 (3 is already first).

**Negative example**: `nums = [4,5,6]`, `numsDivide = [7,14,21]`

Sorted: `[4,5,6]`

Check 4: 7 ÷ 4 = 1.75 ✗ (not integer)
Check 5: 7 ÷ 5 = 1.4 ✗
Check 6: 7 ÷ 6 ≈ 1.166 ✗
None work → return -1.

## Brute Force Approach

A naive approach would be:

1. Sort `nums`
2. For each element in sorted `nums`:
   - Check if it divides all elements in `numsDivide`
   - If yes, count how many elements come before it (these need deletion)
   - Return that count
3. If no element works, return -1

The problem: Checking divisibility for each candidate is O(n × m) where n = len(nums), m = len(numsDivide). With constraints up to 10⁵ each, this could be 10¹⁰ operations—far too slow.

What makes brute force insufficient: We're repeatedly checking the same divisibility condition. The key insight is that we don't need to check each candidate against every element in `numsDivide` individually if we find a common property.

## Optimized Approach

**Key Insight**: If a number `d` divides ALL numbers in `numsDivide`, then `d` must divide the _greatest common divisor (GCD)_ of all numbers in `numsDivide`.

Why? Because:

- If `d` divides every number, it divides any combination of them
- The GCD is the largest number that divides all elements
- Any divisor of all elements must also divide their GCD

**Step-by-step reasoning**:

1. Compute `g = gcd(numsDivide[0], numsDivide[1], ..., numsDivide[m-1])`
2. Sort `nums` so we can check candidates from smallest to largest
3. For each candidate in sorted `nums`:
   - If `g % candidate == 0`, then candidate divides the GCD, meaning it divides all elements
   - The first such candidate is our answer
   - Deletions = number of elements before this candidate
4. If no candidate divides `g`, return -1

**Why this works**: Instead of checking `candidate` against m elements (O(m)), we check against one number `g` (O(1)). This reduces the overall complexity dramatically.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + m + log(max(numsDivide)))
# Space: O(1) or O(n) if we count sorting space
def minOperations(nums, numsDivide):
    """
    Find minimum deletions so smallest element in nums divides all in numsDivide.

    Approach:
    1. Find GCD of all numsDivide elements
    2. Sort nums to check candidates in increasing order
    3. Find first element in sorted nums that divides the GCD
    4. Count deletions = index of that element (all elements before it)
    """

    # Step 1: Compute GCD of all elements in numsDivide
    # GCD of multiple numbers: gcd(a, b, c) = gcd(gcd(a, b), c)
    from math import gcd

    # Start with first element's GCD (gcd(x, x) = x)
    g = numsDivide[0]
    for num in numsDivide[1:]:
        g = gcd(g, num)
        # Early exit: if GCD becomes 1, only 1 can divide it
        if g == 1:
            break

    # Step 2: Sort nums to check candidates from smallest to largest
    nums.sort()

    # Step 3: Find first element in sorted nums that divides g
    deletions = 0
    for num in nums:
        if g % num == 0:
            # Found our divisor! All elements before this need deletion
            return deletions
        else:
            # This element doesn't work, need to delete it
            deletions += 1

    # Step 4: No element divides g → impossible
    return -1
```

```javascript
// Time: O(n log n + m + log(max(numsDivide)))
// Space: O(1) or O(log n) for sorting
function minOperations(nums, numsDivide) {
  /**
   * Find minimum deletions so smallest element in nums divides all in numsDivide.
   *
   * Approach:
   * 1. Find GCD of all numsDivide elements
   * 2. Sort nums to check candidates in increasing order
   * 3. Find first element in sorted nums that divides the GCD
   * 4. Count deletions = index of that element
   */

  // Helper function to compute GCD using Euclidean algorithm
  function gcd(a, b) {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // Step 1: Compute GCD of all elements in numsDivide
  let g = numsDivide[0];
  for (let i = 1; i < numsDivide.length; i++) {
    g = gcd(g, numsDivide[i]);
    // Early optimization: if GCD becomes 1, only 1 can divide it
    if (g === 1) break;
  }

  // Step 2: Sort nums to check candidates from smallest to largest
  nums.sort((a, b) => a - b);

  // Step 3: Find first element that divides g
  let deletions = 0;
  for (const num of nums) {
    if (g % num === 0) {
      // Found valid divisor! All previous elements need deletion
      return deletions;
    }
    // This element doesn't work, count it as a deletion
    deletions++;
  }

  // Step 4: No element divides g → impossible
  return -1;
}
```

```java
// Time: O(n log n + m + log(max(numsDivide)))
// Space: O(1) or O(log n) for sorting
class Solution {
    public int minOperations(int[] nums, int[] numsDivide) {
        /**
         * Find minimum deletions so smallest element in nums divides all in numsDivide.
         *
         * Approach:
         * 1. Find GCD of all numsDivide elements
         * 2. Sort nums to check candidates in increasing order
         * 3. Find first element in sorted nums that divides the GCD
         * 4. Count deletions = index of that element
         */

        // Step 1: Compute GCD of all elements in numsDivide
        int g = numsDivide[0];
        for (int i = 1; i < numsDivide.length; i++) {
            g = gcd(g, numsDivide[i]);
            // Early exit: if GCD becomes 1, only 1 can divide it
            if (g == 1) break;
        }

        // Step 2: Sort nums to check candidates from smallest to largest
        Arrays.sort(nums);

        // Step 3: Find first element that divides g
        int deletions = 0;
        for (int num : nums) {
            if (g % num == 0) {
                // Found valid divisor! All previous elements need deletion
                return deletions;
            }
            // This element doesn't work, count it as a deletion
            deletions++;
        }

        // Step 4: No element divides g → impossible
        return -1;
    }

    // Helper method to compute GCD using Euclidean algorithm
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log n + m + log(max(numsDivide)))

- Sorting `nums`: O(n log n)
- Computing GCD of `numsDivide`: O(m × log(max(numsDivide)))  
  Each GCD operation takes O(log(max(numsDivide))) time, and we do m-1 of them
- Scanning sorted `nums`: O(n)

**Space Complexity**:

- O(1) extra space for the algorithm itself (excluding input)
- O(log n) or O(n) for sorting space depending on language implementation
- Overall: O(1) or O(log n) for the algorithm

The GCD optimization is crucial—without it, we'd have O(n × m) time, which is infeasible for large inputs.

## Common Mistakes

1. **Not sorting `nums` first**: Candidates might check elements in original order, which doesn't guarantee finding the _smallest_ working element. Always sort to process from smallest to largest.

2. **Checking divisibility against each `numsDivide` element**: This leads to O(n × m) time. The GCD trick reduces this to O(n + m).

3. **Forgetting the early GCD=1 optimization**: When GCD becomes 1, only the number 1 can divide it. If 1 isn't in `nums`, we can immediately return -1. Our code includes this optimization.

4. **Off-by-one in deletion count**: The deletions needed equal the _index_ of the first working element in the sorted array (0-based), not index+1. Our loop with `deletions` counter handles this correctly.

5. **Not handling empty arrays**: While constraints guarantee non-empty arrays, in interviews you might want to mention edge cases like empty `nums` (return -1) or empty `numsDivide` (any element works, return 0).

## When You'll See This Pattern

This problem combines two important patterns:

1. **GCD for divisibility checks**: When you need to check if a number divides multiple other numbers, compute their GCD first. The candidate must divide the GCD.

   Related problems:
   - **Check If Array Pairs Are Divisible by k**: Uses modular arithmetic and counting, similar divisibility concept
   - **Greatest Common Divisor of Strings**: Uses GCD to find repeating patterns
   - **X of a Kind in a Deck of Cards**: Uses GCD to check if cards can be grouped

2. **Sorting to find minimum/maximum with a condition**: When you need the smallest/largest element satisfying a property, sort first and scan linearly.

   Related problems:
   - **Two Sum Less Than K**: Sort then use two pointers
   - **Meeting Rooms II**: Sort intervals to process in order

## Key Takeaways

1. **GCD transforms multiple divisibility checks into one**: Instead of checking `d` divides each of m numbers (O(m)), check if `d` divides their GCD (O(1)). This is the core optimization.

2. **For "smallest element satisfying condition" problems, sort first**: Processing elements in sorted order ensures you find the smallest valid solution efficiently.

3. **Early exits optimize practical performance**: When GCD becomes 1, you know only 1 can work. Check for 1 in `nums` or continue scanning—either way, you have a bound.

Related problems: [Check If Array Pairs Are Divisible by k](/problem/check-if-array-pairs-are-divisible-by-k)
