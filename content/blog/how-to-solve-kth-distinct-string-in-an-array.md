---
title: "How to Solve Kth Distinct String in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Kth Distinct String in an Array. Easy difficulty, 82.1% acceptance rate. Topics: Array, Hash Table, String, Counting."
date: "2028-03-16"
category: "dsa-patterns"
tags: ["kth-distinct-string-in-an-array", "array", "hash-table", "string", "easy"]
---

# How to Solve Kth Distinct String in an Array

This problem asks us to find the k-th string in an array that appears exactly once. While conceptually straightforward, it requires careful handling of counting and ordering: we must preserve the original order when identifying distinct strings, and we need to efficiently track which strings appear only once. The challenge lies in balancing efficient counting with maintaining insertion order to correctly identify the k-th distinct element.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Consider:

```
arr = ["d", "b", "c", "b", "c", "a"]
k = 2
```

We need to find the 2nd string that appears exactly once in the array.

**Step 1: Count occurrences of each string**

- "d" appears 1 time
- "b" appears 2 times
- "c" appears 2 times
- "a" appears 1 time

**Step 2: Identify distinct strings (appearing exactly once)**

- "d" is distinct (appears once)
- "a" is distinct (appears once)
- "b" is NOT distinct (appears twice)
- "c" is NOT distinct (appears twice)

**Step 3: Preserve order while finding k-th distinct string**
We traverse the array in original order:

1. First element "d" → distinct count = 1 (not yet k=2)
2. Second element "b" → not distinct (skip)
3. Third element "c" → not distinct (skip)
4. Fourth element "b" → not distinct (skip)
5. Fifth element "c" → not distinct (skip)
6. Sixth element "a" → distinct count = 2 (equals k=2) → return "a"

The key insight: we need to count frequencies first, then traverse the array again to find strings with count = 1 in their original order.

## Brute Force Approach

A naive approach would be to check each string individually: for each string in the array, scan the entire array to count how many times it appears. If the count is 1, we track it as a distinct string, then try to find the k-th one.

The problem with this approach is efficiency: for each of n strings, we scan all n strings, resulting in O(n²) time complexity. With n up to 1000 in typical constraints, this could be 1,000,000 operations - acceptable but inefficient. More importantly, this approach doesn't naturally handle the ordering requirement well, as we'd need additional logic to track which distinct string comes in which position.

## Optimal Solution

The optimal solution uses a hash map (dictionary) to count frequencies in one pass, then a second pass through the array to find strings with count = 1 in their original order. This gives us O(n) time and O(n) space complexity.

<div class="code-group">

```python
# Time: O(n) where n is the length of arr
# Space: O(n) for the frequency dictionary
def kthDistinct(arr, k):
    """
    Find the k-th distinct string in arr.

    Args:
        arr: List of strings
        k: Integer representing which distinct string to find (1-indexed)

    Returns:
        The k-th distinct string, or empty string if fewer than k distinct strings exist
    """
    # Step 1: Count frequency of each string
    # We use a dictionary to store string -> count mappings
    freq = {}
    for s in arr:
        # Increment count for this string, defaulting to 0 if not seen before
        freq[s] = freq.get(s, 0) + 1

    # Step 2: Traverse array again to find distinct strings in original order
    # We need to maintain the original order, so we can't just use the dictionary keys
    distinct_count = 0
    for s in arr:
        # Check if this string appears exactly once
        if freq[s] == 1:
            distinct_count += 1
            # If we've found the k-th distinct string, return it
            if distinct_count == k:
                return s

    # Step 3: If we reach here, there are fewer than k distinct strings
    return ""
```

```javascript
// Time: O(n) where n is the length of arr
// Space: O(n) for the frequency map
function kthDistinct(arr, k) {
  /**
   * Find the k-th distinct string in arr.
   *
   * @param {string[]} arr - Array of strings
   * @param {number} k - Which distinct string to find (1-indexed)
   * @return {string} The k-th distinct string, or empty string if fewer than k exist
   */

  // Step 1: Count frequency of each string
  // We use a Map to store string -> count mappings
  const freq = new Map();

  for (const s of arr) {
    // Increment count for this string, defaulting to 0 if not seen before
    freq.set(s, (freq.get(s) || 0) + 1);
  }

  // Step 2: Traverse array again to find distinct strings in original order
  // We need to maintain the original order, so we can't just use the map keys
  let distinctCount = 0;

  for (const s of arr) {
    // Check if this string appears exactly once
    if (freq.get(s) === 1) {
      distinctCount++;
      // If we've found the k-th distinct string, return it
      if (distinctCount === k) {
        return s;
      }
    }
  }

  // Step 3: If we reach here, there are fewer than k distinct strings
  return "";
}
```

