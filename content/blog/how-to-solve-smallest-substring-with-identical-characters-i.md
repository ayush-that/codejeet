---
title: "How to Solve Smallest Substring With Identical Characters I — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Smallest Substring With Identical Characters I. Hard difficulty, 20.4% acceptance rate. Topics: Array, Binary Search, Enumeration."
date: "2026-07-15"
category: "dsa-patterns"
tags:
  [
    "smallest-substring-with-identical-characters-i",
    "array",
    "binary-search",
    "enumeration",
    "hard",
  ]
---

# How to Solve Smallest Substring With Identical Characters I

You're given a binary string `s` and an integer `numOps`. You can flip bits (change '0' to '1' or vice versa) at most `numOps` times. Your goal is to find the **minimum possible length** of the longest substring consisting of identical characters after performing these operations. This problem is tricky because it combines binary string manipulation with optimization—you need to strategically use your limited operations to create the longest possible uniform substring, then minimize that length.

## Visual Walkthrough

Let's trace through `s = "1100011"` with `numOps = 2`:

**Initial string:** `1 1 0 0 0 1 1`

We want to minimize the length of the longest uniform substring after operations. Think about it this way: if we could make the entire string uniform, the longest substring would be length 7. But we only have 2 operations.

What if we target making all characters '0'? Let's count mismatches:

- Positions 0,1,5,6 are '1' but should be '0' → 4 mismatches
- We only have 2 operations, so we can't fix all 4

What if we target making all characters '1'?

- Positions 2,3,4 are '0' but should be '1' → 3 mismatches
- Still more than 2 operations

So we can't make the entire string uniform. But we don't need to! We just need to minimize the longest uniform substring. Maybe we can create a shorter uniform segment somewhere.

Let's try creating a uniform substring of length 4. Can we make any 4 consecutive characters identical with ≤2 operations?

Check substring `s[0:4] = "1100"`:

- To make all '0': need to flip positions 0,1 → 2 operations ✓
- To make all '1': need to flip positions 2,3 → 2 operations ✓

Check substring `s[1:5] = "1000"`:

- To make all '0': flip position 1 → 1 operation ✓
- To make all '1': flip positions 2,3,4 → 3 operations ✗

Check substring `s[2:6] = "0001"`:

- To make all '0': flip position 5 → 1 operation ✓

So with 2 operations, we can definitely create a uniform substring of length 4. Can we do better? Can we create length 5?

Check `s[0:5] = "11000"`:

- To make all '0': flip positions 0,1 → 2 operations ✓
- To make all '1': flip positions 2,3,4 → 3 operations ✗

Check `s[1:6] = "10001"`:

- To make all '0': flip positions 1,5 → 2 operations ✓
- To make all '1': flip positions 2,3,4 → 3 operations ✗

Check `s[2:7] = "00011"`:

- To make all '0': flip positions 5,6 → 2 operations ✓

So we can create length 5 with 2 operations! Can we do length 6?

Check `s[0:6] = "110001"`:

- To make all '0': flip positions 0,1,5 → 3 operations ✗
- To make all '1': flip positions 2,3,4 → 3 operations ✗

Check `s[1:7] = "100011"`:

- To make all '0': flip positions 1,5,6 → 3 operations ✗
- To make all '1': flip positions 2,3,4 → 3 operations ✗

So the minimum possible longest uniform substring length is 5.

## Brute Force Approach

A naive approach would be to:

1. Try every possible substring (O(n²) substrings)
2. For each substring, check if we can make it uniform with ≤numOps operations
3. Track the minimum length among all substrings we CAN make uniform

The problem? This is O(n³) if we naively count operations for each substring. Even with prefix sums to count operations in O(1), checking O(n²) substrings is too slow for n up to 10⁵.

What about trying all possible target lengths? For each possible length L from 1 to n, check if there exists a substring of length L that can be made uniform with ≤numOps operations. This gives us O(n²) if we check each length naively.

## Optimized Approach

The key insight: **We can use binary search on the answer!**

Why?

1. If we can create a uniform substring of length L, we can definitely create one of length L-1 (just take a smaller part of it)
2. If we cannot create a uniform substring of length L, we cannot create one of length L+1 either (since any longer substring would contain our failed length L substring)

This monotonic property means we can binary search for the minimum possible maximum length!

For a given candidate length L, how do we check if it's possible?

- We need to see if there exists ANY substring of length L that can be made uniform with ≤numOps operations
- For a substring to be all '0's, we need to flip all '1's in it
- For a substring to be all '1's, we need to flip all '0's in it
- We can use prefix sums to quickly count '1's (or '0's) in any substring

So the check becomes: For each starting position i, check substring s[i:i+L]:

- Count ones = prefixOnes[i+L] - prefixOnes[i]
- To make all '0's: operations = count ones
- To make all '1's: operations = L - count ones (since zeros = length - ones)
- If either ≤ numOps, then length L is possible

This check runs in O(n) for each L, and with binary search we try O(log n) different L values, giving us O(n log n) total.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def min_possible_length(s: str, numOps: int) -> int:
    """
    Returns the minimum possible length of the longest substring
    consisting of identical characters after at most numOps flips.
    """
    n = len(s)

    # Build prefix sum array for '1's
    # prefix_ones[i] = number of '1's in s[0:i] (first i characters)
    prefix_ones = [0] * (n + 1)
    for i in range(n):
        prefix_ones[i + 1] = prefix_ones[i] + (1 if s[i] == '1' else 0)

    # Helper function to check if we can achieve max length L
    def can_achieve_length(L: int) -> bool:
        """
        Returns True if there exists a substring of length L
        that can be made uniform with ≤ numOps operations.
        """
        # Check all possible starting positions for length L substring
        for i in range(n - L + 1):
            # Count number of '1's in substring s[i:i+L]
            ones_count = prefix_ones[i + L] - prefix_ones[i]

            # To make all '0's: flip all '1's → operations = ones_count
            # To make all '1's: flip all '0's → operations = L - ones_count
            if ones_count <= numOps or (L - ones_count) <= numOps:
                return True
        return False

    # Binary search for the minimum possible maximum length
    left, right = 1, n  # Possible answer range

    while left < right:
        mid = (left + right) // 2

        if can_achieve_length(mid):
            # If we can achieve length mid, try for smaller
            right = mid
        else:
            # If we cannot achieve length mid, we need larger
            left = mid + 1

    return left
