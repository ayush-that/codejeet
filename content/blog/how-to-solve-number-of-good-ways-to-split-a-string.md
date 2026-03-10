---
title: "How to Solve Number of Good Ways to Split a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Good Ways to Split a String. Medium difficulty, 68.4% acceptance rate. Topics: Hash Table, String, Dynamic Programming, Bit Manipulation."
date: "2027-01-25"
category: "dsa-patterns"
tags:
  ["number-of-good-ways-to-split-a-string", "hash-table", "string", "dynamic-programming", "medium"]
---

# How to Solve Number of Good Ways to Split a String

This problem asks us to count how many ways we can split a string into two non-empty parts where both parts have the same number of distinct characters. What makes this problem interesting is that we need to track character frequencies dynamically as we move the split point, requiring careful state management to avoid O(n²) complexity.

## Visual Walkthrough

Let's trace through an example: `s = "aacaba"`

We need to check every possible split position (between characters):

**Split after index 0:** `"a" | "acaba"`

- Left distinct: {"a"} → 1 distinct
- Right distinct: {"a","c","b"} → 3 distinct
- Not a good split (1 ≠ 3)

**Split after index 1:** `"aa" | "caba"`

- Left distinct: {"a"} → 1 distinct
- Right distinct: {"c","a","b"} → 3 distinct
- Not a good split (1 ≠ 3)

**Split after index 2:** `"aac" | "aba"`

- Left distinct: {"a","c"} → 2 distinct
- Right distinct: {"a","b"} → 2 distinct
- **GOOD SPLIT** (2 = 2)

**Split after index 3:** `"aaca" | "ba"`

- Left distinct: {"a","c"} → 2 distinct
- Right distinct: {"b","a"} → 2 distinct
- **GOOD SPLIT** (2 = 2)

**Split after index 4:** `"aacab" | "a"`

- Left distinct: {"a","c","b"} → 3 distinct
- Right distinct: {"a"} → 1 distinct
- Not a good split (3 ≠ 1)

Total good splits: 2

The key insight: as we move the split point from left to right, we're moving one character at a time from the right side to the left side. We need to efficiently track how many distinct characters are on each side at every position.

## Brute Force Approach

The most straightforward approach is to check every possible split position:

1. For each split position i (from 1 to n-1, where n is string length)
2. Take the left substring s[0:i] and right substring s[i:n]
3. Count distinct characters in each substring using a set
4. If counts are equal, increment result

This approach has O(n²) time complexity because for each of O(n) split positions, we need to scan both substrings (O(n) each) to count distinct characters. For a string of length 10⁵ (typical constraint), this would be 10¹⁰ operations - far too slow.

## Optimized Approach

The key optimization is to precompute character frequencies and track them dynamically:

1. **Precompute right side frequencies**: Start with all characters on the right side. Count frequencies of each character in the entire string.

2. **Initialize left side frequencies**: Start with empty left side (all frequencies = 0).

3. **Slide the split point**: For each character we move from right to left:
   - Add the character to left side frequencies
   - Remove it from right side frequencies
   - Check if left distinct count = right distinct count

4. **Efficient distinct counting**: Instead of scanning all characters each time, maintain:
   - `leftDistinct`: number of characters with count > 0 on left side
   - `rightDistinct`: number of characters with count > 0 on right side

   When we add a character to left:
   - If its left count was 0, `leftDistinct++`
   - If its right count becomes 0, `rightDistinct--`

This gives us O(1) updates at each split position, leading to O(n) total time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - since we only store 26 character frequencies
def numSplits(s: str) -> int:
    # Step 1: Initialize frequency arrays for left and right sides
    # We use arrays of size 26 since we only have lowercase letters
    left_count = [0] * 26
    right_count = [0] * 26

    # Step 2: Precompute right side frequencies
    # Count all characters initially on the right side
    for char in s:
        right_count[ord(char) - ord('a')] += 1

    # Step 3: Initialize distinct character counters
    left_distinct = 0
    right_distinct = sum(1 for count in right_count if count > 0)

    # Step 4: Initialize result counter
    good_splits = 0

    # Step 5: Slide the split point from left to right
    # We stop at len(s)-1 because we need both sides non-empty
    for i in range(len(s) - 1):
        char_index = ord(s[i]) - ord('a')

        # Move current character from right to left
        # Update left side
        left_count[char_index] += 1
        if left_count[char_index] == 1:  # Was 0, now has 1 character
            left_distinct += 1

        # Update right side
        right_count[char_index] -= 1
        if right_count[char_index] == 0:  # Was 1, now has 0 characters
            right_distinct -= 1

        # Check if this is a good split
        if left_distinct == right_distinct:
            good_splits += 1

    return good_splits
