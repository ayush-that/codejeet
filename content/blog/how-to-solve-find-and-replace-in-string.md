---
title: "How to Solve Find And Replace in String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find And Replace in String. Medium difficulty, 50.9% acceptance rate. Topics: Array, Hash Table, String, Sorting."
date: "2026-06-03"
category: "dsa-patterns"
tags: ["find-and-replace-in-string", "array", "hash-table", "string", "medium"]
---

# How to Solve Find And Replace in String

This problem asks us to perform multiple find-and-replace operations on a string, but with a twist: we must check if each replacement is valid before applying it. The challenge comes from handling overlapping replacements and ensuring we process them in the correct order. What makes this interesting is that we can't just iterate through the string making replacements as we go, because later replacements might affect earlier ones, and we need to handle cases where replacements don't match.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
s = "abcd"
indices = [0, 2]
sources = ["a", "cd"]
targets = ["eee", "ffff"]
```

**Step 1:** We need to check each replacement operation:

- Operation 0: Check if substring starting at index 0 is "a" → yes, it is
- Operation 1: Check if substring starting at index 2 is "cd" → yes, it is

**Step 2:** Since both replacements are valid, we need to apply them. But we can't just replace them in order because:

- If we replace "a" with "eee" first, we get "eeebcd"
- Then "cd" is no longer at index 2 (it's at index 3 now)

**Step 3:** The key insight: we should process replacements from right to left (highest index to lowest). This way, earlier replacements don't affect the indices of later ones:

- Replace "cd" at index 2 with "ffff" → "abffff"
- Replace "a" at index 0 with "eee" → "eeebffff"

**Step 4:** Final result: "eeebffff"

This right-to-left processing ensures indices remain valid throughout the operation.

## Brute Force Approach

A naive approach would be to process replacements in the given order:

1. For each operation i from 0 to k-1:
   - Check if s.substring(indices[i]) starts with sources[i]
   - If yes, replace that substring with targets[i]
   - Update s with the new string

The problem with this approach is that after each replacement, all subsequent indices become invalid. For example, if we replace a 2-character substring with a 5-character one, all indices after that point shift by +3 characters. We'd need to constantly recalculate indices, which is messy and error-prone.

Even worse, if replacements overlap (like replacing "ab" and "bc" where both start at adjacent positions), processing left-to-right might cause us to use the wrong indices or miss valid replacements.

**Why this fails:** The brute force doesn't account for index shifting after replacements. Each replacement changes the string length and character positions, making subsequent indices in the original array meaningless for the modified string.

## Optimized Approach

The key insight is to process replacements **from right to left** (highest index to lowest index). This ensures that when we make a replacement, it doesn't affect the indices of any replacements we haven't processed yet.

Here's the step-by-step reasoning:

1. **Sort operations by index in descending order:** We need to process highest indices first. Since indices might not be sorted, we create a list of operations sorted by index in reverse order.

2. **Check validity before replacement:** For each operation, verify that the substring starting at the given index matches the source string.

3. **Build the result efficiently:** Instead of modifying the string in place (which is O(n) per operation), we can build the result using string builder/string buffer for efficiency.

4. **Handle non-matching operations:** If a source doesn't match at its index, we simply skip that replacement.

The critical realization is that processing right-to-left makes the problem tractable because:

- Later (higher-index) replacements don't affect earlier (lower-index) ones
- We can use the original indices throughout the entire process
- No need to track index shifts or maintain complex mappings

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n + k log k) where n = len(s), k = number of operations
# Space: O(n) for the result string
def findReplaceString(s: str, indices: List[int], sources: List[str], targets: List[str]) -> str:
    # Step 1: Create a list of operations with their index, source, and target
    # We'll sort this list by index in descending order for right-to-left processing
    operations = []
    for i in range(len(indices)):
        operations.append((indices[i], sources[i], targets[i]))

    # Step 2: Sort operations by index in descending order
    # This ensures we process highest indices first
    operations.sort(key=lambda x: x[0], reverse=True)

    # Convert string to list for efficient modifications
    # Strings are immutable in Python, so we work with a list
    result = list(s)

    # Step 3: Process each operation from right to left
    for idx, source, target in operations:
        # Check if the substring starting at idx matches the source
        # We need to ensure we don't go out of bounds
        if idx + len(source) <= len(s) and s[idx:idx+len(source)] == source:
            # Replace the characters from idx to idx+len(source) with target
            # Since we're using a list, we can replace a slice
            result[idx:idx+len(source)] = list(target)

    # Step 4: Convert list back to string
    return ''.join(result)
```

