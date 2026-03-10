---
title: "Array Questions at Media.net: What to Expect"
description: "Prepare for Array interview questions at Media.net — patterns, difficulty breakdown, and study tips."
date: "2030-07-01"
category: "dsa-patterns"
tags: ["medianet", "array", "interview prep"]
---

If you're preparing for Media.net interviews, you've likely seen the stats: **24 of their 33 tagged questions are Array-based.** That's not just a quirk of their LeetCode tag; it's a direct reflection of their business. Media.net is a contextual advertising company, and their core systems—real-time bidding, ad placement, user segmentation, and data stream processing—all fundamentally operate on sequences of data. Arrays (and by extension, strings) are the bedrock data structure for these operations. In real interviews, you can almost guarantee at least one, if not two, of your coding rounds will center on manipulating an array or string. This isn't a secondary topic; it's the primary battlefield.

## Specific Patterns Media.net Favors

Media.net's array problems aren't about obscure tricks. They test **applied algorithmic thinking on sequential data.** You won't find purely academic graph theory here. Instead, you'll see a heavy emphasis on:

1.  **Two-Pointer & Sliding Window:** This is their single most frequent pattern. It's essential for optimizing problems involving subarrays, sorted data, or removing duplicates—all common in processing log streams or user event arrays.
2.  **Prefix Sum & Hashing:** They love problems where you need to track cumulative states or find subarrays meeting a sum condition (e.g., number of subarrays with sum K). This maps directly to metrics like "number of ad impressions in a time window."
3.  **In-place Array Modification:** Questions that ask you to rearrange, segregate, or modify an array using O(1) extra space are common. This tests your ability to work within memory constraints, a real concern in high-throughput systems.
4.  **Simulation & Index Manipulation:** Problems that require carefully following a set of rules to rearrange elements (think Rotate Array, Jump Game). These test bug-free, iterative logic.

