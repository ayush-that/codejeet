---
title: "How to Solve Partition Array into Disjoint Intervals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition Array into Disjoint Intervals. Medium difficulty, 49.4% acceptance rate. Topics: Array."
date: "2027-07-11"
category: "dsa-patterns"
tags: ["partition-array-into-disjoint-intervals", "array", "medium"]
---

# How to Solve Partition Array into Disjoint Intervals

You're given an array `nums` and need to split it into two contiguous subarrays `left` and `right` where every element in `left` is ≤ every element in `right`. The catch: you need the smallest possible `left` while keeping both subarrays non-empty. This problem is tricky because it requires tracking both local and global information simultaneously — you need to know the maximum in the left partition and the minimum in the right partition at every possible split point.

## Visual Walkthrough

Let's trace through `nums = [5, 0, 3, 8, 6]` step by step:

We want to find the smallest index `i` where:

- All elements in `nums[0..i]` ≤ all elements in `nums[i+1..n-1]`
- This means: `max(nums[0..i]) ≤ min(nums[i+1..n-1])`

**Step 1:** Start with `i = 0` (left = [5], right = [0,3,8,6])

- Left max = 5
- Right min = min(0,3,8,6) = 0
- Condition fails: 5 ≤ 0? No

**Step 2:** `i = 1` (left = [5,0], right = [3,8,6])

- Left max = max(5,0) = 5
- Right min = min(3,8,6) = 3
- Condition fails: 5 ≤ 3? No

**Step 3:** `i = 2` (left = [5,0,3], right = [8,6])

- Left max = max(5,0,3) = 5
- Right min = min(8,6) = 6
- Condition passes: 5 ≤ 6? Yes ✓

The answer is `i = 2`, so `left` length = `i + 1 = 3`.

The key insight: we need to efficiently track the maximum on the left side and minimum on the right side for every possible split point.

## Brute Force Approach

The most straightforward approach checks every possible split point:

1. For each index `i` from `0` to `n-2` (ensuring both partitions are non-empty)
2. Compute `max(nums[0..i])`
3. Compute `min(nums[i+1..n-1])`
4. Check if `max_left ≤ min_right`
5. Return the first `i` where this holds, plus 1 for the length

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def partitionDisjoint_brute(nums):
    n = len(nums)
    # Try every possible split point
    for i in range(n - 1):
        left_max = max(nums[:i + 1])  # O(n) operation
        right_min = min(nums[i + 1:])  # O(n) operation

        if left_max <= right_min:
            return i + 1  # length of left partition
    return n  # fallback (shouldn't happen with valid input)
```

```javascript
// Time: O(n²) | Space: O(1)
function partitionDisjointBrute(nums) {
  const n = nums.length;
  // Try every possible split point
  for (let i = 0; i < n - 1; i++) {
    // Compute max of left partition
    let leftMax = -Infinity;
    for (let j = 0; j <= i; j++) {
      leftMax = Math.max(leftMax, nums[j]);
    }

    // Compute min of right partition
    let rightMin = Infinity;
    for (let j = i + 1; j < n; j++) {
      rightMin = Math.min(rightMin, nums[j]);
    }

    if (leftMax <= rightMin) {
      return i + 1; // length of left partition
    }
  }
  return n; // fallback
}
```

```java
// Time: O(n²) | Space: O(1)
public int partitionDisjointBrute(int[] nums) {
    int n = nums.length;
    // Try every possible split point
    for (int i = 0; i < n - 1; i++) {
        // Compute max of left partition
        int leftMax = Integer.MIN_VALUE;
        for (int j = 0; j <= i; j++) {
            leftMax = Math.max(leftMax, nums[j]);
        }

        // Compute min of right partition
        int rightMin = Integer.MAX_VALUE;
        for (int j = i + 1; j < n; j++) {
            rightMin = Math.min(rightMin, nums[j]);
        }

        if (leftMax <= rightMin) {
            return i + 1;  // length of left partition
        }
    }
    return n;  // fallback
}
```

</div>

**Why this is inefficient:** For each split point `i`, we recompute the maximum and minimum from scratch, leading to O(n²) time complexity. With n up to 10⁵, this is far too slow.

## Optimized Approach

The key optimization is to precompute information so we don't recompute it repeatedly. Here's the insight:

1. We need `max(left) ≤ min(right)` for a valid split
2. We can precompute `right_min[i]` = minimum value from index `i` to the end
3. As we scan left to right, we can track the current `left_max`
4. At each position `i`, check if `left_max ≤ right_min[i+1]`

This gives us O(n) time with O(n) space. But we can do even better with O(1) space!

**The O(1) space insight:** We don't need to store all the right minimums. Instead:

- Track `left_max` = maximum in the current left partition
- Track `global_max` = maximum seen so far in the entire array
- Track `partition_idx` = current candidate for the split point

When we see a number smaller than `left_max`, it means our current left partition is invalid (because this smaller number would need to be in left but isn't). So we extend the left partition to include this number and update `left_max` to `global_max`.

## Optimal Solution

Here's the O(n) time, O(1) space solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def partitionDisjoint(nums):
    """
    Partition array into left and right where max(left) <= min(right)
    and left has the smallest possible size.
    """
    n = len(nums)

    # left_max tracks the maximum value in the current left partition
    left_max = nums[0]
    # global_max tracks the maximum value seen so far in the entire array
    global_max = nums[0]
    # partition_idx tracks where we think the split should be
    partition_idx = 0

    for i in range(1, n):
        # Update the global maximum seen so far
        global_max = max(global_max, nums[i])

        # If current number is less than left_max, it violates the condition
        # because this number should be in left partition but isn't
        if nums[i] < left_max:
            # Extend left partition to include current position
            partition_idx = i
            # Update left_max to global_max (all values up to i are now in left)
            left_max = global_max

    # partition_idx is the last index of left partition
    # Length = index + 1 (since indices are 0-based)
    return partition_idx + 1
```

