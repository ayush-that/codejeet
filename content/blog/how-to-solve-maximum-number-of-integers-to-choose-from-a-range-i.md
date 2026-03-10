---
title: "How to Solve Maximum Number of Integers to Choose From a Range I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Integers to Choose From a Range I. Medium difficulty, 68.0% acceptance rate. Topics: Array, Hash Table, Binary Search, Greedy, Sorting."
date: "2026-05-31"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-integers-to-choose-from-a-range-i",
    "array",
    "hash-table",
    "binary-search",
    "medium",
  ]
---

# How to Solve Maximum Number of Integers to Choose From a Range I

You need to select the maximum number of integers from 1 to n without exceeding maxSum, while avoiding any numbers in the banned list. The challenge lies in efficiently determining which numbers to pick when you can't simply take all numbers from 1 to n due to the sum constraint and banned numbers.

What makes this problem interesting is that it combines multiple constraints: you need to avoid certain numbers, stay within a sum limit, and maximize count. The optimal approach requires careful ordering of choices and efficient lookup of banned numbers.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** banned = [3, 5, 7], n = 8, maxSum = 13

**Step 1:** We need to pick numbers from 1 to 8, but can't pick 3, 5, or 7.

**Step 2:** Available numbers are: 1, 2, 4, 6, 8

**Step 3:** To maximize count with limited sum, we should pick the smallest available numbers first (greedy approach).

**Step 4:** Let's try picking in order:

- Pick 1 → sum = 1, count = 1
- Pick 2 → sum = 3, count = 2
- Skip 3 (banned)
- Pick 4 → sum = 7, count = 3
- Skip 5 (banned)
- Pick 6 → sum = 13, count = 4
- Skip 7 (banned)
- Try 8 → would make sum = 21 (exceeds maxSum 13), so stop

**Result:** We can pick 4 integers: [1, 2, 4, 6]

This example shows the key insight: by always picking the smallest available number, we maximize how many numbers we can fit within maxSum.

## Brute Force Approach

A naive approach would be to generate all possible subsets of numbers from 1 to n that don't include banned numbers, then check which subset has the maximum size while staying under maxSum.

**Why this fails:**

- For n up to 10⁴, there are 2¹⁰⁰⁰⁰ possible subsets - astronomically large
- Even with pruning, this is computationally impossible
- The brute force would have exponential time complexity O(2ⁿ)

A slightly better but still inefficient approach would be to iterate through all numbers from 1 to n, check if each is banned, and add it if possible. But checking if a number is banned by scanning the banned array each time would be O(n × m) where m is the size of banned, which could be O(n²) in worst case.

## Optimized Approach

The key insight is that we need to:

1. Quickly check if a number is banned (O(1) lookup)
2. Iterate through numbers in increasing order (to maximize count)
3. Stop when adding the next available number would exceed maxSum

**Step-by-step reasoning:**

1. **Convert banned list to a set** for O(1) membership checks
2. **Iterate from 1 to n** (inclusive)
3. **Skip numbers in the banned set**
4. **Add available numbers to our sum** until we would exceed maxSum
5. **Count how many numbers we successfully added**

This is a **greedy approach** - by always taking the smallest available number, we ensure we can fit the maximum possible count within the sum constraint. If we skipped a small number to take a larger one, we would have fewer total numbers.

**Proof of correctness:** For any optimal solution, if it contains a larger number x but skips a smaller available number y, we could replace x with y (since y < x) and still have a valid solution (sum decreases or stays same). By repeatedly applying this swap, we can transform any optimal solution into the greedy solution without decreasing the count.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(m) where m = len(banned)
def maxCount(banned, n, maxSum):
    """
    Returns the maximum number of integers that can be chosen
    from the range [1, n] without using banned numbers and
    without exceeding maxSum.
    """
    # Step 1: Convert banned list to a set for O(1) lookups
    banned_set = set(banned)

    # Step 2: Initialize counters
    current_sum = 0
    count = 0

    # Step 3: Iterate through all numbers from 1 to n
    for num in range(1, n + 1):
        # Skip if number is banned
        if num in banned_set:
            continue

        # Step 4: Check if we can add this number without exceeding maxSum
        if current_sum + num <= maxSum:
            current_sum += num
            count += 1
        else:
            # Once we can't add a number, we can break early
            # because all subsequent numbers are larger
            break

    return count
