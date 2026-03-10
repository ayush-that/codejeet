---
title: "How to Solve Compare Strings by Frequency of the Smallest Character — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Compare Strings by Frequency of the Smallest Character. Medium difficulty, 63.2% acceptance rate. Topics: Array, Hash Table, String, Binary Search, Sorting."
date: "2027-08-06"
category: "dsa-patterns"
tags:
  [
    "compare-strings-by-frequency-of-the-smallest-character",
    "array",
    "hash-table",
    "string",
    "medium",
  ]
---

# How to Solve Compare Strings by Frequency of the Smallest Character

This problem asks us to compare strings based on the frequency of their lexicographically smallest character. Given two arrays of strings, we need to count how many times each query string's frequency value is less than the frequency values of the words. The challenge lies in efficiently computing these frequency values and comparing them without resorting to O(n²) comparisons.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
words = ["cbd", "zaaaz", "bbb"]
queries = ["za", "a", "aa"]
```

**Step 1: Compute f(s) for each word**

- "cbd": smallest char = 'b', frequency = 1 → f = 1
- "zaaaz": smallest char = 'a', frequency = 3 → f = 3
- "bbb": smallest char = 'b', frequency = 3 → f = 3

**Step 2: Compute f(s) for each query**

- "za": smallest char = 'a', frequency = 1 → f = 1
- "a": smallest char = 'a', frequency = 1 → f = 1
- "aa": smallest char = 'a', frequency = 2 → f = 2

**Step 3: Compare each query f-value with word f-values**
For query "za" (f=1): words with f > 1 → "zaaaz"(3), "bbb"(3) → count = 2
For query "a" (f=1): same as above → count = 2
For query "aa" (f=2): words with f > 2 → "zaaaz"(3), "bbb"(3) → count = 2

**Output:** [2, 2, 2]

The key insight is that we don't need to compare each query with each word individually. Instead, we can sort the word frequencies and use binary search to quickly count how many words have f-values greater than each query's f-value.

## Brute Force Approach

The most straightforward approach would be:

1. Compute f(s) for each word
2. Compute f(s) for each query
3. For each query, iterate through all words and count how many have f-value > query's f-value

This approach has O(n × m) time complexity where n = words.length and m = queries.length. For each query (m), we check all words (n). With constraints up to 5000 strings each, this could mean 25 million comparisons, which is too slow.

<div class="code-group">

```python
# Time: O(n × m) | Space: O(n + m)
def numSmallerByFrequency_brute(words, queries):
    # Helper function to compute f(s)
    def f(s):
        smallest_char = min(s)  # Find lexicographically smallest character
        return s.count(smallest_char)  # Count its frequency

    # Compute f-values for all words
    word_freqs = [f(word) for word in words]

    # Compute f-values for all queries
    query_freqs = [f(query) for query in queries]

    result = []
    # For each query, count words with higher f-value
    for q_freq in query_freqs:
        count = 0
        for w_freq in word_freqs:
            if w_freq > q_freq:
                count += 1
        result.append(count)

    return result
