---
title: "How to Solve Minimum Recolors to Get K Consecutive Black Blocks — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Recolors to Get K Consecutive Black Blocks. Easy difficulty, 68.6% acceptance rate. Topics: String, Sliding Window."
date: "2028-07-05"
category: "dsa-patterns"
tags: ["minimum-recolors-to-get-k-consecutive-black-blocks", "string", "sliding-window", "easy"]
---

# How to Solve Minimum Recolors to Get K Consecutive Black Blocks

This problem asks us to find the minimum number of white blocks we need to recolor to black in order to create a substring of exactly `k` consecutive black blocks. While conceptually simple, it's an excellent introduction to the sliding window pattern—a fundamental technique for solving substring problems efficiently. The tricky part is recognizing that we're essentially counting white blocks within a fixed-size window and finding the window with the fewest whites.

## Visual Walkthrough

Let's walk through an example step by step to build intuition. Suppose we have:

- `blocks = "WBBWWBBWBB"`
- `k = 3`

We need to find a window of size 3 that contains the fewest white blocks ('W'), since those are the ones we'd need to recolor.

**Step 1:** Look at the first window of size 3: `"WBB"`

- White count = 1 (the first 'W')
- This would require 1 recolor

**Step 2:** Slide the window right by 1: `"BBW"`

- White count = 1 (the 'W' at position 3)
- Still requires 1 recolor

**Step 3:** Slide again: `"BWW"`

- White count = 2 (positions 3 and 4)
- Requires 2 recolors

**Step 4:** Continue sliding: `"WWB"`

- White count = 2
- Requires 2 recolors

**Step 5:** Next window: `"WBB"`

- White count = 1
- Requires 1 recolor

**Step 6:** Next window: `"BBW"`

- White count = 1
- Requires 1 recolor

**Step 7:** Next window: `"BWB"`

- White count = 1
- Requires 1 recolor

**Step 8:** Final window: `"WBB"`

- White count = 1
- Requires 1 recolor

