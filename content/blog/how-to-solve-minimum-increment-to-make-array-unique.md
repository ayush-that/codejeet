---
title: "How to Solve Minimum Increment to Make Array Unique — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Increment to Make Array Unique. Medium difficulty, 60.6% acceptance rate. Topics: Array, Greedy, Sorting, Counting."
date: "2028-03-23"
category: "dsa-patterns"
tags: ["minimum-increment-to-make-array-unique", "array", "greedy", "sorting", "medium"]
---

# How to Solve Minimum Increment to Make Array Unique

You're given an array of integers where some values may be duplicates. Your task is to make all values unique by incrementing duplicates, and you need to do this with the minimum total number of increments. The challenge is that when you increment one element, it might become equal to another element, creating a chain reaction that needs careful handling.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 2, 1, 2, 1, 7]`

**Step 1: Sort the array**  
Sorted: `[1, 1, 2, 2, 3, 7]`  
This helps us process numbers in order, ensuring we handle smaller values first.

**Step 2: Process each element**  
We'll keep track of the next available unique number we can use.

- Start with `prev = nums[0] = 1`
- Move to index 1: `current = 1`  
  Since `1 ≤ prev (1)`, we need to increment it to `prev + 1 = 2`  
  Moves needed: `2 - 1 = 1`  
  Update `prev = 2`
- Index 2: `current = 2`  
  Since `2 ≤ prev (2)`, increment to `prev + 1 = 3`  
  Moves needed: `3 - 2 = 1`  
  Update `prev = 3`
- Index 3: `current = 2`  
  Since `2 ≤ prev (3)`, increment to `prev + 1 = 4`  
  Moves needed: `4 - 2 = 2`  
  Update `prev = 4`
- Index 4: `current = 3`  
  Since `3 ≤ prev (4)`, increment to `prev + 1 = 5`  
  Moves needed: `5 - 3 = 2`  
  Update `prev = 5`
- Index 5: `current = 7`  
  Since `7 > prev (5)`, no increment needed  
  Update `prev = 7`

**Total moves**: 1 + 1 + 2 + 2 = 6  
Final array would be: `[1, 2, 3, 4, 5, 7]`

## Brute Force Approach

A naive approach would be to repeatedly scan the array, find duplicates, and increment them until all values are unique. Here's what that might look like:

1. While there are duplicates in the array:
   - For each duplicate value
   - Increment one instance of it by 1
2. Count the total increments

The problem with this approach is efficiency. In the worst case (like `[1, 1, 1, 1, 1]`), we'd need O(n²) operations. For `n = 10^5`, this would be far too slow (10¹⁰ operations).

Even a slightly better brute force would be: for each element, check if it's a duplicate, and if so, keep incrementing it until it's unique. This still has O(n²) worst-case time complexity when many elements are the same value.

## Optimized Approach

The key insight is that **sorting makes the problem tractable**. When the array is sorted, we can process elements left to right, ensuring each element is greater than the previous one. This gives us two main strategies:

**Approach 1: Greedy with Sorting (Most Intuitive)**

1. Sort the array
2. Iterate through the sorted array
3. For each element, if it's not greater than the previous element, increment it to `prev + 1`
4. Track the total increments needed

**Why this works**: By processing in sorted order, we ensure we handle the smallest conflicts first. If we have `[1, 1, 2]`, making the second `1` into `2` creates a new conflict with the existing `2`, which we then resolve by making it `3`. This cascading effect is handled naturally when we process left to right.

**Approach 2: Counting Sort (More Efficient for Certain Constraints)**
If the values have a limited range (like 0 to 10^5), we can use counting:

1. Count frequency of each number
2. For each number, if count > 1, move the extras to the next available slot
3. Track the total moves needed

The counting approach has better time complexity when the value range is limited relative to array size.

## Optimal Solution

Here's the greedy sorting approach, which works well for general cases and is easier to implement correctly:

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n) for processing = O(n log n)
# Space: O(1) if we sort in-place, O(n) if we need to preserve original
def minIncrementForUnique(nums):
    """
    Makes all elements in nums unique with minimum increments.

    Approach:
    1. Sort the array so we can process numbers in order
    2. For each number, if it's not greater than the previous number,
       we need to increment it to prev + 1
    3. Track the total number of increments needed
    """
    if not nums:
        return 0

    # Step 1: Sort the array to process in ascending order
    nums.sort()

    moves = 0
    # prev tracks the last unique value we've seen/created
    prev = nums[0]

    # Step 2: Process each element starting from the second one
    for i in range(1, len(nums)):
        current = nums[i]

        # If current number is not greater than previous unique value,
        # we need to increment it
        if current <= prev:
            # The new value should be prev + 1 to maintain uniqueness
            new_value = prev + 1
            moves += new_value - current
            # Update prev to the new value we just created
            prev = new_value
        else:
            # Current number is already unique, just update prev
            prev = current

    return moves
