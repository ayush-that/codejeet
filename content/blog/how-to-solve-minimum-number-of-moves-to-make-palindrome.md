---
title: "How to Solve Minimum Number of Moves to Make Palindrome — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Moves to Make Palindrome. Hard difficulty, 52.6% acceptance rate. Topics: Two Pointers, String, Greedy, Binary Indexed Tree."
date: "2029-02-19"
category: "dsa-patterns"
tags: ["minimum-number-of-moves-to-make-palindrome", "two-pointers", "string", "greedy", "hard"]
---

# How to Solve Minimum Number of Moves to Make Palindrome

This problem asks us to find the minimum number of adjacent swaps needed to rearrange a string into a palindrome. The challenge is that we can only swap adjacent characters, making this fundamentally different from problems where we can freely rearrange characters. The key insight is that we need to match characters from the ends inward while counting the swaps required to bring matching characters together.

## Visual Walkthrough

Let's trace through an example: `s = "aabb"`

A palindrome version would be `"abba"`. How do we get there with adjacent swaps?

**Step-by-step transformation:**

1. Start: `"a a b b"`
2. We'll work from left to right. The first character 'a' needs to match the last 'a'.
3. The last 'a' is at position 3 (0-indexed), but we need to bring it to position 3 from the right.
4. Actually, let's think systematically: We'll use two pointers, `left = 0` and `right = 3`.

Better approach: We find matching pairs starting from the ends:

