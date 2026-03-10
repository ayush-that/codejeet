---
title: "How to Solve Russian Doll Envelopes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Russian Doll Envelopes. Hard difficulty, 37.7% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Sorting."
date: "2028-02-04"
category: "dsa-patterns"
tags: ["russian-doll-envelopes", "array", "binary-search", "dynamic-programming", "hard"]
---

# How to Solve Russian Doll Envelopes

The Russian Doll Envelopes problem asks us to find the maximum number of envelopes that can be nested inside each other, where one envelope can fit into another only if both its width and height are strictly greater. This problem is tricky because it requires handling two dimensions simultaneously, and a naive approach would be far too slow for typical constraints. The key insight is recognizing this as a 2D variation of the Longest Increasing Subsequence problem.

## Visual Walkthrough

Let's trace through a concrete example: `envelopes = [[5,4],[6,4],[6,7],[2,3]]`

**Step 1: Understanding the constraint**
An envelope `[w1, h1]` can fit into `[w2, h2]` if `w1 < w2` AND `h1 < h2`. Both conditions must be strictly satisfied.

**Step 2: Sorting strategy**
If we sort by width first, we can focus on finding increasing heights. But there's a catch: what if two envelopes have the same width? They can't nest into each other (since width must be strictly greater), so we need to handle this carefully.

Let's sort by width ascending, and for equal widths, sort by height _descending_:

- Original: `[[5,4],[6,4],[6,7],[2,3]]`
- Sorted: `[[2,3],[5,4],[6,7],[6,4]]`

Why height descending for equal widths? This prevents envelopes with the same width from being included in the same sequence. With `[6,7]` before `[6,4]`, if we're looking for increasing heights, we'll pick at most one of them.

**Step 3: Finding the longest increasing subsequence of heights**
After sorting, we extract just the heights: `[3, 4, 7, 4]`

Now we need the longest increasing subsequence (LIS) of these heights:

- `[3]` → length 1
- `[3, 4]` → length 2
- `[3, 4, 7]` → length 3
- Can't add the second `4` because it's not greater than `7`

The LIS is `[3, 4, 7]` with length 3, which corresponds to envelopes `[[2,3],[5,4],[6,7]]`.

**Step 4: Verification**

- `[2,3]` fits into `[5,4]`? Yes, 2<5 and 3<4
- `[5,4]` fits into `[6,7]`? Yes, 5<6 and 4<7
- Maximum nested envelopes = 3

## Brute Force Approach

The brute force approach would consider all possible sequences of envelopes. For each envelope, we could try to build all possible chains starting from that envelope, recursively checking which other envelopes can fit inside it. This is essentially a depth-first search through all possible sequences.

The problem with this approach is its exponential time complexity. With `n` envelopes, there are `2^n` possible subsets to consider, and for each valid sequence, we need to verify the nesting condition for each pair. Even with memoization, this would be too slow for `n` up to 10^5.

A naive candidate might try to sort by area (width × height) and then greedily pick envelopes. This fails because area alone doesn't guarantee both dimensions increase. For example, `[1,10]` has area 10 and `[5,2]` has area 10, but neither fits into the other.

## Optimized Approach

The key insight is that this problem reduces to finding the Longest Increasing Subsequence (LIS) after proper sorting. Here's the step-by-step reasoning:

1. **Sorting strategy**: Sort envelopes by width ascending. For envelopes with the same width, sort by height descending. This ensures that when we look for increasing heights, we won't accidentally include two envelopes with the same width in our sequence (which would be invalid since width must be strictly increasing).

2. **Why this works**: After sorting, any valid sequence of nested envelopes will have strictly increasing widths (because of the sort order) and strictly increasing heights (because of the nesting condition). The problem reduces to finding the longest sequence of increasing heights in the sorted list.

3. **LIS optimization**: The naive LIS algorithm takes O(n²) time, which is still too slow for large inputs. We need the O(n log n) LIS algorithm using binary search and patience sorting.

