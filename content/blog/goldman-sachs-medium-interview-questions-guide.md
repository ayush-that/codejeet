---
title: "Medium Goldman Sachs Interview Questions: Strategy Guide"
description: "How to tackle 171 medium difficulty questions from Goldman Sachs — patterns, time targets, and practice tips."
date: "2032-01-30"
category: "tips"
tags: ["goldman-sachs", "medium", "interview prep"]
---

Goldman Sachs has 171 Medium-difficulty questions in its tagged problem set, making up the vast majority of its 270 total. This isn't an accident. In a real interview, the "meat" of the technical discussion will almost always be a Medium problem, or a problem that starts Easy and escalates to a Medium-level follow-up. What defines a Goldman Sachs Medium question? It's a problem where the core algorithm or data structure isn't obscure—you likely know it—but the implementation requires careful state management, handling multiple moving parts, or a non-obvious optimization step. The difference between a brute-force O(n²) solution and an elegant O(n) one is often the line between a "No Hire" and a "Strong Hire."

## Common Patterns and Templates

Goldman Sachs, given its financial domain, heavily favors problems involving arrays, strings, and hash maps for data processing, with a strong emphasis on dynamic programming for optimization scenarios. You'll see a lot of:

- **Prefix Sum / Sliding Window:** For subarray/substring problems (e.g., finding a contiguous sequence meeting a sum or character condition).
- **Hash Map for Frequency & State Tracking:** Beyond simple "Two Sum," used to track complex states or act as a cache.
- **Greedy Algorithms with Sorting:** Scheduling, assignment, and interval problems.
- **Tree/Graph Traversal (DFS/BFS) with a Twist:** Not just simple traversal, but where you need to carry and return additional information (like subtree sums or path states).
- **Dynamic Programming (1D & 2D):** Especially for "maximum/minimum of a constrained choice" problems, like the classic "House Robber" or "Best Time to Buy and Sell Stock" variants.

The most common template you must internalize is the **Sliding Window with a Hash Map Counter**. This pattern solves a huge swath of their substring and subarray problems.

<div class="code-group">

```python
def sliding_window_template(s: str, t: str) -> str:
    """
    Find the minimum window in `s` which contains all characters in `t`.
    Template for variable-size sliding window with hash map counter.
    """
    from collections import Counter

    if not s or not t or len(s) < len(t):
        return ""

    # 1. Initialize hash map for target frequencies
    target_count = Counter(t)
    required = len(target_count)  # number of unique chars we need to match

    # 2. Sliding window pointers and state variables
    left = 0
    formed = 0  # tracks how many unique chars meet their target frequency
    window_count = {}

    # 3. Result tracking
    ans = float('inf'), None, None  # (window length, left, right)

    for right, char in enumerate(s):
        # 4. Expand window (right pointer moves)
        window_count[char] = window_count.get(char, 0) + 1

        # 5. Check if this char's frequency now matches the target
        if char in target_count and window_count[char] == target_count[char]:
            formed += 1

        # 6. Contract window while condition is satisfied
        while left <= right and formed == required:
            # 7. Update result if this window is better
            if right - left + 1 < ans[0]:
                ans = (right - left + 1, left, right)

            # Remove left char from window
            left_char = s[left]
            window_count[left_char] -= 1
            if window_count[left_char] < target_count.get(left_char, 0):
                formed -= 1
            left += 1

    # 8. Return result
    return "" if ans[0] == float('inf') else s[ans[1]: ans[2] + 1]

# Time: O(|s| + |t|) | Space: O(|s| + |t|) for the hash maps.
```

```javascript
function slidingWindowTemplate(s, t) {
  if (!s || !t || s.length < t.length) return "";

  // 1. Target frequency map
  const targetCount = new Map();
  for (const ch of t) {
    targetCount.set(ch, (targetCount.get(ch) || 0) + 1);
  }
  const required = targetCount.size;

  // 2. Sliding window state
  let left = 0,
    formed = 0;
  const windowCount = new Map();
  let ans = [Infinity, null, null]; // [length, left, right]

  // 3. Expand window with right pointer
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    windowCount.set(char, (windowCount.get(char) || 0) + 1);

    // 4. Check if this char's count now matches
    if (targetCount.has(char) && windowCount.get(char) === targetCount.get(char)) {
      formed++;
    }

    // 5. Contract window from left while condition met
    while (left <= right && formed === required) {
      // Update answer
      if (right - left + 1 < ans[0]) {
        ans = [right - left + 1, left, right];
      }

      const leftChar = s[left];
      windowCount.set(leftChar, windowCount.get(leftChar) - 1);
      if (targetCount.has(leftChar) && windowCount.get(leftChar) < targetCount.get(leftChar)) {
        formed--;
      }
      left++;
    }
  }

  return ans[0] === Infinity ? "" : s.substring(ans[1], ans[2] + 1);
}
// Time: O(|s| + |t|) | Space: O(|s| + |t|)
```