```javascript
// Time: O(n) | Space: O(1)
function partitionDisjoint(nums) {
  const n = nums.length;

  // leftMax tracks the maximum value in the current left partition
  let leftMax = nums[0];
  // globalMax tracks the maximum value seen so far in the entire array
  let globalMax = nums[0];
  // partitionIdx tracks where we think the split should be
  let partitionIdx = 0;

  for (let i = 1; i < n; i++) {
    // Update the global maximum seen so far
    globalMax = Math.max(globalMax, nums[i]);

    // If current number is less than leftMax, it violates the condition
    // because this number should be in left partition but isn't
    if (nums[i] < leftMax) {
      // Extend left partition to include current position
      partitionIdx = i;
      // Update leftMax to globalMax (all values up to i are now in left)
      leftMax = globalMax;
    }
  }

  // partitionIdx is the last index of left partition
  // Length = index + 1 (since indices are 0-based)
  return partitionIdx + 1;
}
```

```java
// Time: O(n) | Space: O(1)
public int partitionDisjoint(int[] nums) {
    int n = nums.length;

    // leftMax tracks the maximum value in the current left partition
    int leftMax = nums[0];
    // globalMax tracks the maximum value seen so far in the entire array
    int globalMax = nums[0];
    // partitionIdx tracks where we think the split should be
    int partitionIdx = 0;

    for (int i = 1; i < n; i++) {
        // Update the global maximum seen so far
        globalMax = Math.max(globalMax, nums[i]);

        // If current number is less than leftMax, it violates the condition
        // because this number should be in left partition but isn't
        if (nums[i] < leftMax) {
            // Extend left partition to include current position
            partitionIdx = i;
            // Update leftMax to globalMax (all values up to i are now in left)
            leftMax = globalMax;
        }
    }

    // partitionIdx is the last index of left partition
    // Length = index + 1 (since indices are 0-based)
    return partitionIdx + 1;
}
```

</div>

**Why this works:** The algorithm maintains the invariant that all elements in the current left partition are ≤ all elements that will be in the right partition. When we encounter a number smaller than `left_max`, we know our current partition is invalid (because that smaller number would need to be in left). So we extend the partition to include it and update `left_max` to the maximum of all values we've seen so far.

## Complexity Analysis

**Time Complexity:** O(n)  
We make a single pass through the array, performing constant-time operations at each step.

**Space Complexity:** O(1)  
We only use a few integer variables regardless of input size.

## Common Mistakes

1. **Off-by-one errors with partition index:** Candidates often return `partition_idx` instead of `partition_idx + 1`. Remember: `partition_idx` is the last index of the left partition, so the length is `index + 1`.

2. **Forgetting to update `global_max`:** The `global_max` variable is crucial. When we extend the left partition, we need to update `left_max` to `global_max`, not to `nums[i]` or some other value.

3. **Incorrect condition check:** Some candidates check `nums[i] <= left_max` instead of `nums[i] < left_max`. The strict inequality is correct because if `nums[i] == left_max`, it doesn't violate the condition (equal values are allowed in either partition).

4. **Not handling the first element properly:** The algorithm starts with `left_max = nums[0]` and `partition_idx = 0`. Some candidates try to start from index 1, which complicates the logic unnecessarily.

## When You'll See This Pattern

This "track local and global extremes" pattern appears in problems where you need to partition or split an array based on some condition involving maximums/minimums on both sides:

1. **Sum of Beauty in the Array (LeetCode 2012):** Similar concept of checking conditions based on maximums to the left and minimums to the right for each element.

2. **Minimum Index of a Valid Split (LeetCode 2780):** Another partitioning problem where you need to find a split point satisfying certain conditions about element frequencies.

3. **Record Breaker Problems:** Problems where you need to find elements that are greater than all previous elements (like "Number of Days Without Meeting" variants).

The core technique is maintaining running statistics (max, min, sum, etc.) as you scan the array, allowing you to make decisions in O(1) time at each step.

## Key Takeaways

1. **Think in terms of invariants:** The condition `max(left) ≤ min(right)` is an invariant you need to maintain. Tracking both `left_max` and `global_max` lets you check and maintain this invariant efficiently.

2. **Single-pass solutions often track running statistics:** When you need to make decisions based on information from both sides of an array, consider whether you can compute one side's information on the fly while scanning.

3. **Test with edge cases:** Always test with arrays that are strictly increasing, strictly decreasing, and with duplicate values. These often reveal bugs in the partition logic.

Related problems: [Sum of Beauty in the Array](/problem/sum-of-beauty-in-the-array), [Optimal Partition of String](/problem/optimal-partition-of-string), [Minimum Index of a Valid Split](/problem/minimum-index-of-a-valid-split)