4. **Patience sorting intuition**: We maintain a list `tails` where `tails[i]` is the smallest possible ending value of all increasing subsequences of length `i+1`. As we process each height, we use binary search to find where it belongs in `tails`:
   - If it's larger than all endings, append it (increasing our longest sequence)
   - Otherwise, replace the first element in `tails` that's ≥ current height

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maxEnvelopes(envelopes):
    """
    Find the maximum number of envelopes that can be nested.

    Approach:
    1. Sort envelopes by width ascending, and for equal widths,
       sort by height descending. This prevents envelopes with
       same width from being included in the sequence.
    2. Extract heights and find the Longest Increasing Subsequence (LIS)
       using the O(n log n) binary search approach.

    Args:
        envelopes: List of [width, height] pairs

    Returns:
        Maximum number of nested envelopes
    """
    # Step 1: Sort envelopes
    # Sort by width ascending, then by height descending for equal widths
    # This ensures that when we have same width, the taller envelope comes first
    # so we won't accidentally include two envelopes with same width in LIS
    envelopes.sort(key=lambda x: (x[0], -x[1]))

    # Step 2: Extract heights after sorting
    heights = [h for _, h in envelopes]

    # Step 3: Find LIS of heights using binary search (patience sorting)
    # tails[i] = smallest ending value of all increasing subsequences of length i+1
    tails = []

    for height in heights:
        # Use binary search to find position where height should be placed
        left, right = 0, len(tails)

        while left < right:
            mid = (left + right) // 2
            if tails[mid] < height:
                left = mid + 1  # Height is larger, search right half
            else:
                right = mid     # Height is smaller or equal, search left half

        # If position is beyond current tails array, append new element
        if left == len(tails):
            tails.append(height)
        else:
            # Replace the element at found position
            tails[left] = height

    # The length of tails is the length of LIS
    return len(tails)
```

```javascript
// Time: O(n log n) | Space: O(n)
function maxEnvelopes(envelopes) {
  /**
   * Find the maximum number of envelopes that can be nested.
   *
   * Approach:
   * 1. Sort envelopes by width ascending, and for equal widths,
   *    sort by height descending.
   * 2. Extract heights and find LIS using binary search.
   *
   * @param {number[][]} envelopes - Array of [width, height] pairs
   * @return {number} Maximum number of nested envelopes
   */

  // Step 1: Sort envelopes
  // Sort by width ascending, then by height descending for equal widths
  envelopes.sort((a, b) => {
    if (a[0] === b[0]) {
      // For equal widths, sort by height descending
      return b[1] - a[1];
    }
    // Otherwise sort by width ascending
    return a[0] - b[0];
  });

  // Step 2: Extract heights after sorting
  const heights = envelopes.map((env) => env[1]);

  // Step 3: Find LIS using binary search (patience sorting)
  // tails[i] = smallest ending value of all increasing subsequences of length i+1
  const tails = [];

  for (const height of heights) {
    // Binary search to find position where height should be placed
    let left = 0;
    let right = tails.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < height) {
        left = mid + 1; // Height is larger, search right half
      } else {
        right = mid; // Height is smaller or equal, search left half
      }
    }

    // If position is beyond current tails array, append new element
    if (left === tails.length) {
      tails.push(height);
    } else {
      // Replace the element at found position
      tails[left] = height;
    }
  }

  // The length of tails is the length of LIS
  return tails.length;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

