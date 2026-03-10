---
title: "How to Solve Maximum Median Sum of Subsequences of Size 3 — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Median Sum of Subsequences of Size 3. Medium difficulty, 65.1% acceptance rate. Topics: Array, Math, Greedy, Sorting, Game Theory."
date: "2028-04-07"
category: "dsa-patterns"
tags: ["maximum-median-sum-of-subsequences-of-size-3", "array", "math", "greedy", "medium"]
---

## How to Solve Maximum Median Sum of Subsequences of Size 3

You're given an array where you repeatedly select three elements, take their median, and remove them. Your goal is to maximize the sum of all medians taken. The array length is divisible by 3, so you'll perform exactly n/3 operations. The tricky part is that you control which elements get grouped together, and the median isn't simply the middle value—it's the second smallest of the three selected elements. This means you can strategically sacrifice small and large elements to maximize your median values.

---

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 2, 3, 4, 5, 6]` (n=6, so we'll perform 2 operations).

**Step 1: Understanding median selection**
If we pick `[1, 2, 6]`, the sorted order is `[1, 2, 6]` → median = 2.
If we pick `[1, 5, 6]`, sorted is `[1, 5, 6]` → median = 5.
Notice: The median is the **second smallest** of the three chosen numbers.

**Step 2: Intuition building**
We want to maximize the sum of medians. For each group of three:

- The smallest element in the group doesn't contribute to our sum
- The median becomes our "prize"
- The largest element can be "sacrificed" to help get a good median

**Step 3: Optimal grouping for our example**
Let's sort the array: `[1, 2, 3, 4, 5, 6]`

Option A: Group as `[1, 2, 3]` and `[4, 5, 6]`

- First group median = 2
- Second group median = 5
- Total = 7

Option B: Group as `[1, 5, 6]` and `[2, 3, 4]`

- First group median = 5
- Second group median = 3
- Total = 8

Option C: Group as `[1, 2, 6]` and `[3, 4, 5]`

- First group median = 2
- Second group median = 4
- Total = 6

The best is Option B with total 8. Notice the pattern: We're pairing one small element with two larger ones to get a large median.

**Step 4: The key insight**
After sorting, if we look at the last 2n/3 elements (the largest two-thirds), every median must come from this portion. Why? Because in each group of three, the median is the second smallest, so it must be larger than at least one element. The smallest n/3 elements will always be the "sacrificial lambs" that help boost our medians.

---

## Brute Force Approach

A naive solution would try all possible groupings. For n=6, we'd:

1. Generate all combinations of 3 elements for the first group
2. For each, generate combinations from remaining elements for the second group
3. Calculate the median sum for each pairing
4. Track the maximum

This is combinatorial explosion: O((n choose 3) × ((n-3) choose 3) × ...) which is factorial time. Even for n=12, that's millions of combinations. Clearly infeasible.

What about dynamic programming? We could try DP with bitmasking, but with n up to 10^5, that's impossible (2^n states).

The brute force teaches us we need a **structural insight** about optimal grouping, not exhaustive search.

---

## Optimized Approach

**The breakthrough realization:** After sorting the array, the optimal strategy is to always take the **second element from the back of each triple** when we group from the end.

Let's prove this with our sorted array `[a₁, a₂, a₃, ..., aₙ]` where a₁ is smallest:

1. We need n/3 medians
2. Each median is the **second smallest** in its group of three
3. Therefore, each median must be larger than at least one element in its group
4. The smallest n/3 elements can only serve as the "smaller than median" elements
5. So medians must come from the remaining 2n/3 elements

But which of those 2n/3 elements become medians? The optimal choice is to take every second element starting from position n/3 in the sorted array.

**Why this works:**
Imagine we have sorted array: `[s₁, s₂, ..., sₙ/₃, m₁, m₂, ..., m₂ₙ/₃]`
Where s's are the smallest n/3 elements (sacrificial), m's are the rest.

We can pair each sacrificial element with two m's. The median will be the smaller of the two m's. To maximize the sum, we want the smaller m in each pair to be as large as possible. This happens when we take m's in order and skip every third one.

**Concrete pattern:** For sorted array indices 0-based:

- Take elements at indices: n/3, n/3 + 2, n/3 + 4, ... up to n-1
- This gives us exactly n/3 elements
- Each is the median of a triple containing one smaller element and one larger element

---

## Optimal Solution

The implementation is surprisingly simple once we have the insight:

1. Sort the array
2. Start from index n/3
3. Take every second element until we have n/3 medians
4. Sum them

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(1) or O(n) depending on sort implementation
def maxMedianSum(nums):
    """
    Calculate the maximum possible sum of medians when repeatedly
    selecting triples from the array.

    Args:
        nums: List[int] - Array with length divisible by 3

    Returns:
        int - Maximum sum of medians
    """
    n = len(nums)

    # Step 1: Sort the array to enable optimal grouping
    nums.sort()

    # Step 2: Initialize sum and starting index
    # We need n/3 medians, and they start from index n/3
    # We take every second element from there
    total_sum = 0

    # Step 3: Sum every second element starting from index n/3
    # We need exactly n/3 medians, so we take n/3 steps
    # Each step jumps by 2 indices
    for i in range(n // 3):
        # Current index: start at n/3, then add 2 for each median we take
        idx = (n // 3) + 2 * i
        total_sum += nums[idx]

    return total_sum
```

