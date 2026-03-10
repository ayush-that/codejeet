---
title: "How to Solve Shortest Uncommon Substring in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shortest Uncommon Substring in an Array. Medium difficulty, 50.0% acceptance rate. Topics: Array, Hash Table, String, Trie."
date: "2029-02-06"
category: "dsa-patterns"
tags: ["shortest-uncommon-substring-in-an-array", "array", "hash-table", "string", "medium"]
---

# How to Solve Shortest Uncommon Substring in an Array

This problem asks us to find, for each string in an array, the shortest substring that appears only in that string and not in any other. What makes this tricky is that we need to efficiently check substrings across multiple strings while finding the minimal unique substring for each one. The challenge lies in balancing substring generation with quick existence checking across all strings.

## Visual Walkthrough

Let's trace through a small example: `arr = ["cab", "ad", "bad"]`

For `"cab"`:

- Length 1 substrings: `"c"`, `"a"`, `"b"`
  - `"c"` doesn't appear in `"ad"` or `"bad"` ✓ (shortest found!)
  - So answer[0] = `"c"`

For `"ad"`:

- Length 1: `"a"`, `"d"`
  - `"a"` appears in `"cab"` and `"bad"` ✗
  - `"d"` doesn't appear in `"cab"` or `"bad"` ✓
  - So answer[1] = `"d"`

For `"bad"`:

- Length 1: `"b"`, `"a"`, `"d"`
  - `"b"` appears in `"cab"` ✗
  - `"a"` appears in `"cab"` and `"ad"` ✗
  - `"d"` appears in `"ad"` ✗
- Length 2: `"ba"`, `"ad"`
  - `"ba"` doesn't appear in `"cab"` or `"ad"` ✓
  - So answer[2] = `"ba"`

Final answer: `["c", "d", "ba"]`

The key insight: we need to check all possible substrings of each string, starting from the shortest, and stop at the first one that doesn't appear in any other string.

## Brute Force Approach

A naive approach would be:

1. For each string `arr[i]`, generate all substrings starting from length 1 up to the string's length
2. For each substring, check if it exists in every other string `arr[j]` where `j ≠ i`
3. Return the first substring that doesn't appear elsewhere

The problem with this approach is efficiency. If `n` is the number of strings and `m` is the average string length:

- Generating all substrings for one string takes O(m²) time
- Checking if a substring exists in another string takes O(m) time with naive string search
- Doing this for all strings gives O(n² × m³) time complexity

This becomes impractical for even moderately sized inputs. We need a way to quickly check substring existence without repeatedly scanning strings.

## Optimized Approach

The key insight is that we can precompute **all substrings of all strings** into a frequency map, then for each string, check its substrings against this map. However, we need to be careful: a substring might appear multiple times within the same string, but we only care if it appears in _other_ strings.

Here's the step-by-step reasoning:

1. **Build a frequency map**: For each string, generate all its substrings and count how many strings contain each substring. We need to track which strings contain which substrings, not just total counts.

2. **Efficient substring generation**: For each string, generate substrings in increasing length order. This ensures we find the shortest unique substring first.

3. **Quick existence checking**: Instead of scanning other strings for each substring, we can check our frequency map in O(1) time.

4. **Avoid double counting within same string**: If a substring appears multiple times in the same string, it should only count once for that string.

The optimal data structure is a hash map (dictionary) that maps substrings to sets of string indices. This lets us quickly check if a substring appears in any string other than the current one.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * m^3) where n = len(arr), m = max string length
# Space: O(n * m^2) for storing all substrings
def shortestSubstrings(arr):
    n = len(arr)
    answer = [""] * n

    # Step 1: Build a map of substring -> set of indices where it appears
    # This allows O(1) lookup to check if a substring appears in other strings
    substring_map = {}

    # For each string in the array
    for i in range(n):
        s = arr[i]
        length = len(s)

        # Generate all substrings of this string
        # We use a set to avoid counting duplicate substrings within the same string
        seen_substrings = set()

        # Generate substrings of increasing length
        for l in range(1, length + 1):  # l = substring length
            for start in range(length - l + 1):  # start index
                sub = s[start:start + l]

                # Only process if we haven't seen this substring in current string
                if sub not in seen_substrings:
                    seen_substrings.add(sub)

                    # Add this substring to our global map
                    if sub not in substring_map:
                        substring_map[sub] = set()
                    substring_map[sub].add(i)

    # Step 2: For each string, find its shortest unique substring
    for i in range(n):
        s = arr[i]
        length = len(s)
        found = False

        # Check substrings in increasing length order
        # This ensures we find the shortest one first
        for l in range(1, length + 1):
            if found:
                break

            # Generate all substrings of length l
            for start in range(length - l + 1):
                sub = s[start:start + l]

                # Check if this substring appears only in the current string
                # substring_map[sub] contains indices of all strings containing 'sub'
                if len(substring_map[sub]) == 1 and i in substring_map[sub]:
                    answer[i] = sub
                    found = True
                    break

        # If no unique substring found, answer[i] remains ""

    return answer
