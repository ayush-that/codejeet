---
title: "How to Solve Remove Duplicates from Sorted Array II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Duplicates from Sorted Array II. Medium difficulty, 64.3% acceptance rate. Topics: Array, Two Pointers."
date: "2026-06-05"
category: "dsa-patterns"
tags: ["remove-duplicates-from-sorted-array-ii", "array", "two-pointers", "medium"]
---

# How to Solve Remove Duplicates from Sorted Array II

This problem asks us to modify a sorted array in-place so that each unique element appears at most twice, while maintaining the relative order of elements. What makes this problem interesting is that it's a variation of the classic two-pointer technique, but with an added twist: we need to track not just unique elements, but also how many times we've seen each one. The "in-place" requirement means we can't simply create a new array—we must work within the given array's constraints.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 1, 1, 2, 2, 3]`.

We want to process this array so that each number appears at most twice. We'll use two pointers:

- `write` pointer: tracks where to place the next valid element
- `read` pointer: scans through the array

**Step-by-step visualization:**

Initial state: `nums = [1, 1, 1, 2, 2, 3]`, `write = 2` (first two elements are always valid)

1. `read = 2`: Compare `nums[2]` (value 1) with `nums[write-2]` (value 1). They're equal, so we've already seen two 1's. Skip this element.
2. `read = 3`: Compare `nums[3]` (value 2) with `nums[write-2]` (value 1). Different! Place `nums[3]` at `nums[write]`, increment `write`. Array becomes `[1, 1, 2, 2, 2, 3]`.
3. `read = 4`: Compare `nums[4]` (value 2) with `nums[write-2]` (value 1). Different! Place `nums[4]` at `nums[write]`, increment `write`. Array becomes `[1, 1, 2, 2, 2, 3]`.
4. `read = 5`: Compare `nums[5]` (value 3) with `nums[write-2]` (value 2). Different! Place `nums[5]` at `nums[write]`, increment `write`. Array becomes `[1, 1, 2, 2, 3, 3]`.

Final result: First 5 elements are `[1, 1, 2, 2, 3]`. Return `write = 5`.

The key insight: we compare the current element with the element two positions before our write pointer. If they're different, we haven't seen two of this element yet.

## Brute Force Approach

A naive approach might be to create a new array, iterate through the original, and copy elements while counting occurrences. However, this violates the "in-place" requirement. Another brute force approach would be to repeatedly shift elements when we find more than two duplicates, but this would be O(n²) time complexity.

Let's consider what a candidate might try first: using extra space.

```python
def removeDuplicatesBruteForce(nums):
    if not nums:
        return 0

    result = []
    count = 1

    for i in range(1, len(nums)):
        if nums[i] == nums[i-1]:
            count += 1
        else:
            count = 1

        if count <= 2:
            result.append(nums[i])

    # Copy back to original array
    for i in range(len(result)):
        nums[i] = result[i]

    return len(result)
```

**Why this isn't optimal:**

- Space complexity is O(n) for the result array
- Requires copying back to the original array
- While it solves the problem conceptually, it doesn't meet the "in-place" requirement efficiently

The problem constraints typically expect O(1) extra space (excluding the output array), so we need a better approach.

## Optimized Approach

The key insight is that we can use the **two-pointer technique** with a clever comparison. Since the array is sorted, duplicates are adjacent. We need to allow at most two of each element, so we compare the current element with the element two positions before our current write position.

**Reasoning step by step:**

1. **Base case**: If the array has 0, 1, or 2 elements, we can return immediately since it already satisfies the condition.

2. **Two-pointer setup**:
   - `write` pointer: tracks where to place the next valid element
   - `read` pointer: scans through the array from left to right

3. **The comparison logic**: For each element at position `read`, compare it with the element at position `write-2`. Why `write-2`? Because `write` represents where we'll place the next valid element, and `write-2` is two positions before that. If `nums[read] != nums[write-2]`, then we haven't placed two of this value yet in our valid section.

4. **Why this works**: Since the array is sorted, if the current element equals the element two positions back in our valid section, we've already placed two of this value. If it's different, we can safely add it.

5. **Edge cases**: The first two elements are always valid, so we can start our `write` pointer at 2.

This approach runs in O(n) time with O(1) extra space, meeting all requirements.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def removeDuplicates(nums):
    """
    Removes duplicates in-place so each element appears at most twice.
    Returns the length of the modified array.
    """
    # If array has 2 or fewer elements, it's already valid
    if len(nums) <= 2:
        return len(nums)

    # write pointer: tracks where to place next valid element
    # start at 2 because first two elements are always valid
    write = 2

    # read pointer: scans through the entire array
    for read in range(2, len(nums)):
        # Compare current element with element two positions before write pointer
        # If they're different, we haven't seen two of this value yet
        if nums[read] != nums[write - 2]:
            # Place current element at write position
            nums[write] = nums[read]
            # Move write pointer forward
            write += 1

    # write pointer now points to first invalid position
    # which equals the length of valid portion
    return write
```

