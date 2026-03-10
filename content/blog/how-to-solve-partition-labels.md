---
title: "How to Solve Partition Labels — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition Labels. Medium difficulty, 81.8% acceptance rate. Topics: Hash Table, Two Pointers, String, Greedy."
date: "2026-12-21"
category: "dsa-patterns"
tags: ["partition-labels", "hash-table", "two-pointers", "string", "medium"]
---

# How to Solve Partition Labels

This problem asks us to split a string into the maximum number of partitions where each character appears in only one partition. The tricky part is that a character's first and last appearance dictate where partitions can be cut—if a character appears in multiple places, all those positions must be in the same partition. This creates overlapping ranges that we need to resolve.

## Visual Walkthrough

Let's trace through `s = "ababcbacadefegdehijhklij"` step by step:

1. First, we find the last occurrence of each character:
   - a: last index 8
   - b: last index 5
   - c: last index 7
   - d: last index 14
   - e: last index 15
   - f: last index 11
   - g: last index 13
   - h: last index 19
   - i: last index 22
   - j: last index 23
   - k: last index 20
   - l: last index 21

2. Now we scan through the string:
   - Start at index 0 (a). The current partition ends at max(last['a']=8, last['b']=5) = 8
   - Continue scanning: at index 1 (b), last['b']=5 ≤ 8, so partition still ends at 8
   - At index 2 (a), last['a']=8 ≤ 8, still ends at 8
   - At index 3 (b), last['b']=5 ≤ 8, still ends at 8
   - At index 4 (c), last['c']=7 ≤ 8, still ends at 8
   - At index 5 (b), last['b']=5 ≤ 8, still ends at 8
   - At index 6 (a), last['a']=8 ≤ 8, still ends at 8
   - At index 7 (c), last['c']=7 ≤ 8, still ends at 8
   - At index 8 (a), we've reached the end of our first partition! Cut here: "ababcbaca" (indices 0-8)

3. Start new partition at index 9 (d):
   - Current end = last['d']=14
   - At index 10 (e), last['e']=15 > 14, so update end to 15
   - At index 11 (f), last['f']=11 ≤ 15, end stays 15
   - At index 12 (e), last['e']=15 ≤ 15, end stays 15
   - At index 13 (g), last['g']=13 ≤ 15, end stays 15
   - At index 14 (d), last['d']=14 ≤ 15, end stays 15
   - At index 15 (e), reached end! Cut: "defegde" (indices 9-15)

4. Start new partition at index 16 (h):
   - Current end = last['h']=19
   - At index 17 (i), last['i']=22 > 19, update end to 22
   - At index 18 (j), last['j']=23 > 22, update end to 23
   - At index 19 (h), last['h']=19 ≤ 23, end stays 23
   - At index 20 (k), last['k']=20 ≤ 23, end stays 23
   - At index 21 (l), last['l']=21 ≤ 23, end stays 23
   - At index 22 (i), last['i']=22 ≤ 23, end stays 23
   - At index 23 (j), reached end! Cut: "hijhklij" (indices 16-23)

Result: `["ababcbaca", "defegde", "hijhklij"]` or lengths `[9, 7, 8]`

## Brute Force Approach

A naive approach would be to try all possible partition points. For each starting index, we could:

1. Start a new partition
2. Find all characters in the current partition
3. Check if any of those characters appear later in the string
4. If yes, extend the partition to include all those appearances
5. Repeat until no characters in the partition appear outside it

This approach is inefficient because:

- We might repeatedly scan the same characters
- Checking if characters appear outside the partition requires scanning the entire remaining string
- The time complexity would be O(n³) in worst case: for each starting point, we might scan the rest of the string multiple times

The key insight we need is that we don't need to repeatedly scan—we can precompute the last occurrence of each character and use that to determine partition boundaries in a single pass.

## Optimized Approach

The optimal solution uses a greedy two-pass approach:

1. **First pass (right to left):** Record the last occurrence index of each character. This tells us the farthest position where each character appears.

2. **Second pass (left to right):** Scan through the string while tracking:
   - `start`: beginning of current partition
   - `end`: farthest position where any character in the current partition appears

   As we scan, for each character at position `i`, we update `end = max(end, last[char])`. When `i == end`, we've reached the end of a valid partition. We record its length and start a new partition.

This works because:

- Once we include a character in a partition, we must include all its occurrences
- The `last` map tells us the farthest we need to extend to include all occurrences
- By extending to the maximum `last` value of all characters seen so far, we ensure no character appears in multiple partitions

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - only 26 letters in alphabet
def partitionLabels(s: str):
    """
    Partition string into maximum number of parts where each character
    appears in at most one part.

    Approach:
    1. First, record the last occurrence index of each character
    2. Then scan through string, extending partitions to include
       all occurrences of characters within them
    """
    # Step 1: Create a dictionary to store the last index of each character
    last_occurrence = {}

    # Traverse the string to record the last occurrence of each character
    # We need this to know how far we must extend each partition
    for i, char in enumerate(s):
        last_occurrence[char] = i

    result = []  # Will store the length of each partition
    start = 0    # Start index of current partition
    end = 0      # End index of current partition (farthest last occurrence)

    # Step 2: Scan through the string to determine partition boundaries
    for i, char in enumerate(s):
        # Update the end of current partition to be the maximum of:
        # - current end
        # - last occurrence of current character
        end = max(end, last_occurrence[char])

        # If we've reached the end index, we've completed a valid partition
        # All characters in [start, end] have their last occurrences ≤ end
        if i == end:
            # Calculate length of this partition and add to result
            result.append(end - start + 1)
            # Start a new partition at the next index
            start = i + 1

    return result
