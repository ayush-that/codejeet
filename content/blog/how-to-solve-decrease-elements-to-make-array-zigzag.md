---
title: "How to Solve Decrease Elements To Make Array Zigzag — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Decrease Elements To Make Array Zigzag. Medium difficulty, 49.0% acceptance rate. Topics: Array, Greedy."
date: "2029-08-06"
category: "dsa-patterns"
tags: ["decrease-elements-to-make-array-zigzag", "array", "greedy", "medium"]
---

# How to Solve Decrease Elements To Make Array Zigzag

This problem asks us to transform an array into a "zigzag" pattern using the minimum number of moves, where each move decreases an element by 1. The tricky part is that there are two possible valid zigzag patterns to consider, and we need to find which one requires fewer moves. The challenge lies in efficiently calculating the cost for both patterns without actually modifying the array.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [9, 6, 1, 6, 2]`

We need to consider two patterns:

**Pattern 1 (even indices are peaks):** `nums[0] > nums[1] < nums[2] > nums[3] < nums[4] > ...`

- Even indices (0, 2, 4) must be greater than their neighbors
- Odd indices (1, 3) must be smaller than their neighbors

**Pattern 2 (odd indices are peaks):** `nums[0] < nums[1] > nums[2] < nums[3] > nums[4] < ...`

- Even indices (0, 2, 4) must be smaller than their neighbors
- Odd indices (1, 3) must be greater than their neighbors

For our example `[9, 6, 1, 6, 2]`:

**Pattern 1 calculation:**

- Index 0 (9): Needs to be > index 1 (6). 9 > 6 already, so 0 moves.
- Index 1 (6): Needs to be < both neighbors.
  - Compared to left (9): 6 < 9 ✓
  - Compared to right (1): 6 > 1 ✗. Need to decrease 6 to 0 (1-1) = 5 moves.
- Index 2 (1): Needs to be > both neighbors.
  - Compared to left (now 0): 1 > 0 ✓
  - Compared to right (6): 1 > 6 ✗. Need to decrease 6 to 0 (1-1) = 0 moves (right neighbor gets decreased).
- Index 3 (6): Needs to be < both neighbors.
  - Compared to left (1): 6 > 1 ✗. Need to decrease 6 to 0 (1-1) = 5 moves.
  - Compared to right (2): 0 < 2 ✓
- Index 4 (2): Needs to be > left neighbor (0). 2 > 0 ✓
  Total moves for Pattern 1: 0 + 5 + 0 + 5 + 0 = 10

**Pattern 2 calculation:**

- Index 0 (9): Needs to be < index 1 (6). 9 < 6 ✗. Need to decrease 9 to 5 (6-1) = 4 moves.
- Index 1 (6): Needs to be > both neighbors.
  - Compared to left (now 5): 6 > 5 ✓
  - Compared to right (1): 6 > 1 ✓
- Index 2 (1): Needs to be < both neighbors.
  - Compared to left (6): 1 < 6 ✓
  - Compared to right (6): 1 < 6 ✓
- Index 3 (6): Needs to be > both neighbors.
  - Compared to left (1): 6 > 1 ✓
  - Compared to right (2): 6 > 2 ✓
- Index 4 (2): Needs to be < left neighbor (6). 2 < 6 ✓
  Total moves for Pattern 2: 4 + 0 + 0 + 0 + 0 = 4

The minimum is 4 moves, so the answer is 4.

## Brute Force Approach

A naive approach would be to try all possible sequences of moves until we achieve either zigzag pattern, then take the minimum. However, this is clearly infeasible because:

1. We could decrease each element by any amount (up to its value)
2. The number of possible move sequences grows exponentially with array size
3. Even for small arrays, the search space is enormous

Another brute force idea might be to simulate decreasing elements one by one, but this would require backtracking when we realize a different sequence might be better. The key insight is that we don't need to simulate the actual process—we can calculate the required moves directly.

## Optimized Approach

The optimal solution uses a **greedy approach** with **local comparisons**. Here's the key reasoning:

1. **Independence of patterns**: We can calculate the cost for Pattern 1 and Pattern 2 separately, then take the minimum.
2. **Local constraints**: For each element, we only need to consider its relationship with immediate neighbors.
3. **Greedy optimality**: For a given pattern, the minimum moves for each position can be calculated independently:
   - If an element needs to be smaller than a neighbor, we might need to decrease it until it's 1 less than that neighbor
   - If an element needs to be larger than a neighbor, we might need to decrease the neighbor (which affects the next calculation)
4. **No need for actual modification**: We can calculate required moves by comparing current values with what they need to be, without actually changing the array.

For Pattern 1 (even indices as peaks):

- Even indices must be greater than both neighbors (if they exist)
- Odd indices must be smaller than both neighbors (if they exist)

For Pattern 2 (odd indices as peaks), it's the opposite.

The clever part: When checking if `nums[i]` needs to be greater than `nums[i+1]`, we don't actually modify `nums[i+1]` for future calculations. Instead, we calculate how much `nums[i]` would need to be decreased if `nums[i+1]` stays the same, or vice versa. Since we're calculating both patterns separately, we can use the original array values for all comparisons.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def movesToMakeZigzag(nums):
    """
    Calculate minimum moves to make array zigzag.
    Pattern 1: even indices are peaks (greater than neighbors)
    Pattern 2: odd indices are peaks (greater than neighbors)
    """
    n = len(nums)
    pattern1_moves = 0  # Cost for pattern where even indices are peaks
    pattern2_moves = 0  # Cost for pattern where odd indices are peaks

    for i in range(n):
        # Calculate left and right neighbors, use infinity if neighbor doesn't exist
        left = nums[i - 1] if i > 0 else float('inf')
        right = nums[i + 1] if i < n - 1 else float('inf')

        # The target value this element needs to be less than
        # We need to be at least 1 less than the smaller neighbor
        min_neighbor = min(left, right)

        if i % 2 == 0:  # Even index
            # For pattern 1: even indices should be greater than neighbors
            # So we don't need to decrease them for pattern 1
            # For pattern 2: even indices should be smaller than neighbors
            if nums[i] >= min_neighbor:
                # Need to decrease current element to be 1 less than min neighbor
                pattern2_moves += nums[i] - (min_neighbor - 1)
        else:  # Odd index
            # For pattern 1: odd indices should be smaller than neighbors
            if nums[i] >= min_neighbor:
                # Need to decrease current element to be 1 less than min neighbor
                pattern1_moves += nums[i] - (min_neighbor - 1)
            # For pattern 2: odd indices should be greater than neighbors
            # So we don't need to decrease them for pattern 2

    return min(pattern1_moves, pattern2_moves)
```

