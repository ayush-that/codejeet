---
title: "How to Solve Count Residue Prefixes — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Residue Prefixes. Easy difficulty, 65.4% acceptance rate. Topics: Hash Table, String."
date: "2028-09-17"
category: "dsa-patterns"
tags: ["count-residue-prefixes", "hash-table", "string", "easy"]
---

# How to Solve Count Residue Prefixes

This problem asks us to count how many prefixes of a string satisfy a specific condition: the number of distinct characters in the prefix must equal the length of the prefix modulo 3. While the concept is straightforward, the challenge lies in efficiently tracking distinct characters as we examine increasingly longer prefixes. The modulo operation adds an extra layer that requires careful calculation at each step.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "abac"`.

**Step 1:** First prefix is `"a"`

- Length = 1
- Distinct characters = 1 (just 'a')
- Length % 3 = 1 % 3 = 1
- 1 == 1? Yes → This is a residue prefix

**Step 2:** Prefix `"ab"`

- Length = 2
- Distinct characters = 2 ('a' and 'b')
- Length % 3 = 2 % 3 = 2
- 2 == 2? Yes → This is a residue prefix

**Step 3:** Prefix `"aba"`

- Length = 3
- Distinct characters = 2 ('a' and 'b')
- Length % 3 = 3 % 3 = 0
- 2 == 0? No → Not a residue prefix

**Step 4:** Prefix `"abac"`

- Length = 4
- Distinct characters = 3 ('a', 'b', and 'c')
- Length % 3 = 4 % 3 = 1
- 3 == 1? No → Not a residue prefix

So for `s = "abac"`, we have 2 residue prefixes.

The key insight is that as we move from one prefix to the next (adding one character), we need to efficiently update:

1. The current length (just increment by 1)
2. The count of distinct characters (which may or may not increase)
3. The modulo value (which cycles through 0, 1, 2)

## Brute Force Approach

A naive approach would be to check each prefix independently:

1. For each possible prefix length `i` from 1 to `len(s)`
2. Extract the substring `s[0:i]`
3. Count distinct characters in that substring (using a set)
4. Calculate `i % 3`
5. Compare and count if equal

This approach is straightforward but inefficient. For a string of length `n`:

- We examine `n` prefixes
- For the `i`-th prefix, counting distinct characters takes O(i) time
- Total time complexity becomes O(1 + 2 + 3 + ... + n) = O(n²)
- Space complexity is O(n) for storing sets

While this works for small inputs, it's too slow for larger strings (n up to 10⁵ in typical constraints). The inefficiency comes from repeatedly recounting distinct characters from scratch for each prefix, when we could incrementally update our knowledge.

## Optimal Solution

The optimal solution uses a frequency array or hash map to track character counts as we iterate through the string. The key optimization is maintaining the count of distinct characters incrementally rather than recalculating it for each prefix.

**Algorithm:**

1. Initialize a frequency counter (array of size 26 for lowercase letters)
2. Initialize `distinct_count = 0` and `result = 0`
3. Iterate through each character in the string with index `i` (0-based)
4. For each character:
   - Get its frequency before adding the current character
   - If frequency is 0, this character is new → increment `distinct_count`
   - Update frequency counter
   - Calculate prefix length = `i + 1`
   - Check if `distinct_count == (i + 1) % 3`
   - If yes, increment `result`
5. Return `result`

Here's the complete implementation:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - fixed size array of 26
def countResiduePrefixes(s: str) -> int:
    """
    Counts the number of prefixes where distinct character count equals length % 3.

    Args:
        s: Input string consisting of lowercase English letters

    Returns:
        Count of residue prefixes
    """
    # Frequency array for 26 lowercase letters
    # Index 0 for 'a', 1 for 'b', ..., 25 for 'z'
    freq = [0] * 26

    distinct_count = 0  # Track number of distinct characters seen so far
    result = 0          # Count of residue prefixes

    # Iterate through each character in the string
    for i, char in enumerate(s):
        # Convert character to index (0-25)
        idx = ord(char) - ord('a')

        # Check if this character is new (frequency is 0)
        if freq[idx] == 0:
            distinct_count += 1

        # Update frequency for this character
        freq[idx] += 1

        # Calculate prefix length (i is 0-based, so length = i + 1)
        prefix_length = i + 1

        # Check if distinct_count equals length % 3
        if distinct_count == (prefix_length % 3):
            result += 1

    return result
```

