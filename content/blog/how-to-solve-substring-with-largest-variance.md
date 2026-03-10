---
title: "How to Solve Substring With Largest Variance — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Substring With Largest Variance. Hard difficulty, 46.0% acceptance rate. Topics: Hash Table, String, Dynamic Programming, Enumeration."
date: "2027-12-10"
category: "dsa-patterns"
tags: ["substring-with-largest-variance", "hash-table", "string", "dynamic-programming", "hard"]
---

## How to Solve Substring With Largest Variance

This problem asks us to find the maximum variance among all substrings of a given string, where variance is defined as the largest difference between the frequency of any two characters in that substring. What makes this problem tricky is that we need to consider **all possible pairs of characters** and **all possible substrings**, but doing so naively would be far too slow. The key insight is that we can adapt the maximum subarray (Kadane's) algorithm to efficiently find the best substring for each character pair.

## Visual Walkthrough

Let's trace through a small example: `s = "aababbb"`

We want to find the substring with the largest variance. Let's manually check a few possibilities:

- For characters `a` and `b`:
  - Substring `"aab"`: count(a)=2, count(b)=1 → variance = 1
  - Substring `"aabab"`: count(a)=3, count(b)=2 → variance = 1
  - Substring `"babbb"`: count(a)=1, count(b)=4 → variance = 3
  - Substring `"ababbb"`: count(a)=2, count(b)=4 → variance = 2

The maximum variance for (a,b) pair appears to be 3 from substring `"babbb"`.

But wait — we also need to consider other character pairs! For example, what about `a` and `a`? The variance would be 0 since they're the same character. The problem states "any 2 characters present in the string" — they can be the same, but the variance would always be 0 in that case.

The real challenge is that we need to systematically check **all** character pairs and **all** substrings efficiently. The brute force approach would check O(26²) = 676 character pairs and for each pair, check all O(n²) substrings — that's O(676 × n²) which is too slow for n up to 10⁴.

## Brute Force Approach

A naive solution would:

1. Generate all possible substrings (O(n²) of them)
2. For each substring, count frequencies of all characters (O(26) per substring)
3. Find the maximum and minimum frequencies among characters that appear
4. Calculate variance as (max - min)
5. Track the maximum variance across all substrings

This results in O(26 × n²) time complexity, which is O(10⁸) for n=10⁴ — far too slow.

Even if we optimize by only considering characters that actually appear in the substring, we still need to check all substrings, which is O(n²). With n up to 10,000, n² = 100 million operations is borderline but might pass in some languages with careful implementation. However, the problem's constraints and difficulty suggest we need something better.

## Optimized Approach

The key insight comes from recognizing that variance is essentially about finding a substring where one character appears much more frequently than another. For any fixed pair of characters (say `a` and `b`), we can transform the string into an array where:

- `a` becomes +1
- `b` becomes -1
- All other characters become 0

Now, finding the maximum variance for this pair is equivalent to finding the maximum sum of a subarray where we treat `a` as +1 and `b` as -1, **with the crucial constraint that both characters must appear at least once in the substring**.

This is similar to the **maximum subarray problem** (Kadane's algorithm), but with a twist: we need to ensure our subarray contains at least one -1 (at least one `b`). Why? Because variance requires both characters to be present in the substring!

Here's the step-by-step reasoning:

1. We only have 26 possible characters, so we can iterate through all 26×26 = 676 possible pairs (including same-character pairs, though those give variance 0).
2. For each pair (major, minor), we convert the string to an array where:
   - major = +1
   - minor = -1
   - other = 0
3. We run a modified Kadane's algorithm that tracks:
   - `current_sum`: current subarray sum
   - `has_minor`: whether current subarray contains the minor character
   - `best_sum`: best variance found so far for this pair
4. The modification: we can only update `best_sum` if `has_minor` is true (both characters are present)
5. We also need to handle the case where we might want to reset our subarray — but we can only reset if we keep at least one minor character

Wait, there's another subtlety! What if the best subarray ends with a minor character and we want to extend it? We might need to track two states:

- State 1: Current subarray has seen at least one minor character
- State 2: Current subarray hasn't seen a minor character yet (can't contribute to variance)

Actually, the cleanest approach is to use **Kadane's algorithm with a minor seen flag reset trick**:

- When we see a major character (+1): always extend current subarray
- When we see a minor character (-1): extend if it improves variance OR if we haven't seen a minor yet
- Reset when current sum goes negative AND we've seen a minor

But there's an even cleaner approach: run Kadane's algorithm twice for each pair — once normally, and once where we ensure at least one minor is included by initializing with -1 and never allowing the sum to go below -1.

## Optimal Solution

The most elegant solution adapts Kadane's algorithm with careful state management. For each character pair (a,b), we iterate through the string and maintain:

- `sumAB`: current running sum where a=+1, b=-1, others=0
- `sumABWithB`: current running sum, but we ensure at least one b is included by "paying" a penalty of -1 when we start
- `maxVar`: maximum variance for this pair

We update these as we go, and the maximum variance overall is the maximum across all pairs.

<div class="code-group">

```python
# Time: O(26² * n) = O(676n) ≈ O(n) since 676 is constant
# Space: O(1) - only constant extra space
def largestVariance(s: str) -> int:
    # We'll check all possible pairs of characters
    chars = list(set(s))
    max_variance = 0

    # For each possible major character
    for a in chars:
        # For each possible minor character (can be same as a, but variance would be 0)
        for b in chars:
            if a == b:
                continue  # Variance would be 0 for same character

            # Initialize variables for Kadane's-like algorithm
            # sum_a_b: current sum where a=+1, b=-1, others=0
            # has_b: whether we've seen at least one b in current segment
            # first_b: special flag to handle the case where we need to include b
            sum_a_b = 0
            has_b = False
            first_b = False

            # Iterate through the string
            for ch in s:
                if ch == a:
                    # Major character: +1
                    sum_a_b += 1
                elif ch == b:
                    # Minor character: -1
                    has_b = True

                    # If this is the first b and sum_a_b >= 0, we can "reset" with this b
                    if first_b and sum_a_b >= 0:
                        first_b = False
                    else:
                        sum_a_b -= 1

                        # If sum goes negative, we can start a new segment from next position
                        if sum_a_b < 0:
                            sum_a_b = -1
                            first_b = True
                # Other characters: ignore (0)

                # Update max variance if we have at least one b
                if has_b:
                    max_variance = max(max_variance, sum_a_b)

    return max_variance
```

```javascript
// Time: O(26² * n) = O(676n) ≈ O(n) since 676 is constant
// Space: O(1) - only constant extra space
function largestVariance(s) {
  // Get unique characters in the string
  const chars = [...new Set(s)];
  let maxVariance = 0;

  // Check all possible pairs of characters
  for (const a of chars) {
    for (const b of chars) {
      if (a === b) continue; // Variance would be 0

      // Kadane's-like algorithm for this pair
      let sumAB = 0;
      let hasB = false;
      let firstB = false;

      for (const ch of s) {
        if (ch === a) {
          // Major character: +1
          sumAB++;
        } else if (ch === b) {
          // Minor character: -1
          hasB = true;

          // Handle the case where we need to include this b
          if (firstB && sumAB >= 0) {
            firstB = false;
          } else {
            sumAB--;

            // If sum goes negative, reset for next segment
            if (sumAB < 0) {
              sumAB = -1;
              firstB = true;
            }
          }
        }
        // Other characters are ignored (0)

        // Update max variance if we have at least one b
        if (hasB) {
          maxVariance = Math.max(maxVariance, sumAB);
        }
      }
    }
  }

  return maxVariance;
}
```

```java
// Time: O(26² * n) = O(676n) ≈ O(n) since 676 is constant
// Space: O(1) - only constant extra space
class Solution {
    public int largestVariance(String s) {
        // Get unique characters
        Set<Character> uniqueChars = new HashSet<>();
        for (char c : s.toCharArray()) {
            uniqueChars.add(c);
        }

        List<Character> chars = new ArrayList<>(uniqueChars);
        int maxVariance = 0;

        // Check all possible pairs
        for (char a : chars) {
            for (char b : chars) {
                if (a == b) continue; // Variance would be 0

                // Modified Kadane's algorithm for this pair
                int sumAB = 0;
                boolean hasB = false;
                boolean firstB = false;

                for (char ch : s.toCharArray()) {
                    if (ch == a) {
                        // Major character: +1
                        sumAB++;
                    } else if (ch == b) {
                        // Minor character: -1
                        hasB = true;

                        // Special handling for including b
                        if (firstB && sumAB >= 0) {
                            firstB = false;
                        } else {
                            sumAB--;

                            // Reset if sum goes negative
                            if (sumAB < 0) {
                                sumAB = -1;
                                firstB = true;
                            }
                        }
                    }
                    // Other characters are ignored

                    // Update max variance if we have at least one b
                    if (hasB) {
                        maxVariance = Math.max(maxVariance, sumAB);
                    }
                }
            }
        }

        return maxVariance;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(26² × n) = O(676n) ≈ O(n)

- We iterate through all 26×26 = 676 possible character pairs (in practice, only pairs from unique characters in s)
- For each pair, we make a single pass through the string of length n
- Since 676 is a constant, the overall complexity is linear O(n)

**Space Complexity:** O(1)

- We only use a constant amount of extra space regardless of input size
- The variables `sum_a_b`, `has_b`, `first_b`, and loop counters use O(1) space
- Even the set of unique characters is at most size 26, which is constant

## Common Mistakes

1. **Forgetting that both characters must be present**: The biggest pitfall is not ensuring the substring contains both characters. Variance is defined for "any 2 characters present in the string" — if only one character appears, the variance is 0, not the count of that character.

2. **Incorrect reset logic in Kadane's adaptation**: When the running sum goes negative, you might think to reset to 0 like standard Kadane's. But here, if you reset to 0, you might lose track of the minor character. The solution needs to reset to -1 (not 0) to account for the minor character that caused the negative sum.

3. **Only checking adjacent characters**: Some candidates try to find the maximum difference between frequencies of any two characters in the whole string, but this ignores substrings. The variance must be computed on a substring, not the entire string.

4. **Overlooking character pairs with zero occurrences**: You don't need to check pairs where either character doesn't appear in the string at all, but checking them doesn't hurt (gives variance 0). However, checking only the 26×26 possible pairs is fine since 676 is constant.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Maximum Subarray (Kadane's Algorithm)**: The core technique adapts Kadane's algorithm with additional constraints. Similar problems:
   - [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) - The classic Kadane's algorithm problem
   - [Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/) - Kadane's with wrap-around
   - [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) - Similar idea but with multiplication

2. **Character Frequency Problems**: Many string problems involve character frequencies:
   - [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) - Uses sliding window with frequency count
   - [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) - Finds substring containing all characters with certain frequencies

3. **Enumerating Pairs from Limited Set**: When you have a limited set of possible values (like 26 letters), enumerating all pairs can be efficient:
   - [Maximum Product of Word Lengths](https://leetcode.com/problems/maximum-product-of-word-lengths/) - Uses bitmask for 26 letters
   - [Valid Anagram](https://leetcode.com/problems/valid-anagram/) - Compares character frequencies

## Key Takeaways

1. **When you see "maximum difference" in substrings, think Kadane's algorithm**: The maximum variance problem is essentially finding the maximum sum subarray after transforming the string based on a character pair.

2. **Limited alphabet size enables brute force over pairs**: With only 26 possible characters, checking all 676 pairs is acceptable. This pattern appears often in string problems with lowercase English letters.

3. **Constraints modify standard algorithms**: Standard Kadane's resets to 0 when sum goes negative, but here we need to reset to -1 to ensure we keep track of the minor character. Always read constraints carefully!

Related problems: [Maximum Subarray](/problem/maximum-subarray)
