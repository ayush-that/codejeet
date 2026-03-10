---
title: "How to Solve Maximize Greatness of an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Greatness of an Array. Medium difficulty, 61.3% acceptance rate. Topics: Array, Two Pointers, Greedy, Sorting."
date: "2028-11-08"
category: "dsa-patterns"
tags: ["maximize-greatness-of-an-array", "array", "two-pointers", "greedy", "medium"]
---

# How to Solve "Maximize Greatness of an Array"

You're given an array `nums` and can rearrange it into any permutation. For each position, you get a point if the permuted value is greater than the original value. Your goal is to maximize the number of such positions. The challenge lies in strategically matching larger numbers to positions where they can beat smaller numbers without wasting potential wins.

## Visual Walkthrough

Let's trace through `nums = [1, 3, 5, 2, 1, 3, 1]` step by step:

**Step 1: Sort the array**  
Sorted: `[1, 1, 1, 2, 3, 3, 5]`  
This helps us see which numbers can beat which others.

**Step 2: Use two pointers to match winners**  
We'll use two pointers: `i` for the "target" we're trying to beat, and `j` for the "champion" that will do the beating.

- Start: `i = 0` (first 1), `j = 0` (also first 1)
- Move `j` forward until we find a number > `nums[i]`: `j = 3` (value 2)
- Match: 2 beats 1 → count = 1
- Move both pointers forward: `i = 1`, `j = 4`

- Now `nums[i] = 1`, `nums[j] = 3` (already > 1)
- Match: 3 beats 1 → count = 2
- Move both: `i = 2`, `j = 5`

- `nums[i] = 1`, `nums[j] = 3` (already > 1)
- Match: 3 beats 1 → count = 3
- Move both: `i = 3`, `j = 6`

- `nums[i] = 2`, `nums[j] = 5` (already > 2)
- Match: 5 beats 2 → count = 4
- Move both: `i = 4`, `j = 7` (j is out of bounds)

**Result:** Maximum greatness = 4

Why does this work? By sorting, we ensure we always use the smallest possible "champion" that can beat each "target." This greedy approach maximizes matches because it doesn't waste large numbers on easy targets.

## Brute Force Approach

A naive approach would try all permutations of `nums` and count how many positions have `perm[i] > nums[i]`, keeping track of the maximum. For each permutation (n! possibilities), we'd need O(n) time to check it, resulting in O(n! × n) time complexity.

Even for n = 10, that's over 3.6 million permutations to check. For n = 20, it's astronomically large (2.4 × 10¹⁸). Clearly, we need a smarter approach.

What some candidates might try is to match each number with the next larger number they find, but without sorting, this becomes inefficient and may not yield the optimal result. For example, with `[3, 2, 1]`, a naive matching might pair 3 with nothing (since nothing is larger), 2 with nothing, and get 0 matches, while the optimal arrangement `[1, 3, 2]` gives 2 matches.

## Optimized Approach

The key insight is that this problem is essentially about **matching each element with a strictly larger element** in the most efficient way possible. Think of it like a tournament: you want to pair up contestants so that in as many matches as possible, the "away" player beats the "home" player.

**Step-by-step reasoning:**

1. **Sort the array** - This lets us easily find larger numbers for each position.
2. **Use two pointers** - One pointer (`i`) tracks the "target" we're trying to beat, another (`j`) tracks the smallest available "champion" that can beat it.
3. **Greedy matching** - Always use the smallest champion that can beat the current target. This preserves larger champions for harder targets later.
4. **Count successes** - Each time we find a champion > target, we count it and move both pointers forward. If not, we just move the champion pointer to look for a bigger champion.

