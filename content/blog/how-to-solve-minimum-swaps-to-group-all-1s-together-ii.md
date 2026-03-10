---
title: "How to Solve Minimum Swaps to Group All 1's Together II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Swaps to Group All 1's Together II. Medium difficulty, 65.6% acceptance rate. Topics: Array, Sliding Window."
date: "2026-05-01"
category: "dsa-patterns"
tags: ["minimum-swaps-to-group-all-1s-together-ii", "array", "sliding-window", "medium"]
---

# How to Solve Minimum Swaps to Group All 1's Together II

This problem asks us to find the minimum number of swaps needed to group all 1's together in a circular binary array. The "circular" aspect makes this tricky because the optimal grouping might wrap around the end of the array to the beginning. For example, in `[1,0,1,0,1]`, the best grouping could be `[1,1,1,0,0]` which requires wrapping the array.

## Visual Walkthrough

Let's trace through `nums = [0,1,0,1,1,0,0]` step by step:

1. **Count total ones**: There are 4 ones in the array. This tells us our target window size.

2. **Circular array trick**: To handle the circular nature, we can duplicate the array: `[0,1,0,1,1,0,0,0,1,0,1,1,0,0]`. Now any contiguous segment of length 4 in this duplicated array represents a possible grouping in the circular original.

3. **Sliding window approach**: We'll slide a window of size 4 across the duplicated array:
   - Window 1: `[0,1,0,1]` has 2 ones → needs 2 swaps (swap zeros with ones outside)
   - Window 2: `[1,0,1,1]` has 3 ones → needs 1 swap
   - Window 3: `[0,1,1,0]` has 2 ones → needs 2 swaps
   - Window 4: `[1,1,0,0]` has 2 ones → needs 2 swaps
   - Window 5: `[1,0,0,0]` has 1 one → needs 3 swaps
   - Window 6: `[0,0,0,1]` has 1 one → needs 3 swaps
   - Window 7: `[0,0,1,0]` has 1 one → needs 3 swaps

4. **Minimum swaps**: The minimum is 1 swap, which corresponds to grouping the ones as `[1,1,1,0,0,0,1]` (wrapping around).

The key insight: For a window of size `totalOnes`, the number of swaps needed equals `totalOnes - onesInWindow`, because we need to replace all zeros in the window with ones from outside.

## Brute Force Approach

A naive approach would be to consider every possible starting position for our group of ones in the circular array, then calculate the swaps needed for each. For each starting position, we'd need to:

1. Look at the next `totalOnes` elements (wrapping around)
2. Count how many zeros are in that window
3. The number of zeros equals the number of swaps needed

This would take O(n²) time since for each of n starting positions, we examine up to n elements. For n up to 10⁵, this is far too slow.

```python
# Brute force - too slow for large inputs
def minSwaps(nums):
    n = len(nums)
    totalOnes = sum(nums)

    if totalOnes == 0:
        return 0

    minSwaps = float('inf')

    # Try every starting position
    for start in range(n):
        zeros = 0
        # Check window of size totalOnes starting at 'start'
        for i in range(totalOnes):
            idx = (start + i) % n  # Wrap around
            if nums[idx] == 0:
                zeros += 1
        minSwaps = min(minSwaps, zeros)

    return minSwaps
```

The problem with this approach is the O(n²) time complexity. We're doing redundant work by recounting zeros for overlapping windows.

## Optimized Approach

The key optimization is using a **sliding window** technique on a duplicated array. Here's the step-by-step reasoning:

1. **Fixed window size**: We know exactly how many 1's we need to group together - it's the total count of 1's in the array. Let's call this `k`.

2. **Circular handling**: Instead of dealing with modulo arithmetic, we can append the array to itself. Now any contiguous segment of length `k` in this 2n-length array corresponds to a possible grouping in the circular array.

3. **Sliding window optimization**: We maintain a running count of ones in the current window. When we slide the window right by one:
   - Subtract the element leaving the window
   - Add the new element entering the window
   - This gives us O(1) updates instead of O(k) recounting

