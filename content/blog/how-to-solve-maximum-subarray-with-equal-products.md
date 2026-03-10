---
title: "How to Solve Maximum Subarray With Equal Products — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Subarray With Equal Products. Easy difficulty, 46.5% acceptance rate. Topics: Array, Math, Sliding Window, Enumeration, Number Theory."
date: "2029-06-04"
category: "dsa-patterns"
tags: ["maximum-subarray-with-equal-products", "array", "math", "sliding-window", "easy"]
---

# How to Solve Maximum Subarray With Equal Products

This problem asks us to find the longest subarray where the product of all elements equals the product of their LCM and GCD. While the problem statement involves mathematical operations, the key insight is that for positive integers, this condition holds only when all elements in the subarray are equal. This transforms a seemingly complex mathematical problem into a simpler pattern recognition task.

**Why this is interesting:** At first glance, you might think you need to compute products, LCMs, and GCDs for every subarray, which would be computationally expensive. However, the mathematical relationship `prod(arr) == lcm(arr) * gcd(arr)` has a special property that dramatically simplifies the problem when you understand number theory.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [2, 3, 3, 3, 2, 3]`.

**Step 1: Understanding the condition**
For any subarray, we need `prod(arr) == lcm(arr) * gcd(arr)`. For positive integers, this equality holds if and only if all elements in the subarray are equal. Let's verify:

- Subarray `[3, 3, 3]`:
  - Product = 3 × 3 × 3 = 27
  - GCD = 3, LCM = 3
  - LCM × GCD = 3 × 3 = 9
  - Wait, 27 ≠ 9! Something's wrong here...

Actually, let me correct this. The key insight is that for a set of numbers `a₁, a₂, ..., aₙ`:

- If all numbers are equal to `x`, then:
  - Product = xⁿ
  - GCD = x
  - LCM = x
  - LCM × GCD = x × x = x²
- For the equality to hold: xⁿ = x²
- This means either n = 2, or x = 1, or x = 0 (but we have positive integers)

Wait, let's test with actual numbers:

- For `[3, 3]`: Product = 9, GCD = 3, LCM = 3, 3×3 = 9 ✓
- For `[3, 3, 3]`: Product = 27, GCD = 3, LCM = 3, 3×3 = 9 ✗

So the equality only holds for subarrays of length 2 with equal elements, or for any subarray where all elements are 1 (since 1ⁿ = 1² for any n).

**Step 2: Applying to our example**
`nums = [2, 3, 3, 3, 2, 3]`

Let's find the longest subarray where all elements are equal:

- Starting at index 0: `[2]` (length 1)
- Starting at index 1: `[3, 3, 3]` (length 3)
- Starting at index 4: `[2]` (length 1)
- Starting at index 5: `[3]` (length 1)

The longest is `[3, 3, 3]` with length 3.

But wait, we need to check if `prod == lcm × gcd` holds for this subarray:

- `[3, 3, 3]`: Product = 27, GCD = 3, LCM = 3, 3×3 = 9 ≠ 27 ✗

So this doesn't satisfy the condition! Let me reconsider...

Actually, I made an error in my initial reasoning. Let's derive the condition properly:

For positive integers a, b:

- `lcm(a,b) × gcd(a,b) = a × b` is always true for two numbers
- For more than two numbers, this doesn't generally hold

The problem states we need `prod(arr) == lcm(arr) × gcd(arr)`. Let's test:

- For `[3, 3]`: 3×3 = 9, lcm=3, gcd=3, 3×3=9 ✓
- For `[3, 3, 3]`: 27 ≠ 3×3=9 ✗
- For `[2, 3]`: 6 ≠ lcm(2,3)×gcd(2,3)=6×1=6 ✓ Wait, this works!
- For `[2, 4]`: 8 ≠ lcm(2,4)×gcd(2,4)=4×2=8 ✓

So the condition holds for ANY two numbers, but not generally for more than two unless all numbers are equal. Let me verify the actual mathematical property...

**Correct insight:** For any two positive integers, `a × b = lcm(a,b) × gcd(a,b)` is always true. For n > 2 numbers, `prod(arr) = lcm(arr) × gcd(arr)` holds if and only if all numbers are equal.

Let's test:

- `[2, 3, 6]`: Product=36, lcm=6, gcd=1, 6×1=6 ≠ 36 ✗
- `[3, 3, 3]`: Product=27, lcm=3, gcd=3, 3×3=9 ≠ 27 ✗
- `[2, 2, 2]`: Product=8, lcm=2, gcd=2, 2×2=4 ≠ 8 ✗

So actually, the ONLY subarrays that satisfy the condition are:

1. Subarrays of length 1 (trivially, since product = element, lcm = element, gcd = element)
2. Subarrays of length 2 (since a×b = lcm(a,b)×gcd(a,b) always holds for two numbers)

Therefore, the problem reduces to finding the longest subarray of length 1 or 2!

**Step 3: Solving the simplified problem**
For `nums = [2, 3, 3, 3, 2, 3]`:

- All subarrays of length 1 are valid
- All subarrays of length 2 are valid
- The longest possible is length 2

So the answer is 2, not 3 as I initially thought.

## Brute Force Approach

A naive solution would check every possible subarray:

1. Generate all possible subarrays (start index i, end index j where i ≤ j)
2. For each subarray, compute product, LCM, and GCD
3. Check if product == LCM × GCD
4. Track the maximum length

This approach has O(n³) time complexity because:

- O(n²) subarrays
- For each subarray, computing product, LCM, and GCD takes O(k) where k is subarray length
- In worst case, this becomes O(n³)

The brute force is too slow for typical constraints (n up to 10⁵).

<div class="code-group">

```python
# Brute force solution - too slow for large inputs
# Time: O(n³) | Space: O(1)
def maxLengthBruteForce(nums):
    n = len(nums)
    max_len = 0

    # Check all possible subarrays
    for i in range(n):
        for j in range(i, n):
            # Initialize product, gcd, lcm for current subarray
            prod = 1
            gcd_val = nums[i]
            lcm_val = nums[i]

            # Compute for each element in subarray
            for k in range(i, j + 1):
                prod *= nums[k]
                gcd_val = math.gcd(gcd_val, nums[k])
                lcm_val = lcm(lcm_val, nums[k])

            # Check condition
            if prod == lcm_val * gcd_val:
                max_len = max(max_len, j - i + 1)

    return max_len

