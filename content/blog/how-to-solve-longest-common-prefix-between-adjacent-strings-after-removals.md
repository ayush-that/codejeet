---
title: "How to Solve Longest Common Prefix Between Adjacent Strings After Removals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Common Prefix Between Adjacent Strings After Removals. Medium difficulty, 32.3% acceptance rate. Topics: Array, String."
date: "2029-12-06"
category: "dsa-patterns"
tags: ["longest-common-prefix-between-adjacent-strings-after-removals", "array", "string", "medium"]
---

# How to Solve Longest Common Prefix Between Adjacent Strings After Removals

This problem asks us to compute, for each possible removal of one string from the array, the length of the longest common prefix among all adjacent pairs in the resulting array. What makes this problem interesting is that we need to efficiently handle repeated computations—removing each element one by one would be too slow if done naively. The challenge lies in precomputing information to avoid redundant work.

## Visual Walkthrough

Let's trace through a small example: `words = ["abc", "abcd", "ab", "ac"]`

For each index `i` we remove that word and compute the longest common prefix among adjacent pairs:

**i = 0** (remove "abc"): Remaining array = `["abcd", "ab", "ac"]`

- Adjacent pairs: ("abcd", "ab") → LCP length = 2 ("ab")
- Adjacent pairs: ("ab", "ac") → LCP length = 1 ("a")
- Minimum LCP length among all adjacent pairs = min(2, 1) = 1

**i = 1** (remove "abcd"): Remaining array = `["abc", "ab", "ac"]`

- Adjacent pairs: ("abc", "ab") → LCP length = 2 ("ab")
- Adjacent pairs: ("ab", "ac") → LCP length = 1 ("a")
- Minimum LCP length = min(2, 1) = 1

**i = 2** (remove "ab"): Remaining array = `["abc", "abcd", "ac"]`

- Adjacent pairs: ("abc", "abcd") → LCP length = 3 ("abc")
- Adjacent pairs: ("abcd", "ac") → LCP length = 1 ("a")
- Minimum LCP length = min(3, 1) = 1

**i = 3** (remove "ac"): Remaining array = `["abc", "abcd", "ab"]`

- Adjacent pairs: ("abc", "abcd") → LCP length = 3 ("abc")
- Adjacent pairs: ("abcd", "ab") → LCP length = 2 ("ab")
- Minimum LCP length = min(3, 2) = 2

Result: `[1, 1, 1, 2]`

Notice that when we remove an element at index `i`, only the adjacent pairs involving indices `i-1` and `i` (if `i > 0`) and `i` and `i+1` (if `i < n-1`) are affected. All other adjacent pairs remain unchanged. This observation is key to optimization.

## Brute Force Approach

The most straightforward approach is to simulate the process exactly as described:

1. For each index `i` from 0 to n-1:
   - Create a new array without the element at index `i`
   - For each adjacent pair in the new array, compute their longest common prefix length
   - Take the minimum of these LCP lengths
   - Store the result

This approach has several issues:

- Creating a new array for each removal takes O(n) time and O(n) space
- Computing LCP for each adjacent pair in the new array takes O(n \* m) time where m is the average string length
- Overall complexity becomes O(n² \* m), which is too slow for larger inputs

Here's what the brute force code might look like:

<div class="code-group">

```python
# Time: O(n² * m) | Space: O(n)
def brute_force(words):
    n = len(words)
    result = []

    for i in range(n):
        # Create new array without words[i]
        new_words = words[:i] + words[i+1:]

        min_lcp = float('inf')

        # Compute LCP for each adjacent pair
        for j in range(len(new_words) - 1):
            # Find LCP between new_words[j] and new_words[j+1]
            lcp_len = 0
            str1, str2 = new_words[j], new_words[j+1]
            min_len = min(len(str1), len(str2))

            while lcp_len < min_len and str1[lcp_len] == str2[lcp_len]:
                lcp_len += 1

            # Update minimum LCP
            if lcp_len < min_lcp:
                min_lcp = lcp_len

        # If there are no adjacent pairs (array has 0 or 1 element)
        if min_lcp == float('inf'):
            result.append(0)
        else:
            result.append(min_lcp)

    return result
```