The minimum white count we found was 1, so the answer is 1. We can achieve 3 consecutive black blocks by recoloring just one white block (for example, in the first window `"WBB"`, we'd recolor the 'W' to 'B').

## Brute Force Approach

A naive solution would check every possible substring of length `k` in the `blocks` string. For each substring, we'd count how many 'W' characters it contains, then take the minimum of these counts.

The brute force algorithm would look like:

1. Initialize `min_recolors` to a large number (like infinity)
2. For each starting index `i` from 0 to `n-k` (where `n` is the length of `blocks`):
   - Count the number of 'W' characters in `blocks[i:i+k]`
   - Update `min_recolors` if this count is smaller
3. Return `min_recolors`

**Why this is inefficient:**

- Time complexity: O(n × k) where n is the length of the string
- For each of the (n-k+1) windows, we're scanning k characters
- If k is close to n, this approaches O(n²) time
- We're doing redundant work by recounting characters that overlap between consecutive windows

The sliding window optimization avoids this redundancy by maintaining a running count as we slide the window.

## Optimal Solution

The optimal solution uses a sliding window approach. We maintain a window of size `k` that slides through the string, and we efficiently update the count of white blocks as the window moves. The key insight is that when we slide the window one position to the right:

- We subtract 1 from our white count if the character leaving the window was 'W'
- We add 1 to our white count if the character entering the window is 'W'

This allows us to update our count in O(1) time instead of O(k) time.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumRecolors(blocks: str, k: int) -> int:
    """
    Returns the minimum number of white blocks that need to be recolored
    to get k consecutive black blocks.

    Approach: Sliding window - we maintain a window of size k and count
    the number of white blocks in each window, tracking the minimum.
    """
    n = len(blocks)

    # Count white blocks in the first window
    white_count = 0
    for i in range(k):
        if blocks[i] == 'W':
            white_count += 1

    # Initialize minimum with the count from first window
    min_recolors = white_count

    # Slide the window from position 1 to n-k
    for i in range(1, n - k + 1):
        # Remove the character leaving the window (at position i-1)
        if blocks[i - 1] == 'W':
            white_count -= 1

        # Add the character entering the window (at position i+k-1)
        if blocks[i + k - 1] == 'W':
            white_count += 1

        # Update minimum if current window has fewer white blocks
        min_recolors = min(min_recolors, white_count)

    return min_recolors
```

```javascript
// Time: O(n) | Space: O(1)
function minimumRecolors(blocks, k) {
  /**
   * Returns the minimum number of white blocks that need to be recolored
   * to get k consecutive black blocks.
   *
   * Approach: Sliding window - we maintain a window of size k and count
   * the number of white blocks in each window, tracking the minimum.
   */
  const n = blocks.length;

  // Count white blocks in the first window
  let whiteCount = 0;
  for (let i = 0; i < k; i++) {
    if (blocks[i] === "W") {
      whiteCount++;
    }
  }

  // Initialize minimum with the count from first window
  let minRecolors = whiteCount;

  // Slide the window from position 1 to n-k
  for (let i = 1; i <= n - k; i++) {
    // Remove the character leaving the window (at position i-1)
    if (blocks[i - 1] === "W") {
      whiteCount--;
    }

    // Add the character entering the window (at position i+k-1)
    if (blocks[i + k - 1] === "W") {
      whiteCount++;
    }

    // Update minimum if current window has fewer white blocks
    minRecolors = Math.min(minRecolors, whiteCount);
  }

  return minRecolors;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumRecolors(String blocks, int k) {
        /**
         * Returns the minimum number of white blocks that need to be recolored
         * to get k consecutive black blocks.
         *
         * Approach: Sliding window - we maintain a window of size k and count
         * the number of white blocks in each window, tracking the minimum.
         */
        int n = blocks.length();

        // Count white blocks in the first window
        int whiteCount = 0;
        for (int i = 0; i < k; i++) {
            if (blocks.charAt(i) == 'W') {
                whiteCount++;
            }
        }

        // Initialize minimum with the count from first window
        int minRecolors = whiteCount;

        // Slide the window from position 1 to n-k
        for (int i = 1; i <= n - k; i++) {
            // Remove the character leaving the window (at position i-1)
            if (blocks.charAt(i - 1) == 'W') {
                whiteCount--;
            }

            // Add the character entering the window (at position i+k-1)
            if (blocks.charAt(i + k - 1) == 'W') {
                whiteCount++;
            }

            // Update minimum if current window has fewer white blocks
            minRecolors = Math.min(minRecolors, whiteCount);
        }

        return minRecolors;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string exactly once when counting the first window (O(k))
- Then we slide the window through the remaining n-k positions (O(n-k))
- Total: O(k + (n-k)) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space: variables for `white_count`, `min_recolors`, and loop indices
- No additional data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors in window boundaries:** The most common mistake is getting the indices wrong when sliding the window. Remember:
   - When the window starts at index `i`, it ends at index `i + k - 1`
   - The character leaving the window is at index `i - 1`
   - The loop should run while `i <= n - k` (inclusive)

2. **Not handling the case when k > n:** While the problem constraints likely prevent this, it's good practice to add a check. If `k > n`, we can't form a window of size k, so we might return the count of all white blocks or handle it according to problem requirements.

3. **Initializing min_recolors incorrectly:** Some candidates initialize `min_recolors` to 0, but the correct initialization should be the white count from the first window. If you initialize to 0, you might incorrectly return 0 even when no window has 0 white blocks.

4. **Using substring operations unnecessarily:** Some candidates extract substrings for each window (e.g., `blocks[i:i+k]`) and then count whites in that substring. This defeats the purpose of the sliding window optimization and brings us back to O(n×k) time complexity.

## When You'll See This Pattern

The sliding window pattern appears in many substring and subarray problems where you need to find a contiguous segment that satisfies certain conditions. This pattern is particularly useful when:

1. **The problem asks for something about a contiguous subarray/substring of fixed size**
2. **You need to optimize from O(n×k) to O(n) by avoiding redundant calculations**

Related LeetCode problems that use similar sliding window techniques:

1. **Max Consecutive Ones III (Medium):** Very similar pattern—find the longest subarray containing at most k zeros. Instead of minimizing whites in a fixed window, we maximize window size with a constraint on zeros.

2. **Maximum Number of Vowels in a Substring of Given Length (Easy):** Almost identical structure—find the maximum number of vowels in any substring of length k. Just change 'W' to vowels and maximize instead of minimize.

3. **Maximum Points You Can Obtain from Cards (Medium):** A more advanced sliding window problem where you take cards from either end. The connection is in maintaining a running sum as you slide through possibilities.

## Key Takeaways

1. **Sliding window is the go-to pattern for fixed-size substring problems:** When you need to examine all contiguous subarrays of a fixed length, think sliding window to avoid O(n×k) time complexity.

2. **The core optimization is maintaining a running count:** Instead of recounting everything for each window, update your count by subtracting what leaves and adding what enters the window.

3. **Pay attention to boundary conditions:** Getting the indices right is crucial—draw out small examples to verify your index calculations before coding.

Related problems: [Max Consecutive Ones III](/problem/max-consecutive-ones-iii), [Maximum Points You Can Obtain from Cards](/problem/maximum-points-you-can-obtain-from-cards), [Maximum Number of Vowels in a Substring of Given Length](/problem/maximum-number-of-vowels-in-a-substring-of-given-length)
