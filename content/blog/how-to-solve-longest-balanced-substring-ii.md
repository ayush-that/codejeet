---
title: "How to Solve Longest Balanced Substring II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Balanced Substring II. Medium difficulty, 42.0% acceptance rate. Topics: Hash Table, String, Prefix Sum."
date: "2028-01-02"
category: "dsa-patterns"
tags: ["longest-balanced-substring-ii", "hash-table", "string", "prefix-sum", "medium"]
---

# How to Solve Longest Balanced Substring II

This problem asks us to find the longest substring where all distinct characters appear exactly the same number of times. The tricky part is that we're dealing with three characters (a, b, c), and a substring is balanced if all characters that appear in it have equal frequencies. For example, "aabbcc" is balanced (2 each), but "aabbc" is not (a:2, b:2, c:1). The interesting challenge is efficiently checking all possible substrings without the O(n³) brute force approach.

## Visual Walkthrough

Let's trace through `s = "aabbcc"` step by step:

1. **Understanding balanced substrings:**
   - "aa" → only 'a' appears → balanced (length 2)
   - "aabb" → a:2, b:2 → balanced (length 4)
   - "aabbcc" → a:2, b:2, c:2 → balanced (length 6)
   - "abbc" → a:1, b:2, c:1 → NOT balanced (b appears twice)

2. **Key insight:** We need to track relative frequencies. Let's think about prefix sums:
   - For position i, let count_a = # of 'a's up to i, count_b = # of 'b's up to i, count_c = # of 'c's up to i
   - For substring [j+1, i] to be balanced, the differences between these counts from j to i must be equal

3. **Example with s = "abcabc":**
   ```
   Index:  0  1  2  3  4  5
   Char:   a  b  c  a  b  c
   Counts: (a,b,c)
   0: (0,0,0)
   1: (1,0,0)
   2: (1,1,0)
   3: (1,1,1)  → diff from start: (1,1,1) → balanced substring [0,2] length 3
   4: (2,1,1)
   5: (2,2,1)
   6: (2,2,2) → diff from start: (2,2,2) → balanced substring [0,5] length 6
   ```

The pattern emerges: when the relative differences between counts are the same at two positions, the substring between them is balanced.

## Brute Force Approach

The naive solution checks every possible substring:

1. Generate all O(n²) substrings
2. For each substring, count frequencies of a, b, c
3. Check if all present characters have equal counts
4. Track the maximum length

This takes O(n³) time (O(n²) substrings × O(n) to count each). Even with optimization, it's O(n²) which is too slow for n up to 10⁵.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def longestBalancedSubstring_brute(s: str) -> int:
    n = len(s)
    max_len = 0

    for i in range(n):
        for j in range(i, n):
            # Count frequencies in substring s[i:j+1]
            count = {'a': 0, 'b': 0, 'c': 0}
            for k in range(i, j + 1):
                count[s[k]] += 1

            # Get frequencies of characters that appear
            freqs = [v for v in count.values() if v > 0]

            # Check if all non-zero frequencies are equal
            if len(freqs) > 0 and all(f == freqs[0] for f in freqs):
                max_len = max(max_len, j - i + 1)

    return max_len
