---
title: "How to Solve Permutation in String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Permutation in String. Medium difficulty, 48.5% acceptance rate. Topics: Hash Table, Two Pointers, String, Sliding Window."
date: "2026-07-24"
category: "dsa-patterns"
tags: ["permutation-in-string", "hash-table", "two-pointers", "string", "medium"]
---

# How to Solve Permutation in String

This problem asks whether string `s2` contains any permutation of string `s1` as a contiguous substring. What makes this problem interesting is that we're not just looking for an exact substring match—we need to find any arrangement of `s1`'s characters in `s2`. This is essentially the "anagram substring" problem, and it's a classic application of the sliding window technique with frequency counting.

## Visual Walkthrough

Let's trace through an example: `s1 = "ab"`, `s2 = "eidbaooo"`

We need to check if any permutation of "ab" (which could be "ab" or "ba") appears in `s2`.

**Step 1: Count character frequencies in s1**

- 'a': 1
- 'b': 1

**Step 2: Initialize a sliding window of size 2 (length of s1) over s2**
We'll maintain a frequency count of characters in our current window.

**Window 1: "ei"**

- Window count: 'e':1, 'i':1
- Compare with s1 count: Doesn't match (different characters)

**Window 2: "id"**

- Window count: 'i':1, 'd':1
- Doesn't match

**Window 3: "db"**

- Window count: 'd':1, 'b':1
- Doesn't match (missing 'a')

**Window 4: "ba"**

- Window count: 'b':1, 'a':1
- ✅ Matches s1 count exactly! Both have one 'a' and one 'b'
- We found a permutation ("ba") at index 3

The key insight: instead of generating all permutations of s1 (which would be O(n!)), we can compare character frequency counts using a sliding window.

## Brute Force Approach

A naive approach would be:

1. Generate all permutations of `s1` (there are n! of them)
2. For each permutation, check if it exists as a substring in `s2` using string search

This is catastrophically inefficient. For a string of length n, there are n! permutations. Even for n=10, that's 3.6 million permutations to generate and check. The string search itself would be O(m) for each permutation, giving us O(n! × m) time complexity.

A slightly better but still inefficient brute force would be:

1. For each starting index i in `s2` where i + len(s1) ≤ len(s2)
2. Extract substring s2[i:i+len(s1)]
3. Sort both the substring and s1
4. Compare if they're equal

This would be O(m × n log n) where m is length of s2 and n is length of s1. For large strings, this is still too slow.

<div class="code-group">

```python
# Time: O(m × n log n) | Space: O(n)
def checkInclusion_brute(s1: str, s2: str) -> bool:
    n, m = len(s1), len(s2)
    sorted_s1 = sorted(s1)  # O(n log n)

    # Check each possible window in s2
    for i in range(m - n + 1):  # O(m) iterations
        # Extract and sort current window
        window = s2[i:i+n]
        sorted_window = sorted(window)  # O(n log n)

        # Compare sorted strings
        if sorted_window == sorted_s1:
            return True

    return False
```

```javascript
// Time: O(m × n log n) | Space: O(n)
function checkInclusionBrute(s1, s2) {
  const n = s1.length,
    m = s2.length;
  const sortedS1 = s1.split("").sort().join(""); // O(n log n)

  // Check each possible window in s2
  for (let i = 0; i <= m - n; i++) {
    // O(m) iterations
    // Extract and sort current window
    const window = s2.substring(i, i + n);
    const sortedWindow = window.split("").sort().join(""); // O(n log n)

    // Compare sorted strings
    if (sortedWindow === sortedS1) {
      return true;
    }
  }

  return false;
}
```

```java
// Time: O(m × n log n) | Space: O(n)
public boolean checkInclusionBrute(String s1, String s2) {
    int n = s1.length(), m = s2.length();
    char[] s1Arr = s1.toCharArray();
    Arrays.sort(s1Arr);  // O(n log n)
    String sortedS1 = new String(s1Arr);

    // Check each possible window in s2
    for (int i = 0; i <= m - n; i++) {  // O(m) iterations
        // Extract and sort current window
        char[] windowArr = s2.substring(i, i + n).toCharArray();
        Arrays.sort(windowArr);  // O(n log n)
        String sortedWindow = new String(windowArr);

        // Compare sorted strings
        if (sortedWindow.equals(sortedS1)) {
            return true;
        }
    }

    return false;
}
```

</div>

## Optimized Approach

