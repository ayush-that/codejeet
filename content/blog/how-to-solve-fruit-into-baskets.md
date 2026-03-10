---
title: "How to Solve Fruit Into Baskets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Fruit Into Baskets. Medium difficulty, 50.5% acceptance rate. Topics: Array, Hash Table, Sliding Window."
date: "2026-12-18"
category: "dsa-patterns"
tags: ["fruit-into-baskets", "array", "hash-table", "sliding-window", "medium"]
---

# How to Solve Fruit Into Baskets

You're given an array where each element represents a fruit type, and you can only collect fruits from at most two different types. The goal is to find the longest contiguous subarray containing at most two distinct values. What makes this problem interesting is that it's essentially the "Longest Substring with At Most K Distinct Characters" problem with k=2, disguised in a fruit-picking story. The challenge lies in efficiently tracking which fruit types are in our current window and knowing when to shrink it.

## Visual Walkthrough

Let's trace through `fruits = [1, 2, 1, 2, 3, 2, 2]` step by step:

We start with two empty baskets (can hold at most 2 fruit types).

1. **Index 0**: Fruit type 1 → Add to basket. Window: [1], length: 1
2. **Index 1**: Fruit type 2 → Add to basket. Window: [1, 2], length: 2
3. **Index 2**: Fruit type 1 → Already in basket. Window: [1, 2, 1], length: 3
4. **Index 3**: Fruit type 2 → Already in basket. Window: [1, 2, 1, 2], length: 4
5. **Index 4**: Fruit type 3 → New type! Now we have 3 types (1, 2, 3). Need to remove fruits until we're back to 2 types. We remove from the left until type 1 is gone. Window becomes [2, 1, 2, 3], but still has 3 types. Remove more until type 2 is gone? Wait, we need to be smarter...

The key insight: When we encounter a third fruit type, we need to remove all fruits of the type that's farthest to the left in our current window. Let's track this properly:

- At index 4, our window is [1, 2, 1, 2] (types 1 and 2)
- Adding type 3 gives us 3 types
- The leftmost type in our window is 1, but we need to find where type 1 ends and type 2 begins
- Actually, we need to find the last occurrence of the type we're about to remove
- Let's use a hash map to track the last index of each fruit type in our window

Better approach: Use a sliding window with two pointers and a hash map tracking the last index of each fruit type in our current window.

## Brute Force Approach

The brute force solution would check every possible subarray to see if it contains at most 2 distinct fruit types, and keep track of the maximum length found.

For each starting index `i`, we would:

1. Initialize an empty set or hash map to track fruit types
2. Iterate from `i` to the end of the array
3. Add each fruit type to our tracker
4. If we ever have more than 2 types, break and record the length
5. Update the maximum length found

This approach has O(n²) time complexity since we're checking O(n) starting points and for each, potentially scanning O(n) elements. The space complexity would be O(1) for the type tracker (since we only track at most 3 types at any time).

The problem with this approach is efficiency. For an array of length 10⁵ (typical LeetCode constraint), O(n²) operations would be 10¹⁰, which is far too slow.

## Optimized Approach

The key insight is that we can use a **sliding window** approach with a hash map. Here's the step-by-step reasoning:

1. **Why sliding window works**: We're looking for the longest contiguous subarray with at most 2 distinct values. This has the "contiguous" property that makes sliding window applicable.

2. **What to track**: We need to know:
   - Which fruit types are currently in our window
   - The last occurrence index of each type in our window (crucial for knowing where to move the left pointer)

3. **When to shrink the window**: When we encounter a third fruit type, we need to remove one type from our window. We should remove the type that has the smallest last occurrence index, because that allows us to keep our window as large as possible while maintaining at most 2 types.

4. **How to update efficiently**: As we expand our window to the right, we update the last occurrence index of the current fruit type. When we need to remove a type, we find the type with the minimum last occurrence index, move our left pointer to `minIndex + 1`, and remove that type from our tracker.

This gives us O(n) time complexity since each element is processed at most twice (added once, removed once).

## Optimal Solution

Here's the complete solution using a sliding window with hash map:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - hash map stores at most 3 entries
def totalFruit(fruits):
    """
    Find the longest contiguous subarray with at most 2 distinct fruit types.

    Args:
        fruits: List[int] - array of fruit types

    Returns:
        int - maximum number of fruits that can be collected
    """
    # Dictionary to store the last occurrence index of each fruit type
    # in our current window
    last_index = {}

    left = 0  # Left pointer of our sliding window
    max_fruits = 0  # Track the maximum window size found

    for right in range(len(fruits)):
        # Add current fruit to our window by updating its last index
        last_index[fruits[right]] = right

        # If we have more than 2 fruit types in our window
        while len(last_index) > 2:
            # Find the fruit type with the smallest last index
            # This is the type we need to remove from our window
            min_index = min(last_index.values())
            fruit_to_remove = fruits[min_index]

            # Move left pointer to just after the last occurrence
            # of the fruit type we're removing
            left = min_index + 1

            # Remove this fruit type from our tracker
            del last_index[fruit_to_remove]

        # Update maximum window size
        # Window is from left to right (inclusive), so size = right - left + 1
        max_fruits = max(max_fruits, right - left + 1)

    return max_fruits
