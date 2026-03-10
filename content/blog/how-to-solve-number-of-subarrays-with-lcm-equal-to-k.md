---
title: "How to Solve Number of Subarrays With LCM Equal to K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Subarrays With LCM Equal to K. Medium difficulty, 43.4% acceptance rate. Topics: Array, Math, Number Theory."
date: "2029-04-07"
category: "dsa-patterns"
tags: ["number-of-subarrays-with-lcm-equal-to-k", "array", "math", "number-theory", "medium"]
---

# How to Solve Number of Subarrays With LCM Equal to K

This problem asks us to count all contiguous subarrays where the least common multiple (LCM) of the elements equals a given integer `k`. What makes this problem interesting is that while we can compute LCM for any two numbers, efficiently tracking LCM across all possible subarrays requires careful thought about how LCM behaves as we extend subarrays.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [3, 6, 2, 4]`, `k = 6`.

We need to count all subarrays where LCM = 6. Let's examine systematically:

**Starting at index 0:**

- Subarray `[3]`: LCM(3) = 3 ≠ 6
- Extend to `[3, 6]`: LCM(3, 6) = 6 ✓ (count = 1)
- Extend to `[3, 6, 2]`: LCM(3, 6, 2) = 6 ✓ (count = 2)
- Extend to `[3, 6, 2, 4]`: LCM(3, 6, 2, 4) = 12 ≠ 6

**Starting at index 1:**

- Subarray `[6]`: LCM(6) = 6 ✓ (count = 3)
- Extend to `[6, 2]`: LCM(6, 2) = 6 ✓ (count = 4)
- Extend to `[6, 2, 4]`: LCM(6, 2, 4) = 12 ≠ 6

**Starting at index 2:**

- Subarray `[2]`: LCM(2) = 2 ≠ 6
- Extend to `[2, 4]`: LCM(2, 4) = 4 ≠ 6

**Starting at index 3:**

- Subarray `[4]`: LCM(4) = 4 ≠ 6

Total count = 4.

The key observation: when we extend a subarray, the LCM can only stay the same or increase. Once LCM exceeds `k`, it will never return to `k` for that starting point. Also, if an element doesn't divide `k`, any subarray containing it cannot have LCM = `k`.

## Brute Force Approach

The most straightforward solution is to check every possible subarray:

1. Generate all subarrays (nested loops: `i` from 0 to n-1, `j` from i to n-1)
2. For each subarray, compute the LCM of its elements
3. If LCM equals `k`, increment the count

The LCM of two numbers can be computed as `a * b / gcd(a, b)`. For an array, we can compute iteratively: `lcm_so_far = lcm(lcm_so_far, next_element)`.

**Why this is too slow:**

- There are O(n²) subarrays
- Computing LCM for each subarray from scratch is O(n) per subarray in worst case
- Total time complexity: O(n³) — far too slow for typical constraints (n up to 1000)

Even if we compute LCM incrementally as we extend subarrays, we still have O(n²) subarrays to check, which at n=1000 means ~500,000 operations. While this might pass in some languages with careful optimization, we can do better.

## Optimized Approach

The key insight: for each starting index `i`, as we extend to the right (increasing `j`), the LCM can only:

1. Stay the same (if the new number divides the current LCM)
2. Increase (if the new number contributes new prime factors)
3. Become a multiple of the current LCM

More importantly: **Once LCM exceeds `k`, it will never equal `k` again for that starting point.** This is because LCM is monotonically non-decreasing as we add more elements.

Additionally, if any element doesn't divide `k`, we can skip it entirely as a starting point, since any subarray containing an element that doesn't divide `k` cannot have LCM = `k`.

Our optimized approach:

1. For each starting index `i` where `nums[i]` divides `k`:
   - Initialize current LCM = 1
   - For each ending index `j` from `i` to end:
     - If `nums[j]` doesn't divide `k`, break (can't extend further)
     - Update LCM = lcm(current LCM, nums[j])
     - If LCM > `k`, break (will never return to `k`)
     - If LCM == `k`, increment count

This approach prunes many unnecessary computations by breaking early when:

- An element doesn't divide `k` (making LCM = `k` impossible)
- LCM exceeds `k` (making LCM = `k` impossible for that starting point)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) worst case, but much faster in practice due to early breaks
# Space: O(1)
def subarrayLCM(nums, k):
    """
    Count subarrays where LCM equals k.

    The key insight: LCM is monotonic non-decreasing as we extend subarrays.
    Once LCM exceeds k, it can never return to k for that starting point.
    Also, if an element doesn't divide k, any subarray containing it cannot have LCM = k.
    """
    n = len(nums)
    count = 0

    # Helper function to compute GCD using Euclidean algorithm
    def gcd(a, b):
        while b:
            a, b = b, a % b
        return a

    # Helper function to compute LCM of two numbers
    def lcm(a, b):
        return a * b // gcd(a, b)

    # Check all possible starting points
    for i in range(n):
        # If current element doesn't divide k, skip this starting point
        # because any subarray containing it cannot have LCM = k
        if k % nums[i] != 0:
            continue

        current_lcm = 1

        # Extend subarray to the right
        for j in range(i, n):
            # If this element doesn't divide k, break
            # Adding it would make LCM a multiple of nums[j], which doesn't divide k
            if k % nums[j] != 0:
                break

            # Update LCM with the new element
            current_lcm = lcm(current_lcm, nums[j])

            # If LCM exceeds k, we can break
            # LCM is monotonic, so it will never return to k
            if current_lcm > k:
                break

            # If LCM equals k, we found a valid subarray
            if current_lcm == k:
                count += 1

    return count
```

