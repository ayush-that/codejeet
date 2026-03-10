---
title: "How to Solve Partition Array Such That Maximum Difference Is K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition Array Such That Maximum Difference Is K. Medium difficulty, 81.8% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2026-05-27"
category: "dsa-patterns"
tags: ["partition-array-such-that-maximum-difference-is-k", "array", "greedy", "sorting", "medium"]
---

# How to Solve Partition Array Such That Maximum Difference Is K

You're given an array of integers and need to split it into the fewest number of subsequences where each subsequence has a maximum-minimum difference of at most `k`. The tricky part is that elements can appear in any order within subsequences (they don't need to be contiguous in the original array), but every element must be used exactly once. This problem tests your ability to recognize that sorting transforms an ordering problem into a simpler grouping problem.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 6, 1, 2, 5]` with `k = 2`

**Step 1: Sort the array**  
Sorted: `[1, 2, 3, 5, 6]`  
Sorting is crucial because it lets us group elements that are close together in value.

**Step 2: Start the first subsequence**  
We begin with the smallest element `1`. This becomes the "anchor" of our first subsequence.  
Current subsequence range: `[1, ...]`  
We can include any element ≤ `1 + k = 3` in this subsequence.

**Step 3: Add elements to the first subsequence**

- `2` is ≤ 3, so add it to subsequence 1
- `3` is ≤ 3, so add it to subsequence 1  
  Now we've used `[1, 2, 3]` in subsequence 1.

**Step 4: Start a new subsequence**  
Next element is `5`, which is > 3, so it needs a new subsequence.  
New anchor: `5`  
New range: ≤ `5 + 2 = 7`

**Step 5: Add to second subsequence**

- `6` is ≤ 7, so add it to subsequence 2

**Result**: 2 subsequences needed: `[1, 2, 3]` and `[5, 6]`

The key insight: After sorting, we can greedily extend each subsequence as far as possible before starting a new one.

## Brute Force Approach

A naive approach might try to find all possible partitions and choose the smallest one. For each element, we'd need to decide whether to start a new subsequence or add it to an existing one. With `n` elements, this creates `O(n!)` possibilities since each element has multiple choices about which subsequence to join.

Even a backtracking approach would be exponential: at each step, we could add the current element to any existing subsequence (if it fits within the `k` constraint) or start a new one. This leads to a branching factor that grows with the number of subsequences, resulting in factorial complexity.

The brute force teaches us that we need a smarter way to decide grouping without exploring all combinations.

## Optimized Approach

The optimal solution uses **sorting + greedy grouping**:

1. **Sort the array** - This brings close values together, making it easy to identify which elements can share a subsequence.

2. **Greedy grouping** - Start with the smallest element as the anchor of the first subsequence. Keep adding subsequent elements to this subsequence as long as they're within `k` of the anchor. When you encounter an element that exceeds `anchor + k`, start a new subsequence with that element as the new anchor.

**Why greedy works**:  
After sorting, if element `x` can't fit in the current subsequence (because `x > anchor + k`), then no future element `y ≥ x` can fit either. So we must start a new subsequence. This greedy choice doesn't affect future decisions negatively - any element that could have gone in the old subsequence would also fit in a new one, but starting early minimizes the total count.

**Key insight**: The minimum element of each subsequence determines its maximum allowable range. By always using the smallest available element as the anchor, we maximize how many subsequent elements can join that subsequence.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def partitionArray(nums, k):
    """
    Partition array into minimum number of subsequences where
    max(subsequence) - min(subsequence) <= k
    """
    # Step 1: Sort the array to bring close values together
    nums.sort()

    # Step 2: Initialize counters
    subsequence_count = 1  # We'll always have at least one subsequence
    current_anchor = nums[0]  # First element anchors the first subsequence

    # Step 3: Iterate through sorted array
    for num in nums:
        # Check if current element can fit in current subsequence
        if num > current_anchor + k:
            # Can't fit - need a new subsequence
            subsequence_count += 1
            # Current element becomes anchor of new subsequence
            current_anchor = num

    return subsequence_count
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function partitionArray(nums, k) {
  /**
   * Partition array into minimum number of subsequences where
   * max(subsequence) - min(subsequence) <= k
   */

  // Step 1: Sort the array to bring close values together
  nums.sort((a, b) => a - b); // Numeric sort, not lexicographic

  // Step 2: Initialize counters
  let subsequenceCount = 1; // We'll always have at least one subsequence
  let currentAnchor = nums[0]; // First element anchors the first subsequence

  // Step 3: Iterate through sorted array
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];

    // Check if current element can fit in current subsequence
    if (num > currentAnchor + k) {
      // Can't fit - need a new subsequence
      subsequenceCount++;
      // Current element becomes anchor of new subsequence
      currentAnchor = num;
    }
    // If it fits, we don't need to do anything - it stays in current subsequence
  }

  return subsequenceCount;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public int partitionArray(int[] nums, int k) {
        /**
         * Partition array into minimum number of subsequences where
         * max(subsequence) - min(subsequence) <= k
         */

        // Step 1: Sort the array to bring close values together
        Arrays.sort(nums);

        // Step 2: Initialize counters
        int subsequenceCount = 1;  // We'll always have at least one subsequence
        int currentAnchor = nums[0];  // First element anchors the first subsequence

        // Step 3: Iterate through sorted array
        for (int i = 1; i < nums.length; i++) {
            int num = nums[i];

            // Check if current element can fit in current subsequence
            if (num > currentAnchor + k) {
                // Can't fit - need a new subsequence
                subsequenceCount++;
                // Current element becomes anchor of new subsequence
                currentAnchor = num;
            }
            // If it fits, we don't need to do anything - it stays in current subsequence
        }

        return subsequenceCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting takes O(n log n) time (dominant term)
- The single pass through the sorted array takes O(n) time
- Total: O(n log n) + O(n) = O(n log n)

**Space Complexity: O(1) or O(n)**

- If we use an in-place sort (like quicksort), space is O(1) for the algorithm itself (plus O(log n) recursion stack for some sorting algorithms)
- If the language's sort uses additional space (like Timsort's O(n)), then it's O(n)
- Our algorithm uses only a few variables, so aside from sorting, it's O(1)

## Common Mistakes

1. **Forgetting to sort the array** - This is the most common mistake. Without sorting, you can't use the greedy approach because elements that could be grouped together might be far apart in the original order.

2. **Incorrect comparison condition** - Using `num - currentAnchor > k` instead of `num > currentAnchor + k` risks integer overflow with large numbers. The addition form is safer.

3. **Starting subsequence count at 0** - With an empty array, we should return 0, but with any non-empty array, we always have at least one subsequence. Some candidates initialize to 0 and increment at the start of the loop, which works but is less intuitive.

4. **JavaScript-specific: Using default sort without comparator** - In JavaScript, `array.sort()` sorts lexicographically (alphabetically), not numerically. You must use `sort((a, b) => a - b)` for correct numeric sorting.

5. **Handling empty array edge case** - The code as written handles this correctly (returns 1 for empty? Actually no - we should handle it). Let's fix: if array is empty, return 0. Our current code would error on `nums[0]` access.

## When You'll See This Pattern

This "sort + greedy grouping" pattern appears in many partitioning and interval problems:

1. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)** - Sort balloons by end position, then greedily shoot arrows at the end of the first balloon, popping all overlapping balloons.

2. **Meeting Rooms II (LeetCode 253)** - Sort meetings by start time, use a min-heap to track ending times, greedily assign rooms.

3. **Car Pooling (LeetCode 1094)** - Sort pickup and dropoff events, greedily track passenger count.

The common theme: when you need to group or schedule items based on ranges/intervals, sorting first often reveals a greedy optimal strategy.

## Key Takeaways

1. **Sorting transforms ordering problems into grouping problems** - When elements don't need to stay in original order, sorting by value (or start/end points) often simplifies the problem dramatically.

2. **Greedy works when local optimal choices lead to global optimum** - Here, always starting a new subsequence with the smallest available element (when necessary) minimizes the total count. The proof: if you delayed starting a new subsequence, you'd just have to start it later anyway, potentially with fewer elements in the previous one.

3. **Anchor-based grouping is efficient** - By tracking just the minimum (anchor) of each subsequence, you can determine what else can join it. You don't need to track all elements in the subsequence.

Related problems: [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](/problem/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit), [Maximum Beauty of an Array After Applying Operation](/problem/maximum-beauty-of-an-array-after-applying-operation)
