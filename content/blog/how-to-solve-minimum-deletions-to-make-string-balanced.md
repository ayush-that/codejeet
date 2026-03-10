---
title: "How to Solve Minimum Deletions to Make String Balanced — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Deletions to Make String Balanced. Medium difficulty, 68.2% acceptance rate. Topics: String, Dynamic Programming, Stack."
date: "2028-02-05"
category: "dsa-patterns"
tags:
  ["minimum-deletions-to-make-string-balanced", "string", "dynamic-programming", "stack", "medium"]
---

# How to Solve Minimum Deletions to Make String Balanced

This problem asks us to find the minimum number of character deletions needed to make a string consisting only of 'a' and 'b' balanced. A string is balanced when there are no instances where a 'b' appears before an 'a' in the original string order. What makes this problem interesting is that it looks like a simple string problem, but it actually requires careful analysis of the relationship between 'a's and 'b's across the entire string. The key insight is recognizing that we're essentially looking for the best "split point" in the string.

## Visual Walkthrough

Let's trace through an example: `s = "aababbab"`

We need to make sure no 'b' comes before any 'a'. This means the final string should be all 'a's followed by all 'b's (or just all 'a's or all 'b's).

One way to think about it: We're looking for the best place to "split" the string. Everything to the left of the split should be 'a's, and everything to the right should be 'b's. Any character that doesn't match this pattern needs to be deleted.

For `s = "aababbab"`:

- If we split after index 0: left = "a", right = "ababbab"
  - Left has only 'a's ✓
  - Right should have only 'b's, but has 'a's at positions 2, 4, 6 → need to delete 3 'a's
  - Total deletions = 3

- If we split after index 1: left = "aa", right = "babbab"
  - Left has only 'a's ✓
  - Right has 'a's at positions 3, 5 → need to delete 2 'a's
  - Total deletions = 2

- If we split after index 2: left = "aab", right = "abbab"
  - Left has a 'b' at position 2 → need to delete 1 'b'
  - Right has 'a's at positions 3, 5 → need to delete 2 'a's
  - Total deletions = 1 + 2 = 3

- If we split after index 3: left = "aaba", right = "bbab"
  - Left has 'b' at position 2 → need to delete 1 'b'
  - Right has 'a' at position 5 → need to delete 1 'a'
  - Total deletions = 1 + 1 = 2

- If we split after index 4: left = "aabab", right = "bab"
  - Left has 'b's at positions 2, 4 → need to delete 2 'b's
  - Right has 'a' at position 5 → need to delete 1 'a'
  - Total deletions = 2 + 1 = 3

And so on... The minimum we found was 2 deletions. But checking every split point would be O(n²) if done naively. We need a smarter approach.

## Brute Force Approach

The most straightforward brute force approach would be to try every possible resulting string that's balanced and count how many deletions it would take to get there. Since a balanced string must be of the form "a...ab...b", we could:

1. Try keeping 0 to n 'a's from the beginning
2. Try keeping 0 to n 'b's from the end
3. Count how many characters we need to delete to achieve each configuration

This would require checking O(n²) possibilities, and for each one, we'd need to scan the string to count mismatches, making it O(n³) overall. Even with some optimizations, a naive implementation would be too slow for the constraints (n up to 10⁵).

A slightly better brute force would be to try every split point (n+1 possibilities) and for each split, count:

- How many 'b's are in the left part (these need to be deleted)
- How many 'a's are in the right part (these need to be deleted)

This would be O(n²) since for each of n+1 split points, we'd scan both parts of the string. While better than the first approach, it's still too slow for large inputs.

## Optimized Approach

The key insight is that we can precompute counts to avoid rescanning the string for each split point. Here's the step-by-step reasoning:

1. **Observation**: In the final balanced string, all 'a's must come before all 'b's. This means we're looking for a split point where:
   - Everything left of the split becomes 'a's (so any 'b's there get deleted)
   - Everything right of the split becomes 'b's (so any 'a's there get deleted)

2. **Precomputation**: We can precompute two arrays:
   - `b_left[i]`: number of 'b's in `s[0..i]` (inclusive)
   - `a_right[i]`: number of 'a's in `s[i..n-1]` (inclusive)

3. **Efficient calculation**: For split point `i` (meaning we keep `s[0..i-1]` as left and `s[i..n-1]` as right):
   - Deletions needed = `b_left[i-1]` (if i > 0) + `a_right[i]`
   - We need to handle the boundary cases when i=0 or i=n

4. **Even better optimization**: We don't actually need to store both arrays. We can:
   - First count total 'a's in the string
   - Then iterate through each possible split point, maintaining:
     - `b_count`: number of 'b's seen so far (in left part)
     - `a_count`: number of 'a's remaining (in right part)
   - At each position, deletions needed = `b_count + a_count`
   - Update `a_count` as we move the split point

This gives us an O(n) time, O(1) space solution!

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumDeletions(s: str) -> int:
    """
    Returns the minimum number of deletions needed to make string balanced.
    A balanced string has all 'a's before all 'b's.

    Approach: For each possible split point, count:
    - 'b's in left part (need to delete to make left all 'a's)
    - 'a's in right part (need to delete to make right all 'b's)
    Track the minimum sum across all split points.
    """
    # Count total 'a's in the string
    total_a = s.count('a')

    # Initialize: split before first character
    # Left part is empty (0 b's), right part is entire string
    b_count = 0  # b's in left part
    a_count = total_a  # a's in right part
    min_deletions = b_count + a_count  # deletions needed for current split

    # Try each split point (after each character)
    for i, char in enumerate(s):
        if char == 'a':
            # Moving split past this 'a': it moves from right to left
            # So right part has one less 'a'
            a_count -= 1
        else:  # char == 'b'
            # Moving split past this 'b': it moves from right to left
            # So left part has one more 'b'
            b_count += 1

        # Calculate deletions needed for split after current position
        deletions = b_count + a_count
        min_deletions = min(min_deletions, deletions)

    return min_deletions