```javascript
// Time: O(n² * m) | Space: O(n)
function bruteForce(words) {
  const n = words.length;
  const result = [];

  for (let i = 0; i < n; i++) {
    // Create new array without words[i]
    const newWords = [...words.slice(0, i), ...words.slice(i + 1)];

    let minLCP = Infinity;

    // Compute LCP for each adjacent pair
    for (let j = 0; j < newWords.length - 1; j++) {
      // Find LCP between newWords[j] and newWords[j+1]
      let lcpLen = 0;
      const str1 = newWords[j];
      const str2 = newWords[j + 1];
      const minLen = Math.min(str1.length, str2.length);

      while (lcpLen < minLen && str1[lcpLen] === str2[lcpLen]) {
        lcpLen++;
      }

      // Update minimum LCP
      if (lcpLen < minLCP) {
        minLCP = lcpLen;
      }
    }

    // If there are no adjacent pairs (array has 0 or 1 element)
    if (minLCP === Infinity) {
      result.push(0);
    } else {
      result.push(minLCP);
    }
  }

  return result;
}
```

```java
// Time: O(n² * m) | Space: O(n)
public int[] bruteForce(String[] words) {
    int n = words.length;
    int[] result = new int[n];

    for (int i = 0; i < n; i++) {
        // Create new array without words[i]
        List<String> newWords = new ArrayList<>();
        for (int j = 0; j < n; j++) {
            if (j != i) {
                newWords.add(words[j]);
            }
        }

        int minLCP = Integer.MAX_VALUE;

        // Compute LCP for each adjacent pair
        for (int j = 0; j < newWords.size() - 1; j++) {
            // Find LCP between newWords[j] and newWords[j+1]
            int lcpLen = 0;
            String str1 = newWords.get(j);
            String str2 = newWords.get(j + 1);
            int minLen = Math.min(str1.length(), str2.length());

            while (lcpLen < minLen && str1.charAt(lcpLen) == str2.charAt(lcpLen)) {
                lcpLen++;
            }

            // Update minimum LCP
            if (lcpLen < minLCP) {
                minLCP = lcpLen;
            }
        }

        // If there are no adjacent pairs (array has 0 or 1 element)
        if (minLCP == Integer.MAX_VALUE) {
            result[i] = 0;
        } else {
            result[i] = minLCP;
        }
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that when we remove element at index `i`, only two adjacent pairs are affected:

1. The pair between indices `i-1` and `i` (if `i > 0`)
2. The pair between indices `i` and `i+1` (if `i < n-1`)

All other adjacent pairs remain exactly the same as in the original array. Therefore, we can:

1. Precompute the LCP lengths for all adjacent pairs in the original array
2. For each removal, we only need to check:
   - The minimum LCP among all pairs that are NOT affected by the removal
   - The new LCP between `i-1` and `i+1` (if both exist after removal)

This reduces the problem to efficiently finding the minimum LCP value in different segments of the array when we exclude one or two specific pairs.

We can use prefix and suffix minimum arrays:

- `prefixMin[i]` = minimum LCP from pairs (0,1) up to (i-1,i)
- `suffixMin[i]` = minimum LCP from pairs (i,i+1) up to (n-2,n-1)

Then for removing element at index `i`:

- Take minimum of:
  - `prefixMin[i]` (all pairs before the affected region)
  - `suffixMin[i+1]` (all pairs after the affected region)
  - The new LCP between `words[i-1]` and `words[i+1]` (if both exist)

## Optimal Solution

Here's the complete optimized solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * m) | Space: O(n)
def longestCommonPrefixAfterRemovals(words):
    n = len(words)

    # Handle edge cases
    if n <= 1:
        return [0] * n

    # Step 1: Precompute LCP lengths for all adjacent pairs
    lcp_between = [0] * (n - 1)
    for i in range(n - 1):
        # Compute LCP between words[i] and words[i+1]
        str1, str2 = words[i], words[i+1]
        min_len = min(len(str1), len(str2))
        lcp_len = 0

        # Compare characters until mismatch or end of shorter string
        while lcp_len < min_len and str1[lcp_len] == str2[lcp_len]:
            lcp_len += 1

        lcp_between[i] = lcp_len

    # Step 2: Build prefix minimum array
    # prefix_min[i] = min LCP from pairs (0,1) to (i-1,i)
    prefix_min = [float('inf')] * (n - 1)
    if n - 1 > 0:
        prefix_min[0] = lcp_between[0]
        for i in range(1, n - 1):
            prefix_min[i] = min(prefix_min[i-1], lcp_between[i])

    # Step 3: Build suffix minimum array
    # suffix_min[i] = min LCP from pairs (i,i+1) to (n-2,n-1)
    suffix_min = [float('inf')] * (n - 1)
    if n - 1 > 0:
        suffix_min[n-2] = lcp_between[n-2]
        for i in range(n-3, -1, -1):
            suffix_min[i] = min(suffix_min[i+1], lcp_between[i])

    # Step 4: Compute answer for each removal
    result = [0] * n

    for i in range(n):
        # Initialize answer components
        left_min = float('inf')
        right_min = float('inf')
        new_pair_lcp = float('inf')

        # Get minimum from pairs before affected region
        if i > 0:
            left_min = prefix_min[i-1] if i-1 >= 0 else float('inf')

        # Get minimum from pairs after affected region
        if i < n - 1:
            right_min = suffix_min[i] if i < n-1 else float('inf')

        # Compute new LCP between words[i-1] and words[i+1] if both exist
        if i > 0 and i < n - 1:
            str1, str2 = words[i-1], words[i+1]
            min_len = min(len(str1), len(str2))
            new_lcp = 0

            while new_lcp < min_len and str1[new_lcp] == str2[new_lcp]:
                new_lcp += 1

            new_pair_lcp = new_lcp

        # Combine all components
        min_val = min(left_min, right_min, new_pair_lcp)

        # If min_val is still infinity (no adjacent pairs after removal)
        if min_val == float('inf'):
            result[i] = 0
        else:
            result[i] = min_val

    return result
```

