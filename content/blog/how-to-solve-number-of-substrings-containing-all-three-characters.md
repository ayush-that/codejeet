---
title: "How to Solve Number of Substrings Containing All Three Characters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Substrings Containing All Three Characters. Medium difficulty, 73.5% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2027-07-03"
category: "dsa-patterns"
tags:
  [
    "number-of-substrings-containing-all-three-characters",
    "hash-table",
    "string",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Number of Substrings Containing All Three Characters

This problem asks us to count all substrings of a given string `s` (containing only 'a', 'b', and 'c') that include at least one of each character. The challenge lies in counting efficiently—a brute force check of all substrings would be O(n³), which is far too slow for strings up to length 5×10⁴. The key insight is that once we find a valid substring, all extensions of it to the right are also valid, allowing us to count in O(n) time.

## Visual Walkthrough

Let's trace through `s = "abcabc"` step by step to build intuition:

We'll maintain a sliding window and count valid substrings efficiently:

**Step 1:** Start with left = 0, right = 0

- Window: "a" → counts: {'a':1} → not valid (missing 'b','c')

**Step 2:** Expand right to 1

- Window: "ab" → counts: {'a':1, 'b':1} → not valid (missing 'c')

**Step 3:** Expand right to 2

- Window: "abc" → counts: {'a':1, 'b':1, 'c':1} → VALID!
- All substrings starting at left=0 and ending at right=2 or beyond are valid
- Count: 1 (substring "abc" ending at index 2)
- Actually, better approach: For this valid window starting at left=0, all substrings ending at index 2, 3, 4, 5 are valid
- That's 4 substrings: "abc", "abca", "abcab", "abcabc"

**Step 4:** Move left to 1

- Window: "bc" → counts: {'b':1, 'c':1} → not valid (missing 'a')
- Expand right to 3
- Window: "bca" → counts: {'b':1, 'c':1, 'a':1} → VALID!
- All substrings starting at left=1 and ending at index 3 or beyond are valid
- That's 3 substrings: "bca", "bcab", "bcabc"

**Step 5:** Move left to 2

- Window: "ca" → counts: {'c':1, 'a':1} → not valid (missing 'b')
- Expand right to 4
- Window: "cab" → counts: {'c':1, 'a':1, 'b':1} → VALID!
- That's 2 substrings: "cab", "cabc"

**Step 6:** Move left to 3

- Window: "ab" → counts: {'a':1, 'b':1} → not valid (missing 'c')
- Expand right to 5
- Window: "abc" → counts: {'a':1, 'b':1, 'c':1} → VALID!
- That's 1 substring: "abc"

**Total:** 4 + 3 + 2 + 1 = 10 valid substrings

The pattern: Once we have a valid window [left, right], ALL substrings starting at this `left` and ending at `right` or beyond are valid. So we can add `(n - right)` to our count and then move `left` forward.

## Brute Force Approach

The most straightforward solution is to check every possible substring:

1. Generate all substrings (O(n²) of them)
2. For each substring, check if it contains all three characters (O(n) per check)
3. Count those that satisfy the condition

This results in O(n³) time complexity, which is far too slow for n up to 50,000. Even with optimization (like early exit when all characters are found), it's still O(n³) in worst case.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def numberOfSubstrings_brute(s: str) -> int:
    n = len(s)
    count = 0

    # Generate all substrings
    for i in range(n):
        for j in range(i, n):
            # Check if substring s[i:j+1] contains all three characters
            has_a = has_b = has_c = False
            for k in range(i, j + 1):
                if s[k] == 'a':
                    has_a = True
                elif s[k] == 'b':
                    has_b = True
                else:  # s[k] == 'c'
                    has_c = True

                # Early exit if we've found all three
                if has_a and has_b and has_c:
                    count += 1
                    break

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function numberOfSubstringsBrute(s) {
  const n = s.length;
  let count = 0;

  // Generate all substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Check if substring s[i..j] contains all three characters
      let hasA = false,
        hasB = false,
        hasC = false;

      for (let k = i; k <= j; k++) {
        if (s[k] === "a") hasA = true;
        else if (s[k] === "b") hasB = true;
        else hasC = true; // s[k] === 'c'

        // Early exit if we've found all three
        if (hasA && hasB && hasC) {
          count++;
          break;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int numberOfSubstringsBrute(String s) {
    int n = s.length();
    int count = 0;

    // Generate all substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Check if substring s[i..j] contains all three characters
            boolean hasA = false, hasB = false, hasC = false;

            for (int k = i; k <= j; k++) {
                char c = s.charAt(k);
                if (c == 'a') hasA = true;
                else if (c == 'b') hasB = true;
                else hasC = true;  // c == 'c'

                // Early exit if we've found all three
                if (hasA && hasB && hasC) {
                    count++;
                    break;
                }
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to check every substring explicitly. Instead, we can use a sliding window approach:

1. Maintain a window [left, right] that expands to the right
2. Keep track of character counts in the current window
3. When the window contains all three characters, we know that:
   - The current substring s[left:right+1] is valid
   - ALL substrings starting at `left` and ending at `right` or beyond are also valid
   - So we can add `(n - right)` to our count
4. Then we try to shrink the window from the left by moving `left` forward
5. If the window still contains all three characters after shrinking, we repeat step 3
6. If not, we expand the window again by moving `right` forward

This works because once we find a valid window starting at position `left`, every extension of that window to the right will also be valid (since we're only adding characters, not removing required ones).

## Optimal Solution

Here's the O(n) sliding window solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numberOfSubstrings(s: str) -> int:
    n = len(s)
    count = 0
    left = 0

    # Track the last seen position of each character
    # Initialize to -1 meaning we haven't seen the character yet
    last_seen = {'a': -1, 'b': -1, 'c': -1}

    for right in range(n):
        # Update the last seen position for the current character
        last_seen[s[right]] = right

        # If we've seen all three characters at least once
        # (all last_seen values are not -1)
        if last_seen['a'] != -1 and last_seen['b'] != -1 and last_seen['c'] != -1:
            # The minimum of the last seen positions tells us the leftmost position
            # where we still have all three characters in the window ending at 'right'
            min_last_seen = min(last_seen['a'], last_seen['b'], last_seen['c'])

            # All substrings starting from 0 to min_last_seen (inclusive) and ending at 'right'
            # contain all three characters
            # Why? Because if we start at any position <= min_last_seen, our window will include
            # all three characters (since the earliest we saw the last required character was at min_last_seen)
            count += min_last_seen + 1

    return count

# Alternative sliding window approach (more intuitive for some):
def numberOfSubstrings_alt(s: str) -> int:
    n = len(s)
    count = 0
    left = 0

    # Character counts in current window
    char_count = {'a': 0, 'b': 0, 'c': 0}

    for right in range(n):
        # Add current character to window
        char_count[s[right]] += 1

        # While window contains all three characters
        while char_count['a'] > 0 and char_count['b'] > 0 and char_count['c'] > 0:
            # All substrings starting at current left and ending at right or beyond are valid
            count += n - right

            # Remove leftmost character from window
            char_count[s[left]] -= 1
            left += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function numberOfSubstrings(s) {
  const n = s.length;
  let count = 0;

  // Track the last seen position of each character
  // Initialize to -1 meaning we haven't seen the character yet
  const lastSeen = { a: -1, b: -1, c: -1 };

  for (let right = 0; right < n; right++) {
    // Update the last seen position for the current character
    lastSeen[s[right]] = right;

    // If we've seen all three characters at least once
    if (lastSeen["a"] !== -1 && lastSeen["b"] !== -1 && lastSeen["c"] !== -1) {
      // Find the minimum of the last seen positions
      const minLastSeen = Math.min(lastSeen["a"], lastSeen["b"], lastSeen["c"]);

      // All substrings starting from 0 to minLastSeen (inclusive) and ending at 'right'
      // contain all three characters
      count += minLastSeen + 1;
    }
  }

  return count;
}

// Alternative sliding window approach:
function numberOfSubstringsAlt(s) {
  const n = s.length;
  let count = 0;
  let left = 0;

  // Character counts in current window
  const charCount = { a: 0, b: 0, c: 0 };

  for (let right = 0; right < n; right++) {
    // Add current character to window
    charCount[s[right]]++;

    // While window contains all three characters
    while (charCount["a"] > 0 && charCount["b"] > 0 && charCount["c"] > 0) {
      // All substrings starting at current left and ending at right or beyond are valid
      count += n - right;

      // Remove leftmost character from window
      charCount[s[left]]--;
      left++;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public int numberOfSubstrings(String s) {
    int n = s.length();
    int count = 0;

    // Track the last seen position of each character
    // Initialize to -1 meaning we haven't seen the character yet
    int lastSeenA = -1, lastSeenB = -1, lastSeenC = -1;

    for (int right = 0; right < n; right++) {
        char c = s.charAt(right);

        // Update the last seen position for the current character
        if (c == 'a') lastSeenA = right;
        else if (c == 'b') lastSeenB = right;
        else lastSeenC = right;  // c == 'c'

        // If we've seen all three characters at least once
        if (lastSeenA != -1 && lastSeenB != -1 && lastSeenC != -1) {
            // Find the minimum of the last seen positions
            int minLastSeen = Math.min(lastSeenA, Math.min(lastSeenB, lastSeenC));

            // All substrings starting from 0 to minLastSeen (inclusive) and ending at 'right'
            // contain all three characters
            count += minLastSeen + 1;
        }
    }

    return count;
}

// Alternative sliding window approach:
public int numberOfSubstringsAlt(String s) {
    int n = s.length();
    int count = 0;
    int left = 0;

    // Character counts in current window
    int countA = 0, countB = 0, countC = 0;

    for (int right = 0; right < n; right++) {
        char c = s.charAt(right);

        // Add current character to window
        if (c == 'a') countA++;
        else if (c == 'b') countB++;
        else countC++;  // c == 'c'

        // While window contains all three characters
        while (countA > 0 && countB > 0 && countC > 0) {
            // All substrings starting at current left and ending at right or beyond are valid
            count += n - right;

            // Remove leftmost character from window
            char leftChar = s.charAt(left);
            if (leftChar == 'a') countA--;
            else if (leftChar == 'b') countB--;
            else countC--;  // leftChar == 'c'

            left++;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once with the `right` pointer (O(n))
- The `left` pointer only moves forward and never backward, so total left movements are O(n)
- Each character is processed at most twice (once when added to window, once when removed)
- In the alternative approach using last seen positions, we only make a single pass

**Space Complexity: O(1)**

- We use a fixed amount of extra space regardless of input size
- Only need to store counts or last seen positions for 3 characters
- No data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors in substring counting**: When counting valid substrings, remember that if you have a valid window [left, right], the number of valid substrings starting at `left` is `n - right`, not `n - right + 1` or `n - right - 1`. Test with small examples to verify.

2. **Forgetting to handle cases where not all characters appear**: If the string doesn't contain all three characters at all, the answer should be 0. Both solutions handle this correctly—the first by checking if all last_seen are not -1, the second by never entering the while loop if counts don't all exceed 0.

3. **Using O(n²) or O(n³) approaches**: Some candidates try to optimize the brute force by precomputing prefix sums or using other techniques but still end up with O(n²) solutions. Remember that n can be up to 50,000, so O(n²) is 2.5 billion operations—far too many.

4. **Incorrect window shrinking logic**: In the sliding window approach, it's crucial to understand when to shrink the window. We only shrink when the window contains all three characters, and we keep shrinking as long as it remains valid.

## When You'll See This Pattern

This sliding window pattern appears in many substring counting problems:

1. **Minimum Window Substring (Hard)**: Find the minimum length substring containing all characters of a pattern. Similar concept of expanding right until valid, then shrinking left to find minimum.

2. **Longest Substring Without Repeating Characters (Medium)**: Maintain a window with no repeating characters by tracking last seen positions—very similar to our first optimal solution.

3. **Subarrays with K Different Integers (Hard)**: Count subarrays with exactly K distinct integers. Uses similar "at least" to "exactly" transformation techniques.

4. **Vowels of All Substrings (Medium)**: Similar counting logic but with vowels instead of three specific characters.

## Key Takeaways

1. **The "at least" counting trick**: When counting substrings with "at least" some property, often the most efficient approach is to find the point where the property first becomes true, then recognize that all extensions maintain the property.

2. **Sliding window with last seen positions**: For problems with a small fixed alphabet, tracking last seen positions can be more efficient than maintaining counts and shrinking a window.

3. **Think in terms of contribution**: Instead of checking each substring, think about how many substrings each position contributes to. In our solution, when we find a valid ending at position `right`, we calculate how many starting positions would make valid substrings.

Related problems: [Vowels of All Substrings](/problem/vowels-of-all-substrings), [Count Complete Substrings](/problem/count-complete-substrings)
