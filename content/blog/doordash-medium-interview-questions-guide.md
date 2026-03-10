---
title: "Medium DoorDash Interview Questions: Strategy Guide"
description: "How to tackle 51 medium difficulty questions from DoorDash — patterns, time targets, and practice tips."
date: "2032-05-29"
category: "tips"
tags: ["doordash", "medium", "interview prep"]
---

DoorDash’s Medium interview questions are where the real interview begins. While Easy problems often test basic syntax and simple logic, Medium problems at DoorDash are designed to assess your ability to design and implement efficient algorithms under moderate constraints. Out of their 87 total tagged problems, 51 are Medium—this is the core of their technical screen. What separates them? They typically involve combining 2-3 fundamental concepts (like a hash map with a sliding window), require careful handling of edge cases specific to business logic (e.g., delivery time windows, geospatial data), and demand a solution that is optimal, but not necessarily requiring advanced data structures like segment trees. The jump from Easy to Medium here is less about raw difficulty and more about **integration**—can you weave together simple parts into a correct, robust whole?

## Common Patterns and Templates

DoorDash’s Medium problems heavily favor real-world scenarios mapped onto classic patterns. You’ll see a lot of:

- **Array/String manipulation with ordering constraints** (simulating delivery batches or route optimization)
- **Hash Map + Sliding Window** for substring or subarray problems related to orders or time series
- **Simulation/Iteration with state tracking** (managing the state of multiple concurrent deliveries)
- **Graph traversal (BFS/DFS) on implicit grids** for warehouse or map pathfinding

The single most common template is the **Sliding Window with a Hash Map for counting**. This pattern appears in problems like finding the longest substring with K distinct characters (a proxy for "unique delivery addresses in a route window") or subarrays with a certain sum. Here’s a reusable template:

<div class="code-group">

```python
def sliding_window_template(s, k):
    """
    Template for problems like "Longest Substring with At Most K Distinct Characters"
    or finding subarrays with exactly K different integers.
    """
    char_count = {}
    left = 0
    max_len = 0

    for right in range(len(s)):
        # 1. Expand window: add right char to counter
        char_count[s[right]] = char_count.get(s[right], 0) + 1

        # 2. Shrink window while condition is invalid
        while len(char_count) > k:  # Condition varies by problem
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1

        # 3. Update answer (often here for "at most K",
        #    or after a separate check for "exactly K")
        max_len = max(max_len, right - left + 1)

    return max_len

# Time: O(n) | Space: O(k) where k is number of distinct keys in map
```

```javascript
function slidingWindowTemplate(s, k) {
  const charCount = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // 1. Expand window
    charCount.set(s[right], (charCount.get(s[right]) || 0) + 1);

    // 2. Shrink while invalid
    while (charCount.size > k) {
      charCount.set(s[left], charCount.get(s[left]) - 1);
      if (charCount.get(s[left]) === 0) {
        charCount.delete(s[left]);
      }
      left++;
    }

    // 3. Update answer
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// Time: O(n) | Space: O(k)
```

```java
public int slidingWindowTemplate(String s, int k) {
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        // 1. Expand window
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);

        // 2. Shrink while invalid
        while (charCount.size() > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) == 0) {
                charCount.remove(leftChar);
            }
            left++;
        }

        // 3. Update answer
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}

// Time: O(n) | Space: O(k)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot, you should aim to solve a DoorDash Medium problem in **25-30 minutes**. This includes understanding the problem, discussing approach, writing code, and testing. The remaining time is for follow-ups or a second question.

Beyond correctness, interviewers are evaluating:

- **Clarity of communication:** Can you explain _why_ you chose an approach, especially the trade-offs? Mention time/space complexity early.
- **Edge case identification:** DoorDash problems often have business-logic edges. For example, if a problem involves delivery times, did you consider overlapping intervals, zero-time deliveries, or maximum capacity?
- **Code quality:** Use meaningful variable names (`deliveryCount` not `cnt`). Write small, pure functions if possible. Include brief comments for complex logic.
- **Testing instinct:** Verbally walk through a small example with your code. Mention how you’d test: “I’d check empty input, single element, all identical elements, and the maximum constraint.”

## Key Differences from Easy Problems

Easy problems at DoorDash often require a single pass or a straightforward application of a data structure (e.g., using a set to find duplicates). Medium problems introduce **multiple moving parts** that must be synchronized. The mindset shift is from “what structure solves this?” to “how do I manage state over time?”

New techniques required:

- **Two-pointers with asymmetric movement** (like fast-slow pointers for cycle detection)
- **Prefix sums or running totals** for subarray problems (e.g., number of subarrays summing to K)
- **Simulation with priority queues** to handle ordering by time or priority
- **Graph BFS for shortest path in unweighted grids** (common in warehouse navigation problems)

You must now consider **optimization constraints**—an O(n²) solution might work for small n in an Easy problem, but Medium problems often have constraints requiring O(n log n) or O(n).

## Specific Patterns for Medium

**1. Interval Scheduling with Sorting**
Problems like Merge Intervals (#56) or Non-overlapping Intervals (#435) appear in scheduling delivery windows. The pattern: sort by start time, then iterate, merging or counting overlaps.

**2. BFS on Implicit Graph for Shortest Path**
When given a grid representing a map or warehouse with obstacles, BFS finds the shortest path. This is core to delivery route planning.

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(grid, start, target):
    if not grid:
        return -1
    rows, cols = len(grid), len(grid[0])
    directions = [(1,0),(-1,0),(0,1),(0,-1)]
    queue = deque([(start[0], start[1], 0)])  # (row, col, distance)
    visited = set([(start[0], start[1])])

    while queue:
        r, c, dist = queue.popleft()
        if (r, c) == target:
            return dist
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != '#' and (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return -1

# Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

**3. Hash Map with Precomputation for Subarray Sum**
For problems like Subarray Sum Equals K (#560), use a hash map to store prefix sums. This transforms an O(n²) brute force into O(n).

## Practice Strategy

Don’t just solve randomly. Follow this plan:

1. **Pattern-first learning:** Spend 2-3 days on each core pattern above. Solve 3-4 DoorDash Medium problems for each pattern.
2. **Order by frequency:** Start with Sliding Window and Interval problems, then move to BFS and Prefix Sum.
3. **Daily targets:** Solve 2-3 Medium problems per day. For each, time yourself (30 minutes max). Then, even if you solve it, review the optimal solution and note any edge cases you missed.
4. **Simulate interviews:** Once a week, do a mock interview with a friend using a DoorDash Medium problem you haven’t seen. Practice talking through your reasoning aloud.

Focus on problems like: Longest Substring Without Repeating Characters (#3), Merge Intervals (#56), Number of Islands (#200), and Subarray Sum Equals K (#560). These embody the patterns DoorDash uses.

[Practice Medium DoorDash questions](/company/doordash/medium)
