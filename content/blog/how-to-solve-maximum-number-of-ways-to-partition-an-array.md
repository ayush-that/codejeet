---
title: "How to Solve Maximum Number of Ways to Partition an Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Ways to Partition an Array. Hard difficulty, 35.6% acceptance rate. Topics: Array, Hash Table, Counting, Enumeration, Prefix Sum."
date: "2026-03-07"
category: "dsa-patterns"
tags: ["maximum-number-of-ways-to-partition-an-array", "array", "hash-table", "counting", "hard"]
---

# How to Solve Maximum Number of Ways to Partition an Array

This problem asks us to count how many valid pivot indices exist in an array, where a pivot index splits the array into two non-empty parts with equal sums. While the concept seems straightforward, the challenge lies in efficiently checking all possible pivot positions without recalculating sums repeatedly. The key insight is that we need to track how changing a single element affects the balance between left and right sums across all pivot positions.

## Visual Walkthrough

Let's walk through a small example: `nums = [2, 5, 3, 2, 5]` with `k = 3` and `value = 2` (though the original problem doesn't mention k and value, I'll focus on the core partition counting).

First, calculate the total sum: 2 + 5 + 3 + 2 + 5 = 17.

Now check each possible pivot position (1 through n-1):

- Pivot = 1: Left sum = 2, Right sum = 5+3+2+5 = 15 → Not equal
- Pivot = 2: Left sum = 2+5 = 7, Right sum = 3+2+5 = 10 → Not equal
- Pivot = 3: Left sum = 2+5+3 = 10, Right sum = 2+5 = 7 → Not equal
- Pivot = 4: Left sum = 2+5+3+2 = 12, Right sum = 5 → Not equal

No pivots work for this array. But what if we could change one element? The actual problem is more complex: we need to consider changing one element to another value and count pivots for each possible change. The efficient solution uses prefix sums and careful counting with hash maps.

## Brute Force Approach

A brute force approach would check every pivot position (n-1 possibilities) for the original array, then consider changing each element to `k` (n possibilities) and rechecking all pivots. This gives us O(n³) time complexity:

1. For each index i (0 to n-1) where we might change nums[i] to k
2. For each pivot position p (1 to n-1)
3. Calculate left sum and right sum, checking if they're equal

This is clearly too slow for n up to 10⁵. Even just checking all pivots for one array configuration is O(n²) if we naively recalculate sums.

```python
# Brute force - too slow for large n
def waysToPartition(nums, k):
    n = len(nums)
    count = 0

    # Check original array
    for pivot in range(1, n):
        left_sum = sum(nums[:pivot])
        right_sum = sum(nums[pivot:])
        if left_sum == right_sum:
            count += 1

    # Try changing each element to k
    for i in range(n):
        original = nums[i]
        nums[i] = k
        for pivot in range(1, n):
            left_sum = sum(nums[:pivot])
            right_sum = sum(nums[pivot:])
            if left_sum == right_sum:
                count += 1
        nums[i] = original

    return count
```

The problem with this approach is the repeated sum calculations. Each pivot check recalculates sums from scratch, leading to O(n³) time complexity.

## Optimized Approach

The key insight is to use **prefix sums** to quickly calculate any subarray sum. For a pivot at position p:

- Left sum = prefix[p]
- Right sum = total_sum - prefix[p]

For them to be equal: prefix[p] = total_sum - prefix[p] → 2 × prefix[p] = total_sum

So in the original array, we're looking for pivot positions where prefix[p] = total_sum / 2.

When we change one element at index i from nums[i] to k:

- The change delta = k - nums[i]
- All prefix sums from i+1 to n-1 increase by delta
- The total sum changes by delta

We need to efficiently track how this change affects the balance for all pivot positions.

The optimal approach uses two hash maps:

1. `left` counts how many prefix sums on the left side would match if we consider the change
2. `right` counts how many prefix sums on the right side would match

