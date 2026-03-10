---
title: "How to Solve Create Target Array in the Given Order — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Create Target Array in the Given Order. Easy difficulty, 86.5% acceptance rate. Topics: Array, Simulation."
date: "2027-12-14"
category: "dsa-patterns"
tags: ["create-target-array-in-the-given-order", "array", "simulation", "easy"]
---

# How to Solve Create Target Array in the Given Order

This problem asks us to build a target array by repeatedly inserting numbers from `nums` at specific positions given by `index`. The catch? Each insertion shifts existing elements to the right, making this different from simple array assignment. What makes this interesting is understanding how insertion works in arrays and why we can't just place elements directly at the given indices.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `nums = [0, 1, 2, 3, 4]`, `index = [0, 1, 2, 2, 1]`

**Step-by-step process:**

1. **First insertion:** `nums[0] = 0` at `index[0] = 0`
   - Target array: `[0]`

2. **Second insertion:** `nums[1] = 1` at `index[1] = 1`
   - Target array: `[0, 1]`

3. **Third insertion:** `nums[2] = 2` at `index[2] = 2`
   - Target array: `[0, 1, 2]`

4. **Fourth insertion:** `nums[3] = 3` at `index[3] = 2`
   - We need to insert at position 2 (0-based)
   - Elements from position 2 onward shift right: `[0, 1, _, 2]`
   - Insert 3: `[0, 1, 3, 2]`

5. **Fifth insertion:** `nums[4] = 4` at `index[4] = 1`
   - Insert at position 1
   - Elements from position 1 shift right: `[0, _, 1, 3, 2]`
   - Insert 4: `[0, 4, 1, 3, 2]`

**Final target array:** `[0, 4, 1, 3, 2]`

The key insight: when we insert at an index where elements already exist, those elements (and all following elements) shift to the right to make space.

## Brute Force Approach

The most straightforward approach is to simulate exactly what the problem describes. We start with an empty array and for each pair `(nums[i], index[i])`, we insert `nums[i]` at position `index[i]` in the target array.

**Why this is the only reasonable approach:**
This problem is essentially asking us to simulate the insertion process. There's no clever optimization that avoids the shifting because the problem definition itself requires maintaining insertion order with shifting. Any attempt to pre-compute positions would be more complex than just simulating the process.

However, it's worth noting what a naive candidate might try: they might try to create an array of the final size and directly assign values to indices. This fails because:

1. Later insertions at earlier indices require shifting
2. The same index can be used multiple times
3. Elements need to move to accommodate new insertions

The simulation approach is actually optimal for this problem since we must process each insertion exactly as described.

## Optimal Solution

The optimal solution directly simulates the insertion process. We'll use the built-in `insert()` method in Python, `splice()` in JavaScript, and manual shifting in Java to insert elements at the specified positions.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
# Each insertion can take O(n) time in worst case due to shifting
def createTargetArray(nums, index):
    """
    Creates target array by inserting nums[i] at index[i] for each i.

    Args:
        nums: List of integers to insert
        index: List of insertion positions

    Returns:
        List representing the target array
    """
    # Initialize empty target array
    target = []

    # Process each element from left to right
    for i in range(len(nums)):
        # Insert nums[i] at position index[i]
        # Python's list.insert() handles the shifting automatically
        target.insert(index[i], nums[i])

    return target
```

```javascript
// Time: O(n²) | Space: O(n)
// Each splice operation can take O(n) time in worst case due to shifting
function createTargetArray(nums, index) {
  /**
   * Creates target array by inserting nums[i] at index[i] for each i.
   *
   * @param {number[]} nums - Array of integers to insert
   * @param {number[]} index - Array of insertion positions
   * @return {number[]} The target array
   */
  // Initialize empty target array
  const target = [];

  // Process each element from left to right
  for (let i = 0; i < nums.length; i++) {
    // Insert nums[i] at position index[i]
    // splice(index, deleteCount, itemToInsert)
    // This shifts elements to the right automatically
    target.splice(index[i], 0, nums[i]);
  }

  return target;
}
```

```java
// Time: O(n²) | Space: O(n)
// Each insertion requires shifting up to n elements
class Solution {
    public int[] createTargetArray(int[] nums, int[] index) {
        /**
         * Creates target array by inserting nums[i] at index[i] for each i.
         *
         * @param nums Array of integers to insert
         * @param index Array of insertion positions
         * @return The target array
         */
        // Initialize target as ArrayList for dynamic insertion
        List<Integer> targetList = new ArrayList<>();

        // Process each element from left to right
        for (int i = 0; i < nums.length; i++) {
            // Insert nums[i] at position index[i]
            // ArrayList.add() with index handles shifting
            targetList.add(index[i], nums[i]);
        }

        // Convert ArrayList to array for return type
        int[] target = new int[targetList.size()];
        for (int i = 0; i < targetList.size(); i++) {
            target[i] = targetList.get(i);
        }

        return target;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) in the worst case

- We perform n insertions (one for each element in `nums`)
- Each insertion can take O(n) time in the worst case because inserting at the beginning or middle of an array requires shifting all subsequent elements
- In the best case (always inserting at the end), it would be O(n), but we must consider worst-case
- Example worst case: `index = [0, 0, 0, 0, ...]` where each insertion is at the beginning

**Space Complexity:** O(n)

- We need to store the target array which contains n elements
- The auxiliary space (excluding output) is O(1) if we don't count the output array
- Some languages may use additional temporary space for insertion operations

## Common Mistakes

1. **Direct assignment instead of insertion:** Attempting to assign `target[index[i]] = nums[i]` without considering that indices may be reused and elements need to shift. This overwrites existing elements.

2. **Processing from right to left:** Some candidates think they can avoid shifting by processing backwards, but this doesn't work because the insertion indices are relative to the current state of the array at each step.

3. **Forgetting that indices can be out of bounds:** While the problem guarantees valid indices, in a real interview you might want to mention handling cases where `index[i] > target.length`. The correct approach is to insert at the end in such cases.

4. **Using the wrong data structure in Java:** Trying to use a regular array `int[]` from the start instead of `ArrayList`. With a regular array, you'd need to manually manage resizing and shifting, which is error-prone.

## When You'll See This Pattern

This problem teaches array manipulation with insertion operations, which appears in several contexts:

1. **Text editors and document processing:** When you insert text in the middle of a document, all following text shifts right.

2. **Database operations:** Inserting records in the middle of a table (though databases use more sophisticated structures).

3. **Related LeetCode problems:**
   - **#88 Merge Sorted Array:** Similar shifting concept when merging arrays
   - **#27 Remove Element:** Requires shifting elements when removing
   - **#283 Move Zeroes:** Involves shifting non-zero elements
   - **#1089 Duplicate Zeros:** Requires shifting elements to make space for duplicates

The core pattern is understanding how array operations affect element positions and how to manage indices when the array structure changes.

## Key Takeaways

1. **Insertion vs. Assignment:** Know when you need to insert (shifting elements) vs. simply assign (overwriting). This problem explicitly requires insertion semantics.

2. **Dynamic arrays handle shifting:** Languages provide built-in methods (`insert()`, `splice()`, `add(index, element)`) that handle the shifting automatically. In interviews, use these unless asked to implement the shifting manually.

3. **Think about worst-case scenarios:** Even "easy" problems can have O(n²) solutions. Be prepared to explain why and when this occurs.

[Practice this problem on CodeJeet](/problem/create-target-array-in-the-given-order)