```

```javascript
// Time: O(n log n) | Space: O(n)
function minPossibleLength(s, numOps) {
  const n = s.length;

  // Build prefix sum array for '1's
  // prefixOnes[i] = number of '1's in s[0:i) (first i characters)
  const prefixOnes = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefixOnes[i + 1] = prefixOnes[i] + (s[i] === "1" ? 1 : 0);
  }

  // Helper function to check if we can achieve max length L
  function canAchieveLength(L) {
    // Check all possible starting positions for length L substring
    for (let i = 0; i <= n - L; i++) {
      // Count number of '1's in substring s[i:i+L]
      const onesCount = prefixOnes[i + L] - prefixOnes[i];

      // To make all '0's: flip all '1's → operations = onesCount
      // To make all '1's: flip all '0's → operations = L - onesCount
      if (onesCount <= numOps || L - onesCount <= numOps) {
        return true;
      }
    }
    return false;
  }

  // Binary search for the minimum possible maximum length
  let left = 1,
    right = n;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (canAchieveLength(mid)) {
      // If we can achieve length mid, try for smaller
      right = mid;
    } else {
      // If we cannot achieve length mid, we need larger
      left = mid + 1;
    }
  }

  return left;
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public int minPossibleLength(String s, int numOps) {
        int n = s.length();

        // Build prefix sum array for '1's
        // prefixOnes[i] = number of '1's in s[0:i) (first i characters)
        int[] prefixOnes = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefixOnes[i + 1] = prefixOnes[i] + (s.charAt(i) == '1' ? 1 : 0);
        }

        // Binary search for the minimum possible maximum length
        int left = 1, right = n;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canAchieveLength(s, numOps, prefixOnes, mid)) {
                // If we can achieve length mid, try for smaller
                right = mid;
            } else {
                // If we cannot achieve length mid, we need larger
                left = mid + 1;
            }
        }

        return left;
    }

    private boolean canAchieveLength(String s, int numOps, int[] prefixOnes, int L) {
        int n = s.length();

        // Check all possible starting positions for length L substring
        for (int i = 0; i <= n - L; i++) {
            // Count number of '1's in substring s[i:i+L]
            int onesCount = prefixOnes[i + L] - prefixOnes[i];

            // To make all '0's: flip all '1's → operations = onesCount
            // To make all '1's: flip all '0's → operations = L - onesCount
            if (onesCount <= numOps || (L - onesCount) <= numOps) {
                return true;
            }
        }
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Building prefix sum array: O(n)
- Binary search runs O(log n) iterations
- Each binary search iteration calls `can_achieve_length` which is O(n)
- Total: O(n) + O(log n) × O(n) = O(n log n)

**Space Complexity:** O(n)

- We store the prefix sum array of size n+1
- Other variables use O(1) additional space

## Common Mistakes

1. **Forgetting to check both '0' and '1' conversions**: When checking if a substring can be made uniform, you must check both making it all '0's AND all '1's. Some candidates only check one, missing cases where flipping to the other character requires fewer operations.

2. **Off-by-one errors in prefix sums**: The prefix sum array has size n+1, where `prefix[i]` represents the count in the first i characters (s[0:i)). When accessing `prefix[i+L] - prefix[i]`, this correctly gives the count in s[i:i+L]. A common mistake is using size n and getting wrong indices.

3. **Incorrect binary search bounds**: The answer can be as small as 1 (if we have no operations and all characters differ) or as large as n (if we have enough operations to make the entire string uniform). Starting with left=0 instead of 1 can cause division by zero or incorrect results.

4. **Not handling the case when n=0**: While the problem guarantees n≥1, in interviews it's good practice to mention edge cases. If n=0, the answer should be 0 since there's no substring at all.

## When You'll See This Pattern

This "binary search on answer" pattern appears in optimization problems where:

- You're asked to minimize the maximum or maximize the minimum
- The feasibility check for a candidate value is easier than finding the optimal value directly
- The feasibility function is monotonic (if X is possible, then anything easier than X is also possible)

Related LeetCode problems:

1. **Capacity To Ship Packages Within D Days (LeetCode 1011)** - Binary search on the minimum capacity needed to ship all packages within D days. The feasibility check involves simulating the shipping process.
2. **Split Array Largest Sum (LeetCode 410)** - Binary search on the minimum possible largest sum when splitting the array into m subarrays.
3. **Koko Eating Bananas (LeetCode 875)** - Binary search on the minimum eating speed to finish all bananas within h hours.

## Key Takeaways

1. **When you need to minimize the maximum (or maximize the minimum)**, consider binary search on the answer. The monotonic property (if X works, anything easier/harder also works) is the key requirement.

2. **Prefix sums are powerful for range queries** on binary strings or arrays. They let you compute sums/counts over any subarray in O(1) time after O(n) preprocessing.

3. **Break complex problems into parts**: First figure out how to check if a specific length is achievable (the "feasibility function"), then use binary search to find the optimal length. This divide-and-conquer approach simplifies reasoning.

[Practice this problem on CodeJeet](/problem/smallest-substring-with-identical-characters-i)
