---
title: "How to Solve Lexicographically Minimum String After Removing Stars — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lexicographically Minimum String After Removing Stars. Medium difficulty, 51.0% acceptance rate. Topics: Hash Table, String, Stack, Greedy, Heap (Priority Queue)."
date: "2027-02-17"
category: "dsa-patterns"
tags:
  [
    "lexicographically-minimum-string-after-removing-stars",
    "hash-table",
    "string",
    "stack",
    "medium",
  ]
---

# How to Solve Lexicographically Minimum String After Removing Stars

This problem asks us to repeatedly remove stars from a string, where each star deletion also removes the smallest character to its left. The challenge is that removing characters changes the string, which affects which characters are "to the left" of subsequent stars. This creates a dynamic problem where we need to efficiently find and remove the smallest eligible character each time.

## Visual Walkthrough

Let's trace through an example: `s = "aaba*"`

**Step 1:** The string is `"aaba*"`. The leftmost star is at position 4 (0-indexed). To its left, we have characters: `'a'` (pos 0), `'a'` (pos 1), `'b'` (pos 2), `'a'` (pos 3). The smallest character is `'a'`, and we need to remove the leftmost occurrence of `'a'`, which is at position 0.

Remove star at position 4 and `'a'` at position 0: `"aaba*"` → `"aba"`

**Step 2:** Now we have `"aba"`. There are no more stars, so we're done. The result is `"aba"`.

But wait — let's try another example to see the pattern: `s = "ab*c*d*"`

**Step 1:** `"ab*c*d*"` — leftmost star at position 2. Characters to left: `'a'` (pos 0), `'b'` (pos 1). Smallest is `'a'` at position 0.
Remove: `"ab*c*d*"` → `"b*c*d*"`

**Step 2:** `"b*c*d*"` — leftmost star at position 1. Characters to left: `'b'` (pos 0). Smallest is `'b'` at position 0.
Remove: `"b*c*d*"` → `"*c*d*"`

**Step 3:** `"*c*d*"` — leftmost star at position 0. No characters to its left, so just remove the star.
Remove: `"*c*d*"` → `"c*d*"`

**Step 4:** `"c*d*"` — leftmost star at position 1. Characters to left: `'c'` (pos 0). Smallest is `'c'` at position 0.
Remove: `"c*d*"` → `"*d*"`

**Step 5:** `"*d*"` — leftmost star at position 0. No characters to left.
Remove: `"*d*"` → `"d*"`

**Step 6:** `"d*"` — leftmost star at position 1. Characters to left: `'d'` (pos 0).
Remove: `"d*"` → `""`

Result: `""`

The key insight: we need to efficiently find the smallest character to the left of each star, and removing characters changes which indices are "to the left" of subsequent stars.

## Brute Force Approach

A naive approach would simulate the process exactly as described:

1. Convert the string to a list for easier deletion
2. While there are stars in the string:
   - Find the leftmost star
   - Scan left from that star to find the smallest character
   - Find the leftmost occurrence of that smallest character
   - Remove both the star and that character

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def brute_force(s):
    chars = list(s)

    while True:
        # Find leftmost star
        star_idx = -1
        for i in range(len(chars)):
            if chars[i] == '*':
                star_idx = i
                break

        if star_idx == -1:  # No more stars
            break

        # Find smallest character to the left
        smallest_char = '{'  # '{' is after 'z' in ASCII
        for i in range(star_idx):
            if chars[i] != '*' and chars[i] < smallest_char:
                smallest_char = chars[i]

        if smallest_char == '{':  # No character to the left
            del chars[star_idx]
            continue

        # Find leftmost occurrence of smallest_char
        remove_idx = -1
        for i in range(star_idx):
            if chars[i] == smallest_char:
                remove_idx = i
                break

        # Remove both characters
        del chars[max(remove_idx, star_idx)]
        del chars[min(remove_idx, star_idx)]

    return ''.join(chars)