```javascript
// Time: O(n) | Space: O(1)
function movesToMakeZigzag(nums) {
  /**
   * Calculate minimum moves to make array zigzag.
   * Pattern 1: even indices are peaks (greater than neighbors)
   * Pattern 2: odd indices are peaks (greater than neighbors)
   */
  const n = nums.length;
  let pattern1Moves = 0; // Cost for pattern where even indices are peaks
  let pattern2Moves = 0; // Cost for pattern where odd indices are peaks

  for (let i = 0; i < n; i++) {
    // Calculate left and right neighbors, use Infinity if neighbor doesn't exist
    const left = i > 0 ? nums[i - 1] : Infinity;
    const right = i < n - 1 ? nums[i + 1] : Infinity;

    // The target value this element needs to be less than
    // We need to be at least 1 less than the smaller neighbor
    const minNeighbor = Math.min(left, right);

    if (i % 2 === 0) {
      // Even index
      // For pattern 1: even indices should be greater than neighbors
      // So we don't need to decrease them for pattern 1
      // For pattern 2: even indices should be smaller than neighbors
      if (nums[i] >= minNeighbor) {
        // Need to decrease current element to be 1 less than min neighbor
        pattern2Moves += nums[i] - (minNeighbor - 1);
      }
    } else {
      // Odd index
      // For pattern 1: odd indices should be smaller than neighbors
      if (nums[i] >= minNeighbor) {
        // Need to decrease current element to be 1 less than min neighbor
        pattern1Moves += nums[i] - (minNeighbor - 1);
      }
      // For pattern 2: odd indices should be greater than neighbors
      // So we don't need to decrease them for pattern 2
    }
  }

  return Math.min(pattern1Moves, pattern2Moves);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int movesToMakeZigzag(int[] nums) {
        /**
         * Calculate minimum moves to make array zigzag.
         * Pattern 1: even indices are peaks (greater than neighbors)
         * Pattern 2: odd indices are peaks (greater than neighbors)
         */
        int n = nums.length;
        int pattern1Moves = 0;  // Cost for pattern where even indices are peaks
        int pattern2Moves = 0;  // Cost for pattern where odd indices are peaks

        for (int i = 0; i < n; i++) {
            // Calculate left and right neighbors, use Integer.MAX_VALUE if neighbor doesn't exist
            int left = i > 0 ? nums[i - 1] : Integer.MAX_VALUE;
            int right = i < n - 1 ? nums[i + 1] : Integer.MAX_VALUE;

            // The target value this element needs to be less than
            // We need to be at least 1 less than the smaller neighbor
            int minNeighbor = Math.min(left, right);

            if (i % 2 == 0) {  // Even index
                // For pattern 1: even indices should be greater than neighbors
                // So we don't need to decrease them for pattern 1
                // For pattern 2: even indices should be smaller than neighbors
                if (nums[i] >= minNeighbor) {
                    // Need to decrease current element to be 1 less than min neighbor
                    pattern2Moves += nums[i] - (minNeighbor - 1);
                }
            } else {  // Odd index
                // For pattern 1: odd indices should be smaller than neighbors
                if (nums[i] >= minNeighbor) {
                    // Need to decrease current element to be 1 less than min neighbor
                    pattern1Moves += nums[i] - (minNeighbor - 1);
                }
                // For pattern 2: odd indices should be greater than neighbors
                // So we don't need to decrease them for pattern 2
            }
        }

        return Math.min(pattern1Moves, pattern2Moves);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array
- For each element, we perform constant-time operations (comparisons, arithmetic)
- No nested loops or recursive calls

**Space Complexity:** O(1)

- We only use a fixed number of variables regardless of input size
- pattern1_moves, pattern2_moves, and loop variables use constant space
- We don't create any data structures that grow with input size

## Common Mistakes

1. **Modifying the array during calculation**: Some candidates try to actually decrease elements as they go, but this affects future calculations. The key insight is to calculate required moves without modifying the original array.

2. **Forgetting to handle edge elements properly**: When an element is at index 0 or n-1, it only has one neighbor. Using `infinity` for the missing neighbor ensures we only compare with the existing neighbor.

3. **Incorrect comparison logic**: The requirement is to be "greater than" or "less than" neighbors, not "greater than or equal to". That's why we need to decrease to `min_neighbor - 1` not `min_neighbor`.

4. **Only checking one pattern**: Some candidates find the cost for one pattern and return it, forgetting that there are two valid zigzag patterns. Always calculate both and take the minimum.

## When You'll See This Pattern

This problem uses a **greedy local optimization** pattern combined with **scenario analysis**:

1. **House Robber (LeetCode 198)**: Similar concept of considering two alternating patterns (rob current house or skip it), though House Robber uses dynamic programming.

2. **Wiggle Sort (LeetCode 280)**: Also deals with creating alternating patterns in arrays, though without the cost minimization aspect.

3. **Minimum Domino Rotations (LeetCode 1007)**: Similar structure of trying two possible target values and calculating minimum moves for each.

4. **Candy (LeetCode 135)**: Uses similar local comparison logic to determine minimum values needed to satisfy constraints.

The core pattern is: when you need to satisfy alternating conditions, calculate the cost for each possible starting condition separately, then take the minimum.

## Key Takeaways

1. **Alternating patterns often require checking multiple starting points**: When a problem has an alternating condition (like zigzag), there are usually 2 valid configurations to consider. Always calculate costs for all valid starting configurations.

2. **Greedy local comparisons can solve global optimization**: For many array transformation problems, you can determine the optimal solution by making locally optimal decisions at each step, especially when constraints only involve immediate neighbors.

3. **Calculate, don't simulate**: Instead of simulating the process of decreasing elements, calculate the required decreases directly from the target conditions. This often leads to more efficient O(n) solutions.

[Practice this problem on CodeJeet](/problem/decrease-elements-to-make-array-zigzag)
