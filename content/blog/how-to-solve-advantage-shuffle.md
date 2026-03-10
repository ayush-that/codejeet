---
title: "How to Solve Advantage Shuffle — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Advantage Shuffle. Medium difficulty, 54.3% acceptance rate. Topics: Array, Two Pointers, Greedy, Sorting."
date: "2027-11-10"
category: "dsa-patterns"
tags: ["advantage-shuffle", "array", "two-pointers", "greedy", "medium"]
---

# How to Solve Advantage Shuffle

You're given two arrays of equal length and need to rearrange the first array to maximize how many positions have a larger value than the corresponding position in the second array. This problem is tricky because you can't just sort both arrays and match them directly — you need to strategically assign each element from `nums1` to beat specific elements in `nums2` when possible, and use your weakest elements when you can't win.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `nums1 = [12, 24, 8, 32]`, `nums2 = [13, 25, 32, 11]`

**Goal:** Rearrange `nums1` to maximize positions where `nums1[i] > nums2[i]`

**Step 1: Sort both arrays (but track original indices)**

Sorted `nums1`: `[8, 12, 24, 32]`

`nums2` with original indices: `[(13,0), (25,1), (32,2), (11,3)]`

**Step 2: Sort `nums2` by value**

Sorted `nums2`: `[(11,3), (13,0), (25,1), (32,2)]`

**Step 3: Use two pointers to assign optimal matches**

We'll use two pointers: one at the smallest available `nums1` value, one at the largest.

- Compare smallest `nums1` (8) vs smallest `nums2` (11): 8 < 11 → can't win
  - Assign 8 to the largest `nums2` value (32 at index 2) → `result[2] = 8`
  - Move `nums1` pointer right (now at 12)
  - Move `nums2` pointer for largest value left (now at 25)

- Compare smallest `nums1` (12) vs smallest `nums2` (11): 12 > 11 → can win!
  - Assign 12 to beat 11 at index 3 → `result[3] = 12`
  - Move both pointers: `nums1` now at 24, smallest `nums2` now at 13

- Compare 24 vs 13: 24 > 13 → can win!
  - Assign 24 to beat 13 at index 0 → `result[0] = 24`
  - Move both pointers: `nums1` now at 32, smallest `nums2` now at 25

- Compare 32 vs 25: 32 > 25 → can win!
  - Assign 32 to beat 25 at index 1 → `result[1] = 32`

**Result:** `[24, 32, 8, 12]` with 3 wins (24>13, 32>25, 12>11)

## Brute Force Approach

The brute force approach would be to generate all permutations of `nums1` and check the advantage for each, keeping track of the maximum. For an array of length `n`, there are `n!` permutations, making this approach factorial time complexity — completely impractical for any reasonable input size.

Even a slightly better brute force would try to match each element of `nums1` to each position, but without a systematic strategy, you'd still need to explore many combinations. The key insight is that we need a greedy strategy: use our smallest winning element to beat each opponent's element when possible, and sacrifice our smallest element when we can't win.

## Optimized Approach

The optimal solution uses a **greedy two-pointer approach** with sorting:

1. **Sort `nums1`** so we can easily access our smallest and largest elements
2. **Sort `nums2` with original indices** so we know where to place each element
3. **Use two pointers**:
   - One at the smallest available `nums1` element
   - One at the largest available `nums1` element
