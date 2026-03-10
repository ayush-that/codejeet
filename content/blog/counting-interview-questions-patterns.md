---
title: "Counting Interview Questions: Patterns and Strategies"
description: "Master Counting problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-04-02"
category: "dsa-patterns"
tags: ["counting", "dsa", "interview prep"]
---

# Counting Interview Questions: Patterns and Strategies

You're solving a seemingly straightforward problem: "Find the majority element in an array." You think, "I'll just sort it and take the middle element — O(n log n), done." Then the interviewer asks, "Can you do it in O(n) time with O(1) space?" That's when candidates realize they've underestimated counting problems. The majority element problem (#169) is a classic example that separates candidates who understand counting fundamentals from those who don't. Counting questions appear in about 159 LeetCode problems, with 35% easy, 51% medium, and 14% hard — a distribution that suggests interviewers use these as both warm-ups and serious technical probes.

## Common Patterns

### 1. Frequency Counter Pattern

This is the most fundamental counting pattern: use a hash map to track element frequencies. The intuition is simple — when you need to compare distributions, check for anagrams, or find duplicates, a frequency map gives you O(1) access to counts.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def is_anagram(s: str, t: str) -> bool:
    """LeetCode #242: Valid Anagram"""
    if len(s) != len(t):
        return False

    # Count frequencies in first string
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Decrement for second string
    for char in t:
        if char not in freq or freq[char] == 0:
            return False
        freq[char] -= 1

    return True
```

```javascript
// Time: O(n) | Space: O(n)
function isAnagram(s, t) {
  // LeetCode #242: Valid Anagram
  if (s.length !== t.length) return false;

  const freq = new Map();

  // Count frequencies in first string
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Decrement for second string
  for (const char of t) {
    if (!freq.has(char) || freq.get(char) === 0) {
      return false;
    }
    freq.set(char, freq.get(char) - 1);
  }

  return true;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean isAnagram(String s, String t) {
    // LeetCode #242: Valid Anagram
    if (s.length() != t.length()) return false;

    Map<Character, Integer> freq = new HashMap<>();

    // Count frequencies in first string
    for (char c : s.toCharArray()) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }

    // Decrement for second string
    for (char c : t.toCharArray()) {
        if (!freq.containsKey(c) || freq.get(c) == 0) {
            return false;
        }
        freq.put(c, freq.get(c) - 1);
    }

    return true;
}
```

</div>

**Related problems:** #1 Two Sum (frequency approach), #49 Group Anagrams, #347 Top K Frequent Elements. The key insight is that many problems become trivial once you realize you're comparing distributions rather than sequences.

### 2. Boyer-Moore Majority Vote Algorithm

This elegant algorithm finds the majority element (appearing more than n/2 times) in O(n) time and O(1) space. The intuition: if an element appears more than half the time, it will survive a "cancellation" process where we pair it against different elements.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def majority_element(nums):
    """LeetCode #169: Majority Element"""
    candidate = None
    count = 0

    # First pass: find candidate
    for num in nums:
        if count == 0:
            candidate = num
            count = 1
        elif num == candidate:
            count += 1
        else:
            count -= 1

    # Second pass: verify (required if not guaranteed majority exists)
    count = 0
    for num in nums:
        if num == candidate:
            count += 1

    return candidate if count > len(nums) // 2 else -1
```

```javascript
// Time: O(n) | Space: O(1)
function majorityElement(nums) {
  // LeetCode #169: Majority Element
  let candidate = null;
  let count = 0;

  // First pass: find candidate
  for (const num of nums) {
    if (count === 0) {
      candidate = num;
      count = 1;
    } else if (num === candidate) {
      count++;
    } else {
      count--;
    }
  }

  // Second pass: verify
  count = 0;
  for (const num of nums) {
    if (num === candidate) count++;
  }

  return count > Math.floor(nums.length / 2) ? candidate : -1;
}
```

```java
// Time: O(n) | Space: O(1)
public int majorityElement(int[] nums) {
    // LeetCode #169: Majority Element
    Integer candidate = null;
    int count = 0;

    // First pass: find candidate
    for (int num : nums) {
        if (count == 0) {
            candidate = num;
            count = 1;
        } else if (num == candidate) {
            count++;
        } else {
            count--;
        }
    }

    // Second pass: verify
    count = 0;
    for (int num : nums) {
        if (num == candidate) count++;
    }

    return count > nums.length / 2 ? candidate : -1;
}
```

