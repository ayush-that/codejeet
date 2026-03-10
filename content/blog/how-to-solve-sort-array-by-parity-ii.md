---
title: "How to Solve Sort Array By Parity II — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sort Array By Parity II. Easy difficulty, 71.2% acceptance rate. Topics: Array, Two Pointers, Sorting."
date: "2027-10-26"
category: "dsa-patterns"
tags: ["sort-array-by-parity-ii", "array", "two-pointers", "sorting", "easy"]
---

# How to Solve Sort Array By Parity II

You're given an array where exactly half the numbers are even and half are odd. Your task is to rearrange the array so that all even numbers appear at even indices and all odd numbers appear at odd indices. The challenge is that you need to do this efficiently without sorting the entire array, since that would be overkill for this specific requirement.

What makes this problem interesting is that it looks like a sorting problem, but it's actually a clever rearrangement problem. You don't need to sort numbers by value—you just need to separate them by parity and place them in the correct positions.

## Visual Walkthrough

Let's trace through an example: `nums = [4, 2, 5, 7]`

We need to rearrange so that:

- Even indices (0, 2) contain even numbers
- Odd indices (1, 3) contain odd numbers

**Step-by-step with two pointers approach:**

1. Initialize `even_ptr = 0` (points to next even index needing an even number)
2. Initialize `odd_ptr = 1` (points to next odd index needing an odd number)
3. Check `nums[even_ptr] = 4` (even) → correct, move `even_ptr += 2` → `even_ptr = 2`
4. Check `nums[odd_ptr] = 2` (even) → wrong! Should be odd here
5. Check `nums[even_ptr] = 5` (odd) → wrong! Should be even here
6. Swap `nums[even_ptr]` and `nums[odd_ptr]` → array becomes `[4, 5, 2, 7]`
7. Move both pointers: `even_ptr += 2` → `4`, `odd_ptr += 2` → `3`
8. Check `nums[even_ptr] = 2` (even) → correct, move `even_ptr += 2` → `6` (out of bounds)
9. Check `nums[odd_ptr] = 7` (odd) → correct, move `odd_ptr += 2` → `5` (out of bounds)
10. Done! Final array: `[4, 5, 2, 7]`

Notice how we only swap when we find a mismatch: an even number at an odd index or an odd number at an even index.

## Brute Force Approach

A naive approach would be to create two separate lists: one for even numbers and one for odd numbers. Then, you could iterate through the array, placing even numbers at even indices and odd numbers at odd indices.

While this approach works and is straightforward, it requires O(n) extra space for the two lists. The problem doesn't explicitly forbid this, but in an interview, you'd want to show you can do better with an in-place solution.

Here's what the brute force looks like:

```python
def sortArrayByParityII_brute(nums):
    evens = []
    odds = []

    # Separate numbers by parity
    for num in nums:
        if num % 2 == 0:
            evens.append(num)
        else:
            odds.append(num)

    # Reconstruct the array
    result = []
    for i in range(len(nums)):
        if i % 2 == 0:
            result.append(evens[i//2])  # Take from evens
        else:
            result.append(odds[i//2])   # Take from odds

    return result
```

**Why it's suboptimal:** This uses O(n) extra space. While the time complexity is O(n), which is optimal, we can achieve the same result without allocating extra arrays. Interviewers often prefer in-place solutions when possible.

## Optimal Solution

The optimal solution uses two pointers that move in steps of 2, checking for mismatches and swapping when needed. This approach runs in O(n) time and O(1) extra space.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def sortArrayByParityII(nums):
    """
    Rearranges the array so that even numbers are at even indices
    and odd numbers are at odd indices.

    Approach: Use two pointers that move in steps of 2.
    - even_ptr starts at 0 and looks for misplaced even numbers
    - odd_ptr starts at 1 and looks for misplaced odd numbers
    When both pointers find misplaced numbers, swap them.
    """
    n = len(nums)
    even_ptr = 0  # Points to next even index that needs an even number
    odd_ptr = 1   # Points to next odd index that needs an odd number

    # Continue until we've checked all positions
    while even_ptr < n and odd_ptr < n:
        # Check if even_ptr points to an even number (correct placement)
        if nums[even_ptr] % 2 == 0:
            # This position is correct, move to next even index
            even_ptr += 2
        # Check if odd_ptr points to an odd number (correct placement)
        elif nums[odd_ptr] % 2 == 1:
            # This position is correct, move to next odd index
            odd_ptr += 2
        else:
            # We found a mismatch:
            # - even_ptr has an odd number (should be even)
            # - odd_ptr has an even number (should be odd)
            # Swap them to fix both positions
            nums[even_ptr], nums[odd_ptr] = nums[odd_ptr], nums[even_ptr]
            # After swapping, both positions should be correct
            # Move both pointers to check next positions
            even_ptr += 2
            odd_ptr += 2

    return nums
