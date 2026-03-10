---
title: "How to Solve Sum of Beauty of All Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Beauty of All Substrings. Medium difficulty, 73.6% acceptance rate. Topics: Hash Table, String, Counting."
date: "2026-04-28"
category: "dsa-patterns"
tags: ["sum-of-beauty-of-all-substrings", "hash-table", "string", "counting", "medium"]
---

# How to Solve Sum of Beauty of All Substrings

This problem asks us to calculate the sum of beauty values for every substring of a given string `s`, where beauty is defined as the difference between the maximum and minimum character frequency in that substring. While the concept is straightforward, the challenge lies in efficiently processing all possible substrings—there are O(n²) of them—without repeatedly recomputing character frequencies from scratch.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `s = "aab"`:

**All substrings and their beauty calculations:**

1. `"a"` → frequencies: {a:1} → max=1, min=1 → beauty = 1-1 = 0
2. `"aa"` → frequencies: {a:2} → max=2, min=2 → beauty = 2-2 = 0
3. `"aab"` → frequencies: {a:2, b:1} → max=2, min=1 → beauty = 2-1 = 1
4. `"a"` (second) → frequencies: {a:1} → max=1, min=1 → beauty = 0
5. `"ab"` → frequencies: {a:1, b:1} → max=1, min=1 → beauty = 0
6. `"b"` → frequencies: {b:1} → max=1, min=1 → beauty = 0

**Total sum:** 0 + 0 + 1 + 0 + 0 + 0 = 1

Notice that for each substring, we need to:

1. Count character frequencies
2. Find the maximum frequency
3. Find the minimum frequency (excluding zero counts)
4. Calculate their difference

The key insight is that as we extend substrings character by character, we can update frequency counts incrementally rather than recomputing from scratch each time.

## Brute Force Approach

The most straightforward approach is to generate all substrings and compute beauty for each one independently:

1. Generate all O(n²) substrings using nested loops
2. For each substring, count character frequencies (O(n) time per substring)
3. Find max and min frequencies (O(26) time since only lowercase English letters)
4. Calculate beauty and add to total

This results in O(n³) time complexity, which is far too slow for the maximum constraint (n ≤ 500 would mean up to 125 million operations).

**Why it's insufficient:** Even with the optimization that we only have 26 possible characters, the O(n³) approach becomes impractical for n=500 (approximately 31.25 million substring iterations, each with O(n) frequency counting).

## Optimized Approach

The key optimization is to use **frequency accumulation** as we extend substrings. Instead of recomputing frequencies for each substring from scratch:

1. Fix a starting index `i`
2. Initialize an array of 26 zeros to store character counts
3. For each ending index `j` from `i` to `n-1`:
   - Increment the count for character `s[j]`
   - Now we have frequencies for substring `s[i:j+1]`
   - Find max and min (non-zero) frequencies in the current count array
   - Add `max - min` to the total

This reduces the time complexity to O(n² × 26) because:

- We still have O(n²) substrings
- For each substring, we update one frequency count (O(1))
- Finding max/min requires scanning 26 elements

**Why this works:** By fixing the starting point and extending the substring to the right, we maintain a running frequency count. Each time we add a character, we only need to update one frequency value, avoiding the O(n) per-substring frequency recomputation.

## Optimal Solution

The optimal solution uses the frequency accumulation approach described above. We need to be careful about finding the minimum frequency—we must only consider characters that actually appear in the current substring (non-zero counts).

<div class="code-group">

```python
# Time: O(n² × 26) = O(n²) since 26 is constant
# Space: O(26) = O(1) for the frequency array
def beautySum(s: str) -> int:
    n = len(s)
    total_beauty = 0

    # Iterate over all possible starting indices
    for i in range(n):
        # Frequency array for 26 lowercase letters
        # Index 0 represents 'a', index 1 represents 'b', etc.
        freq = [0] * 26

        # For each starting index i, iterate over all ending indices j >= i
        for j in range(i, n):
            # Convert character to index (0-25) and increment its count
            char_index = ord(s[j]) - ord('a')
            freq[char_index] += 1

            # Initialize min and max frequencies
            # We need to find min among NON-ZERO frequencies
            min_freq = float('inf')
            max_freq = 0

            # Scan through all 26 possible characters
            for count in freq:
                if count > 0:  # Only consider characters that appear in substring
                    min_freq = min(min_freq, count)
                    max_freq = max(max_freq, count)

            # Add beauty for current substring to total
            total_beauty += (max_freq - min_freq)

    return total_beauty
```

