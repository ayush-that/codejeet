---
title: "How to Solve Maximum Difference Between Even and Odd Frequency I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Difference Between Even and Odd Frequency I. Easy difficulty, 60.7% acceptance rate. Topics: Hash Table, String, Counting."
date: "2026-04-09"
category: "dsa-patterns"
tags:
  [
    "maximum-difference-between-even-and-odd-frequency-i",
    "hash-table",
    "string",
    "counting",
    "easy",
  ]
---

# How to Solve Maximum Difference Between Even and Odd Frequency I

This problem asks us to find the maximum difference between the frequency of any character with odd frequency and any character with even frequency in a given string. The challenge lies in efficiently tracking frequencies and identifying the optimal pair while respecting the odd/even constraints.

## Visual Walkthrough

Let's trace through an example: `s = "aabbcdee"`

**Step 1: Count frequencies**

- a: 2 (even)
- b: 2 (even)
- c: 1 (odd)
- d: 1 (odd)
- e: 2 (even)

**Step 2: Identify candidates**

- Odd frequencies: 1 (from c and d)
- Even frequencies: 2 (from a, b, and e)

**Step 3: Find maximum difference**
We need `max(odd_freq) - min(even_freq)`:

- Max odd frequency = 1
- Min even frequency = 2
- Difference = 1 - 2 = -1

Wait, that's negative! We need the maximum difference, so we should consider:

- Largest odd frequency minus smallest even frequency (for positive difference)
- But if all differences are negative, we need to handle that

Actually, let's reconsider: `diff = freq(a1) - freq(a2)` where a1 has odd frequency and a2 has even frequency. We want the maximum possible value of this expression.

For our example:

- Possible a1 (odd freq): c(1), d(1)
- Possible a2 (even freq): a(2), b(2), e(2)
- Possible differences: 1-2 = -1 (for any combination)

The maximum is -1. But what if we had different frequencies?

**Better example:** `s = "aaabbc"`

**Step 1: Count frequencies**

- a: 3 (odd)
- b: 2 (even)
- c: 1 (odd)

**Step 2: Identify candidates**

- Odd frequencies: 3 (a), 1 (c)
- Even frequencies: 2 (b)

**Step 3: Find maximum difference**

- Using a (freq=3) as a1 and b (freq=2) as a2: 3 - 2 = 1
- Using c (freq=1) as a1 and b (freq=2) as a2: 1 - 2 = -1
- Maximum difference = 1

The key insight: To maximize `odd_freq - even_freq`, we want the largest odd frequency and the smallest even frequency.

## Brute Force Approach

A naive approach would be:

1. Count all character frequencies
2. Generate all pairs of characters
3. Check if first has odd frequency and second has even frequency
4. Calculate their frequency difference
5. Track the maximum difference

This would be O(n²) where n is the number of unique characters (at most 26 for lowercase English letters, but still inefficient). More importantly, it's unnecessarily complex since we don't actually need to compare specific character pairs - we just need the largest odd frequency and smallest even frequency from the entire set.

A simpler brute force would still be O(n) time by counting frequencies and then scanning for max odd and min even, which is actually optimal! So in this case, the "brute force" is essentially the optimal solution. The challenge is implementing it correctly and handling edge cases.

## Optimal Solution

The optimal approach has three clear steps:

1. Count frequencies of all characters
2. Find the maximum odd frequency
3. Find the minimum even frequency
4. Calculate their difference

The tricky part: What if there are no characters with odd frequency or no characters with even frequency? The problem doesn't explicitly state, but logically:

- If no odd frequency exists, we can't choose a1
- If no even frequency exists, we can't choose a2
- In either case, we should return 0 (no valid pair exists)

<div class="code-group">

```python
# Time: O(n) where n is length of string
# Space: O(1) because we store at most 26 frequencies
def maxDifference(self, s: str) -> int:
    # Step 1: Count frequencies of all characters
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Step 2: Initialize trackers
    # We want maximum odd frequency, so start with smallest possible
    max_odd = 0
    # We want minimum even frequency, so start with largest possible
    # Using float('inf') ensures any even frequency will be smaller
    min_even = float('inf')

    # Step 3: Find max odd and min even frequencies
    for count in freq.values():
        if count % 2 == 1:  # Odd frequency
            if count > max_odd:
                max_odd = count
        else:  # Even frequency
            if count < min_even:
                min_even = count

    # Step 4: Check if we found valid candidates
    # If max_odd is still 0, no odd frequency was found
    # If min_even is still infinity, no even frequency was found
    if max_odd == 0 or min_even == float('inf'):
        return 0

    # Step 5: Return the difference
    return max_odd - min_even
```

