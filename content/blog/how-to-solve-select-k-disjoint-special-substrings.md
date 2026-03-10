---
title: "How to Solve Select K Disjoint Special Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Select K Disjoint Special Substrings. Medium difficulty, 19.1% acceptance rate. Topics: Hash Table, String, Dynamic Programming, Greedy, Sorting."
date: "2026-04-28"
category: "dsa-patterns"
tags:
  ["select-k-disjoint-special-substrings", "hash-table", "string", "dynamic-programming", "medium"]
---

# How to Solve Select K Disjoint Special Substrings

This problem asks whether we can select `k` disjoint substrings from a string `s` where each substring is "special" — meaning any character inside it doesn't appear anywhere else in the string. The challenge lies in efficiently identifying valid substrings and determining if we can find `k` of them without overlap. What makes this interesting is that the special substring condition creates natural boundaries in the string that we can exploit.

## Visual Walkthrough

Let's trace through an example: `s = "abacaba"`, `k = 3`

**Step 1: Understanding the special substring condition**
A character in a special substring cannot appear outside that substring. This means:

- The first and last occurrence of each character in the substring must be within the substring
- No character in the substring can appear before or after the substring

**Step 2: Finding candidate substrings**
Let's examine the string character by character:

1. Starting at index 0 ('a'):
   - 'a' appears at indices 0, 2, 4, 6
   - To include 'a', our substring must cover ALL 'a' positions (0-6)
   - This gives us substring "abacaba" (indices 0-6)

2. Starting at index 1 ('b'):
   - 'b' appears at indices 1, 3, 5
   - Must cover indices 1-5
   - This gives "bacab" (indices 1-5)

3. Starting at index 2 ('a'): Already covered by first substring

4. Starting at index 3 ('c'):
   - 'c' appears only at index 3
   - Can form substring "c" (index 3 only)

**Step 3: Checking disjoint selections**
We need 3 disjoint special substrings. Possible selections:

- Option 1: "abacaba" (0-6) covers everything → only 1 substring
- Option 2: "bacab" (1-5) leaves 'a' at 0 and 6 outside → invalid because 'a' appears both inside and outside
- Option 3: "c" (3) plus what? We need two more...

Actually, let's think differently. The key insight: special substrings are determined by the first character's last occurrence. For `s = "abacaba"`:

- Start at 0 ('a'), last 'a' at 6 → substring 0-6
- Start at 1 ('b'), last 'b' at 5 → substring 1-5
- Start at 2 ('a'), already in first substring
- Start at 3 ('c'), last 'c' at 3 → substring 3-3
- Start at 4 ('a'), already in first substring
- Start at 5 ('b'), already in second substring
- Start at 6 ('a'), already in first substring

We can select: "c" (3-3) and... but we need disjoint substrings that don't overlap. The first substring (0-6) covers everything, so we can't select anything else with it.

Let's try a simpler example: `s = "abcabc"`, `k = 2`

- Start at 0 ('a'), last 'a' at 3 → substring 0-3 ("abca")
- Start at 1 ('b'), last 'b' at 4 → substring 1-4 ("bcab")
- Start at 2 ('c'), last 'c' at 5 → substring 2-5 ("cabc")
- Start at 3 ('a'), already covered
- Start at 4 ('b'), already covered
- Start at 5 ('c'), already covered

We can select "abca" (0-3) and "cabc" (2-5)? No, they overlap at indices 2-3.
We can select "abca" (0-3) only → 1 substring
We can select "bcab" (1-4) only → 1 substring
We can select "cabc" (2-5) only → 1 substring

So for `"abcabc"`, `k=2` should return `false`.

## Brute Force Approach

A naive approach would be:

1. Generate all possible substrings (O(n²) of them)
2. For each substring, check if it's special (O(n) per check)
3. Try all combinations of k disjoint substrings (exponential)

This is clearly infeasible for any reasonable n. Even checking all O(n²) substrings and testing each in O(n) time gives O(n³), which is too slow for n up to 10⁵.

What candidates might try:

- Generate all substrings and filter special ones, then try to select k disjoint ones
- Use backtracking to try different combinations
- These approaches explode combinatorially and fail on larger inputs

The brute force teaches us we need a smarter way to identify special substrings without checking all possibilities.

