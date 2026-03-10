---
title: "How to Solve Removing Minimum and Maximum From Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Removing Minimum and Maximum From Array. Medium difficulty, 56.2% acceptance rate. Topics: Array, Greedy."
date: "2028-04-24"
category: "dsa-patterns"
tags: ["removing-minimum-and-maximum-from-array", "array", "greedy", "medium"]
---

# How to Solve Removing Minimum and Maximum From Array

You’re given an array of distinct integers, and you need to remove both the minimum and maximum elements. The catch is that you can only remove elements from the **front** or **back** of the array, and you want to do it in the **minimum number of removals**. This problem is interesting because it’s not about finding the min/max—that’s easy—but about strategically choosing whether to remove them from the left or right side to minimize operations.

## Visual Walkthrough

Let’s walk through an example: `nums = [3, 1, 5, 2, 4]`.

**Step 1: Identify positions**

- Minimum value = 1, at index 1
- Maximum value = 5, at index 2

**Step 2: Consider removal options**
We can only remove from the ends. To remove element at index `i`, we must remove all elements from the front up to `i` (by removing from left), or all elements from the back starting from `i` (by removing from right).

For index 1 (min):

- Remove from left: takes 2 operations (remove indices 0 and 1)
- Remove from right: takes 4 operations (remove indices 1, 2, 3, 4)

For index 2 (max):

- Remove from left: takes 3 operations (remove indices 0, 1, 2)
- Remove from right: takes 3 operations (remove indices 2, 3, 4)

**Step 3: Find optimal combination**
We need to remove both elements. The total operations is the minimum of:

1. Remove both from left: max(2, 3) = 3 operations (remove up to index 2)
2. Remove both from right: max(4, 3) = 4 operations (remove from index 1 onward)
3. Remove min from left, max from right: 2 + 3 = 5 operations
4. Remove max from left, min from right: 3 + 4 = 7 operations

Minimum is 3 operations. This matches our intuition: we can remove the first 3 elements (indices 0, 1, 2) which includes both min and max.

## Brute Force Approach

A naive approach would be to try all possible combinations of removing elements from left and right until both min and max are removed. For each element, we could try removing it from left or right, but since we have two elements to remove, there are 4 combinations to check (as shown above).

The brute force would work like this:

1. Find indices of min and max
2. For each of the 4 removal strategies, calculate total removals needed
3. Return the minimum

While this approach is technically correct, it's inefficient because we might try removing many elements unnecessarily. More importantly, it doesn't scale well if we had to remove more than 2 elements. However, for this specific problem with exactly 2 elements to remove, the brute force would actually be O(1) time since there are only 4 cases to check!

The real "brute force" thinking trap here would be to actually try removing elements one by one, which would be O(n²) in worst case. But the smarter brute force is just checking the 4 cases.

## Optimized Approach

The key insight is that we only need to consider **four specific strategies** because we're only removing two specific elements:

1. **Remove both from the left**: Remove all elements up to the farther of the two indices
2. **Remove both from the right**: Remove all elements from the nearer of the two indices to the end
3. **Remove min from left, max from right**: Remove elements up to min index + remove elements from max index to end
4. **Remove max from left, min from right**: Remove elements up to max index + remove elements from min index to end

We can compute each strategy in O(1) time once we know the indices of min and max. Finding those indices takes O(n) time.

**Why this works:**

- When removing from left, the number of operations = index + 1 (because we need to remove all elements up to that index)
- When removing from right, the number of operations = n - index (because we need to remove from that index to the end)
- When combining strategies, we add the operations since we're doing two separate removal sequences

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumDeletions(nums):
    """
    Find minimum deletions to remove both min and max elements.
    Strategy: Try all 4 possible removal combinations and take minimum.
    """
    n = len(nums)

    # Find indices of minimum and maximum elements
    min_idx = nums.index(min(nums))
    max_idx = nums.index(max(nums))

    # Ensure min_idx is the smaller index for easier calculations
    # We'll swap if needed so min_idx <= max_idx
    if min_idx > max_idx:
        min_idx, max_idx = max_idx, min_idx

    # Strategy 1: Remove both from left (remove up to max_idx)
    # Need to remove indices 0 through max_idx inclusive
    # That's max_idx + 1 operations
    left_both = max_idx + 1

    # Strategy 2: Remove both from right (remove from min_idx to end)
    # Need to remove indices min_idx through n-1 inclusive
    # That's n - min_idx operations
    right_both = n - min_idx

    # Strategy 3: Remove min from left, max from right
    # Remove up to min_idx from left: min_idx + 1 operations
    # Remove from max_idx to end: n - max_idx operations
    left_min_right_max = (min_idx + 1) + (n - max_idx)

    # Strategy 4: Remove max from left, min from right
    # This is covered by the other strategies and will never be optimal
    # when min_idx <= max_idx, so we don't need to calculate it

    # Return the minimum of the three valid strategies
    return min(left_both, right_both, left_min_right_max)
