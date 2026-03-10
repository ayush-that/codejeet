---
title: "How to Solve Find Indices With Index and Value Difference II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Indices With Index and Value Difference II. Medium difficulty, 32.6% acceptance rate. Topics: Array, Two Pointers."
date: "2029-09-27"
category: "dsa-patterns"
tags: ["find-indices-with-index-and-value-difference-ii", "array", "two-pointers", "medium"]
---

# How to Solve Find Indices With Index and Value Difference II

You need to find two indices `i` and `j` in an array where both their index difference (`abs(i - j)`) and their value difference (`abs(nums[i] - nums[j])`) meet minimum thresholds. The challenge is that you can't just sort the array (which would help with value differences) because you need to preserve original indices for the index difference constraint. This creates an interesting tension between maintaining order and finding sufficiently different values.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider:

- `nums = [5, 4, 2, 10, 8]`
- `indexDifference = 2`
- `valueDifference = 4`

We need `abs(i - j) ≥ 2` and `abs(nums[i] - nums[j]) ≥ 4`.

**Step-by-step reasoning:**

1. Start with `i = 0` (value 5). We need `j ≥ 2` (since `abs(i - j) ≥ 2`).
   - Check `j = 2`: value 2, difference = |5-2| = 3 < 4 ❌
   - Check `j = 3`: value 10, difference = |5-10| = 5 ≥ 4 ✅
   - Found valid pair: `[0, 3]` with index difference 3 and value difference 5.

But what if we didn't find a match early? Let's think systematically:

For each possible `i`, we need to check if there exists a `j` with:

1. `j ≥ i + indexDifference` OR `j ≤ i - indexDifference`
2. `abs(nums[i] - nums[j]) ≥ valueDifference`

The key insight: For a given `i`, we don't need to check every possible `j`. We just need to know if there exists any value in the valid `j` range that's either:

- Very small (≤ `nums[i] - valueDifference`)
- Very large (≥ `nums[i] + valueDifference`)

So as we iterate through the array, we can track the minimum and maximum values we've seen in the valid range of indices.

Let's trace this optimized approach:

- `i = 0`: No valid `j` yet (need `j ≥ 2`)
- `i = 1`: No valid `j` yet (need `j ≥ 3`)
- `i = 2`: Now `j = 0` is valid (since `abs(2-0) ≥ 2`)
  - Track min value seen in valid range: at index 0, value 5
  - Track max value seen in valid range: at index 0, value 5
  - Check if current value (2) differs enough:
    - `5 - 2 = 3 < 4` ❌
    - `2 - 5 = -3` (absolute value 3) < 4 ❌
- `i = 3`: Valid `j` indices are 0,1 (since `abs(3-0)=3`, `abs(3-1)=2`)
  - Update min: min(5, 4, 2) = 2 at index 2
  - Update max: max(5, 4, 2) = 5 at index 0
  - Current value = 10
    - Check if `10 ≥ 5 + 4 = 9` ✅ (10 ≥ 9)
    - Found valid pair! The max value 5 at index 0 works with current value 10 at index 3.

This shows how tracking extremes in the valid range helps us quickly check conditions.

## Brute Force Approach

The brute force solution checks all pairs `(i, j)` and returns the first pair satisfying both conditions:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def findIndices(nums, indexDifference, valueDifference):
    n = len(nums)

    # Check all possible pairs
    for i in range(n):
        for j in range(n):
            # Check both conditions
            if abs(i - j) >= indexDifference and abs(nums[i] - nums[j]) >= valueDifference:
                return [i, j]

    # No valid pair found
    return [-1, -1]