You will notice a distinct _lack_ of complex recursive Dynamic Programming (like knapsack variations) or advanced graph algorithms (like network flow). Their DP tends to be the simpler, iterative 1D or 2D variety applicable to arrays (e.g., Maximum Subarray #53). The focus is on clean, efficient, and practical code.

## How to Prepare

The key is to master the core patterns to the point where you can identify the _variant_. Let's look at the cornerstone: **Sliding Window with a Hash Map**. This pattern solves a huge class of "longest/shortest subarray with at most K distinct characters/values" problems.

<div class="code-group">

```python
def longest_substring_with_k_distinct(s: str, k: int) -> int:
    """
    Finds the length of the longest substring with at most K distinct characters.
    Media.net Variant: Could be "longest subarray with at most K unique ad IDs."
    Time: O(n) | Space: O(k) - where k is the number of distinct keys in the map.
    """
    char_count = {}
    left = 0
    max_len = 0

    for right in range(len(s)):
        # Add the current character to the window
        right_char = s[right]
        char_count[right_char] = char_count.get(right_char, 0) + 1

        # Shrink the window until condition is valid (at most K distinct)
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # Update the maximum length of the valid window
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
function longestSubstringWithKDistinct(s, k) {
  /**
   * Finds the length of the longest substring with at most K distinct characters.
   * Media.net Variant: Could be "longest subarray with at most K unique ad IDs."
   * Time: O(n) | Space: O(k) - where k is the number of distinct keys in the map.
   */
  const charCount = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // Add the current character to the window
    const rightChar = s[right];
    charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);

    // Shrink the window until condition is valid (at most K distinct)
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++;
    }

    // Update the maximum length of the valid window
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
```

```java
public int longestSubstringWithKDistinct(String s, int k) {
    /**
     * Finds the length of the longest substring with at most K distinct characters.
     * Media.net Variant: Could be "longest subarray with at most K unique ad IDs."
     * Time: O(n) | Space: O(k) - where k is the number of distinct keys in the map.
     */
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        // Add the current character to the window
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);

        // Shrink the window until condition is valid (at most K distinct)
        while (charCount.size() > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) == 0) {
                charCount.remove(leftChar);
            }
            left++;
        }

        // Update the maximum length of the valid window
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}
```

</div>

Another critical pattern is **In-place Reversal or Rotation**. Here's how to tackle a classic efficiently:

<div class="code-group">

```python
def rotate_array_in_place(nums, k):
    """
    Rotates the array to the right by k steps. Does it in-place with O(1) extra space.
    Time: O(n) | Space: O(1)
    """
    n = len(nums)
    k %= n  # Handle cases where k > n

    def reverse(arr, start, end):
        while start < end:
            arr[start], arr[end] = arr[end], arr[start]
            start += 1
            end -= 1

    # Reverse the entire array
    reverse(nums, 0, n - 1)
    # Reverse the first k elements
    reverse(nums, 0, k - 1)
    # Reverse the remaining n-k elements
    reverse(nums, k, n - 1)
```

```javascript
function rotateArrayInPlace(nums, k) {
  /**
   * Rotates the array to the right by k steps. Does it in-place with O(1) extra space.
   * Time: O(n) | Space: O(1)
   */
  const n = nums.length;
  k %= n; // Handle cases where k > n

  const reverse = (arr, start, end) => {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  };

  // Reverse the entire array
  reverse(nums, 0, n - 1);
  // Reverse the first k elements
  reverse(nums, 0, k - 1);
  // Reverse the remaining n-k elements
  reverse(nums, k, n - 1);
}
```

```java
public void rotateArrayInPlace(int[] nums, int k) {
    /**
     * Rotates the array to the right by k steps. Does it in-place with O(1) extra space.
     * Time: O(n) | Space: O(1)
     */
    int n = nums.length;
    k %= n; // Handle cases where k > n

    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
}

private void reverse(int[] nums, int start, int end) {
    while (start < end) {
        int temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start++;
        end--;
    }
}
```

</div>

## How Media.net Tests Array vs Other Companies

- **vs. FAANG:** FAANG questions often use arrays as a _jumping-off point_ to more complex data structures (e.g., "design an LRU cache" which uses a hash map and doubly-linked list). Media.net's questions are more likely to start and finish with the array itself. The complexity is in the algorithm, not the data structure composition.
- **vs. Startups:** Startups might ask more open-ended, design-heavy array problems. Media.net's problems are typically well-defined LeetCode-style questions, but with a bias towards the patterns listed above.
- **The Media.net Difference:** Their questions feel "practical." The scenarios often implicitly model data streams, time-series metrics, or batch processing jobs. The optimal solution usually requires **O(n) time and O(1) or O(k) space**, reflecting real-world system constraints. They prize efficiency and correctness over clever, obscure solutions.

## Study Order

Tackle these sub-topics in this order to build a logical foundation:

1.  **Basic Traversal & Pointers:** Get comfortable with single-loop and nested-loop patterns. This is non-negotiable.
2.  **Two-Pointer (Sorted Data):** Learn to solve problems like Two Sum II (#167) or Remove Duplicates (#26). This builds intuition for pointer movement.
3.  **Sliding Window (Fixed & Dynamic):** Start with fixed-size windows (Maximum Average Subarray I #643), then move to dynamic windows controlled by a condition (Longest Substring Without Repeating Characters #3). This is arguably the most important pattern for Media.net.
4.  **Prefix Sum & Hashing:** Learn how to use a hash map to store running sums or states to find subarrays in O(n) time (Subarray Sum Equals K #560, Contiguous Array #525).
5.  **In-place Operations:** Practice swapping, reversing, and segregating elements without extra space (Move Zeroes #283, Sort Colors #75).
6.  **Simulation & Index Jumps:** Finally, work on problems that require carefully following rules (Jump Game #55, Rotate Array #189). These test your loop invariants and edge-case handling.

## Recommended Practice Order

Solve these Media.net-tagged problems in sequence. Each introduces a slight twist on the core patterns:

1.  **Two Sum (#1)** - The classic hash map warm-up.
2.  **Remove Duplicates from Sorted Array (#26)** - Basic two-pointer in-place.
3.  **Maximum Subarray (#53)** - Simple iterative DP / Kadane's Algorithm.
4.  **Sort Colors (#75)** - Classic in-place partitioning (Dutch National Flag).
5.  **Subarray Sum Equals K (#560)** - Essential prefix sum + hash map pattern.
6.  **Longest Substring Without Repeating Characters (#3)** - The quintessential sliding window with hash map.
7.  **Rotate Array (#189)** - Master the in-place reversal trick shown above.
8.  **Jump Game (#55)** - Good simulation/index manipulation problem.
9.  **Product of Array Except Self (#238)** - Tests understanding of prefix/postfix concepts without division.
10. **Find All Duplicates in an Array (#442)** - An excellent example of using the array itself as a hash map (in-place marking).

This progression takes you from foundational concepts to the combined techniques you'll need in the interview. Remember, for Media.net, depth in array manipulation beats breadth across all data structures.

[Practice Array at Media.net](/company/medianet/array)