```

```javascript
// Time: O(n³) | Space: O(1)
function longestBalancedSubstringBrute(s) {
  const n = s.length;
  let maxLen = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Count frequencies in substring s[i:j+1]
      const count = { a: 0, b: 0, c: 0 };
      for (let k = i; k <= j; k++) {
        count[s[k]]++;
      }

      // Get frequencies of characters that appear
      const freqs = Object.values(count).filter((v) => v > 0);

      // Check if all non-zero frequencies are equal
      if (freqs.length > 0 && freqs.every((f) => f === freqs[0])) {
        maxLen = Math.max(maxLen, j - i + 1);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n³) | Space: O(1)
public int longestBalancedSubstringBrute(String s) {
    int n = s.length();
    int maxLen = 0;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Count frequencies in substring s[i:j+1]
            int countA = 0, countB = 0, countC = 0;
            for (int k = i; k <= j; k++) {
                char c = s.charAt(k);
                if (c == 'a') countA++;
                else if (c == 'b') countB++;
                else countC++;
            }

            // Get frequencies of characters that appear
            List<Integer> freqs = new ArrayList<>();
            if (countA > 0) freqs.add(countA);
            if (countB > 0) freqs.add(countB);
            if (countC > 0) freqs.add(countC);

            // Check if all non-zero frequencies are equal
            boolean balanced = true;
            for (int f : freqs) {
                if (f != freqs.get(0)) {
                    balanced = false;
                    break;
                }
            }

            if (!freqs.isEmpty() && balanced) {
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
    }

    return maxLen;
}
```

</div>

This brute force is too slow because with n=10⁵, O(n³) is impossible and even O(n²) is 10¹⁰ operations.

## Optimized Approach

The key insight comes from transforming the problem into a prefix sum problem:

1. **Representation:** Let diff_ab = count_a - count_b and diff_ac = count_a - count_c at each position.
2. **Observation:** For substring [j+1, i] to be balanced:
   - If all three characters appear: count_a = count_b = count_c
     → diff_ab(i) - diff_ab(j) = 0 and diff_ac(i) - diff_ac(j) = 0
     → diff_ab(i) = diff_ab(j) AND diff_ac(i) = diff_ac(j)
   - If only two characters appear (say a and b): count_a = count_b, count_c = 0
     → diff_ab(i) = diff_ab(j) AND count_c(i) = count_c(j)
   - If only one character appears: automatically balanced

3. **Solution approach:** We can track these differences as we scan the string. When we see the same pair (diff_ab, diff_ac) at two positions, the substring between them has equal counts for all characters that appear.

4. **Handling the "only two characters" case:** We need to track both the full state (diff_ab, diff_ac) and also handle cases where one character doesn't appear. We can do this by checking multiple conditions.

## Optimal Solution

The optimal solution uses a hash map to store the first occurrence of each (diff_ab, diff_ac) pair. When we encounter the same pair again, the substring between is balanced with all three characters having equal counts.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestBalancedSubstring(s: str) -> int:
    """
    Find the longest substring where all distinct characters appear the same number of times.

    Approach: Use prefix sums and track differences between character counts.
    Key insight: For substring [j+1, i] to have equal counts of all characters present,
    the differences between counts must be the same at positions i and j.
    """
    n = len(s)
    if n == 0:
        return 0

    # Initialize counts and differences
    count_a = count_b = count_c = 0
    max_len = 0

    # Map to store first occurrence of each (diff_ab, diff_ac) pair
    # key: (count_a - count_b, count_a - count_c)
    # value: earliest index where this pair occurred
    seen = {(0, 0): -1}  # Initialize with empty string at index -1

    for i in range(n):
        # Update counts based on current character
        if s[i] == 'a':
            count_a += 1
        elif s[i] == 'b':
            count_b += 1
        else:  # 'c'
            count_c += 1

        # Calculate differences
        diff_ab = count_a - count_b
        diff_ac = count_a - count_c

        # Check if we've seen this pair before
        key = (diff_ab, diff_ac)
        if key in seen:
            # Substring from seen[key]+1 to i has equal counts for all three chars
            max_len = max(max_len, i - seen[key])
        else:
            # Store first occurrence of this pair
            seen[key] = i

    # The above handles cases where all three characters appear.
    # We also need to handle cases where only two characters appear.
    # For each pair of characters, we can use a similar approach.

    # Handle 'a' and 'b' only
    count_a = count_b = 0
    last_seen = {-1: -1}  # Map diff -> index
    diff_key = 0

    for i in range(n):
        if s[i] == 'a':
            count_a += 1
        elif s[i] == 'b':
            count_b += 1
        else:
            # Reset when we see 'c' since we're checking 'a' and 'b' only
            count_a = count_b = 0
            last_seen = {0: i}  # Start fresh after 'c'
            diff_key = 0
            continue

        diff_key = count_a - count_b
        if diff_key in last_seen:
            max_len = max(max_len, i - last_seen[diff_key])
        else:
            last_seen[diff_key] = i

    # Handle 'a' and 'c' only
    count_a = count_c = 0
    last_seen = {-1: -1}
    diff_key = 0

    for i in range(n):
        if s[i] == 'a':
            count_a += 1
        elif s[i] == 'c':
            count_c += 1
        else:
            count_a = count_c = 0
            last_seen = {0: i}
            diff_key = 0
            continue

        diff_key = count_a - count_c
        if diff_key in last_seen:
            max_len = max(max_len, i - last_seen[diff_key])
        else:
            last_seen[diff_key] = i

    # Handle 'b' and 'c' only
    count_b = count_c = 0
    last_seen = {-1: -1}
    diff_key = 0

    for i in range(n):
        if s[i] == 'b':
            count_b += 1
        elif s[i] == 'c':
            count_c += 1
        else:
            count_b = count_c = 0
            last_seen = {0: i}
            diff_key = 0
            continue

        diff_key = count_b - count_c
        if diff_key in last_seen:
            max_len = max(max_len, i - last_seen[diff_key])
        else:
            last_seen[diff_key] = i

    return max_len
```

```javascript
// Time: O(n) | Space: O(n)
function longestBalancedSubstring(s) {
  const n = s.length;
  if (n === 0) return 0;

  let countA = 0,
    countB = 0,
    countC = 0;
  let maxLen = 0;

  // Map for (diffAB, diffAC) -> first index
  const seen = new Map();
  seen.set("0,0", -1); // Empty string

  for (let i = 0; i < n; i++) {
    // Update counts
    if (s[i] === "a") countA++;
    else if (s[i] === "b") countB++;
    else countC++;

    // Calculate differences
    const diffAB = countA - countB;
    const diffAC = countA - countC;
    const key = `${diffAB},${diffAC}`;

    // Check if we've seen this pair before
    if (seen.has(key)) {
      maxLen = Math.max(maxLen, i - seen.get(key));
    } else {
      seen.set(key, i);
    }
  }

  // Handle pairs of characters
  // 'a' and 'b' only
  countA = countB = 0;
  let lastSeen = new Map();
  lastSeen.set(0, -1);
  let diffKey = 0;

  for (let i = 0; i < n; i++) {
    if (s[i] === "a") {
      countA++;
    } else if (s[i] === "b") {
      countB++;
    } else {
      // Reset for 'c'
      countA = countB = 0;
      lastSeen = new Map();
      lastSeen.set(0, i);
      diffKey = 0;
      continue;
    }

    diffKey = countA - countB;
    if (lastSeen.has(diffKey)) {
      maxLen = Math.max(maxLen, i - lastSeen.get(diffKey));
    } else {
      lastSeen.set(diffKey, i);
    }
  }

  // 'a' and 'c' only
  countA = countC = 0;
  lastSeen = new Map();
  lastSeen.set(0, -1);
  diffKey = 0;

  for (let i = 0; i < n; i++) {
    if (s[i] === "a") {
      countA++;
    } else if (s[i] === "c") {
      countC++;
    } else {
      countA = countC = 0;
      lastSeen = new Map();
      lastSeen.set(0, i);
      diffKey = 0;
      continue;
    }

    diffKey = countA - countC;
    if (lastSeen.has(diffKey)) {
      maxLen = Math.max(maxLen, i - lastSeen.get(diffKey));
    } else {
      lastSeen.set(diffKey, i);
    }
  }

  // 'b' and 'c' only
  countB = countC = 0;
  lastSeen = new Map();
  lastSeen.set(0, -1);
  diffKey = 0;

  for (let i = 0; i < n; i++) {
    if (s[i] === "b") {
      countB++;
    } else if (s[i] === "c") {
      countC++;
    } else {
      countB = countC = 0;
      lastSeen = new Map();
      lastSeen.set(0, i);
      diffKey = 0;
      continue;
    }

    diffKey = countB - countC;
    if (lastSeen.has(diffKey)) {
      maxLen = Math.max(maxLen, i - lastSeen.get(diffKey));
    } else {
      lastSeen.set(diffKey, i);
    }
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(n)
public int longestBalancedSubstring(String s) {
    int n = s.length();
    if (n == 0) return 0;

    int countA = 0, countB = 0, countC = 0;
    int maxLen = 0;

    // Map for (diffAB, diffAC) -> first index
    Map<String, Integer> seen = new HashMap<>();
    seen.put("0,0", -1);  // Empty string

    for (int i = 0; i < n; i++) {
        // Update counts
        char c = s.charAt(i);
        if (c == 'a') countA++;
        else if (c == 'b') countB++;
        else countC++;

        // Calculate differences
        int diffAB = countA - countB;
        int diffAC = countA - countC;
        String key = diffAB + "," + diffAC;

        // Check if we've seen this pair before
        if (seen.containsKey(key)) {
            maxLen = Math.max(maxLen, i - seen.get(key));
        } else {
            seen.put(key, i);
        }
    }

    // Handle pairs of characters
    // 'a' and 'b' only
    countA = countB = 0;
    Map<Integer, Integer> lastSeen = new HashMap<>();
    lastSeen.put(0, -1);
    int diffKey = 0;

    for (int i = 0; i < n; i++) {
        char c = s.charAt(i);
        if (c == 'a') {
            countA++;
        } else if (c == 'b') {
            countB++;
        } else {
            // Reset for 'c'
            countA = countB = 0;
            lastSeen.clear();
            lastSeen.put(0, i);
            diffKey = 0;
            continue;
        }

        diffKey = countA - countB;
        if (lastSeen.containsKey(diffKey)) {
            maxLen = Math.max(maxLen, i - lastSeen.get(diffKey));
        } else {
            lastSeen.put(diffKey, i);
        }
    }

    // 'a' and 'c' only
    countA = countC = 0;
    lastSeen.clear();
    lastSeen.put(0, -1);
    diffKey = 0;

    for (int i = 0; i < n; i++) {
        char c = s.charAt(i);
        if (c == 'a') {
            countA++;
        } else if (c == 'c') {
            countC++;
        } else {
            countA = countC = 0;
            lastSeen.clear();
            lastSeen.put(0, i);
            diffKey = 0;
            continue;
        }

        diffKey = countA - countC;
        if (lastSeen.containsKey(diffKey)) {
            maxLen = Math.max(maxLen, i - lastSeen.get(diffKey));
        } else {
            lastSeen.put(diffKey, i);
        }
    }

    // 'b' and 'c' only
    countB = countC = 0;
    lastSeen.clear();
    lastSeen.put(0, -1);
    diffKey = 0;

    for (int i = 0; i < n; i++) {
        char c = s.charAt(i);
        if (c == 'b') {
            countB++;
        } else if (c == 'c') {
            countC++;
        } else {
            countB = countC = 0;
            lastSeen.clear();
            lastSeen.put(0, i);
            diffKey = 0;
            continue;
        }

        diffKey = countB - countC;
        if (lastSeen.containsKey(diffKey)) {
            maxLen = Math.max(maxLen, i - lastSeen.get(diffKey));
        } else {
            lastSeen.put(diffKey, i);
        }
    }

    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make 4 passes through the string: one for all three characters, and three for the pairs of characters.
- Each pass is O(n), and 4 × O(n) = O(n).

**Space Complexity:** O(n)

- In the worst case, we store O(n) entries in the hash map when all (diff_ab, diff_ac) pairs are unique.
- The space for tracking pairs of characters is also O(n) but separate from the main map.

## Common Mistakes

1. **Forgetting to handle the empty substring case:** Always initialize your map with (0,0) at index -1 to represent the empty string before the first character.

2. **Only checking when all three characters appear:** The problem says "all distinct characters in the substring" - if only 'a' and 'b' appear, they must have equal counts. Many solutions miss the two-character cases.

3. **Incorrect difference calculation:** Using absolute differences instead of signed differences. We need signed differences because "a appears 2 more than b" is different from "b appears 2 more than a".

4. **Not resetting properly for two-character cases:** When checking for 'a' and 'b' only, you must reset when you encounter 'c', otherwise you might include 'c' in what should be a two-character substring.

## When You'll See This Pattern

This prefix sum with difference tracking pattern appears in several problems:

1. **LeetCode 525: Contiguous Array** - Find the longest subarray with equal number of 0s and 1s. Uses a single difference counter.

2. **LeetCode 1371: Find the Longest Substring Containing Vowels in Even Counts** - Tracks parity (even/odd) of vowel counts using bitmask.

3. **LeetCode 1542: Find Longest Awesome Substring** - Similar concept with bitmask for digit counts.

All these problems transform substring conditions into prefix sum conditions that can be checked with hash maps in O(n) time.

## Key Takeaways

1. **Transform substring problems into prefix sum problems:** When you need to check a property of substrings (like equal character counts), think about how to express it as a condition on prefix sums.

2. **Use differences to reduce dimensionality:** Instead of tracking three separate counts (a, b, c), track differences between them. This reduces the state space and makes hash map lookups efficient.

3. **Handle edge cases systematically:** For "all distinct characters" problems, remember to handle cases where not all characters appear. Test with simple cases like "aa", "ab", "abc" to ensure all scenarios work.

[Practice this problem on CodeJeet](/problem/longest-balanced-substring-ii)
