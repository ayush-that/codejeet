---
title: "How to Solve Increasing Triplet Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Increasing Triplet Subsequence. Medium difficulty, 39.2% acceptance rate. Topics: Array, Greedy."
date: "2026-11-06"
category: "dsa-patterns"
tags: ["increasing-triplet-subsequence", "array", "greedy", "medium"]
---

# How to Solve Increasing Triplet Subsequence

This problem asks whether there exists three indices `i < j < k` in an array where `nums[i] < nums[j] < nums[k]`. What makes this problem interesting is that we need to find just _one_ such triplet, not all of them, and we need to do it efficiently. The challenge lies in finding a solution better than the obvious O(n³) brute force approach.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 1, 5, 0, 4, 6]`

We want to find three numbers in increasing order with their indices also increasing. The brute force would check all combinations, but let's think smarter:

We can maintain two variables:

- `first`: smallest number we've seen so far
- `second`: smallest number we've seen that has a smaller number before it

Step-by-step:

1. Start: `first = ∞`, `second = ∞`
2. `num = 2`: Update `first = 2` (smallest so far)
3. `num = 1`: Update `first = 1` (new smallest)
4. `num = 5`: Since `5 > first`, update `second = 5` (we now have a potential pair: 1, 5)
5. `num = 0`: Update `first = 0` (new smallest, but this doesn't affect our existing pair)
6. `num = 4`: Since `4 > first` and `4 < second`, update `second = 4` (better pair: 0, 4)
7. `num = 6`: Since `6 > second`, we found our triplet! (0, 4, 6)

The key insight: we don't need to track the actual indices—if we find a number greater than `second`, we know there exists some smaller number before it (stored in `first`) and another number between them (stored in `second`).

## Brute Force Approach

The most straightforward solution is to check all possible triplets:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def increasingTriplet(nums):
    n = len(nums)
    # Check all possible triplets
    for i in range(n):
        for j in range(i + 1, n):
            # Early exit if first two aren't increasing
            if nums[i] >= nums[j]:
                continue
            for k in range(j + 1, n):
                if nums[j] < nums[k]:
                    return True
    return False
```

```javascript
// Time: O(n³) | Space: O(1)
function increasingTriplet(nums) {
  const n = nums.length;
  // Check all possible triplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Early exit if first two aren't increasing
      if (nums[i] >= nums[j]) continue;
      for (let k = j + 1; k < n; k++) {
        if (nums[j] < nums[k]) return true;
      }
    }
  }
  return false;
}
```

```java
// Time: O(n³) | Space: O(1)
public boolean increasingTriplet(int[] nums) {
    int n = nums.length;
    // Check all possible triplets
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Early exit if first two aren't increasing
            if (nums[i] >= nums[j]) continue;
            for (int k = j + 1; k < n; k++) {
                if (nums[j] < nums[k]) return true;
            }
        }
    }
    return false;
}
```

</div>

**Why this fails:** With n up to 5×10⁵ in constraints, O(n³) is far too slow. Even with the early continue, worst-case (strictly increasing array) still requires checking O(n³) triplets.

## Optimized Approach

The key insight comes from realizing we only need to track two things:

1. The smallest number we've seen so far (`first`)
2. The smallest number that has a smaller number before it (`second`)

Think of it this way:

- `first` represents the best candidate for the first element of a triplet
- `second` represents the best candidate for the second element (it has a valid first element before it)
- If we find any number greater than `second`, we have our triplet!

This is a greedy approach: we always maintain the smallest possible `first` and `second` values, which gives us the best chance of finding a third number that completes the triplet.

Why does this work? Consider `nums = [1, 2, 0, 3]`:

- When we see `3`, `first = 0` and `second = 2`
- Even though `0` came after `2`, the existence of `second = 2` tells us there was _some_ number before `2` (in this case, `1`) that was smaller
- So `1 < 2 < 3` is a valid triplet

The indices work out because `first` and `second` represent values that occurred in order, even if `first` gets updated to a value that appears later in the array.

## Optimal Solution