We process from right to left to build the right map, then process from left to right while updating both maps.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def waysToPartition(nums, k):
    n = len(nums)
    prefix = [0] * n
    prefix[0] = nums[0]

    # Step 1: Calculate prefix sums
    for i in range(1, n):
        prefix[i] = prefix[i-1] + nums[i]

    total = prefix[-1]
    count = 0

    # Step 2: Count pivots in original array
    # A pivot at position p means: prefix[p-1] == total - prefix[p-1]
    # Which simplifies to: 2 * prefix[p-1] == total
    for p in range(1, n):
        if prefix[p-1] == total - prefix[p-1]:
            count += 1

    # Step 3: Initialize frequency maps
    from collections import defaultdict

    # right[d] = count of indices where changing an element creates
    # a valid pivot to the right of the changed element
    right = defaultdict(int)

    # left[d] = count of indices where changing an element creates
    # a valid pivot to the left of the changed element
    left = defaultdict(int)

    # Step 4: Build right map by processing from right to left
    # For each position i, we consider changing nums[i] to k
    # The delta = k - nums[i]
    # New total = total + delta
    # For pivot p > i: we need prefix[p] - delta == new_total - (prefix[p] - delta)
    # Which simplifies to: 2*prefix[p] == total + delta
    for i in range(n-1, 0, -1):
        delta = k - nums[i]
        new_total = total + delta
        # Check if current prefix (before i) could form a pivot
        if 2 * prefix[i-1] == new_total:
            right[delta] += 1

    # Step 5: Process from left to right, updating answer
    ans = count  # Start with original count

    for i in range(n):
        delta = k - nums[i]
        new_total = total + delta

        # Count pivots from left map (pivots before i)
        ans = max(ans, count + left[-delta])

        # Count pivots from right map (pivots after i)
        ans = max(ans, count + right[delta])

        # Update maps for next iteration
        if i < n-1:
            # Move current delta from right to left
            delta_next = k - nums[i+1]
            if 2 * prefix[i] == total + delta_next:
                right[delta_next] -= 1
                left[delta_next] += 1

    return ans
```

```javascript
// Time: O(n) | Space: O(n)
function waysToPartition(nums, k) {
  const n = nums.length;
  const prefix = new Array(n);
  prefix[0] = nums[0];

  // Step 1: Calculate prefix sums
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] + nums[i];
  }

  const total = prefix[n - 1];
  let count = 0;

  // Step 2: Count pivots in original array
  for (let p = 1; p < n; p++) {
    if (prefix[p - 1] === total - prefix[p - 1]) {
      count++;
    }
  }

  // Step 3: Initialize frequency maps
  const right = new Map();
  const left = new Map();

  // Step 4: Build right map from right to left
  for (let i = n - 1; i > 0; i--) {
    const delta = k - nums[i];
    const newTotal = total + delta;
    if (2 * prefix[i - 1] === newTotal) {
      right.set(delta, (right.get(delta) || 0) + 1);
    }
  }

  // Step 5: Process from left to right
  let ans = count;

  for (let i = 0; i < n; i++) {
    const delta = k - nums[i];
    const newTotal = total + delta;

    // Check pivots from left map
    const leftCount = left.get(-delta) || 0;
    ans = Math.max(ans, count + leftCount);

    // Check pivots from right map
    const rightCount = right.get(delta) || 0;
    ans = Math.max(ans, count + rightCount);

    // Update maps for next iteration
    if (i < n - 1) {
      const deltaNext = k - nums[i + 1];
      if (2 * prefix[i] === total + deltaNext) {
        // Move from right to left
        const rightVal = right.get(deltaNext) || 0;
        if (rightVal > 0) {
          right.set(deltaNext, rightVal - 1);
        }
        left.set(deltaNext, (left.get(deltaNext) || 0) + 1);
      }
    }
  }

  return ans;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int waysToPartition(int[] nums, int k) {
        int n = nums.length;
        long[] prefix = new long[n];
        prefix[0] = nums[0];

        // Step 1: Calculate prefix sums
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i-1] + nums[i];
        }

        long total = prefix[n-1];
        int count = 0;

        // Step 2: Count pivots in original array
        for (int p = 1; p < n; p++) {
            if (prefix[p-1] == total - prefix[p-1]) {
                count++;
            }
        }

        // Step 3: Initialize frequency maps
        Map<Long, Integer> right = new HashMap<>();
        Map<Long, Integer> left = new HashMap<>();

        // Step 4: Build right map from right to left
        for (int i = n-1; i > 0; i--) {
            long delta = k - nums[i];
            long newTotal = total + delta;
            if (2 * prefix[i-1] == newTotal) {
                right.put(delta, right.getOrDefault(delta, 0) + 1);
            }
        }

        // Step 5: Process from left to right
        int ans = count;

        for (int i = 0; i < n; i++) {
            long delta = k - nums[i];
            long newTotal = total + delta;

            // Check pivots from left map
            ans = Math.max(ans, count + left.getOrDefault(-delta, 0));

            // Check pivots from right map
            ans = Math.max(ans, count + right.getOrDefault(delta, 0));

            // Update maps for next iteration
            if (i < n - 1) {
                long deltaNext = k - nums[i+1];
                if (2 * prefix[i] == total + deltaNext) {
                    // Move from right to left
                    right.put(deltaNext, right.getOrDefault(deltaNext, 0) - 1);
                    left.put(deltaNext, left.getOrDefault(deltaNext, 0) + 1);
                }
            }
        }

        return ans;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Calculating prefix sums: O(n)