```

```javascript
// Time: O(n²) | Space: O(n)
function bruteForce(s) {
  let chars = s.split("");

  while (true) {
    // Find leftmost star
    let starIdx = -1;
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === "*") {
        starIdx = i;
        break;
      }
    }

    if (starIdx === -1) break; // No more stars

    // Find smallest character to the left
    let smallestChar = "{"; // '{' is after 'z' in ASCII
    for (let i = 0; i < starIdx; i++) {
      if (chars[i] !== "*" && chars[i] < smallestChar) {
        smallestChar = chars[i];
      }
    }

    if (smallestChar === "{") {
      // No character to the left
      chars.splice(starIdx, 1);
      continue;
    }

    // Find leftmost occurrence of smallestChar
    let removeIdx = -1;
    for (let i = 0; i < starIdx; i++) {
      if (chars[i] === smallestChar) {
        removeIdx = i;
        break;
      }
    }

    // Remove both characters
    chars.splice(Math.max(removeIdx, starIdx), 1);
    chars.splice(Math.min(removeIdx, starIdx), 1);
  }

  return chars.join("");
}
```

```java
// Time: O(n²) | Space: O(n)
public String bruteForce(String s) {
    List<Character> chars = new ArrayList<>();
    for (char c : s.toCharArray()) {
        chars.add(c);
    }

    while (true) {
        // Find leftmost star
        int starIdx = -1;
        for (int i = 0; i < chars.size(); i++) {
            if (chars.get(i) == '*') {
                starIdx = i;
                break;
            }
        }

        if (starIdx == -1) break;  // No more stars

        // Find smallest character to the left
        char smallestChar = '{';  // '{' is after 'z' in ASCII
        for (int i = 0; i < starIdx; i++) {
            char current = chars.get(i);
            if (current != '*' && current < smallestChar) {
                smallestChar = current;
            }
        }

        if (smallestChar == '{') {  // No character to the left
            chars.remove(starIdx);
            continue;
        }

        // Find leftmost occurrence of smallestChar
        int removeIdx = -1;
        for (int i = 0; i < starIdx; i++) {
            if (chars.get(i) == smallestChar) {
                removeIdx = i;
                break;
            }
        }

        // Remove both characters
        chars.remove(Math.max(removeIdx, starIdx));
        chars.remove(Math.min(removeIdx, starIdx));
    }

    StringBuilder result = new StringBuilder();
    for (char c : chars) {
        result.append(c);
    }
    return result.toString();
}
```

</div>

**Why this is inefficient:** Each star removal requires O(n) time to find the smallest character and O(n) time to remove characters (since list removal shifts elements). With k stars, this becomes O(k·n) which could be O(n²) in the worst case (when all characters are stars). We need a more efficient approach.

## Optimized Approach

The key insight is that we need to process stars from left to right, and for each star, we need to find the smallest character to its left that hasn't been removed yet. This is similar to maintaining available characters in sorted order.

**Optimal data structure:** A min-heap (priority queue) that stores characters along with their indices. As we scan from left to right:

1. When we see a non-star character, add it to the heap with its index
2. When we see a star:
   - If the heap is empty, just remove the star (no character to delete)
   - Otherwise, remove the smallest character from the heap
   - Mark both the character and star as deleted

**Challenge:** Characters in the heap might have been "overtaken" by stars that appeared after them. A character is only eligible if there's a star to its right that hasn't been processed yet. We need to track which stars are available.

**Better approach:** Process from right to left! This way, when we encounter a star, all characters to its right (which are actually to its left in the original string) have already been seen. We can use a max-heap (or min-heap with negative values) to keep track of the largest characters, but wait — we need the smallest.

Actually, let's think differently: When processing from right to left, each star needs to remove the smallest character to its right (which corresponds to left in original). We can use a min-heap to store characters we've seen.

**Final optimal insight:** Process from right to left, use a min-heap to store characters. When we see a star, pop the smallest character from the heap (if any). When we see a non-star character, add it to the heap. Characters that remain in the heap at the end are part of the result, in their original order.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minString(s):
    """
    Returns the lexicographically minimum string after removing stars.

    Approach: Process from right to left, using a min-heap to track
    available characters. When we see a star, remove the smallest
    available character. Characters not removed form the result.
    """
    import heapq

    heap = []  # Min-heap to store available characters
    result_chars = []  # Characters that will remain in final result

    # Process from right to left
    for i in range(len(s) - 1, -1, -1):
        if s[i] == '*':
            # Star found: remove smallest available character if exists
            if heap:
                heapq.heappop(heap)  # Remove smallest character
            # Note: we don't add the star to result
        else:
            # Non-star character: add to heap for potential removal
            heapq.heappush(heap, s[i])
            # Also track this character for result (we'll reverse later)
            result_chars.append(s[i])

    # Characters in result_chars are in reverse order
    # Only include characters that weren't removed by stars
    # Each heappop in the loop above removed one character from result_chars
    # So we need to take only the first len(heap) characters from result_chars

    # Reverse to get correct order and take only unremoved characters
    result_chars.reverse()
    return ''.join(result_chars[:len(heap)])
```