```

```javascript
// Time: O(n × m) | Space: O(n + m)
function numSmallerByFrequencyBrute(words, queries) {
  // Helper function to compute f(s)
  const f = (s) => {
    // Find smallest character by sorting or manual comparison
    const chars = s.split("").sort();
    const smallest = chars[0];
    return s.split("").filter((c) => c === smallest).length;
  };

  // Compute f-values for all words
  const wordFreqs = words.map((word) => f(word));

  // Compute f-values for all queries
  const queryFreqs = queries.map((query) => f(query));

  const result = [];
  // For each query, count words with higher f-value
  for (const qFreq of queryFreqs) {
    let count = 0;
    for (const wFreq of wordFreqs) {
      if (wFreq > qFreq) {
        count++;
      }
    }
    result.push(count);
  }

  return result;
}
```

```java
// Time: O(n × m) | Space: O(n + m)
public int[] numSmallerByFrequencyBrute(String[] words, String[] queries) {
    // Helper function to compute f(s)
    Function<String, Integer> f = (s) -> {
        char smallest = 'z';
        // Find smallest character
        for (char c : s.toCharArray()) {
            if (c < smallest) {
                smallest = c;
            }
        }
        // Count frequency of smallest character
        int count = 0;
        for (char c : s.toCharArray()) {
            if (c == smallest) {
                count++;
            }
        }
        return count;
    };

    // Compute f-values for all words
    int[] wordFreqs = new int[words.length];
    for (int i = 0; i < words.length; i++) {
        wordFreqs[i] = f.apply(words[i]);
    }

    // Compute f-values for all queries
    int[] queryFreqs = new int[queries.length];
    for (int i = 0; i < queries.length; i++) {
        queryFreqs[i] = f.apply(queries[i]);
    }

    int[] result = new int[queries.length];
    // For each query, count words with higher f-value
    for (int i = 0; i < queries.length; i++) {
        int count = 0;
        for (int j = 0; j < words.length; j++) {
            if (wordFreqs[j] > queryFreqs[i]) {
                count++;
            }
        }
        result[i] = count;
    }

    return result;
}
```

</div>

## Optimized Approach

The key optimization is recognizing that we can:

1. Compute all word f-values once and sort them
2. For each query, use binary search to find how many words have f-value > query's f-value

Why does this work? After sorting the word frequencies, we can use binary search to find the first index where the frequency is greater than the query's frequency. All elements to the right of this index will also be greater (since the array is sorted).

The binary search approach reduces the time complexity from O(n × m) to O((n + m) log n), which is much more efficient for large inputs.

## Optimal Solution

Here's the optimal solution using sorting and binary search:

<div class="code-group">

```python
# Time: O((n + m) log n) | Space: O(n + m)
def numSmallerByFrequency(words, queries):
    """
    Main function to solve the problem.
    Steps:
    1. Compute f(s) for all words
    2. Sort the word frequencies
    3. For each query, use binary search to count words with higher frequency
    """

    def f(s):
        """
        Compute frequency of lexicographically smallest character.
        Time: O(L) where L is length of string
        """
        # Find smallest character by comparing ASCII values
        smallest = 'z'  # Start with largest possible
        for char in s:
            if char < smallest:
                smallest = char

        # Count occurrences of smallest character
        count = 0
        for char in s:
            if char == smallest:
                count += 1
        return count

    # Step 1: Compute f-values for all words
    word_freqs = [f(word) for word in words]

    # Step 2: Sort word frequencies for binary search
    word_freqs.sort()
    n = len(word_freqs)

    # Step 3: Process each query using binary search
    result = []
    for query in queries:
        query_freq = f(query)

        # Binary search to find first index where word_freq > query_freq
        left, right = 0, n
        while left < right:
            mid = (left + right) // 2
            if word_freqs[mid] > query_freq:
                # Move right boundary left to continue searching
                right = mid
            else:
                # Move left boundary right since we need > query_freq
                left = mid + 1

        # All elements from 'left' to end have f-value > query_freq
        count = n - left
        result.append(count)

    return result
