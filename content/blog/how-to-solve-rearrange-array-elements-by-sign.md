---
title: "How to Solve Rearrange Array Elements by Sign — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rearrange Array Elements by Sign. Medium difficulty, 84.5% acceptance rate. Topics: Array, Two Pointers, Simulation."
date: "2026-12-10"
category: "dsa-patterns"
tags: ["rearrange-array-elements-by-sign", "array", "two-pointers", "simulation", "medium"]
---

# How to Solve Rearrange Array Elements by Sign

You're given an array with an equal number of positive and negative integers, and you need to rearrange them so that every consecutive pair has opposite signs, starting with positive. The challenge is doing this efficiently without sorting or creating multiple passes through the array.

What makes this problem interesting is that while it seems simple at first glance, the optimal solution requires careful index management. Many candidates jump to creating separate lists for positives and negatives, which works but uses extra space. The real test is whether you can optimize further or at least implement the straightforward solution correctly.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 1, -2, -5, 2, -4]`

We need to rearrange so positives are at even indices (0, 2, 4) and negatives at odd indices (1, 3, 5), maintaining relative order within each group.

**Step-by-step:**

1. Create result array: `[0, 0, 0, 0, 0, 0]`
2. Track positive index (even positions): `pos_idx = 0`
3. Track negative index (odd positions): `neg_idx = 1`
4. Iterate through original array:
   - `3` is positive → place at `result[0]` → `[3, 0, 0, 0, 0, 0]`, `pos_idx = 2`
   - `1` is positive → place at `result[2]` → `[3, 0, 1, 0, 0, 0]`, `pos_idx = 4`
   - `-2` is negative → place at `result[1]` → `[3, -2, 1, 0, 0, 0]`, `neg_idx = 3`
   - `-5` is negative → place at `result[3]` → `[3, -2, 1, -5, 0, 0]`, `neg_idx = 5`
   - `2` is positive → place at `result[4]` → `[3, -2, 1, -5, 2, 0]`, `pos_idx = 6`
   - `-4` is negative → place at `result[5]` → `[3, -2, 1, -5, 2, -4]`, `neg_idx = 7`

Final result: `[3, -2, 1, -5, 2, -4]` satisfies all conditions.

## Brute Force Approach

A naive approach might try to swap elements in place, but this quickly becomes messy because moving one element affects others. Another brute force would be to create two separate arrays (positives and negatives), then interleave them:

1. Create `positives = []` and `negatives = []`
2. Iterate through `nums`, adding positives to `positives` and negatives to `negatives`
3. Create result array and fill even indices from `positives` and odd indices from `negatives`

This approach works and is actually quite reasonable with O(n) time and O(n) space. However, some might try to do this in-place with swaps, which leads to O(n²) worst-case time as elements get shuffled around repeatedly.

The main issue with trying to do this in-place with swaps is that you lose the relative order requirement. If you simply swap elements to get alternating signs, you might end up with `[3, -2, 2, -5, 1, -4]` which doesn't maintain the original relative order of positives (3, 1, 2) and negatives (-2, -5, -4).

## Optimized Approach

The key insight is that we know exactly where each element should go:

- Positive numbers go to even indices (0, 2, 4, ...)
- Negative numbers go to odd indices (1, 3, 5, ...)

We can use two pointers to track where the next positive and negative should be placed. As we iterate through the original array:

- When we see a positive number, place it at the current even position and increment the positive pointer by 2
- When we see a negative number, place it at the current odd position and increment the negative pointer by 2

This gives us O(n) time and O(n) space (for the result array). We could optimize space to O(1) if we're allowed to modify the input array, but typically we need to return a new array.

## Optimal Solution

Here's the clean two-pointer solution that maintains relative order:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result array
def rearrangeArray(nums):
    n = len(nums)
    result = [0] * n  # Initialize result array with zeros

    # Initialize pointers for positive (even indices) and negative (odd indices) positions
    pos_idx = 0
    neg_idx = 1

    # Iterate through each number in the input array
    for num in nums:
        if num > 0:
            # Place positive number at the next available even index
            result[pos_idx] = num
            pos_idx += 2  # Move to next even index
        else:
            # Place negative number at the next available odd index
            result[neg_idx] = num
            neg_idx += 2  # Move to next odd index

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function rearrangeArray(nums) {
  const n = nums.length;
  const result = new Array(n).fill(0); // Initialize result array with zeros

  // Initialize pointers for positive (even indices) and negative (odd indices) positions
  let posIdx = 0;
  let negIdx = 1;

  // Iterate through each number in the input array
  for (const num of nums) {
    if (num > 0) {
      // Place positive number at the next available even index
      result[posIdx] = num;
      posIdx += 2; // Move to next even index
    } else {
      // Place negative number at the next available odd index
      result[negIdx] = num;
      negIdx += 2; // Move to next odd index
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the result array
public int[] rearrangeArray(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];  // Initialize result array

    // Initialize pointers for positive (even indices) and negative (odd indices) positions
    int posIdx = 0;
    int negIdx = 1;

    // Iterate through each number in the input array
    for (int num : nums) {
        if (num > 0) {
            // Place positive number at the next available even index
            result[posIdx] = num;
            posIdx += 2;  // Move to next even index
        } else {
            // Place negative number at the next available odd index
            result[negIdx] = num;
            negIdx += 2;  // Move to next odd index
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the input array of length n
- Each element is examined once and placed in the result array
- The operations inside the loop are O(1) constant time

**Space Complexity:** O(n)

- We create a new result array of size n
- The pointers use O(1) extra space
- If we could modify the input array in-place, we could achieve O(1) space, but the problem typically expects a new array

## Common Mistakes

1. **Forgetting that 0 is neither positive nor negative:** The problem states the array contains positive and negative integers, but some candidates might include a check for `num >= 0`. Since 0 is neither positive nor negative, this would be incorrect. Always use `num > 0` for positive check.

2. **Incorrect index management:** Some candidates try to use a single pointer and toggle between even/odd, but this fails when there are consecutive positives or negatives in the input. The two-pointer approach is cleaner and less error-prone.

3. **Attempting in-place swaps without preserving order:** Many candidates try to swap elements in the original array to achieve alternating signs, but this breaks the "maintain relative order" requirement. The swapping approach might give `[3, -2, 2, -5, 1, -4]` instead of `[3, -2, 1, -5, 2, -4]`.

4. **Assuming the array starts with positive:** The problem states the rearranged array should have every consecutive pair with opposite signs, but doesn't explicitly say it must start with positive. However, the examples and typical interpretation assume positive first. Always clarify this with the interviewer if unsure.

## When You'll See This Pattern

This two-pointer technique with separate position trackers appears in several array rearrangement problems:

1. **Sort Array By Parity II (LeetCode 922):** Similar pattern but with even/odd numbers instead of positive/negative. You maintain two pointers for even and odd positions.

2. **Move Zeroes (LeetCode 283):** While simpler, it uses a similar concept of maintaining a pointer to the next position where a non-zero element should go.

3. **Partition Array According to Given Pivot (LeetCode 2161):** You need to arrange elements less than, equal to, and greater than pivot in order, which requires multiple position pointers.

The core pattern is: when you need to place elements into specific positions based on some property, and you know where each type should go, use separate pointers for each category.

## Key Takeaways

1. **When order matters and positions are predetermined, use separate pointers:** If you know exactly where each category of elements should end up (e.g., positives at even indices, negatives at odd indices), maintain separate pointers for each category rather than trying to do complex swaps.

2. **Don't overcomplicate with in-place operations:** Sometimes O(n) space is acceptable if it makes the solution cleaner and easier to understand. The two-list approach (collect positives and negatives separately, then merge) is also valid and might be easier to explain.

3. **Always verify edge cases:** What if all positives come first? What if all negatives come first? The two-pointer solution handles all these cases correctly because it doesn't rely on any alternating pattern in the input.

Related problems: [Wiggle Subsequence](/problem/wiggle-subsequence), [Sort Array By Parity II](/problem/sort-array-by-parity-ii), [Partition Array According to Given Pivot](/problem/partition-array-according-to-given-pivot)
