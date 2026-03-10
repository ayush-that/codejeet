---
title: "How to Solve Previous Permutation With One Swap — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Previous Permutation With One Swap. Medium difficulty, 49.3% acceptance rate. Topics: Array, Greedy."
date: "2028-08-18"
category: "dsa-patterns"
tags: ["previous-permutation-with-one-swap", "array", "greedy", "medium"]
---

## How to Solve Previous Permutation With One Swap

We need to find the lexicographically largest permutation that's smaller than the given array, achievable with exactly one swap. The tricky part is that we must find the _largest_ smaller permutation, not just any smaller permutation, and we can only swap two elements once. This requires careful reasoning about lexicographic order and finding the right swap position.

## Visual Walkthrough

Let's trace through `arr = [3, 1, 1, 3]` step by step:

1. **Find the first position where we can make the array smaller**  
   We scan from right to left, looking for the first index `i` where `arr[i] > arr[i+1]`. Why? Because if `arr[i] <= arr[i+1]`, swapping `i` with anything to its right would make the array larger or equal at position `i`, not smaller.  
   In our example:
   - Compare `arr[3]=3` and `arr[2]=1`: 3 > 1 ✓ Found! `i = 2`  
     Wait — actually we need to check carefully. Let's scan properly:
   - `i=3`: No element to the right, skip
   - `i=2`: `arr[2]=1`, `arr[3]=3`: 1 < 3 (not >)
   - `i=1`: `arr[1]=1`, `arr[2]=1`: 1 = 1 (not >)
   - `i=0`: `arr[0]=3`, `arr[1]=1`: 3 > 1 ✓ Found! `i = 0`

2. **Find the best element to swap with**  
   Now we look to the right of index `i` (positions `i+1` to `n-1`) for the largest element that's _smaller than_ `arr[i]`. Why the largest smaller element? Because we want the resulting permutation to be as large as possible while still being smaller than original.  
   In our example with `i=0` (`arr[0]=3`), elements to the right are `[1, 1, 3]`.
   - Elements smaller than 3: `1` and `1`
   - Largest among them: `1`
   - We need the _rightmost_ occurrence of this value to get the lexicographically largest result (more on this later). The rightmost `1` is at index 2.

3. **Perform the swap**  
   Swap `arr[0]=3` with `arr[2]=1`: `[1, 1, 3, 3]`  
   But wait — is this actually smaller than original `[3, 1, 1, 3]`?  
   Compare lexicographically:
   - First element: 1 < 3 ✓  
     So yes, it's smaller.

4. **Check if this is the largest smaller permutation**  
   What if we swapped with the other `1` at index 1? We'd get `[1, 3, 1, 3]`. Compare with our result `[1, 1, 3, 3]`:
   - First element: both 1
   - Second element: 1 vs 3 → 1 < 3, so `[1, 1, 3, 3]` is actually smaller!  
     This reveals a subtlety: we need the _rightmost_ occurrence of the largest smaller value to get the lexicographically largest result.

## Brute Force Approach

A naive approach would try all possible swaps (O(n²) pairs), generate the resulting array for each swap, check if it's smaller than original, and keep track of the largest one found. This is O(n³) if we compare arrays naively, or O(n²) with careful implementation.

Why this fails:

1. **Too slow**: O(n²) for n up to 10⁴ is 10⁸ operations, which may time out
2. **Complex comparison**: Finding the "largest" among valid swaps requires careful lexicographic comparison
3. **Unnecessary work**: We can find the optimal swap directly without trying all possibilities

## Optimized Approach

The key insight is that lexicographic order is determined by the _first_ position where two arrays differ. To get the largest smaller permutation:

1. **Find where to break the non-decreasing pattern from the right**  
   Scan from right to left to find the first index `i` where `arr[i] > arr[i+1]`. If no such `i` exists, the array is already the smallest permutation (sorted in non-decreasing order), and we can't make it smaller with one swap.

2. **Find the optimal swap partner**  
   Look at all elements to the right of `i` (indices `i+1` to `n-1`). Among those elements that are _smaller than_ `arr[i]`, find the _largest_ one. If there are multiple occurrences of this largest smaller value, choose the _rightmost_ one (index `j`).

3. **Why rightmost?**  
   Consider `arr = [3, 1, 1, 3]` with `i=0`. The largest smaller value is `1`. If we swap with the leftmost `1` (index 1), we get `[1, 3, 1, 3]`. If we swap with the rightmost `1` (index 2), we get `[1, 1, 3, 3]`.  
   Compare these: at index 0 both are 1, at index 1: 1 vs 3 → `[1, 1, 3, 3]` is lexicographically larger because 1 < 3. The rightmost swap minimizes the "damage" to the prefix after the swap position.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def prevPermOpt1(arr):
    """
    Find the lexicographically largest permutation smaller than arr
    achievable with exactly one swap.

    Approach:
    1. Find the first position from right where we can decrease the array
    2. Find the largest smaller element to the right of that position
    3. Swap with the rightmost occurrence of that element
    """
    n = len(arr)

    # Step 1: Find the first index i from right where arr[i] > arr[i+1]
    # This is where we can make the array smaller by swapping arr[i]
    i = n - 2
    while i >= 0 and arr[i] <= arr[i + 1]:
        i -= 1

    # If no such index exists, array is already smallest permutation
    if i < 0:
        return arr

    # Step 2: Find the best element to swap with arr[i]
    # We need the largest element to the right of i that's < arr[i]
    # If multiple occurrences, choose the rightmost one
    j = i + 1
    max_smaller_idx = i + 1

    while j < n:
        # Check if arr[j] is a valid candidate (smaller than arr[i])
        if arr[j] < arr[i]:
            # Update if we found a larger smaller value
            if arr[j] > arr[max_smaller_idx]:
                max_smaller_idx = j
            # If equal value, choose the rightmost one
            elif arr[j] == arr[max_smaller_idx]:
                max_smaller_idx = j
        j += 1

    # Step 3: Perform the swap
    arr[i], arr[max_smaller_idx] = arr[max_smaller_idx], arr[i]

    return arr
