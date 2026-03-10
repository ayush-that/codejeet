---
title: "How to Solve House Robber IV — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode House Robber IV. Medium difficulty, 64.8% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Greedy."
date: "2026-11-12"
category: "dsa-patterns"
tags: ["house-robber-iv", "array", "binary-search", "dynamic-programming", "medium"]
---

# How to Solve House Robber IV

House Robber IV presents an interesting twist on the classic House Robber problem. You're given an array `nums` representing money in consecutive houses, and you need to determine the **minimum capability** a robber must have to steal from at least `k` houses without robbing adjacent ones. The robber's capability is defined as the maximum amount stolen from any single house. This problem is tricky because it combines binary search with a greedy validation check—you're not directly finding the capability, but rather searching for the smallest capability that makes stealing from `k` houses possible.

## Visual Walkthrough

Let's walk through a concrete example: `nums = [2,3,5,9]` with `k = 2`.

We need the smallest capability `C` such that the robber can steal from at least 2 non-adjacent houses where no house has more money than `C`.

**Step 1: Understanding the capability constraint**
If the robber's capability is `C = 5`, they can only rob houses with `≤ 5` money. From `[2,3,5,9]`, houses with indices 0, 1, and 2 qualify (values 2, 3, 5). House 3 (value 9) exceeds capability.

**Step 2: Checking if we can rob k houses**
With eligible houses at indices 0, 1, 2, we need to pick at least 2 non-adjacent ones. The greedy approach: start from the left, rob whenever possible.

- Rob house 0 (value 2)
- Skip house 1 (adjacent to 0)
- Rob house 2 (value 5)
  Total robbed houses = 2 ✅ We can achieve k=2 with C=5.

**Step 3: Finding the minimum capability**
Could we do better than 5? Let's test C=4:
Eligible houses: indices 0, 1 (values 2, 3)

- Rob house 0
- Skip house 1 (adjacent)
  No more houses available. Only 1 house robbed ❌ C=4 fails.

What about C=3?
Eligible houses: indices 0, 1 (values 2, 3)

- Rob house 0
- Skip house 1
  Only 1 house robbed ❌

C=5 is the minimum that works. This brute force checking of every possible C is inefficient. Instead, we'll use binary search to find the minimum C efficiently.

## Brute Force Approach

A naive approach would be to check every possible capability value from 1 up to the maximum house value:

1. For each candidate capability `C` from 1 to `max(nums)`
2. Check if we can rob at least `k` houses with values ≤ `C` without adjacent selections
3. Return the first `C` that satisfies this

The checking step requires O(n) time to traverse houses greedily. With m = max(nums), this gives O(m × n) time complexity, which is too slow when m is large (up to 10⁹ in constraints).

**Why this fails:** The constraints (n up to 10⁵, values up to 10⁹) make linear search over possible capabilities infeasible. We need a faster way to find the minimum capability.

## Optimized Approach

The key insight is that we can **binary search** on the answer (capability) because of a monotonic property:

If the robber can achieve `k` robberies with capability `C`, then they can definitely achieve it with any capability `C' > C` (more capability means more houses are eligible). Conversely, if they cannot achieve `k` robberies with capability `C`, they cannot achieve it with any `C' < C`.

This monotonicity allows binary search:

- Search space: all possible capabilities from 1 to max(nums)
- For each mid capability, check if it's feasible using a greedy validator
- Move left or right based on feasibility

**Greedy validation algorithm:**
To check if capability `C` allows ≥ `k` robberies:

1. Iterate through houses left to right
2. If house value ≤ `C` and previous house wasn't robbed, rob this house
3. Count how many houses we rob
4. Return true if count ≥ `k`

This greedy approach works because robbing earlier leaves more options for later houses—it's always optimal to rob when possible rather than skip.

## Optimal Solution

We implement binary search with a greedy validation function. The binary search finds the minimum capability that allows at least `k` robberies.

<div class="code-group">

```python
# Time: O(n log m) where n = len(nums), m = max(nums)
# Space: O(1)
def minCapability(nums, k):
    """
    Returns the minimum capability needed to rob at least k houses
    without robbing adjacent houses.
    """
    # Binary search boundaries: minimum possible capability is 1,
    # maximum is the richest house (we can't rob more than that)
    left, right = 1, max(nums)

    # Helper function to check if a given capability is feasible
    def can_rob(capability):
        """
        Returns True if we can rob at least k houses with given capability.
        Uses greedy approach: rob whenever possible.
        """
        count = 0
        i = 0
        n = len(nums)

        while i < n:
            if nums[i] <= capability:
                # Rob this house (it's within capability)
                count += 1
                # Skip next house (can't rob adjacent)
                i += 2
            else:
                # Can't rob this house, move to next
                i += 1

            # Early exit: if we already have k houses, success
            if count >= k:
                return True

        return count >= k

    # Binary search for minimum feasible capability
    while left < right:
        mid = (left + right) // 2

        if can_rob(mid):
            # mid is feasible, try smaller capabilities
            right = mid
        else:
            # mid is not feasible, need larger capability
            left = mid + 1

    return left
```

