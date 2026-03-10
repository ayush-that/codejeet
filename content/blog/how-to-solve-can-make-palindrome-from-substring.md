---
title: "How to Solve Can Make Palindrome from Substring — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Can Make Palindrome from Substring. Medium difficulty, 41.3% acceptance rate. Topics: Array, Hash Table, String, Bit Manipulation, Prefix Sum."
date: "2029-01-28"
category: "dsa-patterns"
tags: ["can-make-palindrome-from-substring", "array", "hash-table", "string", "medium"]
---

# How to Solve Can Make Palindrome from Substring

This problem asks: given a string `s` and queries `[left, right, k]`, can we rearrange the substring `s[left...right]` and replace up to `k` characters to make it a palindrome? The challenge is answering many queries efficiently—a brute force check per query would be too slow. The key insight is that palindrome feasibility depends on character frequencies, which we can precompute using prefix sums.

## Visual Walkthrough

Let's trace through an example to build intuition.  
Given:  
`s = "abcda"`  
`queries = [[0, 4, 1], [1, 2, 0]]`

**Query 1: [0, 4, 1]**  
Substring: `"abcda"` (indices 0-4)  
We can rearrange: possible arrangements include `"adcba"`.  
Character counts: a:2, b:1, c:1, d:1  
For a palindrome, we need at most one character with odd count.  
Here we have three characters with odd counts (b, c, d).  
We need to fix `(odd_count - 1) / 2` pairs? Actually, the minimum replacements needed = `odd_count // 2`.  
Wait—let's think carefully:  
If we have counts: a:2 (even), b:1 (odd), c:1 (odd), d:1 (odd).  
In a palindrome, characters with odd counts can only be at most one (the middle character).  
Each extra odd-count character needs one replacement to pair it with another.  
But since we can rearrange freely, we can pair odd characters together?  
Actually, the standard formula: minimum replacements = `odd_count // 2`.  
Why? For each pair of odd-count characters, we can change one to match the other (or both to a new letter).  
Example: b and c are odd. Change c to b → b:2, c:0. Now only d is odd.  
So with 3 odd counts, we need `3 // 2 = 1` replacement.  
We have k=1, so this query should return `true`.

**Query 2: [1, 2, 0]**  
Substring: `"bc"` (indices 1-2)  
Counts: b:1, c:1 → odd_count = 2  
Minimum replacements needed = `2 // 2 = 1`  
But k=0, so we cannot replace any. Returns `false`.

This shows the core calculation:

1. Get character counts in substring
2. Count how many characters have odd frequency
3. Check if `odd_count // 2 <= k`

The challenge is computing substring character counts efficiently for many queries.

## Brute Force Approach

A naive solution would, for each query:

1. Extract the substring `s[left:right+1]`
2. Count character frequencies (e.g., using a dictionary or array of size 26)
3. Count how many characters have odd frequency
4. Check if `odd_count // 2 <= k`

<div class="code-group">

```python
# Time: O(q * n) where q = len(queries), n = substring length
# Space: O(1) extra space per query
def canMakePaliQueries_brute(s, queries):
    result = []
    for left, right, k in queries:
        # Count frequencies in substring
        freq = [0] * 26
        for i in range(left, right + 1):
            freq[ord(s[i]) - ord('a')] += 1

        # Count odd frequencies
        odd_count = 0
        for count in freq:
            if count % 2 == 1:
                odd_count += 1

        # Check if we can make palindrome
        result.append(odd_count // 2 <= k)
    return result
```

```javascript
// Time: O(q * n) | Space: O(1) per query
function canMakePaliQueriesBrute(s, queries) {
  const result = [];
  for (const [left, right, k] of queries) {
    // Count frequencies in substring
    const freq = new Array(26).fill(0);
    for (let i = left; i <= right; i++) {
      freq[s.charCodeAt(i) - 97] += 1;
    }

    // Count odd frequencies
    let oddCount = 0;
    for (const count of freq) {
      if (count % 2 === 1) oddCount++;
    }

    // Check if we can make palindrome
    result.push(Math.floor(oddCount / 2) <= k);
  }
  return result;
}
```