```javascript
// Time: O(n) | Space: O(1)
function removeDuplicates(nums) {
  /**
   * Removes duplicates in-place so each element appears at most twice.
   * Returns the length of the modified array.
   */
  // If array has 2 or fewer elements, it's already valid
  if (nums.length <= 2) {
    return nums.length;
  }

  // write pointer: tracks where to place next valid element
  // start at 2 because first two elements are always valid
  let write = 2;

  // read pointer: scans through the entire array
  for (let read = 2; read < nums.length; read++) {
    // Compare current element with element two positions before write pointer
    // If they're different, we haven't seen two of this value yet
    if (nums[read] !== nums[write - 2]) {
      // Place current element at write position
      nums[write] = nums[read];
      // Move write pointer forward
      write++;
    }
  }

  // write pointer now points to first invalid position
  // which equals the length of valid portion
  return write;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int removeDuplicates(int[] nums) {
        /**
         * Removes duplicates in-place so each element appears at most twice.
         * Returns the length of the modified array.
         */
        // If array has 2 or fewer elements, it's already valid
        if (nums.length <= 2) {
            return nums.length;
        }

        // write pointer: tracks where to place next valid element
        // start at 2 because first two elements are always valid
        int write = 2;

        // read pointer: scans through the entire array
        for (int read = 2; read < nums.length; read++) {
            // Compare current element with element two positions before write pointer
            // If they're different, we haven't seen two of this value yet
            if (nums[read] != nums[write - 2]) {
                // Place current element at write position
                nums[write] = nums[read];
                // Move write pointer forward
                write++;
            }
        }

        // write pointer now points to first invalid position
        // which equals the length of valid portion
        return write;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once with the `read` pointer
- Each iteration performs constant-time operations (comparison and assignment)
- The loop runs n-2 times (or n times if we count the full array), which is O(n)

**Space Complexity: O(1)**

- We use only a constant amount of extra space (the `write` and `read` pointers)
- All modifications are done in-place on the input array
- No additional data structures are created

## Common Mistakes

1. **Starting write pointer at 0 or 1**: The first two elements are always valid, so `write` should start at 2. Starting at 0 or 1 would require special handling for the initial elements.

2. **Comparing with wrong index**: Some candidates compare `nums[read]` with `nums[read-2]` instead of `nums[write-2]`. This doesn't work because `read-2` might be outside our valid section.

3. **Forgetting the base case**: When the array has 0, 1, or 2 elements, we should return immediately. Without this check, accessing `nums[write-2]` would cause an index error for arrays of length 1.

4. **Incorrect return value**: The function should return `write`, not `len(nums)`. `write` represents the length of the valid portion after processing.

## When You'll See This Pattern

The two-pointer technique with a "lookback" comparison appears in several related problems:

1. **Remove Duplicates from Sorted Array (Easy)**: The simpler version where each element appears at most once. The comparison is with `nums[write-1]` instead of `nums[write-2]`.

2. **Move Zeroes (Easy)**: While not about duplicates, it uses a similar two-pointer approach where one pointer tracks where to place non-zero elements.

3. **Remove Element (Easy)**: Another two-pointer problem where you remove all instances of a specific value.

4. **Sort Colors (Medium)**: Uses a three-pointer variation of this technique to partition an array into three sections.

The pattern to recognize: when you need to modify an array in-place while preserving some order constraint, and you can determine validity by looking at nearby elements, consider the two-pointer technique.

## Key Takeaways

1. **Two-pointer technique is powerful for in-place array modifications**: When you need to filter or transform an array without extra space, think about using a write pointer to track where to place valid elements and a read pointer to scan through the array.

2. **The comparison logic depends on the constraint**: For "at most once" duplicates, compare with `write-1`. For "at most twice", compare with `write-2`. For "at most k times", you would compare with `write-k`.

3. **Sorted arrays enable efficient duplicate handling**: The fact that duplicates are adjacent allows us to make decisions by looking at nearby elements only.

4. **Always handle edge cases early**: Check for small arrays (0, 1, or 2 elements) at the beginning to avoid index errors and simplify the main logic.

Related problems: [Remove Duplicates from Sorted Array](/problem/remove-duplicates-from-sorted-array)
