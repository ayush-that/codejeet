---
title: "How to Solve Number of Changing Keys — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Changing Keys. Easy difficulty, 80.5% acceptance rate. Topics: String."
date: "2027-11-11"
category: "dsa-patterns"
tags: ["number-of-changing-keys", "string", "easy"]
---

# How to Solve Number of Changing Keys

This problem asks us to count how many times a user changes keys while typing a string. A key change happens when the current character differs from the previous character, ignoring case differences. While this seems straightforward, the subtlety lies in properly handling case-insensitive comparisons and edge cases like single-character strings.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "AaAaAbB"`:

1. Start at index 0: 'A' - no previous character, so no change yet (count = 0)
2. Index 1: 'a' compared to previous 'A' - case-insensitive comparison shows they're the same ('a' == 'A' ignoring case), so no change (count = 0)
3. Index 2: 'A' compared to previous 'a' - still the same ignoring case, no change (count = 0)
4. Index 3: 'a' compared to previous 'A' - same ignoring case, no change (count = 0)
5. Index 4: 'A' compared to previous 'a' - same ignoring case, no change (count = 0)
6. Index 5: 'b' compared to previous 'A' - different even ignoring case, so this is a key change (count = 1)
7. Index 6: 'B' compared to previous 'b' - same ignoring case, no change (count = 1)

Final answer: 1 key change.

The key insight is that we need to compare each character with the previous one, but we must normalize case for comparison while preserving the original characters for subsequent comparisons.

## Brute Force Approach

A naive approach might involve creating a new string with all lowercase characters and then comparing adjacent characters. However, this isn't truly a "brute force" in the sense of being inefficient - the problem is simple enough that the straightforward solution is already optimal.

What some candidates might try incorrectly:

- Comparing characters directly without case normalization (would count 'A' → 'a' as a change)
- Using nested loops to compare every character with every other character (O(n²) time for no benefit)
- Overcomplicating with hash maps or sets when simple iteration suffices

The straightforward single-pass approach is already optimal for this problem, so we'll focus on implementing it correctly.

## Optimal Solution

We iterate through the string starting from the second character, comparing each character with the previous one in a case-insensitive manner. When they differ, we increment our counter.

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) - we only use a few variables
def countKeyChanges(s: str) -> int:
    # Initialize counter for key changes
    count = 0

    # Start from the second character (index 1) since we need to compare with previous
    for i in range(1, len(s)):
        # Compare current character with previous character, ignoring case
        # We convert both to lowercase (or uppercase) for case-insensitive comparison
        if s[i].lower() != s[i-1].lower():
            count += 1  # Increment counter when keys are different

    return count
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) - we only use a few variables
function countKeyChanges(s) {
  // Initialize counter for key changes
  let count = 0;

  // Start from the second character (index 1) since we need to compare with previous
  for (let i = 1; i < s.length; i++) {
    // Compare current character with previous character, ignoring case
    // We convert both to lowercase (or uppercase) for case-insensitive comparison
    if (s[i].toLowerCase() !== s[i - 1].toLowerCase()) {
      count++; // Increment counter when keys are different
    }
  }

  return count;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) - we only use a few variables
public int countKeyChanges(String s) {
    // Initialize counter for key changes
    int count = 0;

    // Start from the second character (index 1) since we need to compare with previous
    for (int i = 1; i < s.length(); i++) {
        // Compare current character with previous character, ignoring case
        // We convert both to lowercase (or uppercase) for case-insensitive comparison
        char current = Character.toLowerCase(s.charAt(i));
        char previous = Character.toLowerCase(s.charAt(i - 1));

        if (current != previous) {
            count++;  // Increment counter when keys are different
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing constant-time operations (character access and comparison) for each character.
- The loop runs n-1 times (where n is the string length), which simplifies to O(n).

**Space Complexity: O(1)**

- We only use a few integer variables (`count`, loop index) regardless of input size.
- No additional data structures that scale with input size are used.
- Even the case conversion operations typically create temporary strings in some languages, but these are usually optimized by the runtime and don't require additional O(n) space.

## Common Mistakes

1. **Starting the loop at index 0 instead of 1**: This causes an index out of bounds error when trying to access `s[i-1]` on the first iteration. Always check your loop boundaries carefully.

2. **Forgetting case-insensitive comparison**: Comparing characters directly with `!=` or `!==` will count 'A' → 'a' as a key change, which is incorrect according to the problem statement. Always normalize case before comparison.

3. **Incorrect handling of empty or single-character strings**: While the problem guarantees a non-empty string, candidates might still write code that fails for single-character strings. Our solution handles this correctly because the loop from 1 to `len(s)` won't execute when `len(s) = 1`, returning 0 as expected.

4. **Using the wrong comparison operator in JavaScript**: Using `!=` instead of `!==` for case-insensitive comparison might cause issues with type coercion. Always use strict inequality (`!==`) when comparing strings.

## When You'll See This Pattern

This problem uses a simple linear scan with adjacent element comparison, a pattern that appears in many string and array problems:

1. **Detect Capital (LeetCode 520)**: Similar pattern of checking character properties across a string.
2. **Monotonic Array (LeetCode 896)**: Checking if adjacent elements maintain a certain relationship (increasing or decreasing).
3. **Longest Continuous Increasing Subsequence (LeetCode 674)**: Tracking changes in adjacent elements to find sequences.
4. **Remove All Adjacent Duplicates In String (LeetCode 1047)**: Working with adjacent characters to modify a string.

The core technique of iterating through a sequence while comparing each element with its predecessor is fundamental to many algorithmic problems.

## Key Takeaways

1. **Linear scans with adjacent comparisons** are a powerful tool for problems involving sequences. Always consider whether you can solve a problem by examining each element in relation to its neighbors.

2. **Pay attention to comparison details** - in this case, the requirement for case-insensitive comparison was crucial. Always read problem constraints carefully to understand exactly what constitutes a "difference" or "change."

3. **Boundary conditions matter** - starting loops at the right index and handling edge cases (empty strings, single elements) correctly separates working solutions from buggy ones.

[Practice this problem on CodeJeet](/problem/number-of-changing-keys)
