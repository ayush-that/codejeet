---
title: "How to Solve Minimum Consecutive Cards to Pick Up — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Consecutive Cards to Pick Up. Medium difficulty, 53.5% acceptance rate. Topics: Array, Hash Table, Sliding Window."
date: "2027-02-19"
category: "dsa-patterns"
tags: ["minimum-consecutive-cards-to-pick-up", "array", "hash-table", "sliding-window", "medium"]
---

# How to Solve Minimum Consecutive Cards to Pick Up

You're given an array of cards, each with a value. Your task is to find the shortest contiguous subarray that contains at least one matching pair of cards (two cards with the same value). Return the length of that subarray, or -1 if no such pair exists.

What makes this problem interesting is that it looks like a sliding window problem at first glance, but there's a more efficient approach using hash maps that avoids the overhead of maintaining a window. The key insight is recognizing that for any matching pair, the shortest subarray containing them is simply the cards between their two positions.

## Visual Walkthrough

Let's trace through an example: `cards = [1, 2, 3, 1, 4, 2]`

We need to find the shortest distance between any two equal values. Think of it like this: as we scan through the array, we track the most recent position where we've seen each value. When we encounter a value we've seen before, we can immediately calculate the distance between the current position and its last occurrence.

1. **Position 0 (value 1)**: First time seeing 1 → store position 0
2. **Position 1 (value 2)**: First time seeing 2 → store position 1
3. **Position 2 (value 3)**: First time seeing 3 → store position 2
4. **Position 3 (value 1)**: We've seen 1 before at position 0! The distance is 3 - 0 = 3 cards. Current minimum = 3
5. **Position 4 (value 4)**: First time seeing 4 → store position 4
6. **Position 5 (value 2)**: We've seen 2 before at position 1! The distance is 5 - 1 = 4 cards. Current minimum remains 3

The shortest distance is 3, which corresponds to picking up cards at indices 0 through 3: `[1, 2, 3, 1]`.

## Brute Force Approach

A naive approach would check every possible subarray to see if it contains a matching pair:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i+1 to n-1
3. Check if the subarray `cards[i..j]` contains a duplicate
4. Track the minimum length where a duplicate exists

The duplicate check can be done with a hash set for each subarray. This gives us O(n³) time complexity (n² subarrays × O(n) to check each one) or O(n²) if we're clever about the duplicate check. Either way, it's too slow for typical constraints where n can be up to 10⁵.

<div class="code-group">

```python
# Time: O(n^3) | Space: O(n)
def minimumCardPickup_brute(cards):
    n = len(cards)
    min_length = float('inf')

    # Check all possible subarrays
    for i in range(n):
        for j in range(i + 1, n):
            # Check if cards[i..j] contains a duplicate
            seen = set()
            has_duplicate = False
            for k in range(i, j + 1):
                if cards[k] in seen:
                    has_duplicate = True
                    break
                seen.add(cards[k])

            # If duplicate found, update minimum length
            if has_duplicate:
                min_length = min(min_length, j - i + 1)

    return -1 if min_length == float('inf') else min_length
```

```javascript
// Time: O(n^3) | Space: O(n)
function minimumCardPickupBrute(cards) {
  const n = cards.length;
  let minLength = Infinity;

  // Check all possible subarrays
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Check if cards[i..j] contains a duplicate
      const seen = new Set();
      let hasDuplicate = false;

      for (let k = i; k <= j; k++) {
        if (seen.has(cards[k])) {
          hasDuplicate = true;
          break;
        }
        seen.add(cards[k]);
      }

      // If duplicate found, update minimum length
      if (hasDuplicate) {
        minLength = Math.min(minLength, j - i + 1);
      }
    }
  }

  return minLength === Infinity ? -1 : minLength;
}
```

```java
// Time: O(n^3) | Space: O(n)
public int minimumCardPickupBrute(int[] cards) {
    int n = cards.length;
    int minLength = Integer.MAX_VALUE;

    // Check all possible subarrays
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Check if cards[i..j] contains a duplicate
            Set<Integer> seen = new HashSet<>();
            boolean hasDuplicate = false;

            for (int k = i; k <= j; k++) {
                if (seen.contains(cards[k])) {
                    hasDuplicate = true;
                    break;
                }
                seen.add(cards[k]);
            }

            // If duplicate found, update minimum length
            if (hasDuplicate) {
                minLength = Math.min(minLength, j - i + 1);
            }
        }
    }

    return minLength == Integer.MAX_VALUE ? -1 : minLength;
}
```

</div>

## Optimized Approach

The brute force is inefficient because it redundantly checks subarrays. The key insight is that for any matching pair of cards, the shortest subarray containing them is simply the cards between their two positions (inclusive). We don't need to check all possible subarrays — we just need to find, for each value, the minimum distance between any two occurrences of that value.

Here's the optimal strategy:

1. **Use a hash map** to store the most recent index where we've seen each card value
2. **Iterate through the array** from left to right
3. **For each card**:
   - If we've seen this value before, calculate the distance: `current_index - last_seen_index + 1`
   - Update our global minimum if this distance is smaller
   - Update the last seen index for this value to the current index
4. **Return the minimum** or -1 if no duplicates were found

