---
title: "How to Solve Contains Duplicate II — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Contains Duplicate II. Easy difficulty, 50.8% acceptance rate. Topics: Array, Hash Table, Sliding Window."
date: "2026-06-23"
category: "dsa-patterns"
tags: ["contains-duplicate-ii", "array", "hash-table", "sliding-window", "easy"]
---

# How to Solve Contains Duplicate II

The problem asks us to determine if there are two equal elements in an array whose indices differ by at most `k`. What makes this interesting is that we're not just checking for duplicates anywhere in the array—we need them to be close together, specifically within a sliding window of size `k+1`. This constraint transforms a simple duplicate check into a problem that requires tracking elements within a bounded range.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 3, 1, 2, 3]` with `k = 2`.

We need to find two equal numbers whose indices are at most 2 apart. Let's think about this visually:

**Step 1:** Start with index 0, value 1. We haven't seen 1 before, so we just record it.

**Step 2:** Index 1, value 2. New value, record it.

**Step 3:** Index 2, value 3. New value, record it.

**Step 4:** Index 3, value 1. Now we've seen 1 before at index 0. Check the distance: `3 - 0 = 3`. Since 3 > 2 (k=2), this doesn't satisfy our condition. However, we should update our record of 1 to the most recent index (3) because older indices won't help us find closer matches in the future.

**Step 5:** Index 4, value 2. We've seen 2 at index 1. Distance: `4 - 1 = 3` > 2. Update 2's index to 4.

**Step 6:** Index 5, value 3. We've seen 3 at index 2. Distance: `5 - 2 = 3` > 2. No close duplicates found.

The key insight: we only need to keep track of the most recent occurrence of each number. If we see a number again, we check if its previous occurrence was within `k` indices. If yes, we found our answer. If no, we update to the current index because that's now the closest possible match for future occurrences.

## Brute Force Approach

The most straightforward solution would be to check every pair of indices `(i, j)` where `i < j`:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def containsNearbyDuplicate(nums, k):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            # Check if values are equal and indices are close enough
            if nums[i] == nums[j] and abs(i - j) <= k:
                return True
    return False
```

```javascript
// Time: O(n²) | Space: O(1)
function containsNearbyDuplicate(nums, k) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Check if values are equal and indices are close enough
      if (nums[i] === nums[j] && Math.abs(i - j) <= k) {
        return true;
      }
    }
  }
  return false;
}
```

```java
// Time: O(n²) | Space: O(1)
public boolean containsNearbyDuplicate(int[] nums, int k) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Check if values are equal and indices are close enough
            if (nums[i] == nums[j] && Math.abs(i - j) <= k) {
                return true;
            }
        }
    }
    return false;
}
```

</div>

**Why this is insufficient:** With `n` up to 10⁵ (typical LeetCode constraints), O(n²) is far too slow—it would require up to 5 billion operations. We need something that runs in O(n) time.

## Optimal Solution

The optimal approach uses a hash map (dictionary in Python, object/Map in JavaScript, HashMap in Java) to store the most recent index where we've seen each value. As we iterate through the array, for each element we check:

1. Have we seen this value before?
2. If yes, is the difference between the current index and the previous index ≤ k?
3. If both conditions are true, return True
4. Otherwise, update the hash map with the current index for this value

This works because if a duplicate exists within distance `k`, then when we encounter the second occurrence, the first occurrence must be in our hash map with an index that's at most `k` away from our current position.

<div class="code-group">

```python
# Time: O(n) | Space: O(min(n, k)) - In worst case we store min(n, k) elements
def containsNearbyDuplicate(nums, k):
    # Dictionary to store the most recent index of each value
    # key: number from nums, value: last index where we saw this number
    last_seen = {}

    # Iterate through the array with both index and value
    for i, num in enumerate(nums):
        # Check if we've seen this number before and if it's within k distance
        if num in last_seen and i - last_seen[num] <= k:
            # Found a valid pair: same number and indices within k
            return True

        # Update the last seen index for this number
        # This overwrites any previous index, which is correct because
        # we only care about the closest possible match
        last_seen[num] = i

    # If we finish the loop without finding a valid pair
    return False
