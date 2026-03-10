---
title: "Hash Table Questions at Zepto: What to Expect"
description: "Prepare for Hash Table interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-11-24"
category: "dsa-patterns"
tags: ["zepto", "hash-table", "interview prep"]
---

If you're preparing for a Zepto interview, you'll quickly notice that Hash Table questions make up a significant portion of their problem set—5 out of 28 total questions. This isn't a coincidence. While Zepto, as a fast-growing quick-commerce company, has a tech stack that spans distributed systems, mobile engineering, and logistics optimization, their interview process heavily emphasizes fundamental data structure mastery. Hash Tables are not just a secondary topic; they are a core focus area that appears in nearly every interview loop for backend, frontend, and full-stack roles. The reason is practical: at scale, efficient lookups are everything. Whether it's managing real-time inventory, matching delivery agents to orders, or caching user session data, the ability to design and reason about O(1) access patterns is a daily requirement. In real interviews, you can expect at least one, often two, problems that hinge on clever hash map usage.

## Specific Patterns Zepto Favors

Zepto's Hash Table problems tend to cluster around two specific, practical patterns: **Frequency Counting** and **Complement Lookup**. They rarely ask abstract, purely academic hash map questions. Instead, they embed hash tables within problems that feel like real-world scenarios—tracking item counts, finding pairs that satisfy a condition, or detecting state.

The **Frequency Counting** pattern is their absolute favorite. You'll be given a stream or array of data (like user clicks, product IDs, or order statuses) and asked to derive a statistic, find a duplicate, or identify an anomaly. This tests your ability to use a hash map as a counter.

The **Complement Lookup** pattern is a close second. This is the classic "find two items that sum to a target" logic, but Zepto often extends it. Instead of just two numbers in an array, it might be about finding two events in a log that happened within a time window, or two API calls that together indicate a fault condition. The core skill is maintaining a map of "what I've seen" and checking if the needed partner (the complement) for the current item already exists.