```

```javascript
// Time: O(n log n) for sorting + O(n) for processing = O(n log n)
// Space: O(1) if we sort in-place, O(n) if we need to preserve original
function minIncrementForUnique(nums) {
  /**
   * Makes all elements in nums unique with minimum increments.
   *
   * Approach:
   * 1. Sort the array so we can process numbers in order
   * 2. For each number, if it's not greater than the previous number,
   *    we need to increment it to prev + 1
   * 3. Track the total number of increments needed
   */
  if (!nums || nums.length === 0) {
    return 0;
  }

  // Step 1: Sort the array to process in ascending order
  nums.sort((a, b) => a - b);

  let moves = 0;
  // prev tracks the last unique value we've seen/created
  let prev = nums[0];

  // Step 2: Process each element starting from the second one
  for (let i = 1; i < nums.length; i++) {
    const current = nums[i];

    // If current number is not greater than previous unique value,
    // we need to increment it
    if (current <= prev) {
      // The new value should be prev + 1 to maintain uniqueness
      const newValue = prev + 1;
      moves += newValue - current;
      // Update prev to the new value we just created
      prev = newValue;
    } else {
      // Current number is already unique, just update prev
      prev = current;
    }
  }

  return moves;
}
```

```java
// Time: O(n log n) for sorting + O(n) for processing = O(n log n)
// Space: O(1) if we sort in-place, O(n) if we need to preserve original
class Solution {
    public int minIncrementForUnique(int[] nums) {
        /**
         * Makes all elements in nums unique with minimum increments.
         *
         * Approach:
         * 1. Sort the array so we can process numbers in order
         * 2. For each number, if it's not greater than the previous number,
         *    we need to increment it to prev + 1
         * 3. Track the total number of increments needed
         */
        if (nums == null || nums.length == 0) {
            return 0;
        }

        // Step 1: Sort the array to process in ascending order
        Arrays.sort(nums);

        int moves = 0;
        // prev tracks the last unique value we've seen/created
        int prev = nums[0];

        // Step 2: Process each element starting from the second one
        for (int i = 1; i < nums.length; i++) {
            int current = nums[i];

            // If current number is not greater than previous unique value,
            // we need to increment it
            if (current <= prev) {
                // The new value should be prev + 1 to maintain uniqueness
                int newValue = prev + 1;
                moves += newValue - current;
                // Update prev to the new value we just created
                prev = newValue;
            } else {
                // Current number is already unique, just update prev
                prev = current;
            }
        }

        return moves;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- The single pass through the array takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(1) or O(n)**

- If we can sort the input array in-place: O(1) extra space
- If we need to preserve the original array: O(n) for a copy
- The algorithm itself uses only a few variables (moves, prev, i)

For the counting sort alternative (not shown above), if the value range is limited to `m`:

- Time: O(n + m) for counting and processing
- Space: O(m) for the frequency array
- This can be better than O(n log n) when m < n log n

## Common Mistakes

1. **Forgetting to sort the array first**  
   Without sorting, you can't guarantee optimal increments. Example: `[3, 2, 1, 2, 1]` processed unsorted might give suboptimal results.

2. **Using strict inequality (`<`) instead of (`<=`)**  
   If you check `if current < prev`, you'll miss the case where `current == prev`, which also needs incrementing. Always use `<=`.

3. **Not updating `prev` correctly after incrementing**  
   After incrementing a number to `prev + 1`, you must update `prev` to this new value, not to the original `current` value.

4. **Integer overflow with large arrays**  
   While the problem states the answer fits in 32-bit integer, intermediate calculations could overflow if you're not careful. Use appropriate data types (long in Java for intermediate sums if needed).

5. **Trying to modify and read from the same array simultaneously**  
   If you're incrementing `nums[i]` in place and using it later, be careful about order of operations. Better to track `prev` separately.

## When You'll See This Pattern

This "sort and adjust" pattern appears in many array optimization problems:

1. **Minimum Operations to Make the Array Increasing (LeetCode 1827)**  
   Similar concept: ensure each element is strictly greater than the previous one with minimum increments.

2. **Array Partition (LeetCode 561)**  
   Requires sorting to maximize the sum of min pairs.

3. **Assign Cookies (LeetCode 455)**  
   Greedy approach with sorting to match children with cookies.

4. **Meeting Rooms II (LeetCode 253)**  
   Uses sorting and tracking of "next available" resources, similar to tracking `prev` in our solution.

The core pattern is: **when you need to process elements in some optimal order, sorting often reveals the structure needed for a greedy solution.**

## Key Takeaways

1. **Sorting enables greedy solutions** for many array optimization problems. When you see "minimum operations" or "make array satisfy some property," consider if sorting helps.

2. **Process duplicates by making them follow the last unique value** - this simple rule (`new_value = prev + 1`) works because we're processing in sorted order.

3. **Track state between elements** - the `prev` variable here is crucial. Many array problems benefit from tracking some state (maximum so far, minimum so far, last value, etc.) as you iterate.

4. **Test edge cases**: empty array, all duplicates, already unique array, large values, and the minimum/maximum constraint cases.

Remember: The greedy approach works here because making the smallest possible increment at each step (to `prev + 1`) doesn't prevent optimal future choices - this is the hallmark of a valid greedy strategy.

Related problems: [Minimum Operations to Make the Array Increasing](/problem/minimum-operations-to-make-the-array-increasing), [Maximum Product After K Increments](/problem/maximum-product-after-k-increments), [Minimum Number of Operations to Make Elements in Array Distinct](/problem/minimum-number-of-operations-to-make-elements-in-array-distinct)
