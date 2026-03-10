---
title: "How to Solve Maximum Number of Non-overlapping Palindrome Substrings — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Non-overlapping Palindrome Substrings. Hard difficulty, 43.3% acceptance rate. Topics: Two Pointers, String, Dynamic Programming, Greedy."
date: "2029-09-07"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-non-overlapping-palindrome-substrings",
    "two-pointers",
    "string",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Maximum Number of Non-overlapping Palindrome Substrings

This problem asks us to find the maximum number of non-overlapping palindrome substrings we can select from a string, where each substring must have length at least `k`. What makes this problem tricky is that we need to balance two competing goals: finding palindromes (which suggests expanding from centers) and maximizing count (which suggests a greedy approach). The constraint that substrings can't overlap forces us to be strategic about which palindromes we choose.

## Visual Walkthrough

Let's trace through an example: `s = "abaccd"`, `k = 3`.

**Step 1: Find all palindromes of length ≥ 3**

- Starting at index 0: "aba" (indices 0-2) is a palindrome ✓
- Starting at index 1: "bac" (1-3) is not a palindrome ✗
- Starting at index 2: "acc" (2-4) is not a palindrome ✗
- Starting at index 3: "ccd" (3-5) is not a palindrome ✗

But wait! We're missing something. Palindromes don't have to start at every index. Let's think differently:

**Step 2: Expand from centers to find all palindromes**

- Center at index 1 (between 'b' and 'a'): expands to "aba" (0-2) ✓
- Center at index 2 ('a'): expands to "aba" (0-2) and "acca" (1-4) ✓
- Center at index 3 (between 'c' and 'c'): expands to "cc" (3-4) but length 2 < 3 ✗

So we have two valid palindromes: "aba" (0-2) and "acca" (1-4).

**Step 3: Choose non-overlapping palindromes**

- If we choose "aba" (0-2), we can't choose "acca" (1-4) because they overlap
- If we choose "acca" (1-4), that's our only choice
- Maximum count = 1

But is there a better way? What if we look for the earliest-ending palindrome at each position?

**Step 4: Greedy approach**

- At index 0: earliest palindrome ending at or after index 0 is "aba" ending at index 2
- Take it, move to index 3
- At index 3: no palindrome of length ≥ 3 starting here
- Result: 1 palindrome

This gives us the optimal answer of 1.

## Brute Force Approach

A naive approach would be to:

1. Generate all possible substrings of length ≥ k
2. Check which ones are palindromes
3. Try all combinations of non-overlapping palindromes
4. Return the maximum count

The problem with this approach is combinatorial explosion. For a string of length `n`, there are O(n²) substrings. Checking each for palindrome takes O(n), so total O(n³). Then finding the maximum non-overlapping set is essentially a scheduling problem that could require trying all combinations.

Even if we precompute palindrome information, the brute force would be too slow for typical constraints (n up to 2000).

## Optimized Approach

The key insight is that we can combine two techniques:

1. **Palindrome expansion**: Instead of checking every substring, we can find all palindromes efficiently by expanding from centers. This takes O(n²) time but is acceptable for n ≤ 2000.

2. **Greedy selection**: Once we know where palindromes end, we can use a greedy approach: always take the palindrome that ends earliest at each position. This works because if we have a choice between two palindromes that start at the same position, the one that ends earlier leaves more room for additional palindromes later.

The algorithm works as follows:

- Precompute for each starting index `i`, the earliest ending index `j ≥ i + k - 1` where `s[i:j+1]` is a palindrome
- Use a greedy approach: iterate through the string, and whenever we reach an index that can start a palindrome, take it and jump to the position after its end

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def maxPalindromes(s: str, k: int) -> int:
    n = len(s)
    # end[i] will store the earliest ending index of a palindrome starting at i
    # Initialize with infinity (n) meaning no palindrome starts here
    end = [n] * n

    # Step 1: Find all odd-length palindromes
    for center in range(n):
        left = center
        right = center
        # Expand while palindrome condition holds and within bounds
        while left >= 0 and right < n and s[left] == s[right]:
            length = right - left + 1
            if length >= k:
                # Update the earliest ending for this starting position
                end[left] = min(end[left], right)
            left -= 1
            right += 1

    # Step 2: Find all even-length palindromes
    for center in range(n - 1):
        left = center
        right = center + 1
        while left >= 0 and right < n and s[left] == s[right]:
            length = right - left + 1
            if length >= k:
                end[left] = min(end[left], right)
            left -= 1
            right += 1

    # Step 3: Greedy selection of non-overlapping palindromes
    count = 0
    i = 0
    while i < n:
        # If no palindrome starts at i, move to next position
        if end[i] == n:
            i += 1
        else:
            # Take this palindrome (it ends earliest among those starting at i)
            count += 1
            # Jump to the position after this palindrome ends
            i = end[i] + 1

    return count
