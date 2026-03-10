---
title: "Counting Sort Interview Questions: Patterns and Strategies"
description: "Master Counting Sort problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-06-15"
category: "dsa-patterns"
tags: ["counting-sort", "dsa", "interview prep"]
---

# Counting Sort Interview Questions: Patterns and Strategies

You're in an interview at Google, and you've just solved a medium-difficulty array problem with a clever O(n log n) solution. The interviewer nods, then asks: "Can you do it in O(n) time?" You pause. The array contains integers with a limited range. This is where counting sort separates candidates who know patterns from those who just know algorithms.

Counting sort isn't just another sorting algorithm—it's a gateway to linear-time solutions for problems that appear to require sorting. I've seen countless candidates miss the optimal solution because they didn't recognize when to reach for this tool. The key insight? When the problem mentions "integers with limited range" or "values between 0 and k," counting sort should be your first thought, not your last resort.

## Common Patterns

### Pattern 1: Frequency Array for Bounded Values

This is the most fundamental pattern. When values have a known, limited range (like 0-100, or 0-26 for lowercase letters), you can use an array where the index represents the value and the value at that index represents its frequency.

**LeetCode Problems:** Sort Colors (#75), Find All Numbers Disappeared in an Array (#448), Relative Sort Array (#1122)

The intuition here is simple but powerful: instead of comparing elements to sort them, you count how many of each value exist, then reconstruct the sorted array. This gives you O(n + k) time where k is the range size, which becomes O(n) when k is constant or small relative to n.

<div class="code-group">

```python
def counting_sort(arr, max_val):
    """
    Basic counting sort for integers from 0 to max_val.
    Time: O(n + k) where k = max_val + 1
    Space: O(k) for the count array
    """
    # Count frequencies
    count = [0] * (max_val + 1)
    for num in arr:
        count[num] += 1

    # Reconstruct sorted array
    idx = 0
    for val in range(len(count)):
        for _ in range(count[val]):
            arr[idx] = val
            idx += 1
    return arr
```

```javascript
function countingSort(arr, maxVal) {
  // Time: O(n + k) where k = maxVal + 1
  // Space: O(k) for the count array
  const count = new Array(maxVal + 1).fill(0);

  // Count frequencies
  for (const num of arr) {
    count[num]++;
  }

  // Reconstruct sorted array
  let idx = 0;
  for (let val = 0; val < count.length; val++) {
    for (let i = 0; i < count[val]; i++) {
      arr[idx] = val;
      idx++;
    }
  }
  return arr;
}
```

```java
public void countingSort(int[] arr, int maxVal) {
    // Time: O(n + k) where k = maxVal + 1
    // Space: O(k) for the count array
    int[] count = new int[maxVal + 1];

    // Count frequencies
    for (int num : arr) {
        count[num]++;
    }

    // Reconstruct sorted array
    int idx = 0;
    for (int val = 0; val < count.length; val++) {
        for (int i = 0; i < count[val]; i++) {
            arr[idx] = val;
            idx++;
        }
    }
}
```

</div>

### Pattern 2: Prefix Sum for Position Calculation

This advanced pattern modifies the basic frequency array to store cumulative counts. Each position in the count array now tells you where the last occurrence of that value should go in the output array. This is essential for stable sorting and is the foundation for radix sort.

**LeetCode Problems:** H-Index (#274), Maximum Gap (#164), Custom Sort String (#791)

The intuition: Instead of just counting, we calculate positions. If we have 3 zeros and 5 ones, then the first one should go at position 3 (after all zeros), and the last one at position 7. This pattern shines when you need to preserve relative order of equal elements or when you're building more complex algorithms on top of counting sort.

<div class="code-group">

```python
def stable_counting_sort(arr, max_val):
    """
    Stable counting sort using prefix sums.
    Time: O(n + k) where k = max_val + 1
    Space: O(n + k) for output and count arrays
    """
    n = len(arr)
    output = [0] * n
    count = [0] * (max_val + 1)

    # Count frequencies
    for num in arr:
        count[num] += 1

    # Convert to prefix sums (cumulative counts)
    for i in range(1, len(count)):
        count[i] += count[i - 1]

    # Build output array (backwards for stability)
    for i in range(n - 1, -1, -1):
        num = arr[i]
        count[num] -= 1
        output[count[num]] = num

    return output
```

```javascript
function stableCountingSort(arr, maxVal) {
  // Time: O(n + k) where k = maxVal + 1
  // Space: O(n + k) for output and count arrays
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(maxVal + 1).fill(0);

  // Count frequencies
  for (const num of arr) {
    count[num]++;
  }

  // Convert to prefix sums
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  // Build output array (backwards for stability)
  for (let i = n - 1; i >= 0; i--) {
    const num = arr[i];
    count[num]--;
    output[count[num]] = num;
  }

  return output;
}
```

```java
public int[] stableCountingSort(int[] arr, int maxVal) {
    // Time: O(n + k) where k = maxVal + 1
    // Space: O(n + k) for output and count arrays
    int n = arr.length;
    int[] output = new int[n];
    int[] count = new int[maxVal + 1];

    // Count frequencies
    for (int num : arr) {
        count[num]++;
    }

    // Convert to prefix sums
    for (int i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }

    // Build output array (backwards for stability)
    for (int i = n - 1; i >= 0; i--) {
        int num = arr[i];
        count[num]--;
        output[count[num]] = num;
    }

    return output;
}
```

</div>

### Pattern 3: Character Frequency for String Problems

When dealing with lowercase/uppercase English letters (26 possible values) or ASCII characters (128 possible values), counting sort becomes exceptionally efficient. The range is so small (k=26 or 128) that O(n + k) is effectively O(n).

**LeetCode Problems:** Valid Anagram (#242), First Unique Character in a String (#387), Sort Characters By Frequency (#451)

The intuition: Strings are just arrays of characters with limited possible values. By counting character frequencies, you can solve anagrams, find unique characters, or sort by frequency—all in linear time. This pattern is so common that you should have it memorized.

<div class="code-group">

```python
def is_anagram(s, t):
    """
    Check if two strings are anagrams using character counting.
    Time: O(n) where n is length of strings (k=26 is constant)
    Space: O(1) since count array size is fixed (26)
    """
    if len(s) != len(t):
        return False

    # Count characters in s
    count = [0] * 26
    for ch in s:
        count[ord(ch) - ord('a')] += 1

    # Subtract counts using t
    for ch in t:
        idx = ord(ch) - ord('a')
        count[idx] -= 1
        if count[idx] < 0:
            return False

    return True
```

```javascript
function isAnagram(s, t) {
  // Time: O(n) where n is length of strings (k=26 is constant)
  // Space: O(1) since count array size is fixed (26)
  if (s.length !== t.length) return false;

  const count = new Array(26).fill(0);

  // Count characters in s
  for (const ch of s) {
    count[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Subtract counts using t
  for (const ch of t) {
    const idx = ch.charCodeAt(0) - "a".charCodeAt(0);
    count[idx]--;
    if (count[idx] < 0) return false;
  }

  return true;
}
```

```java
public boolean isAnagram(String s, String t) {
    // Time: O(n) where n is length of strings (k=26 is constant)
    // Space: O(1) since count array size is fixed (26)
    if (s.length() != t.length()) return false;

    int[] count = new int[26];

    // Count characters in s
    for (char ch : s.toCharArray()) {
        count[ch - 'a']++;
    }

    // Subtract counts using t
    for (char ch : t.toCharArray()) {
        int idx = ch - 'a';
        count[idx]--;
        if (count[idx] < 0) return false;
    }

    return true;
}
```

</div>

## When to Use Counting Sort vs Alternatives

The decision tree is simpler than most candidates think:

**Use counting sort when:**

1. Values have a limited, known range (e.g., 0-100, lowercase letters, ages 0-150)
2. You need O(n) time and can afford O(k) space where k is the range size
3. The problem involves frequencies, counts, or sorting with small integer keys

**Use comparison-based sorting (quicksort, mergesort) when:**

1. Values have unlimited or unknown range
2. You need in-place sorting with O(1) extra space
3. You're dealing with custom objects with complex comparison logic

**Use bucket sort when:**

1. Values are uniformly distributed over a range
2. You need O(n) average time but can tolerate O(n²) worst-case
3. The range is large but distribution is even

**Use a hash map instead when:**

1. You only need to check existence or count frequencies
2. The range is theoretically limited but practically large (e.g., all 32-bit integers)
3. You need O(1) average-time lookups more than sorted order

The key recognition signal: If a problem statement mentions "integers" and gives a constraint like "0 <= nums[i] <= 100" or "contains only lowercase English letters," counting sort should be your default approach.

## Edge Cases and Gotchas

### 1. Negative Numbers

Basic counting sort assumes non-negative integers. For negative numbers, you need to shift the range. If values range from -k to k, create an array of size 2k+1 and map value v to index v+k.

### 2. Large Range, Small n

When k (range size) is much larger than n (number of elements), counting sort's O(n + k) becomes inefficient. For example, sorting [1, 1000000] with counting sort would use an array of size 1000000. In interviews, mention this tradeoff—sometimes a hash map is better.

### 3. Stability Requirements

If the problem requires stable sorting (equal elements keep their original order), you must use the prefix sum approach and build the output array backwards. Regular counting sort isn't stable.

### 4. Character Encoding Assumptions

When counting characters, don't assume ASCII (128 characters) unless specified. For internationalization, Unicode has over 140,000 characters—a counting array would be massive. In interviews, clarify: "Assuming English lowercase letters" or "Assuming ASCII."

## Difficulty Breakdown

With 56% easy and 44% medium problems, counting sort questions are relatively accessible but still test fundamental understanding. The easies test basic pattern recognition—can you spot when to use a frequency array? The mediums test application—can you modify the pattern for specific constraints?

Prioritize the medium problems. They're what you'll actually see in interviews at top companies. The easy problems are good for building intuition, but the mediums teach you how to adapt the core idea to new situations.

## Which Companies Ask Counting Sort

**Amazon** (/company/amazon) loves counting sort for string manipulation problems, especially in their online assessment. They frequently ask variations of anagram and character frequency problems.

**Google** (/company/google) uses counting sort as a component in more complex problems. They might ask you to implement it as part of a larger solution, testing whether you understand its time/space tradeoffs.

**Meta** (/company/meta) prefers practical applications—sorting user ages, counting post reactions, or analyzing text data. Their counting sort problems often have real-world contexts.

**Microsoft** (/company/microsoft) tests the stable counting sort variant and its use in radix sort. They care about implementation details and edge cases.

**Bloomberg** (/company/bloomberg) asks counting sort for financial data with bounded ranges—prices within a certain band, trade counts, or rating categories.

## Study Tips

1. **Master the three patterns in order**: Start with frequency arrays, then prefix sums, then character counting. Each builds on the previous.

2. **Recommended problem order**:
   - First: Valid Anagram (#242) and First Unique Character (#387) for character counting
   - Then: Sort Colors (#75) for basic frequency arrays
   - Then: H-Index (#274) for prefix sum applications
   - Finally: Maximum Gap (#164) for the most challenging application

3. **Implement from scratch** three times: Once with just frequency counting, once with prefix sums for stability, and once for character problems. Muscle memory matters.

4. **Practice explaining the tradeoffs**: Be ready to discuss when you'd use counting sort vs hash map vs comparison sort. Interviewers love candidates who understand the "why," not just the "how."

Remember: Counting sort isn't just about sorting—it's about exploiting limited ranges for linear-time solutions. When you see bounded integers or limited character sets, this should be your go-to tool.

[Practice all Counting Sort questions on CodeJeet](/topic/counting-sort)
