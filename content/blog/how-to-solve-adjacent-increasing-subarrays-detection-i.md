---
title: "How to Solve Adjacent Increasing Subarrays Detection I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Adjacent Increasing Subarrays Detection I. Easy difficulty, 48.0% acceptance rate. Topics: Array."
date: "2026-07-25"
category: "dsa-patterns"
tags: ["adjacent-increasing-subarrays-detection-i", "array", "easy"]
---

# How to Solve Adjacent Increasing Subarrays Detection I

This problem asks us to determine if there exist two adjacent, non-overlapping subarrays of length `k` that are both strictly increasing. The challenge lies in efficiently checking multiple subarrays while ensuring they're adjacent (no overlap) and properly handling the strict increasing requirement.

## Visual Walkthrough

Let's walk through an example to build intuition. Consider `nums = [1, 3, 5, 2, 4, 6, 8, 10]` with `k = 3`.

We need to find two adjacent subarrays of length 3 that are both strictly increasing. Let's examine all possible subarrays of length 3:

1. `[1, 3, 5]` (indices 0-2) - Strictly increasing ✓
2. `[3, 5, 2]` (indices 1-3) - Not increasing (5 > 2) ✗
3. `[5, 2, 4]` (indices 2-4) - Not increasing (5 > 2) ✗
4. `[2, 4, 6]` (indices 3-5) - Strictly increasing ✓
5. `[4, 6, 8]` (indices 4-6) - Strictly increasing ✓
6. `[6, 8, 10]` (indices 5-7) - Strictly increasing ✓

Now we need to find two adjacent increasing subarrays. "Adjacent" means the second subarray starts right after the first one ends. So if the first subarray ends at index `i`, the second should start at index `i+1`.

Let's check:

- Subarray at indices 0-2 is increasing. The next subarray would start at index 3, which is `[2, 4, 6]` (indices 3-5). Both are increasing! ✓

We found our answer: subarrays starting at indices 0 and 3 satisfy all conditions. The key insight is that we need to check consecutive pairs of subarrays, not just any two increasing subarrays.

## Brute Force Approach

A naive approach would be:

1. Check every possible starting position for the first subarray
2. For each valid first subarray, check every possible starting position for the second subarray
3. Verify they're adjacent (second starts right after first ends)
4. Check if both are strictly increasing

This would involve checking all pairs `(i, j)` where `i` and `j` are starting indices of subarrays, with the constraint that `j = i + k` (for adjacency). For each subarray, we'd need to check all `k-1` adjacent pairs to verify it's strictly increasing.

The brute force code would look like this:

```python
def hasTwoIncreasingSubarrays(nums, k):
    n = len(nums)

    # Helper to check if a subarray starting at index i is strictly increasing
    def is_increasing(start):
        for j in range(start, start + k - 1):
            if nums[j] >= nums[j + 1]:  # Not strictly increasing
                return False
        return True

    # Check all possible pairs of adjacent subarrays
    for i in range(n - 2*k + 1):  # First subarray can start at most at n-2k
        if is_increasing(i) and is_increasing(i + k):
            return True

    return False
```

**Why this is inefficient:** While this approach is correct, it has a time complexity of O(n × k) in the worst case because for each starting position `i`, we check up to `k-1` comparisons. For large `k` (close to `n/2`), this approaches O(n²). We can do better by avoiding repeated comparisons.

## Optimal Solution

The key optimization is to precompute which subarrays are increasing, then check for adjacent pairs. We can create a boolean array `increasing` where `increasing[i] = True` if the subarray starting at index `i` is strictly increasing. Once we have this array, finding adjacent increasing subarrays is straightforward.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def hasTwoIncreasingSubarrays(nums, k):
    n = len(nums)

    # Edge case: if array is too small to have two adjacent subarrays of length k
    if n < 2 * k:
        return False

    # Step 1: Create array to mark which subarrays are strictly increasing
    increasing = [False] * (n - k + 1)

    # Step 2: Check each possible subarray of length k
    for start in range(n - k + 1):
        is_increasing = True
        # Check if all consecutive pairs in this subarray are strictly increasing
        for i in range(start, start + k - 1):
            if nums[i] >= nums[i + 1]:  # Not strictly increasing
                is_increasing = False
                break
        increasing[start] = is_increasing

    # Step 3: Look for two adjacent increasing subarrays
    for i in range(n - 2 * k + 1):
        # Check if subarray starting at i and i+k are both increasing
        if increasing[i] and increasing[i + k]:
            return True

    return False