## Optimized Approach

The key insight: **Special substrings are determined by their starting position and the last occurrence of the starting character.**

For a substring starting at index `i` with character `c`:

1. Find the last occurrence of `c` in the string (call it `last_c`)
2. The substring must extend at least to `last_c` to include all occurrences of `c`
3. But wait — what if there are other characters between `i` and `last_c` that have occurrences beyond `last_c`? Then we need to extend further!

This leads to the algorithm:

1. Precompute the last occurrence index for each character
2. Iterate through the string
3. For each position `i`, find the right boundary of a potential special substring starting at `i`:
   - Start with `end = last[s[i]]`
   - Expand `end` to include last occurrences of all characters in current range
   - Continue until no new characters need to be included
4. If we find a valid special substring (where all characters' last occurrences are within the substring), count it and jump past it
5. Repeat to find disjoint substrings

Actually, there's an even cleaner greedy approach:

- The string naturally breaks into special substrings at certain boundaries
- We can find these boundaries by tracking the maximum last occurrence as we scan
- When `i == current_max_last`, we've found the end of a special substring

## Optimal Solution

The optimal solution uses a greedy approach with last occurrence tracking:

1. First, compute the last occurrence index for each character in the string
2. Initialize `count = 0` (number of special substrings found) and `end = 0` (current substring end)
3. Scan through the string:
   - For each character, update `end = max(end, last[char])`
   - When `i == end`, we've found a complete special substring
   - Increment count and continue
4. Check if `count >= k`

Why this works: When we reach `i == end`, it means all characters from the start of the current substring to `i` have their last occurrences within this range. This satisfies the special substring condition.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) since alphabet size is constant (26 for lowercase letters)
def canSelectKDisjointSpecialSubstrings(s: str, k: int) -> bool:
    """
    Determines if we can select k disjoint special substrings from s.

    A special substring has the property that any character inside it
    does not appear outside it in the string.

    Args:
        s: Input string
        k: Number of disjoint special substrings needed

    Returns:
        True if k disjoint special substrings can be selected, False otherwise
    """
    n = len(s)

    # Step 1: Find last occurrence index for each character
    # We assume lowercase English letters, but approach works for any charset
    last_occurrence = {}
    for i, char in enumerate(s):
        last_occurrence[char] = i

    # Step 2: Greedy scan to count maximum number of disjoint special substrings
    count = 0          # Number of special substrings found
    current_end = -1   # End of current potential substring
    substring_start = 0  # Start of current substring

    for i, char in enumerate(s):
        # Update the furthest end we need to reach to include all chars so far
        current_end = max(current_end, last_occurrence[char])

        # When we reach the current_end, we've completed a special substring
        if i == current_end:
            count += 1
            # Reset for next substring
            substring_start = i + 1
            current_end = -1

    # Step 3: Check if we found at least k special substrings
    return count >= k
```

```javascript
// Time: O(n) | Space: O(1) - constant space for character last occurrences
/**
 * Determines if we can select k disjoint special substrings from s.
 *
 * A special substring has the property that any character inside it
 * does not appear outside it in the string.
 *
 * @param {string} s - Input string
 * @param {number} k - Number of disjoint special substrings needed
 * @return {boolean} True if k disjoint special substrings can be selected
 */