```java
public String slidingWindowTemplate(String s, String t) {
    if (s == null || t == null || s.length() < t.length()) return "";

    // 1. Target frequency map
    Map<Character, Integer> targetCount = new HashMap<>();
    for (char c : t.toCharArray()) {
        targetCount.put(c, targetCount.getOrDefault(c, 0) + 1);
    }
    int required = targetCount.size();

    // 2. Sliding window state
    int left = 0, formed = 0;
    Map<Character, Integer> windowCount = new HashMap<>();
    int[] ans = {-1, 0, 0}; // {length, left, right}

    // 3. Expand window
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        windowCount.put(c, windowCount.getOrDefault(c, 0) + 1);

        // 4. Check if this char's count now matches
        if (targetCount.containsKey(c) && windowCount.get(c).intValue() == targetCount.get(c).intValue()) {
            formed++;
        }

        // 5. Contract window
        while (left <= right && formed == required) {
            // Update answer
            if (ans[0] == -1 || right - left + 1 < ans[0]) {
                ans[0] = right - left + 1;
                ans[1] = left;
                ans[2] = right;
            }

            char leftChar = s.charAt(left);
            windowCount.put(leftChar, windowCount.get(leftChar) - 1);
            if (targetCount.containsKey(leftChar) && windowCount.get(leftChar) < targetCount.get(leftChar)) {
                formed--;
            }
            left++;
        }
    }
    return ans[0] == -1 ? "" : s.substring(ans[1], ans[2] + 1);
}
// Time: O(|s| + |t|) | Space: O(|s| + |t|)
```

</div>

## Time Benchmarks and What Interviewers Look For

You have 30-45 minutes per interview round. For a Medium problem, you should aim to:

- **Minutes 0-5:** Understand the problem, ask clarifying questions, and propose a high-level approach. Verbally confirm edge cases (empty input, large values, duplicates).
- **Minutes 5-20:** Write clean, compilable code. This is where the template fluency pays off. You shouldn't be figuring out the loop structure; you should be adapting a known pattern.
- **Minutes 20-25:** Walk through a test case with your code, then state the time/space complexity.

Beyond correctness, interviewers are evaluating:

1.  **Code Quality:** Readable variable names, consistent spacing, small helper functions if logic is complex. This signals you write maintainable code.
2.  **Edge Case Handling:** Do you check for `null`/empty inputs? Do your loops have off-by-one errors? Mentioning these _before_ the interviewer asks is a huge positive signal.
3.  **Communication of Trade-offs:** Can you explain _why_ your O(n) solution is better than an O(n log n) one? This shows system design thinking.

## Key Differences from Easy Problems

Easy problems at Goldman Sachs (like "Two Sum" or "Reverse a String") are often single-step applications of a data structure. The jump to Medium requires two key shifts:

1.  **Managing Multiple Conditions Simultaneously:** In an Easy problem, you might use a hash map to store seen elements. In a Medium, you use it to store a _state_ (like character frequency) and have a separate variable (like `formed`) to track progress toward a global condition (all characters matched). You're now managing 2-3 interrelated pieces of state.
2.  **Optimization is Mandatory:** An O(n²) brute force is often the "obvious" solution for a Medium. The interview tests your ability to _recognize waste_ (repeated calculations) and apply a pattern (sliding window, prefix sum, DP memoization) to eliminate it. If you jump straight to the optimal solution, you demonstrate pattern recognition. If you start with brute force and then optimize, you demonstrate structured problem-solving. Both are valid, but you must reach the optimal solution.

## Specific Patterns for Medium

**1. Dynamic Programming for Maximum Subarray Variations:** Problems like "Best Time to Buy and Sell Stock" (#121) are classic. The pattern is maintaining a `min_price` (or a 1D DP array like `dp[i] = max profit up to day i`).

**2. Greedy Interval Scheduling:** Problems like "Merge Intervals" (#56) or "Non-overlapping Intervals" (#435). The template is to **sort by end time** (usually), then iterate, making a greedy choice to keep or discard the next interval based on the last kept interval's end.

```python
def eraseOverlapIntervals(intervals):
    if not intervals: return 0
    intervals.sort(key=lambda x: x[1])  # Sort by end time
    end = intervals[0][1]
    count = 0
    for i in range(1, len(intervals)):
        if intervals[i][0] < end:  # Overlap
            count += 1
        else:
            end = intervals[i][1]  # No overlap, update end
    return count
# Time: O(n log n) | Space: O(1)
```

**3. Tree DFS with Side-Effects:** Not just printing nodes, but like "Maximum Path Sum" (#124) or "Lowest Common Ancestor" (#236). The pattern is a DFS that returns one value (e.g., max single path sum) but internally updates a global result (e.g., max path sum _through_ the current node).

## Practice Strategy

Don't just solve all 171 problems linearly. You'll burn out and miss the patterns.

1.  **Pattern-First Practice:** Group problems by the patterns listed above. Solve 3-5 "Sliding Window" problems in a row, then 3-5 "Interval" problems. Use the tag filters on LeetCode.
2.  **Daily Target:** 2-3 _new_ Medium problems per day, with 1-2 _revisions_ of previously solved problems from a different pattern group. Focus on quality of solution and communication, not quantity.
3.  **Recommended Order:** Start with high-frequency classics that teach core patterns:
    - Sliding Window: Minimum Window Substring (#76)
    - DP: Best Time to Buy and Sell Stock (#121), House Robber (#198)
    - Intervals: Merge Intervals (#56), Non-overlapping Intervals (#435)
    - Tree DFS: Maximum Path Sum (#124)
    - BFS: Word Ladder (#127)
4.  **Simulate the Interview:** For every 3rd problem, set a 25-minute timer. Talk through your thinking out loud, write the code, and test it.

Mastering Goldman Sachs Medium questions is about fluency, not genius. It's recognizing that a new problem is just a variation of a template you've already internalized, and then executing that template cleanly under time pressure.

[Practice Medium Goldman Sachs questions](/company/goldman-sachs/medium)
