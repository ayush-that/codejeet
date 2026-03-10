---
title: "How to Solve Maximum Score After Splitting a String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Score After Splitting a String. Easy difficulty, 65.1% acceptance rate. Topics: String, Prefix Sum."
date: "2027-09-05"
category: "dsa-patterns"
tags: ["maximum-score-after-splitting-a-string", "string", "prefix-sum", "easy"]
---

# How to Solve Maximum Score After Splitting a String

This problem asks us to split a binary string into two non-empty parts and calculate a score: the number of zeros in the left substring plus the number of ones in the right substring. We need to find the split position that maximizes this score. What makes this interesting is that we need to efficiently count zeros on the left and ones on the right for every possible split—a classic prefix sum pattern in disguise.

## Visual Walkthrough

Let's trace through an example: `s = "011101"`

We need to try every split where both left and right substrings are non-empty. For a string of length `n`, that means splits at positions `1` through `n-1` (0-indexed).

**Split at position 1** (left = "0", right = "11101"):

- Zeros in left: 1 (the single "0")
- Ones in right: 4 (there are four "1"s in "11101")
- Score = 1 + 4 = 5

**Split at position 2** (left = "01", right = "1101"):

- Zeros in left: 1 (still just the first character)
- Ones in right: 3 (three "1"s in "1101")
- Score = 1 + 3 = 4

**Split at position 3** (left = "011", right = "101"):

- Zeros in left: 1
- Ones in right: 2 (two "1"s in "101")
- Score = 1 + 2 = 3

**Split at position 4** (left = "0111", right = "01"):

- Zeros in left: 1
- Ones in right: 1 (one "1" in "01")
- Score = 1 + 1 = 2

**Split at position 5** (left = "01110", right = "1"):

- Zeros in left: 1
- Ones in right: 1
- Score = 1 + 1 = 2

The maximum score is 5 at split position 1. Notice how we're repeatedly counting zeros in the left and ones in the right. A brute force approach would recount these for each split, but we can do better by precomputing.

## Brute Force Approach

The most straightforward solution is to try every valid split position and count zeros in the left substring and ones in the right substring from scratch each time.

**Algorithm:**

1. Initialize `max_score = 0`
2. For each split position `i` from 1 to `n-1`:
   - Count zeros in `s[0:i]` by iterating through the substring
   - Count ones in `s[i:n]` by iterating through the substring
   - Calculate score = zeros_left + ones_right
   - Update `max_score` if current score is higher

**Why it's inefficient:**
For each split position `i`, we're scanning the entire left substring (length `i`) and right substring (length `n-i`). This gives us O(n²) time complexity since we're doing nested iterations. For a string of length 1000, that's about 500,000 operations—still acceptable but not optimal. However, the pattern of repeatedly scanning overlapping substrings suggests we can optimize with prefix sums.

## Optimal Solution

We can solve this in O(n) time with O(1) extra space using a single pass. The key insight is that we don't need to recount everything from scratch for each split. Instead, we can:

1. First count the total number of ones in the entire string
2. As we iterate through possible split positions, maintain:
   - `zeros_left`: zeros seen so far (increment when we see '0')
   - `ones_right`: total ones minus ones we've passed (decrement when we see '1')
3. At each position, calculate score and track the maximum

This works because when we move the split point one character to the right:

- If that character was '0', zeros_left increases by 1
- If that character was '1', ones_right decreases by 1 (since it moved from right to left)

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxScore(s):
    """
    Calculate the maximum score after splitting a binary string.

    The score is defined as:
    (number of zeros in left substring) + (number of ones in right substring)

    Args:
        s: Binary string containing only '0' and '1'

    Returns:
        Maximum possible score
    """
    # Count total ones in the entire string
    total_ones = s.count('1')

    # Initialize counters
    zeros_left = 0
    ones_right = total_ones
    max_score = 0

    # Try every split position (from 1 to n-1)
    # We stop at len(s)-1 because right substring must be non-empty
    for i in range(len(s) - 1):
        # Update counts based on current character
        if s[i] == '0':
            zeros_left += 1
        else:  # s[i] == '1'
            ones_right -= 1

        # Calculate score for current split
        current_score = zeros_left + ones_right

        # Update maximum score if needed
        if current_score > max_score:
            max_score = current_score

    return max_score
