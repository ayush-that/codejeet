---
title: "How to Solve Find the Length of the Longest Common Prefix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Length of the Longest Common Prefix. Medium difficulty, 57.0% acceptance rate. Topics: Array, Hash Table, String, Trie."
date: "2026-05-07"
category: "dsa-patterns"
tags: ["find-the-length-of-the-longest-common-prefix", "array", "hash-table", "string", "medium"]
---

# How to Solve "Find the Length of the Longest Common Prefix"

This problem asks you to find the maximum length of a common prefix between any number from `arr1` and any number from `arr2`. A prefix is formed by taking one or more digits starting from the leftmost digit. The challenge lies in efficiently checking all possible prefixes across two arrays without comparing every pair of numbers directly, which would be too slow for large inputs.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
arr1 = [123, 456, 789]
arr2 = [12, 45, 78]
```

We need to find the longest prefix that appears in both arrays. Let's examine the prefixes:

**For arr1:**

- `123` → prefixes: `1`, `12`, `123`
- `456` → prefixes: `4`, `45`, `456`
- `789` → prefixes: `7`, `78`, `789`

**For arr2:**

- `12` → prefixes: `1`, `12`
- `45` → prefixes: `4`, `45`
- `78` → prefixes: `7`, `78`

Now let's find common prefixes:

- `1` appears in both (from 123 and 12) → length 1
- `12` appears in both (from 123 and 12) → length 2
- `4` appears in both (from 456 and 45) → length 1
- `45` appears in both (from 456 and 45) → length 2
- `7` appears in both (from 789 and 78) → length 1
- `78` appears in both (from 789 and 78) → length 2

The longest common prefix length is **2**.

The key insight is that we don't need to compare every pair of numbers. Instead, we can store all prefixes from one array and check prefixes from the other array against this set.

## Brute Force Approach

A naive approach would compare every number in `arr1` with every number in `arr2`, generating all prefixes for each pair:

1. For each number `x` in `arr1`
2. For each number `y` in `arr2`
3. Generate all prefixes of `x` and `y`
4. Find the longest common prefix between `x` and `y`
5. Track the maximum length found

This approach has several problems:

- **Time Complexity:** O(n*m*k) where n and m are array lengths and k is the average number of digits. For arrays of length 10^5 with numbers up to 10^9 (10 digits), this is 10^5 _ 10^5 _ 10 = 10^11 operations — far too slow.
- **Redundant Work:** We regenerate the same prefixes many times. For example, if `arr1` has `123` and `1234`, we'll generate prefixes for `123` twice.

The brute force approach is clearly insufficient for the problem constraints, which typically involve arrays with up to 10^5 elements.

## Optimized Approach

The key insight is to use a **hash set** to store all prefixes from one array, then check prefixes from the other array against this set. This eliminates the nested loops and redundant work.

**Step-by-step reasoning:**

1. **Store all prefixes from arr1:** Convert each number to a string, then extract all possible prefixes (from length 1 to full length) and add them to a hash set.
2. **Check prefixes from arr2:** For each number in `arr2`, generate its prefixes from longest to shortest. The first prefix that exists in our hash set gives us the longest common prefix for that number.
3. **Track the maximum:** Keep track of the maximum prefix length found during step 2.

**Why this works:**

- A hash set provides O(1) average-time lookups, making prefix checks very fast.
- By checking prefixes from longest to shortest for each number in `arr2`, we find the longest match immediately and can move to the next number.
- We only need to store prefixes from one array, not both, which saves memory.

**Optimization detail:** When generating prefixes, we can work with strings directly rather than converting back to integers, since prefix matching is about digit sequences, not numerical values.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(N*d + M*d) where N = len(arr1), M = len(arr2), d = average digits
# Space: O(N*d) for storing all prefixes from arr1
def longestCommonPrefix(arr1, arr2):
    # Step 1: Store all prefixes from arr1 in a hash set
    prefix_set = set()

    for num in arr1:
        # Convert number to string to easily extract prefixes
        num_str = str(num)
        # Generate all possible prefixes: from first digit to full number
        for i in range(1, len(num_str) + 1):
            prefix_set.add(num_str[:i])

    # Step 2: Initialize answer to track maximum common prefix length
    max_length = 0

    # Step 3: Check each number in arr2 against the prefix set
    for num in arr2:
        num_str = str(num)
        # Check prefixes from longest to shortest
        # Start from full length down to 1 (or current max_length + 1 for optimization)
        for length in range(len(num_str), max_length, -1):
            prefix = num_str[:length]
            if prefix in prefix_set:
                # Found a common prefix, update max_length if needed
                max_length = max(max_length, length)
                # No need to check shorter prefixes for this number
                break

    return max_length
```

