---
title: "How to Solve Adjacent Increasing Subarrays Detection II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Adjacent Increasing Subarrays Detection II. Medium difficulty, 58.9% acceptance rate. Topics: Array, Binary Search."
date: "2027-02-15"
category: "dsa-patterns"
tags: ["adjacent-increasing-subarrays-detection-ii", "array", "binary-search", "medium"]
---

# How to Solve Adjacent Increasing Subarrays Detection II

You're given an array of integers and need to find the maximum length `k` such that there exist two adjacent subarrays of length `k` that are both strictly increasing. The challenge is that we need to find the maximum possible `k`, not just check if a particular `k` works. This problem is interesting because it combines array traversal with binary search optimization—we can't just check every possible `k` directly without optimization.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 2, 3, 4, 5, 3]`

We want to find the maximum `k` where we can find two adjacent increasing subarrays of length `k`. Let's think about what this means:

1. For `k = 3`: We need to find two adjacent subarrays of length 3 that are both strictly increasing. Looking at the array:
   - Subarray [1, 2, 3] (indices 0-2) is increasing ✓
   - Subarray [2, 3, 4] (indices 3-5) is increasing ✓
   - These are adjacent (end of first at index 2, start of second at index 3)
   - So `k = 3` works!

2. For `k = 4`: We need two adjacent subarrays of length 4:
   - Subarray [1, 2, 3, 2] (indices 0-3) is NOT increasing (3 > 2 fails) ✗
   - Subarray [2, 3, 4, 5] (indices 3-6) is increasing ✓
   - But we need BOTH to be increasing, so `k = 4` doesn't work

3. The maximum `k` that works is 3 in this case.

The key insight: We need to efficiently check for different values of `k` without scanning the entire array for each possible `k`.

## Brute Force Approach

A naive approach would be:

1. Try every possible `k` from `n/2` down to 1 (since we need two subarrays)
2. For each `k`, check every possible starting position for the first subarray
3. For each starting position, check if both subarrays are strictly increasing

This brute force solution would have O(n³) time complexity in the worst case:

- O(n) possible values for `k` (from 1 to n/2)
- O(n) possible starting positions for the first subarray
- O(k) time to check if each subarray is increasing

For an array of length 1000, this could mean up to 500 × 1000 × 500 = 250 million operations, which is far too slow.

```python
# Brute force solution - too slow for large inputs
def maxAdjacentIncreasingSubarrays(nums):
    n = len(nums)
    max_k = 0

    # Try all possible k values from largest to smallest
    for k in range(n // 2, 0, -1):
        found = False

        # Try all possible starting positions for first subarray
        for i in range(n - 2 * k + 1):
            # Check if first subarray is strictly increasing
            first_valid = True
            for j in range(i, i + k - 1):
                if nums[j] >= nums[j + 1]:
                    first_valid = False
                    break

            if not first_valid:
                continue

            # Check if second subarray is strictly increasing
            second_valid = True
            for j in range(i + k, i + 2 * k - 1):
                if nums[j] >= nums[j + 1]:
                    second_valid = False
                    break

            if second_valid:
                found = True
                break

        if found:
            max_k = k
            break

    return max_k
```

The problem with this approach is obvious: we're doing redundant work. When checking if a subarray is increasing, we're comparing the same elements multiple times for different values of `k`.

## Optimized Approach

The key insight is that we can precompute information about increasing sequences to make our checks O(1) instead of O(k). Here's the step-by-step reasoning:

1. **Precompute increasing lengths**: For each position `i`, compute how long the strictly increasing sequence starting at `i` continues. If `nums[i] < nums[i+1]`, then the sequence continues; otherwise, it ends.

2. **Binary search on k**: Instead of trying every possible `k` from largest to smallest, we can use binary search to find the maximum valid `k`. This reduces the number of `k` values we need to check from O(n) to O(log n).

3. **Efficient validation**: With our precomputed array, we can check in O(1) time whether a subarray of length `k` starting at position `i` is strictly increasing. We just need to check if the increasing sequence starting at `i` has length at least `k`.

4. **Adjacent check**: To find two adjacent increasing subarrays of length `k`, we need to find an index `i` where:
   - The increasing sequence starting at `i` has length ≥ `k`
   - The increasing sequence starting at `i + k` has length ≥ `k`

The binary search works because:

- If `k` works (we can find two adjacent increasing subarrays of length `k`), then any smaller `k` will also work (we can take the same subarrays and just use the first `k` elements)
- This monotonic property (if k works, then all smaller k work) is perfect for binary search

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maxAdjacentIncreasingSubarrays(nums):
    n = len(nums)
    if n < 2:
        return 0  # Need at least 2 elements for two subarrays

    # Step 1: Precompute the length of increasing sequence starting at each position
    # inc_len[i] = how many consecutive increasing elements starting at i
    inc_len = [1] * n

    # Fill from right to left
    for i in range(n - 2, -1, -1):
        if nums[i] < nums[i + 1]:
            inc_len[i] = inc_len[i + 1] + 1
        else:
            inc_len[i] = 1

    # Step 2: Binary search for the maximum valid k
    left, right = 0, n // 2  # Maximum possible k is n//2
    max_valid_k = 0

    while left <= right:
        k = (left + right) // 2
        valid = False

        # Check if there exists two adjacent increasing subarrays of length k
        # We need to check starting positions from 0 to n - 2*k
        for i in range(n - 2 * k + 1):
            # Check if first subarray (starting at i) is strictly increasing
            # This is true if inc_len[i] >= k
            if inc_len[i] >= k and inc_len[i + k] >= k:
                valid = True
                break

        if valid:
            # k works, try larger k
            max_valid_k = k
            left = k + 1
        else:
            # k doesn't work, try smaller k
            right = k - 1

    return max_valid_k
```

```javascript
// Time: O(n log n) | Space: O(n)
function maxAdjacentIncreasingSubarrays(nums) {
  const n = nums.length;
  if (n < 2) {
    return 0; // Need at least 2 elements for two subarrays
  }

  // Step 1: Precompute the length of increasing sequence starting at each position
  // incLen[i] = how many consecutive increasing elements starting at i
  const incLen = new Array(n).fill(1);

  // Fill from right to left
  for (let i = n - 2; i >= 0; i--) {
    if (nums[i] < nums[i + 1]) {
      incLen[i] = incLen[i + 1] + 1;
    } else {
      incLen[i] = 1;
    }
  }

  // Step 2: Binary search for the maximum valid k
  let left = 0;
  let right = Math.floor(n / 2); // Maximum possible k is n/2
  let maxValidK = 0;

  while (left <= right) {
    const k = Math.floor((left + right) / 2);
    let valid = false;

    // Check if there exists two adjacent increasing subarrays of length k
    // We need to check starting positions from 0 to n - 2*k
    for (let i = 0; i <= n - 2 * k; i++) {
      // Check if first subarray (starting at i) is strictly increasing
      // This is true if incLen[i] >= k
      if (incLen[i] >= k && incLen[i + k] >= k) {
        valid = true;
        break;
      }
    }

    if (valid) {
      // k works, try larger k
      maxValidK = k;
      left = k + 1;
    } else {
      // k doesn't work, try smaller k
      right = k - 1;
    }
  }

  return maxValidK;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int maxAdjacentIncreasingSubarrays(int[] nums) {
    int n = nums.length;
    if (n < 2) {
        return 0;  // Need at least 2 elements for two subarrays
    }

    // Step 1: Precompute the length of increasing sequence starting at each position
    // incLen[i] = how many consecutive increasing elements starting at i
    int[] incLen = new int[n];
    incLen[n - 1] = 1;

    // Fill from right to left
    for (int i = n - 2; i >= 0; i--) {
        if (nums[i] < nums[i + 1]) {
            incLen[i] = incLen[i + 1] + 1;
        } else {
            incLen[i] = 1;
        }
    }

    // Step 2: Binary search for the maximum valid k
    int left = 0;
    int right = n / 2;  // Maximum possible k is n/2
    int maxValidK = 0;

    while (left <= right) {
        int k = left + (right - left) / 2;
        boolean valid = false;

        // Check if there exists two adjacent increasing subarrays of length k
        // We need to check starting positions from 0 to n - 2*k
        for (int i = 0; i <= n - 2 * k; i++) {
            // Check if first subarray (starting at i) is strictly increasing
            // This is true if incLen[i] >= k
            if (incLen[i] >= k && incLen[i + k] >= k) {
                valid = true;
                break;
            }
        }

        if (valid) {
            // k works, try larger k
            maxValidK = k;
            left = k + 1;
        } else {
            // k doesn't work, try smaller k
            right = k - 1;
        }
    }

    return maxValidK;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Precomputing `inc_len` array: O(n) - we traverse the array once from right to left
- Binary search: O(log n) iterations (since we search k from 0 to n/2)
- For each binary search iteration, we check O(n) possible starting positions
- Total: O(n) + O(log n × n) = O(n log n)

**Space Complexity: O(n)**

- We need to store the `inc_len` array of size n
- No other significant data structures are used

## Common Mistakes

1. **Off-by-one errors in subarray bounds**: When checking if a subarray of length `k` starting at `i` is valid, remember it goes from `i` to `i + k - 1`. A common mistake is using `i + k` as the end index. In our solution, we avoid this by using the precomputed `inc_len` array.

2. **Forgetting "strictly" increasing**: The problem says "strictly increasing," which means `nums[i] < nums[i+1]`, not `nums[i] ≤ nums[i+1]`. Using `≤` instead of `<` will cause incorrect results for arrays with equal consecutive elements.

3. **Incorrect binary search bounds**: The maximum possible `k` is `n // 2` (integer division), not `n`. We need two subarrays of length `k`, so `2k ≤ n`. Starting with `right = n` instead of `n // 2` wastes time and could cause index out of bounds errors.

4. **Not handling small arrays**: For arrays with fewer than 2 elements, the answer should be 0 since we can't have two subarrays. Always check edge cases at the beginning of your solution.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Precomputation for range queries**: Similar to prefix sums but for increasing sequences. Other problems using this pattern:
   - **LeetCode 239: Sliding Window Maximum** - uses precomputation to answer max queries efficiently
   - **LeetCode 907: Sum of Subarray Minimums** - precomputes next smaller elements

2. **Binary search on answer**: When you need to find the maximum/minimum value satisfying a condition, and the condition is monotonic (if x works, then all smaller/larger values work). Other problems:
   - **LeetCode 410: Split Array Largest Sum** - binary search on the maximum subarray sum
   - **LeetCode 875: Koko Eating Bananas** - binary search on eating speed
   - **LeetCode 1011: Capacity To Ship Packages Within D Days** - binary search on ship capacity

## Key Takeaways

1. **When you need to answer many "does this subarray have property X?" queries**, consider precomputing information about the array to answer each query in O(1) time instead of O(k).

2. **When asked to find the maximum/minimum value satisfying a condition**, think about whether binary search can help. The key requirement is monotonicity: if value `k` works, then all values smaller/larger than `k` should also work (or not work).

3. **Always validate your approach with edge cases**: Empty arrays, arrays with all equal elements, arrays that are entirely increasing, and the smallest possible inputs (n=1, n=2).

[Practice this problem on CodeJeet](/problem/adjacent-increasing-subarrays-detection-ii)
