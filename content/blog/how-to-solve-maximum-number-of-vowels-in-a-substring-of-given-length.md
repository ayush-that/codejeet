---
title: "How to Solve Maximum Number of Vowels in a Substring of Given Length — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Vowels in a Substring of Given Length. Medium difficulty, 61.6% acceptance rate. Topics: String, Sliding Window."
date: "2027-02-06"
category: "dsa-patterns"
tags:
  ["maximum-number-of-vowels-in-a-substring-of-given-length", "string", "sliding-window", "medium"]
---

# How to Solve Maximum Number of Vowels in a Substring of Given Length

This problem asks us to find the maximum number of vowels in any substring of length `k` from a given string `s`. While conceptually straightforward, it's interesting because it perfectly demonstrates the sliding window technique—a fundamental pattern for solving substring problems efficiently. The challenge lies in avoiding the O(n×k) brute force approach and instead achieving O(n) time complexity by intelligently maintaining a running count.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `s = "abciiidef"` and `k = 3`.

**Initial window (positions 0-2):** "abc"

- Vowels: 'a' → 1 vowel
- Count = 1

**Slide window right by 1 (positions 1-3):** "bci"

- Remove 'a' (vowel) → subtract 1
- Add 'i' (vowel) → add 1
- Count = 1 - 1 + 1 = 1

**Slide window right (positions 2-4):** "cii"

- Remove 'b' (not vowel) → no change
- Add 'i' (vowel) → add 1
- Count = 1 + 1 = 2

**Slide window right (positions 3-5):** "iii"

- Remove 'c' (not vowel) → no change
- Add 'i' (vowel) → add 1
- Count = 2 + 1 = 3

**Continue sliding...** We'll find that "iii" gives us 3 vowels, which is the maximum for k=3.

The key insight: instead of recounting vowels for each substring from scratch, we maintain a running count by adjusting for the character leaving the window and the new character entering.

## Brute Force Approach

The most straightforward solution is to check every possible substring of length `k`:

1. For each starting index `i` from 0 to `n-k`
2. Examine the substring `s[i:i+k]`
3. Count vowels in that substring
4. Track the maximum count found

While this approach is correct, it's inefficient because it repeatedly processes the same characters. For a string of length `n` and window size `k`, we perform O(k) operations for each of O(n) windows, resulting in O(n×k) time complexity. When `k` is large (close to `n`), this approaches O(n²), which is too slow for typical constraints where `n` can be up to 10⁵.

<div class="code-group">

```python
# Time: O(n*k) | Space: O(1)
def maxVowelsBruteForce(s: str, k: int) -> int:
    vowels = set('aeiou')
    n = len(s)
    max_count = 0

    # Check every possible starting position
    for i in range(n - k + 1):
        count = 0
        # Count vowels in current window
        for j in range(i, i + k):
            if s[j] in vowels:
                count += 1
        max_count = max(max_count, count)

    return max_count
```

```javascript
// Time: O(n*k) | Space: O(1)
function maxVowelsBruteForce(s, k) {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  const n = s.length;
  let maxCount = 0;

  // Check every possible starting position
  for (let i = 0; i <= n - k; i++) {
    let count = 0;
    // Count vowels in current window
    for (let j = i; j < i + k; j++) {
      if (vowels.has(s[j])) {
        count++;
      }
    }
    maxCount = Math.max(maxCount, count);
  }

  return maxCount;
}
```

```java
// Time: O(n*k) | Space: O(1)
public int maxVowelsBruteForce(String s, int k) {
    Set<Character> vowels = new HashSet<>();
    vowels.add('a'); vowels.add('e'); vowels.add('i');
    vowels.add('o'); vowels.add('u');

    int n = s.length();
    int maxCount = 0;

    // Check every possible starting position
    for (int i = 0; i <= n - k; i++) {
        int count = 0;
        // Count vowels in current window
        for (int j = i; j < i + k; j++) {
            if (vowels.contains(s.charAt(j))) {
                count++;
            }
        }
        maxCount = Math.max(maxCount, count);
    }

    return maxCount;
}
```

</div>

## Optimized Approach

The optimal solution uses the **sliding window** technique. Here's the key insight:

1. **Initial window**: Count vowels in the first `k` characters
2. **Slide window**: When moving the window one position to the right:
   - If the character leaving the window is a vowel, decrement the count
   - If the new character entering the window is a vowel, increment the count
3. **Track maximum**: Update the maximum count after each slide

This approach processes each character at most twice (once when entering, once when leaving), giving us O(n) time complexity instead of O(n×k).

The sliding window pattern works here because:

- We're looking for a contiguous substring of fixed length
- The computation for adjacent windows overlaps significantly
- We can efficiently update our result instead of recomputing from scratch

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxVowels(s: str, k: int) -> int:
    # Step 1: Define vowel set for O(1) lookup
    vowels = set('aeiou')

    # Step 2: Count vowels in the first window
    current_count = 0
    for i in range(k):
        if s[i] in vowels:
            current_count += 1

    # Step 3: Initialize max_count with first window's count
    max_count = current_count

    # Step 4: Slide the window across the string
    # i represents the end of the current window
    for i in range(k, len(s)):
        # Remove the character leaving the window (i-k position)
        if s[i - k] in vowels:
            current_count -= 1

        # Add the new character entering the window (i position)
        if s[i] in vowels:
            current_count += 1

        # Update maximum count found so far
        max_count = max(max_count, current_count)

    return max_count