4. **Swaps calculation**: For a window with `onesCount` ones, we need `k - onesCount` swaps (we need to replace all zeros in the window with ones from outside).

5. **Find minimum**: Track the minimum `k - onesCount` across all windows.

The time complexity drops from O(n²) to O(n) with this approach.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the duplicated array
def minSwaps(nums):
    """
    Returns minimum swaps to group all 1's together in a circular binary array.

    Approach:
    1. Count total ones (k) - this is our target window size
    2. Duplicate array to handle circular nature
    3. Use sliding window of size k to find window with maximum ones
    4. Minimum swaps = k - maxOnesInWindow
    """
    n = len(nums)

    # Step 1: Count total ones
    totalOnes = sum(nums)

    # Edge case: if no ones or all ones, no swaps needed
    if totalOnes == 0 or totalOnes == n:
        return 0

    # Step 2: Duplicate array to handle circular nature
    # This allows us to consider windows that wrap around
    duplicated = nums + nums

    # Step 3: Initialize sliding window
    # Count ones in first window of size totalOnes
    onesInWindow = sum(duplicated[:totalOnes])
    maxOnes = onesInWindow  # Track maximum ones found in any window

    # Step 4: Slide window across first n positions
    # (Windows starting beyond n would be duplicates)
    for i in range(totalOnes, n + totalOnes):
        # Remove leftmost element of previous window
        onesInWindow -= duplicated[i - totalOnes]
        # Add new rightmost element
        onesInWindow += duplicated[i]
        # Update maximum ones found
        maxOnes = max(maxOnes, onesInWindow)

    # Step 5: Minimum swaps needed
    # Each zero in the optimal window needs to be swapped with a one from outside
    return totalOnes - maxOnes
```

```javascript
// Time: O(n) | Space: O(n) for the duplicated array
/**
 * Returns minimum swaps to group all 1's together in a circular binary array.
 *
 * Approach:
 * 1. Count total ones (k) - this is our target window size
 * 2. Duplicate array to handle circular nature
 * 3. Use sliding window of size k to find window with maximum ones
 * 4. Minimum swaps = k - maxOnesInWindow
 */