</div>

**Related problems:** #229 Majority Element II (finding elements appearing more than n/3 times), #1157 Online Majority Element In Subarray. This pattern teaches you that sometimes you don't need to store everything — you just need to track what matters.

### 3. Counting Sort Pattern

When the input range is limited (like lowercase letters or numbers 0-100), counting sort gives you O(n) sorting. The intuition: instead of comparing elements, count frequencies and reconstruct the sorted array.

<div class="code-group">

```python
# Time: O(n + k) where k is range size | Space: O(k)
def counting_sort(arr, max_val):
    """Classic counting sort implementation"""
    count = [0] * (max_val + 1)

    # Count frequencies
    for num in arr:
        count[num] += 1

    # Reconstruct sorted array
    sorted_arr = []
    for num in range(len(count)):
        sorted_arr.extend([num] * count[num])

    return sorted_arr
```

```javascript
// Time: O(n + k) where k is range size | Space: O(k)
function countingSort(arr, maxVal) {
  // Classic counting sort implementation
  const count = new Array(maxVal + 1).fill(0);

  // Count frequencies
  for (const num of arr) {
    count[num]++;
  }

  // Reconstruct sorted array
  const sortedArr = [];
  for (let num = 0; num < count.length; num++) {
    for (let i = 0; i < count[num]; i++) {
      sortedArr.push(num);
    }
  }

  return sortedArr;
}
```

```java
// Time: O(n + k) where k is range size | Space: O(k)
public int[] countingSort(int[] arr, int maxVal) {
    // Classic counting sort implementation
    int[] count = new int[maxVal + 1];

    // Count frequencies
    for (int num : arr) {
        count[num]++;
    }

    // Reconstruct sorted array
    int[] sortedArr = new int[arr.length];
    int index = 0;
    for (int num = 0; num < count.length; num++) {
        for (int i = 0; i < count[num]; i++) {
            sortedArr[index++] = num;
        }
    }

    return sortedArr;
}
```

</div>

**Related problems:** #75 Sort Colors (Dutch flag problem), #274 H-Index, #1051 Height Checker. This pattern shines when the problem hints at limited input range — always check constraints before choosing your approach.

## When to Use Counting vs Alternatives

The decision tree for counting problems often looks like this:

1. **Hash map vs sorting**: Use a hash map (O(n) space) when you need frequency information for specific lookups. Use sorting (O(n log n) time, O(1) or O(n) space) when you need ordered relationships or when space is constrained. For example, in #242 Valid Anagram, sorting both strings and comparing gives O(n log n) time and O(1) space if you can modify inputs, while the hash map gives O(n) time and O(n) space.

2. **Counting sort vs comparison sort**: Use counting sort when the range of values is limited (typically less than n). The rule of thumb: if max_value ≤ n, consider counting sort. In #75 Sort Colors, the values are only 0, 1, 2 — perfect for counting sort.

3. **Boyer-Moore vs hash map for majority**: Use Boyer-Moore when you need O(1) space and the majority is guaranteed or you can verify. Use a hash map when you need exact frequencies for all elements or when dealing with multiple potential majorities.

**Decision criteria**: Ask yourself: (1) What's the input range? (2) Do I need exact counts or just relative comparisons? (3) Is space or time more constrained? (4) Can I modify the input?

## Edge Cases and Gotchas

1. **Empty and single-element inputs**: Always check for empty arrays/strings. In frequency counting, an empty input might return True for anagram checks (empty strings are anagrams of each other). Test with `[]`, `""`, `[1]`, `"a"`.

2. **Integer overflow in counts**: When counting frequencies of large numbers of elements, ensure your count variables don't overflow. In Python this is less critical, but in Java/C++ with large n (>2³¹), use long integers.

3. **Case sensitivity and character sets**: In string problems, clarify if 'A' == 'a'. For international characters, know that Python/JavaScript handle Unicode, but some counting approaches assume ASCII. Always ask: "Should this be case-sensitive?"

