---
title: "How to Solve Minimum Number of Operations to Have Distinct Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Have Distinct Elements. Medium difficulty, 42.0% acceptance rate. Topics: Array, Hash Table."
date: "2029-06-25"
category: "dsa-patterns"
tags: ["minimum-number-of-operations-to-have-distinct-elements", "array", "hash-table", "medium"]
---

# How to Solve Minimum Number of Operations to Have Distinct Elements

This problem asks us to repeatedly remove elements from an array until it's either empty or contains only distinct values. The twist is that each operation removes exactly three elements (or all remaining if fewer than three). The challenge lies in determining the minimum number of operations needed, which requires careful tracking of element frequencies and understanding when duplicates disappear.

What makes this problem interesting is that we can't simply count duplicates—we need to simulate the removal process while accounting for the fact that removing elements changes which values remain and whether duplicates persist. The "remove first three" operation creates a sliding window effect where we process the array in chunks.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 2, 3, 4, 4, 5, 6, 7]`

**Operation 1:** Remove first three elements `[1, 2, 2]`

- Remaining array: `[3, 4, 4, 5, 6, 7]`
- Check for duplicates: `4` appears twice → still has duplicates
- Operations count: 1

**Operation 2:** Remove next three elements `[3, 4, 4]`

- Remaining array: `[5, 6, 7]`
- Check for duplicates: All elements are distinct!
- Operations count: 2

We stop here because the remaining array has no duplicates. The answer is **2 operations**.

Notice that we don't need to physically remove elements—we just need to track how many operations it takes until the remaining portion of the array has all distinct values. The key insight is that we're processing the array in chunks of 3, and we need to check the frequency of elements in the unprocessed portion.

## Brute Force Approach

A naive approach would be to actually simulate the removal process:

1. Start with the full array
2. While array has duplicates:
   - Remove first 3 elements (or all if fewer than 3)
   - Count one operation
3. Return the operation count

The problem with this approach is efficiency. Each removal requires shifting elements (O(n) time), and checking for duplicates requires scanning the array (O(n) time). In the worst case where we need many operations, this could be O(n²) time complexity.

Additionally, the brute force doesn't leverage the fact that we only care about when duplicates disappear, not the exact state of the array at each step.

## Optimized Approach

The key insight is that we don't need to physically remove elements. Instead, we can think about the array being processed from left to right in chunks of 3. After `k` operations, we've processed `3k` elements. The remaining elements start at index `3k`.

We need to find the smallest `k` such that the subarray starting at index `3k` has all distinct elements. But there's a catch: even if the remaining subarray has duplicates, we might need to continue removing because those duplicates might be removed in future operations.

Actually, the correct insight is simpler: We need to process enough elements so that no value appears more than once in the remaining portion. Since we're removing from the front, values that appear early might be removed, potentially eliminating duplicates.

Here's the step-by-step reasoning:

1. We'll process the array from back to front, tracking which values we've seen
2. When we encounter a duplicate while scanning backwards, we know we need to remove at least up to that point
3. Each operation removes 3 elements, so we need `ceil(index / 3)` operations to remove up to a certain position
4. The answer is the maximum number of operations needed to eliminate all duplicates

Wait, let's think about this more carefully with an example: `[1, 2, 2, 3, 4, 4, 5]`

If we scan from back to front:

- Start at end: `5` (new)
- `4` (new)
- `4` (duplicate!) → We need to remove at least up to the first `4`
- Position of first `4` is index 4 (0-based)
- We need `ceil((4+1)/3) = ceil(5/3) = 2` operations to remove up to index 4
- Continue scanning: `3`, `2` (duplicate!), `2`, `1`
- For duplicate `2` at index 2: `ceil((2+1)/3) = ceil(3/3) = 1` operation

We take the maximum: 2 operations.

This works! By scanning from the end, when we find a duplicate, we know all occurrences before it must be removed to eliminate that duplicate. The earliest we could remove it is by having an operation that includes that position.

## Optimal Solution

The optimal solution uses a hash set to track seen elements while scanning from right to left. For each duplicate found, we calculate how many operations are needed to remove up to that point, and keep track of the maximum operations needed.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def min_operations(nums):
    """
    Calculate minimum operations to make remaining array have distinct elements.

    Approach: Scan from right to left, tracking seen elements.
    When a duplicate is found, calculate operations needed to remove
    all elements up to that point.
    """
    seen = set()  # Track elements we've encountered from the right
    max_ops = 0   # Track maximum operations needed

    # Scan from right to left
    for i in range(len(nums) - 1, -1, -1):
        if nums[i] in seen:
            # Found a duplicate! We need to remove all elements up to index i
            # Since operations remove 3 elements at a time, we need ceil((i+1)/3) operations
            # i+1 because i is 0-based index, and we need count of elements to remove
            operations_needed = (i + 1 + 2) // 3  # Ceil division trick: (x + 2)//3
            max_ops = max(max_ops, operations_needed)
        else:
            # New element, add to seen set
            seen.add(nums[i])

    return max_ops
