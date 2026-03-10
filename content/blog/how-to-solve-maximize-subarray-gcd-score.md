---
title: "How to Solve Maximize Subarray GCD Score — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize Subarray GCD Score. Hard difficulty, 24.7% acceptance rate. Topics: Array, Math, Enumeration, Number Theory."
date: "2026-08-15"
category: "dsa-patterns"
tags: ["maximize-subarray-gcd-score", "array", "math", "enumeration", "hard"]
---

# How to Solve Maximize Subarray GCD Score

This problem asks us to maximize the greatest common divisor (GCD) of any contiguous subarray after we can double at most `k` elements (each at most once). The challenge lies in balancing two constraints: we need to find subarrays with high GCD values, but we can only double `k` elements to potentially increase those GCDs. What makes this problem tricky is that doubling an element might help some subarrays but hurt others, and we need to efficiently explore all possible subarrays and doubling combinations.

## Visual Walkthrough

Let's walk through a small example: `nums = [4, 6, 8]` with `k = 1`.

**Step 1: Understanding the goal**
We want to find a contiguous subarray where, after potentially doubling up to `k` elements, the GCD is as large as possible. The GCD of a subarray is the largest number that divides every element in that subarray.

**Step 2: Try different subarrays**

- Subarray `[4]`: GCD = 4. We could double 4 to get 8, GCD = 8.
- Subarray `[6]`: GCD = 6. We could double 6 to get 12, GCD = 12.
- Subarray `[8]`: GCD = 8. We could double 8 to get 16, GCD = 16.
- Subarray `[4, 6]`: GCD = gcd(4, 6) = 2. If we double 4 → 8, gcd(8, 6) = 2. If we double 6 → 12, gcd(4, 12) = 4. Best GCD = 4.
- Subarray `[6, 8]`: GCD = gcd(6, 8) = 2. If we double 6 → 12, gcd(12, 8) = 4. If we double 8 → 16, gcd(6, 16) = 2. Best GCD = 4.
- Subarray `[4, 6, 8]`: GCD = gcd(4, 6, 8) = 2. If we double 4 → 8, gcd(8, 6, 8) = 2. If we double 6 → 12, gcd(4, 12, 8) = 4. If we double 8 → 16, gcd(4, 6, 16) = 2. Best GCD = 4.

**Step 3: Find the maximum**
The best GCD we found was 16 from subarray `[8]` with doubling. So the answer is 16.

This example shows we need to consider:

1. All possible contiguous subarrays
2. All possible ways to double up to `k` elements within each subarray
3. The GCD after each doubling combination

## Brute Force Approach

A naive solution would:

1. Generate all contiguous subarrays (O(n²) subarrays)
2. For each subarray, try all combinations of doubling up to `k` elements (O(2^min(m,k)) where m is subarray length)
3. Compute the GCD for each combination (O(m) per computation)
4. Track the maximum GCD found

This leads to O(n² × 2^k × n) time complexity, which is far too slow for typical constraints (n up to 10^5, k up to 10).

The key insight we need is that we don't need to try all doubling combinations explicitly. Instead, we can think about what GCD values are possible for each subarray.

## Optimized Approach

**Key Insight 1: GCD is monotonic when extending subarrays**
When we extend a subarray to the right, the GCD can only stay the same or decrease. This is because gcd(a,b,c) ≤ gcd(a,b). This property allows us to use a sliding window-like approach.

**Key Insight 2: Limited possible GCD values**
For a given starting index, as we extend to the right, the GCD changes only when it divides by some number. In fact, for a fixed starting point, there are only O(log(max(nums))) distinct GCD values as we extend rightward.

**Key Insight 3: Doubling strategy**
When considering whether we can achieve a target GCD `g` for some subarray:

- Elements already divisible by `g` don't need doubling
- Elements not divisible by `g` might become divisible if doubled
- But an element `x` can become divisible by `g` after doubling only if `2x` is divisible by `g`, which means `g` must divide `2x`

**Algorithm Outline:**

1. For each possible GCD value `g` (which must be a divisor of some element or twice some element)
2. For each starting index `i`, find the longest subarray starting at `i` where we can make all elements divisible by `g` using at most `k` doublings
3. If such a subarray exists with length ≥ 1, then `g` is achievable
4. Find the maximum `g` that is achievable

We implement this using a two-pointer sliding window:

- Right pointer extends the window as long as we can make all elements divisible by `g` with ≤ k doublings
- When we need more than k doublings, move left pointer forward
- Track the maximum window length for each `g`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * d * log(M)) where d is number of divisors, M is max(nums)
# Space: O(d) for storing divisors
def maxScore(nums, k):
    """
    Find maximum possible GCD of any contiguous subarray after at most k doublings.
    """
    n = len(nums)
    if n == 0:
        return 0

    # Step 1: Collect all possible GCD candidates
    # A candidate GCD must divide some element or 2*element (after potential doubling)
    candidates = set()
    max_num = 0

    for x in nums:
        max_num = max(max_num, x)
        # Add divisors of x and 2*x
        candidates.update(get_divisors(x))
        candidates.update(get_divisors(2 * x))

    # Sort candidates in descending order to find maximum faster
    candidates = sorted(candidates, reverse=True)

    # Step 2: For each candidate GCD, check if it's achievable
    for g in candidates:
        if is_achievable(nums, k, g):
            return g

    return 1  # Minimum possible GCD for positive integers

