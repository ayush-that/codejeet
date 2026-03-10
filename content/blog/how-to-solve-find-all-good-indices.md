---
title: "How to Solve Find All Good Indices — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find All Good Indices. Medium difficulty, 40.7% acceptance rate. Topics: Array, Dynamic Programming, Prefix Sum."
date: "2029-04-06"
category: "dsa-patterns"
tags: ["find-all-good-indices", "array", "dynamic-programming", "prefix-sum", "medium"]
---

# How to Solve "Find All Good Indices"

This problem asks us to find indices in an array where the `k` elements before the index are non-increasing and the `k` elements after are non-decreasing. What makes this tricky is that checking each candidate index independently would be O(k) per index, leading to O(nk) time — too slow for large inputs. The key insight is that we can precompute how far each element extends in non-increasing/non-decreasing order using dynamic programming, then check indices in O(1) time each.

## Visual Walkthrough

Let's walk through an example: `nums = [2,1,1,1,3,4,1]`, `k = 2`

We need to find indices `i` where `2 <= i < 5` (since `k <= i < n - k`):

- Before `i`: elements at `i-2` and `i-1` must be non-increasing
- After `i`: elements at `i+1` and `i+2` must be non-decreasing

**Step 1: Precompute non-increasing streaks from the left**
For each position, how many consecutive elements before it (including itself) are non-increasing?

- Index 0: `[2]` → streak = 1
- Index 1: `[2,1]` → 1 ≤ 2? Yes → streak = 2
- Index 2: `[1,1]` → 1 ≤ 1? Yes → streak = 3
- Index 3: `[1,1]` → 1 ≤ 1? Yes → streak = 4
- Index 4: `[1,3]` → 3 ≤ 1? No → streak = 1
- Index 5: `[3,4]` → 4 ≤ 3? No → streak = 1
- Index 6: `[4,1]` → 1 ≤ 4? Yes → streak = 2

So `left = [1,2,3,4,1,1,2]`

**Step 2: Precompute non-decreasing streaks from the right**
For each position, how many consecutive elements after it (including itself) are non-decreasing?

- Index 6: `[1]` → streak = 1
- Index 5: `[4,1]` → 1 ≥ 4? No → streak = 1
- Index 4: `[3,4]` → 4 ≥ 3? Yes → streak = 2
- Index 3: `[1,3]` → 3 ≥ 1? Yes → streak = 3
- Index 2: `[1,1]` → 1 ≥ 1? Yes → streak = 4
- Index 1: `[1,1]` → 1 ≥ 1? Yes → streak = 5
- Index 0: `[2,1]` → 1 ≥ 2? No → streak = 1

So `right = [1,5,4,3,2,1,1]`

**Step 3: Check each candidate index**
We check indices 2, 3, 4 (since k=2, n=7):

- i=2: `left[i-1] = left[1] = 2 ≥ k` ✓, `right[i+1] = right[3] = 3 ≥ k` ✓ → Good!
- i=3: `left[2] = 3 ≥ 2` ✓, `right[4] = 2 ≥ 2` ✓ → Good!
- i=4: `left[3] = 4 ≥ 2` ✓, `right[5] = 1 ≥ 2` ✗ → Not good

Result: `[2,3]`

## Brute Force Approach

The brute force approach checks each candidate index `i` (where `k ≤ i < n - k`) by directly examining the `k` elements before and after it:

1. For each `i` from `k` to `n-k-1`:
2. Check if `nums[i-k] ≥ nums[i-k+1] ≥ ... ≥ nums[i-1]`
3. Check if `nums[i+1] ≤ nums[i+2] ≤ ... ≤ nums[i+k]`
4. If both conditions hold, add `i` to result

This takes O(k) time per index, O(nk) total time, which is too slow when n and k can be up to 10^5 (n\*k could be 10^10 operations).

<div class="code-group">

```python
# Time: O(n*k) | Space: O(1) - Too slow for large inputs!
def goodIndicesBrute(nums, k):
    n = len(nums)
    result = []

    # Check each candidate index
    for i in range(k, n - k):
        # Check k elements before i are non-increasing
        valid_before = True
        for j in range(i - k, i - 1):
            if nums[j] < nums[j + 1]:
                valid_before = False
                break

        # Check k elements after i are non-decreasing
        valid_after = True
        for j in range(i + 1, i + k):
            if nums[j] > nums[j + 1]:
                valid_after = False
                break

        if valid_before and valid_after:
            result.append(i)

    return result
```