You will see very few problems that use hash tables purely for graph adjacency lists (that's more of a pure Graph domain at Zepto) or for complex memoization in Dynamic Programming. Their hash table use is direct, purposeful, and applied to data processing.

## How to Prepare

Your preparation should be laser-focused on implementing these two patterns flawlessly and understanding their time-space trade-offs. Let's look at the canonical example of each.

For **Frequency Counting**, the mental model is: "For each element, I need to know how many times I've seen it." The hash map's key is the element, and the value is an integer count.

<div class="code-group">

```python
# Pattern: Frequency Counter
# Problem Example: LeetCode #347 - Top K Frequent Elements
# Time: O(n) to count + O(n log k) for heap operations ≈ O(n log k) | Space: O(n) for the counter map and heap
from collections import Counter
import heapq

def topKFrequent(nums, k):
    # 1. Build frequency map: O(n) time, O(n) space
    count_map = Counter(nums)  # or use a plain dict: count_map = {}
                               # for num in nums: count_map[num] = count_map.get(num, 0) + 1

    # 2. Use a min-heap of size k to track top k frequencies
    # Heap elements are tuples: (frequency, element). Python's heapq is a min-heap.
    heap = []
    for num, freq in count_map.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:          # Maintain only k elements
            heapq.heappop(heap)    # Pop the smallest frequency

    # 3. Extract results from heap
    return [num for freq, num in heap]
```

```javascript
// Pattern: Frequency Counter
// Problem Example: LeetCode #347 - Top K Frequent Elements
// Time: O(n) to count + O(n log k) for heap operations ≈ O(n log k) | Space: O(n)
function topKFrequent(nums, k) {
  // 1. Build frequency map
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // 2. Use an array and sort, or a min-heap. Here's a sort approach for clarity.
  // In an interview, you might be asked to implement a heap.
  const entries = Array.from(freqMap.entries()); // [ [num, freq], ... ]
  entries.sort((a, b) => b[1] - a[1]); // Sort by frequency descending

  // 3. Take top k
  return entries.slice(0, k).map((entry) => entry[0]);
}
```

```java
// Pattern: Frequency Counter
// Problem Example: LeetCode #347 - Top K Frequent Elements
// Time: O(n) to count + O(n log k) for heap ≈ O(n log k) | Space: O(n)
import java.util.*;

public class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 1. Build frequency map
        Map<Integer, Integer> countMap = new HashMap<>();
        for (int num : nums) {
            countMap.put(num, countMap.getOrDefault(num, 0) + 1);
        }

        // 2. Min-heap of size k, ordered by frequency
        PriorityQueue<Map.Entry<Integer, Integer>> heap =
            new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());

        for (Map.Entry<Integer, Integer> entry : countMap.entrySet()) {
            heap.offer(entry);
            if (heap.size() > k) {
                heap.poll(); // Remove the element with smallest frequency
            }
        }

        // 3. Extract results
        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            result[i] = heap.poll().getKey();
        }
        return result;
    }
}
```

</div>

For the **Complement Lookup** pattern, the model is: "As I iterate, I store what I've seen. For each new item, I check if its complement (target - item) is already in my map."

<div class="code-group">

```python
# Pattern: Complement Lookup (Two Sum variant)
# Problem Example: LeetCode #1 - Two Sum
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    seen = {}  # Map value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i  # Store after check to avoid using same element twice
    return []  # Problem guarantees a solution
```

```javascript
// Pattern: Complement Lookup (Two Sum variant)
// Problem Example: LeetCode #1 - Two Sum
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const indexMap = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (indexMap.has(complement)) {
      return [indexMap.get(complement), i];
    }
    indexMap.set(nums[i], i);
  }
  return [];
}
```

```java
// Pattern: Complement Lookup (Two Sum variant)
// Problem Example: LeetCode #1 - Two Sum
// Time: O(n) | Space: O(n)
import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> indexMap = new HashMap<>(); // value -> index
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (indexMap.containsKey(complement)) {
                return new int[] { indexMap.get(complement), i };
            }
            indexMap.put(nums[i], i);
        }
        return new int[] {}; // Should not happen per problem statement
    }
}
```

</div>

## How Zepto Tests Hash Table vs Other Companies

Compared to FAANG companies, Zepto's Hash Table questions are less about algorithmic trickery and more about **correct, efficient implementation under constraints**. At Google or Meta, you might get a hash table problem disguised as a system design nuance (e.g., designing a consistent hashing ring). At Amazon, it might be woven into a behavioral context about handling duplicate data. At Zepto, the focus is sharper: can you write bug-free code that processes data in one pass? Can you choose the right key-value structure?

The difficulty is often "Medium," but the emphasis is on **performance clarity**. You must be able to articulate why the O(n) time and O(n) space solution is acceptable, and what the trade-offs would be if input size grew by 10x or 100x. They might follow up with: "What if the data stream is continuous? Could we use a fixed-size map?" This practical, scaling-oriented questioning is their unique fingerprint.

## Study Order

1.  **Basic Operations & Syntax:** Master the API for your language's hash map (`dict`, `Map`, `HashMap`). Know how to insert, update, check existence, and iterate. This is non-negotiable.
2.  **Frequency Counting:** Start with simple counting problems. This builds the muscle memory of `map[item] = map.get(item, 0) + 1`.
3.  **Complement Lookup (Two Sum):** Learn the classic one-pass algorithm. This introduces the concept of "looking back" for a complement.
4.  **Combining Patterns:** Solve problems where you first count frequencies, then use that map for further logic (e.g., finding the first unique character).
5.  **Hash Table for State Tracking:** Use a map where the value isn't just a count but a more complex state (e.g., last seen index, a group identifier). This is often the final step in their problem progression.

This order works because it builds from simple storage to more complex reasoning. You can't optimize a complement lookup if you're fumbling with map syntax. You can't track state if you haven't internalized frequency counting.

## Recommended Practice Order

Solve these problems in sequence to build the skills Zepto tests:

1.  **LeetCode #1 - Two Sum:** The absolute must-know complement lookup problem. Code it from memory.
2.  **LeetCode #242 - Valid Anagram:** A gentle frequency counting problem. Use two counts, or one count with increments/decrements.
3.  **LeetCode #347 - Top K Frequent Elements:** The quintessential Zepto-style problem. Practice both the heap-based O(n log k) solution and, if advanced, the quickselect O(n) solution.
4.  **LeetCode #205 - Isomorphic Strings:** A step up. Here, the hash map tracks character mappings (state), not just counts. Tests if you can use two maps or a bijection check.
5.  **LeetCode #325 - Maximum Size Subarray Sum Equals k:** A more advanced complement lookup. Instead of a simple sum, you track running sums and their indices. This is the level where Zepto might stop in a 45-minute interview.

Master these five, and you'll have covered the core patterns Zepto employs. Remember, their goal is to see if you can translate a practical data processing task into clean, efficient code. Your ability to reach for a hash map instinctively—and explain its trade-offs—will be a significant advantage.

[Practice Hash Table at Zepto](/company/zepto/hash-table)