def get_divisors(x):
    """Return all divisors of x."""
    divisors = set()
    # Check divisors up to sqrt(x)
    for i in range(1, int(x**0.5) + 1):
        if x % i == 0:
            divisors.add(i)
            divisors.add(x // i)
    return divisors

def is_achievable(nums, k, g):
    """
    Check if we can make all elements in some contiguous subarray divisible by g
    using at most k doublings.
    Uses sliding window approach.
    """
    n = len(nums)
    left = 0
    doublings_used = 0

    for right in range(n):
        # Check if nums[right] needs doubling to be divisible by g
        if nums[right] % g != 0:
            # Check if doubling would help
            if (2 * nums[right]) % g == 0:
                doublings_used += 1
            else:
                # This element cannot be made divisible by g even after doubling
                # Move left pointer past this element
                while left <= right:
                    # Remove contribution of nums[left] when sliding window
                    if nums[left] % g != 0 and (2 * nums[left]) % g == 0:
                        doublings_used -= 1
                    left += 1
                # Reset for new window starting at right+1
                doublings_used = 0
                continue

        # If we used too many doublings, shrink window from left
        while doublings_used > k:
            if nums[left] % g != 0 and (2 * nums[left]) % g == 0:
                doublings_used -= 1
            left += 1

        # If window has at least one element, g is achievable
        if right - left + 1 >= 1:
            return True

    return False
```

```javascript
// Time: O(n * d * log(M)) where d is number of divisors, M is max(nums)
// Space: O(d) for storing divisors
function maxScore(nums, k) {
  /**
   * Find maximum possible GCD of any contiguous subarray after at most k doublings.
   */
  const n = nums.length;
  if (n === 0) return 0;

  // Step 1: Collect all possible GCD candidates
  // A candidate GCD must divide some element or 2*element (after potential doubling)
  const candidates = new Set();
  let maxNum = 0;

  for (const x of nums) {
    maxNum = Math.max(maxNum, x);
    // Add divisors of x and 2*x
    getDivisors(x).forEach((d) => candidates.add(d));
    getDivisors(2 * x).forEach((d) => candidates.add(d));
  }

  // Sort candidates in descending order to find maximum faster
  const sortedCandidates = Array.from(candidates).sort((a, b) => b - a);

  // Step 2: For each candidate GCD, check if it's achievable
  for (const g of sortedCandidates) {
    if (isAchievable(nums, k, g)) {
      return g;
    }
  }

  return 1; // Minimum possible GCD for positive integers
}

function getDivisors(x) {
  /** Return all divisors of x. */
  const divisors = new Set();
  // Check divisors up to sqrt(x)
  for (let i = 1; i * i <= x; i++) {
    if (x % i === 0) {
      divisors.add(i);
      divisors.add(x / i);
    }
  }
  return divisors;
}

function isAchievable(nums, k, g) {
  /**
   * Check if we can make all elements in some contiguous subarray divisible by g
   * using at most k doublings.
   * Uses sliding window approach.
   */
  const n = nums.length;
  let left = 0;
  let doublingsUsed = 0;

  for (let right = 0; right < n; right++) {
    // Check if nums[right] needs doubling to be divisible by g
    if (nums[right] % g !== 0) {
      // Check if doubling would help
      if ((2 * nums[right]) % g === 0) {
        doublingsUsed++;
      } else {
        // This element cannot be made divisible by g even after doubling
        // Move left pointer past this element
        while (left <= right) {
          // Remove contribution of nums[left] when sliding window
          if (nums[left] % g !== 0 && (2 * nums[left]) % g === 0) {
            doublingsUsed--;
          }
          left++;
        }
        // Reset for new window starting at right+1
        doublingsUsed = 0;
        continue;
      }
    }

    // If we used too many doublings, shrink window from left
    while (doublingsUsed > k) {
      if (nums[left] % g !== 0 && (2 * nums[left]) % g === 0) {
        doublingsUsed--;
      }
      left++;
    }

    // If window has at least one element, g is achievable
    if (right - left + 1 >= 1) {
      return true;
    }
  }

  return false;
}
```

```java
// Time: O(n * d * log(M)) where d is number of divisors, M is max(nums)
// Space: O(d) for storing divisors
import java.util.*;

class Solution {
    public int maxScore(int[] nums, int k) {
        /**
         * Find maximum possible GCD of any contiguous subarray after at most k doublings.
         */
        int n = nums.length;
        if (n == 0) return 0;

        // Step 1: Collect all possible GCD candidates
        // A candidate GCD must divide some element or 2*element (after potential doubling)
        Set<Integer> candidates = new HashSet<>();
        int maxNum = 0;

        for (int x : nums) {
            maxNum = Math.max(maxNum, x);
            // Add divisors of x and 2*x
            candidates.addAll(getDivisors(x));
            candidates.addAll(getDivisors(2 * x));
        }

        // Sort candidates in descending order to find maximum faster
        List<Integer> sortedCandidates = new ArrayList<>(candidates);
        Collections.sort(sortedCandidates, Collections.reverseOrder());

        // Step 2: For each candidate GCD, check if it's achievable
        for (int g : sortedCandidates) {
            if (isAchievable(nums, k, g)) {
                return g;
            }
        }

        return 1; // Minimum possible GCD for positive integers
    }

    private Set<Integer> getDivisors(int x) {
        /** Return all divisors of x. */
        Set<Integer> divisors = new HashSet<>();
        // Check divisors up to sqrt(x)
        for (int i = 1; i * i <= x; i++) {
            if (x % i == 0) {
                divisors.add(i);
                divisors.add(x / i);
            }
        }
        return divisors;
    }

    private boolean isAchievable(int[] nums, int k, int g) {
        /**
         * Check if we can make all elements in some contiguous subarray divisible by g
         * using at most k doublings.
         * Uses sliding window approach.
         */
        int n = nums.length;
        int left = 0;
        int doublingsUsed = 0;

        for (int right = 0; right < n; right++) {
            // Check if nums[right] needs doubling to be divisible by g
            if (nums[right] % g != 0) {
                // Check if doubling would help
                if ((2 * nums[right]) % g == 0) {
                    doublingsUsed++;
                } else {
                    // This element cannot be made divisible by g even after doubling
                    // Move left pointer past this element
                    while (left <= right) {
                        // Remove contribution of nums[left] when sliding window
                        if (nums[left] % g != 0 && (2 * nums[left]) % g == 0) {
                            doublingsUsed--;
                        }
                        left++;
                    }
                    // Reset for new window starting at right+1
                    doublingsUsed = 0;
                    continue;
                }
            }

            // If we used too many doublings, shrink window from left
            while (doublingsUsed > k) {
                if (nums[left] % g != 0 && (2 * nums[left]) % g == 0) {
                    doublingsUsed--;
                }
                left++;
            }

            // If window has at least one element, g is achievable
            if (right - left + 1 >= 1) {
                return true;
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × d × log(M))

- `n`: length of nums array
- `d`: number of unique divisors of elements and their doubles (in practice, d is O(log M) for random numbers)
- `M`: maximum value in nums
- For each candidate GCD `g`, we do a O(n) sliding window check
- Finding divisors takes O(√M) per element, but with optimization we only need to process unique values

**Space Complexity:** O(d)

- We store all candidate GCD values in a set
- The sliding window uses O(1) extra space

In practice, since numbers have relatively few divisors (typically O(log M)), this solution is efficient enough for the constraints.

## Common Mistakes

1. **Not considering that doubling might not help**: Some candidates think that if an element isn't divisible by `g`, doubling will always fix it. But `2x` must be divisible by `g` for doubling to help. Always check `(2 * x) % g == 0`.

2. **Incorrect sliding window reset**: When you encounter an element that can't be made divisible even after doubling, you need to reset the window completely, not just move left pointer by 1. The element at `right` cannot be part of any valid window for this `g`.

3. **Forgetting to check single-element subarrays**: The optimal solution might be a single element that gets doubled. Make sure your sliding window handles windows of size 1 correctly.

4. **Inefficient candidate generation**: Generating all numbers up to max(nums) as candidates gives O(M) candidates, which is too slow. Only consider divisors of elements or their doubles.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sliding Window with Constraints** (like LeetCode 424, 1004): Maintaining a window that satisfies some condition (here, ≤ k doublings needed).

2. **GCD-based Problems** (like LeetCode 2447, 1497): Problems where you need to reason about divisibility and greatest common divisors.

3. **"Check if target is achievable" Binary Search** (like LeetCode 410, 875): The pattern of trying candidate answers in descending order to find the maximum achievable value.

Specifically:

- **LeetCode 1004 (Max Consecutive Ones III)**: Similar sliding window with limited "fixes" (flipping bits).
- **LeetCode 2447 (Number of Subarrays With GCD Equal to K)**: Also deals with subarray GCDs but without the doubling operation.
- **LeetCode 1497 (Check If Array Pairs Are Divisible by k)**: Focuses on divisibility constraints.

## Key Takeaways

1. **When dealing with "at most k operations" constraints, sliding window is often effective**: Maintain a window where the constraint is satisfied, adjusting left pointer when needed.

2. **For GCD problems, consider the monotonic property**: GCD never increases when adding more elements, which allows efficient window-based approaches.

3. **Instead of trying all possibilities, work backwards from potential answers**: Check if a target GCD is achievable rather than trying to compute the maximum directly. This "guess and check" approach is powerful for optimization problems.

[Practice this problem on CodeJeet](/problem/maximize-subarray-gcd-score)