```

```javascript
// Time: O(n) | Space: O(min(n, k)) - In worst case we store min(n, k) elements
function containsNearbyDuplicate(nums, k) {
  // Map to store the most recent index of each value
  // key: number from nums, value: last index where we saw this number
  const lastSeen = new Map();

  // Iterate through the array
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Check if we've seen this number before and if it's within k distance
    if (lastSeen.has(num) && i - lastSeen.get(num) <= k) {
      // Found a valid pair: same number and indices within k
      return true;
    }

    // Update the last seen index for this number
    // This overwrites any previous index, which is correct because
    // we only care about the closest possible match
    lastSeen.set(num, i);
  }

  // If we finish the loop without finding a valid pair
  return false;
}
```

```java
// Time: O(n) | Space: O(min(n, k)) - In worst case we store min(n, k) elements
public boolean containsNearbyDuplicate(int[] nums, int k) {
    // HashMap to store the most recent index of each value
    // key: number from nums, value: last index where we saw this number
    Map<Integer, Integer> lastSeen = new HashMap<>();

    // Iterate through the array
    for (int i = 0; i < nums.length; i++) {
        int num = nums[i];

        // Check if we've seen this number before and if it's within k distance
        if (lastSeen.containsKey(num) && i - lastSeen.get(num) <= k) {
            // Found a valid pair: same number and indices within k
            return true;
        }

        // Update the last seen index for this number
        // This overwrites any previous index, which is correct because
        // we only care about the closest possible match
        lastSeen.put(num, i);
    }

    // If we finish the loop without finding a valid pair
    return false;
}
```

</div>

**Alternative Sliding Window Approach:** We can also solve this using a sliding window with a set that maintains only the last `k` elements. This approach uses O(k) space and might be slightly more intuitive for some:

<div class="code-group">

```python
# Time: O(n) | Space: O(k)
def containsNearbyDuplicate(nums, k):
    # Set to maintain elements in the current window of size k
    window = set()

    for i, num in enumerate(nums):
        # If the number is already in our window, we found a duplicate
        if num in window:
            return True

        # Add current number to the window
        window.add(num)

        # If window size exceeds k, remove the oldest element
        # The oldest element is at index i - k
        if len(window) > k:
            window.remove(nums[i - k])

    return False
```

</div>

This approach maintains a "window" of the last `k` elements we've seen. If a number appears twice within this window, we've found our answer.

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the array. We make a single pass through the array, and each hash map operation (insertion and lookup) is O(1) on average.

**Space Complexity:** O(min(n, k)) for the hash map approach. In the worst case, we might store all `n` elements if `k ≥ n`. However, we can also think of it as O(k) because once we have more than `k+1` elements in our map, we could theoretically remove elements that are more than `k` indices behind our current position (though our implementation doesn't do this cleanup explicitly).

For the sliding window set approach, the space complexity is clearly O(k) since we never store more than `k+1` elements.

## Common Mistakes

1. **Forgetting to update the index in the hash map:** Some candidates check if a number exists in the map and, when it doesn't satisfy the distance condition, forget to update the map with the new index. This is crucial because older indices won't help find closer matches in the future.

2. **Using `abs(i - j)` in the hash map approach:** When we store only the most recent index, we know that `current_index > previous_index`, so we don't need `abs()`. The check should be `i - last_seen[num] <= k`, not `abs(i - last_seen[num]) <= k`. While both work, the former is cleaner.

3. **Off-by-one errors with window size:** In the sliding window approach, remember that if `k = 2`, we're checking indices that differ by at most 2, which means our window should contain at most `k+1 = 3` elements (indices i, i-1, and i-2).

4. **Not handling empty or single-element arrays:** While the problem constraints typically guarantee at least one element, it's good practice to consider edge cases. Both approaches handle these correctly—they'll simply return `False`.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Hash Map for tracking previous occurrences** - Used in problems like Two Sum, where we need to find pairs that satisfy certain conditions.
2. **Sliding Window** - Used when we need to maintain information about a contiguous subsequence of fixed or bounded size.

Related problems that use similar techniques:

- **Contains Duplicate (Easy)** - Simpler version without the distance constraint, just checking for any duplicates.
- **Contains Duplicate III (Hard)** - More complex version where values must be within `t` and indices within `k`. Requires trees or buckets instead of simple hash maps.
- **Longest Substring Without Repeating Characters (Medium)** - Uses a sliding window with hash map to track character positions.
- **Two Sum (Easy)** - Uses a hash map to track values and their indices to find pairs that sum to a target.

## Key Takeaways

1. **When you need to find elements satisfying proximity constraints**, consider using a hash map to track the most recent occurrence of each element. This lets you check conditions in O(1) time as you iterate.

2. **The sliding window technique** is powerful for problems involving contiguous subsequences with size constraints. Maintaining a set or map of elements in the current window often provides an efficient solution.

3. **Always update your tracking data structure** with the most recent information. In this case, when a duplicate isn't close enough, we still update its index because that's now the best candidate for future matches.

Remember: interviewers love to see candidates start with the brute force approach, explain why it's insufficient, then optimize to the O(n) solution. This demonstrates systematic problem-solving skills.

Related problems: [Contains Duplicate](/problem/contains-duplicate), [Contains Duplicate III](/problem/contains-duplicate-iii)
