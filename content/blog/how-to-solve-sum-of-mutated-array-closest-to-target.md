---
title: "How to Solve Sum of Mutated Array Closest to Target — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Mutated Array Closest to Target. Medium difficulty, 46.2% acceptance rate. Topics: Array, Binary Search, Sorting."
date: "2028-08-13"
category: "dsa-patterns"
tags: ["sum-of-mutated-array-closest-to-target", "array", "binary-search", "sorting", "medium"]
---

# How to Solve Sum of Mutated Array Closest to Target

This problem asks us to find an integer value such that when we cap all array elements at that value (replacing any larger elements with the value), the resulting sum is as close as possible to a given target. The challenge lies in efficiently searching through possible values—the optimal value could be anywhere between 0 and the maximum array element, and checking every possible value would be too slow for large inputs.

## Visual Walkthrough

Let's walk through an example: `arr = [4, 9, 3]`, `target = 10`.

We need to find a value `v` where:

- Elements ≤ `v` stay the same
- Elements > `v` become `v`
- The sum is closest to 10

Let's try some values:

- `v = 0`: All elements become 0 → sum = 0, difference = 10
- `v = 1`: [1, 1, 1] → sum = 3, difference = 7
- `v = 2`: [2, 2, 2] → sum = 6, difference = 4
- `v = 3`: [3, 3, 3] → sum = 9, difference = 1
- `v = 4`: [4, 4, 3] → sum = 11, difference = 1
- `v = 5`: [4, 5, 3] → sum = 12, difference = 2
- `v = 6`: [4, 6, 3] → sum = 13, difference = 3
- `v = 9`: [4, 9, 3] → sum = 16, difference = 6

Both `v = 3` and `v = 4` give a difference of 1. According to the problem, we return the smaller value in case of a tie, so the answer is 3.

Notice the pattern: as `v` increases, the sum increases monotonically (never decreases). This monotonic property is key to using binary search!

## Brute Force Approach

The brute force approach would check every possible value from 0 up to the maximum element in the array. For each candidate value, we would:

1. Create a modified array by capping elements at the candidate value
2. Calculate the sum
3. Track which value gives the smallest absolute difference to target

However, this approach has serious problems:

- Time complexity is O(n × m) where n is array length and m is the maximum element
- For large arrays with large values (e.g., values up to 10^5), this becomes O(10^5 × 10^5) = O(10^10) operations, which is far too slow
- The problem constraints (arr.length up to 10^4, arr[i] up to 10^5) make this approach infeasible

The key insight we need is that the relationship between the candidate value and the resulting sum is monotonic: as the value increases, the sum never decreases. This monotonic property allows us to use binary search instead of checking every possible value.

## Optimized Approach

The optimal solution uses binary search on the possible values (0 to max(arr)). Here's the step-by-step reasoning:

1. **Why binary search works**: The function `f(v) = sum after capping at v` is monotonic non-decreasing. If we think of `v` as our search space, we can use binary search to find where `f(v)` crosses or gets closest to `target`.

2. **Preprocessing**: We can sort the array to quickly calculate the sum for any value `v`. Once sorted, for a given `v`, all elements ≤ `v` stay the same, and all elements > `v` become `v`. The sum becomes: sum of elements ≤ `v` + (number of elements > `v`) × `v`.

3. **Binary search logic**:
   - If `f(mid) < target`, we need a larger sum, so search in the right half (increase `v`)
   - If `f(mid) > target`, we need a smaller sum, so search in the left half (decrease `v`)
   - We track the best (closest) value found during the search

4. **Handling ties**: When two values give the same absolute difference, we need to return the smaller one. We handle this by preferring smaller values when differences are equal.

5. **Edge cases**:
   - If target is less than or equal to the minimum possible sum (when `v = 0`), return 0
   - If target is greater than or equal to the maximum possible sum (when `v = max(arr)`), return max(arr)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + log M * log n) where M is max(arr)
# Space: O(1) if we sort in-place, O(n) if we need to preserve original
def findBestValue(arr, target):
    """
    Find the value such that when we cap array elements at this value,
    the sum is closest to target.
    """
    # Sort the array to enable efficient sum calculation
    arr.sort()
    n = len(arr)

    # Prefix sum array to quickly calculate sum of first i elements
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]

    # Binary search bounds: possible values are from 0 to max(arr)
    left, right = 0, arr[-1]
    best_value = 0
    min_diff = float('inf')

    while left <= right:
        mid = (left + right) // 2

        # Find the index where elements become > mid
        # We can use binary search since arr is sorted
        import bisect
        idx = bisect.bisect_left(arr, mid)

        # Calculate sum when capping at mid:
        # - Elements before idx (arr[0..idx-1]) stay the same
        # - Elements from idx onward become mid
        current_sum = prefix[idx] + (n - idx) * mid

        # Calculate absolute difference from target
        diff = abs(current_sum - target)

        # Update best value if we found a better solution
        # or a tie with smaller value
        if diff < min_diff or (diff == min_diff and mid < best_value):
            min_diff = diff
            best_value = mid

        # Binary search adjustment based on whether sum is too small or too large
        if current_sum < target:
            left = mid + 1  # Need larger sum, so increase value
        else:
            right = mid - 1  # Need smaller sum, so decrease value

    return best_value
