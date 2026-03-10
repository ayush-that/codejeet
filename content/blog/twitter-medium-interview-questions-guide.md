---
title: "Medium Twitter Interview Questions: Strategy Guide"
description: "How to tackle 33 medium difficulty questions from Twitter — patterns, time targets, and practice tips."
date: "2032-09-20"
category: "tips"
tags: ["twitter", "medium", "interview prep"]
---

# Medium Twitter Interview Questions: Strategy Guide

Twitter’s coding interview questions are known for being practical and often tied to real-world systems or data processing tasks. Out of their 53 tagged problems on LeetCode, 33 are rated Medium. This isn’t an accident—Medium is the sweet spot where interviewers can assess both your foundational coding skills and your ability to think through non-trivial logic, often under constraints that mirror scalability concerns. While Easy problems might test a single concept (like a hash map or a basic traversal), Medium problems at Twitter typically combine 2-3 concepts, require careful state management, and demand that you not only solve the problem but also articulate trade-offs. The jump from Easy to Medium here is less about raw difficulty and more about **orchestration**—can you cleanly compose several simple ideas into a correct, efficient solution?

## Common Patterns and Templates

Twitter’s Medium problems heavily favor **arrays/strings, hash maps, and sliding windows**, often with a focus on counting, grouping, or validating sequences. Many questions feel like they could be part of a feature implementation: validating user input, processing timelines, or handling rate limits. A very common pattern is the **"count with conditions"** problem, where you need to track frequencies or states and make decisions based on thresholds. The template below is a workhorse for these problems. It uses a hash map to count elements, then iterates to apply a condition.

<div class="code-group">

```python
# Template: Frequency counter with condition check
# Common in problems like "Find all anagrams in a string" or "Longest substring without repeating characters"
# Time: O(n) | Space: O(k) where k is the size of the character set or unique keys
def frequency_template(s, t):
    # Initialize frequency map for target or window
    target_count = {}
    for ch in t:
        target_count[ch] = target_count.get(ch, 0) + 1

    window_count = {}
    left = 0
    result = 0  # or a list, depending on problem

    for right in range(len(s)):
        # Expand window: add s[right] to window_count
        char = s[right]
        window_count[char] = window_count.get(char, 0) + 1

        # Shrink window while condition is violated
        while window_count.get(char, 0) > target_count.get(char, 0):
            left_char = s[left]
            window_count[left_char] -= 1
            if window_count[left_char] == 0:
                del window_count[left_char]
            left += 1

        # Update result when condition is met
        if right - left + 1 == len(t):  # Example condition: window size equals target length
            result += 1

    return result
```

```javascript
// Template: Frequency counter with condition check
// Time: O(n) | Space: O(k)
function frequencyTemplate(s, t) {
  const targetCount = {};
  for (const ch of t) {
    targetCount[ch] = (targetCount[ch] || 0) + 1;
  }

  const windowCount = {};
  let left = 0;
  let result = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    windowCount[char] = (windowCount[char] || 0) + 1;

    while (windowCount[char] > (targetCount[char] || 0)) {
      const leftChar = s[left];
      windowCount[leftChar]--;
      if (windowCount[leftChar] === 0) {
        delete windowCount[leftChar];
      }
      left++;
    }

    if (right - left + 1 === t.length) {
      result++;
    }
  }

  return result;
}
```