```java
// Time: O(n) where n is the length of arr
// Space: O(n) for the frequency map
class Solution {
    public String kthDistinct(String[] arr, int k) {
        /**
         * Find the k-th distinct string in arr.
         *
         * @param arr Array of strings
         * @param k Which distinct string to find (1-indexed)
         * @return The k-th distinct string, or empty string if fewer than k exist
         */

        // Step 1: Count frequency of each string
        // We use a HashMap to store string -> count mappings
        Map<String, Integer> freq = new HashMap<>();

        for (String s : arr) {
            // Increment count for this string, defaulting to 0 if not seen before
            freq.put(s, freq.getOrDefault(s, 0) + 1);
        }

        // Step 2: Traverse array again to find distinct strings in original order
        // We need to maintain the original order, so we can't just use the map keys
        int distinctCount = 0;

        for (String s : arr) {
            // Check if this string appears exactly once
            if (freq.get(s) == 1) {
                distinctCount++;
                // If we've found the k-th distinct string, return it
                if (distinctCount == k) {
                    return s;
                }
            }
        }

        // Step 3: If we reach here, there are fewer than k distinct strings
        return "";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- First pass through the array to count frequencies: O(n)
- Second pass through the array to find the k-th distinct string: O(n)
- Total: O(n) + O(n) = O(n), where n is the length of the array

**Space Complexity: O(n)**

- We store a frequency count for each unique string in the array
- In the worst case, all strings are unique, so we store n entries
- Even if strings repeat, we still need to store each unique string once
- Therefore, space complexity is O(n)

The two-pass approach is optimal because we must examine each element at least once to count frequencies, and we need to traverse in original order to find the k-th distinct string. Any solution would require at least O(n) time.

## Common Mistakes

1. **Not preserving original order**: Some candidates try to extract distinct strings directly from the frequency map after counting. However, dictionary/map keys don't preserve insertion order in all languages (though Python 3.7+ and JavaScript Maps do). Even when they do, the order in the map might not match the array's order for strings that appear multiple times. Always traverse the original array to maintain correct ordering.

2. **Off-by-one errors with k**: Remember that k is 1-indexed (the first distinct string corresponds to k=1, not k=0). A common mistake is to check `distinct_count == k-1` or return when `distinct_count > k`. Always verify your condition matches the problem's 1-indexing requirement.

3. **Incorrect frequency counting**: When a string appears for the first time, you need to initialize its count to 1, not 0. Using `freq.get(s, 0) + 1` (Python), `(freq.get(s) || 0) + 1` (JavaScript), or `freq.getOrDefault(s, 0) + 1` (Java) handles this correctly.

4. **Returning wrong value for insufficient distinct strings**: The problem specifies to return an empty string `""` when there are fewer than k distinct strings, not `null`, `None`, or any other value. Always read the return type requirements carefully.

## When You'll See This Pattern

This problem combines two common patterns: frequency counting with hash maps and order-preserving traversal. You'll see similar patterns in:

1. **First Unique Character in a String (LeetCode 387)**: Find the first non-repeating character in a string. Same pattern: count frequencies, then traverse in order to find the first with count = 1.

2. **Sort Characters By Frequency (LeetCode 451)**: Sort characters by frequency. While more complex, it uses the same frequency counting step before additional processing.

3. **Find All Duplicates in an Array (LeetCode 442)**: Find all elements that appear twice. The frequency counting approach is similar, though the criteria differ.

The core technique of "count first, then process in order" appears whenever you need to identify elements based on frequency while maintaining some aspect of their original ordering.

## Key Takeaways

1. **Two-pass hash map approach**: When you need to process elements based on frequency but also need to preserve order, use a hash map to count frequencies in the first pass, then traverse the original data structure in the second pass to apply your logic in the correct order.

2. **Distinct means exactly once**: In coding problems, "distinct" often means "appearing exactly once" rather than "unique" (which could mean "appearing at least once"). Always clarify the definition in the problem statement.

3. **1-indexing awareness**: Many problems use 1-indexing for human readability. Always check whether indices in the problem are 0-based or 1-based, as this affects your comparison logic.

Related problems: [Count Common Words With One Occurrence](/problem/count-common-words-with-one-occurrence)