```javascript
// Time: O(n²) worst case, but much faster in practice due to early breaks
// Space: O(1)
function subarrayLCM(nums, k) {
  /**
   * Count subarrays where LCM equals k.
   *
   * The key insight: LCM is monotonic non-decreasing as we extend subarrays.
   * Once LCM exceeds k, it can never return to k for that starting point.
   * Also, if an element doesn't divide k, any subarray containing it cannot have LCM = k.
   */
  const n = nums.length;
  let count = 0;

  // Helper function to compute GCD using Euclidean algorithm
  const gcd = (a, b) => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  // Helper function to compute LCM of two numbers
  const lcm = (a, b) => {
    return Math.floor((a * b) / gcd(a, b));
  };

  // Check all possible starting points
  for (let i = 0; i < n; i++) {
    // If current element doesn't divide k, skip this starting point
    // because any subarray containing it cannot have LCM = k
    if (k % nums[i] !== 0) {
      continue;
    }

    let currentLcm = 1;

    // Extend subarray to the right
    for (let j = i; j < n; j++) {
      // If this element doesn't divide k, break
      // Adding it would make LCM a multiple of nums[j], which doesn't divide k
      if (k % nums[j] !== 0) {
        break;
      }

      // Update LCM with the new element
      currentLcm = lcm(currentLcm, nums[j]);

      // If LCM exceeds k, we can break
      // LCM is monotonic, so it will never return to k
      if (currentLcm > k) {
        break;
      }

      // If LCM equals k, we found a valid subarray
      if (currentLcm === k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) worst case, but much faster in practice due to early breaks
// Space: O(1)
class Solution {
    public int subarrayLCM(int[] nums, int k) {
        /**
         * Count subarrays where LCM equals k.
         *
         * The key insight: LCM is monotonic non-decreasing as we extend subarrays.
         * Once LCM exceeds k, it can never return to k for that starting point.
         * Also, if an element doesn't divide k, any subarray containing it cannot have LCM = k.
         */
        int n = nums.length;
        int count = 0;

        // Check all possible starting points
        for (int i = 0; i < n; i++) {
            // If current element doesn't divide k, skip this starting point
            // because any subarray containing it cannot have LCM = k
            if (k % nums[i] != 0) {
                continue;
            }

            long currentLcm = 1;  // Use long to avoid integer overflow

            // Extend subarray to the right
            for (int j = i; j < n; j++) {
                // If this element doesn't divide k, break
                // Adding it would make LCM a multiple of nums[j], which doesn't divide k
                if (k % nums[j] != 0) {
                    break;
                }

                // Update LCM with the new element
                currentLcm = lcm(currentLcm, nums[j]);

                // If LCM exceeds k, we can break
                // LCM is monotonic, so it will never return to k
                if (currentLcm > k) {
                    break;
                }

                // If LCM equals k, we found a valid subarray
                if (currentLcm == k) {
                    count++;
                }
            }
        }

        return count;
    }

    // Helper function to compute GCD using Euclidean algorithm
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Helper function to compute LCM of two numbers
    private long lcm(long a, long b) {
        return a * b / gcd((int)a, (int)b);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) in worst case, but much faster in practice due to early breaks. In the worst case (when all numbers divide `k` and LCM grows slowly), we might check all O(n²) subarrays. However, with the early break conditions, typical performance is much better.

**Space Complexity:** O(1) - we only use a constant amount of extra space for variables like `count`, `current_lcm`, and loop counters.

The early breaks are crucial:

1. When `k % nums[j] != 0`: We break because any subarray containing an element that doesn't divide `k` cannot have LCM = `k`.
2. When `current_lcm > k`: We break because LCM is monotonic non-decreasing, so once it exceeds `k`, it will never return to `k`.

## Common Mistakes

1. **Not checking if elements divide `k`:** The most common mistake is to process all elements without checking if `k % nums[i] == 0`. If an element doesn't divide `k`, any subarray containing it cannot have LCM = `k`. This check provides significant pruning.

2. **Integer overflow when computing LCM:** When computing `a * b / gcd(a, b)`, the intermediate product `a * b` can overflow 32-bit integers. In Java, use `long` for the LCM computation. In Python, integers are arbitrary precision, so overflow isn't an issue.

3. **Continuing after LCM exceeds `k`:** Some candidates continue extending subarrays even after LCM exceeds `k`. Since LCM is monotonic non-decreasing, once it exceeds `k`, it will never equal `k` again for that starting point. Always break early when `current_lcm > k`.

4. **Incorrect GCD/LCM implementation:** Remember that `LCM(a, b) = a * b / GCD(a, b)`. The Euclidean algorithm for GCD should handle the case where one number is 0 (though in our problem, all numbers are positive).

## When You'll See This Pattern

This problem uses the **monotonic property of LCM/GCD** during subarray extension, which appears in several related problems:

1. **Number of Subarrays With GCD Equal to K (LeetCode 2447)** - Almost identical structure, but with GCD instead of LCM. The same monotonic property applies: GCD can only stay the same or decrease as we extend subarrays.

2. **Subarray Product Less Than K (LeetCode 713)** - Uses the monotonic property of products (they only increase when multiplying by numbers > 1). The sliding window technique works because once product ≥ k, removing elements from the left can bring it back below k.

3. **Count Number of Nice Subarrays (LeetCode 1248)** - While not about LCM/GCD, it uses similar prefix counting techniques for subarray problems with specific constraints.

The core pattern: when a function (LCM, GCD, product, etc.) has monotonic behavior as we extend subarrays, we can often optimize by breaking early or using sliding windows.

## Key Takeaways

1. **LCM and GCD are monotonic in subarrays:** When extending a subarray to the right, LCM never decreases and GCD never increases. This allows for early termination when the value moves past our target.

2. **Prune impossible paths early:** Check if individual elements are compatible with the target (`k % nums[i] == 0` for LCM problems). If not, skip them entirely as starting points.

3. **Break when target becomes unreachable:** Once LCM exceeds `k` (or GCD drops below `k`), further extension cannot produce the target value for that starting point.

Related problems: [Number of Subarrays With GCD Equal to K](/problem/number-of-subarrays-with-gcd-equal-to-k)
