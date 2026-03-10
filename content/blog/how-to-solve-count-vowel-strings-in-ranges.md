---
title: "How to Solve Count Vowel Strings in Ranges — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Vowel Strings in Ranges. Medium difficulty, 67.8% acceptance rate. Topics: Array, String, Prefix Sum."
date: "2028-10-03"
category: "dsa-patterns"
tags: ["count-vowel-strings-in-ranges", "array", "string", "prefix-sum", "medium"]
---

# How to Solve Count Vowel Strings in Ranges

You're given an array of strings and multiple range queries. For each query, you need to count how many strings in that range start AND end with a vowel. The challenge is that you have to answer many queries efficiently—a brute force approach checking each string for each query would be too slow for large inputs. The key insight is that range sum queries can be optimized using prefix sums.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
words = ["apple", "banana", "orange", "grape", "egg"]
queries = [[0,2], [1,4], [0,4]]
```

**Step 1: Identify vowel strings**
First, let's check which strings start and end with vowels:

- "apple": starts with 'a' (vowel), ends with 'e' (vowel) → YES
- "banana": starts with 'b' (not vowel) → NO
- "orange": starts with 'o' (vowel), ends with 'e' (vowel) → YES
- "grape": starts with 'g' (not vowel) → NO
- "egg": starts with 'e' (vowel), ends with 'g' (not vowel) → NO

So we have: [1, 0, 1, 0, 0] where 1 means "vowel string" and 0 means not.

**Step 2: Build prefix sums**
Instead of counting from scratch for each query, we can precompute prefix sums:

- prefix[0] = 1 (just the first element)
- prefix[1] = 1 + 0 = 1
- prefix[2] = 1 + 0 + 1 = 2
- prefix[3] = 1 + 0 + 1 + 0 = 2
- prefix[4] = 1 + 0 + 1 + 0 + 0 = 2

**Step 3: Answer queries using prefix sums**
For query [l, r], the answer is prefix[r] - prefix[l-1] (with special handling when l=0):

- Query [0,2]: prefix[2] - (nothing before 0) = 2 - 0 = 2
- Query [1,4]: prefix[4] - prefix[0] = 2 - 1 = 1
- Query [0,4]: prefix[4] - 0 = 2 - 0 = 2

**Verification:**

- Range [0,2]: "apple", "banana", "orange" → 2 vowel strings ✓
- Range [1,4]: "banana", "orange", "grape", "egg" → 1 vowel string ✓
- Range [0,4]: all strings → 2 vowel strings ✓

## Brute Force Approach

The most straightforward approach is to process each query independently: for each query [l, r], iterate through words[l] to words[r], check if each string starts and ends with a vowel, and count them.

<div class="code-group">

```python
# Time: O(q * n * m) where q = queries, n = average range length, m = average word length
# Space: O(1) excluding output
def vowelStrings_brute(words, queries):
    vowels = set('aeiou')
    result = []

    for l, r in queries:
        count = 0
        # Check each word in the range
        for i in range(l, r + 1):
            word = words[i]
            # Check if word starts and ends with vowel
            if word and word[0] in vowels and word[-1] in vowels:
                count += 1
        result.append(count)

    return result