```

```javascript
// Time: O(n) | Space: O(1) - 26 character frequencies
function numSplits(s) {
  // Step 1: Initialize frequency arrays for left and right sides
  const leftCount = new Array(26).fill(0);
  const rightCount = new Array(26).fill(0);

  // Step 2: Precompute right side frequencies
  for (let i = 0; i < s.length; i++) {
    const charIndex = s.charCodeAt(i) - 97; // 'a' = 97
    rightCount[charIndex]++;
  }

  // Step 3: Initialize distinct character counters
  let leftDistinct = 0;
  let rightDistinct = rightCount.filter((count) => count > 0).length;

  // Step 4: Initialize result counter
  let goodSplits = 0;

  // Step 5: Slide the split point from left to right
  // Stop at s.length - 1 to keep both sides non-empty
  for (let i = 0; i < s.length - 1; i++) {
    const charIndex = s.charCodeAt(i) - 97;

    // Move current character from right to left
    // Update left side
    leftCount[charIndex]++;
    if (leftCount[charIndex] === 1) {
      // Was 0, now has 1 character
      leftDistinct++;
    }

    // Update right side
    rightCount[charIndex]--;
    if (rightCount[charIndex] === 0) {
      // Was 1, now has 0 characters
      rightDistinct--;
    }

    // Check if this is a good split
    if (leftDistinct === rightDistinct) {
      goodSplits++;
    }
  }

  return goodSplits;
}
```

```java
// Time: O(n) | Space: O(1) - 26 character frequencies
class Solution {
    public int numSplits(String s) {
        // Step 1: Initialize frequency arrays for left and right sides
        int[] leftCount = new int[26];
        int[] rightCount = new int[26];

        // Step 2: Precompute right side frequencies
        for (int i = 0; i < s.length(); i++) {
            int charIndex = s.charAt(i) - 'a';
            rightCount[charIndex]++;
        }

        // Step 3: Initialize distinct character counters
        int leftDistinct = 0;
        int rightDistinct = 0;
        for (int count : rightCount) {
            if (count > 0) {
                rightDistinct++;
            }
        }

        // Step 4: Initialize result counter
        int goodSplits = 0;

        // Step 5: Slide the split point from left to right
        // Stop at s.length() - 1 to keep both sides non-empty
        for (int i = 0; i < s.length() - 1; i++) {
            int charIndex = s.charAt(i) - 'a';

            // Move current character from right to left
            // Update left side
            leftCount[charIndex]++;
            if (leftCount[charIndex] == 1) { // Was 0, now has 1 character
                leftDistinct++;
            }

            // Update right side
            rightCount[charIndex]--;
            if (rightCount[charIndex] == 0) { // Was 1, now has 0 characters
                rightDistinct--;
            }

            // Check if this is a good split
            if (leftDistinct == rightDistinct) {
                goodSplits++;
            }
        }

        return goodSplits;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass to initialize the right frequency array: O(n)
- We make another pass to slide the split point: O(n)
- Each character operation (updating counts and checking distinct counts) is O(1)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We use two fixed-size arrays of length 26 (for lowercase English letters)
- We use a few integer variables for counters
- Total space is constant regardless of input size: O(1)

If the character set were larger (e.g., Unicode), we could use hash maps instead of arrays, which would give us O(n) space complexity in the worst case.

## Common Mistakes

1. **Off-by-one errors in loop boundaries**: The split must leave both sides non-empty, so we can only split between indices 1 and n-1. A common mistake is to iterate up to `len(s)` instead of `len(s)-1`.

2. **Inefficient distinct counting**: Some candidates recalculate distinct counts by scanning all 26 characters at each split point. While this is still O(1) per split (since 26 is constant), it's less efficient than maintaining running counts.

3. **Forgetting to handle character removal from right side**: When moving a character from right to left, you must decrement its right count. Forgetting this leads to incorrect rightDistinct counts.

4. **Using sets instead of frequency arrays**: While sets work, they're less efficient for this specific problem because we need to know when a character count reaches 0 (to decrement distinct count). With sets, we'd need to check the actual count in a map anyway.

## When You'll See This Pattern

This "two-pointer frequency tracking" pattern appears in problems where you need to compare two partitions of data:

1. **Find All Anagrams in a String (LeetCode 438)**: Similar sliding window with frequency tracking, but comparing entire frequency arrays.

2. **Permutation in String (LeetCode 567)**: Another sliding window problem comparing character frequencies between two strings.

3. **Longest Substring Without Repeating Characters (LeetCode 3)**: Uses frequency tracking to maintain a window with unique characters.

4. **Subarrays with K Different Integers (LeetCode 992)**: More advanced version tracking exactly K distinct characters in subarrays.

The core technique is maintaining running counts/state as you slide a boundary through the data, avoiding redundant computations.

## Key Takeaways

1. **When you need to compare partitions**, consider maintaining running statistics for both sides as you move the boundary point. This often turns O(n²) solutions into O(n).

2. **For character frequency problems with limited alphabet**, arrays are more efficient than hash maps. For 26 lowercase letters, arrays provide O(1) access with less overhead.

3. **The "move and update" pattern** is powerful: when moving an element from one side to another, update both sides' statistics in O(1) time by checking boundary conditions (count becoming 0 or 1).

[Practice this problem on CodeJeet](/problem/number-of-good-ways-to-split-a-string)
