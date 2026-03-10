---
title: "How to Solve Smallest String With A Given Numeric Value — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest String With A Given Numeric Value. Medium difficulty, 67.4% acceptance rate. Topics: String, Greedy."
date: "2027-05-19"
category: "dsa-patterns"
tags: ["smallest-string-with-a-given-numeric-value", "string", "greedy", "medium"]
---

# How to Solve Smallest String With A Given Numeric Value

You need to construct the lexicographically smallest string of length `n` where the sum of its characters' numeric values (a=1, b=2, ..., z=26) equals `k`. The challenge is balancing two competing goals: making the string as small lexicographically as possible (which favors 'a's at the beginning) while still reaching the target sum (which might require larger letters at the end). This is a classic greedy construction problem where you build the string from right to left.

## Visual Walkthrough

Let's trace through an example: `n = 3, k = 27`. We want the smallest lexicographic string, so we'd prefer 'a's at the beginning, but we need the total sum to be 27.

**Step-by-step reasoning:**

1. We have 3 positions to fill: \_ \_ \_
2. Start from the **rightmost** position because that's where larger letters have the least impact on lexicographic order
3. For the last position (position 3), we want the largest possible letter that still allows us to fill the remaining positions with at least 'a's (value 1 each)
4. Remaining positions after this one: 2 positions left, minimum sum they can have = 2 × 1 = 2
5. Maximum we can put at position 3 = `k - remaining_min_sum` = 27 - 2 = 25
6. But letters only go up to 26, and 25 corresponds to 'y'
7. So position 3 gets 'y' (value 25), remaining `k` = 27 - 25 = 2
8. Now we have 2 positions left and need sum 2
9. For position 2: 1 position left after this, minimum sum = 1
10. Maximum for position 2 = 2 - 1 = 1 → 'a'
11. Position 1 gets the remaining: 2 - 1 = 1 → 'a'

Result: "aay" (positions: a, a, y)

Let's verify: 'a'(1) + 'a'(1) + 'y'(25) = 27 ✓
Lexicographically, "aay" is indeed smaller than alternatives like "abz" or "baa".

## Brute Force Approach

A naive approach would try all possible strings of length `n` and check which ones sum to `k`, then pick the smallest lexicographically. This is clearly impossible for even moderate `n` since there are 26^n possibilities.

A slightly better but still inefficient brute force would use backtracking: try placing letters from left to right, pruning when the current sum exceeds `k` or when we can't reach `k` even with all 'z's. However, this still explores many possibilities unnecessarily.

The key insight is that we don't need to explore - we can **deterministically** construct the answer by working backwards and always choosing the largest possible letter for the current position that still allows us to fill remaining positions with at least 'a's.

## Optimized Approach

The optimal solution uses a **greedy approach from right to left**:

1. **Initialize** an array of `n` characters, all set to 'a' (value 1 each)
2. **Calculate** the remaining value we need to distribute: `k - n` (since we already have `n` points from the 'a's)
3. **Iterate from right to left**:
   - At each position, we can add up to 25 additional points (changing from 'a' to 'z')
   - Add `min(25, remaining)` to the current position
   - Subtract what we added from `remaining`
   - Stop when `remaining` reaches 0
4. **Convert** the numeric values back to characters

**Why this works:**

- Starting with all 'a's gives us the smallest possible base string
- Adding value from right to left ensures lexicographic minimality (larger letters appear as late as possible)
- The `min(25, remaining)` ensures we don't exceed 'z' (value 26) and don't overshoot the target

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - we iterate through the string once
# Space: O(n) - for storing the result string
def getSmallestString(n: int, k: int) -> str:
    # Start with all 'a's (value 1 each)
    # This gives us n points already, so we need to distribute k-n additional points
    result = ['a'] * n
    remaining = k - n  # Additional value we need to add

    # Work from right to left to keep lexicographic order minimal
    # Larger letters should appear as late as possible
    for i in range(n - 1, -1, -1):
        # We can add at most 25 to a position (changing 'a' to 'z')
        # If remaining is less than 25, add only what's needed
        add = min(25, remaining)

        # Convert the character value to actual character
        # 'a' is 97 in ASCII, and we started with 'a' (value 1)
        # So: 97 + (1 - 1) + add = 97 + add
        result[i] = chr(ord('a') + add)

        # Reduce the remaining value by what we just added
        remaining -= add

        # Early exit: if we've distributed all points, we can stop
        # The rest of the positions will remain 'a'
        if remaining == 0:
            break

    return ''.join(result)