```

```javascript
// Time: O(n) | Space: O(m) where m = banned.length
function maxCount(banned, n, maxSum) {
  /**
   * Returns the maximum number of integers that can be chosen
   * from the range [1, n] without using banned numbers and
   * without exceeding maxSum.
   */

  // Step 1: Convert banned array to a Set for O(1) lookups
  const bannedSet = new Set(banned);

  // Step 2: Initialize counters
  let currentSum = 0;
  let count = 0;

  // Step 3: Iterate through all numbers from 1 to n
  for (let num = 1; num <= n; num++) {
    // Skip if number is banned
    if (bannedSet.has(num)) {
      continue;
    }

    // Step 4: Check if we can add this number without exceeding maxSum
    if (currentSum + num <= maxSum) {
      currentSum += num;
      count++;
    } else {
      // Once we can't add a number, we can break early
      // because all subsequent numbers are larger
      break;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(m) where m = banned.length
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int maxCount(int[] banned, int n, int maxSum) {
        /**
         * Returns the maximum number of integers that can be chosen
         * from the range [1, n] without using banned numbers and
         * without exceeding maxSum.
         */

        // Step 1: Convert banned array to a Set for O(1) lookups
        Set<Integer> bannedSet = new HashSet<>();
        for (int num : banned) {
            bannedSet.add(num);
        }

        // Step 2: Initialize counters
        int currentSum = 0;
        int count = 0;

        // Step 3: Iterate through all numbers from 1 to n
        for (int num = 1; num <= n; num++) {
            // Skip if number is banned
            if (bannedSet.contains(num)) {
                continue;
            }

            // Step 4: Check if we can add this number without exceeding maxSum
            if (currentSum + num <= maxSum) {
                currentSum += num;
                count++;
            } else {
                // Once we can't add a number, we can break early
                // because all subsequent numbers are larger
                break;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through numbers from 1 to n exactly once
- Each iteration does O(1) operations: set lookup and arithmetic
- The early break when we exceed maxSum doesn't change worst-case complexity but improves average case

**Space Complexity: O(m)** where m = length of banned array

- We store banned numbers in a hash set for O(1) lookups
- The set contains at most m elements (all unique banned numbers)
- Additional variables use O(1) space

**Why not O(n log n) from sorting?** We don't need to sort because we're iterating in natural order (1 to n). The numbers are already in sorted order by definition.

## Common Mistakes

1. **Not using a set for banned numbers**: Checking if a number is banned by scanning the array each time leads to O(n × m) time. Candidates might think "the banned list is small" but it could have up to n elements.

2. **Forgetting to break early**: Once current_sum + num > maxSum, all subsequent numbers are larger, so adding them would also exceed maxSum. Continuing the loop wastes time.

3. **Off-by-one errors with range**: The problem says range [1, n], which is inclusive. Using `range(1, n)` in Python or `i < n` in Java/JavaScript would exclude n.

4. **Not considering that banned numbers might be outside [1, n]**: While the problem doesn't explicitly say banned numbers are within [1, n], it doesn't hurt to include them in the set. They just won't be encountered during iteration.

5. **Trying to sort banned array**: Some candidates sort banned to use binary search, but a hash set is simpler and has the same O(1) lookup time.

## When You'll See This Pattern

This problem combines **greedy selection** with **efficient membership testing** - a common pattern in optimization problems with constraints.

**Related problems:**

1. **Append K Integers With Minimal Sum (Medium)** - Similar greedy approach of taking smallest available numbers to minimize sum while maximizing count.

2. **First Missing Positive (Hard)** - Also involves finding available numbers in a range, though with more complex in-place rearrangement.

3. **Find All Numbers Disappeared in an Array (Easy)** - Finding which numbers from 1 to n are missing from an array, similar to checking banned numbers.

4. **Two Sum (Easy)** - Uses hash set for O(1) lookups, though for a different purpose (complement finding).

The core pattern: when you need to maximize count with a sum constraint and need to exclude certain values, sort (or iterate in order) and take smallest available elements first.

## Key Takeaways

1. **Greedy works for maximizing count with sum constraints**: When you need to pick as many items as possible without exceeding a sum limit, always pick the smallest available items first.

2. **Use hash sets for O(1) membership tests**: Whenever you need to frequently check if an element exists in a collection, convert it to a hash set (unless you need ordering or duplicates).

3. **Early termination optimization**: When iterating in sorted order and you hit a constraint breakpoint (like exceeding maxSum), you can break early since all subsequent elements will also violate the constraint.

4. **Range iteration clarity**: Be precise about inclusive/exclusive bounds. `[1, n]` means `1 <= x <= n`, so loops should run from 1 to n inclusive.

**Related problems:** [First Missing Positive](/problem/first-missing-positive), [Find All Numbers Disappeared in an Array](/problem/find-all-numbers-disappeared-in-an-array), [Append K Integers With Minimal Sum](/problem/append-k-integers-with-minimal-sum)