```

```javascript
// Time: O(n) | Space: O(1)
function maxScore(s) {
  /**
   * Calculate the maximum score after splitting a binary string.
   *
   * The score is defined as:
   * (number of zeros in left substring) + (number of ones in right substring)
   *
   * @param {string} s - Binary string containing only '0' and '1'
   * @return {number} Maximum possible score
   */

  // Count total ones in the entire string
  let totalOnes = 0;
  for (let char of s) {
    if (char === "1") totalOnes++;
  }

  // Initialize counters
  let zerosLeft = 0;
  let onesRight = totalOnes;
  let maxScore = 0;

  // Try every split position (from 1 to n-1)
  // We stop at s.length-1 because right substring must be non-empty
  for (let i = 0; i < s.length - 1; i++) {
    // Update counts based on current character
    if (s[i] === "0") {
      zerosLeft++;
    } else {
      // s[i] === '1'
      onesRight--;
    }

    // Calculate score for current split
    const currentScore = zerosLeft + onesRight;

    // Update maximum score if needed
    if (currentScore > maxScore) {
      maxScore = currentScore;
    }
  }

  return maxScore;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maxScore(String s) {
        /**
         * Calculate the maximum score after splitting a binary string.
         *
         * The score is defined as:
         * (number of zeros in left substring) + (number of ones in right substring)
         *
         * @param s Binary string containing only '0' and '1'
         * @return Maximum possible score
         */

        // Count total ones in the entire string
        int totalOnes = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '1') {
                totalOnes++;
            }
        }

        // Initialize counters
        int zerosLeft = 0;
        int onesRight = totalOnes;
        int maxScore = 0;

        // Try every split position (from 1 to n-1)
        // We stop at s.length()-1 because right substring must be non-empty
        for (int i = 0; i < s.length() - 1; i++) {
            // Update counts based on current character
            if (s.charAt(i) == '0') {
                zerosLeft++;
            } else {  // s.charAt(i) == '1'
                onesRight--;
            }

            // Calculate score for current split
            int currentScore = zerosLeft + onesRight;

            // Update maximum score if needed
            if (currentScore > maxScore) {
                maxScore = currentScore;
            }
        }

        return maxScore;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string: one to count total ones (O(n)), and one to try all split positions (O(n))
- Each pass does constant work per character, so overall O(n)

**Space Complexity: O(1)**

- We only use a few integer variables (`total_ones`, `zeros_left`, `ones_right`, `max_score`)
- No additional data structures that grow with input size

## Common Mistakes

1. **Including the last character as a split point**: Remember the right substring must be non-empty, so we can't split after the last character. The loop should run from `0` to `n-2` (or `i < n-1`).

2. **Forgetting to update `ones_right` when moving the split**: When we encounter a '1', it moves from the right substring to the left, so `ones_right` should decrease. Some candidates only update `zeros_left` and forget to adjust `ones_right`.

3. **Initializing with wrong values**: `ones_right` should start as the total number of ones in the entire string, not zero. If initialized to zero, you'd need to add logic to count ones in the right substring separately.

4. **Using substring operations**: Some candidates try to create actual substrings at each split, which creates O(n²) time and O(n) space. We only need counts, not the substrings themselves.

## When You'll See This Pattern

This problem uses a **running sum/count** pattern that appears in many array/string problems where you need to compute something based on partitions of the data. Similar problems include:

1. **Partition Array Into Three Parts With Equal Sum (LeetCode 1013)**: Here you need to find split points where prefix sums equal specific values. The technique of maintaining running sums is identical.

2. **Find Pivot Index (LeetCode 724)**: Find an index where the sum of elements to the left equals the sum to the right. You precompute total sum and maintain left sum while iterating.

3. **Product of Array Except Self (LeetCode 238)**: While more complex, it uses similar prefix/suffix accumulation thinking—computing products of all elements except the current one.

The core pattern is: when you need to compute something about all possible splits/partitions, avoid recomputing from scratch by maintaining running totals.

## Key Takeaways

1. **Prefix sums transform O(n²) to O(n)**: When you need to evaluate all partitions of an array/string, precomputing running totals can eliminate nested loops.

2. **Think in terms of what changes incrementally**: As you move the split point one position, only the character at that position affects your counts. Everything else stays the same.

3. **Binary string problems often simplify to counting**: With only two possible values, many operations reduce to simple increment/decrement operations on counters.

[Practice this problem on CodeJeet](/problem/maximum-score-after-splitting-a-string)
