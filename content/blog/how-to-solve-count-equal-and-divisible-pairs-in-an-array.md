---
title: "How to Solve Count Equal and Divisible Pairs in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Equal and Divisible Pairs in an Array. Easy difficulty, 84.0% acceptance rate. Topics: Array."
date: "2028-06-19"
category: "dsa-patterns"
tags: ["count-equal-and-divisible-pairs-in-an-array", "array", "easy"]
---

# How to Solve Count Equal and Divisible Pairs in an Array

This problem asks us to count pairs of indices `(i, j)` where `i < j`, the values at those indices are equal, and the product of the indices is divisible by `k`. While the problem is classified as "Easy," it requires careful attention to the constraints and an efficient approach to avoid unnecessary computations. The interesting challenge here is combining two conditions: value equality and a divisibility check on indices.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider `nums = [3, 1, 2, 3, 2, 1]` and `k = 2`.

We need to find all pairs `(i, j)` where:

1. `i < j`
2. `nums[i] == nums[j]`
3. `(i * j) % k == 0`

Let's examine each value group:

**Value 3 appears at indices 0 and 3:**

- Pair (0, 3): Check if `(0 * 3) % 2 == 0` → `0 % 2 == 0` → True ✓

**Value 1 appears at indices 1 and 5:**

- Pair (1, 5): Check if `(1 * 5) % 2 == 0` → `5 % 2 == 1` → False ✗

**Value 2 appears at indices 2 and 4:**

- Pair (2, 4): Check if `(2 * 4) % 2 == 0` → `8 % 2 == 0` → True ✓

So we have 2 valid pairs: (0, 3) and (2, 4). The key insight is that we only need to check pairs where values match, so we can group indices by value first.

## Brute Force Approach

The most straightforward solution is to check every possible pair `(i, j)` where `i < j`:

1. Initialize a counter to 0
2. For each `i` from 0 to n-2:
3. For each `j` from i+1 to n-1:
4. If `nums[i] == nums[j]` and `(i * j) % k == 0`, increment counter