Why is this greedy approach optimal? If we have a champion that can beat the current target, using it now is always safe. If we skip it and save it for later, we might end up with a situation where we have an even larger champion that could have beaten a harder target, but we wasted it on an easy one.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def maximizeGreatness(nums):
    """
    Returns the maximum number of positions where perm[i] > nums[i]
    after optimal rearrangement.

    Strategy: Sort the array, then use two pointers to match
    each element with the next available larger element.
    """
    # Step 1: Sort the array to enable efficient matching
    # Sorting allows us to easily find larger elements for each position
    nums.sort()

    # Step 2: Initialize pointers
    # i points to the current element we're trying to "beat"
    # j points to potential "beaters" (elements that could be > nums[i])
    i, j = 0, 0
    greatness = 0

    # Step 3: Try to match each element with a larger element
    # We'll move through the sorted array, finding for each nums[i]
    # the smallest nums[j] that is greater than it
    while j < len(nums):
        if nums[j] > nums[i]:
            # Found a match! nums[j] can be placed at position i
            # to create a "greatness" point
            greatness += 1
            i += 1  # Move to next element to beat
            j += 1  # Move to next potential beater
        else:
            # Current j cannot beat i, try next larger element
            j += 1

    return greatness
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function maximizeGreatness(nums) {
  /**
   * Returns the maximum number of positions where perm[i] > nums[i]
   * after optimal rearrangement.
   *
   * Strategy: Sort the array, then use two pointers to match
   * each element with the next available larger element.
   */

  // Step 1: Sort the array to enable efficient matching
  // Sorting allows us to easily find larger elements for each position
  nums.sort((a, b) => a - b);

  // Step 2: Initialize pointers
  // i points to the current element we're trying to "beat"
  // j points to potential "beaters" (elements that could be > nums[i])
  let i = 0,
    j = 0;
  let greatness = 0;

  // Step 3: Try to match each element with a larger element
  // We'll move through the sorted array, finding for each nums[i]
  // the smallest nums[j] that is greater than it
  while (j < nums.length) {
    if (nums[j] > nums[i]) {
      // Found a match! nums[j] can be placed at position i
      // to create a "greatness" point
      greatness++;
      i++; // Move to next element to beat
      j++; // Move to next potential beater
    } else {
      // Current j cannot beat i, try next larger element
      j++;
    }
  }

  return greatness;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

public int maximizeGreatness(int[] nums) {
    /**
     * Returns the maximum number of positions where perm[i] > nums[i]
     * after optimal rearrangement.
     *
     * Strategy: Sort the array, then use two pointers to match
     * each element with the next available larger element.
     */

    // Step 1: Sort the array to enable efficient matching
    // Sorting allows us to easily find larger elements for each position
    Arrays.sort(nums);

    // Step 2: Initialize pointers
    // i points to the current element we're trying to "beat"
    // j points to potential "beaters" (elements that could be > nums[i])
    int i = 0, j = 0;
    int greatness = 0;

    // Step 3: Try to match each element with a larger element
    // We'll move through the sorted array, finding for each nums[i]
    // the smallest nums[j] that is greater than it
    while (j < nums.length) {
        if (nums[j] > nums[i]) {
            // Found a match! nums[j] can be placed at position i
            // to create a "greatness" point
            greatness++;
            i++;  // Move to next element to beat
            j++;  // Move to next potential beater
        } else {
            // Current j cannot beat i, try next larger element
            j++;
        }
    }

    return greatness;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the array takes O(n log n) time using comparison-based sorts like Timsort (Python), Merge sort (Java), or Quick sort (JavaScript).
- The two-pointer pass takes O(n) time since each pointer moves at most n times.
- Dominated by sorting, so overall O(n log n).

**Space Complexity:** O(1) or O(n) depending on language and sorting implementation

- Python's Timsort uses O(n) space in worst case.
- JavaScript's sort implementation varies by engine but typically uses O(log n) to O(n) space.
- Java's Arrays.sort() uses O(log n) to O(n) space for object arrays, O(1) for primitive arrays with Dual-Pivot Quicksort.
- The two-pointer algorithm itself uses O(1) extra space.

## Common Mistakes

1. **Forgetting to sort the array** - Some candidates try to solve this without sorting, which leads to O(n²) solutions or incorrect greedy choices. Always sort first when you need to match elements based on relative sizes.

2. **Using the same element multiple times** - In the matching process, ensure you don't use an element to beat multiple targets. The two-pointer approach naturally avoids this by advancing both pointers on a successful match.

3. **Not handling duplicates correctly** - With duplicates like `[1, 1, 1, 2]`, the optimal greatness is 1 (only the last 1 can be beaten by 2). The sorted two-pointer approach handles this correctly because we only count `nums[j] > nums[i]`, not `nums[j] >= nums[i]`.

4. **Off-by-one errors with pointers** - When `j` reaches the end but `i` hasn't, we correctly stop because we can't find any more champions. Make sure your while condition checks `j < len(nums)` not `i < len(nums)`.

## When You'll See This Pattern

This "sorted two-pointer greedy matching" pattern appears in several other problems:

1. **Maximum Matching of Players With Trainers (Medium)** - Very similar! Match players with trainers where trainer capacity ≥ player skill. Sort both arrays and use two pointers to maximize matches.

2. **Assign Cookies (Easy)** - Match children with cookies where cookie size ≥ child's greed. Same sorted two-pointer approach.

3. **Boats to Save People (Medium)** - Match people into boats where sum of weights ≤ limit. Requires sorting and two pointers from both ends.

The core pattern: When you need to match elements from one collection to another based on a size/strength condition, sorting + two pointers is often the optimal approach.

## Key Takeaways

1. **Sorting enables greedy matching** - When you need to pair elements based on relative values, sorting first often reveals the optimal pairing strategy.

2. **"Smallest sufficient element" greedy choice** - For matching problems, always use the smallest element that can satisfy the current requirement. This preserves larger elements for harder requirements later.

3. **Two pointers for efficient scanning** - After sorting, two pointers can find matches in O(n) time by taking advantage of the sorted order.

**Related problems:** [3Sum Smaller](/problem/3sum-smaller), [Maximum Matching of Players With Trainers](/problem/maximum-matching-of-players-with-trainers)
