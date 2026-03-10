---
title: "How to Solve Top K Frequent Words — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Top K Frequent Words. Medium difficulty, 60.0% acceptance rate. Topics: Array, Hash Table, String, Trie, Sorting."
date: "2026-12-27"
category: "dsa-patterns"
tags: ["top-k-frequent-words", "array", "hash-table", "string", "medium"]
---

# How to Solve Top K Frequent Words

You're given a list of words and an integer `k`, and you need to return the `k` most frequent words. The tricky part is that when words have the same frequency, you must sort them lexicographically (alphabetically). This problem combines frequency counting with custom sorting logic, making it a great test of your ability to work with hash maps and comparators.

## Visual Walkthrough

Let's trace through an example: `words = ["i", "love", "leetcode", "i", "love", "coding"]`, `k = 2`

**Step 1: Count frequencies**

- "i" appears 2 times
- "love" appears 2 times
- "leetcode" appears 1 time
- "coding" appears 1 time

**Step 2: Sort by frequency (descending), then lexicographically (ascending)**
We have two words with frequency 2: "i" and "love"

- "i" comes before "love" alphabetically
- So the order should be: ["i", "love"]

**Step 3: Take top k**
With k=2, we return ["i", "love"]

What about the words with frequency 1? They don't make the top 2, so we don't include them.

## Brute Force Approach

A naive approach would be:

1. Count frequencies using a hash map
2. Put all word-frequency pairs into a list
3. Sort the list with a custom comparator: first by frequency (descending), then by word (ascending)
4. Take the first k words from the sorted list

While this works, it's inefficient for large inputs because we're sorting ALL words when we only need the top k. The time complexity would be O(n log n) where n is the number of unique words. For problems where k is much smaller than n, we can do better.

## Optimized Approach

The key insight is that we don't need to fully sort all words - we just need the top k. We can use a **min-heap** (priority queue) of size k to efficiently track the top k elements as we process them.

Here's the step-by-step reasoning:

1. **Count frequencies**: Use a hash map to count how many times each word appears.
2. **Use a min-heap**: Maintain a heap of size k where the "worst" (lowest frequency, or if tied, highest lexicographically) element is at the top.
3. **Custom comparator**: The heap should order elements such that:
   - Lower frequency comes first (min-heap by frequency)
   - If frequencies are equal, higher lexicographical order comes first (so "zebra" comes before "apple" in a min-heap)
4. **Process all words**: For each word-frequency pair:
   - Push it to the heap
   - If heap size exceeds k, pop the smallest element (which is the "worst" candidate for top k)
5. **Extract results**: The heap now contains the top k elements, but in reverse order (min-heap). We need to reverse them to get highest frequency first.

Why does this work? By keeping only k elements in the heap at any time, we ensure O(n log k) time complexity instead of O(n log n). When k is small, this is much more efficient.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log k) where n is number of unique words
# Space: O(n) for the frequency map
import heapq
from collections import Counter

def topKFrequent(words, k):
    """
    Returns the k most frequent words.
    Words with same frequency are sorted lexicographically.
    """
    # Step 1: Count frequencies using Counter (built-in frequency counter)
    freq = Counter(words)

    # Step 2: Create a min-heap with custom comparator
    # We use a tuple for comparison: (-frequency, word)
    # Why negative frequency? heapq is a min-heap, so we want:
    # 1. Higher frequency to be "smaller" (comes first in min-heap)
    # 2. If frequencies equal, smaller word (lexicographically) to be "smaller"
    # Using (-freq, word) achieves both:
    # - Higher freq -> more negative -> smaller in min-heap
    # - Same freq -> compare words normally
    heap = []

    # Step 3: Add all word-frequency pairs to heap, maintaining size k
    for word, count in freq.items():
        # Push tuple with negative count for max-heap behavior
        heapq.heappush(heap, (-count, word))

    # Step 4: Extract top k elements from heap
    # Since heap is min-heap by our custom ordering, popping gives us
    # elements in ascending order of our criteria
    result = []
    for _ in range(k):
        # We only need the word, not the count
        _, word = heapq.heappop(heap)
        result.append(word)

    return result