function canSelectKDisjointSpecialSubstrings(s, k) {
  const n = s.length;

  // Step 1: Find last occurrence index for each character
  const lastOccurrence = new Map();
  for (let i = 0; i < n; i++) {
    lastOccurrence.set(s[i], i);
  }

  // Step 2: Greedy scan to count maximum number of disjoint special substrings
  let count = 0; // Number of special substrings found
  let currentEnd = -1; // End of current potential substring
  let substringStart = 0; // Start of current substring

  for (let i = 0; i < n; i++) {
    const char = s[i];

    // Update the furthest end we need to reach to include all chars so far
    currentEnd = Math.max(currentEnd, lastOccurrence.get(char));

    // When we reach the currentEnd, we've completed a special substring
    if (i === currentEnd) {
      count++;
      // Reset for next substring
      substringStart = i + 1;
      currentEnd = -1;
    }
  }

  // Step 3: Check if we found at least k special substrings
  return count >= k;
}
```

```java
// Time: O(n) | Space: O(1) - constant space for character last occurrences
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * Determines if we can select k disjoint special substrings from s.
     *
     * A special substring has the property that any character inside it
     * does not appear outside it in the string.
     *
     * @param s Input string
     * @param k Number of disjoint special substrings needed
     * @return True if k disjoint special substrings can be selected
     */
    public boolean canSelectKDisjointSpecialSubstrings(String s, int k) {
        int n = s.length();

        // Step 1: Find last occurrence index for each character
        Map<Character, Integer> lastOccurrence = new HashMap<>();
        for (int i = 0; i < n; i++) {
            lastOccurrence.put(s.charAt(i), i);
        }

        // Step 2: Greedy scan to count maximum number of disjoint special substrings
        int count = 0;           // Number of special substrings found
        int currentEnd = -1;     // End of current potential substring
        int substringStart = 0;  // Start of current substring

        for (int i = 0; i < n; i++) {
            char c = s.charAt(i);

            // Update the furthest end we need to reach to include all chars so far
            currentEnd = Math.max(currentEnd, lastOccurrence.get(c));

            // When we reach the currentEnd, we've completed a special substring
            if (i == currentEnd) {
                count++;
                // Reset for next substring
                substringStart = i + 1;
                currentEnd = -1;
            }
        }

        // Step 3: Check if we found at least k special substrings
        return count >= k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the last occurrence map: O(n) to scan the string once
- Greedy scan to count substrings: O(n) to scan the string once
- Total: O(2n) = O(n)

**Space Complexity: O(1)** for the character set

- The last occurrence map stores at most 26 entries for lowercase English letters
- If the character set is larger (e.g., Unicode), it's O(m) where m is the size of the character set in the input
- In practice for coding interviews, we usually consider this O(1) since alphabet size is constant

## Common Mistakes

1. **Not handling overlapping substrings correctly**: Candidates might find all special substrings but then struggle to select disjoint ones. The greedy approach naturally finds the maximum number of disjoint substrings.

2. **Incorrect boundary condition**: Forgetting to reset `currentEnd` after finding a substring. This causes the algorithm to merge multiple potential substrings into one.

3. **Off-by-one errors in substring boundaries**: When `i == currentEnd`, the substring ends at index `i`, not `i-1`. The next substring starts at `i+1`.

4. **Assuming we need to actually return the substrings**: The problem only asks whether it's possible, not to find the actual substrings. Some candidates waste time constructing substring lists.

5. **Not considering all characters in current range**: A common mistake is to only track the last occurrence of the starting character, but we must consider all characters in the current potential substring range.

## When You'll See This Pattern

This problem uses the **"partition labels"** pattern, similar to LeetCode 763. The core idea is to find natural partition points in a sequence based on some property (like last occurrences).

Related problems:

1. **LeetCode 763: Partition Labels** - Almost identical! Find the maximum size of partitions where each letter appears in at most one partition.
2. **LeetCode 56: Merge Intervals** - Similar interval merging logic, though applied differently.
3. **LeetCode 435: Non-overlapping Intervals** - Finding maximum non-overlapping intervals uses similar greedy thinking.
4. **LeetCode 921: Minimum Add to Make Parentheses Valid** - Different problem but uses similar scanning with balance tracking.

The pattern appears whenever you need to partition a sequence based on some constraint that involves looking ahead (like last occurrences) or maintaining balance (like parentheses).

## Key Takeaways

1. **Greedy with last occurrence tracking** is powerful for partition problems. When you need to ensure all occurrences of elements are within the same partition, track the last occurrence and expand boundaries as needed.

2. **The scan-and-mark-boundary technique** works well for problems where decisions depend on future elements. By precomputing last occurrences, we can make greedy decisions during a single scan.

3. **For "disjoint" selection problems**, often the maximum number of disjoint valid segments is what matters. Finding this maximum greedily (by taking the earliest possible valid segment) usually works.

4. **Recognize when you only need existence, not construction**. Many problems ask "is it possible" rather than "give me all solutions" — this often allows simpler greedy approaches.

Related problems: [Find Longest Self-Contained Substring](/problem/find-longest-self-contained-substring)