```

```javascript
// Time: O(n) | Space: O(1)
function prevPermOpt1(arr) {
  const n = arr.length;

  // Step 1: Find first position from right where arr[i] > arr[i+1]
  let i = n - 2;
  while (i >= 0 && arr[i] <= arr[i + 1]) {
    i--;
  }

  // If no such position, array is already smallest permutation
  if (i < 0) {
    return arr;
  }

  // Step 2: Find best swap partner to the right of i
  let maxSmallerIdx = i + 1;

  // Scan all elements to the right of i
  for (let j = i + 1; j < n; j++) {
    // Element must be smaller than arr[i] to make permutation smaller
    if (arr[j] < arr[i]) {
      // Update if we found a larger smaller value
      if (arr[j] > arr[maxSmallerIdx]) {
        maxSmallerIdx = j;
      }
      // If equal value, choose the rightmost one
      else if (arr[j] === arr[maxSmallerIdx]) {
        maxSmallerIdx = j;
      }
    }
  }

  // Step 3: Perform the swap
  [arr[i], arr[maxSmallerIdx]] = [arr[maxSmallerIdx], arr[i]];

  return arr;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int[] prevPermOpt1(int[] arr) {
        int n = arr.length;

        // Step 1: Find first position from right where arr[i] > arr[i+1]
        int i = n - 2;
        while (i >= 0 && arr[i] <= arr[i + 1]) {
            i--;
        }

        // If no such position, array is already smallest permutation
        if (i < 0) {
            return arr;
        }

        // Step 2: Find best swap partner to the right of i
        int maxSmallerIdx = i + 1;

        // Scan all elements to the right of i
        for (int j = i + 1; j < n; j++) {
            // Element must be smaller than arr[i] to make permutation smaller
            if (arr[j] < arr[i]) {
                // Update if we found a larger smaller value
                if (arr[j] > arr[maxSmallerIdx]) {
                    maxSmallerIdx = j;
                }
                // If equal value, choose the rightmost one
                else if (arr[j] == arr[maxSmallerIdx]) {
                    maxSmallerIdx = j;
                }
            }
        }

        // Step 3: Perform the swap
        int temp = arr[i];
        arr[i] = arr[maxSmallerIdx];
        arr[maxSmallerIdx] = temp;

        return arr;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding index `i`: O(n) worst case (scan entire array from right)
- Finding optimal swap partner: O(n) worst case (scan from `i+1` to end)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a few variables (`i`, `j`, `max_smaller_idx`)
- The swap is performed in-place (modifies input array)

## Common Mistakes

1. **Forgetting to check if a smaller permutation exists**  
   If the array is already in non-decreasing order (smallest lexicographically), no single swap can make it smaller. Some candidates return a swapped array anyway instead of the original.

2. **Choosing the wrong swap partner**
   - Swapping with any element smaller than `arr[i]` gives a smaller permutation, but not necessarily the _largest_ smaller permutation
   - Choosing the leftmost occurrence of the largest smaller value instead of the rightmost one yields a lexicographically smaller result than optimal

3. **Incorrect comparison in the while loop**  
   Using `arr[i] < arr[i+1]` instead of `arr[i] <= arr[i+1]` fails for equal elements. Example: `[1, 1, 5]` — we can swap the first 1 with something to get a smaller permutation.

4. **Not handling duplicates correctly**  
   When multiple elements have the same value as the optimal swap candidate, choosing any but the rightmost one gives a suboptimal result. The rightmost choice preserves more of the original order after the swap point.

## When You'll See This Pattern

This problem uses the **"next/previous permutation"** pattern, which appears in:

1. **Next Permutation (LeetCode 31)** — Almost identical logic but for finding the next larger permutation
2. **Next Greater Element III (LeetCode 556)** — Same core algorithm applied to numbers instead of arrays
3. **Smallest Subsequence of Distinct Characters (LeetCode 1081)** — Uses similar monotonic stack/greedy reasoning

The pattern involves:

- Scanning from right to find the first "violation" of monotonicity
- Finding the optimal element to swap with
- Handling duplicates carefully

## Key Takeaways

1. **Lexicographic order is determined by the first differing position** — To minimize "damage" while making the array smaller, swap as far right as possible after finding where to break the pattern.

2. **Rightmost choice for duplicates** — When multiple candidates have the same value, choosing the rightmost one yields the lexicographically largest result because it preserves more of the original prefix.

3. **Monotonic scanning from right** — Many permutation problems are solved by scanning from the end to find where the monotonic pattern breaks.

[Practice this problem on CodeJeet](/problem/previous-permutation-with-one-swap)