```

```javascript
// Time: O((n + m) log n) | Space: O(n + m)
function numSmallerByFrequency(words, queries) {
  /**
   * Compute frequency of lexicographically smallest character.
   * Time: O(L) where L is length of string
   */
  const f = (s) => {
    // Find smallest character
    let smallest = "z";
    for (let i = 0; i < s.length; i++) {
      if (s[i] < smallest) {
        smallest = s[i];
      }
    }

    // Count occurrences of smallest character
    let count = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === smallest) {
        count++;
      }
    }
    return count;
  };

  // Step 1: Compute f-values for all words
  const wordFreqs = words.map((word) => f(word));

  // Step 2: Sort word frequencies for binary search
  wordFreqs.sort((a, b) => a - b);
  const n = wordFreqs.length;

  // Step 3: Process each query using binary search
  const result = [];
  for (const query of queries) {
    const queryFreq = f(query);

    // Binary search to find first index where wordFreq > queryFreq
    let left = 0,
      right = n;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (wordFreqs[mid] > queryFreq) {
        // Move right boundary left to continue searching
        right = mid;
      } else {
        // Move left boundary right since we need > queryFreq
        left = mid + 1;
      }
    }

    // All elements from 'left' to end have f-value > queryFreq
    const count = n - left;
    result.push(count);
  }

  return result;
}
```

```java
// Time: O((n + m) log n) | Space: O(n + m)
public int[] numSmallerByFrequency(String[] words, String[] queries) {
    /**
     * Compute frequency of lexicographically smallest character.
     * Time: O(L) where L is length of string
     */
    private int f(String s) {
        // Find smallest character
        char smallest = 'z';
        for (char c : s.toCharArray()) {
            if (c < smallest) {
                smallest = c;
            }
        }

        // Count occurrences of smallest character
        int count = 0;
        for (char c : s.toCharArray()) {
            if (c == smallest) {
                count++;
            }
        }
        return count;
    }

    public int[] numSmallerByFrequency(String[] words, String[] queries) {
        // Step 1: Compute f-values for all words
        int[] wordFreqs = new int[words.length];
        for (int i = 0; i < words.length; i++) {
            wordFreqs[i] = f(words[i]);
        }

        // Step 2: Sort word frequencies for binary search
        Arrays.sort(wordFreqs);
        int n = wordFreqs.length;

        // Step 3: Process each query using binary search
        int[] result = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int queryFreq = f(queries[i]);

            // Binary search to find first index where wordFreq > queryFreq
            int left = 0, right = n;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (wordFreqs[mid] > queryFreq) {
                    // Move right boundary left to continue searching
                    right = mid;
                } else {
                    // Move left boundary right since we need > queryFreq
                    left = mid + 1;
                }
            }

            // All elements from 'left' to end have f-value > queryFreq
            result[i] = n - left;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Computing f(s) for all words: O(n × L₁) where n is number of words and L₁ is average word length
- Computing f(s) for all queries: O(m × L₂) where m is number of queries and L₂ is average query length
- Sorting word frequencies: O(n log n)
- Binary search for each query: O(m log n)
- **Total: O((n + m) log n + nL₁ + mL₂)**. Since string lengths are limited (≤ 10), this simplifies to **O((n + m) log n)**

**Space Complexity:**

- Storing word frequencies: O(n)
- Storing result array: O(m)
- **Total: O(n + m)** (excluding input storage)

## Common Mistakes

1. **Incorrect f(s) calculation**: Some candidates mistakenly find the character with maximum frequency instead of the frequency of the smallest character. Always read the problem carefully: "frequency of the lexicographically smallest character."

2. **Off-by-one errors in binary search**: The binary search implementation needs careful handling of boundaries. When we find `word_freqs[mid] > query_freq`, we set `right = mid` (not `mid - 1`) because `mid` might be the first element greater than query_freq.

3. **Forgetting to sort before binary search**: Binary search only works on sorted arrays. Always sort the word frequencies before performing binary searches.

4. **Inefficient f(s) implementation**: Using `sorted(s)[0]` or similar approaches that sort the entire string is O(L log L) instead of O(L). A simple linear scan to find the smallest character is more efficient.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Frequency counting with constraints**: Similar to problems like [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) where you need to process strings based on character frequencies.

2. **Binary search on sorted arrays for counting comparisons**: This pattern appears in problems like [How Many Numbers Are Smaller Than the Current Number](https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/) and [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/).

3. **Preprocessing and querying**: The pattern of preprocessing data (computing and sorting frequencies) to answer multiple queries efficiently is common in problems like [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/).

## Key Takeaways

1. **When you need to compare each query against all elements, consider sorting and binary search** to reduce O(n × m) to O((n + m) log n).

2. **Preprocessing is key for multiple queries**: Compute values once and reuse them for all queries rather than recomputing for each comparison.

3. **Pay attention to comparison direction**: The problem asks for "words with f-value > query f-value," not "≥". This affects the binary search condition and the final count calculation.

[Practice this problem on CodeJeet](/problem/compare-strings-by-frequency-of-the-smallest-character)
