---
title: "How to Solve Two Sum II - Input Array Is Sorted — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Two Sum II - Input Array Is Sorted. Medium difficulty, 64.6% acceptance rate. Topics: Array, Two Pointers, Binary Search."
date: "2026-03-23"
category: "dsa-patterns"
tags: ["two-sum-ii-input-array-is-sorted", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Two Sum II - Input Array Is Sorted

This problem asks us to find two numbers in a **sorted** array that add up to a specific target. The twist is that the array is 1-indexed (indices start at 1, not 0), and we must return the indices accordingly. What makes this interesting is that the sorted property allows for a more efficient solution than the classic hash map approach from the original Two Sum problem.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider `numbers = [2, 7, 11, 15]` with `target = 9`.

We'll use two pointers: `left` starting at the smallest number (index 0, value 2) and `right` starting at the largest number (index 3, value 15).

**Step 1:** Check sum = 2 + 15 = 17

- 17 > target 9, so the sum is too large
- To reduce the sum, we move the `right` pointer leftward (to index 2, value 11)

**Step 2:** Check sum = 2 + 11 = 13

- 13 > target 9, still too large
- Move `right` pointer leftward again (to index 1, value 7)

**Step 3:** Check sum = 2 + 7 = 9

- Perfect match! Found our pair
- Return indices [1, 2] (adding 1 to convert from 0-indexed to 1-indexed)

The key insight: because the array is sorted, moving the left pointer rightward increases the sum, while moving the right pointer leftward decreases it. This lets us systematically search for the correct pair.

## Brute Force Approach

The most straightforward solution is to check every possible pair of numbers:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def twoSumBruteForce(numbers, target):
    n = len(numbers)
    # Check every possible pair
    for i in range(n):
        for j in range(i + 1, n):
            if numbers[i] + numbers[j] == target:
                # Convert to 1-indexed
                return [i + 1, j + 1]
    # Problem guarantees a solution exists, so we won't reach here
    return [-1, -1]
```

```javascript
// Time: O(n²) | Space: O(1)
function twoSumBruteForce(numbers, target) {
  const n = numbers.length;
  // Check every possible pair
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (numbers[i] + numbers[j] === target) {
        // Convert to 1-indexed
        return [i + 1, j + 1];
      }
    }
  }
  // Problem guarantees a solution exists
  return [-1, -1];
}
```

```java
// Time: O(n²) | Space: O(1)
public int[] twoSumBruteForce(int[] numbers, int target) {
    int n = numbers.length;
    // Check every possible pair
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (numbers[i] + numbers[j] == target) {
                // Convert to 1-indexed
                return new int[]{i + 1, j + 1};
            }
        }
    }
    // Problem guarantees a solution exists
    return new int[]{-1, -1};
}
```

</div>

**Why this isn't optimal:** With nested loops, this runs in O(n²) time. For an array of 10,000 elements, that's 100 million operations — far too slow for interview standards. The sorted property is completely ignored here.

## Optimized Approach

The key insight comes from recognizing that the array is **sorted in non-decreasing order**. This allows us to use the **two-pointer technique**:

1. Start with one pointer at the beginning (smallest values) and one at the end (largest values)
2. Calculate the current sum
3. If the sum equals the target, we've found our answer
4. If the sum is less than the target, we need a larger sum → move the left pointer rightward
5. If the sum is greater than the target, we need a smaller sum → move the right pointer leftward

This works because:

- Moving left pointer rightward increases the sum (we're picking a larger number)
- Moving right pointer leftward decreases the sum (we're picking a smaller number)
- Since the array is sorted, we can guarantee we won't miss the solution

**Alternative approach:** We could also use binary search for each element to find its complement. For each number `numbers[i]`, we could binary search for `target - numbers[i]` in the rest of the array. This would be O(n log n) — better than brute force but worse than the two-pointer O(n) solution.

## Optimal Solution

Here's the complete two-pointer solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def twoSum(numbers, target):
    """
    Find two numbers in a sorted array that sum to target.
    Returns 1-indexed positions of the two numbers.
    """
    # Initialize two pointers: left at start, right at end
    left, right = 0, len(numbers) - 1

    # Continue until pointers meet
    while left < right:
        # Calculate current sum
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            # Found the pair! Convert to 1-indexed and return
            return [left + 1, right + 1]
        elif current_sum < target:
            # Sum is too small, need a larger number
            # Move left pointer rightward to increase sum
            left += 1
        else:
            # Sum is too large, need a smaller number
            # Move right pointer leftward to decrease sum
            right -= 1

    # Problem guarantees exactly one solution exists,
    # so we'll always find it before pointers cross
    return [-1, -1]
```