```

```javascript
// Time: O(n * m^3) where n = arr.length, m = max string length
// Space: O(n * m^2) for storing all substrings
function shortestSubstrings(arr) {
  const n = arr.length;
  const answer = new Array(n).fill("");

  // Step 1: Build a map of substring -> set of indices where it appears
  const substringMap = new Map();

  // For each string in the array
  for (let i = 0; i < n; i++) {
    const s = arr[i];
    const length = s.length;

    // Generate all substrings of this string
    // Use a Set to avoid counting duplicate substrings within same string
    const seenSubstrings = new Set();

    // Generate substrings of increasing length
    for (let l = 1; l <= length; l++) {
      // l = substring length
      for (let start = 0; start <= length - l; start++) {
        const sub = s.substring(start, start + l);

        // Only process if we haven't seen this substring in current string
        if (!seenSubstrings.has(sub)) {
          seenSubstrings.add(sub);

          // Add this substring to our global map
          if (!substringMap.has(sub)) {
            substringMap.set(sub, new Set());
          }
          substringMap.get(sub).add(i);
        }
      }
    }
  }

  // Step 2: For each string, find its shortest unique substring
  for (let i = 0; i < n; i++) {
    const s = arr[i];
    const length = s.length;
    let found = false;

    // Check substrings in increasing length order
    // This ensures we find the shortest one first
    for (let l = 1; l <= length && !found; l++) {
      // Generate all substrings of length l
      for (let start = 0; start <= length - l && !found; start++) {
        const sub = s.substring(start, start + l);

        // Check if this substring appears only in the current string
        // substringMap.get(sub) contains indices of all strings containing 'sub'
        const indices = substringMap.get(sub);
        if (indices && indices.size === 1 && indices.has(i)) {
          answer[i] = sub;
          found = true;
        }
      }
    }

    // If no unique substring found, answer[i] remains ""
  }

  return answer;
}
```

```java
// Time: O(n * m^3) where n = arr.length, m = max string length
// Space: O(n * m^2) for storing all substrings
import java.util.*;

public class Solution {
    public String[] shortestSubstrings(String[] arr) {
        int n = arr.length;
        String[] answer = new String[n];
        Arrays.fill(answer, "");

        // Step 1: Build a map of substring -> set of indices where it appears
        Map<String, Set<Integer>> substringMap = new HashMap<>();

        // For each string in the array
        for (int i = 0; i < n; i++) {
            String s = arr[i];
            int length = s.length();

            // Generate all substrings of this string
            // Use a Set to avoid counting duplicate substrings within same string
            Set<String> seenSubstrings = new HashSet<>();

            // Generate substrings of increasing length
            for (int l = 1; l <= length; l++) {  // l = substring length
                for (int start = 0; start <= length - l; start++) {
                    String sub = s.substring(start, start + l);

                    // Only process if we haven't seen this substring in current string
                    if (!seenSubstrings.contains(sub)) {
                        seenSubstrings.add(sub);

                        // Add this substring to our global map
                        substringMap.putIfAbsent(sub, new HashSet<>());
                        substringMap.get(sub).add(i);
                    }
                }
            }
        }

        // Step 2: For each string, find its shortest unique substring
        for (int i = 0; i < n; i++) {
            String s = arr[i];
            int length = s.length();
            boolean found = false;

            // Check substrings in increasing length order
            // This ensures we find the shortest one first
            for (int l = 1; l <= length && !found; l++) {
                // Generate all substrings of length l
                for (int start = 0; start <= length - l && !found; start++) {
                    String sub = s.substring(start, start + l);

                    // Check if this substring appears only in the current string
                    // substringMap.get(sub) contains indices of all strings containing 'sub'
                    Set<Integer> indices = substringMap.get(sub);
                    if (indices != null && indices.size() == 1 && indices.contains(i)) {
                        answer[i] = sub;
                        found = true;
                    }
                }
            }

            // If no unique substring found, answer[i] remains ""
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × m³) where n is the number of strings and m is the maximum string length.

- Generating all substrings for one string takes O(m²) substrings
- For each substring, we do O(1) operations (hash map insert/lookup)
- We do this for all n strings: O(n × m²)
- Finding the shortest unique substring for each string also takes O(m²) checks
- Total: O(n × m² + n × m²) = O(n × m²)

**Wait, why m³?** Actually, substring generation in some languages (like Python slicing) takes O(m) time per substring, making it O(m³) for one string. In practice, with small m, this is acceptable.

**Space Complexity**: O(n × m²)

- We store all unique substrings from all strings
- Each string of length m has O(m²) substrings
- With n strings, worst case is O(n × m²) stored substrings

## Common Mistakes

1. **Not checking substrings in increasing length order**: Candidates might generate all substrings first and then find the shortest, which works but is less efficient. The optimal approach checks lengths 1, 2, 3,... and stops immediately when finding a unique substring.

2. **Counting duplicate substrings within the same string**: If a substring appears multiple times in the same string, it should only count once for that string. Forgetting to deduplicate within strings can lead to incorrect frequency counts.

3. **Using substring existence instead of string index tracking**: Simply counting how many strings contain a substring isn't enough. We need to know which specific strings contain it to check if it's unique to the current string.

4. **Not handling the empty string case correctly**: The problem states that if no unique substring exists, we should return an empty string. Some candidates might return the entire string or null instead.

## When You'll See This Pattern

This problem combines substring generation with frequency counting, a pattern seen in:

1. **Longest Common Substring** (though usually solved with dynamic programming): Both involve checking substrings across multiple strings.

2. **Repeated DNA Sequences** (LeetCode 187): Uses substring frequency counting with a sliding window and hash map.

3. **Find All Anagrams in a String** (LeetCode 438): While about anagrams not substrings, it uses similar frequency counting techniques with sliding windows.

The core pattern is: when you need to check substrings/patterns across multiple strings, precomputing a frequency map can turn O(n²) comparisons into O(1) lookups.

## Key Takeaways

1. **Precomputation is powerful**: When you need to make many existence checks, building a lookup structure (like a hash map of substrings) upfront can save significant time.

2. **Generate and test in optimal order**: For "shortest" problems, always generate candidates in increasing size order and stop at the first valid one.

3. **Mind the deduplication**: When counting occurrences across entities, decide carefully whether to count duplicates within the same entity or not. In this case, multiple occurrences in the same string count as one.

[Practice this problem on CodeJeet](/problem/shortest-uncommon-substring-in-an-array)
