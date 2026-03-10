---
title: "How to Solve Minimum Array Length After Pair Removals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Array Length After Pair Removals. Medium difficulty, 27.1% acceptance rate. Topics: Array, Hash Table, Two Pointers, Binary Search, Greedy."
date: "2029-04-01"
category: "dsa-patterns"
tags: ["minimum-array-length-after-pair-removals", "array", "hash-table", "two-pointers", "medium"]
---

# How to Solve Minimum Array Length After Pair Removals

You're given a sorted array and can repeatedly remove pairs where the first element is smaller than the second. The goal is to minimize the final array length. What makes this tricky is that you need to strategically pair elements to maximize removals—it's not just about greedily pairing the smallest with the largest.

## Visual Walkthrough

Let's trace through `nums = [1, 1, 2, 3, 4, 4]`:

1. **Initial array**: `[1, 1, 2, 3, 4, 4]` (length 6)
2. **First operation**: Pair `nums[0] = 1` with `nums[4] = 4` (since 1 < 4)
   - Remove indices 0 and 4 → `[1, 2, 3, 4]` (length 4)
3. **Second operation**: Pair `nums[0] = 1` with `nums[3] = 4` (1 < 4)
   - Remove indices 0 and 3 → `[2, 3]` (length 2)
4. **Can we remove more?** Check `nums[0] = 2` and `nums[1] = 3` (2 < 3)
   - Remove both → `[]` (length 0)

But wait—could we have done better? Let's try a different pairing strategy:

1. **Initial**: `[1, 1, 2, 3, 4, 4]`
2. Pair `nums[0] = 1` with `nums[3] = 3` → `[1, 2, 4, 4]`
3. Pair `nums[0] = 1` with `nums[2] = 4` → `[2, 4]`
4. Pair `nums[0] = 2` with `nums[1] = 4` → `[]`

Both strategies achieve length 0. The key insight: we want to pair smaller elements from the first half with larger elements from the second half.

## Brute Force Approach

A naive approach would try all possible pairings recursively:

1. Find all valid pairs (i, j) where nums[i] < nums[j]
2. For each pair, remove them and recursively process the remaining array
3. Track the minimum length achievable

This becomes factorial time complexity O(n!) because at each step you have many pairing choices. Even for n=20, that's 20! ≈ 2.4×10¹⁸ operations—completely infeasible.

The brute force teaches us that we need a smarter pairing strategy rather than exploring all possibilities.

## Optimized Approach

The optimal solution uses a **two-pointer greedy approach**:

**Key Insight**: Since the array is sorted, we can think of splitting it into two halves:

- Left half: smaller elements that can be paired with larger elements
- Right half: larger elements that can be paired with smaller ones

**Strategy**: Use two pointers:

- `left` starts at the beginning (smallest elements)
- `right` starts at the middle (or slightly after) to ensure we pair small with large

**Why this works**:

1. In a sorted array, if we pair the smallest remaining element with a sufficiently large element, we maximize our chances of making valid pairs
2. By starting `right` from the middle, we ensure we don't waste large elements by pairing them with other large elements
3. Each successful pair removes 2 elements, so we want to maximize pairs

**Step-by-step reasoning**:

1. Initialize `right` pointer at `n/2` (or `(n+1)/2` to handle odd lengths)
2. For each `left` from 0 to `n/2`:
   - Try to pair `nums[left]` with `nums[right]`
   - If valid (nums[left] < nums[right]), move both pointers
   - If not valid, only move `right` to find a larger element
