---
title: "How to Solve Smallest Substring With Identical Characters II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Smallest Substring With Identical Characters II. Hard difficulty, 40.2% acceptance rate. Topics: String, Binary Search."
date: "2026-07-30"
category: "dsa-patterns"
tags: ["smallest-substring-with-identical-characters-ii", "string", "binary-search", "hard"]
---

# How to Solve Smallest Substring With Identical Characters II

You're given a binary string and a limited number of flip operations. Your goal is to find the smallest possible substring length where all characters are identical after performing at most `numOps` flips. The challenge lies in efficiently determining how many flips are needed to make any substring uniform, then finding the smallest possible substring length that can be achieved within the operation limit.

## Visual Walkthrough

Let's trace through an example: `s = "110010"` with `numOps = 2`.

We want to find the smallest substring length where all characters can be made identical with ≤2 flips. Let's think about what this means:

1. **For a substring to be all '0's**: We need to flip all the '1's in that substring to '0'
2. **For a substring to be all '1's**: We need to flip all the '0's in that substring to '1'

Consider substring `s[0:3] = "110"`:

- To make it all '0's: Need to flip positions 0 and 1 (2 flips)
- To make it all '1's: Need to flip position 2 (1 flip)
- Minimum flips needed = min(2, 1) = 1 flip

Now consider substring `s[2:5] = "001"`:

- To make it all '0's: Need to flip position 4 (1 flip)
- To make it all '1's: Need to flip positions 2 and 3 (2 flips)
- Minimum flips needed = min(1, 2) = 1 flip

The key insight: For any substring, the minimum flips needed = min(number of '1's, number of '0's). This is because we can either flip all '1's to '0' OR all '0's to '1', whichever requires fewer flips.

Our task: Find the smallest substring length where min(# of '1's, # of '0's) ≤ numOps.

## Brute Force Approach

A naive solution would check every possible substring:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Count the number of '1's in substring s[i:j+1]
4. Calculate flips needed = min(count_ones, length - count_ones)
5. If flips needed ≤ numOps, update the minimum length

This approach has O(n³) time complexity (O(n²) substrings × O(n) to count ones for each). For n up to 10⁵, this is far too slow.

Even with prefix sums to count ones in O(1) time per substring, we'd still have O(n²) time complexity, which is still too slow for large inputs.

## Optimized Approach

The key optimization uses **binary search** on the answer (substring length):

1. **Observation**: If we can achieve a substring of length `L` with ≤numOps flips, then we can certainly achieve any substring shorter than `L` (since shorter substrings require fewer flips to make uniform). This monotonic property enables binary search.

2. **Binary Search Setup**:
   - Search space: possible substring lengths from 1 to n
   - For each candidate length `mid`, check if there exists any substring of length `mid` that can be made uniform with ≤numOps flips
   - If yes, try smaller lengths (move right = mid - 1)
   - If no, try larger lengths (move left = mid + 1)

3. **Checking a specific length efficiently**:
   - Use a sliding window of fixed size `mid`
   - Maintain count of '1's in the current window
   - Minimum flips needed = min(count_ones, window_size - count_ones)
   - If any window has min(count_ones, window_size - count_ones) ≤ numOps, then length `mid` is feasible

This gives us O(n log n) time complexity: O(log n) binary search iterations × O(n) to check each length.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1)
def smallestSubstring(self, s: str, numOps: int) -> int:
    """
    Finds the smallest substring length that can be made uniform
    with at most numOps flip operations.

    Approach: Binary search on the answer (substring length) with
    sliding window validation.
    """
    n = len(s)

    # Helper function to check if a substring of given length exists
    # that can be made uniform with ≤ numOps flips
    def can_make_uniform(length: int) -> bool:
        """Returns True if any substring of given length can be made uniform."""
        if length == 0:
            return True

        # Count ones in the first window
        ones_count = 0
        for i in range(length):
            if s[i] == '1':
                ones_count += 1

        # Check if first window works
        # Minimum flips = min(ones to flip to 0, zeros to flip to 1)
        if min(ones_count, length - ones_count) <= numOps:
            return True

        # Slide the window across the string
        for i in range(length, n):
            # Remove leftmost character from window
            if s[i - length] == '1':
                ones_count -= 1
            # Add new character to window
            if s[i] == '1':
                ones_count += 1

            # Check if current window works
            if min(ones_count, length - ones_count) <= numOps:
                return True

        return False

    # Binary search for the smallest feasible length
    left, right = 1, n
    answer = n  # Worst case: need the whole string

    while left <= right:
        mid = (left + right) // 2

        if can_make_uniform(mid):
            # Found a feasible length, try smaller
            answer = mid
            right = mid - 1
        else:
            # Current length not feasible, try larger
            left = mid + 1

    return answer