```

```javascript
// Time: O(n) | Space: O(1)
function sortArrayByParityII(nums) {
  /**
   * Rearranges the array so that even numbers are at even indices
   * and odd numbers are at odd indices.
   *
   * Approach: Use two pointers that move in steps of 2.
   * - evenPtr starts at 0 and looks for misplaced even numbers
   * - oddPtr starts at 1 and looks for misplaced odd numbers
   * When both pointers find misplaced numbers, swap them.
   */
  const n = nums.length;
  let evenPtr = 0; // Points to next even index that needs an even number
  let oddPtr = 1; // Points to next odd index that needs an odd number

  // Continue until we've checked all positions
  while (evenPtr < n && oddPtr < n) {
    // Check if evenPtr points to an even number (correct placement)
    if (nums[evenPtr] % 2 === 0) {
      // This position is correct, move to next even index
      evenPtr += 2;
    }
    // Check if oddPtr points to an odd number (correct placement)
    else if (nums[oddPtr] % 2 === 1) {
      // This position is correct, move to next odd index
      oddPtr += 2;
    } else {
      // We found a mismatch:
      // - evenPtr has an odd number (should be even)
      // - oddPtr has an even number (should be odd)
      // Swap them to fix both positions
      [nums[evenPtr], nums[oddPtr]] = [nums[oddPtr], nums[evenPtr]];
      // After swapping, both positions should be correct
      // Move both pointers to check next positions
      evenPtr += 2;
      oddPtr += 2;
    }
  }

  return nums;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int[] sortArrayByParityII(int[] nums) {
        /**
         * Rearranges the array so that even numbers are at even indices
         * and odd numbers are at odd indices.
         *
         * Approach: Use two pointers that move in steps of 2.
         * - evenPtr starts at 0 and looks for misplaced even numbers
         * - oddPtr starts at 1 and looks for misplaced odd numbers
         * When both pointers find misplaced numbers, swap them.
         */
        int n = nums.length;
        int evenPtr = 0;  // Points to next even index that needs an even number
        int oddPtr = 1;   // Points to next odd index that needs an odd number

        // Continue until we've checked all positions
        while (evenPtr < n && oddPtr < n) {
            // Check if evenPtr points to an even number (correct placement)
            if (nums[evenPtr] % 2 == 0) {
                // This position is correct, move to next even index
                evenPtr += 2;
            }
            // Check if oddPtr points to an odd number (correct placement)
            else if (nums[oddPtr] % 2 == 1) {
                // This position is correct, move to next odd index
                oddPtr += 2;
            }
            else {
                // We found a mismatch:
                // - evenPtr has an odd number (should be even)
                // - oddPtr has an even number (should be odd)
                // Swap them to fix both positions
                int temp = nums[evenPtr];
                nums[evenPtr] = nums[oddPtr];
                nums[oddPtr] = temp;
                // After swapping, both positions should be correct
                // Move both pointers to check next positions
                evenPtr += 2;
                oddPtr += 2;
            }
        }

        return nums;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the array once with two pointers
- Each pointer moves through approximately half the array
- In the worst case, we might need to swap at every position, but each element is examined at most once

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the pointers and temporary variables
- The algorithm operates in-place, modifying the input array directly

## Common Mistakes

1. **Forgetting that pointers move in steps of 2**: Some candidates try to move pointers by 1 each time, which leads to unnecessary checks and potential infinite loops. Remember: even indices are 0, 2, 4,... and odd indices are 1, 3, 5,...

2. **Incorrect swap condition**: Swapping should only happen when BOTH pointers point to incorrect values. If you swap when only one pointer is incorrect, you might create new mismatches elsewhere.

3. **Using modulo operator incorrectly with negative numbers**: In some languages, `-3 % 2` might give `-1` instead of `1`. While the problem states all numbers are non-negative, it's good practice to use `num % 2 == 0` for even check and `num % 2 != 0` for odd check to avoid issues.

4. **Not handling the "already correct" case first**: Always check if the current position is already correct before looking for swaps. This makes the logic cleaner and more efficient.

## When You'll See This Pattern

The two-pointer technique with different step sizes appears in several array rearrangement problems:

1. **Sort Array By Parity (Easy)**: Similar concept but simpler—just move all evens to the front. Uses two pointers moving from both ends.

2. **Rearrange Array Elements by Sign (Medium)**: Alternate positive and negative numbers. Uses two pointers to find the next positive/negative number for each position.

3. **Sort Even and Odd Indices Independently (Easy)**: Sort even indices in non-decreasing order and odd indices in non-increasing order. While not exactly the same, it uses the concept of treating even and odd indices separately.

The core pattern is: when you need to rearrange elements based on their position parity (even/odd indices), consider using two pointers that move in steps of 2.

## Key Takeaways

1. **Two pointers with different strides**: When dealing with even/odd index patterns, pointers that move in steps of 2 are often more efficient than single-step traversal.

2. **In-place swapping**: Many array rearrangement problems can be solved in O(1) space by swapping elements directly in the array rather than creating new data structures.

3. **Problem decomposition**: Break the problem into smaller checks: "Is this even number at an even index?" and "Is this odd number at an odd index?" When both answers are "no," a single swap fixes both problems.

Related problems: [Sort Array By Parity](/problem/sort-array-by-parity), [Rearrange Array Elements by Sign](/problem/rearrange-array-elements-by-sign), [Sort Even and Odd Indices Independently](/problem/sort-even-and-odd-indices-independently)