```javascript
// Time: O(n log m) where n = nums.length, m = max(nums)
// Space: O(1)
function minCapability(nums, k) {
  // Binary search boundaries
  let left = 1;
  let right = Math.max(...nums);

  // Helper function to check feasibility of a capability
  const canRob = (capability) => {
    let count = 0;
    let i = 0;
    const n = nums.length;

    while (i < n) {
      if (nums[i] <= capability) {
        // Rob this house
        count++;
        // Skip adjacent house
        i += 2;
      } else {
        // Can't rob this house
        i++;
      }

      // Early exit if we already have enough houses
      if (count >= k) {
        return true;
      }
    }

    return count >= k;
  };

  // Binary search for minimum feasible capability
  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (canRob(mid)) {
      // mid works, try smaller values
      right = mid;
    } else {
      // mid doesn't work, need larger values
      left = mid + 1;
    }
  }

  return left;
}
```

```java
// Time: O(n log m) where n = nums.length, m = max(nums)
// Space: O(1)
class Solution {
    public int minCapability(int[] nums, int k) {
        // Find maximum value for binary search upper bound
        int maxVal = 0;
        for (int num : nums) {
            maxVal = Math.max(maxVal, num);
        }

        int left = 1;
        int right = maxVal;

        // Binary search for minimum feasible capability
        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canRob(nums, k, mid)) {
                // mid is feasible, try smaller values
                right = mid;
            } else {
                // mid is not feasible, need larger values
                left = mid + 1;
            }
        }

        return left;
    }

    // Helper method to check if capability allows k robberies
    private boolean canRob(int[] nums, int k, int capability) {
        int count = 0;
        int i = 0;
        int n = nums.length;

        while (i < n) {
            if (nums[i] <= capability) {
                // Rob this house
                count++;
                // Skip adjacent house
                i += 2;
            } else {
                // Can't rob this house
                i++;
            }

            // Early exit if we already have enough houses
            if (count >= k) {
                return true;
            }
        }

        return count >= k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log m)

- `n` is the number of houses (length of `nums`)
- `m` is the maximum house value (upper bound for binary search)
- Binary search runs O(log m) iterations
- Each iteration calls `can_rob()` which runs in O(n) time
- Total: O(n log m)

**Space Complexity:** O(1)

- We only use a few variables for counting and indices
- No additional data structures proportional to input size
- Even the recursive binary search in some implementations would be O(log m) call stack, but we use iterative binary search for O(1) space

## Common Mistakes

1. **Not using binary search on the answer:** Many candidates try to solve this with pure DP like the original House Robber problem, which doesn't work for finding minimum capability. Recognizing the monotonic property is crucial.

2. **Incorrect greedy validation:** When checking feasibility for a capability C, some candidates try to maximize the number of houses robbed rather than just checking if ≥ k is possible. The greedy "rob when possible" approach works because we only need to know if k is achievable, not the maximum achievable.

3. **Off-by-one in binary search:** Using `while (left <= right)` instead of `while (left < right)` can cause infinite loops. With our `right = mid` and `left = mid + 1` pattern, `while (left < right)` correctly converges to the answer.

4. **Forgetting early exit in validation:** Not adding `if (count >= k) return true` early in the validation function wastes time. Since we only care if we can reach k, not the exact maximum, we can return as soon as we have k houses.

## When You'll See This Pattern

This "binary search on answer with greedy/DP validation" pattern appears in problems where:

1. You're asked to find the minimum/maximum of something
2. There's a monotonic relationship: if X works, then anything > X also works (or vice versa)
3. Checking feasibility for a given X is easier than directly finding the optimal X

**Related problems:**

- **Capacity To Ship Packages Within D Days (LeetCode 1011):** Find minimum ship capacity to ship all packages in D days. Binary search on capacity with greedy validation.
- **Split Array Largest Sum (LeetCode 410):** Find minimum largest sum when splitting array into m subarrays. Binary search on the maximum sum with greedy validation.
- **Koko Eating Bananas (LeetCode 875):** Find minimum eating speed to finish bananas in h hours. Binary search on speed with validation.

## Key Takeaways

1. **When you need to find minimum/maximum value satisfying a condition, consider binary search on the answer** if checking feasibility is easier than finding the optimal directly.

2. **The greedy "rob when possible" strategy works for non-adjacent selection problems** when you only need to know if a certain number of selections is achievable, not the maximum achievable.

3. **Always validate your approach with edge cases:** empty arrays, k=1, k=n, all houses with same value, and alternating high/low values.

Related problems: [Container With Most Water](/problem/container-with-most-water), [House Robber](/problem/house-robber)