```

```javascript
// Time: O(q * n * m) where q = queries, n = average range length, m = average word length
// Space: O(1) excluding output
function vowelStringsBrute(words, queries) {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  const result = [];

  for (const [l, r] of queries) {
    let count = 0;
    // Check each word in the range
    for (let i = l; i <= r; i++) {
      const word = words[i];
      // Check if word starts and ends with vowel
      if (word && vowels.has(word[0]) && vowels.has(word[word.length - 1])) {
        count++;
      }
    }
    result.push(count);
  }

  return result;
}
```

```java
// Time: O(q * n * m) where q = queries, n = average range length, m = average word length
// Space: O(1) excluding output
public int[] vowelStringsBrute(String[] words, int[][] queries) {
    Set<Character> vowels = new HashSet<>(Arrays.asList('a', 'e', 'i', 'o', 'u'));
    int[] result = new int[queries.length];

    for (int q = 0; q < queries.length; q++) {
        int l = queries[q][0];
        int r = queries[q][1];
        int count = 0;

        // Check each word in the range
        for (int i = l; i <= r; i++) {
            String word = words[i];
            // Check if word starts and ends with vowel
            if (!word.isEmpty() &&
                vowels.contains(word.charAt(0)) &&
                vowels.contains(word.charAt(word.length() - 1))) {
                count++;
            }
        }
        result[q] = count;
    }

    return result;
}
```

</div>

**Why this is inefficient:**
If we have `n` words and `q` queries, and each query covers most of the array, we're doing O(n) work per query, leading to O(n × q) total time. With n and q up to 10⁵, this becomes 10¹⁰ operations—far too slow. We need a way to answer each query in O(1) time after some preprocessing.

## Optimized Approach

The key insight is that we're answering **range sum queries**—we want the sum of a binary array (1 for vowel strings, 0 otherwise) over various ranges. This is a classic problem solvable with **prefix sums**.

**Prefix Sums Technique:**

1. Create a binary array `isVowel` where `isVowel[i] = 1` if `words[i]` starts and ends with a vowel, else `0`
2. Build a prefix sum array `prefix` where `prefix[i]` = sum of first `i+1` elements (or `prefix[0] = 0` and `prefix[i]` = sum of first `i` elements—both work with different indexing)
3. For query `[l, r]`, the answer is `prefix[r+1] - prefix[l]` (with 1-indexed prefix array) or `prefix[r] - prefix[l-1]` (with 0-indexed, handling `l=0` specially)

**Why this works:**

- `prefix[r]` contains sum of elements from index 0 to r
- `prefix[l-1]` contains sum of elements from index 0 to l-1
- Subtracting gives us exactly the sum from index l to r

This reduces each query to O(1) time after O(n) preprocessing.

## Optimal Solution

Here's the complete implementation using prefix sums:

<div class="code-group">

```python
# Time: O(n + q) where n = len(words), q = len(queries)
# Space: O(n) for prefix array
def vowelStrings(words, queries):
    # Set of vowels for quick lookup
    vowels = set('aeiou')
    n = len(words)

    # Step 1: Create prefix sum array with n+1 elements
    # prefix[i] will store count of vowel strings in words[0:i) (first i elements)
    prefix = [0] * (n + 1)

    # Build prefix array
    for i in range(n):
        word = words[i]
        # Check if current word starts and ends with vowel
        is_vowel_string = (word and word[0] in vowels and word[-1] in vowels)
        # prefix[i+1] = prefix[i] + (1 if vowel string else 0)
        prefix[i + 1] = prefix[i] + (1 if is_vowel_string else 0)

    # Step 2: Answer each query in O(1) time
    result = []
    for l, r in queries:
        # Count in range [l, r] = prefix[r+1] - prefix[l]
        # prefix[r+1] = count in words[0:r+1] (first r+1 elements)
        # prefix[l] = count in words[0:l] (first l elements)
        # Difference gives count in words[l:r+1] = words[l] to words[r]
        count = prefix[r + 1] - prefix[l]
        result.append(count)

    return result