```

```javascript
// Time: O(n) | Space: O(1)
function minimumDeletions(nums) {
  const n = nums.length;

  // Find indices of minimum and maximum elements
  let minIdx = 0,
    maxIdx = 0;
  for (let i = 1; i < n; i++) {
    if (nums[i] < nums[minIdx]) {
      minIdx = i;
    }
    if (nums[i] > nums[maxIdx]) {
      maxIdx = i;
    }
  }

  // Ensure minIdx is the smaller index for easier calculations
  if (minIdx > maxIdx) {
    [minIdx, maxIdx] = [maxIdx, minIdx];
  }

  // Strategy 1: Remove both from left (remove up to maxIdx)
  const leftBoth = maxIdx + 1;

  // Strategy 2: Remove both from right (remove from minIdx to end)
  const rightBoth = n - minIdx;

  // Strategy 3: Remove min from left, max from right
  const leftMinRightMax = minIdx + 1 + (n - maxIdx);

  // Return minimum of the three strategies
  return Math.min(leftBoth, rightBoth, leftMinRightMax);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumDeletions(int[] nums) {
        int n = nums.length;

        // Find indices of minimum and maximum elements
        int minIdx = 0, maxIdx = 0;
        for (int i = 1; i < n; i++) {
            if (nums[i] < nums[minIdx]) {
                minIdx = i;
            }
            if (nums[i] > nums[maxIdx]) {
                maxIdx = i;
            }
        }

        // Ensure minIdx is the smaller index for easier calculations
        if (minIdx > maxIdx) {
            int temp = minIdx;
            minIdx = maxIdx;
            maxIdx = temp;
        }

        // Strategy 1: Remove both from left (remove up to maxIdx)
        int leftBoth = maxIdx + 1;

        // Strategy 2: Remove both from right (remove from minIdx to end)
        int rightBoth = n - minIdx;

        // Strategy 3: Remove min from left, max from right
        int leftMinRightMax = (minIdx + 1) + (n - maxIdx);

        // Return minimum of the three strategies
        return Math.min(leftBoth, Math.min(rightBoth, leftMinRightMax));
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We need to scan the array once to find the indices of the minimum and maximum elements. This takes O(n) time.
- All subsequent calculations (the three strategies) take O(1) time.
- Therefore, the overall time complexity is O(n).

**Space Complexity: O(1)**

- We only use a constant amount of extra space to store indices and temporary variables.
- The input array is given and not counted in space complexity.

## Common Mistakes

1. **Forgetting to handle the case where min and max are the same element**: This can't happen in this problem because all elements are distinct, but it's a good habit to consider edge cases. If they were the same, we'd only need to remove one element.

2. **Off-by-one errors in index calculations**: When removing from left up to index `i`, you need `i + 1` operations (indices 0 through i inclusive). When removing from right starting at index `i`, you need `n - i` operations (indices i through n-1 inclusive). Mixing these up is a common mistake.

3. **Not considering all four strategies**: Some candidates only consider removing both from left or both from right, forgetting that removing one from left and one from right might be optimal. For example, in array `[1, 10, 2, 9, 3, 8, 4, 7, 5, 6]`, min is at index 0 and max is at index 1. Removing both from left takes 2 operations, but removing min from left (1 op) and max from right (9 ops) takes 10 ops. The optimal is indeed removing both from left.

4. **Assuming min index is always less than max index**: The problem doesn't guarantee this. You need to handle both cases or normalize by swapping them as shown in the solution.

## When You'll See This Pattern

This problem uses a **"two-pointer from ends"** or **"boundary optimization"** pattern that appears in several array manipulation problems:

1. **Maximum Points You Can Obtain from Cards (LeetCode 1423)**: You can only take cards from the beginning or end. The optimal strategy often involves taking some from left and some from right. This problem is essentially the inverse of our current problem.

2. **Minimum Deletions to Make Character Frequencies Unique (LeetCode 1647)**: While not about array ends, it shares the greedy "try different strategies" approach where you consider multiple ways to achieve a goal and pick the minimum.

3. **Container With Most Water (LeetCode 11)**: Uses two pointers from both ends, moving inward based on certain conditions to find an optimal solution.

4. **Trapping Rain Water (LeetCode 42)**: Uses two pointers from both ends to calculate water accumulation, though the logic is more complex.

The core pattern is: when you can only operate on the ends of an array/sequence, and you need to optimize some metric, consider all combinations of operations from left and right.

## Key Takeaways

1. **When restricted to end operations, enumerate all strategies**: For problems where you can only remove/take from the beginning or end, the number of reasonable strategies is often small (in this case, just 4). Enumerating them is usually more efficient than trying to derive a complex formula.

2. **Normalize indices for cleaner logic**: By ensuring the min index is less than or equal to the max index, we reduce the number of cases to consider from 4 to 3, making the code simpler and less error-prone.

3. **Understand what "removing an element" means in context**: In this problem, removing an element at index `i` means you must remove all elements from one end up to `i`. This is different from being able to remove individual elements arbitrarily.

Related problems: [Maximum Points You Can Obtain from Cards](/problem/maximum-points-you-can-obtain-from-cards), [Minimum Deletions to Make Character Frequencies Unique](/problem/minimum-deletions-to-make-character-frequencies-unique)