```

```javascript
// Time: O(n log n) | Space: O(1)
function smallestSubstring(s, numOps) {
  /**
   * Finds the smallest substring length that can be made uniform
   * with at most numOps flip operations.
   */
  const n = s.length;

  // Helper function to check if a substring of given length exists
  // that can be made uniform with ≤ numOps flips
  const canMakeUniform = (length) => {
    if (length === 0) return true;

    // Count ones in the first window
    let onesCount = 0;
    for (let i = 0; i < length; i++) {
      if (s[i] === "1") onesCount++;
    }

    // Check if first window works
    // Minimum flips = min(ones to flip to 0, zeros to flip to 1)
    if (Math.min(onesCount, length - onesCount) <= numOps) {
      return true;
    }

    // Slide the window across the string
    for (let i = length; i < n; i++) {
      // Remove leftmost character from window
      if (s[i - length] === "1") onesCount--;
      // Add new character to window
      if (s[i] === "1") onesCount++;

      // Check if current window works
      if (Math.min(onesCount, length - onesCount) <= numOps) {
        return true;
      }
    }

    return false;
  };

  // Binary search for the smallest feasible length
  let left = 1,
    right = n;
  let answer = n; // Worst case: need the whole string

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (canMakeUniform(mid)) {
      // Found a feasible length, try smaller
      answer = mid;
      right = mid - 1;
    } else {
      // Current length not feasible, try larger
      left = mid + 1;
    }
  }

  return answer;
}
```

```java
// Time: O(n log n) | Space: O(1)
class Solution {
    public int smallestSubstring(String s, int numOps) {
        /**
         * Finds the smallest substring length that can be made uniform
         * with at most numOps flip operations.
         */
        int n = s.length();

        // Binary search for the smallest feasible length
        int left = 1, right = n;
        int answer = n;  // Worst case: need the whole string

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (canMakeUniform(s, numOps, mid)) {
                // Found a feasible length, try smaller
                answer = mid;
                right = mid - 1;
            } else {
                // Current length not feasible, try larger
                left = mid + 1;
            }
        }

        return answer;
    }

    private boolean canMakeUniform(String s, int numOps, int length) {
        /** Returns true if any substring of given length can be made uniform. */
        if (length == 0) return true;

        int n = s.length();

        // Count ones in the first window
        int onesCount = 0;
        for (int i = 0; i < length; i++) {
            if (s.charAt(i) == '1') onesCount++;
        }

        // Check if first window works
        // Minimum flips = min(ones to flip to 0, zeros to flip to 1)
        if (Math.min(onesCount, length - onesCount) <= numOps) {
            return true;
        }

        // Slide the window across the string
        for (int i = length; i < n; i++) {
            // Remove leftmost character from window
            if (s.charAt(i - length) == '1') onesCount--;
            // Add new character to window
            if (s.charAt(i) == '1') onesCount++;

            // Check if current window works
            if (Math.min(onesCount, length - onesCount) <= numOps) {
                return true;
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Binary search runs O(log n) iterations
- Each iteration uses O(n) time to slide a window across the string
- Total: O(n log n)

**Space Complexity: O(1)**

- We only use a few integer variables (onesCount, left, right, mid, answer)
- No additional data structures proportional to input size

## Common Mistakes

1. **Forgetting that we can flip to either all '0's OR all '1's**: Some candidates only consider flipping to one type, missing that min(count_ones, count_zeros) gives the minimum flips needed.

2. **Incorrect binary search boundaries**: Starting with left=0 when minimum substring length is 1, or not handling the case where no substring of length < n works (should return n).

3. **Inefficient window maintenance**: Recalculating ones count from scratch for each window position instead of sliding window update, resulting in O(n²) time instead of O(n).

4. **Off-by-one errors in sliding window**: When removing the left character, using `s[i-length+1]` instead of `s[i-length]`, or incorrect loop ranges for the sliding phase.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Binary Search on Answer**: When you need to find the minimum/maximum value satisfying a condition, and the condition is monotonic (if X works, then anything > X also works, or vice versa).
   - Related problems:
     - **LeetCode 410 "Split Array Largest Sum"** - Find minimum largest sum when splitting array into k parts
     - **LeetCode 875 "Koko Eating Bananas"** - Find minimum eating speed to finish bananas in h hours

2. **Sliding Window with Fixed Size**: When you need to check all subarrays of a specific length efficiently.
   - Related problems:
     - **LeetCode 209 "Minimum Size Subarray Sum"** - Find minimal length subarray with sum ≥ target
     - **LeetCode 567 "Permutation in String"** - Check if s2 contains a permutation of s1

## Key Takeaways

1. **When you need to find a minimum/maximum value and testing a candidate value is easier than finding the value directly**, consider binary search on the answer. The monotonic property is crucial.

2. **For substring problems with fixed length constraints**, sliding window is often the optimal approach to avoid O(n²) solutions.

3. **Always consider both transformation directions** in problems with binary states. The optimal solution often involves choosing the cheaper of two symmetric operations.

[Practice this problem on CodeJeet](/problem/smallest-substring-with-identical-characters-ii)
