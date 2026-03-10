---
title: "How to Solve The Two Sneaky Numbers of Digitville — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode The Two Sneaky Numbers of Digitville. Easy difficulty, 89.9% acceptance rate. Topics: Array, Hash Table, Math."
date: "2028-05-14"
category: "dsa-patterns"
tags: ["the-two-sneaky-numbers-of-digitville", "array", "hash-table", "math", "easy"]
---

# How to Solve The Two Sneaky Numbers of Digitville

You're given an array containing numbers from 0 to n-1, but two numbers appear twice instead of once. Your task is to find these two duplicate numbers. What makes this problem interesting is that while it seems like a simple duplicate-finding problem, the constraint that numbers range from 0 to n-1 gives us multiple approaches to solve it efficiently.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 1, 3, 0]`

Here n = 4 (numbers should be 0, 1, 2, 3), but we have 6 elements instead of 4. The two duplicates are 1 and 3.

**Using a frequency counter approach:**

- We create an empty frequency map
- Process each number:
  - 1: Not in map → add it
  - 2: Not in map → add it
  - 3: Not in map → add it
  - 1: Already in map → found a duplicate! Add to result
  - 3: Already in map → found another duplicate! Add to result
  - 0: Not in map → add it
- Result: [1, 3]

**Using the mathematical properties approach:**
Since numbers are 0 to n-1, we can use the array indices themselves:

- First pass: Mark visited numbers by making nums[abs(num)] negative
  - abs(1) = 1 → nums[1] = 2 → make it -2
  - abs(2) = 2 → nums[2] = 3 → make it -3
  - abs(3) = 3 → nums[3] = 1 → make it -1
  - abs(1) = 1 → nums[1] = -2 (already negative) → found duplicate 1
  - abs(3) = 3 → nums[3] = -1 (already negative) → found duplicate 3
  - abs(0) = 0 → nums[0] = 1 → make it -1
- Result: [1, 3]

## Brute Force Approach

The most straightforward approach is to compare each number with every other number:

```python
def findDuplicates(nums):
    result = []
    n = len(nums) - 2  # Original n value (since we have n+2 elements)

    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j] and nums[i] not in result:
                result.append(nums[i])

    return result
```

**Why this is insufficient:**

- Time complexity: O(n²) - For each of n+2 elements, we compare with all remaining elements
- Space complexity: O(1) (excluding output)
- The `nums[i] not in result` check adds another O(k) operation where k is the number of duplicates found so far
- With n up to 10⁵, this would be far too slow (10¹⁰ operations)

## Optimal Solution

We have two optimal approaches, both O(n) time:

1. **Hash Set/Map Approach**: Track seen numbers in a set, add to result when we see a number already in the set.
2. **Index Marking Approach**: Use the array itself to mark visited numbers by making values negative (since numbers are 0 to n-1).

The hash set approach is more intuitive and works even without the 0 to n-1 constraint. The index marking approach is more space-efficient but relies on the specific constraints.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the set
def findDuplicates(nums):
    """
    Find two duplicate numbers in an array containing numbers 0 to n-1
    with two numbers appearing twice.

    Args:
        nums: List of integers where each number from 0 to n-1 appears,
              but two numbers appear twice

    Returns:
        List containing the two duplicate numbers
    """
    seen = set()  # Track numbers we've seen before
    duplicates = []  # Store found duplicates

    for num in nums:
        if num in seen:
            # If we've seen this number before, it's a duplicate
            duplicates.append(num)
        else:
            # First time seeing this number, add to our set
            seen.add(num)

    return duplicates

# Alternative: Index marking approach (more space efficient)
# Time: O(n) | Space: O(1) excluding output
def findDuplicatesIndexMarking(nums):
    """
    Alternative approach using the array itself to mark visited numbers.
    This works because numbers are in range 0 to n-1.
    """
    duplicates = []

    for num in nums:
        # Use absolute value since we might have already marked it negative
        index = abs(num)

        if nums[index] < 0:
            # If the value at this index is already negative,
            # we've seen this number before
            duplicates.append(index)
        else:
            # Mark this number as seen by making the value at its index negative
            nums[index] = -nums[index]

    # Optional: Restore the original array values
    for i in range(len(nums)):
        nums[i] = abs(nums[i])

    return duplicates
```

```javascript
// Time: O(n) | Space: O(n) for the set
function findDuplicates(nums) {
  /**
   * Find two duplicate numbers in an array containing numbers 0 to n-1
   * with two numbers appearing twice.
   *
   * @param {number[]} nums - Array where each number from 0 to n-1 appears,
   *                          but two numbers appear twice
   * @return {number[]} - Array containing the two duplicate numbers
   */
  const seen = new Set(); // Track numbers we've seen before
  const duplicates = []; // Store found duplicates

  for (const num of nums) {
    if (seen.has(num)) {
      // If we've seen this number before, it's a duplicate
      duplicates.push(num);
    } else {
      // First time seeing this number, add to our set
      seen.add(num);
    }
  }

  return duplicates;
}