```java
// Template: Frequency counter with condition check
// Time: O(n) | Space: O(k)
public int frequencyTemplate(String s, String t) {
    Map<Character, Integer> targetCount = new HashMap<>();
    for (char ch : t.toCharArray()) {
        targetCount.put(ch, targetCount.getOrDefault(ch, 0) + 1);
    }

    Map<Character, Integer> windowCount = new HashMap<>();
    int left = 0;
    int result = 0;

    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        windowCount.put(ch, windowCount.getOrDefault(ch, 0) + 1);

        while (windowCount.getOrDefault(ch, 0) > targetCount.getOrDefault(ch, 0)) {
            char leftChar = s.charAt(left);
            windowCount.put(leftChar, windowCount.get(leftChar) - 1);
            if (windowCount.get(leftChar) == 0) {
                windowCount.remove(leftChar);
            }
            left++;
        }

        if (right - left + 1 == t.length()) {
            result++;
        }
    }

    return result;
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem at Twitter, you should aim to have a working, optimal solution within **25-30 minutes**. This includes understanding the problem, discussing approach, writing code, and testing. The first 5-7 minutes are for clarification and high-level plan; coding should take 10-15 minutes; the rest is for testing and discussion.

Beyond correctness, interviewers watch for:

- **Code quality**: Variable names, function decomposition, and readability. They want code that looks like it’s from a code review, not a competition.
- **Edge case handling**: Do you consider empty inputs, duplicates, large values, or negative numbers? Mention these during planning, not after they point them out.
- **Communication of trade-offs**: Be prepared to explain why you chose a hash map over an array, or why O(n) time with O(n) space is acceptable. Twitter engineers care about scalability.
- **Testing with examples**: Walk through a small example with your code. This catches off-by-one errors and shows systematic thinking.

## Key Differences from Easy Problems

Easy problems often have a single "trick"—use a hash map for Two Sum (#1), or a stack for valid parentheses. Medium problems require you to **layer techniques**. For example, "Design Hit Counter" combines queue operations with timestamp management. The mindset shift is from "what data structure solves this?" to "how do I maintain state correctly over time?" You’ll need to:

- Manage multiple pointers or indices (like in "Merge Intervals" (#56) style problems).
- Use auxiliary data structures (e.g., a hash map alongside a sliding window).
- Handle more complex conditionals and update logic without losing track of invariants.

The new techniques are less about new data structures and more about **patterns of use**: knowing when to pre-process data, how to shrink a window, or how to break a problem into a pass that counts and a pass that validates.

## Specific Patterns for Medium

1. **Sliding Window with Frequency Map**: Used in problems like "Longest Substring with At Most K Distinct Characters" (a classic). You maintain a window and a count of distinct characters, expanding until you exceed k, then shrinking from the left.

2. **Interval Scheduling and Merging**: Twitter has several problems about time intervals, likely because of scheduling tweets or meetings. The pattern involves sorting by start time, then iterating to merge or check overlaps. For example, in "Meeting Rooms II" (#253), you’d use a min-heap to track end times.

3. **Simulation with Queue/Stack**: Problems like "Design Hit Counter" or "Flatten Nested List Iterator" require simulating a process over time or depth. You often use a queue for BFS-like processing or a stack for DFS, maintaining state between calls.

Here’s a quick snippet for the interval pattern:

<div class="code-group">

```python
# Interval merging pattern (e.g., Merge Intervals #56)
# Time: O(n log n) | Space: O(n) for output
def merge_intervals(intervals):
    if not intervals:
        return []

    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for current in intervals[1:]:
        last = merged[-1]
        if current[0] <= last[1]:  # Overlap
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)

    return merged
```

```javascript
// Interval merging pattern
// Time: O(n log n) | Space: O(n)
function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];

  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}
```

```java
// Interval merging pattern
// Time: O(n log n) | Space: O(n)
public int[][] mergeIntervals(int[][] intervals) {
    if (intervals.length == 0) return new int[0][];

    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] current = intervals[i];
        int[] last = merged.get(merged.size() - 1);

        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.add(current);
        }
    }

    return merged.toArray(new int[merged.size()][]);
}
```

</div>

## Practice Strategy

Don’t just solve all 33 Medium problems in order. Group them by pattern. Start with the most frequent patterns: sliding window (4-5 problems), intervals (3-4 problems), and hash map counting (4-5 problems). Then move to less common but still important ones like tree traversals and simulation.

Daily target: **2 Medium problems per day**, with at least 30 minutes spent reviewing and optimizing after solving. For each problem, write the code in one language, then re-implement in another if time allows—this reinforces the pattern beyond syntax. Always articulate the time/space complexity out loud, as you would in an interview.

Focus on Twitter’s top Medium questions: "Design Hit Counter", "Palindrome Permutation II", "Alien Dictionary", and "Multiply Strings". These cover a range of patterns and are representative of their style.

[Practice Medium Twitter questions](/company/twitter/medium)