```

```javascript
// Time: O(n) - we iterate through the string once
// Space: O(n) - for storing the result string
function getSmallestString(n, k) {
  // Start with all 'a's (value 1 each)
  // This gives us n points already, so we need to distribute k-n additional points
  const result = new Array(n).fill("a");
  let remaining = k - n; // Additional value we need to add

  // Work from right to left to keep lexicographic order minimal
  // Larger letters should appear as late as possible
  for (let i = n - 1; i >= 0; i--) {
    // We can add at most 25 to a position (changing 'a' to 'z')
    // If remaining is less than 25, add only what's needed
    const add = Math.min(25, remaining);

    // Convert the character value to actual character
    // 'a' is 97 in ASCII, and we started with 'a' (value 1)
    // So: 97 + (1 - 1) + add = 97 + add
    result[i] = String.fromCharCode("a".charCodeAt(0) + add);

    // Reduce the remaining value by what we just added
    remaining -= add;

    // Early exit: if we've distributed all points, we can stop
    // The rest of the positions will remain 'a'
    if (remaining === 0) {
      break;
    }
  }

  return result.join("");
}
```

```java
// Time: O(n) - we iterate through the string once
// Space: O(n) - for storing the result string
class Solution {
    public String getSmallestString(int n, int k) {
        // Start with all 'a's (value 1 each)
        // This gives us n points already, so we need to distribute k-n additional points
        char[] result = new char[n];
        Arrays.fill(result, 'a');
        int remaining = k - n;  // Additional value we need to add

        // Work from right to left to keep lexicographic order minimal
        // Larger letters should appear as late as possible
        for (int i = n - 1; i >= 0; i--) {
            // We can add at most 25 to a position (changing 'a' to 'z')
            // If remaining is less than 25, add only what's needed
            int add = Math.min(25, remaining);

            // Convert the character value to actual character
            // 'a' is 97 in ASCII, and we started with 'a' (value 1)
            // So: 97 + (1 - 1) + add = 97 + add
            result[i] = (char) ('a' + add);

            // Reduce the remaining value by what we just added
            remaining -= add;

            // Early exit: if we've distributed all points, we can stop
            // The rest of the positions will remain 'a'
            if (remaining == 0) {
                break;
            }
        }

        return new String(result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once from right to left
- Each iteration does constant work: a min operation, character conversion, and subtraction
- The early break when `remaining == 0` doesn't change the worst case (we might need to process all positions)

**Space Complexity: O(n)**

- We need to store the result string of length `n`
- The algorithm itself uses only a few integer variables (`remaining`, `add`, loop index)
- In languages that build strings immutably, there might be additional temporary strings, but the dominant storage is the output

## Common Mistakes

1. **Working left to right instead of right to left**: If you try to place the smallest possible letter at each position from left to right, you might end up with a string like "abz" for n=3, k=27, which is lexicographically larger than "aay". The right-to-left approach ensures larger letters appear later.

2. **Forgetting that 'a' has value 1, not 0**: This leads to off-by-one errors in calculations. Remember the problem states 1-indexed positions in the alphabet.

3. **Not handling the maximum addition correctly**: Each position can only increase by 25 (from 'a'=1 to 'z'=26). Using `min(25, remaining)` is crucial. Some candidates try to add `remaining` directly, which could result in values >26.

4. **Missing the early break optimization**: While not necessary for correctness, continuing to process positions after `remaining == 0` is wasteful. The early break when we've distributed all points is a good optimization to mention.

## When You'll See This Pattern

This greedy construction pattern appears in problems where you need to build something with constraints while optimizing for lexicographic order:

1. **Construct String With Given Limit** (LeetCode 1642): Similar constraint satisfaction with building from one end.
2. **Maximum Binary String After Change** (LeetCode 1702): Another greedy string construction problem.
3. **Smallest Subsequence of Distinct Characters** (LeetCode 1081): Uses monotonic stack but has similar "lexicographically smallest" goal.

The core pattern is: when building lexicographically smallest strings under constraints, **work backwards** and place larger values as late as possible. This ensures earlier positions have the smallest possible values.

## Key Takeaways

1. **For lexicographically smallest strings with sum constraints, build from right to left**: This ensures larger values (which are necessary to meet the sum) appear as late as possible, keeping the prefix as small as possible.

2. **Start with the minimum valid configuration and add value strategically**: Beginning with all 'a's gives us a baseline, then we distribute the remaining value optimally.

3. **Greedy construction often works when the optimization goal is monotonic**: Here, placing a larger letter earlier always makes the string lexicographically larger, so we delay large letters as much as possible.

[Practice this problem on CodeJeet](/problem/smallest-string-with-a-given-numeric-value)
