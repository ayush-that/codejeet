---
title: "How to Solve Minimum Number of Operations to Make Elements in Array Distinct — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Make Elements in Array Distinct. Easy difficulty, 71.3% acceptance rate. Topics: Array, Hash Table."
date: "2026-03-30"
category: "dsa-patterns"
tags:
  ["minimum-number-of-operations-to-make-elements-in-array-distinct", "array", "hash-table", "easy"]
---

# How to Solve Minimum Number of Operations to Make Elements in Array Distinct

This problem asks us to make all elements in an array distinct by repeatedly removing the first three elements (or all remaining if fewer than three). The tricky part is that we need to find the **minimum number of operations** required, which isn't about counting duplicates directly, but about strategically removing groups of elements until all remaining ones are unique.

What makes this interesting is that we don't actually need to simulate the removal process. The key insight is that each operation removes exactly 3 elements (or fewer at the very end), and we need to remove enough elements so that the remaining ones are all distinct. This becomes a problem of finding how many elements we need to keep from the end of the array.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 1, 2, 3, 4]`

We need to make all elements distinct. Let's think backwards from the end:

1. Start from the last element and work forward, keeping track of what we've seen
2. `4` - unique, keep it
3. `3` - haven't seen this 3 yet (from the end), keep it
4. `2` - haven't seen this 2 yet, keep it
5. `1` - haven't seen this 1 yet, keep it
6. `3` - we've already seen a 3 (from our backward scan), so we need to remove everything before this point
7. Once we hit a duplicate in our backward scan, all elements before it must be removed

So we keep `[1, 2, 3, 4]` from the end, which is 4 elements. The array has 7 total elements, so we need to remove 7 - 4 = 3 elements.

Each operation removes 3 elements, so we need exactly 1 operation.

Let's verify: Remove first 3 elements → `[1, 2, 3, 4]` remains, all distinct ✓

Another example: `nums = [1, 1, 1, 2, 2, 2]`

Working backwards:

1. `2` - unique, keep
2. `2` - duplicate! Stop here

We keep only the last element `[2]`. Total elements = 6, need to remove 5 elements.

Operations needed: ceil(5 / 3) = ceil(1.666...) = 2 operations

## Brute Force Approach

A naive approach would be to simulate the process: repeatedly remove 3 elements from the front, then check if remaining elements are all distinct. We'd continue until the condition is met.

The problem with this approach:

1. It's inefficient - O(n²) time in worst case
2. We're modifying the array repeatedly
3. Checking for duplicates each time adds overhead

While this would technically work for small inputs, it's not optimal and doesn't give us insight into the mathematical pattern.

## Optimal Solution

The optimal solution uses a hash set to track seen elements while scanning from the end. The moment we encounter a duplicate in our backward scan, we know all elements before that point must be removed.

Here's why this works:

