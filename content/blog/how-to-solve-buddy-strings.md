---
title: "How to Solve Buddy Strings — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Buddy Strings. Easy difficulty, 33.9% acceptance rate. Topics: Hash Table, String."
date: "2028-01-28"
category: "dsa-patterns"
tags: ["buddy-strings", "hash-table", "string", "easy"]
---

# How to Solve Buddy Strings

The problem asks whether we can swap exactly two characters in string `s` to make it equal to string `goal`. While the concept is straightforward, the tricky part lies in handling all edge cases correctly—especially when the strings are identical but contain duplicate characters, or when they differ in length.

## Visual Walkthrough

Let's trace through an example step by step.

**Example:** `s = "ab"`, `goal = "ba"`

1. First, check if lengths are equal. Both have length 2 → proceed.
2. Compare characters at each position:
   - Position 0: `s[0] = 'a'`, `goal[0] = 'b'` → mismatch
   - Position 1: `s[1] = 'b'`, `goal[1] = 'a'` → mismatch
3. Collect indices where characters differ: `[0, 1]`
4. We have exactly 2 mismatches. Check if swapping `s[0]` and `s[1]` works:
   - `s[0]` should equal `goal[1]` (`'a' == 'a'` ✓)
   - `s[1]` should equal `goal[0]` (`'b' == 'b'` ✓)
5. All conditions satisfied → return `true`.

**Another example:** `s = "aa"`, `goal = "aa"`

1. Lengths equal (both 2).
2. No mismatches found (strings are identical).
3. But can we swap two identical characters? Yes, swapping `s[0]` and `s[1]` leaves the string unchanged as `"aa"`.
4. However, we need at least two identical characters to perform a swap. Check if any character appears at least twice in `s`.
5. Character `'a'` appears twice → we can swap them → return `true`.

**Edge case:** `s = "ab"`, `goal = "ab"`

1. Lengths equal.
2. No mismatches.
3. But `'a'` and `'b'` are different characters. Swapping them would change the string to `"ba"`, which doesn't equal `goal`.
4. Since we have no duplicate characters, we cannot perform a useful swap → return `false`.

## Brute Force Approach

A brute force approach would try all possible pairs of indices `(i, j)` where `i < j`, swap the characters at those positions in `s`, and check if the resulting string equals `goal`.

**Why this is inefficient:**

- For a string of length `n`, there are `n(n-1)/2` possible swaps.
- Each swap requires creating a new string (O(n) time) and comparing it to `goal` (O(n) time).
- Total time complexity: O(n³) — far too slow for typical constraints where `n` can be up to 20,000.

**What a naive candidate might miss:**

- Trying to implement the brute force without realizing the O(n³) complexity.
- Not handling the case where strings are identical but have duplicate characters.
- Forgetting to check string lengths first.

## Optimal Solution

The optimal approach uses a single pass through both strings to identify mismatches, then applies logical checks based on the number and nature of those mismatches.

**Key insights:**

1. If lengths differ → immediately return `false` (can't match with any swap).
2. If strings are identical → check if there's at least one character that appears twice (so we can swap identical characters without changing the string).
3. If strings differ at exactly two positions → check if swapping those positions makes the strings equal.
4. Any other case (0, 1, or >2 mismatches) → return `false`.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) for the diff list, O(26) for the character count
def buddyStrings(s: str, goal: str) -> bool:
    # Step 1: Check if lengths are equal
    if len(s) != len(goal):
        return False

    # Step 2: If strings are identical, check for duplicate characters
    if s == goal:
        # Use a set to track seen characters
        seen = set()
        for char in s:
            if char in seen:
                # Found a duplicate - we can swap these identical characters
                return True
            seen.add(char)
        # No duplicates found - swapping any two different characters would change the string
        return False

    # Step 3: Find indices where characters differ
    diff = []
    for i in range(len(s)):
        if s[i] != goal[i]:
            diff.append(i)
            # Early exit: if we find more than 2 differences, it's impossible
            if len(diff) > 2:
                return False

    # Step 4: Check if we have exactly 2 differences and they can be swapped
    # We need exactly 2 differences for a single swap to fix both
    if len(diff) != 2:
        return False

    # Verify that swapping the two different positions makes the strings equal
    i, j = diff[0], diff[1]
    return s[i] == goal[j] and s[j] == goal[i]