1. `left = 0` (character 'a'), find matching 'a' from the right
2. The rightmost 'a' is at position 1 (0-indexed)
3. We need to swap it to position 3 (to match with left position 0)
4. That requires 2 swaps: swap positions 1↔2, then 2↔3
5. String becomes: `"a b a b"` (after moving 'a' from position 1 to 3)
6. Now `left = 1` (character 'b'), find matching 'b' from the right
7. The rightmost 'b' is at position 2
8. We need to swap it to position 2 (it's already there!)
9. No swaps needed
10. Final string: `"a b b a"` which is a palindrome

Total swaps: 2

This demonstrates the greedy approach: match characters from the ends inward, counting swaps needed to bring the matching character to its symmetric position.

## Brute Force Approach

A naive approach would be to generate all permutations of the string, check which ones are palindromes, and for each palindrome, calculate the minimum adjacent swaps needed to transform the original string into that palindrome. Then return the minimum across all palindromes.

Why this fails:

1. Generating all permutations is O(n!) time complexity
2. For each permutation, checking if it's a palindrome is O(n)
3. Calculating the minimum adjacent swaps between two strings is itself a complex problem
4. Even for moderate n=10, 10! = 3,628,800 permutations is infeasible

Another naive approach: Try all possible palindrome arrangements by matching characters. For a string of length n with character counts, the number of valid palindrome arrangements grows factorially with character frequencies.

The brute force is clearly impractical for any reasonable input size (n up to 2000 in this problem).

## Optimized Approach

The key insight is that we can solve this greedily by working from the ends toward the center:

1. Use two pointers: `left` starting at 0, `right` starting at n-1
2. For each `left` position, find the matching character from the right side
3. If found, swap it to the `right` position and count the swaps
4. If not found (odd-length palindrome with a single unmatched character), move it to the center

Why this greedy approach works:

- Each swap only affects adjacent characters, so moving a character k positions requires exactly k swaps
- By fixing the outermost positions first, we ensure inner characters don't need to cross already-placed characters
- This minimizes total swaps because we're always moving the minimum distance for each character

The tricky part: When we move a character from position `i` to position `j` (where `j > i`), we're effectively removing it from the string for the remaining operations. We need to adjust indices accordingly.

## Optimal Solution

We use a two-pointer approach with a mutable string (list of characters) to track the current state. For each left position, we search for a matching character from the right. When found, we swap it to the symmetric right position and count the swaps.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def minMovesToMakePalindrome(s: str) -> int:
    """
    Find minimum adjacent swaps to make string palindrome.
    Strategy: Greedy two-pointer approach fixing outermost characters first.
    """
    # Convert string to list for mutability
    chars = list(s)
    n = len(chars)
    moves = 0
    left, right = 0, n - 1

    while left < right:
        # If characters at left and right match, move both pointers inward
        if chars[left] == chars[right]:
            left += 1
            right -= 1
            continue

        # Find matching character for chars[left] from the right side
        # Start from right pointer and move leftward
        match_idx = right
        while match_idx > left and chars[match_idx] != chars[left]:
            match_idx -= 1

        # If we found a match (not the same position as left)
        if match_idx != left:
            # Swap the matching character to the right position
            # We need to move chars[match_idx] to position 'right'
            # This requires (right - match_idx) adjacent swaps
            for i in range(match_idx, right):
                chars[i], chars[i + 1] = chars[i + 1], chars[i]
                moves += 1
            # After moving, the right character is now correct
            left += 1
            right -= 1
        else:
            # No match found - this character will be the center of odd-length palindrome
            # Move it to the center by swapping with its right neighbor
            chars[left], chars[left + 1] = chars[left + 1], chars[left]
            moves += 1
            # Don't move left pointer yet - we need to check this position again
            # Right pointer stays the same

    return moves
```

```javascript
// Time: O(n^2) | Space: O(n)
/**
 * Find minimum adjacent swaps to make string palindrome.
 * Strategy: Greedy two-pointer approach fixing outermost characters first.
 */
function minMovesToMakePalindrome(s) {
  // Convert string to array for mutability
  let chars = s.split("");
  let n = chars.length;
  let moves = 0;
  let left = 0,
    right = n - 1;

  while (left < right) {
    // If characters at left and right match, move both pointers inward
    if (chars[left] === chars[right]) {
      left++;
      right--;
      continue;
    }

    // Find matching character for chars[left] from the right side
    // Start from right pointer and move leftward
    let matchIdx = right;
    while (matchIdx > left && chars[matchIdx] !== chars[left]) {
      matchIdx--;
    }

    // If we found a match (not the same position as left)
    if (matchIdx !== left) {
      // Swap the matching character to the right position
      // We need to move chars[matchIdx] to position 'right'
      // This requires (right - matchIdx) adjacent swaps
      for (let i = matchIdx; i < right; i++) {
        [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
        moves++;
      }
      // After moving, the right character is now correct
      left++;
      right--;
    } else {
      // No match found - this character will be the center of odd-length palindrome
      // Move it to the center by swapping with its right neighbor
      [chars[left], chars[left + 1]] = [chars[left + 1], chars[left]];
      moves++;
      // Don't move left pointer yet - we need to check this position again
      // Right pointer stays the same
    }
  }

  return moves;
}
```

```java
// Time: O(n^2) | Space: O(n)
/**
 * Find minimum adjacent swaps to make string palindrome.
 * Strategy: Greedy two-pointer approach fixing outermost characters first.
 */
public int minMovesToMakePalindrome(String s) {
    // Convert string to char array for mutability
    char[] chars = s.toCharArray();
    int n = chars.length;
    int moves = 0;
    int left = 0, right = n - 1;

    while (left < right) {
        // If characters at left and right match, move both pointers inward
        if (chars[left] == chars[right]) {
            left++;
            right--;
            continue;
        }

        // Find matching character for chars[left] from the right side
        // Start from right pointer and move leftward
        int matchIdx = right;
        while (matchIdx > left && chars[matchIdx] != chars[left]) {
            matchIdx--;
        }

        // If we found a match (not the same position as left)
        if (matchIdx != left) {
            // Swap the matching character to the right position
            // We need to move chars[matchIdx] to position 'right'
            // This requires (right - matchIdx) adjacent swaps
            for (int i = matchIdx; i < right; i++) {
                char temp = chars[i];
                chars[i] = chars[i + 1];
                chars[i + 1] = temp;
                moves++;
            }
            // After moving, the right character is now correct
            left++;
            right--;
        } else {
            // No match found - this character will be the center of odd-length palindrome
            // Move it to the center by swapping with its right neighbor
            char temp = chars[left];
            chars[left] = chars[left + 1];
            chars[left + 1] = temp;
            moves++;
            // Don't move left pointer yet - we need to check this position again
            // Right pointer stays the same
        }
    }

    return moves;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- In the worst case, for each of the n/2 pairs, we might search through up to n positions to find a match
- The inner while loop for finding matches takes O(n) in worst case
- The swapping loop also takes O(n) in worst case when moving a character from near the left to the right end
- Overall O(n²) operations

**Space Complexity: O(n)**

- We need O(n) space to store the mutable character array
- Only a constant amount of extra space for pointers and counters

**Why not O(n log n) with BIT/Fenwick Tree?**
While there exists an O(n log n) solution using Binary Indexed Tree to count inversions, the O(n²) greedy solution is more intuitive and acceptable for interview settings given n ≤ 2000. The BIT approach tracks positions of characters and counts how many swaps are needed while adjusting indices, but it's more complex to implement correctly under time pressure.

## Common Mistakes

1. **Not handling the center character correctly**: When a character has no match (odd count), candidates might try to skip it or handle it incorrectly. The correct approach is to move it toward the center one swap at a time, counting each swap.

2. **Forgetting to adjust indices after swaps**: After moving a character from position `i` to `j`, all characters between `i` and `j` shift left by one. Some implementations fail to account for this, leading to incorrect matching later.

3. **Using the wrong swap count**: Each adjacent swap counts as 1 move. When moving a character k positions, that's exactly k swaps. Some candidates might try to calculate this differently or use a formula that doesn't account for the adjacent constraint.

4. **Not verifying palindrome possibility**: The problem states input guarantees a palindrome is possible, but in a real interview, it's good to mention checking character counts first to ensure at most one character has odd frequency.

## When You'll See This Pattern

This greedy two-pointer approach with adjacent swaps appears in several problems:

1. **Minimum Adjacent Swaps to Make String Balanced (LeetCode 1963)**: Similar concept of balancing brackets with adjacent swaps.
2. **Minimum Swaps to Make Strings Equal (LeetCode 1247)**: Swapping characters between two strings to make them equal.
3. **Minimum Number of Swaps to Make the Binary String Alternating (LeetCode 1864)**: Adjacent swaps to achieve alternating pattern.

The core pattern is: when only adjacent swaps are allowed, moving an element k positions requires exactly k swaps, and a greedy approach fixing positions from the outside in (or according to some priority) often yields the minimum total swaps.

## Key Takeaways

1. **Adjacent swaps constraint simplifies distance calculation**: Moving a character from position i to j requires exactly |j-i| swaps when only adjacent swaps are allowed.

2. **Greedy from outside in works for palindrome construction**: By fixing the outermost matching pairs first, we ensure inner characters don't need to cross already-placed characters, minimizing total swaps.

3. **Mutable data structure is crucial**: Since we're constantly swapping characters, we need an array/list representation, not an immutable string.

4. **Handle the center character separately**: For odd-length palindromes, the unmatched character must be moved to the center, counting each swap along the way.

Related problems: [Minimum Insertion Steps to Make a String Palindrome](/problem/minimum-insertion-steps-to-make-a-string-palindrome), [Minimum Number of Flips to Make Binary Grid Palindromic I](/problem/minimum-number-of-flips-to-make-binary-grid-palindromic-i)
