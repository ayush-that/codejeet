---
title: "Medium Visa Interview Questions: Strategy Guide"
description: "How to tackle 72 medium difficulty questions from Visa — patterns, time targets, and practice tips."
date: "2032-04-25"
category: "tips"
tags: ["visa", "medium", "interview prep"]
---

Medium questions at Visa typically focus on practical data manipulation, array/string processing, and common algorithmic patterns applied to real-world scenarios. These problems assess your ability to write clean, efficient, and bug-free code under time constraints. Expect questions that test logical reasoning and attention to detail, often with constraints that require optimized solutions.

## Common Patterns

Visa’s Medium problems frequently involve arrays, strings, hash maps, and sliding windows. You’ll encounter tasks like validating data formats, transforming datasets, or finding optimal subarrays. Two recurring patterns are:

**1. Sliding Window for Subarray/Substring Problems**
Used when you need to find a contiguous segment meeting certain criteria (e.g., maximum sum, longest substring with constraints).

<div class="code-group">

```python
def max_subarray_sum(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum
```

```javascript
function maxSubarraySum(arr, k) {
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
```

```java
public int maxSubarraySum(int[] arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
```

</div>

**2. Hash Map for Frequency/Condition Checks**
Common for problems involving anagrams, pair sums, or duplicate detection.

<div class="code-group">

```python
def find_anagrams(s, p):
    from collections import Counter
    p_count = Counter(p)
    s_count = Counter(s[:len(p)])
    result = []
    for i in range(len(p), len(s)):
        if s_count == p_count:
            result.append(i - len(p))
        s_count[s[i]] = s_count.get(s[i], 0) + 1
        s_count[s[i - len(p)]] -= 1
        if s_count[s[i - len(p)]] == 0:
            del s_count[s[i - len(p)]]
    if s_count == p_count:
        result.append(len(s) - len(p))
    return result
```

```javascript
function findAnagrams(s, p) {
  const pCount = new Map();
  const sCount = new Map();
  for (let char of p) pCount.set(char, (pCount.get(char) || 0) + 1);
  const result = [];
  for (let i = 0; i < s.length; i++) {
    sCount.set(s[i], (sCount.get(s[i]) || 0) + 1);
    if (i >= p.length) {
      const leftChar = s[i - p.length];
      sCount.set(leftChar, sCount.get(leftChar) - 1);
      if (sCount.get(leftChar) === 0) sCount.delete(leftChar);
    }
    if (i >= p.length - 1 && mapsEqual(sCount, pCount)) {
      result.push(i - p.length + 1);
    }
  }
  return result;
}
function mapsEqual(map1, map2) {
  if (map1.size !== map2.size) return false;
  for (let [key, val] of map1) if (val !== map2.get(key)) return false;
  return true;
}
```

```java
public List<Integer> findAnagrams(String s, String p) {
    List<Integer> result = new ArrayList<>();
    if (s.length() < p.length()) return result;
    int[] pCount = new int[26];
    int[] sCount = new int[26];
    for (char c : p.toCharArray()) pCount[c - 'a']++;
    for (int i = 0; i < s.length(); i++) {
        sCount[s.charAt(i) - 'a']++;
        if (i >= p.length()) sCount[s.charAt(i - p.length()) - 'a']--;
        if (i >= p.length() - 1 && Arrays.equals(sCount, pCount)) {
            result.add(i - p.length() + 1);
        }
    }
    return result;
}
```

</div>

## Time Targets

Aim to solve a Medium problem within 20–25 minutes during a Visa interview. Break this down: spend 2–3 minutes clarifying the problem and edge cases, 5–7 minutes designing the approach (including discussing brute force and optimization), 10–12 minutes writing clean code, and the remaining 3–5 minutes testing with examples and discussing complexity. Practice explaining your thought process aloud while coding to demonstrate clarity under pressure.

## Practice Strategy

Focus on quality over quantity. For each Medium problem:

1. **Solve without help first** – time yourself to simulate interview conditions.
2. **Analyze the pattern** – categorize the problem (e.g., sliding window, hash map) and note why that approach works.
3. **Write code in multiple languages** – if you’re comfortable with Python, JavaScript, and Java, practice translating solutions to build flexibility.
4. **Review edge cases** – test with empty inputs, large values, and invalid data.
5. **Repeat tough problems** – revisit any you struggled with after a few days to reinforce learning.

Prioritize Visa’s tagged Medium questions, but also practice similar patterns from other companies to strengthen recognition.

[Practice Medium Visa questions](/company/visa/medium)
