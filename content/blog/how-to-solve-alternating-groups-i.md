---
title: "How to Solve Alternating Groups I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Alternating Groups I. Easy difficulty, 68.8% acceptance rate. Topics: Array, Sliding Window."
date: "2028-01-06"
category: "dsa-patterns"
tags: ["alternating-groups-i", "array", "sliding-window", "easy"]
---

# How to Solve Alternating Groups I

You're given a circular array where each element is either 0 (red) or 1 (blue). You need to count how many contiguous groups of 3 tiles have alternating colors. The "circular" aspect means the array wraps around, so the last two tiles can combine with the first tile to form a group. This problem is interesting because it combines basic array traversal with careful handling of circular boundaries.

## Visual Walkthrough

Let's trace through a concrete example: `colors = [1, 0, 1, 0, 1]`

We need to check every possible group of 3 consecutive tiles in the circular array:

1. **Group starting at index 0**: `[1, 0, 1]` → 1→0→1 alternates? Yes! (1≠0, 0≠1)
2. **Group starting at index 1**: `[0, 1, 0]` → 0→1→0 alternates? Yes! (0≠1, 1≠0)
3. **Group starting at index 2**: `[1, 0, 1]` → Wait, this is the same as group 0 because the array is circular! Actually, let's be careful: `colors[2]=1`, `colors[3]=0`, `colors[4]=1` → `[1, 0, 1]` alternates? Yes!
4. **Group starting at index 3**: `[0, 1, ?]` → We need 3 tiles: `colors[3]=0`, `colors[4]=1`, `colors[0]=1` → `[0, 1, 1]` alternates? No! (0≠1, but 1=1)
5. **Group starting at index 4**: `[1, 1, 0]` → `colors[4]=1`, `colors[0]=1`, `colors[1]=0` → `[1, 1, 0]` alternates? No! (1=1)

So we have 3 alternating groups: indices 0, 1, and 2.

Notice the circular aspect: when we reach the end of the array, we need to wrap around to the beginning. For an array of length `n`, there are exactly `n` possible starting positions for groups of 3 tiles.

## Brute Force Approach

The most straightforward approach is to check every possible starting position in the circular array. For each starting index `i`, we need to check tiles at positions `i`, `(i+1)%n`, and `(i+2)%n` (using modulo to handle wrap-around).

A naive implementation might try to create all possible triplets first, but that's unnecessary. We can simply iterate through all starting positions and check the three tiles at each position.

Why is this approach actually acceptable? Because with `n ≤ 100` (as per typical constraints), checking all `n` groups takes O(n) time, which is perfectly fine. In fact, this "brute force" is the optimal solution for this problem!

However, let's think about what a truly naive candidate might miss:

1. Forgetting the circular nature and only checking `n-2` groups
2. Creating unnecessary copies of subarrays instead of checking indices directly
3. Using complex modulo arithmetic incorrectly

## Optimal Solution

The optimal solution is straightforward: iterate through all `n` starting positions, and for each position `i`, check if the three tiles `colors[i]`, `colors[(i+1)%n]`, and `colors[(i+2)%n]` are alternating. Tiles alternate if each adjacent pair has different values: `colors[i] != colors[(i+1)%n]` AND `colors[(i+1)%n] != colors[(i+2)%n]`.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numberOfAlternatingGroups(self, colors):
    """
    Counts the number of alternating groups of 3 tiles in a circular array.

    Args:
        colors: List[int] where 0=red, 1=blue

    Returns:
        int: Number of alternating groups
    """
    n = len(colors)
    count = 0

    # Check all possible starting positions in the circular array
    for i in range(n):
        # Get the three consecutive tiles using modulo for circular wrap-around
        first = colors[i]
        second = colors[(i + 1) % n]  # Wrap around to beginning if needed
        third = colors[(i + 2) % n]   # Wrap around to beginning if needed

        # Check if all adjacent tiles have different colors
        # First != second AND second != third ensures alternation
        if first != second and second != third:
            count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Counts the number of alternating groups of 3 tiles in a circular array.
 *
 * @param {number[]} colors - Array where 0=red, 1=blue
 * @return {number} Number of alternating groups
 */