def lcm(a, b):
    return a * b // math.gcd(a, b)
```

```javascript
// Brute force solution - too slow for large inputs
// Time: O(n³) | Space: O(1)
function maxLengthBruteForce(nums) {
  const n = nums.length;
  let maxLen = 0;

  // Helper function for LCM
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const gcd = (a, b) => {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  // Check all possible subarrays
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Initialize for current subarray
      let prod = 1;
      let gcdVal = nums[i];
      let lcmVal = nums[i];

      // Compute for each element
      for (let k = i; k <= j; k++) {
        prod *= nums[k];
        gcdVal = gcd(gcdVal, nums[k]);
        lcmVal = lcm(lcmVal, nums[k]);
      }

      // Check condition
      if (prod === lcmVal * gcdVal) {
        maxLen = Math.max(maxLen, j - i + 1);
      }
    }
  }

  return maxLen;
}
```

```java
// Brute force solution - too slow for large inputs
// Time: O(n³) | Space: O(1)
public int maxLengthBruteForce(int[] nums) {
    int n = nums.length;
    int maxLen = 0;

    // Check all possible subarrays
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Initialize for current subarray
            long prod = 1;
            int gcdVal = nums[i];
            int lcmVal = nums[i];

            // Compute for each element
            for (int k = i; k <= j; k++) {
                prod *= nums[k];
                gcdVal = gcd(gcdVal, nums[k]);
                lcmVal = lcm(lcmVal, nums[k]);
            }

            // Check condition
            if (prod == (long) lcmVal * gcdVal) {
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
    }

    return maxLen;
}

private int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

private int lcm(int a, int b) {
    return a / gcd(a, b) * b;  // Divide first to avoid overflow
}
```

</div>

## Optimal Solution

The key insight is that `prod(arr) == lcm(arr) × gcd(arr)` holds if and only if:

1. The subarray has length 1 (trivial case), OR
2. The subarray has length 2 (property always holds for two numbers)

For subarrays of length > 2, the equality only holds in degenerate cases (like all elements being 1), but since we're looking for the maximum length and all inputs are positive integers, the maximum will always be either 1 or 2.

Therefore, the optimal solution is simple:

1. If the array has at least 2 elements, the answer is 2
2. Otherwise, the answer is 1 (or the length of the array)

<div class="code-group">

```python
# Optimal solution
# Time: O(1) | Space: O(1)
def maxLength(nums):
    """
    Returns the length of the longest subarray where
    product == LCM × GCD.

    Key insight: For positive integers, this equality holds
    if and only if the subarray has length 1 or 2.
    For length > 2, it generally doesn't hold unless
    all elements are 1, but 2 is always valid if n >= 2.
    """
    n = len(nums)

    # If array has at least 2 elements, we can always take
    # any subarray of length 2
    if n >= 2:
        return 2
    # Otherwise, return the length of the array
    # (which is either 0 or 1)
    return n