```

```javascript
// Time: O(n²) | Space: O(1)
function findIndices(nums, indexDifference, valueDifference) {
  const n = nums.length;

  // Check all possible pairs
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Check both conditions
      if (Math.abs(i - j) >= indexDifference && Math.abs(nums[i] - nums[j]) >= valueDifference) {
        return [i, j];
      }
    }
  }

  // No valid pair found
  return [-1, -1];
}
```

```java
// Time: O(n²) | Space: O(1)
public int[] findIndices(int[] nums, int indexDifference, int valueDifference) {
    int n = nums.length;

    // Check all possible pairs
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            // Check both conditions
            if (Math.abs(i - j) >= indexDifference &&
                Math.abs(nums[i] - nums[j]) >= valueDifference) {
                return new int[]{i, j};
            }
        }
    }

    // No valid pair found
    return new int[]{-1, -1};
}
```

</div>

**Why this is insufficient:**

- With `n` up to 10^5, O(n²) is far too slow (would require ~10^10 operations).
- We're doing redundant work by checking all pairs when we only need to know if extreme values exist in valid ranges.

## Optimized Approach

The key insight is that for any index `i`, valid `j` indices are those with `abs(i - j) ≥ indexDifference`. As we iterate through the array, we can maintain two pieces of information about the "valid region" (indices that could be paired with future `i` values):

1. **Minimum value and its index** in the valid region
2. **Maximum value and its index** in the valid region

For a current index `i`, the valid region consists of indices `j` where `j ≤ i - indexDifference`. When we're at index `i`, we check:

- If `nums[i] - min_value ≥ valueDifference`, then `[min_index, i]` is a valid pair
- If `max_value - nums[i] ≥ valueDifference`, then `[max_index, i]` is a valid pair

Why does this work? Because:

- If there exists any `j` with `nums[j]` small enough that `nums[i] - nums[j] ≥ valueDifference`, then the minimum value in the valid region will work (or something even better).
- If there exists any `j` with `nums[j]` large enough that `nums[j] - nums[i] ≥ valueDifference`, then the maximum value in the valid region will work (or something even better).

We also need to handle the symmetric case where `j > i`, which we can do by iterating from both ends or by checking both directions.

## Optimal Solution

Here's the complete optimized solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findIndices(nums, indexDifference, valueDifference):
    n = len(nums)

    # Track minimum and maximum values in the valid region
    # and their corresponding indices
    min_idx = 0  # index of minimum value in valid region
    max_idx = 0  # index of maximum value in valid region

    for i in range(indexDifference, n):
        # j is the index that just entered the valid region
        # (can be paired with future i values)
        j = i - indexDifference

        # Update min and max indices if we found new extremes
        if nums[j] < nums[min_idx]:
            min_idx = j
        if nums[j] > nums[max_idx]:
            max_idx = j

        # Check if current i pairs with min or max in valid region
        if nums[i] - nums[min_idx] >= valueDifference:
            return [min_idx, i]
        if nums[max_idx] - nums[i] >= valueDifference:
            return [max_idx, i]

    # No valid pair found
    return [-1, -1]
```

```javascript
// Time: O(n) | Space: O(1)
function findIndices(nums, indexDifference, valueDifference) {
  const n = nums.length;

  // Track minimum and maximum values in the valid region
  // and their corresponding indices
  let minIdx = 0; // index of minimum value in valid region
  let maxIdx = 0; // index of maximum value in valid region

  for (let i = indexDifference; i < n; i++) {
    // j is the index that just entered the valid region
    // (can be paired with future i values)
    const j = i - indexDifference;

    // Update min and max indices if we found new extremes
    if (nums[j] < nums[minIdx]) {
      minIdx = j;
    }
    if (nums[j] > nums[maxIdx]) {
      maxIdx = j;
    }

    // Check if current i pairs with min or max in valid region
    if (nums[i] - nums[minIdx] >= valueDifference) {
      return [minIdx, i];
    }
    if (nums[maxIdx] - nums[i] >= valueDifference) {
      return [maxIdx, i];
    }
  }

  // No valid pair found
  return [-1, -1];
}
```

```java
// Time: O(n) | Space: O(1)
public int[] findIndices(int[] nums, int indexDifference, int valueDifference) {
    int n = nums.length;

    // Track minimum and maximum values in the valid region
    // and their corresponding indices
    int minIdx = 0;  // index of minimum value in valid region
    int maxIdx = 0;  // index of maximum value in valid region

    for (int i = indexDifference; i < n; i++) {
        // j is the index that just entered the valid region
        // (can be paired with future i values)
        int j = i - indexDifference;

        // Update min and max indices if we found new extremes
        if (nums[j] < nums[minIdx]) {
            minIdx = j;
        }
        if (nums[j] > nums[maxIdx]) {
            maxIdx = j;
        }

        // Check if current i pairs with min or max in valid region
        if (nums[i] - nums[minIdx] >= valueDifference) {
            return new int[]{minIdx, i};
        }
        if (nums[maxIdx] - nums[i] >= valueDifference) {
            return new int[]{maxIdx, i};
        }
    }

    // No valid pair found
    return new int[]{-1, -1};
}
```