```javascript
// Time: O(n² × 26) = O(n²) since 26 is constant
// Space: O(26) = O(1) for the frequency array
function beautySum(s) {
  const n = s.length;
  let totalBeauty = 0;

  // Iterate over all possible starting indices
  for (let i = 0; i < n; i++) {
    // Frequency array for 26 lowercase letters
    // Index 0 represents 'a', index 1 represents 'b', etc.
    const freq = new Array(26).fill(0);

    // For each starting index i, iterate over all ending indices j >= i
    for (let j = i; j < n; j++) {
      // Convert character to index (0-25) and increment its count
      const charIndex = s.charCodeAt(j) - "a".charCodeAt(0);
      freq[charIndex]++;

      // Initialize min and max frequencies
      // We need to find min among NON-ZERO frequencies
      let minFreq = Infinity;
      let maxFreq = 0;

      // Scan through all 26 possible characters
      for (let count of freq) {
        if (count > 0) {
          // Only consider characters that appear in substring
          minFreq = Math.min(minFreq, count);
          maxFreq = Math.max(maxFreq, count);
        }
      }

      // Add beauty for current substring to total
      totalBeauty += maxFreq - minFreq;
    }
  }

  return totalBeauty;
}
```

```java
// Time: O(n² × 26) = O(n²) since 26 is constant
// Space: O(26) = O(1) for the frequency array
class Solution {
    public int beautySum(String s) {
        int n = s.length();
        int totalBeauty = 0;

        // Iterate over all possible starting indices
        for (int i = 0; i < n; i++) {
            // Frequency array for 26 lowercase letters
            // Index 0 represents 'a', index 1 represents 'b', etc.
            int[] freq = new int[26];

            // For each starting index i, iterate over all ending indices j >= i
            for (int j = i; j < n; j++) {
                // Convert character to index (0-25) and increment its count
                char c = s.charAt(j);
                freq[c - 'a']++;

                // Initialize min and max frequencies
                // We need to find min among NON-ZERO frequencies
                int minFreq = Integer.MAX_VALUE;
                int maxFreq = 0;

                // Scan through all 26 possible characters
                for (int count : freq) {
                    if (count > 0) {  // Only consider characters that appear in substring
                        minFreq = Math.min(minFreq, count);
                        maxFreq = Math.max(maxFreq, count);
                    }
                }

                // Add beauty for current substring to total
                totalBeauty += (maxFreq - minFreq);
            }
        }

        return totalBeauty;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² × 26) = O(n²)

- Outer loop runs n times (for each starting index)
- Inner loop runs up to n times (for each ending index)
- Inside the inner loop, we scan 26 elements to find min/max frequencies
- Since 26 is constant, we simplify to O(n²)

**Space Complexity:** O(1)

- We use a fixed-size array of 26 integers regardless of input size
- A few integer variables for tracking min, max, and totals

**Why this is optimal:** We must examine all O(n²) substrings, so O(n²) is the best possible time complexity. The constant factor of 26 comes from scanning the frequency array, which is unavoidable since we need to find min/max frequencies.

## Common Mistakes

1. **Incorrect minimum frequency calculation:** Forgetting to exclude zero counts when finding the minimum frequency. If a character doesn't appear in the substring, its count is 0, but the minimum should only consider characters that actually appear. This would incorrectly give beauty = max - 0 = max.

2. **Recomputing frequencies from scratch:** Using the brute force O(n³) approach by extracting each substring and counting frequencies independently. This fails on larger inputs due to time limits.

3. **Off-by-one errors in substring generation:** Incorrect loop boundaries when generating substrings. Remember that for a string of length n, valid indices are 0 to n-1, and substring s[i:j] includes characters from i to j-1.

4. **Assuming only lowercase letters:** The problem states the string contains only lowercase English letters, but some candidates might write generic code that handles all Unicode characters, which would be less efficient. Leveraging the 26-letter constraint is key to the O(26) frequency scan.

## When You'll See This Pattern

This problem uses the **frequency accumulation with sliding window** pattern, which appears in many substring problems:

1. **Substrings That Begin and End With the Same Letter** (LeetCode 2083): Count substrings where first and last characters are equal. Similar O(n²) approach with frequency tracking.

2. **Count Number of Nice Subarrays** (LeetCode 1248): Counting subarrays with a specific property, often solved with frequency maps and sliding windows.

3. **Subarray Sum Equals K** (LeetCode 560): While not about character frequencies, it uses similar prefix accumulation techniques to avoid O(n³) brute force.

The core pattern is: when you need to compute something for all subarrays/substrings, consider fixing one endpoint and extending the other while maintaining running totals to avoid recomputation.

## Key Takeaways

1. **Frequency accumulation is powerful:** When dealing with substring problems involving character counts, maintain running frequency counts as you extend substrings rather than recomputing from scratch.

2. **Constant factors matter:** The constraint "only lowercase English letters" (26 possibilities) enables the O(26) frequency scan. Always check problem constraints for such optimizations.

3. **O(n²) can be acceptable:** For n ≤ 500, O(n²) with a small constant factor (like 26) is feasible (~6.5 million operations). Know your complexity limits: 10⁷ operations is generally safe for most online judges.

Related problems: [Substrings That Begin and End With the Same Letter](/problem/substrings-that-begin-and-end-with-the-same-letter)