```javascript
// Time: O(n) | Space: O(1)
function twoSum(numbers, target) {
  /**
   * Find two numbers in a sorted array that sum to target.
   * Returns 1-indexed positions of the two numbers.
   */
  // Initialize two pointers: left at start, right at end
  let left = 0;
  let right = numbers.length - 1;

  // Continue until pointers meet
  while (left < right) {
    // Calculate current sum
    const currentSum = numbers[left] + numbers[right];

    if (currentSum === target) {
      // Found the pair! Convert to 1-indexed and return
      return [left + 1, right + 1];
    } else if (currentSum < target) {
      // Sum is too small, need a larger number
      // Move left pointer rightward to increase sum
      left++;
    } else {
      // Sum is too large, need a smaller number
      // Move right pointer leftward to decrease sum
      right--;
    }
  }

  // Problem guarantees exactly one solution exists
  return [-1, -1];
}
```

```java
// Time: O(n) | Space: O(1)
public int[] twoSum(int[] numbers, int target) {
    /**
     * Find two numbers in a sorted array that sum to target.
     * Returns 1-indexed positions of the two numbers.
     */
    // Initialize two pointers: left at start, right at end
    int left = 0;
    int right = numbers.length - 1;

    // Continue until pointers meet
    while (left < right) {
        // Calculate current sum
        int currentSum = numbers[left] + numbers[right];

        if (currentSum == target) {
            // Found the pair! Convert to 1-indexed and return
            return new int[]{left + 1, right + 1};
        } else if (currentSum < target) {
            // Sum is too small, need a larger number
            // Move left pointer rightward to increase sum
            left++;
        } else {
            // Sum is too large, need a smaller number
            // Move right pointer leftward to decrease sum
            right--;
        }
    }

    // Problem guarantees exactly one solution exists
    return new int[]{-1, -1};
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case, we might need to check every element once (when the solution is in the middle)
- Each iteration of the while loop processes one pair and moves at least one pointer
- With n elements, we do at most n-1 iterations

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the two pointers
- No additional data structures are needed

## Common Mistakes

1. **Forgetting the 1-indexed requirement:** The problem states indices start at 1, but arrays in most languages are 0-indexed. Always add 1 to your indices before returning.
2. **Using hash map unnecessarily:** While a hash map works for the original Two Sum (O(n) time, O(n) space), it ignores the sorted property. The two-pointer approach achieves O(n) time with O(1) space.

3. **Incorrect pointer movement logic:** Some candidates get confused about which pointer to move when:
   - If sum < target → move left pointer right (need larger number)
   - If sum > target → move right pointer left (need smaller number)
   - Moving the wrong pointer could skip over the solution

4. **Not handling the while loop condition correctly:** The loop should continue while `left < right`, not `left <= right`. When pointers are equal, we'd be using the same element twice, which isn't allowed.

## When You'll See This Pattern

The two-pointer technique on sorted arrays appears in many problems:

1. **Container With Most Water (LeetCode #11):** Uses two pointers to find maximum area, moving the pointer with the smaller height.
2. **3Sum (LeetCode #15):** After fixing one number, the remaining problem reduces to finding two numbers that sum to a target in a sorted subarray.

3. **Trapping Rain Water (LeetCode #42):** Can be solved with two pointers moving inward, tracking left and right maximums.

4. **Valid Palindrome (LeetCode #125):** Uses two pointers to compare characters from both ends.

The pattern to recognize: when you have a sorted array and need to find pairs meeting some condition (sum, difference, etc.), two pointers is often the optimal approach.

## Key Takeaways

1. **Sorted arrays enable two-pointer solutions:** When input is sorted, you can often solve problems in O(n) time with O(1) space using two pointers, avoiding the need for hash maps.

2. **Pointer movement depends on comparison with target:** Move left pointer right to increase values, right pointer left to decrease values. The exact logic depends on whether you need larger or smaller sums.

3. **Convert indexing requirements carefully:** Always check whether the problem uses 0-indexed or 1-indexed positions and adjust your return values accordingly.

Related problems: [Two Sum](/problem/two-sum), [Two Sum IV - Input is a BST](/problem/two-sum-iv-input-is-a-bst), [Two Sum Less Than K](/problem/two-sum-less-than-k)
