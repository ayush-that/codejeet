---
title: "How to Solve Longest Subarray With Maximum Bitwise AND — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Subarray With Maximum Bitwise AND. Medium difficulty, 65.4% acceptance rate. Topics: Array, Bit Manipulation, Brainteaser."
date: "2028-05-03"
category: "dsa-patterns"
tags:
  [
    "longest-subarray-with-maximum-bitwise-and",
    "array",
    "bit-manipulation",
    "brainteaser",
    "medium",
  ]
---

# How to Solve Longest Subarray With Maximum Bitwise AND

This problem asks us to find the length of the longest subarray whose bitwise AND equals the maximum possible AND value of any subarray in the array. What makes this problem interesting is that bitwise AND has a unique property: it can only stay the same or decrease as you include more elements in a subarray. This means the maximum AND value is simply the maximum element in the array, and we're essentially looking for the longest contiguous sequence of that maximum value.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 3, 2, 1]`

**Step 1: Find the maximum element**

- The maximum value in the array is `3`
- This is our target AND value `k`, since AND can only decrease or stay the same, and the maximum element alone gives us AND = itself

**Step 2: Find longest contiguous sequence of maximum value**

- Look for consecutive `3`s in the array:
  - Position 2: `3` (start of first sequence)
  - Position 3: `3` (continues)
  - That's 2 consecutive `3`s
- No other `3`s appear consecutively
- Longest length = 2

**Another example: `nums = [1, 2, 3, 4, 3, 2, 1]`**

- Maximum value is `4`
- Only one `4` appears in the array
- Longest contiguous sequence of `4` = 1

The key insight: For any subarray to have AND equal to the maximum element `m`, ALL elements in that subarray must have all the bits of `m` set. This means every element in the subarray must be at least `m`, but since `m` is the maximum, they must all equal `m`.

## Brute Force Approach

A naive approach would be to check every possible subarray, compute its AND, and track the maximum AND value and the length of subarrays achieving it:

1. Initialize `max_and = 0` and `max_len = 0`
2. For each starting index `i` from 0 to n-1:
   - Initialize `current_and = nums[i]`
   - For each ending index `j` from i to n-1:
     - Update `current_and &= nums[j]`
     - If `current_and > max_and`: update `max_and` and reset `max_len = j-i+1`
     - If `current_and == max_and`: update `max_len = max(max_len, j-i+1)`

This brute force has O(n²) time complexity and O(1) space, which is too slow for n up to 10⁵.

The problem with brute force is it doesn't leverage the mathematical property of bitwise AND: `a & b ≤ min(a, b)`. This means the AND of any subarray containing a number smaller than the maximum will be less than or equal to that smaller number.

## Optimized Approach

The key insight comes from understanding bitwise AND properties:

1. **AND is non-increasing**: For any numbers a and b, `a & b ≤ min(a, b)`
2. **Maximum possible AND**: The maximum AND of any subarray cannot exceed the maximum element in the array
3. **Achieving maximum AND**: To get AND equal to the maximum element `m`, ALL elements in the subarray must have all the bits of `m` set. Since `m` is the maximum, this means all elements must equal `m`.

Therefore:

- Find the maximum element `max_val` in the array
- The maximum AND `k = max_val`
- We need the longest contiguous sequence where all elements equal `max_val`

This reduces the problem to: "Find the longest contiguous sequence of the maximum value in the array."

## Optimal Solution

We can solve this in a single pass:

1. Find the maximum value in the array
2. Traverse the array to find the longest contiguous sequence of that maximum value

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def longestSubarray(nums):
    """
    Finds the length of the longest subarray with maximum bitwise AND.

    The key insight: The maximum AND value is the maximum element in the array,
    and we need the longest contiguous sequence of that maximum value.
    """
    # Step 1: Find the maximum value in the array
    # This is our target AND value since AND can only decrease
    max_val = max(nums)

    # Step 2: Find the longest contiguous sequence of max_val
    max_length = 0
    current_length = 0

    for num in nums:
        if num == max_val:
            # Continue the current sequence of max_val
            current_length += 1
            # Update max_length if current sequence is longer
            max_length = max(max_length, current_length)
        else:
            # Reset sequence counter when we encounter a different value
            current_length = 0

    return max_length
