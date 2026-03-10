---
title: "Medium PayPal Interview Questions: Strategy Guide"
description: "How to tackle 69 medium difficulty questions from PayPal — patterns, time targets, and practice tips."
date: "2032-04-29"
category: "tips"
tags: ["paypal", "medium", "interview prep"]
---

Medium questions at PayPal are where the real interview happens. While Easy problems test basic competency, and Hard problems are often reserved for specialized roles or senior positions, Medium questions form the core of PayPal's technical assessment for most software engineering roles. What separates PayPal's Medium tier is their emphasis on **practical data manipulation** and **real-world system simulation**. You'll rarely see purely academic graph theory puzzles. Instead, you'll find problems involving transaction logs, currency conversions, payment validations, and data stream processing—concepts that map directly to PayPal's business domain. The complexity doesn't come from obscure algorithms, but from weaving together multiple straightforward concepts under constraints that mimic production systems.

## Common Patterns and Templates

PayPal's Medium questions heavily favor a few key patterns. The most prevalent by far is the **Hash Map + Sorting** or **Hash Map + Priority Queue** combo for aggregation and top-K style problems. Think: "find the top 3 most frequent transaction types in a log," or "merge user sessions based on timestamps." The pattern involves using a hash map for O(1) lookups/aggregation and then applying a sort or heap to the map's items to meet an ordering requirement.

Here is a template for the classic "Top K Frequent Elements" pattern, which appears in various guises:

<div class="code-group">

```python
# Pattern: Hash Map + Bucket Sort or Heap for Top K Frequent
# Example Problem: Top K Frequent Elements (LeetCode #347)
# Time: O(n) for bucket sort approach | Space: O(n)
def topKFrequent(nums, k):
    """
    Finds the k most frequent elements.
    """
    # 1. Frequency mapping - O(n) time, O(n) space
    freq_map = {}
    for num in nums:
        freq_map[num] = freq_map.get(num, 0) + 1

    # 2. Bucket creation - O(n) space
    # Index = frequency, Value = list of numbers with that frequency
    bucket = [[] for _ in range(len(nums) + 1)]
    for num, count in freq_map.items():
        bucket[count].append(num)

    # 3. Result extraction - O(n) time
    result = []
    for i in range(len(bucket) - 1, 0, -1):
        for num in bucket[i]:
            result.append(num)
            if len(result) == k:
                return result
    return result
```

```javascript
// Pattern: Hash Map + Bucket Sort for Top K Frequent
// Time: O(n) | Space: O(n)
function topKFrequent(nums, k) {
  // 1. Frequency mapping
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // 2. Bucket creation
  const bucket = new Array(nums.length + 1).fill().map(() => []);
  for (const [num, count] of freqMap) {
    bucket[count].push(num);
  }

  // 3. Result extraction
  const result = [];
  for (let i = bucket.length - 1; i > 0; i--) {
    for (const num of bucket[i]) {
      result.push(num);
      if (result.length === k) return result;
    }
  }
  return result;
}
```

```java
// Pattern: Hash Map + Bucket Sort for Top K Frequent
// Time: O(n) | Space: O(n)
public int[] topKFrequent(int[] nums, int k) {
    // 1. Frequency mapping
    Map<Integer, Integer> freqMap = new HashMap<>();
    for (int num : nums) {
        freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
    }

    // 2. Bucket creation
    List<Integer>[] bucket = new List[nums.length + 1];
    for (int i = 0; i < bucket.length; i++) {
        bucket[i] = new ArrayList<>();
    }
    for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
        bucket[entry.getValue()].add(entry.getKey());
    }

    // 3. Result extraction
    int[] result = new int[k];
    int idx = 0;
    for (int i = bucket.length - 1; i > 0 && idx < k; i--) {
        for (int num : bucket[i]) {
            result[idx++] = num;
            if (idx == k) return result;
        }
    }
    return result;
}
```

</div>

Other common patterns include **Sliding Window** for analyzing contiguous sequences in transaction streams and **Modified Binary Search** for searching in sorted financial data (like finding a transaction ID in a log).

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot with one Medium question, you should aim to have a working, optimized solution within **25-30 minutes**. This leaves 10-15 minutes for discussion, edge cases, and follow-ups. The interviewer isn't just watching for a green checkmark. They're evaluating:

1.  **Code Quality First:** Is your code readable, modular, and well-named? Do you extract logic into helper functions? PayPal engineers maintain large financial systems—sloppy code is a major red flag.
2.  **Edge Case Proactivity:** Do you immediately consider empty inputs, duplicate values, large numbers, or negative values? Mentioning these _before_ coding shows production-minded thinking.
3.  **Trade-off Justification:** Can you explain _why_ you chose a hash map over an array, or a heap over a full sort? Articulating the time/space trade-off is crucial.
4.  **Communication Under Pressure:** Talk through your thought process, even when stuck. A silent candidate is a failing candidate. Say, "I'm considering a sliding window here because we need a contiguous subarray, but I need to think about the condition to shrink the window."

## Key Differences from Easy Problems

The jump from Easy to Medium at PayPal isn't about learning entirely new algorithms. It's about **orchestration and constraint management**. Easy problems typically require applying a single concept (e.g., one loop, one hash map). Medium problems require you to chain 2-3 concepts together and manage their interaction.

- **New Techniques:** You must master **transforming data between structures**. For example, you might need to convert an array of transactions into a hash map of user IDs to transaction lists, then sort each list, then apply a sliding window on the sorted timestamps. This data pipeline thinking is key.
- **Mindset Shift:** Move from "find the solution" to "find the _optimal_ solution under given constraints." An Easy problem might accept O(n log n) sorting. A Medium problem will often have a follow-up: "Can you do it in O(n) time?" This requires knowing multiple approaches (e.g., knowing both the sort and bucket sort solutions for top K frequent elements).

## Specific Patterns for Medium

Beyond the top-K pattern, watch for these:

1.  **Sliding Window with Hash Map:** Used for problems like "Longest Substring Without Repeating Characters" (LeetCode #3) or finding the longest subarray with at most K distinct transaction types. The hash map tracks counts within the window.
2.  **Interval Merging & Scheduling:** Problems like "Merge Intervals" (LeetCode #56) or "Meeting Rooms II" (LeetCode #253) simulate booking payment processing windows or consolidating user activity periods. The template always starts with sorting the intervals by start time.

<div class="code-group">

```python
# Pattern: Merge Intervals (Template)
# Time: O(n log n) for sort | Space: O(n) for output
def merge(intervals):
    if not intervals:
        return []

    # 1. Sort by start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    # 2. Iterate and merge
    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]
        if current_start <= last_end:  # Overlap
            merged[-1] = [last_start, max(last_end, current_end)]
        else:  # No overlap
            merged.append([current_start, current_end])
    return merged
```

```javascript
// Pattern: Merge Intervals (Template)
// Time: O(n log n) | Space: O(n)
function merge(intervals) {
  if (intervals.length === 0) return [];

  // 1. Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  // 2. Iterate and merge
  for (let i = 1; i < intervals.length; i++) {
    const [currStart, currEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];

    if (currStart <= lastEnd) {
      merged[merged.length - 1] = [lastStart, Math.max(lastEnd, currEnd)];
    } else {
      merged.push([currStart, currEnd]);
    }
  }
  return merged;
}
```

```java
// Pattern: Merge Intervals (Template)
// Time: O(n log n) | Space: O(n)
public int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return new int[0][];

    // 1. Sort by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    // 2. Iterate and merge
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int currStart = intervals[i][0];
        int currEnd = intervals[i][1];

        if (currStart <= last[1]) {
            last[1] = Math.max(last[1], currEnd);
        } else {
            merged.add(intervals[i]);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

## Practice Strategy

Don't just solve all 69 questions randomly. **Batch by pattern.**

1.  **Week 1-2: Pattern Mastery.** Group problems by the patterns above. Solve 3-5 "Top K Frequent" style problems, then 3-5 "Sliding Window" problems, etc. Use the templates until they're muscle memory.
2.  **Week 3: Mixed Practice.** Set a 30-minute timer and solve random PayPal Medium questions. This simulates the interview pressure and forces you to quickly identify the pattern.
3.  **Daily Target:** 2-3 _high-quality_ solutions per day. "High-quality" means: writing production-style code on a whiteboard (or in a plain editor), analyzing time/space complexity aloud, and listing edge cases before running the code. Reviewing one old problem is more valuable than rushing through two new ones.

Focus on the patterns that mirror real financial data tasks: aggregation, sorting, merging, and searching. If you can cleanly implement these with clear communication, you'll handle the majority of PayPal's Medium tier.

[Practice Medium PayPal questions](/company/paypal/medium)