This approach has O(n²) time complexity, which becomes problematic for large arrays. With n up to 100, this means up to 10,000 operations, which is acceptable for this problem's constraints. However, it's still worth understanding the optimal approach as it teaches valuable patterns for more complex problems.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countPairsBruteForce(nums, k):
    n = len(nums)
    count = 0

    # Check every possible pair (i, j) where i < j
    for i in range(n - 1):
        for j in range(i + 1, n):
            # Check both conditions
            if nums[i] == nums[j] and (i * j) % k == 0:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countPairsBruteForce(nums, k) {
  let count = 0;
  const n = nums.length;

  // Check every possible pair (i, j) where i < j
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      // Check both conditions
      if (nums[i] === nums[j] && (i * j) % k === 0) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int countPairsBruteForce(int[] nums, int k) {
    int count = 0;
    int n = nums.length;

    // Check every possible pair (i, j) where i < j
    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            // Check both conditions
            if (nums[i] == nums[j] && (i * j) % k == 0) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimal Solution

The brute force approach works for this problem's constraints, but we can optimize it slightly by grouping indices by value. This doesn't change the worst-case time complexity (which remains O(n²) when all values are equal), but it helps us think about the problem more efficiently and prepares us for similar problems with tighter constraints.

The key insight: We only need to check pairs where values are equal, so we can:

1. Group indices by value using a hash map
2. For each group of indices, check all pairs within that group
3. Count pairs where the product of indices is divisible by k

<div class="code-group">

```python
# Time: O(n²) worst case, but often better | Space: O(n)
def countPairs(nums, k):
    """
    Count pairs (i, j) where i < j, nums[i] == nums[j], and (i * j) % k == 0.

    Args:
        nums: List of integers
        k: Integer divisor

    Returns:
        Count of valid pairs
    """
    from collections import defaultdict

    # Step 1: Group indices by their values
    # This allows us to only check pairs where values are equal
    value_to_indices = defaultdict(list)

    # Store each index under its corresponding value
    for i, num in enumerate(nums):
        value_to_indices[num].append(i)

    # Step 2: Initialize counter for valid pairs
    count = 0

    # Step 3: For each group of indices with the same value
    for indices in value_to_indices.values():
        n_group = len(indices)

        # Only need to check if we have at least 2 indices in the group
        if n_group < 2:
            continue

        # Step 4: Check all pairs within this group
        # We use two loops to check every pair (i, j) where i < j
        for i in range(n_group - 1):
            for j in range(i + 1, n_group):
                # Get the actual indices from the original array
                idx1 = indices[i]
                idx2 = indices[j]

                # Check if the product of indices is divisible by k
                if (idx1 * idx2) % k == 0:
                    count += 1

    return count
```

```javascript
// Time: O(n²) worst case, but often better | Space: O(n)
function countPairs(nums, k) {
  /**
   * Count pairs (i, j) where i < j, nums[i] == nums[j], and (i * j) % k == 0.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Integer divisor
   * @return {number} Count of valid pairs
   */

  // Step 1: Group indices by their values
  // This allows us to only check pairs where values are equal
  const valueToIndices = new Map();

  // Store each index under its corresponding value
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (!valueToIndices.has(num)) {
      valueToIndices.set(num, []);
    }
    valueToIndices.get(num).push(i);
  }

  // Step 2: Initialize counter for valid pairs
  let count = 0;

  // Step 3: For each group of indices with the same value
  for (const indices of valueToIndices.values()) {
    const nGroup = indices.length;

    // Only need to check if we have at least 2 indices in the group
    if (nGroup < 2) {
      continue;
    }

    // Step 4: Check all pairs within this group
    // We use two loops to check every pair (i, j) where i < j
    for (let i = 0; i < nGroup - 1; i++) {
      for (let j = i + 1; j < nGroup; j++) {
        // Get the actual indices from the original array
        const idx1 = indices[i];
        const idx2 = indices[j];

        // Check if the product of indices is divisible by k
        if ((idx1 * idx2) % k === 0) {
          count++;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) worst case, but often better | Space: O(n)
import java.util.*;

public class Solution {
    public int countPairs(int[] nums, int k) {
        /**
         * Count pairs (i, j) where i < j, nums[i] == nums[j], and (i * j) % k == 0.
         *
         * @param nums Array of integers
         * @param k Integer divisor
         * @return Count of valid pairs
         */

        // Step 1: Group indices by their values
        // This allows us to only check pairs where values are equal
        Map<Integer, List<Integer>> valueToIndices = new HashMap<>();

        // Store each index under its corresponding value
        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];
            valueToIndices.putIfAbsent(num, new ArrayList<>());
            valueToIndices.get(num).add(i);
        }

        // Step 2: Initialize counter for valid pairs
        int count = 0;

        // Step 3: For each group of indices with the same value
        for (List<Integer> indices : valueToIndices.values()) {
            int nGroup = indices.size();

            // Only need to check if we have at least 2 indices in the group
            if (nGroup < 2) {
                continue;
            }

            // Step 4: Check all pairs within this group
            // We use two loops to check every pair (i, j) where i < j
            for (int i = 0; i < nGroup - 1; i++) {
                for (int j = i + 1; j < nGroup; j++) {
                    // Get the actual indices from the original array
                    int idx1 = indices.get(i);
                    int idx2 = indices.get(j);

                    // Check if the product of indices is divisible by k
                    if ((idx1 * idx2) % k == 0) {
                        count++;
                    }
                }
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- In the worst case, when all elements in the array are equal, we still check all O(n²) pairs. However, when values are distinct, we only check O(n) pairs (none, since each group has size 1).
- The grouping step takes O(n) time to build the hash map.
- Overall worst-case time complexity is O(n²), but average case is often better depending on the distribution of values.

**Space Complexity:**

- We use O(n) space to store the hash map that groups indices by value.
- In the worst case, when all values are distinct, we store n entries in the hash map, each with a list of size 1.

## Common Mistakes

1. **Forgetting the `i < j` condition:** The problem explicitly states `0 <= i < j < n`, but some candidates might accidentally count pairs where `i == j` or `i > j`. Always double-check your loop bounds.

2. **Integer overflow with large indices:** While not an issue in Python (which handles big integers automatically), in Java and JavaScript, multiplying two large indices could overflow. However, with n ≤ 100 in this problem, the maximum product is 99 × 98 = 9702, which is safe for 32-bit integers.

3. **Incorrect grouping logic:** When grouping indices by value, make sure you're comparing the actual values from `nums`, not the indices themselves. A common mistake is to group by index instead of value.

4. **Missing the divisibility check:** Some candidates might only check `nums[i] == nums[j]` and forget the `(i * j) % k == 0` condition. Always verify you're checking all required conditions.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Grouping by value:** Many array problems become easier when you group elements by their values. This pattern appears in:
   - **Two Sum** - You can use a hash map to store values and their indices
   - **Group Anagrams** - Group strings by their sorted version or character count
   - **Find All Duplicates in an Array** - Use the array itself or a hash map to track seen values

2. **Pair counting with conditions:** Counting pairs that satisfy certain conditions is a common interview pattern:
   - **Count Number of Pairs With Absolute Difference K** - Count pairs where the absolute difference equals k
   - **Count Number of Bad Pairs** - Count pairs that don't satisfy a condition (the complement of this problem)
   - **Number of Good Pairs** - Simpler version without the divisibility condition

## Key Takeaways

1. **Group before pairing:** When you need to find pairs with equal values, group indices by value first. This avoids unnecessary comparisons between unequal values.

2. **Break complex conditions into steps:** This problem has two conditions (equal values AND divisible product). Handle them in logical order: first filter by value equality, then check the divisibility condition.

3. **Understand when optimization matters:** While the brute force O(n²) solution works here due to small constraints (n ≤ 100), recognizing the grouping pattern prepares you for similar problems with larger constraints where O(n²) would be too slow.

Related problems: [Count Number of Pairs With Absolute Difference K](/problem/count-number-of-pairs-with-absolute-difference-k), [Count Number of Bad Pairs](/problem/count-number-of-bad-pairs)
