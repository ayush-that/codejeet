---
title: "Medium Uber Interview Questions: Strategy Guide"
description: "How to tackle 224 medium difficulty questions from Uber — patterns, time targets, and practice tips."
date: "2032-01-12"
category: "tips"
tags: ["uber", "medium", "interview prep"]
---

Uber’s interview process is known for its practical, business‑focused problems. Of their 381 tagged questions, 224 are rated Medium—that’s nearly 60%. While Easy problems often test basic syntax and simple logic, and Hard problems dive into complex optimization, **Medium problems at Uber are where you prove you can translate a real‑world scenario into clean, efficient code under time pressure.** They typically involve multi‑step reasoning, handling non‑trivial edge cases, and applying a known algorithm or data structure to a slightly novel situation. The jump from Easy to Medium isn’t just about difficulty; it’s about demonstrating you can own a problem from clarification to implementation.

## Common Patterns and Templates

Uber’s Medium problems heavily favor **array/string manipulation, hash maps, and graph/tree traversal.** Many questions are variations on classic LeetCode patterns, but with a twist that mirrors a ride‑hailing context—think matching riders to drivers, calculating ETAs, or optimizing routes. The single most common pattern you’ll encounter is **sliding window with a hash map** for counting or validation. This pattern appears in problems about substring constraints, frequency limits, or contiguous subarrays.

Here’s a reusable template for the sliding‑window‑with‑counter pattern:

<div class="code-group">

```python
def sliding_window_with_counter(s: str, t: str) -> str:
    from collections import Counter

    # Frequency map of target
    target_count = Counter(t)
    # Count of unique characters needed to satisfy target
    required = len(target_count)

    # Sliding window pointers and formed chars count
    left = 0
    formed = 0
    window_count = {}

    # Result tracking (adjust as needed)
    min_len = float('inf')
    result = ""

    for right, char in enumerate(s):
        # Expand window: add right char
        window_count[char] = window_count.get(char, 0) + 1
        if window_count[char] == target_count.get(char, 0):
            formed += 1

        # Contract window while condition is satisfied
        while formed == required and left <= right:
            # Update result if current window is better
            curr_len = right - left + 1
            if curr_len < min_len:
                min_len = curr_len
                result = s[left:right+1]

            # Remove left char
            left_char = s[left]
            window_count[left_char] -= 1
            if window_count[left_char] < target_count.get(left_char, 0):
                formed -= 1
            left += 1

    return result

# Time: O(n) | Space: O(k) where k is the size of the character set
```

```javascript
function slidingWindowWithCounter(s, t) {
  const targetCount = new Map();
  for (const ch of t) {
    targetCount.set(ch, (targetCount.get(ch) || 0) + 1);
  }
  const required = targetCount.size;

  let left = 0,
    formed = 0;
  const windowCount = new Map();
  let minLen = Infinity,
    result = "";

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    windowCount.set(char, (windowCount.get(char) || 0) + 1);
    if (windowCount.get(char) === targetCount.get(char)) {
      formed++;
    }

    while (formed === required && left <= right) {
      const currLen = right - left + 1;
      if (currLen < minLen) {
        minLen = currLen;
        result = s.substring(left, right + 1);
      }

      const leftChar = s[left];
      windowCount.set(leftChar, windowCount.get(leftChar) - 1);
      if (windowCount.get(leftChar) < (targetCount.get(leftChar) || 0)) {
        formed--;
      }
      left++;
    }
  }

  return result;
}

// Time: O(n) | Space: O(k)
```

```java
public String slidingWindowWithCounter(String s, String t) {
    Map<Character, Integer> targetCount = new HashMap<>();
    for (char ch : t.toCharArray()) {
        targetCount.put(ch, targetCount.getOrDefault(ch, 0) + 1);
    }
    int required = targetCount.size();

    int left = 0, formed = 0;
    Map<Character, Integer> windowCount = new HashMap<>();
    int minLen = Integer.MAX_VALUE;
    String result = "";

    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        windowCount.put(ch, windowCount.getOrDefault(ch, 0) + 1);
        if (windowCount.get(ch).equals(targetCount.get(ch))) {
            formed++;
        }

        while (formed == required && left <= right) {
            int currLen = right - left + 1;
            if (currLen < minLen) {
                minLen = currLen;
                result = s.substring(left, right + 1);
            }

            char leftChar = s.charAt(left);
            windowCount.put(leftChar, windowCount.get(leftChar) - 1);
            if (windowCount.get(leftChar) < targetCount.getOrDefault(leftChar, 0)) {
                formed--;
            }
            left++;
        }
    }

    return result;
}

// Time: O(n) | Space: O(k)
```