```

```javascript
// Time: O(n log n + log M * log n) where M is max(arr)
// Space: O(n) for prefix sum array
function findBestValue(arr, target) {
  // Sort the array to enable efficient sum calculation
  arr.sort((a, b) => a - b);
  const n = arr.length;

  // Build prefix sum array for quick sum calculations
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + arr[i];
  }

  // Binary search bounds
  let left = 0;
  let right = arr[n - 1];
  let bestValue = 0;
  let minDiff = Infinity;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Find first index where element > mid using binary search
    let idx = 0;
    let low = 0,
      high = n;
    while (low < high) {
      const m = Math.floor((low + high) / 2);
      if (arr[m] <= mid) {
        low = m + 1;
      } else {
        high = m;
      }
    }
    idx = low;

    // Calculate sum when capping at mid
    const currentSum = prefix[idx] + (n - idx) * mid;

    // Calculate absolute difference
    const diff = Math.abs(currentSum - target);

    // Update best value if we found better or equal with smaller value
    if (diff < minDiff || (diff === minDiff && mid < bestValue)) {
      minDiff = diff;
      bestValue = mid;
    }

    // Adjust binary search bounds
    if (currentSum < target) {
      left = mid + 1; // Need larger sum
    } else {
      right = mid - 1; // Need smaller sum
    }
  }

  return bestValue;
}
```

```java
// Time: O(n log n + log M * log n) where M is max(arr)
// Space: O(n) for prefix sum array
import java.util.Arrays;

class Solution {
    public int findBestValue(int[] arr, int target) {
        // Sort the array for efficient calculations
        Arrays.sort(arr);
        int n = arr.length;

        // Build prefix sum array
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + arr[i];
        }

        // Binary search bounds
        int left = 0;
        int right = arr[n - 1];
        int bestValue = 0;
        int minDiff = Integer.MAX_VALUE;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            // Find first index where element > mid
            int idx = findFirstGreater(arr, mid);

            // Calculate sum when capping at mid
            int currentSum = prefix[idx] + (n - idx) * mid;

            // Calculate absolute difference
            int diff = Math.abs(currentSum - target);

            // Update best value
            if (diff < minDiff || (diff == minDiff && mid < bestValue)) {
                minDiff = diff;
                bestValue = mid;
            }

            // Adjust search bounds
            if (currentSum < target) {
                left = mid + 1;  // Need larger sum
            } else {
                right = mid - 1;  // Need smaller sum
            }
        }

        return bestValue;
    }

    // Helper method to find first index where arr[i] > value
    private int findFirstGreater(int[] arr, int value) {
        int left = 0, right = arr.length;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] <= value) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + log M × log n)**

- `O(n log n)` for sorting the array
- `O(log M)` for binary search over possible values (0 to max(arr))
- For each binary search step, we need `O(log n)` to find the split index using binary search
- Total: `O(n log n + log M × log n)`

**Space Complexity: O(n)**

- We need `O(n)` space for the prefix sum array
- If we can modify the input array, we could sort in-place and use `O(1)` extra space
- The recursive stack for binary search is `O(log M)`, which is negligible

## Common Mistakes

1. **Not handling ties correctly**: The problem specifies that in case of equal absolute differences, we should return the smaller value. Candidates often forget this and return the first or last value found. Always compare both the difference AND the value when updating the best solution.

2. **Incorrect binary search bounds**: Setting the right bound to something like `target` or `max(arr) + 1` can miss valid solutions. The value can be anywhere from 0 to `max(arr)` inclusive.

3. **Inefficient sum calculation**: Recalculating the sum from scratch for each candidate value takes O(n) time, making the overall solution O(n × M). Using prefix sums and binary search to find the split point reduces this to O(log n) per candidate.

4. **Forgetting edge cases**:
   - Empty array (not in constraints but good to consider)
   - Target smaller than minimum possible sum (all zeros)
   - Target larger than maximum possible sum (original array sum)

## When You'll See This Pattern

This problem combines **binary search on answer** with **prefix sums**—a powerful pattern for optimization problems where:

1. You're searching for an optimal value in a range
2. The objective function is monotonic with respect to the candidate value
3. You need to efficiently compute the objective function

Similar LeetCode problems:

1. **Capacity To Ship Packages Within D Days (LeetCode 1011)**: Binary search on shipping capacity, with a monotonic relationship between capacity and days needed.
2. **Split Array Largest Sum (LeetCode 410)**: Binary search on the maximum subarray sum, checking if we can split into k parts.
3. **Koko Eating Bananas (LeetCode 875)**: Binary search on eating speed, with monotonic relationship between speed and hours needed.

## Key Takeaways

1. **Binary search on answer**: When you need to find an optimal value and the relationship between candidate values and the objective is monotonic, consider binary searching the answer space rather than checking all possibilities.

2. **Prefix sums for efficiency**: When you need to repeatedly calculate sums of array segments, precomputing prefix sums can reduce O(n) calculations to O(1) lookups.

3. **Tie-breaking matters**: Always read problem constraints carefully—many optimization problems have specific tie-breaking rules that affect how you update your best solution during search.

[Practice this problem on CodeJeet](/problem/sum-of-mutated-array-closest-to-target)