```javascript
// Time: O(n log n) | Space: O(n)
function minString(s) {
  /**
   * Returns the lexicographically minimum string after removing stars.
   *
   * Approach: Process from right to left, using a min-heap to track
   * available characters. When we see a star, remove the smallest
   * available character. Characters not removed form the result.
   */

  // Min-heap implementation using array
  const heap = [];

  // Helper functions for min-heap
  const heapPush = (char) => {
    heap.push(char);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[i] >= heap[parent]) break;
      [heap[i], heap[parent]] = [heap[parent], heap[i]];
      i = parent;
    }
  };

  const heapPop = () => {
    if (heap.length === 0) return null;
    const min = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;
        if (left < heap.length && heap[left] < heap[smallest]) {
          smallest = left;
        }
        if (right < heap.length && heap[right] < heap[smallest]) {
          smallest = right;
        }
        if (smallest === i) break;
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      }
    }
    return min;
  };

  const resultChars = [];

  // Process from right to left
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === "*") {
      // Star found: remove smallest available character if exists
      if (heap.length > 0) {
        heapPop(); // Remove smallest character
      }
      // Note: we don't add the star to result
    } else {
      // Non-star character: add to heap for potential removal
      heapPush(s[i]);
      // Also track this character for result (we'll reverse later)
      resultChars.push(s[i]);
    }
  }

  // Characters in resultChars are in reverse order
  // Only include characters that weren't removed by stars
  // Each heapPop in the loop above removed one character from resultChars
  // So we need to take only the first heap.length characters from resultChars

  // Reverse to get correct order and take only unremoved characters
  resultChars.reverse();
  return resultChars.slice(0, heap.length).join("");
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.PriorityQueue;
import java.util.Collections;
import java.util.ArrayList;

public String minString(String s) {
    /**
     * Returns the lexicographically minimum string after removing stars.
     *
     * Approach: Process from right to left, using a min-heap to track
     * available characters. When we see a star, remove the smallest
     * available character. Characters not removed form the result.
     */

    // Min-heap to store characters
    PriorityQueue<Character> heap = new PriorityQueue<>();
    ArrayList<Character> resultChars = new ArrayList<>();

    // Process from right to left
    for (int i = s.length() - 1; i >= 0; i--) {
        if (s.charAt(i) == '*') {
            // Star found: remove smallest available character if exists
            if (!heap.isEmpty()) {
                heap.poll();  // Remove smallest character
            }
            // Note: we don't add the star to result
        } else {
            // Non-star character: add to heap for potential removal
            heap.offer(s.charAt(i));
            // Also track this character for result (we'll reverse later)
            resultChars.add(s.charAt(i));
        }
    }

    // Characters in resultChars are in reverse order
    // Only include characters that weren't removed by stars
    // Each poll() in the loop above removed one character from resultChars
    // So we need to take only the first heap.size() characters from resultChars

    // Reverse to get correct order
    Collections.reverse(resultChars);

    // Build result string from unremoved characters
    StringBuilder result = new StringBuilder();
    for (int i = 0; i < heap.size(); i++) {
        result.append(resultChars.get(i));
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- We process each character once: O(n)
- For each character, we perform a heap operation (push or pop): O(log n)
- Total: O(n log n)

**Space Complexity:** O(n)

- The heap can contain up to n characters in the worst case
- The result_chars array stores all non-star characters: O(n)
- Total: O(n)

## Common Mistakes

1. **Processing left to right with a heap:** When processing left to right, you might add characters to the heap before knowing if there's a star to their right that will remove them. This leads to incorrect removals.

2. **Forgetting to handle stars with no characters to their left:** The problem states that if there's no non-star character to the left, just remove the star. Some implementations crash when trying to remove a character from an empty heap.

3. **Incorrect result reconstruction:** After processing, you need to reconstruct the string from the remaining characters in their original order. A common mistake is to just return what's left in the heap, but heap order ≠ original order.

4. **Using the wrong heap type:** We need a min-heap to get the smallest character. Using a max-heap would remove the largest character instead, giving wrong results.

## When You'll See This Pattern

This "process backwards with a heap" pattern appears in problems where you need to make optimal removals based on future elements:

1. **LeetCode 321. Create Maximum Number** - Similar backward processing to build optimal sequences
2. **LeetCode 402. Remove K Digits** - Remove digits to get smallest number, though that uses a stack instead of heap
3. **LeetCode 1673. Find the Most Competitive Subsequence** - Maintain smallest elements while preserving order

The pattern is: when decisions depend on future elements (like stars that will remove characters), process backwards so you know what "future" elements have already been seen.

## Key Takeaways

1. **When future elements affect current decisions, process backwards.** This transforms "what will happen in the future" into "what has already been seen."

2. **Use heaps when you need repeated access to extreme values** (min/max) in a dynamic collection. Here we needed the smallest character among available ones.

3. **Separate tracking from result construction.** We used a heap to track removals and a separate list to preserve original order for the final result.

[Practice this problem on CodeJeet](/problem/lexicographically-minimum-string-after-removing-stars)
