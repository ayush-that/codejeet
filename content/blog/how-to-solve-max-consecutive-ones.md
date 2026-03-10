---
title: "How to Solve Max Consecutive Ones — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Max Consecutive Ones. Easy difficulty, 64.6% acceptance rate. Topics: Array."
date: "2026-05-19"
category: "dsa-patterns"
tags: ["max-consecutive-ones", "array", "easy"]
---

# How to Solve Max Consecutive Ones

This problem asks you to find the longest sequence of consecutive `1`s in a binary array. While conceptually simple, it's an excellent introduction to **sliding window** and **single-pass counting** techniques that form the foundation for more complex array problems. The tricky part isn't the logic itself, but writing clean, efficient code that handles all edge cases correctly.

## Visual Walkthrough

Let's trace through the example `nums = [1, 1, 0, 1, 1, 1]`:

We'll maintain two counters:

- `current_count`: Tracks consecutive 1s in the current streak
- `max_count`: Tracks the maximum streak seen so far

**Step 1:** `nums[0] = 1`

- Current streak begins: `current_count = 1`
- Update maximum: `max_count = max(0, 1) = 1`

**Step 2:** `nums[1] = 1`

- Streak continues: `current_count = 2`
- Update maximum: `max_count = max(1, 2) = 2`

**Step 3:** `nums[2] = 0`

- Streak breaks: `current_count = 0`
- Maximum remains: `max_count = 2`

**Step 4:** `nums[3] = 1`

- New streak begins: `current_count = 1`
- Maximum unchanged: `max_count = max(2, 1) = 2`

**Step 5:** `nums[4] = 1`

- Streak continues: `current_count = 2`
- Maximum unchanged: `max_count = max(2, 2) = 2`

**Step 6:** `nums[5] = 1`

- Streak continues: `current_count = 3`
- Update maximum: `max_count = max(2, 3) = 3`

Final answer: **3**

The key insight is that we only need to track the current streak and compare it to the best streak we've seen so far. When we hit a `0`, we reset the current streak counter.

## Brute Force Approach

A naive approach might try to examine every possible subarray to check if it contains only 1s, then track the longest such subarray. For each starting index `i`, we would check all ending indices `j` where `j ≥ i`, counting consecutive 1s until we hit a 0. This results in O(n²) time complexity since we're essentially checking n starting points and potentially scanning to the end of the array for each.

While this would work for small inputs, it's inefficient for larger arrays. The problem constraints (up to 10⁵ elements) make O(n²) solutions impractical. More importantly, this approach misses the key observation: we don't need to check every subarray explicitly—we can simply scan once and track streaks.

## Optimal Solution

The optimal solution uses a **single pass** through the array. We maintain two counters: one for the current streak of consecutive 1s, and another for the maximum streak seen so far. When we encounter a 1, we increment the current streak. When we encounter a 0, we reset the current streak to 0. After each element, we update the maximum streak if needed.

<div class="code-group">

```python
# Time: O(n) - We traverse the array once
# Space: O(1) - We use only two integer variables
def findMaxConsecutiveOnes(nums):
    """
    Find the maximum number of consecutive 1s in a binary array.

    Args:
        nums: List[int] - Binary array containing only 0s and 1s

    Returns:
        int - Maximum count of consecutive 1s
    """
    max_count = 0  # Tracks the maximum streak found so far
    current_count = 0  # Tracks the current consecutive 1s streak

    # Iterate through each element in the array
    for num in nums:
        if num == 1:
            # If current element is 1, increment the current streak
            current_count += 1
            # Update max_count if current streak is larger
            max_count = max(max_count, current_count)
        else:
            # If current element is 0, reset the current streak
            current_count = 0

    return max_count
```

```javascript
// Time: O(n) - We traverse the array once
// Space: O(1) - We use only two integer variables
function findMaxConsecutiveOnes(nums) {
  /**
   * Find the maximum number of consecutive 1s in a binary array.
   *
   * @param {number[]} nums - Binary array containing only 0s and 1s
   * @return {number} - Maximum count of consecutive 1s
   */
  let maxCount = 0; // Tracks the maximum streak found so far
  let currentCount = 0; // Tracks the current consecutive 1s streak

  // Iterate through each element in the array
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) {
      // If current element is 1, increment the current streak
      currentCount++;
      // Update maxCount if current streak is larger
      maxCount = Math.max(maxCount, currentCount);
    } else {
      // If current element is 0, reset the current streak
      currentCount = 0;
    }
  }

  return maxCount;
}
```

