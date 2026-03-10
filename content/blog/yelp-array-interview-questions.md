---
title: "Array Questions at Yelp: What to Expect"
description: "Prepare for Array interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2030-12-28"
category: "dsa-patterns"
tags: ["yelp", "array", "interview prep"]
---

If you're preparing for a Yelp software engineering interview, you'll quickly notice something significant: **Arrays are the single most important data structure you need to master.** Out of 27 tagged topics on their company page, a staggering 12 are Array-related. This isn't a coincidence. Yelp's core product—connecting users with local businesses—is fundamentally built on processing and ranking lists: lists of search results, lists of reviews, lists of photos, lists of business attributes. Your interview will reflect this reality. While other companies might emphasize exotic graph algorithms or complex system design minutiae, Yelp's technical screen and onsite loops consistently return to a candidate's ability to manipulate, traverse, and reason about arrays efficiently. Expect at least one, and often two, array-focused problems in any interview loop. Treating array proficiency as a secondary topic is a critical mistake.

## Specific Patterns Yelp Favors

Yelp's array problems aren't about obscure tricks. They test **practical data processing skills**. You'll see a heavy emphasis on:

1.  **Two-Pointer & Sliding Window:** This is the undisputed king of Yelp array patterns. Why? It's the workhorse for processing sequential data—think filtering search results, finding duplicate entries, or validating sequences. Problems often involve sorted arrays or require finding a subarray that meets a condition.
2.  **Hash Map for Frequency & Lookup:** The natural companion to arrays. Yelp problems frequently involve counting occurrences (e.g., finding the most reviewed business category) or checking for the existence of complementary data (like a user and a business ID pair).
3.  **In-Place Array Modification:** Yelp values engineers who write memory-efficient code. Problems that ask you to remove duplicates, move zeros, or apply a transformation without allocating a new array are common. This tests your understanding of array indexing and careful iteration.
4.  **Simulation & Iteration:** Less about advanced algorithms and more about cleanly translating a business rule into code. You might be asked to simulate a queue of API requests or process a log file represented as an array of strings.

You will **not** typically see heavy dynamic programming, complex matrix traversal, or advanced graph theory on arrays at Yelp. The focus is on applied, clean, and optimal solutions to problems that mirror their data pipelines.

## How to Prepare

The best preparation is targeted practice on the pattern variations Yelp loves. Let's look at the cornerstone: the **Two-Pointer** technique. There are two main flavors, and you must know both.

**Flavor 1: Opposite Ends (for sorted arrays)**
This is classic for problems like "Two Sum II - Input Array Is Sorted (#167)". You use one pointer at the start and one at the end, moving them inward based on a comparison.

<div class="code-group">

```python
# LeetCode #167: Two Sum II - Input Array Is Sorted
# Time: O(n) | Space: O(1)
def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed per problem
        elif current_sum < target:
            left += 1  # Need a larger sum, move left pointer right
        else:
            right -= 1  # Need a smaller sum, move right pointer left
    return [-1, -1]  # No solution found
```

```javascript
// LeetCode #167: Two Sum II - Input Array Is Sorted
// Time: O(n) | Space: O(1)
function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1];
}
```

```java
// LeetCode #167: Two Sum II - Input Array Is Sorted
// Time: O(n) | Space: O(1)
public int[] twoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            return new int[]{left + 1, right + 1};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{-1, -1};
}
```

</div>

**Flavor 2: Same-Side / Sliding Window (for subarrays)**
This is used for problems like finding the longest subarray with a certain property. One pointer (`right`) expands the window, the other (`left`) contracts it to maintain a valid state.

<div class="code-group">

```python
# LeetCode #3: Longest Substring Without Repeating Characters
# (Applied to an array of characters or a string)
# Time: O(n) | Space: O(k) where k is the size of the character set
def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_length = 0

    for right in range(len(s)):
        # If duplicate found, shrink window from the left
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        # Add the new character and update max length
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// LeetCode #3: Longest Substring Without Repeating Characters
// Time: O(n) | Space: O(k)
function lengthOfLongestSubstring(s) {
  const charSet = new Set();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
```

```java
// LeetCode #3: Longest Substring Without Repeating Characters
// Time: O(n) | Space: O(k)
public int lengthOfLongestSubstring(String s) {
    Set<Character> charSet = new HashSet<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        while (charSet.contains(s.charAt(right))) {
            charSet.remove(s.charAt(left));
            left++;
        }
        charSet.add(s.charAt(right));
        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
}
```

</div>

## How Yelp Tests Array vs Other Companies

Yelp's array questions sit at a unique intersection. Compared to **FAANG companies**, they are often less abstract and more directly tied to plausible data scenarios (e.g., "merge overlapping business hours" vs. "find the median of two sorted arrays"). The difficulty is consistently in the **LeetCode Medium** range, with a strong bias towards problems that have a clean, 20-25 line solution. You're unlikely to get a "Hard" that requires deep mathematical insight.

Compared to **early-stage startups**, Yelp's questions are more structured and algorithmic. They expect optimal Big O notation, not just a brute-force working solution. However, they also highly value **code clarity and communication**. A clean, well-explained solution that is slightly suboptimal can sometimes fare better than a terse, optimal one that you struggle to justify. The interviewer is evaluating how you'd perform as a teammate writing maintainable code, not just as a competition programmer.

## Study Order

Tackle these sub-topics in this order to build a logical skill pyramid:

1.  **Basic Traversal & Hash Map Lookup:** Before you can run, you must walk. Be utterly comfortable iterating through arrays and using hash maps (dictionaries/objects) for O(1) lookups. This is the foundation for almost everything else.
2.  **In-Place Modification:** Learn to manipulate indices within a single pass (`left` pointer for writing, `i` pointer for reading). This teaches you to think about array memory layout, a key skill for writing efficient code.
3.  **Two-Pointer (Opposite Ends):** Start with sorted arrays. This pattern is intuitive and builds confidence in using multiple indices.
4.  **Two-Pointer (Sliding Window):** This is a step up in complexity. Master fixed-size windows first, then move to variable-size windows that require a condition to be maintained.
5.  **Prefix Sum & Caching:** Learn how to pre-compute running sums to answer subarray sum queries in O(1) time. This often pairs beautifully with hash maps for problems like "Subarray Sum Equals K (#560)."
6.  **Simulation & Iteration:** Finally, practice problems that are less about a specific algorithm and more about neatly implementing a set of rules. This tests your general coding hygiene and ability to handle edge cases.

## Recommended Practice Order

Solve these problems in sequence. Each one reinforces a pattern needed for the next.

1.  **Two Sum (#1)** - Hash Map foundation.
2.  **Remove Duplicates from Sorted Array (#26)** - In-place modification.
3.  **Two Sum II - Input Array Is Sorted (#167)** - Opposite-end two-pointer.
4.  **Move Zeroes (#283)** - Another in-place modification classic.
5.  **Longest Substring Without Repeating Characters (#3)** - Sliding window mastery.
6.  **Merge Intervals (#56)** - Very Yelp-relevant (think merging business hours). Tests sorting and iteration.
7.  **Subarray Sum Equals K (#560)** - Combines prefix sum and hash map. A quintessential Yelp-style "data processing" problem.
8.  **Find All Anagrams in a String (#438)** - A more advanced fixed-size sliding window problem.

By following this path, you won't just be memorizing solutions; you'll be building the precise toolkit Yelp's interviewers are looking for. Your practice should feel like training for a specific event, not a general decathlon.

[Practice Array at Yelp](/company/yelp/array)