```

```javascript
// Time: O(n) | Space: O(n)
function hasTwoIncreasingSubarrays(nums, k) {
  const n = nums.length;

  // Edge case: if array is too small to have two adjacent subarrays of length k
  if (n < 2 * k) {
    return false;
  }

  // Step 1: Create array to mark which subarrays are strictly increasing
  const increasing = new Array(n - k + 1).fill(false);

  // Step 2: Check each possible subarray of length k
  for (let start = 0; start <= n - k; start++) {
    let isIncreasing = true;
    // Check if all consecutive pairs in this subarray are strictly increasing
    for (let i = start; i < start + k - 1; i++) {
      if (nums[i] >= nums[i + 1]) {
        // Not strictly increasing
        isIncreasing = false;
        break;
      }
    }
    increasing[start] = isIncreasing;
  }

  // Step 3: Look for two adjacent increasing subarrays
  for (let i = 0; i <= n - 2 * k; i++) {
    // Check if subarray starting at i and i+k are both increasing
    if (increasing[i] && increasing[i + k]) {
      return true;
    }
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean hasTwoIncreasingSubarrays(int[] nums, int k) {
    int n = nums.length;

    // Edge case: if array is too small to have two adjacent subarrays of length k
    if (n < 2 * k) {
        return false;
    }

    // Step 1: Create array to mark which subarrays are strictly increasing
    boolean[] increasing = new boolean[n - k + 1];

    // Step 2: Check each possible subarray of length k
    for (int start = 0; start <= n - k; start++) {
        boolean isIncreasing = true;
        // Check if all consecutive pairs in this subarray are strictly increasing
        for (int i = start; i < start + k - 1; i++) {
            if (nums[i] >= nums[i + 1]) {  // Not strictly increasing
                isIncreasing = false;
                break;
            }
        }
        increasing[start] = isIncreasing;
    }

    // Step 3: Look for two adjacent increasing subarrays
    for (int i = 0; i <= n - 2 * k; i++) {
        // Check if subarray starting at i and i+k are both increasing
        if (increasing[i] && increasing[i + k]) {
            return true;
        }
    }

    return false;
}
```

</div>

**Optimization note:** We can further optimize to O(n) time with O(1) extra space by using a sliding window approach. Instead of storing all results, we can maintain a count of how many consecutive increasing subarrays we've seen:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def hasTwoIncreasingSubarrays(nums, k):
    n = len(nums)

    if n < 2 * k:
        return False

    consecutive_increasing = 0

    for i in range(n - k + 1):
        # Check if subarray starting at i is increasing
        is_increasing = True
        for j in range(i, i + k - 1):
            if nums[j] >= nums[j + 1]:
                is_increasing = False
                break

        if is_increasing:
            consecutive_increasing += 1
            # If we have at least 2 consecutive increasing subarrays
            if consecutive_increasing >= 2:
                return True
        else:
            # Reset counter if current subarray is not increasing
            consecutive_increasing = 0

    return False
```

</div>

## Complexity Analysis

**Time Complexity: O(n × k) for the basic solution, O(n) for the optimized sliding window**

- In the basic solution, we check each of the `n-k+1` subarrays, and for each we perform up to `k-1` comparisons, giving us O((n-k+1) × (k-1)) = O(n × k) operations.
- In the worst case where `k ≈ n/2`, this becomes O(n²/2) = O(n²).
- The sliding window optimization achieves O(n) by avoiding repeated comparisons of overlapping elements.

**Space Complexity: O(n) for the basic solution, O(1) for the optimized version**

- The basic solution stores a boolean array of size `n-k+1`, which is O(n).
- The sliding window version only uses a few integer variables, giving us O(1) space.

## Common Mistakes

1. **Off-by-one errors in loop boundaries**: When checking if a subarray is increasing, the loop should run `k-1` times (checking pairs), not `k` times. A common mistake is `for i in range(start, start + k)` which would cause an index out of bounds error when accessing `nums[i+1]`.

2. **Misunderstanding "adjacent"**: Some candidates check any two increasing subarrays, not necessarily adjacent ones. Remember: if the first subarray ends at index `i`, the second must start at index `i+1`. This means their starting indices differ by exactly `k`.

3. **Forgetting the strict increasing requirement**: The problem says "strictly increasing," which means `nums[i] < nums[i+1]`, not `nums[i] <= nums[i+1]`. Using `<=` instead of `<` is a subtle but critical error.

4. **Not handling edge cases**: When `n < 2*k`, it's impossible to have two adjacent subarrays of length `k`. Always check this early to avoid unnecessary computation or index errors.

## When You'll See This Pattern

This problem combines two common patterns: **subarray validation** and **adjacent element checking**. You'll see similar patterns in:

1. **Maximum Subarray (LeetCode 53)**: While that problem finds the maximum sum, both involve examining all possible subarrays and optimizing the checking process.

2. **Sliding Window Maximum (LeetCode 239)**: This problem also deals with subarrays of fixed length and requires efficient computation across overlapping windows.

3. **Longest Increasing Subarray (variation)**: Problems that ask for the longest contiguous increasing sequence use similar logic for checking increasing sequences.

The core technique of precomputing subarray properties or using a sliding window to avoid redundant computation appears in many array processing problems.

## Key Takeaways

1. **Precomputation is powerful**: When you need to check properties of overlapping subarrays, consider precomputing results to avoid redundant work. This transforms O(n²) solutions into O(n) solutions.

2. **Understand adjacency constraints**: "Adjacent subarrays" means the second starts immediately after the first ends. This creates a fixed relationship between their starting indices (differing by `k`).

3. **Sliding window optimization**: When checking consecutive subarrays, you can often optimize by maintaining state as you move through the array, reducing both time and space complexity.

[Practice this problem on CodeJeet](/problem/adjacent-increasing-subarrays-detection-i)