This works because if we see the same value multiple times, the shortest subarray containing a pair will always be between consecutive occurrences (not necessarily the first and last). For example, with `[1, 2, 1, 2, 1]`, the shortest is between the second and third 1's, not the first and last.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumCardPickup(cards):
    """
    Find the minimum number of consecutive cards needed to pick up a matching pair.

    Approach: Track the last seen index of each card value using a hash map.
    When we encounter a card we've seen before, calculate the distance between
    the current and previous occurrence. The minimum such distance is our answer.
    """
    # Dictionary to store the most recent index of each card value
    last_seen = {}

    # Initialize minimum length to infinity (or a large number)
    min_length = float('inf')

    # Iterate through all cards with their indices
    for i, card in enumerate(cards):
        if card in last_seen:
            # Calculate the length of subarray containing this matching pair
            # i - last_seen[card] gives the number of cards between them,
            # +1 to include both cards in the count
            current_length = i - last_seen[card] + 1

            # Update minimum if we found a shorter subarray
            min_length = min(min_length, current_length)

        # Update the last seen index for this card value
        # This must happen whether we found a match or not
        last_seen[card] = i

    # Return -1 if no matching pair was found, otherwise return min_length
    return -1 if min_length == float('inf') else min_length
```

```javascript
// Time: O(n) | Space: O(n)
function minimumCardPickup(cards) {
  /**
   * Find the minimum number of consecutive cards needed to pick up a matching pair.
   *
   * Approach: Track the last seen index of each card value using a hash map.
   * When we encounter a card we've seen before, calculate the distance between
   * the current and previous occurrence. The minimum such distance is our answer.
   */

  // Map to store the most recent index of each card value
  const lastSeen = new Map();

  // Initialize minimum length to Infinity
  let minLength = Infinity;

  // Iterate through all cards with their indices
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    if (lastSeen.has(card)) {
      // Calculate the length of subarray containing this matching pair
      // i - lastSeen.get(card) gives the number of cards between them,
      // +1 to include both cards in the count
      const currentLength = i - lastSeen.get(card) + 1;

      // Update minimum if we found a shorter subarray
      minLength = Math.min(minLength, currentLength);
    }

    // Update the last seen index for this card value
    // This must happen whether we found a match or not
    lastSeen.set(card, i);
  }

  // Return -1 if no matching pair was found, otherwise return minLength
  return minLength === Infinity ? -1 : minLength;
}
```

```java
// Time: O(n) | Space: O(n)
public int minimumCardPickup(int[] cards) {
    /**
     * Find the minimum number of consecutive cards needed to pick up a matching pair.
     *
     * Approach: Track the last seen index of each card value using a hash map.
     * When we encounter a card we've seen before, calculate the distance between
     * the current and previous occurrence. The minimum such distance is our answer.
     */

    // HashMap to store the most recent index of each card value
    Map<Integer, Integer> lastSeen = new HashMap<>();

    // Initialize minimum length to the maximum possible value
    int minLength = Integer.MAX_VALUE;

    // Iterate through all cards with their indices
    for (int i = 0; i < cards.length; i++) {
        int card = cards[i];

        if (lastSeen.containsKey(card)) {
            // Calculate the length of subarray containing this matching pair
            // i - lastSeen.get(card) gives the number of cards between them,
            // +1 to include both cards in the count
            int currentLength = i - lastSeen.get(card) + 1;

            // Update minimum if we found a shorter subarray
            minLength = Math.min(minLength, currentLength);
        }

        // Update the last seen index for this card value
        // This must happen whether we found a match or not
        lastSeen.put(card, i);
    }

    // Return -1 if no matching pair was found, otherwise return minLength
    return minLength == Integer.MAX_VALUE ? -1 : minLength;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of n cards
- Each dictionary/map operation (insertion and lookup) is O(1) on average
- Total operations: n insertions and up to n lookups = O(n)

**Space Complexity: O(n)**

- In the worst case, all card values are unique, so we store n entries in the hash map
- Even with duplicates, we only store one entry per unique value
- Additional variables use O(1) space

## Common Mistakes

1. **Forgetting to update the last seen index after finding a match**: Some candidates only update the map when they find a match, but you must update it on every iteration. Otherwise, you might miss shorter subarrays between later occurrences.

2. **Off-by-one errors in length calculation**: The formula is `current_index - last_seen_index + 1`, not `current_index - last_seen_index`. If you have cards at indices 2 and 5, you need to pick up 4 cards (indices 2, 3, 4, 5), not 3.

3. **Returning 0 or 1 when no match exists**: The problem specifies to return -1 when no matching pair exists. Always check if your minimum length variable still has its initial value before returning.

4. **Using a sliding window unnecessarily**: While this problem feels like a sliding window, the optimal solution is simpler. A sliding window would require O(2n) time as the window expands and contracts, while the hash map approach is a clean O(n) single pass.

## When You'll See This Pattern

This "last seen index" pattern appears in several LeetCode problems:

1. **Longest Substring Without Repeating Characters (Medium)**: Uses a similar "last seen index" approach to track characters and calculate window lengths. Instead of finding minimum distances, it finds maximum distances between repeats.

2. **Contains Duplicate II (Easy)**: Asks if there are duplicates within k distance of each other. The solution is nearly identical to this problem but with a distance check instead of tracking the minimum.

3. **Subarray Sum Equals K (Medium)**: While not about duplicates, it uses a similar "prefix sum with hash map" pattern where you track previously seen prefix sums to find subarrays that sum to k.

The core pattern is: **when you need to find relationships between elements based on their values and positions, a hash map storing the most recent position of each value is often the key to an O(n) solution.**

## Key Takeaways

1. **For "minimum distance between duplicates" problems, track the last seen index of each value**. The shortest distance for any value will always be between consecutive occurrences, not necessarily the first and last.

2. **Hash maps are excellent for O(1) lookups of "have I seen this before?"**. When combined with array indices, they let you solve in one pass what would otherwise require nested loops.

3. **Pay attention to inclusive vs exclusive bounds**. The "+1" in `i - last_seen[card] + 1` is easy to forget but crucial for correct results.

Related problems: [Longest Substring Without Repeating Characters](/problem/longest-substring-without-repeating-characters)