```

```javascript
// Time: O(n²) | Space: O(n)
function maxPalindromes(s, k) {
  const n = s.length;
  // end[i] stores earliest ending index of palindrome starting at i
  // Initialize with n (no palindrome)
  const end = new Array(n).fill(n);

  // Find odd-length palindromes
  for (let center = 0; center < n; center++) {
    let left = center;
    let right = center;
    while (left >= 0 && right < n && s[left] === s[right]) {
      const length = right - left + 1;
      if (length >= k) {
        // Update earliest ending for this start position
        end[left] = Math.min(end[left], right);
      }
      left--;
      right++;
    }
  }

  // Find even-length palindromes
  for (let center = 0; center < n - 1; center++) {
    let left = center;
    let right = center + 1;
    while (left >= 0 && right < n && s[left] === s[right]) {
      const length = right - left + 1;
      if (length >= k) {
        end[left] = Math.min(end[left], right);
      }
      left--;
      right++;
    }
  }

  // Greedy selection
  let count = 0;
  let i = 0;
  while (i < n) {
    if (end[i] === n) {
      // No palindrome starts here
      i++;
    } else {
      // Take this palindrome
      count++;
      // Jump to after it ends
      i = end[i] + 1;
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(n)
class Solution {
    public int maxPalindromes(String s, int k) {
        int n = s.length();
        // end[i] stores earliest ending index of palindrome starting at i
        // Initialize with n (meaning no palindrome)
        int[] end = new int[n];
        Arrays.fill(end, n);

        // Find odd-length palindromes
        for (int center = 0; center < n; center++) {
            int left = center;
            int right = center;
            while (left >= 0 && right < n &&
                   s.charAt(left) == s.charAt(right)) {
                int length = right - left + 1;
                if (length >= k) {
                    // Update earliest ending for this start
                    end[left] = Math.min(end[left], right);
                }
                left--;
                right++;
            }
        }

        // Find even-length palindromes
        for (int center = 0; center < n - 1; center++) {
            int left = center;
            int right = center + 1;
            while (left >= 0 && right < n &&
                   s.charAt(left) == s.charAt(right)) {
                int length = right - left + 1;
                if (length >= k) {
                    end[left] = Math.min(end[left], right);
                }
                left--;
                right++;
            }
        }

        // Greedy selection
        int count = 0;
        int i = 0;
        while (i < n) {
            if (end[i] == n) {
                // No palindrome starts here
                i++;
            } else {
                // Take this palindrome
                count++;
                // Jump to position after it ends
                i = end[i] + 1;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We expand from each of the n centers (n for odd, n-1 for even ≈ 2n centers)
- In the worst case, each expansion could go O(n) length (e.g., string of all same characters)
- Total: O(n²) for palindrome detection
- The greedy selection is O(n)
- Dominated by O(n²)

**Space Complexity: O(n)**

- We store an array `end` of size n
- No other significant data structures
- The palindrome expansion uses O(1) extra space

## Common Mistakes

1. **Only checking consecutive palindromes**: Some candidates only check substrings starting at every index, missing palindromes that start at positions where the character doesn't immediately form a palindrome of length k. The expansion approach ensures we catch all palindromes.

2. **Forgetting even-length palindromes**: It's easy to only check odd-length palindromes (centered on a character) and forget even-length ones (centered between characters). Both types need to be considered.

3. **Wrong greedy strategy**: Some try to take the longest palindrome first, but this isn't optimal. The correct greedy strategy is to take the earliest-ending palindrome at each position.

4. **Off-by-one errors with indices**: When calculating palindrome length, remember it's `right - left + 1`. When jumping after taking a palindrome, we need to go to `end[i] + 1`, not `end[i]`.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Palindrome expansion from centers**: Used in problems like:
   - [Longest Palindromic Substring](/problem/longest-palindromic-substring) - finding the longest palindrome
   - [Palindromic Substrings](/problem/palindromic-substrings) - counting all palindromic substrings

2. **Interval scheduling/greedy selection**: Used in problems like:
   - [Non-overlapping Intervals](/problem/non-overlapping-intervals) - maximum non-overlapping intervals
   - [Minimum Number of Arrows to Burst Balloons](/problem/minimum-number-of-arrows-to-burst-balloons) - similar interval selection

The combination makes this problem unique: we first generate intervals (palindromes) and then select a maximum non-overlapping subset.

## Key Takeaways

1. **When dealing with palindromes in strings, consider expansion from centers** rather than checking all substrings. This O(n²) approach is often efficient enough and cleaner to implement.

2. **For maximum non-overlapping selection problems, the greedy strategy of taking the earliest-ending valid choice** often works when choices are intervals on a line.

3. **Some problems require combining multiple techniques** - here we combine palindrome detection with interval scheduling. Recognizing the subproblems is key to solving complex problems.

Related problems: [Longest Palindromic Substring](/problem/longest-palindromic-substring), [Palindrome Partitioning](/problem/palindrome-partitioning), [Palindrome Partitioning II](/problem/palindrome-partitioning-ii)