```javascript
// Time: O(n log n) for sorting | Space: O(1) or O(n) depending on sort implementation
function maxMedianSum(nums) {
  /**
   * Calculate the maximum possible sum of medians when repeatedly
   * selecting triples from the array.
   *
   * @param {number[]} nums - Array with length divisible by 3
   * @return {number} - Maximum sum of medians
   */
  const n = nums.length;

  // Step 1: Sort the array to enable optimal grouping
  nums.sort((a, b) => a - b); // Numeric sort, not lexicographic!

  // Step 2: Initialize sum
  let totalSum = 0;

  // Step 3: Sum every second element starting from index n/3
  // We need exactly n/3 medians
  for (let i = 0; i < n / 3; i++) {
    // Index calculation: start at n/3, jump by 2 each time
    const idx = Math.floor(n / 3) + 2 * i;
    totalSum += nums[idx];
  }

  return totalSum;
}
```

```java
// Time: O(n log n) for sorting | Space: O(1) or O(n) depending on sort implementation
import java.util.Arrays;

class Solution {
    public long maxMedianSum(int[] nums) {
        /**
         * Calculate the maximum possible sum of medians when repeatedly
         * selecting triples from the array.
         *
         * @param nums - Array with length divisible by 3
         * @return long - Maximum sum of medians (use long to avoid overflow)
         */
        int n = nums.length;

        // Step 1: Sort the array to enable optimal grouping
        Arrays.sort(nums);

        // Step 2: Initialize sum (use long to handle large sums)
        long totalSum = 0;

        // Step 3: Sum every second element starting from index n/3
        // We need exactly n/3 medians
        for (int i = 0; i < n / 3; i++) {
            // Index calculation: start at n/3, jump by 2 each time
            int idx = n / 3 + 2 * i;
            totalSum += nums[idx];
        }

        return totalSum;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(n log n)

- Dominated by the sorting step. All modern comparison sorts (Timsort, Quicksort, etc.) take O(n log n) in the average case.
- The summation loop is O(n/3) = O(n), which is dominated by O(n log n).

**Space Complexity:** O(1) or O(n)

- If sorting is in-place (like heapsort), it's O(1) extra space.
- If using standard library sort (like Python's Timsort or Java's Arrays.sort), it's O(n) in the worst case due to auxiliary arrays.
- The rest of the algorithm uses only O(1) extra variables.

---

## Common Mistakes

1. **Forgetting to sort numerically in JavaScript**: `nums.sort()` without a comparator does lexicographic sorting, so `[10, 2, 1]` becomes `[1, 10, 2]`. Always use `nums.sort((a, b) => a - b)`.

2. **Off-by-one in index calculation**: Starting at index 0 instead of n/3, or taking every element instead of every second element. Test with n=6: indices should be [2, 4] for 0-based indexing after sorting.

3. **Integer overflow**: With n up to 10^5 and values up to 10^9, the sum can exceed 32-bit integer range. Use 64-bit integers (long in Java, normal int in Python handles big integers automatically).

4. **Misunderstanding the median definition**: The median of three numbers is the **second smallest**, not the average and not necessarily the middle value of the original unsorted triple. This is why sorting the entire array first is crucial.

---

## When You'll See This Pattern

This problem uses **greedy selection after sorting**, a pattern common in optimization problems where you need to maximize or minimize some function of selected elements.

Related LeetCode problems:

1. **Maximum Product of Three Numbers (LeetCode 628)** - Also involves sorting and selecting elements from ends of the sorted array to maximize a product.
2. **Array Partition I (LeetCode 561)** - Sort and take every second element to maximize the sum of minimums in pairs.
3. **Minimum Cost to Hire K Workers (LeetCode 857)** - Sort by ratio then use a greedy approach with a heap.

The core pattern: When order matters for selection but you control the grouping, sorting often reveals the optimal structure.

---

## Key Takeaways

1. **Sorting transforms selection problems**: Many problems become tractable when you realize the optimal solution has a natural ordering. If you can choose which elements go together, try sorting first.

2. **Greedy often works with medians**: For median-related optimization, the optimal strategy frequently involves taking elements at regular intervals from the sorted array. Test small cases to discover the pattern.

3. **Prove your greedy choice**: Before coding, verify with small examples that your selection strategy is optimal. Ask: "Could swapping any two elements improve the result?" If not, greedy is likely correct.

[Practice this problem on CodeJeet](/problem/maximum-median-sum-of-subsequences-of-size-3)