```

```javascript
// Time: O(n) | Space: O(1) for the diff array, O(26) for the character set
function buddyStrings(s, goal) {
  // Step 1: Check if lengths are equal
  if (s.length !== goal.length) {
    return false;
  }

  // Step 2: If strings are identical, check for duplicate characters
  if (s === goal) {
    // Use a Set to track seen characters
    const seen = new Set();
    for (const char of s) {
      if (seen.has(char)) {
        // Found a duplicate - we can swap these identical characters
        return true;
      }
      seen.add(char);
    }
    // No duplicates found - swapping any two different characters would change the string
    return false;
  }

  // Step 3: Find indices where characters differ
  const diff = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== goal[i]) {
      diff.push(i);
      // Early exit: if we find more than 2 differences, it's impossible
      if (diff.length > 2) {
        return false;
      }
    }
  }

  // Step 4: Check if we have exactly 2 differences and they can be swapped
  // We need exactly 2 differences for a single swap to fix both
  if (diff.length !== 2) {
    return false;
  }

  // Verify that swapping the two different positions makes the strings equal
  const [i, j] = diff;
  return s[i] === goal[j] && s[j] === goal[i];
}
```

```java
// Time: O(n) | Space: O(1) for the diff list, O(26) for the character set
class Solution {
    public boolean buddyStrings(String s, String goal) {
        // Step 1: Check if lengths are equal
        if (s.length() != goal.length()) {
            return false;
        }

        // Step 2: If strings are identical, check for duplicate characters
        if (s.equals(goal)) {
            // Use a boolean array to track seen characters (26 lowercase letters)
            boolean[] seen = new boolean[26];
            for (char c : s.toCharArray()) {
                int idx = c - 'a';
                if (seen[idx]) {
                    // Found a duplicate - we can swap these identical characters
                    return true;
                }
                seen[idx] = true;
            }
            // No duplicates found - swapping any two different characters would change the string
            return false;
        }

        // Step 3: Find indices where characters differ
        List<Integer> diff = new ArrayList<>();
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) != goal.charAt(i)) {
                diff.add(i);
                // Early exit: if we find more than 2 differences, it's impossible
                if (diff.size() > 2) {
                    return false;
                }
            }
        }

        // Step 4: Check if we have exactly 2 differences and they can be swapped
        // We need exactly 2 differences for a single swap to fix both
        if (diff.size() != 2) {
            return false;
        }

        // Verify that swapping the two different positions makes the strings equal
        int i = diff.get(0);
        int j = diff.get(1);
        return s.charAt(i) == goal.charAt(j) && s.charAt(j) == goal.charAt(i);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through both strings to check for mismatches: O(n)
- In the identical strings case, we also make a single pass to check for duplicates: O(n)
- All other operations (length checks, comparisons, list operations) are O(1) or O(2)
- Total: O(n)

**Space Complexity:** O(1) auxiliary space

- The `diff` list/array stores at most 2 indices: O(1) space
- For checking duplicates in identical strings:
  - Python/JavaScript: O(26) worst case (all lowercase letters)
  - Java: O(26) fixed-size boolean array
- Total: O(1) since 26 is constant regardless of input size

## Common Mistakes

1. **Forgetting to check string lengths first**
   - If `s` and `goal` have different lengths, no swap can make them equal.
   - Always check this before any other processing.

2. **Not handling the identical strings case correctly**
   - When `s == goal`, candidates often return `true` without checking for duplicates.
   - Example: `s = "ab"`, `goal = "ab"` should return `false` because swapping `'a'` and `'b'` would give `"ba"`.
   - Only return `true` if there's at least one character that appears twice.

3. **Assuming exactly 2 mismatches is always sufficient**
   - Having exactly 2 mismatches is necessary but not sufficient.
   - Must also verify that `s[i] == goal[j]` and `s[j] == goal[i]`.
   - Example: `s = "ab"`, `goal = "cd"` has 2 mismatches but swapping won't help.

4. **Not using early exit for >2 mismatches**
   - Once we find 3 or more mismatches, we can return `false` immediately.
   - This optimization prevents unnecessary iterations.

## When You'll See This Pattern

This problem combines **string comparison** with **mismatch tracking** and **edge case handling**—a common pattern in string manipulation problems.

**Related problems:**

1. **Determine if Two Strings Are Close (Medium)** - Also involves character swapping/counting but with more complex operations (swap any two existing characters, transform all occurrences of one character to another).
2. **Check if One String Swap Can Make Strings Equal (Easy)** - Nearly identical to Buddy Strings but without the identical strings with duplicates case.
3. **Make Number of Distinct Characters Equal (Medium)** - Involves swapping characters between strings to achieve certain properties.

The core technique of tracking mismatches and validating swaps appears in many string comparison problems where limited operations are allowed.

## Key Takeaways

1. **Always check edge cases first** - Different lengths, identical strings, empty strings. These often have special handling requirements.
2. **Track mismatches efficiently** - Use a list/array to store indices where strings differ, with early exit when impossible.
3. **Validate swap conditions** - Having exactly two mismatches doesn't guarantee a valid swap; you must check if swapping those positions actually fixes both mismatches.

**Pattern recognition:** When a problem asks if you can transform one string to another with limited operations (swaps, replacements, etc.), think about:

- What properties must be preserved (length, character counts)?
- How many differences are allowed?
- What specific conditions make the transformation possible?

Related problems: [Determine if Two Strings Are Close](/problem/determine-if-two-strings-are-close), [Check if One String Swap Can Make Strings Equal](/problem/check-if-one-string-swap-can-make-strings-equal), [Make Number of Distinct Characters Equal](/problem/make-number-of-distinct-characters-equal)