The key insight is that two strings are permutations of each other if and only if they have identical character frequency counts. Instead of sorting each window (O(n log n)), we can maintain a frequency array or hash map and update it in O(1) time as we slide the window.

**Sliding Window with Frequency Counting:**

1. Create frequency counts for `s1` and for the first window of `s2` (first n characters)
2. Compare the two frequency arrays - if they match, we found a permutation
3. Slide the window one position to the right:
   - Decrease count for the character leaving the window
   - Increase count for the character entering the window
4. Repeat until we find a match or reach the end of `s2`

**Optimization:** Instead of comparing full frequency arrays each time (O(26) = O(1) but still 26 operations), we can maintain a `matches` counter that tracks how many characters have matching frequencies between the two arrays. When `matches == 26`, we have a permutation.

## Optimal Solution

Here's the optimal solution using the sliding window technique with frequency arrays and a matches counter:

<div class="code-group">

```python
# Time: O(n + m) | Space: O(1) - fixed size arrays of 26 elements
def checkInclusion(s1: str, s2: str) -> bool:
    # Edge case: s1 is longer than s2
    if len(s1) > len(s2):
        return False

    # Initialize frequency arrays for 26 lowercase letters
    s1_count = [0] * 26
    s2_count = [0] * 26

    # Count frequencies for s1 and first window of s2
    for i in range(len(s1)):
        # Convert char to index (0-25) and increment count
        s1_count[ord(s1[i]) - ord('a')] += 1
        s2_count[ord(s2[i]) - ord('a')] += 1

    # Count how many characters have matching frequencies
    matches = 0
    for i in range(26):
        if s1_count[i] == s2_count[i]:
            matches += 1

    # If all 26 characters match, we found a permutation
    if matches == 26:
        return True

    # Slide the window over s2
    left = 0
    for right in range(len(s1), len(s2)):
        # Character entering the window (at position 'right')
        index = ord(s2[right]) - ord('a')
        s2_count[index] += 1

        # Update matches based on the new count
        if s2_count[index] == s1_count[index]:
            matches += 1
        elif s2_count[index] == s1_count[index] + 1:
            # Was equal, now became unequal
            matches -= 1

        # Character leaving the window (at position 'left')
        index = ord(s2[left]) - ord('a')
        s2_count[index] -= 1

        # Update matches based on the removed character
        if s2_count[index] == s1_count[index]:
            matches += 1
        elif s2_count[index] == s1_count[index] - 1:
            # Was equal, now became unequal
            matches -= 1

        left += 1

        # Check if we have a permutation
        if matches == 26:
            return True

    return False
```

```javascript
// Time: O(n + m) | Space: O(1) - fixed size arrays of 26 elements
function checkInclusion(s1, s2) {
  // Edge case: s1 is longer than s2
  if (s1.length > s2.length) return false;

  // Initialize frequency arrays for 26 lowercase letters
  const s1Count = new Array(26).fill(0);
  const s2Count = new Array(26).fill(0);

  // Count frequencies for s1 and first window of s2
  for (let i = 0; i < s1.length; i++) {
    // Convert char to index (0-25) and increment count
    s1Count[s1.charCodeAt(i) - 97]++; // 97 is 'a'.charCodeAt(0)
    s2Count[s2.charCodeAt(i) - 97]++;
  }

  // Count how many characters have matching frequencies
  let matches = 0;
  for (let i = 0; i < 26; i++) {
    if (s1Count[i] === s2Count[i]) {
      matches++;
    }
  }

  // If all 26 characters match, we found a permutation
  if (matches === 26) return true;

  // Slide the window over s2
  let left = 0;
  for (let right = s1.length; right < s2.length; right++) {
    // Character entering the window (at position 'right')
    let index = s2.charCodeAt(right) - 97;
    s2Count[index]++;

    // Update matches based on the new count
    if (s2Count[index] === s1Count[index]) {
      matches++;
    } else if (s2Count[index] === s1Count[index] + 1) {
      // Was equal, now became unequal
      matches--;
    }

    // Character leaving the window (at position 'left')
    index = s2.charCodeAt(left) - 97;
    s2Count[index]--;

    // Update matches based on the removed character
    if (s2Count[index] === s1Count[index]) {
      matches++;
    } else if (s2Count[index] === s1Count[index] - 1) {
      // Was equal, now became unequal
      matches--;
    }

    left++;

    // Check if we have a permutation
    if (matches === 26) return true;
  }

  return false;
}
```