3. Count successful pairs
4. Remaining length = total elements - 2 × pairs

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumLength(nums):
    """
    Find minimum array length after removing pairs where first < second.

    Approach: Two-pointer greedy. Pair elements from left half with
    elements from right half to maximize removals.
    """
    n = len(nums)

    # Start right pointer from the middle to pair small with large
    # For odd n, we want right to start at ceil(n/2) to ensure
    # we have enough large elements to pair with small ones
    right = (n + 1) // 2
    pairs = 0

    # Try to pair each element in left half with an element in right half
    for left in range(n // 2):
        # Move right pointer until we find a valid pair or reach end
        while right < n and nums[left] >= nums[right]:
            right += 1

        # If we found a valid pair
        if right < n and nums[left] < nums[right]:
            pairs += 1
            right += 1

    # Each pair removes 2 elements, remaining = total - 2 * pairs
    return n - 2 * pairs
```

```javascript
// Time: O(n) | Space: O(1)
function minimumLength(nums) {
  /**
   * Find minimum array length after removing pairs where first < second.
   *
   * Approach: Two-pointer greedy. Pair elements from left half with
   * elements from right half to maximize removals.
   */
  const n = nums.length;

  // Start right pointer from the middle to pair small with large
  // For odd n, we want right to start at ceil(n/2) to ensure
  // we have enough large elements to pair with small ones
  let right = Math.floor((n + 1) / 2);
  let pairs = 0;

  // Try to pair each element in left half with an element in right half
  for (let left = 0; left < Math.floor(n / 2); left++) {
    // Move right pointer until we find a valid pair or reach end
    while (right < n && nums[left] >= nums[right]) {
      right++;
    }

    // If we found a valid pair
    if (right < n && nums[left] < nums[right]) {
      pairs++;
      right++;
    }
  }

  // Each pair removes 2 elements, remaining = total - 2 * pairs
  return n - 2 * pairs;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumLength(int[] nums) {
        /**
         * Find minimum array length after removing pairs where first < second.
         *
         * Approach: Two-pointer greedy. Pair elements from left half with
         * elements from right half to maximize removals.
         */
        int n = nums.length;

        // Start right pointer from the middle to pair small with large
        // For odd n, we want right to start at ceil(n/2) to ensure
        // we have enough large elements to pair with small ones
        int right = (n + 1) / 2;
        int pairs = 0;

        // Try to pair each element in left half with an element in right half
        for (int left = 0; left < n / 2; left++) {
            // Move right pointer until we find a valid pair or reach end
            while (right < n && nums[left] >= nums[right]) {
                right++;
            }

            // If we found a valid pair
            if (right < n && nums[left] < nums[right]) {
                pairs++;
                right++;
            }
        }

        // Each pair removes 2 elements, remaining = total - 2 * pairs
        return n - 2 * pairs;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We traverse the array with two pointers `left` and `right`
- Each pointer moves at most n times
- Even though we have nested loops, each element is processed at most once by either pointer

**Space Complexity**: O(1)

- We only use a few integer variables (`left`, `right`, `pairs`)
- No additional data structures are needed

## Common Mistakes

1. **Starting right pointer at wrong position**: Starting `right` at 0 or n-1 instead of n/2. This fails because we need to pair small elements from the first half with large elements from the second half.

2. **Forgetting to handle equal elements**: The condition is `nums[i] < nums[j]`, not `≤`. If elements are equal, they cannot form a valid pair. This is why we need the `while` loop to skip equal or smaller elements.

3. **Incorrect loop bounds**: Using `left < n` instead of `left < n/2`. Since we're pairing elements from the first half with the second half, we only need to check the first half.

4. **Not checking array bounds**: Forgetting to check `right < n` before accessing `nums[right]` in the condition. This could cause index out of bounds errors.

## When You'll See This Pattern

This two-pointer pairing pattern appears in several problems:

1. **Find the Maximum Number of Marked Indices (LeetCode 2576)**: Very similar—pair small elements with large ones to maximize pairs. The main difference is the pairing condition.

2. **Boats to Save People (LeetCode 881)**: Pair the lightest and heaviest people to minimize boats. Same two-pointer approach from both ends.

3. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: Find pairs that sum to target using two pointers from both ends.

The pattern: **When you need to pair elements in a sorted array to optimize some condition, consider two pointers starting from opposite ends or from the middle.**

## Key Takeaways

1. **Sorted arrays enable greedy pairing**: When an array is sorted, you can often pair the smallest with the largest (or elements from first half with second half) to optimize pairings.

2. **Two-pointer technique is versatile**: It's not just for finding sums—it's useful for any pairing problem on sorted data.

3. **Think in halves**: When you need to pair elements, consider splitting the array mentally into smaller and larger halves. This helps identify the optimal pairing strategy.

Related problems: [Find the Maximum Number of Marked Indices](/problem/find-the-maximum-number-of-marked-indices)