```javascript
// Time: O(n * m) | Space: O(n)
function longestCommonPrefixAfterRemovals(words) {
  const n = words.length;

  // Handle edge cases
  if (n <= 1) {
    return new Array(n).fill(0);
  }

  // Step 1: Precompute LCP lengths for all adjacent pairs
  const lcpBetween = new Array(n - 1).fill(0);
  for (let i = 0; i < n - 1; i++) {
    // Compute LCP between words[i] and words[i+1]
    const str1 = words[i];
    const str2 = words[i + 1];
    const minLen = Math.min(str1.length, str2.length);
    let lcpLen = 0;

    // Compare characters until mismatch or end of shorter string
    while (lcpLen < minLen && str1[lcpLen] === str2[lcpLen]) {
      lcpLen++;
    }

    lcpBetween[i] = lcpLen;
  }

  // Step 2: Build prefix minimum array
  // prefixMin[i] = min LCP from pairs (0,1) to (i-1,i)
  const prefixMin = new Array(n - 1).fill(Infinity);
  if (n - 1 > 0) {
    prefixMin[0] = lcpBetween[0];
    for (let i = 1; i < n - 1; i++) {
      prefixMin[i] = Math.min(prefixMin[i - 1], lcpBetween[i]);
    }
  }

  // Step 3: Build suffix minimum array
  // suffixMin[i] = min LCP from pairs (i,i+1) to (n-2,n-1)
  const suffixMin = new Array(n - 1).fill(Infinity);
  if (n - 1 > 0) {
    suffixMin[n - 2] = lcpBetween[n - 2];
    for (let i = n - 3; i >= 0; i--) {
      suffixMin[i] = Math.min(suffixMin[i + 1], lcpBetween[i]);
    }
  }

  // Step 4: Compute answer for each removal
  const result = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    // Initialize answer components
    let leftMin = Infinity;
    let rightMin = Infinity;
    let newPairLCP = Infinity;

    // Get minimum from pairs before affected region
    if (i > 0) {
      leftMin = prefixMin[i - 1];
    }

    // Get minimum from pairs after affected region
    if (i < n - 1) {
      rightMin = suffixMin[i];
    }

    // Compute new LCP between words[i-1] and words[i+1] if both exist
    if (i > 0 && i < n - 1) {
      const str1 = words[i - 1];
      const str2 = words[i + 1];
      const minLen = Math.min(str1.length, str2.length);
      let newLCP = 0;

      while (newLCP < minLen && str1[newLCP] === str2[newLCP]) {
        newLCP++;
      }

      newPairLCP = newLCP;
    }

    // Combine all components
    const minVal = Math.min(leftMin, rightMin, newPairLCP);

    // If minVal is still infinity (no adjacent pairs after removal)
    if (minVal === Infinity) {
      result[i] = 0;
    } else {
      result[i] = minVal;
    }
  }

  return result;
}
```

