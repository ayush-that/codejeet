---
title: "How to Solve Minimum Difference Between Largest and Smallest Value in Three Moves — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Difference Between Largest and Smallest Value in Three Moves. Medium difficulty, 59.2% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2028-05-08"
category: "dsa-patterns"
tags:
  [
    "minimum-difference-between-largest-and-smallest-value-in-three-moves",
    "array",
    "greedy",
    "sorting",
    "medium",
  ]
---

## How to Solve Minimum Difference Between Largest and Smallest Value in Three Moves

You can change up to three elements in an array to any values, and you want to minimize the difference between the largest and smallest element after these changes. The challenge is that you can change any element—not necessarily the current min or max—and you need to strategically decide which values to modify to shrink the overall range most effectively.

---

## Visual Walkthrough

Let’s walk through an example: `nums = [6, 6, 0, 1, 1, 4, 6]`.

**Step 1 — Sort the array**  
Sorted: `[0, 1, 1, 4, 6, 6, 6]`  
Current min = 0, max = 6, difference = 6.

**Step 2 — Understand what three moves let us do**  
We can change three numbers to any value. If we think about the sorted array, the overall range is determined by the smallest and largest values. Changing elements at the extremes can shrink this range.

But we don’t have to change only the smallest or largest—sometimes changing interior elements can help more. Since we can set a changed element to any value, we can effectively “remove” it from consideration for determining the min or max.

**Step 3 — Try possible strategies**  
With three moves, we can remove up to three elements from affecting the min/max. In a sorted array, the new min will come from one of the first four elements (since we could remove the first three), and the new max will come from one of the last four elements (since we could remove the last three).

Let’s check the possibilities:

- Remove 3 smallest: keep `[4, 6, 6, 6]`, min=4, max=6, diff=2.
- Remove 2 smallest + 1 largest: keep `[1, 4, 6, 6]`, min=1, max=6, diff=5.
- Remove 1 smallest + 2 largest: keep `[0, 1, 1, 4]`, min=0, max=4, diff=4.
- Remove 3 largest: keep `[0, 1, 1, 4]`, min=0, max=4, diff=4.

But wait—we can do better by changing values to something inside the kept range. Actually, if we keep four elements (because we remove three), the min and max will be exactly the smallest and largest of those four. So we just need to find the smallest possible difference between the smallest and largest among any four consecutive elements in the sorted array.

**Step 4 — Check sliding window of size 4**  
Sorted: `[0, 1, 1, 4, 6, 6, 6]`  
Check consecutive groups of 4:

- `[0,1,1,4]` → diff = 4-0 = 4
- `[1,1,4,6]` → diff = 6-1 = 5
- `[1,4,6,6]` → diff = 6-1 = 5
- `[4,6,6,6]` → diff = 6-4 = 2

Best is 2 (by keeping `[4,6,6,6]`). That means we change the first three elements (0,1,1) to values between 4 and 6, making the array’s min=4, max=6, diff=2.

---

## Brute Force Approach

A brute force way would be to try all possible choices of up to three indices to change, and for each choice, determine the new min and max from the remaining elements. Then compute the difference.

But there are `C(n,0) + C(n,1) + C(n,2) + C(n,3)` ways to choose indices to change, which is O(n³) in the worst case. For each choice, we need to scan the array to find min/max of the remaining elements, costing O(n). Total: O(n⁴), far too slow for n up to 10⁵.

Even the idea of trying all possible new values for changed elements is impossible—values can be any integer.

So brute force is infeasible.

---

## Optimized Approach

The key insight: **After sorting, the optimal solution always involves keeping a contiguous block of `n-3` elements unchanged, and changing the others to fit inside that block’s range.**

Why?  
If we change up to three elements, we can effectively ignore them when determining min and max. The remaining `n-3` elements will determine the new min and max. To minimize the difference, we want those `n-3` elements to be as close together as possible. In a sorted array, the closest `n-3` elements will be consecutive.

Thus, the problem reduces to:  
**Find the minimum difference between the first and last element in any contiguous subarray of length `n-3` in the sorted array.**

But since `n-3` is fixed, we just slide a window of size `n-3` over the sorted array and track `nums[i + n-4] - nums[i]` for all valid i.

Wait—careful: If we keep `n-3` elements, that’s `k = n-3` elements. The difference is `nums[i + k - 1] - nums[i]` for i from 0 to n-k. Here k = n-3, so n-k = 3. So we only need to check 4 windows? Actually, let’s derive properly:

