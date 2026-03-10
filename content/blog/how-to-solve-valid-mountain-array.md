---
title: "How to Solve Valid Mountain Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Valid Mountain Array. Easy difficulty, 35.0% acceptance rate. Topics: Array."
date: "2027-04-06"
category: "dsa-patterns"
tags: ["valid-mountain-array", "array", "easy"]
---

# How to Solve Valid Mountain Array

A mountain array must strictly increase to a peak, then strictly decrease after it. The challenge lies in verifying both conditions while handling edge cases: arrays that only increase, only decrease, have plateaus, or are too short. This problem tests careful array traversal and boundary checking.

## Visual Walkthrough

Let's trace through `[1, 3, 5, 4, 2]`:

1. **Check length**: `5 >= 3` ✓
2. **Find the peak**: Walk from left while numbers increase:
   - Start at index 0: `1 < 3` ✓
   - Index 1: `3 < 5` ✓
   - Index 2: `5 < 4` ✋ Stop — peak is at index 2
3. **Verify peak position**: Peak index `2` is between `0` and `4` (valid indices) ✓
4. **Check decreasing side**: Walk from peak while numbers decrease:
   - Index 2 to 3: `5 > 4` ✓
   - Index 3 to 4: `4 > 2` ✓
   - Reached end ✓

All conditions satisfied → `true`.

Now try `[1, 2, 3, 4]`:

1. Length ✓
2. Find peak: Walk increases through entire array
3. Peak is at last index (3), which violates `i < arr.length - 1` ✋
4. → `false` (no decreasing side)

## Brute Force Approach

A naive approach might check every possible peak position:

1. For each index `i` from 1 to `n-2`:
   - Verify all elements before `i` strictly increase
   - Verify all elements after `i` strictly decrease

This requires O(n²) time because for each candidate peak, we scan the entire left and right sides. While correct, it's inefficient. A better approach uses a single pass.

## Optimal Solution

We can solve this in one pass with two pointers or a single walker:

**Algorithm**:

1. If length < 3, return `false`
2. Walk from left while `arr[i] < arr[i+1]` (strictly increasing)
3. If we didn't move from start or reached the end, return `false` (no peak or no decreasing side)
4. Walk from peak while `arr[i] > arr[i+1]` (strictly decreasing)
5. Return `true` only if we reached the end

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def validMountainArray(arr):
    n = len(arr)

    # Step 1: Basic length check
    if n < 3:
        return False

    i = 0

    # Step 2: Walk up the increasing side
    # Stop when we reach the end or find a non-increasing pair
    while i + 1 < n and arr[i] < arr[i + 1]:
        i += 1

    # Step 3: Check if peak is valid
    # Peak cannot be at start (no increasing side) or end (no decreasing side)
    if i == 0 or i == n - 1:
        return False

    # Step 4: Walk down the decreasing side
    # All remaining pairs must be strictly decreasing
    while i + 1 < n and arr[i] > arr[i + 1]:
        i += 1

    # Step 5: Return true only if we reached the end
    return i == n - 1
```

```javascript
// Time: O(n) | Space: O(1)
function validMountainArray(arr) {
  const n = arr.length;

  // Step 1: Basic length check
  if (n < 3) {
    return false;
  }

  let i = 0;

  // Step 2: Walk up the increasing side
  // Stop when we reach the end or find a non-increasing pair
  while (i + 1 < n && arr[i] < arr[i + 1]) {
    i++;
  }

  // Step 3: Check if peak is valid
  // Peak cannot be at start (no increasing side) or end (no decreasing side)
  if (i === 0 || i === n - 1) {
    return false;
  }

  // Step 4: Walk down the decreasing side
  // All remaining pairs must be strictly decreasing
  while (i + 1 < n && arr[i] > arr[i + 1]) {
    i++;
  }

  // Step 5: Return true only if we reached the end
  return i === n - 1;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean validMountainArray(int[] arr) {
    int n = arr.length;

    // Step 1: Basic length check
    if (n < 3) {
        return false;
    }

    int i = 0;

    // Step 2: Walk up the increasing side
    // Stop when we reach the end or find a non-increasing pair
    while (i + 1 < n && arr[i] < arr[i + 1]) {
        i++;
    }

    // Step 3: Check if peak is valid
    // Peak cannot be at start (no increasing side) or end (no decreasing side)
    if (i == 0 || i == n - 1) {
        return false;
    }

    // Step 4: Walk down the decreasing side
    // All remaining pairs must be strictly decreasing
    while (i + 1 < n && arr[i] > arr[i + 1]) {
        i++;
    }

    // Step 5: Return true only if we reached the end
    return i == n - 1;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)  
We traverse the array at most twice (once up, once down), which simplifies to O(n). In practice, we often stop early.

**Space Complexity**: O(1)  
We only use a few integer variables regardless of input size.

## Common Mistakes

1. **Forgetting to check peak position**: The peak must have elements on both sides. Candidates often miss checking `i == 0` or `i == n-1`, returning true for arrays like `[1,2,3]` or `[3,2,1]`.

2. **Not handling equal values**: The problem requires _strict_ increase and decrease. Using `<=` or `>=` instead of `<` and `>` will accept plateaus like `[1,2,2,1]`.

3. **Incorrect length check**: Some start with `if len(arr) <= 3` instead of `< 3`. A length of 2 can never be a mountain array.

4. **Off-by-one in while conditions**: Writing `i < n` instead of `i + 1 < n` leads to index out of bounds when checking `arr[i+1]`.

## When You'll See This Pattern

This "walk until condition breaks, then verify" pattern appears in many array validation problems:

1. **Find Peak Element** (LeetCode 162): Similar peak-finding logic but with different constraints.
2. **Monotonic Array** (LeetCode 896): Checking if an array is entirely increasing or decreasing.
3. **Longest Mountain in Array** (LeetCode 845): Extends this concept to find the longest mountain subarray.

The core technique is using linear scans with careful boundary checking to validate sequence properties.

## Key Takeaways

1. **Single-pass validation**: Many array validation problems can be solved by walking through the array once while checking conditions.
2. **Boundary awareness**: Always check array bounds before accessing `arr[i+1]` or `arr[i-1]`.
3. **Early termination**: Once a validation condition fails, you can often return immediately rather than continuing the scan.

Related problems: [Minimum Number of Removals to Make Mountain Array](/problem/minimum-number-of-removals-to-make-mountain-array), [Beautiful Towers I](/problem/beautiful-towers-i)