```javascript
// Time: O(n) where n is length of string
// Space: O(1) because we store at most 26 frequencies
function maxDifference(s) {
  // Step 1: Count frequencies of all characters
  const freq = new Map();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Step 2: Initialize trackers
  // We want maximum odd frequency, so start with 0
  let maxOdd = 0;
  // We want minimum even frequency, so start with Infinity
  let minEven = Infinity;

  // Step 3: Find max odd and min even frequencies
  for (const count of freq.values()) {
    if (count % 2 === 1) {
      // Odd frequency
      if (count > maxOdd) {
        maxOdd = count;
      }
    } else {
      // Even frequency
      if (count < minEven) {
        minEven = count;
      }
    }
  }

  // Step 4: Check if we found valid candidates
  // If maxOdd is 0, no odd frequency was found
  // If minEven is Infinity, no even frequency was found
  if (maxOdd === 0 || minEven === Infinity) {
    return 0;
  }

  // Step 5: Return the difference
  return maxOdd - minEven;
}
```

```java
// Time: O(n) where n is length of string
// Space: O(1) because we store at most 26 frequencies
public int maxDifference(String s) {
    // Step 1: Count frequencies of all characters
    int[] freq = new int[26];
    for (char c : s.toCharArray()) {
        freq[c - 'a']++;
    }

    // Step 2: Initialize trackers
    // We want maximum odd frequency, so start with 0
    int maxOdd = 0;
    // We want minimum even frequency, so start with largest possible
    // Using Integer.MAX_VALUE ensures any even frequency will be smaller
    int minEven = Integer.MAX_VALUE;

    // Step 3: Find max odd and min even frequencies
    for (int count : freq) {
        if (count > 0) {  // Only consider characters that appear
            if (count % 2 == 1) {  // Odd frequency
                if (count > maxOdd) {
                    maxOdd = count;
                }
            } else {  // Even frequency
                if (count < minEven) {
                    minEven = count;
                }
            }
        }
    }

    // Step 4: Check if we found valid candidates
    // If maxOdd is 0, no odd frequency was found
    // If minEven is still MAX_VALUE, no even frequency was found
    if (maxOdd == 0 || minEven == Integer.MAX_VALUE) {
        return 0;
    }

    // Step 5: Return the difference
    return maxOdd - minEven;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once to count frequencies: O(n)
- We iterate through the frequency map/array once: O(26) = O(1) for lowercase English letters
- Total: O(n) + O(1) = O(n)

**Space Complexity: O(1)**

- We use a frequency counter with at most 26 entries (one for each lowercase letter)
- Even with a hash map implementation, the space is constant
- The auxiliary variables use constant space

## Common Mistakes

1. **Forgetting to handle the case when no odd or even frequency exists**: This is the most common mistake. Candidates return `max_odd - min_even` without checking if both values were actually found. Always validate that you have both an odd and even frequency candidate.

2. **Initializing min_even incorrectly**: Starting `min_even` at 0 is wrong because 0 might be smaller than all actual even frequencies. You need to initialize it to a very large value (like `float('inf')` in Python, `Infinity` in JavaScript, or `Integer.MAX_VALUE` in Java) so the first even frequency will replace it.

3. **Including zero frequencies in the calculation**: When using an array of size 26, make sure to skip counts of 0. Otherwise, 0 (which is even) might become your `min_even`, giving incorrect results.

4. **Misunderstanding the difference calculation**: Some candidates try to find `max(odd) - max(even)` or `min(odd) - min(even)`. Remember, to maximize `odd - even`, you want the largest odd and smallest even.

## When You'll See This Pattern

This problem combines frequency counting with conditional extremum finding (finding maximum/minimum under certain conditions). You'll see similar patterns in:

1. **387. First Unique Character in a String** - Count frequencies, then find first character with frequency 1
2. **451. Sort Characters By Frequency** - Count frequencies, then sort based on frequency
3. **409. Longest Palindrome** - Count frequencies, use all even counts and at most one odd count

The core technique of frequency counting followed by analysis based on frequency properties appears in many string manipulation problems. The conditional extremum aspect (max odd, min even) is similar to problems where you need to find elements satisfying certain properties.

## Key Takeaways

1. **Frequency counting is fundamental**: Many string problems start with counting character frequencies. Use a dictionary/hash map for general cases or an array when the alphabet is small and fixed.

2. **Initialize extremum trackers carefully**: When finding maximum, initialize with the smallest possible value. When finding minimum, initialize with the largest possible value. This ensures the first valid candidate replaces the initial value.

3. **Always check edge cases**: What if no element satisfies the condition? What if all elements satisfy it? Explicitly handle these boundary conditions to avoid runtime errors or incorrect results.

[Practice this problem on CodeJeet](/problem/maximum-difference-between-even-and-odd-frequency-i)
