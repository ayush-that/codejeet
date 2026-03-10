---
title: "How to Solve Minimum Number of Operations to Make Word K-Periodic — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Make Word K-Periodic. Medium difficulty, 60.7% acceptance rate. Topics: Hash Table, String, Counting."
date: "2029-06-13"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-operations-to-make-word-k-periodic",
    "hash-table",
    "string",
    "counting",
    "medium",
  ]
---

# How to Solve Minimum Number of Operations to Make Word K-Periodic

You're given a string `word` and an integer `k` where `k` divides the length of `word`. In one operation, you can replace any k-length segment starting at a position divisible by `k` with another k-length segment starting at a position divisible by `k`. Your goal is to make the entire string consist of the same k-length substring repeated throughout (making it "k-periodic") using the minimum number of operations.

What makes this problem interesting is that it looks like a string manipulation challenge, but it's actually a clever frequency counting problem in disguise. The key insight is recognizing that operations allow you to copy any k-length segment to any other k-length segment, so the optimal strategy is to find the most common k-length segment and make all other segments match it.

## Visual Walkthrough

Let's trace through an example: `word = "abacabac"`, `k = 4`

First, let's understand what k-periodic means. Since `k = 4` and `n = 8`, we need the string to consist of the same 4-character substring repeated twice. The string is divided into segments of length `k` starting at positions divisible by `k`:

- Segment 1 (starting at index 0): "abac"
- Segment 2 (starting at index 4): "abac"

Already, both segments are "abac", so the string is already k-periodic! We need 0 operations.

Now let's try a more interesting example: `word = "leetcodeleet"`, `k = 4`

Here `n = 12`, so we have 3 segments:

- Segment 1 (indices 0-3): "leet"
- Segment 2 (indices 4-7): "code"
- Segment 3 (indices 8-11): "leet"

We need to make all segments the same. Looking at the segments:

- "leet" appears 2 times
- "code" appears 1 time

The most frequent segment is "leet" with frequency 2. If we make all segments "leet", we only need to change segment 2 (the "code" segment). That's 1 operation.

What does the operation look like? We can pick any two indices divisible by `k` (0, 4, or 8) and copy the k-length substring from one to the other. To change segment 2 to "leet", we could copy from index 0 to index 4, replacing "code" with "leet".

## Brute Force Approach

A naive approach might try to simulate all possible operations, but that would be extremely inefficient. Another brute force approach would be to:

1. Generate all possible target substrings (all k-length segments in the word)
2. For each candidate target, count how many segments don't match it
3. Take the minimum of these counts

This approach would be O(n²/k) time complexity since for each of n/k segments, we compare it to all n/k segments. While this might work for small inputs, it's inefficient for larger ones.

The problem with this approach is that it doesn't leverage the fact that we only care about which segment appears most frequently. We're doing redundant work by checking every segment as a potential target when we can determine the optimal target more efficiently.

## Optimized Approach

The key insight is that operations allow us to copy any segment to any other segment. Therefore, to minimize operations, we want to change as few segments as possible. This means we should find the most frequent k-length segment in the word (at positions 0, k, 2k, ...) and make all other segments match it.

Here's the step-by-step reasoning:

1. The word is divided into n/k segments, each of length k
2. Each operation can make one segment match another segment
3. If we choose a target segment T, we need to change all segments that are not T
4. The number of operations needed = (total segments) - (frequency of T)
5. To minimize operations, we want to maximize the frequency of T
6. Therefore, T should be the most frequent segment

This transforms the problem into:

1. Extract all k-length segments starting at positions divisible by k
2. Count the frequency of each distinct segment
3. Find the maximum frequency
4. The answer is (total segments) - (maximum frequency)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n/k)
def minimumOperationsToMakeKPeriodic(word: str, k: int) -> int:
    """
    Calculate minimum operations to make word k-periodic.

    Args:
        word: Input string
        k: Length of each period (divides len(word))

    Returns:
        Minimum number of operations needed
    """
    n = len(word)
    segment_count = {}  # Dictionary to count frequency of each k-length segment

    # Step 1: Extract all k-length segments starting at positions divisible by k
    # We iterate through starting indices: 0, k, 2k, ..., n-k
    for i in range(0, n, k):
        # Extract the k-length substring starting at i
        segment = word[i:i+k]

        # Step 2: Count frequency of each segment
        # Increment count for this segment, defaulting to 0 if not seen before
        segment_count[segment] = segment_count.get(segment, 0) + 1

    # Step 3: Find the maximum frequency among all segments
    max_freq = 0
    for freq in segment_count.values():
        if freq > max_freq:
            max_freq = freq

    # Step 4: Calculate minimum operations
    # Total segments = n/k
    # We keep the most frequent segment unchanged
    # We need to change all other segments to match it
    total_segments = n // k
    return total_segments - max_freq
```

```javascript
// Time: O(n) | Space: O(n/k)
/**
 * Calculate minimum operations to make word k-periodic.
 * @param {string} word - Input string
 * @param {number} k - Length of each period (divides word.length)
 * @return {number} Minimum number of operations needed
 */