```java
// Time: O(n + m) | Space: O(1) - fixed size arrays of 26 elements
public boolean checkInclusion(String s1, String s2) {
    // Edge case: s1 is longer than s2
    if (s1.length() > s2.length()) return false;

    // Initialize frequency arrays for 26 lowercase letters
    int[] s1Count = new int[26];
    int[] s2Count = new int[26];

    // Count frequencies for s1 and first window of s2
    for (int i = 0; i < s1.length(); i++) {
        // Convert char to index (0-25) and increment count
        s1Count[s1.charAt(i) - 'a']++;
        s2Count[s2.charAt(i) - 'a']++;
    }

    // Count how many characters have matching frequencies
    int matches = 0;
    for (int i = 0; i < 26; i++) {
        if (s1Count[i] == s2Count[i]) {
            matches++;
        }
    }

    // If all 26 characters match, we found a permutation
    if (matches == 26) return true;

    // Slide the window over s2
    int left = 0;
    for (int right = s1.length(); right < s2.length(); right++) {
        // Character entering the window (at position 'right')
        int index = s2.charAt(right) - 'a';
        s2Count[index]++;

        // Update matches based on the new count
        if (s2Count[index] == s1Count[index]) {
            matches++;
        } else if (s2Count[index] == s1Count[index] + 1) {
            // Was equal, now became unequal
            matches--;
        }

        // Character leaving the window (at position 'left')
        index = s2.charAt(left) - 'a';
        s2Count[index]--;

        // Update matches based on the removed character
        if (s2Count[index] == s1Count[index]) {
            matches++;
        } else if (s2Count[index] == s1Count[index] - 1) {
            // Was equal, now became unequal
            matches--;
        }

        left++;

        // Check if we have a permutation
        if (matches == 26) return true;
    }

    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building initial frequency counts: O(n) for s1 and first window of s2
- Initial matches calculation: O(26) = O(1)
- Sliding window: O(m - n) iterations, each doing O(1) operations
- Total: O(n + m)

**Space Complexity: O(1)**

- We use fixed-size arrays of length 26 (for lowercase English letters)
- No additional space that grows with input size

## Common Mistakes

1. **Forgetting the edge case where s1 is longer than s2**: If `len(s1) > len(s2)`, we should immediately return false since s2 can't contain a substring of length greater than itself.

2. **Off-by-one errors in window boundaries**: When sliding the window, it's easy to mess up the indices for characters entering and leaving. Remember: the character at position `right` enters the window, and the character at position `left` leaves it.

3. **Incorrect matches counter updates**: The trickiest part is updating the `matches` counter correctly. You need to check:
   - If counts become equal after an update → increment matches
   - If counts become unequal after being equal → decrement matches
   - If counts were already unequal and remain unequal → no change

4. **Using hash maps instead of fixed arrays**: While hash maps work, fixed arrays are more efficient for this problem since we know we're dealing with lowercase English letters (26 possibilities). Arrays have O(1) access and avoid hash collisions.

## When You'll See This Pattern

The sliding window with frequency counting pattern appears in many substring search problems:

1. **Find All Anagrams in a String (LeetCode 438)**: Almost identical to this problem, but instead of returning true/false, you return all starting indices of anagrams.

2. **Minimum Window Substring (LeetCode 76)**: A harder variation where you need to find the minimum length substring containing all characters of another string (not necessarily as an exact permutation).

3. **Longest Substring Without Repeating Characters (LeetCode 3)**: Uses a similar sliding window approach but tracks character presence rather than counts.

4. **Substring with Concatenation of All Words (LeetCode 30)**: A more complex version where you're looking for concatenations of words rather than character permutations.

## Key Takeaways

1. **When comparing permutations or anagrams, think in terms of character frequency counts** rather than exact string matching. Two strings are permutations if their character frequency distributions are identical.

2. **Sliding window is optimal for contiguous substring problems** where you need to check many overlapping windows. Updating frequency counts incrementally (O(1)) is much faster than recomputing from scratch (O(n)).

3. **For fixed character sets (like lowercase English letters), prefer arrays over hash maps** for frequency counting. Arrays offer guaranteed O(1) access and avoid hash collisions.

Related problems: [Minimum Window Substring](/problem/minimum-window-substring), [Find All Anagrams in a String](/problem/find-all-anagrams-in-a-string)