```java
// Time: O(n * m) | Space: O(n)
public int[] longestCommonPrefixAfterRemovals(String[] words) {
    int n = words.length;

    // Handle edge cases
    if (n <= 1) {
        return new int[n];
    }

    // Step 1: Precompute LCP lengths for all adjacent pairs
    int[] lcpBetween = new int[n - 1];
    for (int i = 0; i < n - 1; i++) {
        // Compute LCP between words[i] and words[i+1]
        String str1 = words[i];
        String str2 = words[i + 1];
        int minLen = Math.min(str1.length(), str2.length());
        int lcpLen = 0;

        // Compare characters until mismatch or end of shorter string
        while (lcpLen < minLen && str1.charAt(lcpLen) == str2.charAt(lcpLen)) {
            lcpLen++;
        }

        lcpBetween[i] = lcpLen;
    }

    // Step 2: Build prefix minimum array
    // prefixMin[i] = min LCP from pairs (0,1) to (i-1,i)
    int[] prefixMin = new int[n - 1];
    if (n - 1 > 0) {
        prefixMin[0] = lcpBetween[0];
        for (int i = 1; i < n - 1; i++) {
            prefixMin[i] = Math.min(prefixMin[i - 1], lcpBetween[i]);
        }
    }

    // Step 3: Build suffix minimum array
    // suffixMin[i] = min LCP from pairs (i,i+1) to (n-2,n-1)
    int[] suffixMin = new int[n - 1];
    if (n - 1 > 0) {
        suffixMin[n - 2] = lcpBetween[n - 2];
        for (int i = n - 3; i >= 0; i--) {
            suffixMin[i] = Math.min(suffixMin[i + 1], lcpBetween[i]);
        }
    }

    // Step 4: Compute answer for each removal
    int[] result = new int[n];

    for (int i = 0; i < n; i++) {
        // Initialize answer components
        int leftMin = Integer.MAX_VALUE;
        int rightMin = Integer.MAX_VALUE;
        int newPairLCP = Integer.MAX_VALUE;

        // Get minimum from pairs before affected region
        if (i > 0) {
            leftMin = prefixMin[i - 1];
        }

        // Get minimum from pairs after affected region
        if (i < n - 1) {
            rightMin = suffixMin[i];
        }

        // Compute new LCP between words[i-1] and words[i+1] if both exist
        if (i > 0 && i < n - 1) {
            String str1 = words[i - 1];
            String str2 = words[i + 1];
            int minLen = Math.min(str1.length(), str2.length());
            int newLCP = 0;

            while (newLCP < minLen && str1.charAt(newLCP) == str2.charAt(newLCP)) {
                newLCP++;
            }

            newPairLCP = newLCP;
        }

        // Combine all components
        int minVal = Math.min(Math.min(leftMin, rightMin), newPairLCP);

        // If minVal is still MAX_VALUE (no adjacent pairs after removal)
        if (minVal == Integer.MAX_VALUE) {
            result[i] = 0;
        } else {
            result[i] = minVal;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m)**

- Computing LCP for all adjacent pairs: O((n-1) × m) where m is the average string length
- Building prefix and suffix minimum arrays: O(n)
- Computing answer for each removal: O(n × m) in worst case (when computing new LCP for middle removals)
- Overall: O(n × m)

**Space Complexity: O(n)**

- `lcp_between` array: O(n)
- `prefix_min` and `suffix_min` arrays: O(n) each, but we could optimize to use O(1) extra space by computing on the fly
- Result array: O(n)
- Overall: O(n) additional space

## Common Mistakes

1. **Not handling edge cases properly**: When the array has 0 or 1 element, there are no adjacent pairs after removal. The answer should be 0 for all indices. Candidates often forget this case.

2. **Off-by-one errors in index manipulation**: When accessing `words[i-1]` and `words[i+1]`, it's easy to forget to check bounds. Always verify `i > 0` before accessing `i-1` and `i < n-1` before accessing `i+1`.

3. **Inefficient LCP computation**: Some candidates use substring comparison (`str1.startswith(str2.substring(0, k))`) which creates new strings. Always compare character by character to avoid unnecessary memory allocation.

4. **Forgetting the new adjacent pair**: When removing element at index `i`, the new pair between `i-1` and `i+1` (if both exist) must be considered. Candidates sometimes only look at the existing pairs that remain unchanged.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix/Suffix Arrays**: Problems where you need to compute something for all subarrays excluding one element often use prefix and suffix computations. Similar problems:
   - LeetCode 238: Product of Array Except Self
   - LeetCode 42: Trapping Rain Water (using prefix/suffix max)

2. **Range Minimum Queries**: The prefix/suffix minimum arrays are a simple form of RMQ. More advanced versions use segment trees or sparse tables.

3. **Adjacent Pair Analysis**: Problems that focus on relationships between adjacent elements:
   - LeetCode 152: Maximum Product Subarray (dealing with adjacent products)
   - LeetCode 53: Maximum Subarray (Kadane's algorithm considers adjacent elements)

## Key Takeaways

1. **When removing one element affects only local relationships**, precompute global information and adjust locally. Don't recompute everything from scratch.

2. **Prefix and suffix arrays** are powerful tools for problems where you need to answer queries about subarrays excluding certain elements.

3. **Always analyze what changes and what stays the same** when modifying a data structure. In this case, only two adjacent pairs are affected by each removal—all others remain identical.

[Practice this problem on CodeJeet](/problem/longest-common-prefix-between-adjacent-strings-after-removals)