Here's the O(n) time, O(1) space solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def increasingTriplet(nums):
    # Initialize with infinity to represent "no value found yet"
    first = second = float('inf')

    for num in nums:
        # If current number is smaller than or equal to first, update first
        # Note: we use <= to handle duplicates properly
        if num <= first:
            first = num
        # Else if current number is smaller than or equal to second, update second
        # This means we found a number greater than first
        elif num <= second:
            second = num
        # Else we found a number greater than both first and second
        else:
            return True

    # If we never found a number greater than second, no triplet exists
    return False
```

```javascript
// Time: O(n) | Space: O(1)
function increasingTriplet(nums) {
  // Initialize with Infinity to represent "no value found yet"
  let first = Infinity;
  let second = Infinity;

  for (const num of nums) {
    // If current number is smaller than or equal to first, update first
    // Note: we use <= to handle duplicates properly
    if (num <= first) {
      first = num;
    }
    // Else if current number is smaller than or equal to second, update second
    // This means we found a number greater than first
    else if (num <= second) {
      second = num;
    }
    // Else we found a number greater than both first and second
    else {
      return true;
    }
  }

  // If we never found a number greater than second, no triplet exists
  return false;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean increasingTriplet(int[] nums) {
    // Initialize with max value to represent "no value found yet"
    // Using long to handle Integer.MAX_VALUE cases
    long first = Long.MAX_VALUE;
    long second = Long.MAX_VALUE;

    for (int num : nums) {
        // If current number is smaller than or equal to first, update first
        // Note: we use <= to handle duplicates properly
        if (num <= first) {
            first = num;
        }
        // Else if current number is smaller than or equal to second, update second
        // This means we found a number greater than first
        else if (num <= second) {
            second = num;
        }
        // Else we found a number greater than both first and second
        else {
            return true;
        }
    }

    // If we never found a number greater than second, no triplet exists
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We make a single pass through the array, performing constant-time operations for each element.

**Space Complexity:** O(1)  
We only use two variables (`first` and `second`) regardless of input size.

## Common Mistakes

1. **Using `<` instead of `<=` for comparisons**  
   With duplicates like `[1, 1, 1]`, using `<` would incorrectly return true. We need `<=` to handle equal values properly.

2. **Initializing with `nums[0]` instead of infinity**  
   If you initialize `first = nums[0]`, you might miss cases where the first element isn't part of the triplet. Starting with infinity ensures we can properly track the smallest values.

3. **Confusing the order of updates**  
   The order matters: check `num <= first` first, then `num <= second`. If you reverse these, you might incorrectly update `second` when you should update `first`.

4. **Overthinking the index tracking**  
   Some candidates try to track actual indices, but this isn't necessary. The greedy approach works because we only care about existence, not the specific indices.

## When You'll See This Pattern

This "track two smallest candidates" pattern appears in several problems:

1. **Longest Increasing Subsequence (LIS)** - While the optimal LIS solution uses binary search (O(n log n)), this problem is essentially "LIS of length 3" which can be solved in O(n) with a specialized approach.

2. **Find the Increasing Subsequence of Length K** - A generalization where you need to find if there's an increasing subsequence of length K. The same greedy approach extends by maintaining K-1 variables.

3. **132 Pattern** - Similar concept but with different constraints (find i < j < k with nums[i] < nums[k] < nums[j]).

The core idea is maintaining the "best so far" candidates greedily to enable early termination when we find what we're looking for.

## Key Takeaways

- **Greedy tracking works for existence problems**: When you only need to know if something exists (not count or find all), often you can maintain optimal candidates greedily.
- **Think about what information you actually need**: We don't need the actual indices or values of the triplet, just to know if one exists.
- **Test with edge cases**: Always test with duplicates (`[1, 1, 1]`), strictly increasing arrays, strictly decreasing arrays, and arrays where the answer appears late.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Count Special Quadruplets](/problem/count-special-quadruplets), [Count Good Triplets in an Array](/problem/count-good-triplets-in-an-array)