```

```javascript
// Time: O(n) | Space: O(1)
function minimumDeletions(s) {
  /**
   * Returns the minimum number of deletions needed to make string balanced.
   * A balanced string has all 'a's before all 'b's.
   *
   * Approach: For each possible split point, count:
   * - 'b's in left part (need to delete to make left all 'a's)
   * - 'a's in right part (need to delete to make right all 'b's)
   * Track the minimum sum across all split points.
   */

  // Count total 'a's in the string
  let totalA = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "a") totalA++;
  }

  // Initialize: split before first character
  // Left part is empty (0 b's), right part is entire string
  let bCount = 0; // b's in left part
  let aCount = totalA; // a's in right part
  let minDeletions = bCount + aCount; // deletions needed for current split

  // Try each split point (after each character)
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "a") {
      // Moving split past this 'a': it moves from right to left
      // So right part has one less 'a'
      aCount--;
    } else {
      // s[i] === 'b'
      // Moving split past this 'b': it moves from right to left
      // So left part has one more 'b'
      bCount++;
    }

    // Calculate deletions needed for split after current position
    const deletions = bCount + aCount;
    minDeletions = Math.min(minDeletions, deletions);
  }

  return minDeletions;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumDeletions(String s) {
        /**
         * Returns the minimum number of deletions needed to make string balanced.
         * A balanced string has all 'a's before all 'b's.
         *
         * Approach: For each possible split point, count:
         * - 'b's in left part (need to delete to make left all 'a's)
         * - 'a's in right part (need to delete to make right all 'b's)
         * Track the minimum sum across all split points.
         */

        // Count total 'a's in the string
        int totalA = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == 'a') totalA++;
        }

        // Initialize: split before first character
        // Left part is empty (0 b's), right part is entire string
        int bCount = 0;      // b's in left part
        int aCount = totalA; // a's in right part
        int minDeletions = bCount + aCount; // deletions needed for current split

        // Try each split point (after each character)
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == 'a') {
                // Moving split past this 'a': it moves from right to left
                // So right part has one less 'a'
                aCount--;
            } else { // s.charAt(i) == 'b'
                // Moving split past this 'b': it moves from right to left
                // So left part has one more 'b'
                bCount++;
            }

            // Calculate deletions needed for split after current position
            int deletions = bCount + aCount;
            minDeletions = Math.min(minDeletions, deletions);
        }

        return minDeletions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string:
  1. First pass to count total 'a's (O(n))
  2. Second pass to try all split points and calculate deletions (O(n))
- Total: O(2n) = O(n)

**Space Complexity: O(1)**

- We only use a constant number of integer variables:
  - `totalA`, `bCount`, `aCount`, `minDeletions`
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to check the split before the first character**: Some candidates only check splits between characters, but we also need to consider deleting all characters (split before first) or keeping all as 'b's (split after last). Our solution naturally handles these because we initialize with the split before the first character and iterate through all positions.

2. **Incorrectly updating counts when moving split point**: When the split moves past a character, that character moves from the right part to the left part. If it's an 'a', the right part has one less 'a'. If it's a 'b', the left part has one more 'b'. Mixing up this logic is a common error.

3. **Using O(n) space unnecessarily**: Some solutions create arrays to store prefix sums of 'b's and suffix sums of 'a's. While this is still O(n) time, it uses O(n) space when O(1) space is possible with the single-pass approach.

4. **Not considering that the minimum might be at the extremes**: The optimal solution might be to delete all 'b's (making the string all 'a's) or delete all 'a's (making the string all 'b's). Our algorithm checks these cases naturally as the split before first character and split after last character.

## When You'll See This Pattern

This problem uses the **"partition point optimization"** pattern, where you need to find the best place to split an array or string to minimize or maximize some condition. The key technique is maintaining running counts as you iterate through possible split points.

Similar problems that use this pattern:

1. **Maximum Subarray (LeetCode 53)** - While not exactly the same, it uses the idea of maintaining running sums to find optimal partitions.
2. **Best Time to Buy and Sell Stock (LeetCode 121)** - You're looking for the best pair of days (effectively a split point) to maximize profit.
3. **Partition Labels (LeetCode 763)** - You need to find split points in a string based on the last occurrence of each character.
4. **Check if All A's Appears Before All B's (LeetCode 2124)** - This is essentially checking if zero deletions are needed for the same balanced condition.

## Key Takeaways

1. **Look for the "split point" pattern**: When a problem asks you to arrange elements into two groups (like all 'a's then all 'b's), consider finding the optimal partition point between them.

2. **Precomputation enables optimization**: By counting total 'a's first, we can update counts in O(1) as we move the split point, avoiding O(n²) brute force.

3. **Consider boundary cases**: Always check what happens at the extremes (split before first element, split after last element) as these might give the optimal solution.

4. **Space optimization is often possible**: Even if an O(n) space solution comes to mind first, see if you can reduce it to O(1) by maintaining running counts instead of storing arrays.

Related problems: [Check if All A's Appears Before All B's](/problem/check-if-all-as-appears-before-all-bs)
