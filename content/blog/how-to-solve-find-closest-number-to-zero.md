---
title: "How to Solve Find Closest Number to Zero — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Closest Number to Zero. Easy difficulty, 47.7% acceptance rate. Topics: Array."
date: "2028-09-14"
category: "dsa-patterns"
tags: ["find-closest-number-to-zero", "array", "easy"]
---

## How to Solve Find Closest Number to Zero

This problem asks us to find the integer in an array that is numerically closest to zero. The twist is that when two numbers are equally close to zero (like -2 and 2), we must return the larger one (which would be 2). While this seems straightforward, the tie-breaking condition and handling of negative numbers make it a good test of careful thinking and attention to detail.

## Visual Walkthrough

Let's trace through an example: `nums = [-4, -2, 1, 4, 8]`

We need to find the number closest to 0. Let's think about how we'd do this manually:

1. **First element: -4**  
   Distance from 0: `|-4| = 4`  
   Current closest: -4 (distance 4)

2. **Second element: -2**  
   Distance from 0: `|-2| = 2`  
   2 < 4, so -2 is closer than -4  
   Current closest: -2 (distance 2)

3. **Third element: 1**  
   Distance from 0: `|1| = 1`  
   1 < 2, so 1 is closer than -2  
   Current closest: 1 (distance 1)

4. **Fourth element: 4**  
   Distance from 0: `|4| = 4`  
   4 > 1, so 4 is farther than 1  
   Current closest remains: 1

5. **Fifth element: 8**  
   Distance from 0: `|8| = 8`  
   8 > 1, so 8 is farther than 1  
   Final answer: 1

Now let's try an example with ties: `nums = [-2, 2, -3, 1]`

1. **First element: -2**  
   Distance: 2  
   Current closest: -2

2. **Second element: 2**  
   Distance: 2 (same as -2)  
   Tie! We need the larger value: 2 > -2  
   Current closest: 2

3. **Third element: -3**  
   Distance: 3  
   3 > 2, so farther  
   Current closest remains: 2

4. **Fourth element: 1**  
   Distance: 1  
   1 < 2, so closer  
   Final answer: 1

The key insight is that we need to track both the distance (absolute value) AND the actual value for tie-breaking.

## Brute Force Approach

A brute force approach would be to calculate the distance of every element to zero, then find the minimum distance, and finally handle ties. While this approach would work, it's not the most efficient way to think about the problem since we can solve it in a single pass.

However, let's consider what a naive implementation might look like:

1. Create a list of tuples `(distance, value)` for each element
2. Sort this list by distance first, then by value descending (for tie-breaking)
3. Return the value from the first element

This approach would take O(n log n) time due to sorting, when we can solve it in O(n) time with a single pass. The brute force isn't "wrong" per se, but it's suboptimal and shows a lack of optimization thinking that interviewers look for.

## Optimal Solution

The optimal solution uses a single pass through the array, keeping track of the best candidate found so far. For each number, we compare:

1. If its absolute value is less than our current best's absolute value → it's closer, so update
2. If its absolute value equals our current best's absolute value → tie! Choose the larger number

We initialize our best candidate with the first element, then iterate through the rest.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findClosestNumber(nums):
    """
    Find the number in nums closest to zero.
    If two numbers are equally close, return the larger one.
    """
    # Start with the first element as our best candidate
    closest = nums[0]

    # Iterate through all elements starting from the second one
    for num in nums[1:]:
        # Get absolute values for comparison
        abs_num = abs(num)
        abs_closest = abs(closest)

        # Case 1: Current number is strictly closer to zero
        if abs_num < abs_closest:
            closest = num

        # Case 2: Equal distance but current number is larger (tie-breaking)
        elif abs_num == abs_closest and num > closest:
            closest = num

    return closest
```

```javascript
// Time: O(n) | Space: O(1)
function findClosestNumber(nums) {
  /**
   * Find the number in nums closest to zero.
   * If two numbers are equally close, return the larger one.
   */
  // Start with the first element as our best candidate
  let closest = nums[0];

  // Iterate through all elements starting from the second one
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    // Get absolute values for comparison
    const absNum = Math.abs(num);
    const absClosest = Math.abs(closest);

    // Case 1: Current number is strictly closer to zero
    if (absNum < absClosest) {
      closest = num;
    }
    // Case 2: Equal distance but current number is larger (tie-breaking)
    else if (absNum === absClosest && num > closest) {
      closest = num;
    }
  }

  return closest;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int findClosestNumber(int[] nums) {
        /**
         * Find the number in nums closest to zero.
         * If two numbers are equally close, return the larger one.
         */
        // Start with the first element as our best candidate
        int closest = nums[0];

        // Iterate through all elements starting from the second one
        for (int i = 1; i < nums.length; i++) {
            int num = nums[i];
            // Get absolute values for comparison
            int absNum = Math.abs(num);
            int absClosest = Math.abs(closest);

            // Case 1: Current number is strictly closer to zero
            if (absNum < absClosest) {
                closest = num;
            }
            // Case 2: Equal distance but current number is larger (tie-breaking)
            else if (absNum == absClosest && num > closest) {
                closest = num;
            }
        }

        return closest;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
We make a single pass through the array, performing constant-time operations for each element. The loop runs n times, where n is the length of the input array.

**Space Complexity: O(1)**  
We only use a constant amount of extra space (the `closest` variable and loop counter). No additional data structures that grow with input size are used.

## Common Mistakes

1. **Forgetting the tie-breaking rule**  
   The most common mistake is returning the first element when distances are equal, rather than the larger value. Always remember: when `abs(a) == abs(b)`, return `max(a, b)`.

2. **Incorrect absolute value comparison**  
   Some candidates compare `abs(num) < abs(closest)` but forget that `closest` might be negative. We need to compare absolute values, not the actual values.

3. **Edge case: single element array**  
   The solution handles this correctly by initializing `closest` to `nums[0]` and starting the loop from index 1. If the array has only one element, the loop doesn't execute, and we return that element.

4. **Using Integer.MAX_VALUE or similar as initial value**  
   While this might seem clever, it's unnecessary and can cause issues if the array contains values close to `Integer.MAX_VALUE`. Initializing with the first element is simpler and correct.

## When You'll See This Pattern

This "single pass with tracking" pattern appears in many array problems:

1. **Find Minimum/Maximum in Array** - Similar structure but simpler (no absolute value or tie-breaking)
2. **Find the Duplicate Number** - Some solutions use a single pass with tracking
3. **Majority Element** - The Boyer-Moore algorithm uses a similar single-pass approach
4. **Best Time to Buy and Sell Stock** - Track minimum price while iterating

The core pattern is: iterate once through the data, maintaining some "best so far" state, and update it based on conditions checked at each step.

## Key Takeaways

1. **Single-pass solutions are often optimal for array problems** - When you can determine the answer by looking at each element once, you've found an O(n) solution.

2. **Pay attention to tie-breaking conditions** - Interview problems often include subtle requirements like "return the larger value" or "return the earlier index" when values are equal.

3. **Initialize with actual data, not artificial values** - Starting with `nums[0]` is cleaner and handles edge cases better than using sentinel values like `Integer.MAX_VALUE`.

4. **Absolute value is key for distance problems** - When measuring distance from zero (or any point), remember that both positive and negative directions matter equally.

Related problems: [Find K Closest Elements](/problem/find-k-closest-elements)