function minSwaps(nums) {
  const n = nums.length;

  // Step 1: Count total ones
  let totalOnes = 0;
  for (let num of nums) {
    totalOnes += num;
  }

  // Edge case: if no ones or all ones, no swaps needed
  if (totalOnes === 0 || totalOnes === n) {
    return 0;
  }

  // Step 2: Duplicate array to handle circular nature
  const duplicated = [...nums, ...nums];

  // Step 3: Initialize sliding window
  // Count ones in first window of size totalOnes
  let onesInWindow = 0;
  for (let i = 0; i < totalOnes; i++) {
    onesInWindow += duplicated[i];
  }
  let maxOnes = onesInWindow; // Track maximum ones found in any window

  // Step 4: Slide window across first n positions
  // (Windows starting beyond n would be duplicates)
  for (let i = totalOnes; i < n + totalOnes; i++) {
    // Remove leftmost element of previous window
    onesInWindow -= duplicated[i - totalOnes];
    // Add new rightmost element
    onesInWindow += duplicated[i];
    // Update maximum ones found
    maxOnes = Math.max(maxOnes, onesInWindow);
  }

  // Step 5: Minimum swaps needed
  // Each zero in the optimal window needs to be swapped with a one from outside
  return totalOnes - maxOnes;
}
```

```java
// Time: O(n) | Space: O(n) for the duplicated array
class Solution {
    /**
     * Returns minimum swaps to group all 1's together in a circular binary array.
     *
     * Approach:
     * 1. Count total ones (k) - this is our target window size
     * 2. Duplicate array to handle circular nature
     * 3. Use sliding window of size k to find window with maximum ones
     * 4. Minimum swaps = k - maxOnesInWindow
     */
    public int minSwaps(int[] nums) {
        int n = nums.length;

        // Step 1: Count total ones
        int totalOnes = 0;
        for (int num : nums) {
            totalOnes += num;
        }

        // Edge case: if no ones or all ones, no swaps needed
        if (totalOnes == 0 || totalOnes == n) {
            return 0;
        }

        // Step 2: Duplicate array to handle circular nature
        int[] duplicated = new int[2 * n];
        for (int i = 0; i < n; i++) {
            duplicated[i] = nums[i];
            duplicated[i + n] = nums[i];
        }

        // Step 3: Initialize sliding window
        // Count ones in first window of size totalOnes
        int onesInWindow = 0;
        for (int i = 0; i < totalOnes; i++) {
            onesInWindow += duplicated[i];
        }
        int maxOnes = onesInWindow; // Track maximum ones found in any window

        // Step 4: Slide window across first n positions
        // (Windows starting beyond n would be duplicates)
        for (int i = totalOnes; i < n + totalOnes; i++) {
            // Remove leftmost element of previous window
            onesInWindow -= duplicated[i - totalOnes];
            // Add new rightmost element
            onesInWindow += duplicated[i];
            // Update maximum ones found
            maxOnes = Math.max(maxOnes, onesInWindow);
        }

        // Step 5: Minimum swaps needed
        // Each zero in the optimal window needs to be swapped with a one from outside
        return totalOnes - maxOnes;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting total ones: O(n)
- Creating duplicated array: O(n)
- Initial window sum: O(k) where k ≤ n
- Sliding window across n positions: O(n)
- Total: O(n) since all operations are linear

**Space Complexity: O(n)**

- We create a duplicated array of size 2n → O(n)
- Could be optimized to O(1) by using modulo arithmetic instead of duplicating, but the duplicated array makes the logic clearer

## Common Mistakes

1. **Forgetting the circular aspect**: Candidates often solve the non-circular version correctly but forget that the optimal grouping might wrap around. Always test with cases like `[1,0,1,0,1]` where the answer is 1, not 2.

2. **Incorrect window boundaries**: When sliding the window on the duplicated array, we only need to check the first n starting positions. Windows starting at position n or beyond are duplicates of earlier windows. Checking all 2n positions wastes time and might cause confusion.

3. **Off-by-one errors in sliding window**: When updating `onesInWindow`, remember to:
   - Subtract the element at `i - totalOnes` (the one leaving)
   - Add the element at `i` (the one entering)
   - Common mistake: using `i - totalOnes - 1` or `i + 1`

4. **Not handling edge cases**: Always check for:
   - All zeros (`totalOnes == 0`) → 0 swaps needed
   - All ones (`totalOnes == n`) → 0 swaps needed
   - Single element arrays → 0 swaps needed

## When You'll See This Pattern

The "sliding window on circular array" pattern appears in several problems:

1. **Maximum Sum Circular Subarray (LeetCode 918)**: Find maximum sum subarray in circular array. Similar technique of duplicating array or considering two cases.

2. **Minimum Swaps to Group All 1's Together (LeetCode 1151)**: The non-circular version of this exact problem. Master this first before tackling the circular version.

3. **Fruit Into Baskets (LeetCode 904)**: While not circular, it uses similar sliding window technique with fixed constraints.

4. **Permutation in String (LeetCode 567)**: Check if one string contains a permutation of another using fixed-size sliding window.

The core pattern is: when you need to examine all contiguous segments of fixed size in a circular context, duplicate the array and use sliding window.

## Key Takeaways

1. **Circular array trick**: When dealing with circular arrays, duplicating the array (`arr + arr`) often simplifies the problem by letting you use standard linear techniques.

2. **Fixed-size sliding window**: When the window size is known in advance (here, it's the count of 1's), sliding window gives O(n) solution vs O(n²) brute force.

3. **Swap calculation insight**: The key formula `swaps = totalOnes - onesInWindow` comes from realizing that each zero in the target window needs to be replaced with a one from outside the window.

Remember: For grouping problems, first determine what you're grouping (1's here) and how many there are (window size). Then find the window with maximum elements of that type.

Related problems: [Minimum Swaps to Group All 1's Together](/problem/minimum-swaps-to-group-all-1s-together), [Time Needed to Rearrange a Binary String](/problem/time-needed-to-rearrange-a-binary-string)