```

```javascript
// Time: O(n) | Space: O(1) - only 26 letters in alphabet
function partitionLabels(s) {
  /**
   * Partition string into maximum number of parts where each character
   * appears in at most one part.
   *
   * Approach:
   * 1. First, record the last occurrence index of each character
   * 2. Then scan through string, extending partitions to include
   *    all occurrences of characters within them
   */

  // Step 1: Create a map to store the last index of each character
  const lastOccurrence = new Map();

  // Traverse the string to record the last occurrence of each character
  // We need this to know how far we must extend each partition
  for (let i = 0; i < s.length; i++) {
    lastOccurrence.set(s[i], i);
  }

  const result = []; // Will store the length of each partition
  let start = 0; // Start index of current partition
  let end = 0; // End index of current partition (farthest last occurrence)

  // Step 2: Scan through the string to determine partition boundaries
  for (let i = 0; i < s.length; i++) {
    // Update the end of current partition to be the maximum of:
    // - current end
    // - last occurrence of current character
    end = Math.max(end, lastOccurrence.get(s[i]));

    // If we've reached the end index, we've completed a valid partition
    // All characters in [start, end] have their last occurrences ≤ end
    if (i === end) {
      // Calculate length of this partition and add to result
      result.push(end - start + 1);
      // Start a new partition at the next index
      start = i + 1;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) - only 26 letters in alphabet
import java.util.*;

class Solution {
    public List<Integer> partitionLabels(String s) {
        /**
         * Partition string into maximum number of parts where each character
         * appears in at most one part.
         *
         * Approach:
         * 1. First, record the last occurrence index of each character
         * 2. Then scan through string, extending partitions to include
         *    all occurrences of characters within them
         */

        // Step 1: Create an array to store the last index of each character
        // Using array instead of HashMap for better performance
        int[] lastOccurrence = new int[26];

        // Traverse the string to record the last occurrence of each character
        // We need this to know how far we must extend each partition
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            lastOccurrence[c - 'a'] = i;
        }

        List<Integer> result = new ArrayList<>();  // Will store the length of each partition
        int start = 0;  // Start index of current partition
        int end = 0;    // End index of current partition (farthest last occurrence)

        // Step 2: Scan through the string to determine partition boundaries
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            // Update the end of current partition to be the maximum of:
            // - current end
            // - last occurrence of current character
            end = Math.max(end, lastOccurrence[c - 'a']);

            // If we've reached the end index, we've completed a valid partition
            // All characters in [start, end] have their last occurrences ≤ end
            if (i == end) {
                // Calculate length of this partition and add to result
                result.add(end - start + 1);
                // Start a new partition at the next index
                start = i + 1;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- First pass to build the `last` map: O(n)
- Second pass to determine partitions: O(n)
- Total: O(2n) = O(n)

**Space Complexity: O(1)** for the character frequency tracking

- We only store the last occurrence index for each character
- With lowercase English letters only, this is at most 26 entries
- Even with Unicode, it's O(k) where k is the number of unique characters, which is bounded by n but typically much smaller

## Common Mistakes

1. **Forgetting to update `end` correctly**: Some candidates only update `end` when they see a new character, but you must check `max(end, last[char])` for EVERY character in the current partition, even if you've seen it before.

2. **Off-by-one errors in partition length**: When calculating `end - start + 1`, remember that both indices are inclusive. If `start = 5` and `end = 10`, the partition has 6 characters, not 5.

3. **Not resetting `start` after completing a partition**: After adding a partition to the result, you must set `start = i + 1` (not `start = i`) to begin the next partition at the correct position.

4. **Using the wrong data structure for `last`**: While a hash map works, for lowercase English letters specifically, an array of size 26 is more efficient and cleaner. In Java, `last[c - 'a']` is faster than `map.get(c)`.

## When You'll See This Pattern

This problem uses a **greedy interval merging** pattern similar to:

1. **Merge Intervals (LeetCode 56)**: Both problems involve finding overlapping ranges and merging them. In Partition Labels, each character defines an interval from its first to last occurrence, and we merge overlapping intervals.

2. **Optimal Partition of String (LeetCode 2405)**: A variation where you partition a string into substrings with unique characters—similar greedy scanning approach.

3. **Jump Game II (LeetCode 45)**: The scanning process resembles finding the minimum jumps to reach the end, where `end` represents the farthest you can reach from current position.

The core pattern is: when you need to process elements in order while maintaining some "farthest reach" property, consider tracking an `end` pointer that gets updated as you encounter new elements.

## Key Takeaways

1. **Greedy works when local optimal choices lead to global optimum**: By always extending partitions to include all occurrences of current characters, we ensure no character appears in multiple partitions while maximizing the number of partitions.

2. **Precomputing last occurrences enables single-pass solution**: Many string problems benefit from preprocessing character positions before the main logic.

3. **The interval merging pattern appears frequently**: When a problem involves "all occurrences" or "complete ranges," think about representing each element as an interval and merging overlapping ones.

Related problems: [Merge Intervals](/problem/merge-intervals), [Optimal Partition of String](/problem/optimal-partition-of-string)
