---
title: "Counting Interview Questions: Patterns and Strategies"
description: "Master Counting problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-01-11"
category: "dsa-patterns"
tags: ["counting", "dsa", "interview prep"]
---

Counting questions appear in nearly every technical interview because they test fundamental data manipulation skills while revealing a candidate’s attention to detail and efficiency. At their core, these problems require you to track frequencies, compare distributions, or enumerate valid configurations—skills directly applicable to real-world tasks like analytics, deduplication, and resource allocation. Mastering counting patterns isn’t just about solving a niche category; it’s about building a sharper, more systematic approach to problem-solving.

## Common Patterns

### 1. Frequency Counting with Hash Maps

The most frequent pattern involves using a hash map (dictionary, object, or HashMap) to count occurrences of elements. This is the go-to approach for problems involving anagrams, duplicates, or majority elements.

<div class="code-group">

```python
def count_frequency(arr):
    freq = {}
    for num in arr:
        freq[num] = freq.get(num, 0) + 1
    return freq

# Example: Check if two strings are anagrams
def is_anagram(s, t):
    from collections import Counter
    return Counter(s) == Counter(t)
```

```javascript
function countFrequency(arr) {
  const freq = {};
  for (const num of arr) {
    freq[num] = (freq[num] || 0) + 1;
  }
  return freq;
}

// Example: Check if two strings are anagrams
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (let i = 0; i < s.length; i++) {
    count[s[i]] = (count[s[i]] || 0) + 1;
    count[t[i]] = (count[t[i]] || 0) - 1;
  }
  return Object.values(count).every((val) => val === 0);
}
```

```java
import java.util.HashMap;

public class FrequencyCounter {
    public static HashMap<Integer, Integer> countFrequency(int[] arr) {
        HashMap<Integer, Integer> freq = new HashMap<>();
        for (int num : arr) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }
        return freq;
    }

    // Example: Check if two strings are anagrams
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }
}
```

</div>

### 2. Sliding Window with Count Constraints

Many counting problems involve finding subarrays or substrings that satisfy a condition on character or element counts. A sliding window with a frequency map allows dynamic adjustment while maintaining counts.

<div class="code-group">

```python
def longest_substring_with_k_distinct(s, k):
    char_count = {}
    left = max_len = 0
    for right, ch in enumerate(s):
        char_count[ch] = char_count.get(ch, 0) + 1
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len
```

```javascript
function longestSubstringWithKDistinct(s, k) {
  const charCount = new Map();
  let left = 0,
    maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    charCount.set(ch, (charCount.get(ch) || 0) + 1);
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```java
import java.util.HashMap;

public class SlidingWindowCount {
    public static int longestSubstringWithKDistinct(String s, int k) {
        HashMap<Character, Integer> charCount = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            charCount.put(ch, charCount.getOrDefault(ch, 0) + 1);
            while (charCount.size() > k) {
                char leftChar = s.charAt(left);
                charCount.put(leftChar, charCount.get(leftChar) - 1);
                if (charCount.get(leftChar) == 0) {
                    charCount.remove(leftChar);
                }
                left++;
            }
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}
```

</div>

### 3. Prefix Sum for Subarray Counts

When problems require counting subarrays that sum to a target, a prefix sum map efficiently tracks cumulative sums, allowing constant-time lookups for valid subarrays ending at each index.

## Difficulty Breakdown

Our dataset of 159 counting questions breaks down as follows: **Easy (56 questions, 35%)**, **Medium (81 questions, 51%)**, and **Hard (22 questions, 14%)**. This distribution is telling.

The majority are Medium problems, indicating that interviewers most often use counting to assess a candidate’s ability to combine basic frequency tracking with another core concept—like sliding windows, two pointers, or sorting. Easy questions typically test isolated application of a hash map. Hard questions often involve combinatorial reasoning, advanced data structures, or optimizing beyond obvious brute-force counting.

You should prioritize Medium problems. They represent the most common interview hurdle and provide the best return on study time. Once comfortable, tackle Hards to prepare for more rigorous interviews.

## Which Companies Ask Counting

Counting problems are universal, but some top tech companies feature them prominently in their interview loops due to their relevance to data processing and system design.

- **[Google](/company/google)** frequently asks counting questions related to strings, arrays, and large-scale data streams.
- **[Amazon](/company/amazon)** uses them to assess logic for inventory, analytics, and duplicate detection scenarios.
- **[Meta](/company/meta)** favors counting in problems involving social graph analysis and content engagement metrics.
- **[Bloomberg](/company/bloomberg)** incorporates counting in financial data analysis and real-time feed processing.
- **[Microsoft](/company/microsoft)** includes counting in problems related to system resource allocation and data integrity checks.

## Study Tips

1.  **Memorize the Hash Map Template.** The standard loop for building a frequency map should be automatic. Practice writing it in your chosen language without hesitation.
2.  **Map the Problem to a Pattern.** When you read a problem, ask: Is this about comparing frequencies (Pattern 1), maintaining a count within a window (Pattern 2), or finding subarrays with a target sum (Pattern 3)? This initial classification directs your solution.
3.  **Start with Brute Force, Then Optimize.** For a new problem, first describe a naive counting approach. This clarifies the objective. Then, identify the repeated work you can eliminate with a smarter data structure.
4.  **Practice with Constraints.** Many counting problems have optimal solutions only when you notice constraints (e.g., input limited to lowercase English letters allows a fixed-size array instead of a hash map). Always check constraints first.

Build fluency with these patterns and you’ll find that a significant class of interview problems becomes manageable and predictable.

[Practice all Counting questions on CodeJeet](/topic/counting)
