---
title: "Medium Coupang Interview Questions: Strategy Guide"
description: "How to tackle 36 medium difficulty questions from Coupang — patterns, time targets, and practice tips."
date: "2032-09-08"
category: "tips"
tags: ["coupang", "medium", "interview prep"]
---

Medium questions at Coupang are the main event. They form the bulk of their technical interview repertoire, and they're designed to be the primary filter. Unlike Easy questions, which often test basic syntax and single-concept recall, Coupang's Medium problems are almost exclusively about **applying one or two core algorithms to a slightly novel or disguised problem.** The difficulty doesn't come from inventing a new data structure; it comes from recognizing which standard tool to use and adapting it correctly under pressure. The "Medium" label here means you need to combine concepts—like using a hash map to optimize a sliding window, or applying a modified BFS on a graph. If you can reliably solve these, you're in a very strong position.

## Common Patterns and Templates

Coupang's Medium questions heavily favor a few high-leverage patterns. The most common by far is the **Sliding Window** pattern, often combined with a hash map for counting. This isn't the basic fixed-size window; it's the dynamic variant where you expand and contract based on a condition (e.g., "longest substring with at most K distinct characters"). Other frequent patterns include **Modified BFS/DFS for grid or tree problems**, **Two Heaps for median/stream problems**, and **Monotonic Stack** for next-greater-element type questions.

The sliding window with hash map pattern is so prevalent it's worth having a mental template. Here’s the canonical structure:

<div class="code-group">

```python
def sliding_window_template(s: str, k: int) -> int:
    count_map = {}
    left = 0
    max_length = 0

    for right in range(len(s)):
        # 1. Expand: Add the character at 'right' to the window
        right_char = s[right]
        count_map[right_char] = count_map.get(right_char, 0) + 1

        # 2. Shrink: While the window is invalid, move left forward
        while len(count_map) > k:  # Example condition: too many distinct chars
            left_char = s[left]
            count_map[left_char] -= 1
            if count_map[left_char] == 0:
                del count_map[left_char]
            left += 1

        # 3. Update answer after the window is valid again
        max_length = max(max_length, right - left + 1)

    return max_length

# Time: O(n) - Each character processed at most twice (by left and right pointers)
# Space: O(k) - For the hash map storing at most k+1 distinct characters
```

```javascript
function slidingWindowTemplate(s, k) {
  const countMap = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    // 1. Expand
    const rightChar = s[right];
    countMap.set(rightChar, (countMap.get(rightChar) || 0) + 1);

    // 2. Shrink
    while (countMap.size > k) {
      const leftChar = s[left];
      countMap.set(leftChar, countMap.get(leftChar) - 1);
      if (countMap.get(leftChar) === 0) {
        countMap.delete(leftChar);
      }
      left++;
    }

    // 3. Update answer
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
// Time: O(n) | Space: O(k)
```

```java
public int slidingWindowTemplate(String s, int k) {
    Map<Character, Integer> countMap = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        // 1. Expand
        char rightChar = s.charAt(right);
        countMap.put(rightChar, countMap.getOrDefault(rightChar, 0) + 1);

        // 2. Shrink
        while (countMap.size() > k) {
            char leftChar = s.charAt(left);
            countMap.put(leftChar, countMap.get(leftChar) - 1);
            if (countMap.get(leftChar) == 0) {
                countMap.remove(leftChar);
            }
            left++;
        }

        // 3. Update answer
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
// Time: O(n) | Space: O(k)
```

</div>

This template directly solves problems like **Longest Substring with At Most K Distinct Characters (LeetCode #340)** and **Fruit Into Baskets (LeetCode #904)**. Recognizing that a problem is asking for the "longest subarray/substring with at most K of something" is the key insight.

## Time Benchmarks and What Interviewers Look For

For a single 45-minute interview slot, you should aim to solve one Medium problem in about 25-30 minutes. This includes understanding the problem, discussing your approach, writing clean code, and walking through test cases. The remaining time is for a follow-up or a second, simpler question.

Getting the correct optimal solution is the baseline. What interviewers are really watching for:

1. **Pattern Recognition Speed:** Do you immediately think "this is a sliding window problem," or do you fumble with brute force first? They want to see you connect the problem statement to known algorithms.
2. **Code Hygiene:** Your variables should have clear names (`left`, `right`, `countMap`). Your logic should be compartmentalized. Avoid nested loops unless necessary, and always state their complexity.
3. **Edge Case Handling:** Do you consider empty input? What if `k` is zero? What if the string is all the same character? Mention these _before_ you start coding. A good tactic is to say, "Assuming the input is valid, my approach is X. I'll handle edge cases like Y and Z after outlining the core logic."
4. **Communication of Trade-offs:** Be prepared to answer, "Can we do better?" If you're using O(n) space, could we use O(1) with a fixed array if the character set is known? This shows deeper understanding.

## Key Differences from Easy Problems

The jump from Easy to Medium at Coupang is defined by two things: **constraint management** and **algorithm composition**.

Easy problems often have a straightforward, single-step solution (e.g., reverse a string, basic tree traversal). Medium problems introduce a constraint that makes the obvious solution inefficient. For example, "Find two numbers that sum to a target" is Easy with a brute-force O(n²) check. But if you need to do it in O(n) time, you must use a hash map—that's the composition of iteration and a lookup structure.

The mindset shift is from "What does the problem ask?" to **"What is the bottleneck in the naive solution, and what data structure removes that bottleneck?"** You're no longer just implementing steps; you're analyzing computational constraints and selecting tools to overcome them.

## Specific Patterns for Medium

Beyond the sliding window, two other patterns are worth mastering for Coupang:

**1. BFS for Level-Order or Shortest Path in Unweighted Graphs**
Many grid problems (e.g., **Shortest Path in Binary Matrix, LeetCode #1091**) are essentially unweighted graph searches. BFS with a queue is the tool. The trick is efficiently tracking visited cells and counting steps.

**2. Two Heaps for Finding Medians**
Problems involving running medians or maintaining a balanced partition (**Find Median from Data Stream, LeetCode #295**) are classic. The pattern is to maintain a max-heap for the lower half and a min-heap for the upper half, ensuring the heaps are balanced or the max-heap has at most one extra element.

Here's a concise snippet of the Two Heaps pattern core:

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (store negatives to simulate max-heap)
        self.large = []  # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        # Ensure every element in small <= every element in large
        if self.small and self.large and -self.small[0] > self.large[0]:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        # Balance sizes
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        if len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)
```

_Time for addNum: O(log n) | Space: O(n)_

## Practice Strategy

Don't just solve all 36 Medium questions randomly. Group them by pattern. Spend 2-3 days mastering each core pattern:

1. **Week 1:** Sliding Window variations.
2. **Week 2:** BFS/DFS on grids and trees.
3. **Week 3:** Heap and monotonic stack problems.
4. **Week 4:** Mixed review, focusing on problems you found hardest.

Aim for 2-3 problems per day, but with intense review. For each problem:

- Spend 15 minutes trying to solve it. If stuck, identify the pattern you're missing.
- Write the code, comment it, and analyze complexity out loud.
- Run through at least three test cases, including edges.

The goal is to build reflex recognition. When you see "longest substring with at most K," your brain should immediately route to the sliding window template. That automaticity is what separates candidates who pass from those who struggle.

[Practice Medium Coupang questions](/company/coupang/medium)
