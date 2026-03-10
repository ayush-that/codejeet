---
title: "How to Solve Longest Happy String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Happy String. Medium difficulty, 65.5% acceptance rate. Topics: String, Greedy, Heap (Priority Queue)."
date: "2028-08-07"
category: "dsa-patterns"
tags: ["longest-happy-string", "string", "greedy", "heap-(priority-queue)", "medium"]
---

# How to Solve Longest Happy String

This problem asks us to construct the longest possible string using only 'a', 'b', and 'c' where we can't have three consecutive identical characters, and we have limited counts of each letter. What makes this tricky is balancing the greedy approach of using the most frequent character while avoiding creating three in a row. The constraint "at most three consecutive" forces us to think about alternating characters strategically.

## Visual Walkthrough

Let's trace through an example: `a = 1, b = 1, c = 7`

We want to build the longest string possible without "aaa", "bbb", or "ccc". With 7 c's, we might be tempted to use them all, but we can't put three c's together.

**Step-by-step construction:**

1. Start with the most frequent character: 'c' (7 remaining)
   - Add 'c' → "c" (c:6)
2. Add another 'c' → "cc" (c:5)
   - We can't add a third 'c' (would make "ccc")
3. Need to add a different character. 'a' and 'b' both have 1.
   - Add 'b' → "ccb" (b:0, c:5)
4. Now we can use 'c' again. Add 'c' → "ccbc" (c:4)
5. Add 'c' → "ccbcc" (c:3)
   - Can't add third 'c' (would make "ccc")
6. Add 'a' → "ccbcca" (a:0, c:3)
7. Add 'c' → "ccbccac" (c:2)
8. Add 'c' → "ccbccacc" (c:1)
   - Can't add third 'c'
9. No 'a' or 'b' left, so we stop.

Final result: "ccbccacc" (length 8). We used all c's (7), a (1), and b (1).

The key insight: always try to use the most frequent character, but if we've used it twice consecutively, we must use a different character next.

## Brute Force Approach

A naive approach would be to generate all possible strings using at most `a` 'a's, `b` 'b's, and `c` 'c's, check which ones don't contain "aaa", "bbb", or "ccc", and return the longest valid one.

This is exponential in the sum of `a`, `b`, and `c` (roughly 3^(a+b+c) possibilities). Even for modest inputs like (10, 10, 10), that's 3^30 ≈ 2×10^14 possibilities - completely infeasible.

What candidates might try: a simple greedy approach that always picks the character with the highest remaining count. But this fails because after using the same character twice, we might not have any other characters left to break the sequence, even though we could have planned better earlier.

## Optimized Approach

The optimal solution uses a **max-heap (priority queue)** to always access the character with the highest remaining count. However, we need to be careful about consecutive characters.

**Key Insight:** We should use the most frequent character, but if we've just used it twice in a row, we should use the second most frequent character instead. This prevents creating three consecutive identical characters while maximizing length.

**Algorithm:**

1. Use a max-heap where each entry is `(count, character)`. Python's heap is min-heap by default, so we store `(-count, character)`.
2. While there are characters available:
   - Try to use the most frequent character (top of heap)
   - If the last two characters in our result are the same as this character, we can't use it (would make three in a row)
   - In that case, use the second most frequent character instead
   - If no alternative character is available, we must stop
3. After using a character, decrement its count and push it back to the heap if count > 0
4. The heap ensures we always have access to the character with highest remaining count in O(log n) time

**Why this works:** By always preferring the most frequent character (when safe), we maximize the chances of using all characters. The heap gives us efficient access to both the most and second most frequent characters when we need to avoid three in a row.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log 3) = O(n) where n = a + b + c
# Space: O(1) for the heap (fixed size of 3)
def longestDiverseString(self, a: int, b: int, c: int) -> str:
    # Use max-heap: store negative counts since Python has min-heap by default
    heap = []
    if a > 0:
        heapq.heappush(heap, (-a, 'a'))
    if b > 0:
        heapq.heappush(heap, (-b, 'b'))
    if c > 0:
        heapq.heappush(heap, (-c, 'c'))

    result = []

    while heap:
        # Get the character with highest remaining count
        count1, char1 = heapq.heappop(heap)

        # Check if last two characters are the same as char1
        if len(result) >= 2 and result[-1] == result[-2] == char1:
            # Can't use char1, need to try second most frequent
            if not heap:
                break  # No alternative character available

            # Get second most frequent character
            count2, char2 = heapq.heappop(heap)
            result.append(char2)
            count2 += 1  # Remember: counts are negative

            # Push back second character if still has count remaining
            if count2 < 0:
                heapq.heappush(heap, (count2, char2))

            # Push back first character (we didn't use it)
            heapq.heappush(heap, (count1, char1))
        else:
            # Safe to use the most frequent character
            result.append(char1)
            count1 += 1  # Increment (actually decrement magnitude since negative)

            # Push back if still has count remaining
            if count1 < 0:
                heapq.heappush(heap, (count1, char1))

    return ''.join(result)