function minimumOperationsToMakeKPeriodic(word, k) {
  const n = word.length;
  const segmentCount = new Map(); // Map to count frequency of each k-length segment

  // Step 1: Extract all k-length segments starting at positions divisible by k
  // We iterate through starting indices: 0, k, 2k, ..., n-k
  for (let i = 0; i < n; i += k) {
    // Extract the k-length substring starting at i
    const segment = word.substring(i, i + k);

    // Step 2: Count frequency of each segment
    // Increment count for this segment, defaulting to 0 if not seen before
    segmentCount.set(segment, (segmentCount.get(segment) || 0) + 1);
  }

  // Step 3: Find the maximum frequency among all segments
  let maxFreq = 0;
  for (const freq of segmentCount.values()) {
    if (freq > maxFreq) {
      maxFreq = freq;
    }
  }

  // Step 4: Calculate minimum operations
  // Total segments = n/k
  // We keep the most frequent segment unchanged
  // We need to change all other segments to match it
  const totalSegments = n / k;
  return totalSegments - maxFreq;
}
```

```java
// Time: O(n) | Space: O(n/k)
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * Calculate minimum operations to make word k-periodic.
     * @param word Input string
     * @param k Length of each period (divides word.length())
     * @return Minimum number of operations needed
     */
    public int minimumOperationsToMakeKPeriodic(String word, int k) {
        int n = word.length();
        Map<String, Integer> segmentCount = new HashMap<>(); // Map to count frequency of each k-length segment

        // Step 1: Extract all k-length segments starting at positions divisible by k
        // We iterate through starting indices: 0, k, 2k, ..., n-k
        for (int i = 0; i < n; i += k) {
            // Extract the k-length substring starting at i
            String segment = word.substring(i, i + k);

            // Step 2: Count frequency of each segment
            // Increment count for this segment, defaulting to 0 if not seen before
            segmentCount.put(segment, segmentCount.getOrDefault(segment, 0) + 1);
        }

        // Step 3: Find the maximum frequency among all segments
        int maxFreq = 0;
        for (int freq : segmentCount.values()) {
            if (freq > maxFreq) {
                maxFreq = freq;
            }
        }

        // Step 4: Calculate minimum operations
        // Total segments = n/k
        // We keep the most frequent segment unchanged
        // We need to change all other segments to match it
        int totalSegments = n / k;
        return totalSegments - maxFreq;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the word once, extracting n/k segments
- Each substring extraction takes O(k) time, but since we extract n/k segments of length k, the total work is O((n/k) \* k) = O(n)
- Counting frequencies and finding the maximum frequency takes O(n/k) time
- Overall time complexity is O(n)

**Space Complexity: O(n/k)**

- We store at most n/k distinct segments in our hash map
- Each segment has length k, so in the worst case we store O(n/k \* k) = O(n) characters
- However, since we're storing references to substrings (in most languages), the actual space is O(n/k) for the map entries

## Common Mistakes

1. **Not handling the substring extraction correctly**: When extracting substrings, it's easy to make off-by-one errors. Remember that `word[i:i+k]` in Python or `word.substring(i, i+k)` in JavaScript/Java extracts characters from index i (inclusive) to i+k (exclusive).

2. **Forgetting that k divides n**: The problem guarantees that k divides n, so we don't need to handle cases where n % k != 0. However, some candidates might add unnecessary checks.

3. **Using the wrong data structure for counting**: While you could use an array or list to store segments and then count, a hash map/dictionary is the most efficient for this task since we need to count frequencies of arbitrary strings.

4. **Misunderstanding the operation cost**: Some candidates might think each operation can only change one character or might try to calculate edit distance between segments. Remember that one operation replaces an entire k-length segment with another k-length segment.

## When You'll See This Pattern

This problem uses the **frequency counting with majority element** pattern, which appears in many coding problems:

1. **Majority Element (LeetCode 169)**: Find the element that appears more than n/2 times in an array. Like our problem, it involves finding the most frequent element, though the threshold is different.

2. **Top K Frequent Elements (LeetCode 347)**: Find the k most frequent elements in an array. This extends the frequency counting pattern to find multiple top frequencies.

3. **Maximum Repeating Substring (LeetCode 1668)**: Find the maximum repeating substring in a string. This also involves counting substring frequencies, though with different constraints.

The core pattern is: when you need to minimize changes to make elements identical, find the most frequent element and change everything else to match it.

## Key Takeaways

1. **Minimizing operations often means maximizing preservation**: When you need to make elements identical with minimal changes, you should preserve the most common element and change the others to match it.

2. **Look for the underlying counting problem**: Many string manipulation problems are actually frequency counting problems in disguise. Always ask: "Can this be solved by counting frequencies?"

3. **Understand the operation semantics**: Carefully read what each operation does. In this case, replacing entire segments is much more powerful than changing individual characters, which leads to the simple frequency-based solution.

Related problems: [Maximum Repeating Substring](/problem/maximum-repeating-substring)