```java
// Time: O(q * n) | Space: O(1) per query
public List<Boolean> canMakePaliQueriesBrute(String s, int[][] queries) {
    List<Boolean> result = new ArrayList<>();
    for (int[] query : queries) {
        int left = query[0], right = query[1], k = query[2];

        // Count frequencies in substring
        int[] freq = new int[26];
        for (int i = left; i <= right; i++) {
            freq[s.charAt(i) - 'a']++;
        }

        // Count odd frequencies
        int oddCount = 0;
        for (int count : freq) {
            if (count % 2 == 1) oddCount++;
        }

        // Check if we can make palindrome
        result.add(oddCount / 2 <= k);
    }
    return result;
}
```

</div>

**Why this is too slow:**  
If we have `q` queries and each substring has average length `n`, time complexity is `O(q * n)`.  
For constraints like `s.length = 10^5` and `q = 10^5`, this becomes `10^10` operations — far too slow.

## Optimized Approach

The bottleneck is counting character frequencies for each query. We need to answer "what are the character counts between indices `left` and `right`?" quickly.

**Key insight:** Use prefix sums for each character.  
For each position `i` in the string, store the cumulative count of each character up to index `i`.  
Then for any substring `[left, right]`, we can get character counts by subtracting prefix sums:  
`count_in_substring = prefix[right] - prefix[left-1]`

But we only care about whether counts are odd or even — not the exact counts.  
We can use bitmasking:

- Represent each character (a-z) as a bit in a 26-bit integer
- Toggle the bit when we see that character (XOR operation)
- Prefix XOR array: `prefix[i]` = bitmask for characters with odd count in `s[0..i]`
- For substring `[left, right]`:
  - If `left == 0`: mask = `prefix[right]`
  - Else: mask = `prefix[right] ^ prefix[left-1]` (XOR cancels characters outside the range)
- Count set bits in mask = number of characters with odd frequency
- Check if `set_bits // 2 <= k`

**Why XOR works:**  
XOR toggles bits: 0→1 (odd), 1→0 (even).  
When we XOR prefix[right] with prefix[left-1], characters that appear even times in the prefix difference cancel out, leaving only characters with odd counts in the substring.

## Optimal Solution

Here's the implementation using prefix XOR bitmasks:

<div class="code-group">

```python
# Time: O(n + q) where n = len(s), q = len(queries)
# Space: O(n) for prefix array
def canMakePaliQueries(s, queries):
    n = len(s)
    # prefix[i] = bitmask for characters with odd count in s[0..i]
    prefix = [0] * (n + 1)  # Use n+1 to handle left=0 case easily

    # Build prefix XOR array
    for i in range(n):
        # Toggle the bit for current character
        # 1 << (ord(s[i]) - ord('a')) creates bitmask for the character
        # XOR with previous prefix toggles this character's parity
        prefix[i + 1] = prefix[i] ^ (1 << (ord(s[i]) - ord('a')))

    result = []
    for left, right, k in queries:
        # Get bitmask for substring s[left..right]
        # XOR removes characters outside the range
        substring_mask = prefix[right + 1] ^ prefix[left]

        # Count how many bits are set (odd frequency characters)
        # Python built-in: bin(mask).count('1')
        odd_count = bin(substring_mask).count('1')

        # We need at most odd_count // 2 replacements
        # Each replacement can fix one pair of odd-count characters
        result.append(odd_count // 2 <= k)

    return result
```

```javascript
// Time: O(n + q) | Space: O(n)
function canMakePaliQueries(s, queries) {
  const n = s.length;
  // prefix[i] = bitmask for characters with odd count in s[0..i-1]
  // prefix[0] = 0 (empty string)
  const prefix = new Array(n + 1).fill(0);

  // Build prefix XOR array
  for (let i = 0; i < n; i++) {
    // Toggle the bit for current character
    const charBit = 1 << (s.charCodeAt(i) - 97);
    prefix[i + 1] = prefix[i] ^ charBit;
  }

  const result = [];
  for (const [left, right, k] of queries) {
    // Get bitmask for substring s[left..right]
    const substringMask = prefix[right + 1] ^ prefix[left];

    // Count set bits (odd frequency characters)
    // Brian Kernighan's algorithm: n & (n-1) clears lowest set bit
    let oddCount = 0;
    let mask = substringMask;
    while (mask > 0) {
      mask &= mask - 1;
      oddCount++;
    }

    // Check if we can make palindrome with k replacements
    result.push(Math.floor(oddCount / 2) <= k);
  }
  return result;
}
```