```

```javascript
// Time: O(n) | Space: O(1) - hash map stores at most 3 entries
function totalFruit(fruits) {
  /**
   * Find the longest contiguous subarray with at most 2 distinct fruit types.
   *
   * @param {number[]} fruits - array of fruit types
   * @return {number} - maximum number of fruits that can be collected
   */
  // Map to store the last occurrence index of each fruit type
  // in our current window
  const lastIndex = new Map();

  let left = 0; // Left pointer of our sliding window
  let maxFruits = 0; // Track the maximum window size found

  for (let right = 0; right < fruits.length; right++) {
    // Add current fruit to our window by updating its last index
    lastIndex.set(fruits[right], right);

    // If we have more than 2 fruit types in our window
    while (lastIndex.size > 2) {
      // Find the fruit type with the smallest last index
      // This is the type we need to remove from our window
      let minIndex = Infinity;
      let fruitToRemove = -1;

      // Iterate through map to find minimum index
      for (const [fruit, index] of lastIndex) {
        if (index < minIndex) {
          minIndex = index;
          fruitToRemove = fruit;
        }
      }

      // Move left pointer to just after the last occurrence
      // of the fruit type we're removing
      left = minIndex + 1;

      // Remove this fruit type from our tracker
      lastIndex.delete(fruitToRemove);
    }

    // Update maximum window size
    // Window is from left to right (inclusive), so size = right - left + 1
    maxFruits = Math.max(maxFruits, right - left + 1);
  }

  return maxFruits;
}
```

```java
// Time: O(n) | Space: O(1) - hash map stores at most 3 entries
class Solution {
    public int totalFruit(int[] fruits) {
        /**
         * Find the longest contiguous subarray with at most 2 distinct fruit types.
         *
         * @param fruits - array of fruit types
         * @return maximum number of fruits that can be collected
         */
        // HashMap to store the last occurrence index of each fruit type
        // in our current window
        Map<Integer, Integer> lastIndex = new HashMap<>();

        int left = 0;  // Left pointer of our sliding window
        int maxFruits = 0;  // Track the maximum window size found

        for (int right = 0; right < fruits.length; right++) {
            // Add current fruit to our window by updating its last index
            lastIndex.put(fruits[right], right);

            // If we have more than 2 fruit types in our window
            while (lastIndex.size() > 2) {
                // Find the fruit type with the smallest last index
                // This is the type we need to remove from our window
                int minIndex = Integer.MAX_VALUE;
                int fruitToRemove = -1;

                // Iterate through map to find minimum index
                for (Map.Entry<Integer, Integer> entry : lastIndex.entrySet()) {
                    if (entry.getValue() < minIndex) {
                        minIndex = entry.getValue();
                        fruitToRemove = entry.getKey();
                    }
                }

                // Move left pointer to just after the last occurrence
                // of the fruit type we're removing
                left = minIndex + 1;

                // Remove this fruit type from our tracker
                lastIndex.remove(fruitToRemove);
            }

            // Update maximum window size
            // Window is from left to right (inclusive), so size = right - left + 1
            maxFruits = Math.max(maxFruits, right - left + 1);
        }

        return maxFruits;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once with the right pointer (O(n) operations)
- Each element is added to the hash map exactly once
- Each element is removed from the hash map at most once
- Finding the minimum index in the hash map takes O(1) time since the hash map never has more than 3 entries
- Total operations are proportional to n, giving us O(n) time complexity

**Space Complexity: O(1)**

- The hash map stores at most 3 entries (when we have exactly 2 fruit types plus the new third type that triggers removal)
- This constant space usage gives us O(1) space complexity
- Even though we're using a hash map, its size is bounded by a constant (3), not by n

## Common Mistakes

1. **Using a set instead of tracking last indices**: Some candidates use a set to track which fruit types are in the window, but this doesn't tell you where to move the left pointer when you need to remove a type. You need the last occurrence index to know exactly where to jump.

2. **Incorrect window shrinking**: When removing a fruit type, you need to move `left` to `minIndex + 1`, not just `left + 1`. Moving one position at a time would give O(n²) worst-case time complexity (imagine `[1,1,1,1,1,2,3]`).

3. **Forgetting to handle empty input**: While the problem constraints say `1 <= fruits.length <= 10^5`, in a real interview you should mention edge cases. For an empty array, the answer should be 0.

4. **Not updating the last index correctly**: When you see a fruit type that's already in your window, you must update its last index to the current position. This ensures that when you need to remove a type, you're removing the one that's truly the leftmost in your current window.

## When You'll See This Pattern

This sliding window pattern with at most K distinct elements appears in several variations:

1. **Longest Substring with At Most K Distinct Characters (LeetCode 340)**: This is literally the same problem but with strings instead of arrays and generalized to K distinct characters instead of 2.

2. **Longest Substring Without Repeating Characters (LeetCode 3)**: A special case where K = all unique characters, but uses a similar sliding window approach with character tracking.

3. **Maximum Erasure Value (LeetCode 1695)**: Find the maximum sum of a subarray with all unique elements. Uses a sliding window with a set to track elements in the current window.

4. **Subarrays with K Different Integers (LeetCode 992)**: A more advanced variation where you need to find subarrays with exactly K distinct integers.

The core pattern is: when you need to find the longest/shortest/maximum/minimum subarray with some constraint on the elements (like at most K distinct values), think sliding window with a hash map to track what's in your current window.

## Key Takeaways

1. **Sliding window with hash map**: When you need to track distinct elements in a contiguous subarray, use a sliding window with a hash map to store information about the elements in your current window (like their last occurrence index).

2. **Know what to track**: For "at most K distinct" problems, you need to track both which elements are in your window AND information about their positions so you know how to shrink the window efficiently.

3. **Recognize the pattern**: Problems asking for the longest subarray with some constraint on element uniqueness/distinctness are often sliding window problems. The constraint "at most K" is a strong hint.

Related problems: [Longest Nice Subarray](/problem/longest-nice-subarray), [Fruits Into Baskets II](/problem/fruits-into-baskets-ii)
