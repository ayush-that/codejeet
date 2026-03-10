---
title: "How to Solve Reorganize String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reorganize String. Medium difficulty, 56.8% acceptance rate. Topics: Hash Table, String, Greedy, Sorting, Heap (Priority Queue)."
date: "2027-03-14"
category: "dsa-patterns"
tags: ["reorganize-string", "hash-table", "string", "greedy", "medium"]
---

# How to Solve Reorganize String

The problem asks us to rearrange a string so that no two identical characters are adjacent. If such a rearrangement exists, we return any valid arrangement; otherwise, we return an empty string. What makes this problem interesting is that it's not just about counting characters—it's about strategically placing them to avoid conflicts, which requires careful planning and the right data structure.

## Visual Walkthrough

Let's walk through an example: `s = "aab"`.

**Step 1: Count character frequencies**

- 'a': 2 occurrences
- 'b': 1 occurrence

**Step 2: Check feasibility**
The most frequent character is 'a' with count 2. For a valid arrangement, the maximum frequency any character can have is `(n + 1) // 2` where `n` is the string length. Here, `n = 3`, so `(3 + 1) // 2 = 2`. Since 'a' has frequency 2, which equals the limit, a valid arrangement _might_ be possible.

**Step 3: Build the arrangement**
We want to place the most frequent characters first to avoid running out of space. Think of it like filling alternating positions:

1. Start with 'a' (most frequent): `a _ _`
2. Next, we can't use 'a' again immediately, so use 'b': `a b _`
3. Now we can use 'a' again: `a b a`

Result: `"aba"` — no adjacent duplicates, so it's valid.

Now consider `s = "aaab"`:

- 'a': 3, 'b': 1
- `n = 4`, maximum allowed frequency = `(4 + 1) // 2 = 2.5` → 2 (integer division gives 2)
- 'a' has frequency 3 > 2, so no valid arrangement exists.

## Brute Force Approach

A naive approach would generate all permutations of the string and check each one for adjacent duplicates. For each permutation (O(n!) possibilities), we'd scan it (O(n)) to verify no adjacent characters are identical.

This is clearly infeasible for any reasonable `n`. Even for `n = 10`, we'd have 3.6 million permutations to check. The problem constraints (up to 500 characters) make this approach impossible.

What might a candidate try before realizing they need a better approach? They might try a greedy approach without the right data structure: repeatedly pick any character different from the last one placed. But without prioritizing the most frequent characters, this can fail even when a solution exists.

For example, with `s = "aaabbc"`:

- If we start with 'b', then 'a', then 'c', we might get stuck: `b a c a _ _` and we have two 'a's left but can't place them without adjacency.

## Optimized Approach