```

```javascript
// Time: O(n + q) where n = words.length, q = queries.length
// Space: O(n) for prefix array
function vowelStrings(words, queries) {
  // Set of vowels for quick lookup
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  const n = words.length;

  // Step 1: Create prefix sum array with n+1 elements
  // prefix[i] will store count of vowel strings in words[0:i) (first i elements)
  const prefix = new Array(n + 1).fill(0);

  // Build prefix array
  for (let i = 0; i < n; i++) {
    const word = words[i];
    // Check if current word starts and ends with vowel
    const isVowelString = word && vowels.has(word[0]) && vowels.has(word[word.length - 1]);
    // prefix[i+1] = prefix[i] + (1 if vowel string else 0)
    prefix[i + 1] = prefix[i] + (isVowelString ? 1 : 0);
  }

  // Step 2: Answer each query in O(1) time
  const result = [];
  for (const [l, r] of queries) {
    // Count in range [l, r] = prefix[r+1] - prefix[l]
    // prefix[r+1] = count in words[0:r+1] (first r+1 elements)
    // prefix[l] = count in words[0:l] (first l elements)
    // Difference gives count in words[l:r+1] = words[l] to words[r]
    const count = prefix[r + 1] - prefix[l];
    result.push(count);
  }

  return result;
}
```

```java
// Time: O(n + q) where n = words.length, q = queries.length
// Space: O(n) for prefix array
public int[] vowelStrings(String[] words, int[][] queries) {
    // Set of vowels for quick lookup
    Set<Character> vowels = new HashSet<>(Arrays.asList('a', 'e', 'i', 'o', 'u'));
    int n = words.length;

    // Step 1: Create prefix sum array with n+1 elements
    // prefix[i] will store count of vowel strings in words[0:i) (first i elements)
    int[] prefix = new int[n + 1];

    // Build prefix array
    for (int i = 0; i < n; i++) {
        String word = words[i];
        // Check if current word starts and ends with vowel
        boolean isVowelString = !word.isEmpty() &&
                                vowels.contains(word.charAt(0)) &&
                                vowels.contains(word.charAt(word.length() - 1));
        // prefix[i+1] = prefix[i] + (1 if vowel string else 0)
        prefix[i + 1] = prefix[i] + (isVowelString ? 1 : 0);
    }

    // Step 2: Answer each query in O(1) time
    int[] result = new int[queries.length];
    for (int i = 0; i < queries.length; i++) {
        int l = queries[i][0];
        int r = queries[i][1];
        // Count in range [l, r] = prefix[r+1] - prefix[l]
        // prefix[r+1] = count in words[0:r+1] (first r+1 elements)
        // prefix[l] = count in words[0:l] (first l elements)
        // Difference gives count in words[l:r+1] = words[l] to words[r]
        result[i] = prefix[r + 1] - prefix[l];
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + q)**

- **O(n)** to build the prefix sum array: we iterate through all `n` words once
- **O(q)** to answer all queries: each query takes O(1) time with the prefix sum array
- Total: O(n + q), which is optimal since we need to at least read all inputs

**Space Complexity: O(n)**

- **O(n)** for the prefix sum array of size n+1
- **O(q)** for the output array (usually not counted in space complexity analysis, but worth noting)
- If we don't count the output, it's O(n) for the prefix array

## Common Mistakes

1. **Off-by-one errors with prefix array indexing**: The most common mistake is using the wrong indices when building or querying the prefix array. Remember: if `prefix[i]` represents sum of first `i` elements (0-indexed), then range `[l, r]` sum = `prefix[r] - prefix[l-1]` (with special case for `l=0`). The cleaner approach shown above uses `prefix[i]` = sum of first `i` elements (1-indexed), so range `[l, r]` = `prefix[r+1] - prefix[l]`.

2. **Forgetting to handle empty strings**: Always check if a string is non-empty before accessing `word[0]` or `word[-1]`. An empty string has no first or last character, so accessing these would cause an index error.

3. **Case sensitivity issues**: The problem states strings consist of lowercase English letters, but if they didn't, you'd need to convert to lowercase first: `word[0].lower() in vowels`.

4. **Not using a set for vowel lookup**: Checking `char in 'aeiou'` works but is O(5) = O(1). However, using a set makes the intent clearer and is slightly more efficient for membership testing.

## When You'll See This Pattern

The prefix sum pattern appears whenever you need to answer **multiple range sum queries** on a static array. Instead of recalculating sums for each query, precompute prefix sums once.

**Related LeetCode problems:**

1. **Range Sum Query - Immutable (LeetCode 303)**: The classic prefix sum problem—identical pattern but with numbers instead of strings.
2. **Jump Game VII (LeetCode 1871)**: Uses prefix sums to track reachable positions efficiently.
3. **Product of Array Except Self (LeetCode 238)**: Uses prefix and suffix products, a variation of the prefix sum idea.
4. **Subarray Sum Equals K (LeetCode 560)**: Uses prefix sums with hash maps to find subarrays summing to k.

## Key Takeaways

1. **Prefix sums transform range sum queries from O(n) to O(1)**: When you need to answer many queries about sums over ranges in a static array, prefix sums are your go-to tool.

2. **The pattern: preprocess once, query many times**: If you're answering the same type of question about different ranges of the same data, look for a way to precompute something that makes each query fast.

3. **Watch your indices carefully**: Prefix sum implementations are prone to off-by-one errors. Choose either 0-indexed or 1-indexed consistently and document which you're using.

Related problems: [Jump Game VII](/problem/jump-game-vii)