</div>

**Line-by-line explanation of key parts:**

1. **`for i in range(indexDifference, n):`** - We start from `indexDifference` because we need at least that distance between indices. Earlier indices can't have any valid `j` yet.

2. **`j = i - indexDifference`** - This is the index that just became valid to pair with future indices. When `i = indexDifference`, `j = 0` becomes valid. When `i = indexDifference + 1`, `j = 1` becomes valid, etc.

3. **Updating min/max indices** - We compare `nums[j]` with current extremes. Note we're comparing values, not indices, to find the actual minimum and maximum values.

4. **Checking conditions** - We check if current `nums[i]` differs enough from the minimum or maximum in the valid region. We don't need absolute value because:
   - `nums[i] - nums[min_idx]` is always ≥ 0 (since `nums[min_idx]` is the minimum)
   - `nums[max_idx] - nums[i]` is always ≥ 0 (since `nums[max_idx]` is the maximum)

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array from `indexDifference` to `n-1`
- Each iteration does constant work: a few comparisons and arithmetic operations
- Even though we have two nested ideas (tracking min/max and checking current), we do it in one pass

**Space Complexity: O(1)**

- We only store a few integer variables: `min_idx`, `max_idx`, loop counters
- No additional data structures that grow with input size

## Common Mistakes

1. **Starting the loop at 0 instead of `indexDifference`**: If you start at 0, you'll try to check pairs before there are enough indices in the valid region, leading to incorrect results or unnecessary complexity.

2. **Forgetting to update min/max indices before checking conditions**: You must update with the new `j` before checking the current `i`, because `j` just entered the valid region and could be the new minimum or maximum.

3. **Using absolute value in the final check**: While the problem requires `abs(nums[i] - nums[j]) ≥ valueDifference`, our solution checks `nums[i] - min ≥ valueDifference` and `max - nums[i] ≥ valueDifference`. These are equivalent because:
   - When comparing with min: `nums[i] ≥ min`, so `abs(nums[i] - min) = nums[i] - min`
   - When comparing with max: `max ≥ nums[i]`, so `abs(max - nums[i]) = max - nums[i]`
     Adding absolute value here would be redundant and potentially incorrect for negative numbers.

4. **Not handling the case where `indexDifference > n`**: The problem guarantees `indexDifference ≤ n`, but in practice, you should check. If `indexDifference > n`, no valid pair exists since you can't have indices that far apart.

## When You'll See This Pattern

This "tracking extremes in a sliding window" pattern appears in several problems:

1. **Sliding Window Maximum (LeetCode 239)** - Uses a deque to track maximum values in a sliding window, similar to how we track min/max here.

2. **Best Time to Buy and Sell Stock (LeetCode 121)** - Tracks the minimum price seen so far to compute maximum profit, which is essentially tracking one extreme (minimum) to pair with current values.

3. **Minimum Absolute Difference Between Elements With Constraint (LeetCode 2817)** - Very similar pattern: find two indices with index difference constraint and minimize value difference (instead of maximizing it to meet a threshold).

The core idea is maintaining information about the best candidates (minimum/maximum) in a valid region as you iterate through the array, allowing O(n) solutions instead of O(n²).

## Key Takeaways

1. **When you need to find pairs satisfying distance constraints**, consider tracking extremes (min/max) in the valid region rather than checking all pairs.

2. **The valid region often slides along with your iteration** - as you move forward, new indices enter the valid region and old ones leave (though in this problem, all indices that enter remain valid).

3. **For "difference" problems**, think about whether you need the actual pairs or just need to know if a pair exists. Often, tracking only the extreme values is sufficient to answer existence questions.

Related problems: [Minimum Absolute Difference Between Elements With Constraint](/problem/minimum-absolute-difference-between-elements-with-constraint), [Find Indices With Index and Value Difference I](/problem/find-indices-with-index-and-value-difference-i)