The key insight is that we should always place the **most frequent remaining character** (that isn't the same as the last placed character). This ensures we don't run out of "slots" for high-frequency characters.

Think about it: if we have character 'a' appearing 5 times in a 10-character string, we need to spread those 'a's out. The best way is to place them in every other position: `a _ a _ a _ a _ a _`. If we wait too long to place them, we might not have enough separated positions left.

**Data structure choice**: We need to repeatedly get the most frequent character while also tracking what was just placed. A **max-heap** (priority queue) is perfect for this:

1. Build a max-heap where each entry is `(-count, character)` so the most frequent character is at the top
2. While the heap isn't empty:
   - Pop the most frequent character (different from last placed)
   - Add it to result
   - Decrease its count
   - Store the previous character (with its updated count) to add back to heap later (but only if count > 0)
   - Push the new top character to result, repeating

We need to be careful: after using a character, we can't immediately use it again, so we need to temporarily hold it aside while we use the next most frequent character.

**Feasibility check**: Before starting, we can quickly check if any character appears more than `(n + 1) // 2` times. If so, return `""` immediately.

## Optimal Solution

Here's the step-by-step algorithm:

1. Count character frequencies using a hash map
2. Check if any frequency exceeds `(len(s) + 1) // 2` → if yes, return `""`
3. Build a max-heap (priority queue) with `(-count, char)` pairs
4. Initialize result as empty list and `prev_char, prev_count = None, 0`
5. While heap is not empty:
   - Pop the most frequent character (different from previous)
   - Append to result, decrement its count
   - If `prev_count > 0`, push `prev_char` back to heap
   - Set `prev_char, prev_count` to current char and its new count
6. Convert result list to string and return

<div class="code-group">

```python
# Time: O(n log k) where k is number of unique characters (max 26 for lowercase letters)
# Space: O(k) for heap and frequency map
import heapq
from collections import Counter

def reorganizeString(s: str) -> str:
    # Step 1: Count character frequencies
    freq = Counter(s)
    n = len(s)

    # Step 2: Check if rearrangement is possible
    # The most frequent character can appear at most (n+1)//2 times
    max_freq = max(freq.values())
    if max_freq > (n + 1) // 2:
        return ""

    # Step 3: Build max-heap using negative counts for max-heap behavior
    # Each element is (-count, character)
    heap = [(-count, char) for char, count in freq.items()]
    heapq.heapify(heap)  # Convert list to heap in O(k) time

    # Step 4: Initialize result and previous character tracker
    result = []
    prev_char, prev_count = None, 0

    # Step 5: Build the rearranged string
    while heap:
        # Get the most frequent character (different from previous)
        count, char = heapq.heappop(heap)

        # Append current character to result
        result.append(char)

        # If we have a previous character waiting to be re-added to heap
        if prev_count < 0:  # Remember: counts are negative in heap
            heapq.heappush(heap, (prev_count, prev_char))

        # Update current character's count and store as previous
        # We add 1 because count is negative (e.g., -3 becomes -2)
        prev_count, prev_char = count + 1, char

    # Step 6: Handle the last character if it still has count remaining
    # This shouldn't happen if we checked feasibility properly, but good practice
    if prev_count < 0:
        # This would mean we have a character left but no slot for it
        return ""

    return "".join(result)
```

```javascript
// Time: O(n log k) where k is number of unique characters
// Space: O(k) for heap and frequency map
function reorganizeString(s) {
  // Step 1: Count character frequencies
  const freq = new Map();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Step 2: Check if rearrangement is possible
  const n = s.length;
  let maxFreq = 0;
  for (const count of freq.values()) {
    maxFreq = Math.max(maxFreq, count);
  }
  if (maxFreq > Math.floor((n + 1) / 2)) {
    return "";
  }

  // Step 3: Build max-heap (using array and custom comparator)
  // In JavaScript, we'll simulate max-heap with array and sort
  const heap = Array.from(freq.entries()).map(([char, count]) => ({
    char,
    count,
  }));

  // Custom comparator for max-heap (higher count first)
  heap.sort((a, b) => b.count - a.count);

  // Step 4: Initialize result and previous character tracker
  const result = [];
  let prev = null;

  // Step 5: Build the rearranged string
  while (heap.length > 0) {
    // Get the most frequent character (from front of sorted array)
    const current = heap.shift();

    // Append to result
    result.push(current.char);

    // If there's a previous character with remaining count, add it back
    if (prev !== null && prev.count > 0) {
      // Find correct position to insert to maintain max-heap order
      let insertIndex = 0;
      while (insertIndex < heap.length && heap[insertIndex].count > prev.count) {
        insertIndex++;
      }
      heap.splice(insertIndex, 0, prev);
    }

    // Update current character's count and store as previous
    current.count--;
    prev = current.count > 0 ? current : null;
  }

  // Step 6: Check if we have a character left without a slot
  if (prev !== null && prev.count > 0) {
    return "";
  }

  return result.join("");
}
```

```java
// Time: O(n log k) where k is number of unique characters
// Space: O(k) for heap and frequency map
import java.util.*;

class Solution {
    public String reorganizeString(String s) {
        // Step 1: Count character frequencies
        Map<Character, Integer> freq = new HashMap<>();
        for (char c : s.toCharArray()) {
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }

        // Step 2: Check if rearrangement is possible
        int n = s.length();
        int maxFreq = 0;
        for (int count : freq.values()) {
            maxFreq = Math.max(maxFreq, count);
        }
        if (maxFreq > (n + 1) / 2) {
            return "";
        }

        // Step 3: Build max-heap (priority queue with custom comparator)
        // We use a max-heap based on character frequency
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[1] - a[1]);

        // Add all characters to heap: [charAscii, count]
        for (Map.Entry<Character, Integer> entry : freq.entrySet()) {
            heap.offer(new int[]{entry.getKey(), entry.getValue()});
        }

        // Step 4: Initialize result and previous character tracker
        StringBuilder result = new StringBuilder();
        int[] prev = null; // [charAscii, count]

        // Step 5: Build the rearranged string
        while (!heap.isEmpty()) {
            // Get the most frequent character
            int[] current = heap.poll();

            // Append to result (convert ASCII to char)
            result.append((char) current[0]);

            // If previous character exists and has count > 0, add it back
            if (prev != null && prev[1] > 0) {
                heap.offer(prev);
            }

            // Update current character's count and store as previous
            current[1]--;
            prev = current;
        }

        // Step 6: Check if we have a character left without a slot
        if (prev != null && prev[1] > 0) {
            return "";
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log k)

- Counting frequencies: O(n) where n is string length
- Heap operations: We perform at most n insertions and n extractions from the heap
- Each heap operation is O(log k) where k is the number of unique characters
- For lowercase English letters, k ≤ 26, so log k ≤ log 26 ≈ 4.7 (effectively constant)
- Overall: O(n + n log k) = O(n log k)

**Space Complexity**: O(k)

- Frequency map: O(k) to store counts for each unique character
- Heap: O(k) to store the character-frequency pairs
- Result string: O(n) but this is output, not auxiliary space
- Auxiliary space: O(k) where k ≤ 26 for lowercase letters

## Common Mistakes

1. **Forgetting the feasibility check**: Some candidates jump straight into building the arrangement without checking if `max_freq > (n + 1) // 2`. This leads to infinite loops or incorrect results when no solution exists.

2. **Not handling the "previous character" correctly**: After using a character, you can't immediately use it again. You must store it aside and use a different character next. A common error is pushing the character back to the heap immediately after use.

3. **Using the wrong data structure**: Trying to sort the characters once and then iterate through them won't work because frequencies change as we use characters. We need a dynamic structure (heap) that always gives us the most frequent remaining character.

4. **Off-by-one in the feasibility formula**: The correct formula is `(n + 1) // 2`, not `n // 2` or `(n - 1) // 2`. For example, with `n = 3`, maximum frequency is 2, not 1.

## When You'll See This Pattern

This "greedy with max-heap" pattern appears in several scheduling problems:

1. **Task Scheduler (LeetCode 621)**: Very similar—schedule tasks with a cooldown period between identical tasks. The solution uses almost identical logic with a heap.

2. **Rearrange String k Distance Apart (LeetCode 358)**: A generalization where identical characters must be at least k apart instead of just 1 apart.

3. **Longest Happy String (LeetCode 1405)**: Construct the longest string with at most two consecutive identical characters from 'a', 'b', 'c' with frequency limits.

The core pattern: when you need to arrange items with constraints on proximity of identical items, and you want to prioritize the most frequent items to avoid running out of slots.

## Key Takeaways

1. **Greedy with priority queue**: When you need to repeatedly select the "best" option according to some criterion (here, highest frequency), a heap/priority queue is often the right choice.

2. **Feasibility check first**: Before attempting to construct a solution, check if it's even possible. In this case, the formula `max_freq ≤ (n + 1) // 2` saves time and prevents errors.

3. **Temporary storage pattern**: When you use an item but can't immediately reuse it, store it aside and bring it back after using a different item. This pattern appears in many scheduling problems.

Related problems: [Rearrange String k Distance Apart](/problem/rearrange-string-k-distance-apart), [Task Scheduler](/problem/task-scheduler), [Longest Happy String](/problem/longest-happy-string)