```javascript
// Time: O(N*d + M*d) where N = arr1.length, M = arr2.length, d = average digits
// Space: O(N*d) for storing all prefixes from arr1
function longestCommonPrefix(arr1, arr2) {
  // Step 1: Store all prefixes from arr1 in a Set
  const prefixSet = new Set();

  for (const num of arr1) {
    // Convert number to string to extract prefixes
    const numStr = num.toString();
    // Generate all prefixes from first digit to full number
    for (let i = 1; i <= numStr.length; i++) {
      prefixSet.add(numStr.substring(0, i));
    }
  }

  // Step 2: Track maximum common prefix length found
  let maxLength = 0;

  // Step 3: Check each number in arr2 against the prefix set
  for (const num of arr2) {
    const numStr = num.toString();
    // Check prefixes from longest to shortest
    // Start from full length down to maxLength+1 (no need to check shorter)
    for (let length = numStr.length; length > maxLength; length--) {
      const prefix = numStr.substring(0, length);
      if (prefixSet.has(prefix)) {
        // Found common prefix, update maxLength
        maxLength = Math.max(maxLength, length);
        // Break inner loop since we found the longest for this number
        break;
      }
    }
  }

  return maxLength;
}
```

```java
// Time: O(N*d + M*d) where N = arr1.length, M = arr2.length, d = average digits
// Space: O(N*d) for storing all prefixes from arr1
public int longestCommonPrefix(int[] arr1, int[] arr2) {
    // Step 1: Store all prefixes from arr1 in a HashSet
    Set<String> prefixSet = new HashSet<>();

    for (int num : arr1) {
        String numStr = Integer.toString(num);
        // Generate all prefixes from first digit to full number
        for (int i = 1; i <= numStr.length(); i++) {
            prefixSet.add(numStr.substring(0, i));
        }
    }

    // Step 2: Track maximum common prefix length
    int maxLength = 0;

    // Step 3: Check each number in arr2 against the prefix set
    for (int num : arr2) {
        String numStr = Integer.toString(num);
        // Check prefixes from longest to shortest
        // Only check lengths greater than current maxLength
        for (int length = numStr.length(); length > maxLength; length--) {
            String prefix = numStr.substring(0, length);
            if (prefixSet.contains(prefix)) {
                // Found common prefix, update maxLength
                maxLength = Math.max(maxLength, length);
                // Break since we found the longest for this number
                break;
            }
        }
    }

    return maxLength;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(N*d + M*d) where:

- N = length of `arr1`
- M = length of `arr2`
- d = average number of digits per number

**Explanation:**

1. Building the prefix set from `arr1`: O(N\*d) — we process each of N numbers, and for each we generate up to d prefixes.
2. Checking `arr2` against the set: O(M\*d) — for each of M numbers, we check up to d prefixes (though in practice we often break early).
3. Hash set operations (add and contains) are O(1) average case.

**Space Complexity:** O(N\*d) for storing all prefixes from `arr1` in the hash set. In the worst case, each number has d unique prefixes, and we store all of them.

**Why this is optimal:** We must examine each digit in both arrays at least once to find common prefixes, so O((N+M)\*d) is a lower bound. Our solution achieves this bound.

## Common Mistakes

1. **Comparing numbers instead of prefixes:** Some candidates try to compare the integer values directly, but `12` is a prefix of `123` even though `12 != 123`. Always work with string representations for prefix operations.

2. **Not optimizing the inner loop:** Checking prefixes from shortest to longest requires checking all prefixes even after finding a match. Always check from longest to shortest and break when you find a match.

3. **Forgetting that numbers are positive integers:** The problem states "positive integers," so we don't need to handle negative numbers or zero-prefixed numbers (like `012`). However, in a real interview, it's good to ask about this constraint.

4. **Incorrect substring indices:** When using `substring(0, i)` or slice notation `[:i]`, remember that `i` is typically exclusive in most languages. For example, `str.substring(0, 3)` gets the first 3 characters (indices 0, 1, 2).

## When You'll See This Pattern

This prefix-matching pattern with hash sets appears in several other problems:

1. **Longest Common Prefix (LeetCode 14):** While that problem finds the common prefix of all strings in an array (not pairs), it uses similar prefix extraction techniques.

2. **Implement Trie (Prefix Tree) (LeetCode 208):** A more advanced version where you need to efficiently store and query prefixes. Our hash set solution is essentially a simplified, one-time-use trie.

3. **Word Search II (LeetCode 212):** Uses a trie to efficiently search for multiple words on a board, checking prefixes to prune impossible paths early.

4. **Search Suggestions System (LeetCode 1268):** Requires finding all products with a given prefix, similar to our prefix matching but with sorting and autocomplete features.

The core pattern is: when you need to efficiently check for prefix existence among many strings/numbers, consider using a hash set (for one-time queries) or a trie (for repeated queries).

## Key Takeaways

1. **Hash sets are excellent for existence checks:** When you need to check if something exists in a collection, hash sets provide O(1) average-time lookups, much faster than linear search.

2. **Work with string representations for digit/character problems:** Converting numbers to strings makes prefix/suffix operations much simpler than using mathematical operations like division and modulus.

3. **Generate prefixes efficiently:** When checking for common prefixes between two collections, store all prefixes from one collection, then check the other collection against this set. This transforms an O(N\*M) problem into O(N+M).

4. **Check from longest to shortest:** When searching for the longest match, always start with the longest possible candidate and work backward. This allows early termination when a match is found.

Related problems: [Longest Common Prefix](/problem/longest-common-prefix), [Longest Common Suffix Queries](/problem/longest-common-suffix-queries)