var numberOfAlternatingGroups = function (colors) {
  const n = colors.length;
  let count = 0;

  // Check all possible starting positions in the circular array
  for (let i = 0; i < n; i++) {
    // Get the three consecutive tiles using modulo for circular wrap-around
    const first = colors[i];
    const second = colors[(i + 1) % n]; // Wrap around to beginning if needed
    const third = colors[(i + 2) % n]; // Wrap around to beginning if needed

    // Check if all adjacent tiles have different colors
    // First != second AND second != third ensures alternation
    if (first !== second && second !== third) {
      count++;
    }
  }

  return count;
};
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Counts the number of alternating groups of 3 tiles in a circular array.
     *
     * @param colors Array where 0=red, 1=blue
     * @return Number of alternating groups
     */
    public int numberOfAlternatingGroups(int[] colors) {
        int n = colors.length;
        int count = 0;

        // Check all possible starting positions in the circular array
        for (int i = 0; i < n; i++) {
            // Get the three consecutive tiles using modulo for circular wrap-around
            int first = colors[i];
            int second = colors[(i + 1) % n];  // Wrap around to beginning if needed
            int third = colors[(i + 2) % n];   // Wrap around to beginning if needed

            // Check if all adjacent tiles have different colors
            // First != second AND second != third ensures alternation
            if (first != second && second != third) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through all `n` starting positions exactly once
- For each position, we perform constant-time operations: 3 array accesses, 2 comparisons, and possibly incrementing a counter
- The modulo operations `(i+1)%n` and `(i+2)%n` are constant time

**Space Complexity: O(1)**

- We only use a fixed amount of extra space: variables for `n`, `count`, `i`, and the three tile values
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the circular nature**: Only checking `n-2` groups instead of all `n` groups. This happens when candidates use `for i in range(n-2)` instead of `for i in range(n)`. Remember: in a circular array, the group starting at index `n-2` includes tiles `n-2`, `n-1`, and `0`, and the group starting at `n-1` includes tiles `n-1`, `0`, and `1`.

2. **Incorrect modulo usage**: Using `(i+1) % (n-1)` or similar incorrect modulus. The correct modulus is `n` (the array length) because we want to wrap around to index 0 after reaching index `n-1`.

3. **Overcomplicating the alternation check**: Some candidates check `first != second != third`, but this doesn't work in most languages because it's evaluated as `(first != second) != third`. The correct check is `first != second and second != third`. Note that we don't need to check `first != third` because alternating sequences only require adjacent elements to differ.

4. **Not handling edge cases**: While the problem guarantees `n ≥ 3`, candidates should still consider what happens with minimal input. For `n=3`, we check all 3 groups, and each group is the same set of tiles (just starting at different positions).

## When You'll See This Pattern

This problem combines two common patterns:

1. **Circular array traversal**: Many problems involve arrays that wrap around. The key technique is using modulo arithmetic to handle indices that exceed array bounds.
   - Related problem: **189. Rotate Array** - Rotating an array involves similar circular index calculations
   - Related problem: **503. Next Greater Element II** - Finding next greater elements in a circular array

2. **Fixed-size sliding window**: Checking every contiguous group of size k is essentially a sliding window problem where the window size is fixed.
   - Related problem: **643. Maximum Average Subarray I** - Finding maximum average of contiguous subarrays of fixed size
   - Related problem: **1456. Maximum Number of Vowels in a Substring of Given Length** - Another fixed-size sliding window problem

3. **Pattern matching in sequences**: Checking if a sequence follows a specific pattern (alternating in this case).
   - Related problem: **896. Monotonic Array** - Checking if an array is entirely non-increasing or non-decreasing

## Key Takeaways

1. **Circular arrays require modulo arithmetic**: When you need to access elements beyond the array bounds with wrap-around, use `(index % n)` where `n` is the array length. This is cleaner than writing conditional checks for boundary cases.

2. **Fixed windows simplify sliding window problems**: When the window size is fixed (like 3 in this problem), you don't need the full two-pointer sliding window machinery. A simple loop checking each starting position is sufficient and often clearer.

3. **Check adjacent pairs for alternation**: To verify if a sequence alternates between two values, you only need to check that each element differs from its immediate neighbor. You don't need to check non-adjacent elements (like first vs third).

[Practice this problem on CodeJeet](/problem/alternating-groups-i)