class Solution {
    public int maxEnvelopes(int[][] envelopes) {
        /**
         * Find the maximum number of envelopes that can be nested.
         *
         * Approach:
         * 1. Sort envelopes by width ascending, and for equal widths,
         *    sort by height descending.
         * 2. Extract heights and find LIS using binary search.
         *
         * @param envelopes Array of [width, height] pairs
         * @return Maximum number of nested envelopes
         */

        // Step 1: Sort envelopes
        // Sort by width ascending, then by height descending for equal widths
        Arrays.sort(envelopes, (a, b) -> {
            if (a[0] == b[0]) {
                // For equal widths, sort by height descending
                return b[1] - a[1];
            }
            // Otherwise sort by width ascending
            return a[0] - b[0];
        });

        // Step 2: Extract heights after sorting
        int[] heights = new int[envelopes.length];
        for (int i = 0; i < envelopes.length; i++) {
            heights[i] = envelopes[i][1];
        }

        // Step 3: Find LIS using binary search (patience sorting)
        // tails[i] = smallest ending value of all increasing subsequences of length i+1
        int[] tails = new int[heights.length];
        int size = 0;  // Current length of LIS

        for (int height : heights) {
            // Binary search to find position where height should be placed
            int left = 0, right = size;

            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails[mid] < height) {
                    left = mid + 1;  // Height is larger, search right half
                } else {
                    right = mid;     // Height is smaller or equal, search left half
                }
            }

            // Replace or append at the found position
            tails[left] = height;

            // If we appended at the end, increase size
            if (left == size) {
                size++;
            }
        }

        // The size is the length of LIS
        return size;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the envelopes takes O(n log n) time
- Finding the LIS using binary search takes O(n log n) time
  - We process n envelopes
  - For each envelope, we do a binary search on the tails array (O(log n))
- Total: O(n log n) + O(n log n) = O(n log n)

**Space Complexity: O(n)**

- We need O(n) space for the sorted heights array
- We need O(n) space for the tails array in the worst case (when the entire sequence is increasing)
- Total: O(n)

## Common Mistakes

1. **Sorting by height ascending for equal widths**: This is the most common mistake. If you sort `[6,4]` before `[6,7]`, you might include both in your LIS since 4 < 7. But this is invalid because they have the same width. Always sort heights descending for equal widths.

2. **Using O(n²) LIS algorithm**: The problem constraints often make O(n²) too slow. Candidates who implement the DP LIS solution will typically time out on larger test cases. Always use the binary search LIS algorithm for problems with n up to 10^5.

3. **Forgetting to handle empty input**: Always check if the input array is empty and return 0 immediately. The code above handles this correctly since an empty array will result in an empty tails array.

4. **Using ≤ instead of < for comparisons**: Remember that envelopes must have strictly greater dimensions to nest. Using ≤ in comparisons would allow envelopes with equal dimensions to nest, which is incorrect.

## When You'll See This Pattern

This pattern of reducing a 2D problem to 1D LIS appears in several other LeetCode problems:

1. **Longest Increasing Subsequence (Medium)**: The core technique used here. Mastering the O(n log n) LIS algorithm is essential for solving Russian Doll Envelopes.

2. **The Number of Weak Characters in the Game (Medium)**: Similar sorting strategy - sort by one attribute ascending and another descending, then process in a single pass.

3. **Maximum Length of Pair Chain (Medium)**: Another variation where you need to find the longest chain of pairs [a, b] where b < c for consecutive pairs.

4. **Non-overlapping Intervals (Medium)**: While not exactly the same, it uses similar greedy sorting strategies.

The key pattern to recognize: when you need to find a sequence where elements must satisfy constraints in multiple dimensions, consider sorting by one dimension and then finding LIS in the other dimension.

## Key Takeaways

1. **Reducing dimensions**: Many 2D problems can be reduced to 1D by sorting on one dimension and then applying a known 1D algorithm (like LIS) on the other dimension.

2. **Sorting trick for strict inequalities**: When you need strictly increasing sequences in multiple dimensions and elements can have equal values in one dimension, sort that dimension in descending order to prevent invalid sequences.

3. **LIS with binary search**: The O(n log n) LIS algorithm using binary search and patience sorting is a fundamental pattern that appears in many problems. Memorize this algorithm and understand how it works.

Remember: Russian Doll Envelopes is essentially the Longest Increasing Subsequence problem in disguise. Once you recognize this connection, the solution becomes much clearer.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [The Number of Weak Characters in the Game](/problem/the-number-of-weak-characters-in-the-game), [Longest Non-decreasing Subarray From Two Arrays](/problem/longest-non-decreasing-subarray-from-two-arrays)