// Alternative: Index marking approach (more space efficient)
// Time: O(n) | Space: O(1) excluding output
function findDuplicatesIndexMarking(nums) {
  /**
   * Alternative approach using the array itself to mark visited numbers.
   * This works because numbers are in range 0 to n-1.
   */
  const duplicates = [];

  for (let i = 0; i < nums.length; i++) {
    // Use absolute value since we might have already marked it negative
    const index = Math.abs(nums[i]);

    if (nums[index] < 0) {
      // If the value at this index is already negative,
      // we've seen this number before
      duplicates.push(index);
    } else {
      // Mark this number as seen by making the value at its index negative
      nums[index] = -nums[index];
    }
  }

  // Optional: Restore the original array values
  for (let i = 0; i < nums.length; i++) {
    nums[i] = Math.abs(nums[i]);
  }

  return duplicates;
}
```

```java
// Time: O(n) | Space: O(n) for the set
import java.util.*;

class Solution {
    /**
     * Find two duplicate numbers in an array containing numbers 0 to n-1
     * with two numbers appearing twice.
     *
     * @param nums Array where each number from 0 to n-1 appears,
     *             but two numbers appear twice
     * @return List containing the two duplicate numbers
     */
    public List<Integer> findDuplicates(int[] nums) {
        Set<Integer> seen = new HashSet<>();  // Track numbers we've seen before
        List<Integer> duplicates = new ArrayList<>();  // Store found duplicates

        for (int num : nums) {
            if (seen.contains(num)) {
                // If we've seen this number before, it's a duplicate
                duplicates.add(num);
            } else {
                // First time seeing this number, add to our set
                seen.add(num);
            }
        }

        return duplicates;
    }
}

// Alternative: Index marking approach (more space efficient)
// Time: O(n) | Space: O(1) excluding output
class SolutionIndexMarking {
    /**
     * Alternative approach using the array itself to mark visited numbers.
     * This works because numbers are in range 0 to n-1.
     */
    public List<Integer> findDuplicates(int[] nums) {
        List<Integer> duplicates = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            // Use absolute value since we might have already marked it negative
            int index = Math.abs(nums[i]);

            if (nums[index] < 0) {
                // If the value at this index is already negative,
                // we've seen this number before
                duplicates.add(index);
            } else {
                // Mark this number as seen by making the value at its index negative
                nums[index] = -nums[index];
            }
        }

        // Optional: Restore the original array values
        for (int i = 0; i < nums.length; i++) {
            nums[i] = Math.abs(nums[i]);
        }

        return duplicates;
    }
}
```

</div>

## Complexity Analysis

**Hash Set Approach:**

- **Time Complexity:** O(n) - We iterate through the array once, and set operations (add/contains) are O(1) on average
- **Space Complexity:** O(n) - In the worst case, we store n-2 unique numbers in the set before finding duplicates

**Index Marking Approach:**

- **Time Complexity:** O(n) - Two passes through the array (one for marking, one for restoration)
- **Space Complexity:** O(1) - We use only a constant amount of extra space (excluding the output array)

The hash set approach is generally preferred in interviews because:

1. It's more intuitive and easier to explain
2. It works even without the 0 to n-1 constraint
3. The O(n) space is usually acceptable unless specifically asked to optimize for space

## Common Mistakes

1. **Forgetting that numbers can be 0**: In the index marking approach, if you try to mark nums[0] as negative when you see a 0, you need to be careful. Some implementations use `nums[num-1]` to avoid this, but that only works if numbers are 1 to n. The correct approach is to use absolute values.

2. **Not handling the restoration step**: If you modify the input array (like in the index marking approach) and don't restore it, you might fail follow-up questions or affect other parts of the code. Always mention that you would restore the array if needed.

3. **Returning duplicates in wrong order**: The problem doesn't usually specify an order, but some test cases might expect a specific order. If order matters, you might need to sort the result or track the order of discovery.

4. **Using an array instead of a set for frequency counting**: While an array of size n would work (since numbers are 0 to n-1), it's less general than a set. The set approach works even if the numbers weren't constrained to 0 to n-1.

## When You'll See This Pattern

This problem teaches the **frequency counting with hash sets** pattern, which appears in many duplicate-finding problems:

1. **Find All Duplicates in an Array (LeetCode 442)**: Very similar problem where each element appears once or twice, and you need to find all duplicates. The index marking approach works perfectly here.

2. **Find the Duplicate Number (LeetCode 287)**: A variation where there's exactly one duplicate, but you can't modify the array and must use O(1) space. This introduces Floyd's Tortoise and Hare algorithm.

3. **First Missing Positive (LeetCode 41)**: Uses a similar index marking technique to track which numbers are present in an array.

The key insight is recognizing when you can use the array indices themselves as a lookup table, which is possible when values are constrained to a specific range.

## Key Takeaways

1. **Hash sets are your go-to for duplicate detection**: When you need to track "have I seen this before?", a hash set provides O(1) lookup and insertion.

2. **Look for constraints that enable clever optimizations**: The 0 to n-1 range enables the O(1) space index marking solution. Always check if problem constraints allow for more efficient approaches.

3. **Consider whether you can modify the input**: The index marking approach requires modifying the input array. In interviews, always ask if modification is allowed, or mention that you would restore it afterward.

Related problems: [Find All Duplicates in an Array](/problem/find-all-duplicates-in-an-array)