```

```javascript
// Time: O(n) | Space: O(n)
function minOperations(nums) {
  /**
   * Calculate minimum operations to make remaining array have distinct elements.
   *
   * Approach: Scan from right to left, tracking seen elements.
   * When a duplicate is found, calculate operations needed to remove
   * all elements up to that point.
   */
  const seen = new Set(); // Track elements we've encountered from the right
  let maxOps = 0; // Track maximum operations needed

  // Scan from right to left
  for (let i = nums.length - 1; i >= 0; i--) {
    if (seen.has(nums[i])) {
      // Found a duplicate! We need to remove all elements up to index i
      // Since operations remove 3 elements at a time, we need Math.ceil((i+1)/3) operations
      // i+1 because i is 0-based index, and we need count of elements to remove
      const operationsNeeded = Math.ceil((i + 1) / 3);
      maxOps = Math.max(maxOps, operationsNeeded);
    } else {
      // New element, add to seen set
      seen.add(nums[i]);
    }
  }

  return maxOps;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int minOperations(int[] nums) {
        /**
         * Calculate minimum operations to make remaining array have distinct elements.
         *
         * Approach: Scan from right to left, tracking seen elements.
         * When a duplicate is found, calculate operations needed to remove
         * all elements up to that point.
         */
        Set<Integer> seen = new HashSet<>();  // Track elements we've encountered from the right
        int maxOps = 0;                       // Track maximum operations needed

        // Scan from right to left
        for (int i = nums.length - 1; i >= 0; i--) {
            if (seen.contains(nums[i])) {
                // Found a duplicate! We need to remove all elements up to index i
                // Since operations remove 3 elements at a time, we need ceil((i+1)/3) operations
                // i+1 because i is 0-based index, and we need count of elements to remove
                // Ceil division: (i + 1 + 2) / 3
                int operationsNeeded = (i + 1 + 2) / 3;
                maxOps = Math.max(maxOps, operationsNeeded);
            } else {
                // New element, add to seen set
                seen.add(nums[i]);
            }
        }

        return maxOps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array from right to left
- Each element is processed exactly once
- Set operations (add and contains) are O(1) on average

**Space Complexity: O(n)**

- In the worst case, all elements are distinct and we store all of them in the hash set
- The set could contain up to n elements
- Additional variables use O(1) space

## Common Mistakes

1. **Scanning left to right instead of right to left**: When scanning left to right, you might think you've eliminated duplicates when you actually haven't. For example, in `[1, 2, 1, 3]`, scanning left to right would mark the second `1` as a duplicate, but the correct approach requires considering that the first `1` needs to be removed too.

2. **Forgetting the ceil division**: The operation removes elements in chunks of 3, so removing `k` elements requires `ceil(k/3)` operations. A common mistake is using integer division which truncates downward.

3. **Not handling the 0-based to 1-based conversion correctly**: When we find a duplicate at index `i`, we need to remove `i+1` elements (since indices are 0-based but counts are 1-based).

4. **Overcomplicating with actual removal simulation**: Some candidates try to actually remove elements and maintain the array, which is inefficient and error-prone. The key is recognizing we only need to calculate, not simulate.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Right-to-left scanning with duplicate detection**: Similar to problems where you need to find the first/last occurrence of something. Related problem: [First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/) (though that scans left to right).

2. **Ceil division for chunk processing**: Appears in problems where you process elements in fixed-size groups. Related problem: [Minimum Number of Operations to Make Array Empty](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-empty/) where you need to remove elements in groups of 2 or 3.

3. **Hash set for duplicate tracking**: A fundamental pattern in many array problems. Related problem: [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/), though that's simpler.

## Key Takeaways

1. **When dealing with "remove from front" problems, consider scanning from the back**: This often simplifies the logic because you're working with what remains rather than what was removed.

2. **For fixed-size chunk operations, remember ceil division**: The formula `ceil(x/k) = (x + k - 1) // k` is useful for integer arithmetic without floating point.

3. **Think about what information you actually need**: You don't always need to simulate the entire process. Often, you can derive the answer by analyzing the structure of the input.

[Practice this problem on CodeJeet](/problem/minimum-number-of-operations-to-have-distinct-elements)