4. **Process `nums2` from smallest to largest**:
   - If our smallest `nums1` element can beat the current smallest `nums2` element, use it (it's just enough to win)
   - If it can't win, use it against the largest `nums2` element (sacrifice it against the toughest opponent)
5. **Build the result array** using the original indices from `nums2`

This is essentially the "田忌赛马" (Tian Ji's horse racing) strategy from ancient Chinese history: use your weakest horse against the opponent's strongest when you can't win, and use your weakest winning horse against their weakest when you can.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def advantageCount(nums1, nums2):
    """
    Rearranges nums1 to maximize positions where nums1[i] > nums2[i]

    Strategy: Sort both arrays, then use two pointers to assign
    smallest winning nums1 to each nums2, or sacrifice smallest
    nums1 to largest nums2 when can't win.
    """
    n = len(nums1)

    # Sort nums1 for easy access to smallest/largest elements
    nums1_sorted = sorted(nums1)

    # Sort nums2 but keep original indices
    # We'll process nums2 from smallest to largest value
    nums2_sorted = sorted([(val, idx) for idx, val in enumerate(nums2)])

    # Initialize result array
    result = [0] * n

    # Two pointers: left (smallest available), right (largest available)
    left, right = 0, n - 1

    # Process nums2 from largest to smallest (we iterate backward)
    # Actually, we need to process from largest nums2 to smallest
    # to properly assign sacrifices. Let me correct:
    # We should process nums2 from largest to smallest
    for i in range(n - 1, -1, -1):
        # Get current largest nums2 value and its original index
        val, idx = nums2_sorted[i]

        # If our largest remaining nums1 can beat this nums2
        if nums1_sorted[right] > val:
            # Assign our largest nums1 to beat this nums2
            result[idx] = nums1_sorted[right]
            right -= 1  # Move to next largest nums1
        else:
            # Can't win, sacrifice smallest nums1
            result[idx] = nums1_sorted[left]
            left += 1  # Move to next smallest nums1

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function advantageCount(nums1, nums2) {
  /**
   * Rearranges nums1 to maximize positions where nums1[i] > nums2[i]
   *
   * Strategy: Sort both arrays, then use two pointers to assign
   * smallest winning nums1 to each nums2, or sacrifice smallest
   * nums1 to largest nums2 when can't win.
   */
  const n = nums1.length;

  // Sort nums1 for easy access to smallest/largest elements
  const nums1Sorted = [...nums1].sort((a, b) => a - b);

  // Create array of [value, index] pairs for nums2 and sort by value
  const nums2WithIndices = nums2.map((val, idx) => [val, idx]);
  nums2WithIndices.sort((a, b) => a[0] - b[0]);

  // Initialize result array
  const result = new Array(n).fill(0);

  // Two pointers: left (smallest available), right (largest available)
  let left = 0,
    right = n - 1;

  // Process nums2 from largest to smallest
  for (let i = n - 1; i >= 0; i--) {
    const [val, idx] = nums2WithIndices[i];

    // If our largest remaining nums1 can beat this nums2
    if (nums1Sorted[right] > val) {
      // Assign our largest nums1 to beat this nums2
      result[idx] = nums1Sorted[right];
      right--; // Move to next largest nums1
    } else {
      // Can't win, sacrifice smallest nums1
      result[idx] = nums1Sorted[left];
      left++; // Move to next smallest nums1
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int[] advantageCount(int[] nums1, int[] nums2) {
        /**
         * Rearranges nums1 to maximize positions where nums1[i] > nums2[i]
         *
         * Strategy: Sort both arrays, then use two pointers to assign
         * smallest winning nums1 to each nums2, or sacrifice smallest
         * nums1 to largest nums2 when can't win.
         */
        int n = nums1.length;

        // Sort nums1 for easy access to smallest/largest elements
        int[] nums1Sorted = nums1.clone();
        Arrays.sort(nums1Sorted);

        // Create array of [value, index] pairs for nums2 and sort by value
        int[][] nums2WithIndices = new int[n][2];
        for (int i = 0; i < n; i++) {
            nums2WithIndices[i][0] = nums2[i];  // value
            nums2WithIndices[i][1] = i;         // original index
        }
        Arrays.sort(nums2WithIndices, (a, b) -> a[0] - b[0]);

        // Initialize result array
        int[] result = new int[n];

        // Two pointers: left (smallest available), right (largest available)
        int left = 0, right = n - 1;

        // Process nums2 from largest to smallest
        for (int i = n - 1; i >= 0; i--) {
            int val = nums2WithIndices[i][0];
            int idx = nums2WithIndices[i][1];

            // If our largest remaining nums1 can beat this nums2
            if (nums1Sorted[right] > val) {
                // Assign our largest nums1 to beat this nums2
                result[idx] = nums1Sorted[right];
                right--;  // Move to next largest nums1
            } else {
                // Can't win, sacrifice smallest nums1
                result[idx] = nums1Sorted[left];
                left++;  // Move to next smallest nums1
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting `nums1`: O(n log n)
- Creating and sorting the `nums2` with indices: O(n log n)
- The two-pointer assignment loop: O(n)
- Dominated by sorting: O(n log n)

**Space Complexity:** O(n)

- Storing sorted `nums1`: O(n)
- Storing `nums2` with indices: O(n)
- Result array: O(n)
- Total: O(n) additional space

## Common Mistakes

1. **Processing nums2 in the wrong order:** If you process `nums2` from smallest to largest (instead of largest to smallest), you might incorrectly sacrifice elements. When you encounter a large `nums2` value early, you need to check if your largest `nums1` can beat it.

2. **Forgetting to track original indices:** If you sort `nums2` without keeping track of where each value came from, you won't know where to place your `nums1` values in the result array. Always store `(value, index)` pairs.

3. **Using the wrong comparison:** Some candidates try to compare the smallest `nums1` with the current `nums2` instead of comparing the largest `nums1`. We need to check if our best (largest) can beat their current, not if our worst can.

4. **Not handling equal values correctly:** The problem asks for `nums1[i] > nums2[i]`, not `>=`. If values are equal, it doesn't count as an advantage. Make sure your comparison uses `>` not `>=`.

## When You'll See This Pattern

This "greedy assignment with two pointers after sorting" pattern appears in several problems:

1. **Two Sum (when sorted):** Similar two-pointer approach to find pairs that sum to a target
2. **Assign Cookies:** Assign cookies to children greedily, matching smallest sufficient cookie to each child
3. **Boats to Save People:** Use lightest + heaviest person pairing with two pointers
4. **Task Scheduler:** Similar "use best available resource" greedy thinking

The core pattern is: **sort to create order, then use two pointers to make optimal pairings from the extremes.**

## Key Takeaways

1. **Greedy with sorting is powerful:** When you need to make optimal pairings between two sets, sorting often reveals a greedy strategy that works.

2. **Track original indices:** When you need to output results in the original order but want to process in sorted order, always store `(value, index)` pairs.

3. **Think about sacrifices:** The "use weakest against strongest when losing" strategy (田忌赛马) is a classic optimization pattern for competitive pairing problems.

[Practice this problem on CodeJeet](/problem/advantage-shuffle)