- Elements we keep must all be distinct
- By scanning from the end, we're keeping the maximum possible elements from the end
- Once we hit a duplicate in our backward scan, any element before it would also cause duplicates (since we'd encounter it again later in our backward scan)

The number of elements to remove = total length - number of elements we can keep
Operations needed = ceil(elements_to_remove / 3)

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumOperations(nums):
    """
    Calculate minimum operations to make array distinct by removing
    groups of 3 from the beginning.

    Args:
        nums: List of integers

    Returns:
        Minimum number of operations needed
    """
    n = len(nums)
    seen = set()  # Track elements we've encountered from the end
    keep_count = 0  # How many elements we can keep from the end

    # Scan from the end to find how many elements we can keep
    for i in range(n - 1, -1, -1):
        # If we've seen this element before in our backward scan,
        # we must remove everything before this point
        if nums[i] in seen:
            break
        # Otherwise, mark it as seen and count it as keepable
        seen.add(nums[i])
        keep_count += 1

    # Elements we need to remove = total - what we can keep
    to_remove = n - keep_count

    # Each operation removes 3 elements (or fewer at the end)
    # Use integer math for ceiling division: (a + b - 1) // b
    operations = (to_remove + 2) // 3  # +2 gives us ceiling division by 3

    return operations
```

```javascript
// Time: O(n) | Space: O(n)
function minimumOperations(nums) {
  /**
   * Calculate minimum operations to make array distinct by removing
   * groups of 3 from the beginning.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Minimum number of operations needed
   */
  const n = nums.length;
  const seen = new Set(); // Track elements we've encountered from the end
  let keepCount = 0; // How many elements we can keep from the end

  // Scan from the end to find how many elements we can keep
  for (let i = n - 1; i >= 0; i--) {
    // If we've seen this element before in our backward scan,
    // we must remove everything before this point
    if (seen.has(nums[i])) {
      break;
    }
    // Otherwise, mark it as seen and count it as keepable
    seen.add(nums[i]);
    keepCount++;
  }

  // Elements we need to remove = total - what we can keep
  const toRemove = n - keepCount;

  // Each operation removes 3 elements (or fewer at the end)
  // Use Math.ceil for ceiling division
  const operations = Math.ceil(toRemove / 3);

  return operations;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minimumOperations(int[] nums) {
        /**
         * Calculate minimum operations to make array distinct by removing
         * groups of 3 from the beginning.
         *
         * @param nums Array of integers
         * @return Minimum number of operations needed
         */
        int n = nums.length;
        Set<Integer> seen = new HashSet<>();  // Track elements we've encountered from the end
        int keepCount = 0;  // How many elements we can keep from the end

        // Scan from the end to find how many elements we can keep
        for (int i = n - 1; i >= 0; i--) {
            // If we've seen this element before in our backward scan,
            // we must remove everything before this point
            if (seen.contains(nums[i])) {
                break;
            }
            // Otherwise, mark it as seen and count it as keepable
            seen.add(nums[i]);
            keepCount++;
        }

        // Elements we need to remove = total - what we can keep
        int toRemove = n - keepCount;

        // Each operation removes 3 elements (or fewer at the end)
        // Use integer math for ceiling division: (a + b - 1) / b
        int operations = (toRemove + 2) / 3;  // +2 gives us ceiling division by 3

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array from end to start
- Set operations (add and contains) are O(1) on average
- The loop runs at most n times

**Space Complexity:** O(n)

- In the worst case, we might add all elements to the set if they're all distinct
- The set can contain up to n elements
- Additional variables use O(1) space

## Common Mistakes

1. **Forgetting the backward scan**: Some candidates try to scan from the front, but this doesn't work because we want to keep as many elements from the end as possible. The backward scan ensures we maximize what we keep.

2. **Incorrect operation calculation**: Simply dividing `toRemove` by 3 without ceiling division will undercount when there's a remainder. For example, if we need to remove 4 elements, we need 2 operations (not 1).

3. **Not handling empty or small arrays**: While the problem guarantees at least 1 element, candidates might forget that if all elements are already distinct (`keep_count == n`), then `to_remove = 0` and operations = 0.

4. **Overcomplicating with simulation**: Some candidates try to actually simulate the removal process, which is unnecessary and inefficient. The mathematical approach is cleaner and faster.

## When You'll See This Pattern

This problem uses a **backward scanning with hash set** pattern combined with **mathematical calculation** of operations. You'll see similar patterns in:

1. **Minimum Increment to Make Array Unique** (LeetCode 945): While the approach differs, both problems deal with making arrays distinct and require mathematical reasoning about operations needed.

2. **Remove Duplicates from Sorted Array II** (LeetCode 80): Uses similar backward or two-pointer thinking about what to keep.

3. **Make Array Zero by Subtracting Equal Amounts** (LeetCode 2357): Involves mathematical calculation of operations based on array properties.

The key insight is recognizing when you can determine the answer through mathematical reasoning rather than simulation.

## Key Takeaways

1. **Backward scanning is powerful**: When you need to keep elements from the end, scanning backwards often simplifies the logic. You encounter elements in the order they'll remain in the final array.

2. **Mathematical reasoning beats simulation**: Many problems that ask for "minimum operations" can be solved by finding a formula rather than simulating the process. Look for patterns in what needs to be removed or changed.

3. **Hash sets for duplicate detection**: When uniqueness is involved, hash sets provide O(1) duplicate checking. Remember that backward scanning with a set helps find the "keepable" suffix efficiently.

Related problems: [Minimum Increment to Make Array Unique](/problem/minimum-increment-to-make-array-unique)