```java
// Time: O(n + q) | Space: O(n)
public List<Boolean> canMakePaliQueries(String s, int[][] queries) {
    int n = s.length();
    // prefix[i] = bitmask for characters with odd count in s[0..i-1]
    int[] prefix = new int[n + 1];

    // Build prefix XOR array
    for (int i = 0; i < n; i++) {
        // Toggle the bit for current character
        int charBit = 1 << (s.charAt(i) - 'a');
        prefix[i + 1] = prefix[i] ^ charBit;
    }

    List<Boolean> result = new ArrayList<>();
    for (int[] query : queries) {
        int left = query[0], right = query[1], k = query[2];

        // Get bitmask for substring s[left..right]
        int substringMask = prefix[right + 1] ^ prefix[left];

        // Count set bits (odd frequency characters)
        // Brian Kernighan's algorithm
        int oddCount = 0;
        int mask = substringMask;
        while (mask > 0) {
            mask &= mask - 1;  // Clear lowest set bit
            oddCount++;
        }

        // Check if we can make palindrome with k replacements
        result.add(oddCount / 2 <= k);
    }
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n + q)`

- `O(n)` to build the prefix XOR array (one pass through the string)
- `O(q)` to process all queries (constant time per query for XOR and bit counting)
- Bit counting with Brian Kernighan's algorithm is `O(number of set bits)` ≤ 26, so constant time

**Space Complexity:** `O(n)`

- We store the prefix array of size `n+1`
- The output array of size `q` is not counted in auxiliary space

## Common Mistakes

1. **Off-by-one errors with prefix array indices:**  
   Using `prefix[right] ^ prefix[left-1]` requires careful handling when `left=0`.  
   Solution: Use `n+1` sized array with `prefix[0]=0`, then `prefix[right+1] ^ prefix[left]`.

2. **Misunderstanding the replacement formula:**  
   Thinking we need `odd_count - 1` replacements (for the middle character).  
   Actually, we can pair odd characters: `odd_count // 2` replacements suffice.  
   Example: 3 odd counts → change one character to match another → 1 replacement.

3. **Not using bitmasking or using inefficient bit counting:**  
   Some candidates count bits by checking all 26 bits with a loop — that's fine (still O(1)), but Brian Kernighan's is more elegant.  
   The real mistake is not using prefix sums at all, leading to O(q\*n) time.

4. **Forgetting we can rearrange the substring:**  
   The problem allows rearrangement before replacement.  
   Without rearrangement, we'd need to check actual palindrome structure, not just character counts.

## When You'll See This Pattern

This problem combines **prefix sums** with **bitmasking** for efficient range queries on character parity. Look for these patterns when:

1. **You need to answer many range queries on string/array properties**
   - [Plates Between Candles](/problem/plates-between-candles): Prefix sums to count plates between candles
   - [Range Sum Query - Immutable](/problem/range-sum-query-immutable): Classic prefix sum problem

2. **The property depends on parity or mod 2 counts**
   - Bitmasking is natural for tracking odd/even states
   - XOR operations efficiently toggle states

3. **You need character frequency information in substrings**
   - Multiple character types with limited alphabet (26 letters → 26-bit integer)
   - [Find Longest Awesome Substring](/problem/find-longest-awesome-substring): Similar bitmask approach for palindrome checking

## Key Takeaways

1. **Prefix sums transform range queries into point queries**  
   Instead of O(n) per query, precompute cumulative values for O(1) range calculations.

2. **Bitmasking compresses multiple boolean states**  
   When tracking parity (odd/even) of 26 characters, a 32-bit integer is more efficient than an array.

3. **XOR is the natural operation for parity toggling**  
   XOR with a bitmask flips bits: even→odd, odd→even. Perfect for tracking character count parity.

**Related problems:** [Plates Between Candles](/problem/plates-between-candles), [Maximize the Number of Partitions After Operations](/problem/maximize-the-number-of-partitions-after-operations)