```javascript
// Time: O(n) | Space: O(1) - fixed size array of 26
/**
 * Counts the number of prefixes where distinct character count equals length % 3.
 * @param {string} s - Input string consisting of lowercase English letters
 * @return {number} Count of residue prefixes
 */
function countResiduePrefixes(s) {
  // Frequency array for 26 lowercase letters
  // Index 0 for 'a', 1 for 'b', ..., 25 for 'z'
  const freq = new Array(26).fill(0);

  let distinctCount = 0; // Track number of distinct characters seen so far
  let result = 0; // Count of residue prefixes

  // Iterate through each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Convert character to index (0-25)
    const idx = char.charCodeAt(0) - "a".charCodeAt(0);

    // Check if this character is new (frequency is 0)
    if (freq[idx] === 0) {
      distinctCount++;
    }

    // Update frequency for this character
    freq[idx]++;

    // Calculate prefix length (i is 0-based, so length = i + 1)
    const prefixLength = i + 1;

    // Check if distinctCount equals length % 3
    if (distinctCount === prefixLength % 3) {
      result++;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) - fixed size array of 26
class Solution {
    /**
     * Counts the number of prefixes where distinct character count equals length % 3.
     * @param s Input string consisting of lowercase English letters
     * @return Count of residue prefixes
     */
    public int countResiduePrefixes(String s) {
        // Frequency array for 26 lowercase letters
        // Index 0 for 'a', 1 for 'b', ..., 25 for 'z'
        int[] freq = new int[26];

        int distinctCount = 0;  // Track number of distinct characters seen so far
        int result = 0;         // Count of residue prefixes

        // Iterate through each character in the string
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            // Convert character to index (0-25)
            int idx = c - 'a';

            // Check if this character is new (frequency is 0)
            if (freq[idx] == 0) {
                distinctCount++;
            }

            // Update frequency for this character
            freq[idx]++;

            // Calculate prefix length (i is 0-based, so length = i + 1)
            int prefixLength = i + 1;

            // Check if distinctCount equals length % 3
            if (distinctCount == (prefixLength % 3)) {
                result++;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing O(1) operations for each character
- Operations include: array access, integer arithmetic, and comparisons
- The loop runs exactly `n` times where `n` is the length of the string

**Space Complexity: O(1)**

- We use a fixed-size array of 26 integers regardless of input size
- A few integer variables for counting (`distinct_count`, `result`, loop index)
- No additional data structures that grow with input size

This is optimal since we must examine each character at least once to determine if prefixes are residue prefixes.

## Common Mistakes

1. **Off-by-one errors with prefix length:**
   - Using `i` instead of `i + 1` for prefix length (remember: `i` is 0-based index)
   - Fix: Always calculate `prefix_length = i + 1` when iterating with 0-based indices

2. **Incorrect distinct character tracking:**
   - Incrementing `distinct_count` every time instead of only when frequency is 0
   - Forgetting to check frequency BEFORE updating it for the current character
   - Fix: Check `if freq[idx] == 0` before updating the frequency

3. **Misunderstanding the modulo operation:**
   - Calculating `distinct_count % 3` instead of `prefix_length % 3`
   - Not handling the case where `prefix_length % 3` equals 0 correctly
   - Fix: Remember we're comparing `distinct_count == (prefix_length % 3)`

4. **Inefficient data structures:**
   - Using a hash set for each prefix (O(n²) time)
   - Using a full hash map when a simple array suffices (extra overhead)
   - Fix: Use a fixed-size array since we know the alphabet is lowercase letters only

## When You'll See This Pattern

This problem combines two common patterns:

1. **Prefix/suffix accumulation:** Problems where you need to compute something for all prefixes/suffixes of a string or array. Similar problems include:
   - **LeetCode 238: Product of Array Except Self** - Uses prefix and suffix products
   - **LeetCode 560: Subarray Sum Equals K** - Uses prefix sums to find subarrays
   - **LeetCode 724: Find Pivot Index** - Compares prefix and suffix sums

2. **Character frequency tracking:** Problems that require counting character frequencies as you traverse a string. Similar problems include:
   - **LeetCode 3: Longest Substring Without Repeating Characters** - Tracks character frequencies in a sliding window
   - **LeetCode 76: Minimum Window Substring** - Uses frequency maps to track character requirements
   - **LeetCode 424: Longest Repeating Character Replacement** - Maintains character counts in a sliding window

The combination of these patterns makes this problem excellent practice for more complex string manipulation challenges.

## Key Takeaways

1. **Incremental updates beat recalculation:** When processing prefixes (or suffixes), maintain state as you go rather than recalculating from scratch for each position. This often turns O(n²) solutions into O(n).

2. **Fixed arrays for known alphabets:** When dealing with lowercase/uppercase English letters, a simple array of size 26/52 is more efficient than a hash map and has O(1) access time.

3. **Careful with 0-based vs 1-based indices:** String/array problems frequently involve off-by-one errors. Be explicit about when you're working with indices (0-based) versus lengths/counts (1-based).

[Practice this problem on CodeJeet](/problem/count-residue-prefixes)