```

```javascript
// Time: O(n log 3) = O(n) where n = a + b + c
// Space: O(1) for the heap (fixed size of 3)
function longestDiverseString(a, b, c) {
  // Max-heap implementation using array and sorting
  const heap = [];
  if (a > 0) heap.push([a, "a"]);
  if (b > 0) heap.push([b, "b"]);
  if (c > 0) heap.push([c, "c"]);

  // Convert to max-heap: sort descending by count
  heap.sort((x, y) => y[0] - x[0]);

  const result = [];

  while (heap.length > 0) {
    // Get character with highest remaining count
    const [count1, char1] = heap.shift();

    // Check if last two characters are the same as char1
    if (
      result.length >= 2 &&
      result[result.length - 1] === char1 &&
      result[result.length - 2] === char1
    ) {
      // Can't use char1, need to try second most frequent
      if (heap.length === 0) {
        break; // No alternative character available
      }

      // Get second most frequent character
      const [count2, char2] = heap.shift();
      result.push(char2);

      // Push back second character if still has count remaining
      if (count2 - 1 > 0) {
        heap.push([count2 - 1, char2]);
      }

      // Push back first character (we didn't use it)
      heap.push([count1, char1]);

      // Re-sort to maintain max-heap property
      heap.sort((x, y) => y[0] - x[0]);
    } else {
      // Safe to use the most frequent character
      result.push(char1);

      // Push back if still has count remaining
      if (count1 - 1 > 0) {
        heap.push([count1 - 1, char1]);
        // Re-sort to maintain max-heap property
        heap.sort((x, y) => y[0] - x[0]);
      }
    }
  }

  return result.join("");
}
```

```java
// Time: O(n log 3) = O(n) where n = a + b + c
// Space: O(1) for the heap (fixed size of 3)
public String longestDiverseString(int a, int b, int c) {
    // Max-heap using PriorityQueue with custom comparator
    PriorityQueue<int[]> heap = new PriorityQueue<>((x, y) -> y[0] - x[0]);

    if (a > 0) heap.offer(new int[]{a, 'a'});
    if (b > 0) heap.offer(new int[]{b, 'b'});
    if (c > 0) heap.offer(new int[]{c, 'c'});

    StringBuilder result = new StringBuilder();

    while (!heap.isEmpty()) {
        // Get character with highest remaining count
        int[] first = heap.poll();
        int count1 = first[0];
        char char1 = (char) first[1];

        // Check if last two characters are the same as char1
        if (result.length() >= 2 &&
            result.charAt(result.length() - 1) == char1 &&
            result.charAt(result.length() - 2) == char1) {

            // Can't use char1, need to try second most frequent
            if (heap.isEmpty()) {
                break;  // No alternative character available
            }

            // Get second most frequent character
            int[] second = heap.poll();
            int count2 = second[0];
            char char2 = (char) second[1];

            result.append(char2);
            count2--;

            // Push back second character if still has count remaining
            if (count2 > 0) {
                heap.offer(new int[]{count2, char2});
            }

            // Push back first character (we didn't use it)
            heap.offer(first);
        } else {
            // Safe to use the most frequent character
            result.append(char1);
            count1--;

            // Push back if still has count remaining
            if (count1 > 0) {
                heap.offer(new int[]{count1, char1});
            }
        }
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n = a + b + c (total length of the result string).

- Each iteration of the while loop adds one character to the result
- Heap operations (push/pop) take O(log 3) = O(1) time since the heap only ever contains at most 3 elements
- Total: O(n × 1) = O(n)

**Space Complexity:** O(1) for the heap (fixed size of 3) plus O(n) for the result string.

- The heap stores at most 3 entries regardless of input sizes
- The result string requires O(n) space to store the output
- Total auxiliary space: O(1), total including output: O(n)

## Common Mistakes

1. **Forgetting to check if heap is empty when trying to get second character:** When we can't use the most frequent character (because it would create three in a row), we need to check if there's actually a second character available. If not, we should stop.

2. **Not pushing characters back to the heap after use:** After using a character (and decrementing its count), if it still has remaining count > 0, we must push it back to the heap. Otherwise, we lose track of it.

3. **Incorrect heap comparator:** In Python, heaps are min-heaps by default, so we need to store negative counts. In Java/JavaScript, we need to ensure the comparator sorts by descending count (max-heap).

4. **Off-by-one in consecutive character check:** The condition should be `len(result) >= 2 and result[-1] == result[-2] == char1`. Some candidates check `len(result) > 2` or compare wrong indices.

## When You'll See This Pattern

This greedy-with-heap pattern appears in problems where we need to arrange items with constraints on adjacency or frequency:

1. **Reorganize String (LeetCode 767):** Very similar - rearrange string so no two adjacent characters are the same. Uses the same max-heap approach.

2. **Task Scheduler (LeetCode 621):** Schedule tasks with cooldown period. The optimal solution uses a max-heap to always schedule the task with most remaining instances, similar to avoiding consecutive characters here.

3. **Rearrange String k Distance Apart (LeetCode 358):** Extension of Reorganize String where same characters must be at least k apart. Uses the same heap approach with a queue to track when characters become available again.

The pattern: when you need to arrange items while maintaining separation constraints, and you want to maximize/minimize something (like length or efficiency), a max-heap that always gives you the most frequent/urgent item is often the right approach.

## Key Takeaways

1. **Greedy with priority queue:** When you need to make a series of choices (which character to add next) and want to optimize globally, a greedy approach that always picks the "best" available option (using a heap) often works.

2. **Constraint handling:** The trick with this problem is handling the "no three consecutive" constraint. The solution: when you can't use the best option, use the second best. This pattern of having a fallback option is common in constraint-satisfaction problems.

3. **Fixed-size heaps are O(1):** When your heap has a fixed maximum size (like 3 characters here), heap operations are O(log k) = O(1). Don't be afraid to use heaps even in O(n) solutions when k is small.

Related problems: [Reorganize String](/problem/reorganize-string)