4. **Negative numbers and zero**: When using array indices for counting (like counting sort), negative numbers break the pattern. Either offset by the minimum value or use a hash map. In #1 Two Sum, negative numbers work fine with hash maps but break some two-pointer approaches.

Here's how to handle the negative number case:

<div class="code-group">

```python
def count_with_negatives(arr):
    """Handle negative numbers in counting"""
    min_val = min(arr)
    max_val = max(arr)
    offset = -min_val  # Make all values non-negative

    count = [0] * (max_val - min_val + 1)
    for num in arr:
        count[num + offset] += 1

    # Process counts...
```

```javascript
function countWithNegatives(arr) {
  // Handle negative numbers in counting
  const minVal = Math.min(...arr);
  const maxVal = Math.max(...arr);
  const offset = -minVal; // Make all values non-negative

  const count = new Array(maxVal - minVal + 1).fill(0);
  for (const num of arr) {
    count[num + offset]++;
  }

  // Process counts...
}
```

```java
public void countWithNegatives(int[] arr) {
    // Handle negative numbers in counting
    int minVal = Arrays.stream(arr).min().getAsInt();
    int maxVal = Arrays.stream(arr).max().getAsInt();
    int offset = -minVal;  // Make all values non-negative

    int[] count = new int[maxVal - minVal + 1];
    for (int num : arr) {
        count[num + offset]++;
    }

    // Process counts...
}
```

</div>

## Difficulty Breakdown

With 56 easy (35%), 81 medium (51%), and 22 hard (14%) counting problems, here's what this means for your preparation:

- **Easy problems** test basic pattern recognition: "Do you know to use a hash map for frequency counting?" These are often warm-up questions or part of larger problems. Master these first — they're low-hanging fruit.

- **Medium problems** combine counting with other techniques: counting + two pointers (#424 Longest Repeating Character Replacement), counting + sliding window (#76 Minimum Window Substring), counting + greedy algorithms. These are the core interview questions.

- **Hard problems** often involve: (1) Multiple counting passes (#41 First Missing Positive), (2) Mathematical insights with counting (#782 Transform to Chessboard), or (3) Counting in specialized data structures like segment trees. Unless you're interviewing for a specialized role, prioritize mediums over hards.

## Which Companies Ask Counting

- **Google** (/company/google): Favors clever counting algorithms like Boyer-Moore and problems with mathematical insights. They love #229 Majority Element II and problems that can be solved in O(1) space.

- **Amazon** (/company/amazon): Prefers practical counting problems related to real-world scenarios — anagrams, frequency analysis, inventory counting. Look for #49 Group Anagrams and #347 Top K Frequent Elements.

- **Meta** (/company/meta): Often combines counting with string manipulation and sliding windows. Expect problems like #76 Minimum Window Substring and #424 Longest Repeating Character Replacement.

- **Bloomberg** (/company/bloomberg): Likes financial-oriented counting problems and those with clear, optimized solutions. They frequently ask #1 Two Sum and variations.

- **Microsoft** (/company/microsoft): Tends toward classic computer science counting problems and those with multiple approaches. Practice #169 Majority Element and #242 Valid Anagram.

Each company has a style: Google wants cleverness, Amazon wants practicality, Meta wants string expertise, Bloomberg wants optimization, Microsoft wants fundamentals.

## Study Tips

1. **Start with the frequency counter pattern** — it's the foundation. Solve #242 Valid Anagram, #49 Group Anagrams, and #347 Top K Frequent Elements. Notice how the same pattern solves all three.

2. **Learn to recognize input constraints** — when you see "only lowercase English letters" or "0 ≤ nums[i] ≤ 100", think counting sort or array-based counting instead of hash maps.

3. **Practice the verification step** — many candidates forget to verify their Boyer-Moore candidate or check edge cases. Always write the verification pass unless the problem guarantees a majority exists.

4. **Recommended problem order**:
   - Week 1: Easy frequency problems (#242, #387, #169)
   - Week 2: Medium combinations (#49, #347, #424)
   - Week 3: Advanced patterns (#229, #76, #41)
   - Week 4: Company-specific problems based on your target

Remember: Counting problems test your ability to recognize that sometimes the best solution doesn't compare elements — it counts them. The difference between O(n²) and O(n) often comes down to this realization.

[Practice all Counting questions on CodeJeet](/topic/counting)