- Counting original pivots: O(n)
- Building right map: O(n)
- Processing left to right: O(n)
- All hash map operations are O(1) on average

**Space Complexity: O(n)**

- Prefix array: O(n)
- Two hash maps: O(n) in worst case when many distinct deltas exist
- Total space: O(n)

The linear time complexity is achieved by using prefix sums to avoid recalculating sums and hash maps to efficiently count pivot conditions.

## Common Mistakes

1. **Off-by-one errors with pivot indices**: Remember that pivot must be between 1 and n-1 inclusive. A pivot at position p splits the array into [0, p-1] and [p, n-1]. Double-check your index arithmetic.

2. **Integer overflow**: With n up to 10⁵ and values up to 10⁵, sums can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, default in Python).

3. **Forgetting to handle the original array**: Some candidates only consider cases where they change an element, but we must also count pivots in the unmodified array.

4. **Incorrect delta calculation**: When changing nums[i] to k, remember that delta = k - nums[i], not nums[i] - k. This sign matters for the hash map lookups.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix Sums**: Used to quickly calculate subarray sums. Similar problems:
   - [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) - Uses prefix sums with hash map
   - [Continuous Subarray Sum](https://leetcode.com/problems/continuous-subarray-sum/) - Checks for multiples in prefix sums

2. **Two-pass processing with hash maps**: Processing data from both directions while maintaining counts. Similar to:
   - [Two Sum](https://leetcode.com/problems/two-sum/) - Uses hash map to find complements
   - [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/) - Uses prefix counts with odd/even tracking

3. **Balance/partition problems**: Finding split points that balance two parts. Related to:
   - [Partition Labels](https://leetcode.com/problems/partition-labels/) - Different criteria but similar split concept
   - [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) - Minimizes maximum subarray sum

## Key Takeaways

1. **Prefix sums transform range sum queries into O(1) operations**, which is crucial for problems involving subarray sums.

2. **When an operation affects all elements to one side**, consider processing from both directions and using frequency maps to track conditions.

3. **The pivot condition 2×prefix = total** is a common pattern in partition problems. Recognizing this algebraic simplification can save computation.

4. **Always consider the unmodified case** when problems allow modifications - the optimal solution might not involve any changes.

Related problems: [Partition Equal Subset Sum](/problem/partition-equal-subset-sum), [Partition to K Equal Sum Subsets](/problem/partition-to-k-equal-sum-subsets)