```java
// Time: O(n) - We traverse the array once
// Space: O(1) - We use only two integer variables
public int findMaxConsecutiveOnes(int[] nums) {
    /**
     * Find the maximum number of consecutive 1s in a binary array.
     *
     * @param nums - Binary array containing only 0s and 1s
     * @return - Maximum count of consecutive 1s
     */
    int maxCount = 0;  // Tracks the maximum streak found so far
    int currentCount = 0;  // Tracks the current consecutive 1s streak

    // Iterate through each element in the array
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == 1) {
            // If current element is 1, increment the current streak
            currentCount++;
            // Update maxCount if current streak is larger
            maxCount = Math.max(maxCount, currentCount);
        } else {
            // If current element is 0, reset the current streak
            currentCount = 0;
        }
    }

    return maxCount;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once, performing constant-time operations (comparisons, increments, and max calculations) for each of the n elements.

**Space Complexity: O(1)**

- We use only two integer variables (`max_count` and `current_count`) regardless of the input size. No additional data structures are created.

## Common Mistakes

1. **Forgetting to reset the counter on non-1 values**: Some candidates only check for `num == 1` and forget that any non-1 value (though the problem says binary array, defensive programming is good) should break the streak. Always reset `current_count` when `num != 1`.

2. **Updating max_count at the wrong time**: A common error is to update `max_count` only after resetting `current_count` or only at the end of the loop. You should update `max_count` whenever `current_count` increases, as the current streak might be the longest one.

3. **Edge case: all zeros**: When the array contains only zeros, the function should return 0. Some implementations might return 1 if they initialize `max_count` incorrectly. Always initialize `max_count = 0`.

4. **Edge case: empty array**: While not explicitly mentioned, handling empty input gracefully is good practice. Our solution works because the loop won't execute, and we return the initialized `max_count = 0`.

5. **Using extra space unnecessarily**: Some candidates create a new array or use a stack to track streaks. Remember that we only need to know the current streak length and the maximum seen so far—no need for additional data structures.

## When You'll See This Pattern

This "single-pass counting with reset" pattern appears in many array problems where you need to track sequences or streaks:

1. **Max Consecutive Ones II** (Medium): The same problem but you're allowed to flip at most one 0 to 1. This requires a more sophisticated sliding window approach but builds on the same streak-counting concept.

2. **Max Consecutive Ones III** (Medium): Generalized version where you can flip at most K zeros. This uses the sliding window pattern more explicitly.

3. **Consecutive Characters** (Easy): Find the maximum length of a non-empty substring containing only one unique character. Exactly the same pattern but with characters instead of binary digits.

4. **Longest Turbulent Subarray** (Medium): While more complex, it uses similar streak-tracking logic with alternating comparison conditions.

5. **Maximum Subarray** (Easy/Medium): Kadane's algorithm uses similar "track current and maximum" logic, though with different reset conditions.

## Key Takeaways

1. **Single-pass counting**: Many array problems can be solved with a single pass if you track the necessary state in a few variables. Look for problems where you need to find "maximum consecutive" or "longest streak" of something.

2. **Reset conditions are crucial**: The key to these problems is understanding when to reset your counter. In this case, reset on `0`; in other problems, it might be when a condition breaks.

3. **Two-pointer thinking**: This solution is essentially a simplified sliding window where the window expands on 1s and resets on 0s. Recognizing this helps with more complex variants.

4. **Space optimization**: When you only need to know the "maximum so far" and the "current value," you rarely need extra data structures. Always ask: "What's the minimum information I need to track?"

Related problems: [Max Consecutive Ones II](/problem/max-consecutive-ones-ii), [Max Consecutive Ones III](/problem/max-consecutive-ones-iii), [Consecutive Characters](/problem/consecutive-characters)