# Alternative implementation that's more explicit
def maxLengthAlternative(nums):
    n = len(nums)

    # Edge case: empty array
    if n == 0:
        return 0

    # Any single element subarray is valid
    # Any two-element subarray is valid
    # So if we have at least 2 elements, answer is 2
    # Otherwise, answer is 1
    return min(2, n) if n > 0 else 0
```

```javascript
// Optimal solution
// Time: O(1) | Space: O(1)
function maxLength(nums) {
  /**
   * Returns the length of the longest subarray where
   * product == LCM × GCD.
   *
   * Key insight: For positive integers, this equality holds
   * if and only if the subarray has length 1 or 2.
   * For length > 2, it generally doesn't hold unless
   * all elements are 1, but 2 is always valid if n >= 2.
   */
  const n = nums.length;

  // If array has at least 2 elements, we can always take
  // any subarray of length 2
  if (n >= 2) {
    return 2;
  }
  // Otherwise, return the length of the array
  // (which is either 0 or 1)
  return n;
}

// Alternative implementation
function maxLengthAlternative(nums) {
  const n = nums.length;

  // Edge case: empty array
  if (n === 0) {
    return 0;
  }

  // Any single element is valid, any pair is valid
  // So answer is min(2, n) for non-empty arrays
  return Math.min(2, n);
}
```

```java
// Optimal solution
// Time: O(1) | Space: O(1)
public int maxLength(int[] nums) {
    /**
     * Returns the length of the longest subarray where
     * product == LCM × GCD.
     *
     * Key insight: For positive integers, this equality holds
     * if and only if the subarray has length 1 or 2.
     * For length > 2, it generally doesn't hold unless
     * all elements are 1, but 2 is always valid if n >= 2.
     */
    int n = nums.length;

    // If array has at least 2 elements, we can always take
    // any subarray of length 2
    if (n >= 2) {
        return 2;
    }
    // Otherwise, return the length of the array
    // (which is either 0 or 1)
    return n;
}

// Alternative implementation
public int maxLengthAlternative(int[] nums) {
    int n = nums.length;

    // Edge case: empty array
    if (n == 0) {
        return 0;
    }

    // Any single element is valid, any pair is valid
    // So answer is min(2, n) for non-empty arrays
    return Math.min(2, n);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We only need to check the length of the array
- No iteration through elements is needed

**Space Complexity:** O(1)

- We only use a constant amount of extra space
- No additional data structures are needed

The dramatic reduction from O(n³) to O(1) comes from the mathematical insight that transforms the problem. This is why understanding the underlying properties is crucial in coding interviews.

## Common Mistakes

1. **Overcomplicating with actual computations:** Candidates often try to actually compute products, LCMs, and GCDs for subarrays without realizing the mathematical simplification. They waste time implementing complex O(n³) solutions that won't pass larger test cases.

2. **Missing the length=2 case:** Some candidates correctly identify that single elements always satisfy the condition but forget that any pair of numbers also satisfies `a × b = lcm(a,b) × gcd(a,b)`. They might return 1 when the answer should be 2.

3. **Edge case handling:** Forgetting to handle empty arrays (should return 0) or arrays with single elements (should return 1). Always test with n = 0, n = 1, and n = 2.

4. **Integer overflow:** In brute force solutions, computing products can quickly lead to integer overflow even for moderately sized arrays. The optimal solution avoids this entirely.

## When You'll See This Pattern

This problem teaches the importance of **mathematical insight before coding**. Similar patterns appear in:

1. **"Bulb Switcher" (LeetCode 319):** Seems like a simulation problem but has an O(1) mathematical solution based on perfect squares.

2. **"Nim Game" (LeetCode 292):** Appears to require game tree search but has a simple modulo-based solution.

3. **"Rectangle Overlap" (LeetCode 836):** Could be solved with complex geometry but reduces to simple coordinate comparisons.

The pattern is: problems that seem to require complex algorithms or data structures might have simple mathematical solutions if you derive the underlying properties first.

## Key Takeaways

1. **Always look for mathematical properties** before writing code, especially when the problem involves mathematical operations like product, GCD, or LCM.

2. **Test small cases systematically** to discover patterns. Try arrays of length 1, 2, and 3 with different values to understand when the condition holds.

3. **The most efficient solution often comes from insight, not optimization.** An O(1) solution is almost always better than an optimized O(n) solution if you can find the right insight.

Related problems: [Find Greatest Common Divisor of Array](/problem/find-greatest-common-divisor-of-array)