```

```javascript
// Time: O(n) | Space: O(1)
function longestSubarray(nums) {
  /**
   * Finds the length of the longest subarray with maximum bitwise AND.
   *
   * Insight: Maximum AND equals the maximum array element,
   * and we need the longest run of that maximum value.
   */

  // Step 1: Find maximum value (our target AND)
  let maxVal = Math.max(...nums);

  // Step 2: Find longest contiguous sequence of maxVal
  let maxLength = 0;
  let currentLength = 0;

  for (let num of nums) {
    if (num === maxVal) {
      // Extend current sequence
      currentLength++;
      // Update max if current sequence is longer
      maxLength = Math.max(maxLength, currentLength);
    } else {
      // Reset sequence when value differs
      currentLength = 0;
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int longestSubarray(int[] nums) {
        /**
         * Returns length of longest subarray with maximum bitwise AND.
         *
         * Key observation: Maximum AND = maximum element value,
         * and we need longest consecutive run of that maximum value.
         */

        // Step 1: Find maximum value in array
        int maxVal = Integer.MIN_VALUE;
        for (int num : nums) {
            if (num > maxVal) {
                maxVal = num;
            }
        }

        // Step 2: Find longest contiguous sequence of maxVal
        int maxLength = 0;
        int currentLength = 0;

        for (int num : nums) {
            if (num == maxVal) {
                // Continue current sequence
                currentLength++;
                // Update maxLength if needed
                if (currentLength > maxLength) {
                    maxLength = currentLength;
                }
            } else {
                // Reset sequence counter
                currentLength = 0;
            }
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array:
  - First pass to find the maximum value: O(n)
  - Second pass to find the longest sequence: O(n)
- In practice, we can combine these into a single pass, but the complexity remains O(n)

**Space Complexity: O(1)**

- We only use a few integer variables regardless of input size
- No additional data structures are needed

## Common Mistakes

1. **Overcomplicating with bit manipulation**: Some candidates try to track bits or use complex bit operations, missing the simple insight that the maximum AND equals the maximum element.

2. **Forgetting AND is non-increasing**: The crucial property `a & b ≤ min(a, b)` means the maximum AND cannot exceed any element in the subarray. If you include an element smaller than the current maximum, the AND drops.

3. **Not handling single-element subarrays**: Remember the problem asks for non-empty subarrays. The minimum answer is always at least 1 if the array has at least one element.

4. **Confusing with bitwise OR problems**: Bitwise OR increases or stays the same when adding elements, while AND decreases or stays the same. Don't apply OR logic to AND problems.

## When You'll See This Pattern

This problem teaches pattern recognition for **monotonic bitwise operations**:

1. **Maximum Subarray AND/OR problems**: Similar problems where you need to find subarrays with certain bitwise properties often rely on monotonicity of the operation.

2. **"Consecutive elements" pattern**: Finding the longest sequence of identical values appears in:
   - [485. Max Consecutive Ones](https://leetcode.com/problems/max-consecutive-ones/) - Almost identical structure
   - [1446. Consecutive Characters](https://leetcode.com/problems/consecutive-characters/) - Same pattern with characters

3. **Problems leveraging operation properties**: Any problem involving AND, OR, GCD, or LCM often uses their mathematical properties (idempotence, commutativity, monotonicity) to simplify.

## Key Takeaways

1. **Understand operation properties**: For bitwise AND, remember it's non-increasing (`a & b ≤ min(a, b)`). This simple property often leads to major simplifications.

2. **Maximum element is key**: When looking for maximum AND of any subarray, the answer is always the maximum array element. The real challenge becomes finding how to achieve this value.

3. **Reduce before solving**: Many coding problems can be reduced to simpler forms. Here, a bit manipulation problem reduces to finding the longest run of identical values.

Related problems: [Number of Different Integers in a String](/problem/number-of-different-integers-in-a-string), [Remove Colored Pieces if Both Neighbors are the Same Color](/problem/remove-colored-pieces-if-both-neighbors-are-the-same-color), [Count Number of Maximum Bitwise-OR Subsets](/problem/count-number-of-maximum-bitwise-or-subsets)