We can change 3 elements, so we keep `n-3` elements. Let `keep = n-3`.  
We want the smallest difference between max and min of any `keep` consecutive elements in sorted order.  
That means we check windows of size `keep`:  
For each start index i from 0 to n-keep, compute `nums[i+keep-1] - nums[i]`, take the minimum.

But if `n <= 4`, we can change up to 3 elements to match the others, so difference can be 0.

---

## Optimal Solution

We sort the array, then check all windows of size `n-3` (or size 1 if n<=4). The smallest difference between the ends of such a window is our answer.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def minDifference(nums):
    n = len(nums)
    # If we have 4 or fewer elements, we can change up to 3 to match the others
    if n <= 4:
        return 0

    # Sort the array
    nums.sort()

    # We will keep n-3 elements unchanged, change the other 3
    keep = n - 3
    min_diff = float('inf')

    # Slide window of size 'keep' over sorted array
    for i in range(n - keep + 1):
        # Window from i to i+keep-1
        current_diff = nums[i + keep - 1] - nums[i]
        min_diff = min(min_diff, current_diff)

    return min_diff
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function minDifference(nums) {
  const n = nums.length;
  // With 4 or fewer elements, we can make all equal with at most 3 changes
  if (n <= 4) return 0;

  // Sort ascending
  nums.sort((a, b) => a - b);

  const keep = n - 3; // Number of elements we keep unchanged
  let minDiff = Infinity;

  // Check each window of size 'keep'
  for (let i = 0; i <= n - keep; i++) {
    const windowDiff = nums[i + keep - 1] - nums[i];
    minDiff = Math.min(minDiff, windowDiff);
  }

  return minDiff;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.Arrays;

class Solution {
    public int minDifference(int[] nums) {
        int n = nums.length;
        // If 4 or fewer elements, we can make them all equal
        if (n <= 4) return 0;

        // Sort the array
        Arrays.sort(nums);

        int keep = n - 3; // Elements we don't change
        int minDiff = Integer.MAX_VALUE;

        // Slide window of size 'keep'
        for (int i = 0; i <= n - keep; i++) {
            int currentDiff = nums[i + keep - 1] - nums[i];
            minDiff = Math.min(minDiff, currentDiff);
        }

        return minDiff;
    }
}
```

</div>

---

## Complexity Analysis

**Time complexity:** O(n log n) due to sorting. The sliding window step is O(n), but sorting dominates.

**Space complexity:** O(1) if sorting is in-place (like in Python’s Timsort for lists, or Java’s Arrays.sort for primitives). In JavaScript, `.sort()` may be O(n) space depending on engine, but we treat as O(1) extra space beyond input.

---

## Common Mistakes

1. **Not handling small arrays (n ≤ 4)**  
   If n=4, you can change 3 elements to match the fourth, making difference 0. Many candidates miss this edge case and get wrong answers.

2. **Changing the wrong elements**  
   Some think you must change the current min or max. But you might change interior elements to allow a smaller range. Sorting reveals the optimal contiguous block to keep.

3. **Off-by-one in window size**  
   We keep `n-3` elements, so window size is `n-3`, not `n-4`. Check: if n=7, keep=4, window size=4. The loop should run from i=0 to i=3 (since n-keep = 3).

4. **Forgetting to sort**  
   The sliding window on sorted array is key. Without sorting, you can’t guarantee the kept elements are consecutive in value.

---

## When You’ll See This Pattern

This “change up to k elements” pattern appears in problems where you can ignore some outliers to optimize a range or distribution.

Related problems:

- **Minimum Difference Between Largest and Smallest Value in Three Moves** (this problem) — change up to 3 elements to minimize range.
- **Minimize the Maximum Difference of Pairs** — similar idea of ignoring some elements (by pairing) to minimize max difference.
- **Minimum Moves to Make Array Complementary** — changing elements to meet a target sum with limited moves.
- **Smallest Range II** — add or subtract k to each element to minimize range.

The core technique: **Sort, then consider windows of size `n-k` where k is the number of removable/changeable elements.**

---

## Key Takeaways

1. **Sorting transforms the problem** — Once sorted, the optimal kept elements are consecutive, reducing to a sliding window problem.
2. **Changing elements ≈ removing them** — When you can change an element to any value, you can effectively exclude it from determining min/max.
3. **Check edge cases for small n** — When n ≤ k+1 (here k=3, so n≤4), you can make all elements equal.

---

Related problems: [Minimize the Maximum Difference of Pairs](/problem/minimize-the-maximum-difference-of-pairs)