```javascript
// Time: O(n + k log k) where n = s.length, k = indices.length
// Space: O(n) for the result string
function findReplaceString(s, indices, sources, targets) {
  // Step 1: Create an array of operations with index, source, and target
  const operations = [];
  for (let i = 0; i < indices.length; i++) {
    operations.push([indices[i], sources[i], targets[i]]);
  }

  // Step 2: Sort operations by index in descending order
  // This ensures we process highest indices first (right-to-left)
  operations.sort((a, b) => b[0] - a[0]);

  // Convert string to array for efficient modifications
  // Strings are immutable in JavaScript
  const result = s.split("");

  // Step 3: Process each operation from right to left
  for (const [idx, source, target] of operations) {
    // Check if the substring starting at idx matches the source
    // Ensure we don't go out of bounds
    if (idx + source.length <= s.length && s.substring(idx, idx + source.length) === source) {
      // Replace the characters from idx to idx+source.length with target
      // We do this by splicing the target characters into the array
      result.splice(idx, source.length, ...target.split(""));
    }
  }

  // Step 4: Convert array back to string
  return result.join("");
}
```

```java
// Time: O(n + k log k) where n = s.length(), k = indices.length
// Space: O(n) for the result string
public String findReplaceString(String s, int[] indices, String[] sources, String[] targets) {
    // Step 1: Create a list of operations with index, source, and target
    List<int[]> operations = new ArrayList<>();
    for (int i = 0; i < indices.length; i++) {
        operations.add(new int[]{indices[i], i});
    }

    // Step 2: Sort operations by index in descending order
    // We store the original index i to access sources and targets arrays
    Collections.sort(operations, (a, b) -> b[0] - a[0]);

    // Use StringBuilder for efficient string manipulation
    StringBuilder result = new StringBuilder(s);

    // Step 3: Process each operation from right to left
    for (int[] op : operations) {
        int idx = op[0];
        int originalIndex = op[1];
        String source = sources[originalIndex];
        String target = targets[originalIndex];

        // Check if the substring starting at idx matches the source
        // Ensure we don't go out of bounds
        if (idx + source.length() <= s.length() &&
            s.substring(idx, idx + source.length()).equals(source)) {
            // Replace the characters from idx to idx+source.length() with target
            result.replace(idx, idx + source.length(), target);
        }
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + k log k)**

- `k log k`: Sorting k operations takes O(k log k) time
- `n`: In the worst case, we might check every character in the string when verifying substring matches. Each substring check is O(L) where L is the source length, and in total across all operations this could be O(n).
- Building the final string takes O(n) time

**Space Complexity: O(n)**

- We need O(n) space to store the result string
- The operations array takes O(k) space, but k ≤ n in practice
- Additional O(log k) for sorting stack space (for the recursive sort algorithm)

The dominant factor is usually the string length n, since k is typically much smaller than n in practice.

## Common Mistakes

1. **Processing left-to-right without adjusting indices:** This is the most common mistake. Candidates try to process operations in given order, not realizing that each replacement changes the indices for subsequent operations. Always process from right to left when indices refer to the original string.

2. **Forgetting to check substring bounds:** When checking if `sources[i]` matches at `indices[i]`, you must verify that `indices[i] + len(sources[i]) <= len(s)`. Otherwise, you'll get an index out of bounds error when trying to access the substring.

3. **Using string concatenation instead of StringBuilder/StringBuffer:** In Java and JavaScript, repeatedly modifying strings with `+` or `concat` creates new string objects each time, resulting in O(n²) time complexity. Always use StringBuilder (Java) or array operations (JavaScript/Python) for efficiency.

4. **Not handling overlapping replacements correctly:** If two replacements overlap (e.g., replace "ab" at index 0 and "bc" at index 1), you need to decide which one takes precedence. The problem doesn't specify, but typically you should process all valid replacements. The right-to-left approach handles this correctly.

## When You'll See This Pattern

The "process from right to left to preserve indices" pattern appears in several string manipulation problems:

1. **Merge Intervals (LeetCode 56):** When merging overlapping intervals, you often process them sorted by start time, but sometimes need right-to-left processing when dealing with nested structures.

2. **Insert Interval (LeetCode 57):** Similar to this problem, when inserting a new interval into a sorted list of non-overlapping intervals, you might process from right to left to avoid shifting indices.

3. **Text Justification (LeetCode 68):** When building justified text, you often process words from right to left within a line to distribute spaces evenly.

4. **String Compression (LeetCode 443):** When compressing strings in-place, you typically write from right to left to avoid overwriting characters you haven't processed yet.

The core pattern is: **When modifications affect the positions of elements you haven't processed yet, work backwards to keep references valid.**

## Key Takeaways

1. **Right-to-left processing preserves indices:** When you need to make multiple modifications to a sequence where each modification might change positions of unprocessed elements, always process from the end toward the beginning.

2. **Always validate before replacement:** Check bounds and content match before attempting any string replacement to avoid index errors and incorrect results.

3. **Use efficient string builders:** Never use naive string concatenation in loops. Use StringBuilder in Java, array operations in JavaScript/Python, or similar efficient constructs in other languages.

4. **Sort operations when needed:** If operations aren't already in the order you need them (like right-to-left), sort them first. The O(k log k) sorting cost is usually acceptable compared to the O(n) string operations.

[Practice this problem on CodeJeet](/problem/find-and-replace-in-string)