```javascript
// Time: O(n*k) | Space: O(1) - Too slow for large inputs!
function goodIndicesBrute(nums, k) {
  const n = nums.length;
  const result = [];

  // Check each candidate index
  for (let i = k; i < n - k; i++) {
    // Check k elements before i are non-increasing
    let validBefore = true;
    for (let j = i - k; j < i - 1; j++) {
      if (nums[j] < nums[j + 1]) {
        validBefore = false;
        break;
      }
    }

    // Check k elements after i are non-decreasing
    let validAfter = true;
    for (let j = i + 1; j < i + k; j++) {
      if (nums[j] > nums[j + 1]) {
        validAfter = false;
        break;
      }
    }

    if (validBefore && validAfter) {
      result.push(i);
    }
  }

  return result;
}
```

```java
// Time: O(n*k) | Space: O(1) - Too slow for large inputs!
public List<Integer> goodIndicesBrute(int[] nums, int k) {
    List<Integer> result = new ArrayList<>();
    int n = nums.length;

    // Check each candidate index
    for (int i = k; i < n - k; i++) {
        // Check k elements before i are non-increasing
        boolean validBefore = true;
        for (int j = i - k; j < i - 1; j++) {
            if (nums[j] < nums[j + 1]) {
                validBefore = false;
                break;
            }
        }

        // Check k elements after i are non-decreasing
        boolean validAfter = true;
        for (int j = i + 1; j < i + k; j++) {
            if (nums[j] > nums[j + 1]) {
                validAfter = false;
                break;
            }
        }

        if (validBefore && validAfter) {
            result.add(i);
        }
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that we can precompute for each position:

1. `left[i]`: Length of non-increasing sequence ending at `i` (from the left)
2. `right[i]`: Length of non-decreasing sequence starting at `i` (from the right)

Once we have these arrays:

- The `k` elements before index `i` are non-increasing if `left[i-1] ≥ k`
- The `k` elements after index `i` are non-decreasing if `right[i+1] ≥ k`

Why does this work?

- `left[i]` counts how many consecutive elements up to `i` are non-increasing
- If `left[i-1] ≥ k`, then positions `i-k` through `i-1` must all be non-increasing
- Similarly, `right[i]` counts how many consecutive elements from `i` onward are non-decreasing
- If `right[i+1] ≥ k`, then positions `i+1` through `i+k` must all be non-decreasing

This reduces each index check from O(k) to O(1) after O(n) preprocessing.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def goodIndices(nums, k):
    n = len(nums)

    # Step 1: Precompute left array - non-increasing streaks from left
    # left[i] = length of non-increasing sequence ending at i
    left = [1] * n  # Each element is at least a sequence of length 1
    for i in range(1, n):
        if nums[i] <= nums[i - 1]:
            # Current element continues the non-increasing streak
            left[i] = left[i - 1] + 1
        # else: left[i] remains 1 (new streak starts)

    # Step 2: Precompute right array - non-decreasing streaks from right
    # right[i] = length of non-decreasing sequence starting at i
    right = [1] * n
    for i in range(n - 2, -1, -1):  # Go backwards from second last to first
        if nums[i] <= nums[i + 1]:
            # Current element continues the non-decreasing streak
            right[i] = right[i + 1] + 1
        # else: right[i] remains 1 (new streak starts)

    # Step 3: Check each candidate index
    result = []
    # We need k elements before and after, so i ranges from k to n-k-1
    for i in range(k, n - k):
        # Check if k elements before i are non-increasing
        # left[i-1] tells us how many consecutive non-increasing elements end at i-1
        # If it's at least k, then positions i-k through i-1 are all non-increasing
        if left[i - 1] >= k and right[i + 1] >= k:
            result.append(i)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function goodIndices(nums, k) {
  const n = nums.length;

  // Step 1: Precompute left array - non-increasing streaks from left
  // left[i] = length of non-increasing sequence ending at i
  const left = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    if (nums[i] <= nums[i - 1]) {
      // Current element continues the non-increasing streak
      left[i] = left[i - 1] + 1;
    }
    // else: left[i] remains 1 (new streak starts)
  }

  // Step 2: Precompute right array - non-decreasing streaks from right
  // right[i] = length of non-decreasing sequence starting at i
  const right = new Array(n).fill(1);
  for (let i = n - 2; i >= 0; i--) {
    if (nums[i] <= nums[i + 1]) {
      // Current element continues the non-decreasing streak
      right[i] = right[i + 1] + 1;
    }
    // else: right[i] remains 1 (new streak starts)
  }

  // Step 3: Check each candidate index
  const result = [];
  // We need k elements before and after, so i ranges from k to n-k-1
  for (let i = k; i < n - k; i++) {
    // Check if k elements before i are non-increasing
    // left[i-1] tells us how many consecutive non-increasing elements end at i-1
    // If it's at least k, then positions i-k through i-1 are all non-increasing
    if (left[i - 1] >= k && right[i + 1] >= k) {
      result.push(i);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public List<Integer> goodIndices(int[] nums, int k) {
    int n = nums.length;
    List<Integer> result = new ArrayList<>();

    // Step 1: Precompute left array - non-increasing streaks from left
    // left[i] = length of non-increasing sequence ending at i
    int[] left = new int[n];
    Arrays.fill(left, 1);
    for (int i = 1; i < n; i++) {
        if (nums[i] <= nums[i - 1]) {
            // Current element continues the non-increasing streak
            left[i] = left[i - 1] + 1;
        }
        // else: left[i] remains 1 (new streak starts)
    }

    // Step 2: Precompute right array - non-decreasing streaks from right
    // right[i] = length of non-decreasing sequence starting at i
    int[] right = new int[n];
    Arrays.fill(right, 1);
    for (int i = n - 2; i >= 0; i--) {
        if (nums[i] <= nums[i + 1]) {
            // Current element continues the non-decreasing streak
            right[i] = right[i + 1] + 1;
        }
        // else: right[i] remains 1 (new streak starts)
    }

    // Step 3: Check each candidate index
    // We need k elements before and after, so i ranges from k to n-k-1
    for (int i = k; i < n - k; i++) {
        // Check if k elements before i are non-increasing
        // left[i-1] tells us how many consecutive non-increasing elements end at i-1
        // If it's at least k, then positions i-k through i-1 are all non-increasing
        if (left[i - 1] >= k && right[i + 1] >= k) {
            result.add(i);
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Computing `left` array: O(n) - one pass through the array
- Computing `right` array: O(n) - one pass through the array
- Checking candidate indices: O(n) - one pass through valid indices
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- `left` array: O(n)
- `right` array: O(n)
- Result list: O(n) in worst case (all indices could be good)
- Total: O(3n) = O(n)

## Common Mistakes

1. **Off-by-one errors in index ranges**: Candidates often get the range `k <= i < n - k` wrong. Remember it's `i < n - k`, not `i <= n - k`, because we need `k` elements after `i`. Test with small examples.

2. **Confusing non-increasing with strictly decreasing**: The problem asks for non-increasing (≤), not strictly decreasing (<). `[3,3,2]` is valid non-increasing. Always check the condition carefully.

3. **Incorrect streak computation**: When computing streaks, remember:
   - For `left`, we check `nums[i] <= nums[i-1]` (compare with previous)
   - For `right`, we check `nums[i] <= nums[i+1]` (compare with next)
   - The direction matters: `left` goes left-to-right, `right` goes right-to-left

4. **Checking wrong indices in final step**: We need to check `left[i-1]` (not `left[i]`) for elements before `i`, and `right[i+1]` (not `right[i]`) for elements after `i`. The element at `i` itself doesn't participate in either condition.

## When You'll See This Pattern

This "precompute streaks from both directions" pattern appears in problems where we need to check local conditions around each element:

1. **Find Good Days to Rob the Bank (LeetCode 2100)**: Almost identical problem - find days where security is non-increasing before and non-decreasing after.

2. **Longest Mountain in Array (LeetCode 845)**: Find longest subarray that increases then decreases. Uses similar left/right streak computation.

3. **Trapping Rain Water (LeetCode 42)**: Uses left/right maximum arrays to determine water height at each position.

The core idea is: when you need to check conditions involving neighbors on both sides, precomputing from both directions often gives O(n) solutions instead of O(n²).

## Key Takeaways

1. **Precomputation is powerful**: When you need to repeatedly check similar conditions (like "are the k elements before this index non-increasing?"), precompute the answer once for all positions.

2. **Think in terms of streaks**: Many array problems become easier when you think about "how far does this property extend from each position?" rather than checking each subarray independently.

3. **Two-pass solutions**: When a problem has symmetric conditions on left and right sides, consider making one pass from left to right and another from right to left to gather all needed information.

**Related problems**: [Find Good Days to Rob the Bank](/problem/find-good-days-to-rob-the-bank), [Abbreviating the Product of a Range](/problem/abbreviating-the-product-of-a-range), [Count the Number of K-Big Indices](/problem/count-the-number-of-k-big-indices)