```

```javascript
// Time: O(n) | Space: O(1)
function maxVowels(s, k) {
  // Step 1: Define vowel set for O(1) lookup
  const vowels = new Set(["a", "e", "i", "o", "u"]);

  // Step 2: Count vowels in the first window
  let currentCount = 0;
  for (let i = 0; i < k; i++) {
    if (vowels.has(s[i])) {
      currentCount++;
    }
  }

  // Step 3: Initialize maxCount with first window's count
  let maxCount = currentCount;

  // Step 4: Slide the window across the string
  // i represents the end of the current window
  for (let i = k; i < s.length; i++) {
    // Remove the character leaving the window (i-k position)
    if (vowels.has(s[i - k])) {
      currentCount--;
    }

    // Add the new character entering the window (i position)
    if (vowels.has(s[i])) {
      currentCount++;
    }

    // Update maximum count found so far
    maxCount = Math.max(maxCount, currentCount);
  }

  return maxCount;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxVowels(String s, int k) {
    // Step 1: Define vowel set for O(1) lookup
    Set<Character> vowels = new HashSet<>();
    vowels.add('a'); vowels.add('e'); vowels.add('i');
    vowels.add('o'); vowels.add('u');

    // Step 2: Count vowels in the first window
    int currentCount = 0;
    for (int i = 0; i < k; i++) {
        if (vowels.contains(s.charAt(i))) {
            currentCount++;
        }
    }

    // Step 3: Initialize maxCount with first window's count
    int maxCount = currentCount;

    // Step 4: Slide the window across the string
    // i represents the end of the current window
    for (int i = k; i < s.length(); i++) {
        // Remove the character leaving the window (i-k position)
        if (vowels.contains(s.charAt(i - k))) {
            currentCount--;
        }

        // Add the new character entering the window (i position)
        if (vowels.contains(s.charAt(i))) {
            currentCount++;
        }

        // Update maximum count found so far
        maxCount = Math.max(maxCount, currentCount);
    }

    return maxCount;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character at most twice: once when it enters the window and once when it leaves
- The initial window count takes O(k) time
- The sliding phase takes O(n-k) time
- Total: O(k + (n-k)) = O(n)

**Space Complexity: O(1)**

- We use a fixed-size set for vowel lookup (5 elements)
- We only store a few integer variables (current_count, max_count, loop indices)
- No additional data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors in window boundaries**: When sliding the window, candidates often mis-calculate which character is leaving (should be `s[i-k]`) or confuse 0-based vs 1-based indexing. Always test with k=1 and k=n edge cases.

2. **Forgetting to handle k > n**: While the problem guarantees k ≤ n, in interviews you should mention this edge case. If k > n, we can't form any valid substring of length k, so we should return 0 or handle it appropriately.

3. **Inefficient vowel checking**: Using a list `['a','e','i','o','u']` and checking `if char in list` gives O(5)=O(1) but is slower than using a set. Even worse would be checking `if char == 'a' or char == 'e'...` which is verbose and error-prone.

4. **Not updating max_count correctly**: Some candidates forget to check the first window or only update max_count when current_count increases (but we need the absolute maximum, even if it decreases later).

## When You'll See This Pattern

The sliding window technique appears in many substring and subarray problems:

1. **Maximum Subarray of Size K** (LeetCode 643): Exactly the same pattern but with sums instead of vowel counts.

2. **Longest Substring Without Repeating Characters** (LeetCode 3): Uses a variable-size sliding window with a hash map to track character frequencies.

3. **Minimum Window Substring** (LeetCode 76): A more complex sliding window problem where we need to find the minimum window containing all characters from a target string.

4. **Fruit Into Baskets** (LeetCode 904): Another variable-size window problem tracking at most 2 types of "fruits".

The pattern to recognize: when you need to examine **contiguous subsequences** of an array or string, especially with a **fixed or bounded length**, sliding window is often the optimal approach.

## Key Takeaways

1. **Sliding window transforms O(n×k) to O(n)**: When processing all subarrays/substrings of fixed length k, avoid recomputing from scratch by maintaining a running result and adjusting for the changing elements.

2. **The window update formula is key**: For fixed-size windows, remember: `new_result = old_result - effect_of_leaving_element + effect_of_entering_element`.

3. **Look for overlap in computations**: If adjacent windows share k-1 elements, there's likely a sliding window solution. This pattern applies to sums, counts, products, and other associative operations.

Related problems: [Maximum White Tiles Covered by a Carpet](/problem/maximum-white-tiles-covered-by-a-carpet), [Minimum Recolors to Get K Consecutive Black Blocks](/problem/minimum-recolors-to-get-k-consecutive-black-blocks), [Length of the Longest Alphabetical Continuous Substring](/problem/length-of-the-longest-alphabetical-continuous-substring)