</div>

This template directly applies to problems like **Minimum Window Substring (#76)** and **Longest Substring Without Repeating Characters (#3)**, both of which have Uber‑variants.

## Time Benchmarks and What Interviewers Look For

For a 45‑minute interview slot, you should aim to solve a Medium problem in **25‑30 minutes**, leaving time for discussion and a follow‑up. Uber interviewers are evaluating:

1. **Clarification skills:** They want to see you ask about input constraints, edge cases (empty strings, large inputs, negative numbers), and output format before coding.
2. **Code quality:** Variable names should be descriptive (`windowCount`, not `wc`). Use helper functions for repeated logic. Comment briefly on non‑obvious steps.
3. **Trade‑off awareness:** Be prepared to discuss time‑space trade‑offs. For example, “We could use an array instead of a hash map if we know the character set is ASCII.”
4. **Communication:** Narrate your thought process. If you hit a snag, talk through your debugging—interviewers care more about your problem‑solving approach than a perfect first draft.

## Key Differences from Easy Problems

Easy problems often have a one‑pass solution or a single data structure. Medium problems require you to **combine techniques.** For instance, you might need a hash map _and_ a sliding window, or a heap _and_ a hash map. The mindset shift is from “find the trick” to **orchestrating multiple moving parts while maintaining efficiency.** You also need to handle more nuanced edge cases: what if the input is empty? What if all values are the same? What about integer overflow?

## Specific Patterns for Medium

Beyond sliding window, two other patterns are especially common at Uber:

**1. Interval Merging and Scheduling**
Problems like **Merge Intervals (#56)** and **Meeting Rooms II (#253)** appear frequently because they model ride scheduling and driver availability. The core idea is to sort intervals by start time and then iterate, merging or counting overlaps.

**2. Graph BFS for Shortest Path**
Uber’s domain is built on networks. Problems like **Word Ladder (#127)** or grid‑based shortest path (#1293) test your ability to model a scenario as a graph and run BFS. Remember: BFS gives the shortest path in unweighted graphs.

<div class="code-group">

```python
# BFS template for shortest path in unweighted graph
from collections import deque

def bfs_shortest_path(start, target, adj_list):
    if start == target:
        return 0

    queue = deque([start])
    visited = {start}
    steps = 0

    while queue:
        for _ in range(len(queue)):
            node = queue.popleft()
            if node == target:
                return steps
            for neighbor in adj_list[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        steps += 1

    return -1  # No path

# Time: O(V + E) | Space: O(V)
```

</div>

## Practice Strategy

Don’t just solve randomly. Focus on **pattern‑based practice**:

1. **Start with the core patterns:** Sliding window, intervals, BFS/DFS, hash map + heap. Do 5‑7 problems of each pattern from Uber’s Medium list.
2. **Mix in variations:** Once comfortable, tackle problems that combine patterns, like **Top K Frequent Elements (#347)** (hash map + heap) or **Insert Interval (#57)** (interval manipulation).
3. **Daily targets:** Aim for 2‑3 Medium problems per day, but spend at least 30 minutes reviewing and optimizing your solution afterward. Write out the time/space complexity and discuss trade‑outs loud.
4. **Simulate interviews:** Once a week, pick a new Uber Medium problem and solve it with a 30‑minute timer, verbalizing your thoughts as you would in an interview.

The goal is to reach a point where you recognize the underlying pattern within the first minute of reading a problem. That pattern recognition, combined with clean implementation, is what gets you past the Medium‑level screen.

[Practice Medium Uber questions](/company/uber/medium)