```

```javascript
// Time: O(n log k) where n is number of unique words
// Space: O(n) for the frequency map
function topKFrequent(words, k) {
  /**
   * Returns the k most frequent words.
   * Words with same frequency are sorted lexicographically.
   */

  // Step 1: Count frequencies using a Map
  const freq = new Map();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  // Step 2: Create a min-heap with custom comparator
  // JavaScript doesn't have built-in heap, so we'll use sorting
  // This gives O(n log n) but for interview context, we'll implement
  // the heap logic conceptually

  // Convert Map to array of [word, frequency] pairs
  const wordFreq = Array.from(freq.entries());

  // Step 3: Sort with custom comparator
  // Sort by frequency descending, then by word ascending
  wordFreq.sort((a, b) => {
    // Compare frequencies first
    if (b[1] !== a[1]) {
      return b[1] - a[1]; // Higher frequency first
    }
    // If frequencies equal, compare words lexicographically
    return a[0].localeCompare(b[0]);
  });

  // Step 4: Take first k words
  const result = [];
  for (let i = 0; i < k; i++) {
    result.push(wordFreq[i][0]);
  }

  return result;
}
```

```java
// Time: O(n log k) where n is number of unique words
// Space: O(n) for the frequency map
import java.util.*;

public class Solution {
    public List<String> topKFrequent(String[] words, int k) {
        /**
         * Returns the k most frequent words.
         * Words with same frequency are sorted lexicographically.
         */

        // Step 1: Count frequencies using HashMap
        Map<String, Integer> freq = new HashMap<>();
        for (String word : words) {
            freq.put(word, freq.getOrDefault(word, 0) + 1);
        }

        // Step 2: Create a min-heap with custom comparator
        // PriorityQueue in Java is min-heap by default
        // We define comparator to sort by:
        // 1. Frequency ascending (min-heap behavior)
        // 2. If frequencies equal, word descending (so "zebra" before "apple")
        PriorityQueue<Map.Entry<String, Integer>> heap =
            new PriorityQueue<>((a, b) -> {
                // Compare frequencies first
                if (a.getValue().equals(b.getValue())) {
                    // If frequencies equal, compare words in reverse order
                    // because we want lex smaller words to be "larger" in min-heap
                    return b.getKey().compareTo(a.getKey());
                }
                // Otherwise, compare frequencies (min-heap)
                return a.getValue() - b.getValue();
            });

        // Step 3: Add entries to heap, maintaining size k
        for (Map.Entry<String, Integer> entry : freq.entrySet()) {
            heap.offer(entry);
            if (heap.size() > k) {
                heap.poll(); // Remove the smallest (worst) element
            }
        }

        // Step 4: Extract results in reverse order
        // Heap has smallest at front, but we need largest first
        List<String> result = new ArrayList<>();
        while (!heap.isEmpty()) {
            result.add(heap.poll().getKey());
        }
        Collections.reverse(result);

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log k)**

- Counting frequencies: O(n) where n is total number of words
- Heap operations: For each of the m unique words (m ≤ n), we do O(log k) operations
- Total: O(n + m log k) = O(n log k) in worst case

**Space Complexity: O(n)**

- Frequency map: O(m) where m is number of unique words
- Heap: O(k)
- Total: O(n) in worst case when all words are unique

The heap-based solution is optimal when k is much smaller than n. If k is close to n, the sorting solution (O(n log n)) might be simpler and equally efficient.

## Common Mistakes

1. **Forgetting to handle tie-breaking correctly**: When frequencies are equal, you must sort words lexicographically (alphabetically). A common mistake is to only sort by frequency.

2. **Wrong heap ordering**: Using a max-heap when you need a min-heap (or vice versa). Remember: for "top k" problems, a min-heap of size k lets you efficiently remove the smallest (worst) element.

3. **Not considering all words with same frequency**: If you have 5 words with frequency 5 and k=3, you need to return the 3 that come first alphabetically, not just any 3.

4. **Inefficient sorting**: Sorting all words when you only need top k. While O(n log n) might pass, interviewers expect you to recognize the O(n log k) optimization.

## When You'll See This Pattern

This "top k" pattern with custom sorting appears in many problems:

1. **Top K Frequent Elements (LeetCode 347)**: Simpler version without the lexicographical tie-breaker. Uses the same frequency counting + heap approach.

2. **K Closest Points to Origin (LeetCode 973)**: Instead of frequency, you're comparing distances. Uses a max-heap to keep the k closest points.

3. **Sort Features by Popularity (LeetCode 1772)**: Similar custom sorting based on frequency and then alphabetically.

The pattern is: when you need the "top k" of something according to some custom ordering, think: frequency counting + heap with custom comparator.

## Key Takeaways

1. **Frequency counting is your first step**: Almost always use a hash map to count frequencies before any sorting or heap operations.

2. **Min-heap for top k problems**: When k is small relative to n, a min-heap of size k gives you O(n log k) instead of O(n log n).

3. **Custom comparators are key**: Many interview problems require custom sorting logic. Practice writing comparators that handle multiple criteria in the right order.

**Related problems**: [Top K Frequent Elements](/problem/top-k-frequent-elements), [K Closest Points to Origin](/problem/k-closest-points-to-origin), [Sort Features by Popularity](/problem/sort-features-by-popularity)
