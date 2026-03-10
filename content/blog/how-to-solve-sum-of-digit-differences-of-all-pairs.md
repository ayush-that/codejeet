---
title: "How to Solve Sum of Digit Differences of All Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Digit Differences of All Pairs. Medium difficulty, 43.0% acceptance rate. Topics: Array, Hash Table, Math, Counting."
date: "2029-05-24"
category: "dsa-patterns"
tags: ["sum-of-digit-differences-of-all-pairs", "array", "hash-table", "math", "medium"]
---

# How to Solve Sum of Digit Differences of All Pairs

This problem asks us to find the total digit differences between all pairs of numbers in an array. Each number has the same digit length, and the "digit difference" between two numbers is simply how many positions have different digits. The challenge is that a brute force approach checking all pairs would be O(n² × d) where n is the array size and d is digit length — too slow for large inputs. The interesting insight is that we can count contributions per digit position independently using combinatorics.

## Visual Walkthrough

Let's trace through a small example: `nums = [12, 34, 56]` where each number has 2 digits.

**Step 1: Understanding digit differences**

- Pair (12, 34): Compare digit-by-digit
  - Position 0: 1 vs 3 → different (+1)
  - Position 1: 2 vs 4 → different (+1)
  - Total: 2 differences
- Pair (12, 56): 1≠5, 2≠6 → 2 differences
- Pair (34, 56): 3≠5, 4≠6 → 2 differences
- Sum: 2 + 2 + 2 = 6

**Step 2: The key insight**
Instead of checking each pair, notice we can process each digit position separately:

- Position 0 (tens digit): digits are [1, 3, 5]
  - Different pairs: (1,3), (1,5), (3,5) → 3 pairs × 1 difference each = 3
- Position 1 (ones digit): digits are [2, 4, 6]
  - Different pairs: (2,4), (2,6), (4,6) → 3 pairs × 1 difference each = 3
- Total: 3 + 3 = 6

**Step 3: Efficient counting**
For position 0 with digits [1, 3, 5]:

- Count how many of each digit: {1:1, 3:1, 5:1}
- For digit '1': it pairs with all non-'1' digits (3 and 5) → 2 pairs
- For digit '3': pairs with non-'3' digits (1 and 5) → 2 pairs
- For digit '5': pairs with non-'5' digits (1 and 3) → 2 pairs
- Wait, we're double counting! (1,3) counted for both 1 and 3
- Better: Total pairs = n×(n-1)/2 = 3×2/2 = 3
- Same-digit pairs: For digit '1': C(1,2)=0, digit '3': 0, digit '5': 0
- Different-digit pairs = total - same-digit = 3 - 0 = 3

This shows we can compute per-position contributions efficiently using frequency counts.

## Brute Force Approach

The most straightforward solution is to check every pair of numbers and compare their digits:

<div class="code-group">

```python
# Time: O(n² * d) | Space: O(1)
def sumDigitDifferences_brute(nums):
    n = len(nums)
    if n < 2:
        return 0

    total = 0
    # Compare every pair (i, j) where i < j
    for i in range(n):
        for j in range(i + 1, n):
            # Compare digits position by position
            x, y = nums[i], nums[j]
            while x > 0 or y > 0:
                if x % 10 != y % 10:
                    total += 1
                x //= 10
                y //= 10
    return total
```

```javascript
// Time: O(n² * d) | Space: O(1)
function sumDigitDifferencesBrute(nums) {
  const n = nums.length;
  if (n < 2) return 0;

  let total = 0;
  // Compare every pair (i, j) where i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Compare digits position by position
      let x = nums[i],
        y = nums[j];
      while (x > 0 || y > 0) {
        if (x % 10 !== y % 10) {
          total++;
        }
        x = Math.floor(x / 10);
        y = Math.floor(y / 10);
      }
    }
  }
  return total;
}
```

```java
// Time: O(n² * d) | Space: O(1)
public int sumDigitDifferencesBrute(int[] nums) {
    int n = nums.length;
    if (n < 2) return 0;

    int total = 0;
    // Compare every pair (i, j) where i < j
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Compare digits position by position
            int x = nums[i], y = nums[j];
            while (x > 0 || y > 0) {
                if (x % 10 != y % 10) {
                    total++;
                }
                x /= 10;
                y /= 10;
            }
        }
    }
    return total;
}
```

</div>

**Why this is insufficient:**

- With n up to 10⁵, n² = 10¹⁰ operations is far too slow
- Even with small digit counts (d ≤ 8), O(n² × d) is impractical
- We need to reduce this to at least O(n × d) to pass

## Optimized Approach

The key insight is that **digit positions are independent**. We can process each position separately and sum the contributions.

**Reasoning step-by-step:**

1. For a single digit position, extract that digit from every number
2. Count frequency of each digit (0-9) at that position
3. Total pairs at this position = C(n, 2) = n×(n-1)/2
4. Pairs with same digit = Σ C(freq[d], 2) for each digit d
5. Different-digit pairs = total pairs - same-digit pairs
6. This equals the contribution from this position
7. Sum contributions across all positions

**Why this works:**

- Each position contributes independently to the total
- A pair contributes +1 for each position where digits differ
- By linearity of summation, we can sum per-position contributions
- Counting same-digit pairs via frequencies avoids O(n²) pair checking

**Mathematical formulation:**
For position p with digit counts c₀, c₁, ..., c₉:
Contribution = [n×(n-1)/2] - Σ[cᵢ×(cᵢ-1)/2] for i=0..9

## Optimal Solution

Here's the efficient implementation using frequency counting per digit position:

<div class="code-group">

```python
# Time: O(n * d) | Space: O(1) [10*d constant space]
def sumDigitDifferences(nums):
    """
    Calculate total digit differences between all pairs.

    Args:
        nums: List of integers with same digit length

    Returns:
        Total count of differing digit positions across all pairs
    """
    n = len(nums)
    if n < 2:
        return 0

    # Find number of digits by checking first element
    num_digits = len(str(nums[0]))
    total_pairs = n * (n - 1) // 2  # C(n, 2)
    result = 0

    # Process each digit position from least significant to most
    for pos in range(num_digits):
        # Count frequency of each digit (0-9) at current position
        freq = [0] * 10

        # Extract digit at position 'pos' from each number
        for num in nums:
            # Get digit: (num // 10^pos) % 10
            digit = (num // (10 ** pos)) % 10
            freq[digit] += 1

        # Calculate same-digit pairs at this position
        same_digit_pairs = 0
        for count in freq:
            if count > 1:
                # C(count, 2) = count*(count-1)//2
                same_digit_pairs += count * (count - 1) // 2

        # Different-digit pairs = total pairs - same-digit pairs
        # Each different-digit pair contributes 1 to result
        result += (total_pairs - same_digit_pairs)

    return result
```

```javascript
// Time: O(n * d) | Space: O(1) [10*d constant space]
function sumDigitDifferences(nums) {
  /**
   * Calculate total digit differences between all pairs.
   *
   * @param {number[]} nums - Array of integers with same digit length
   * @return {number} Total count of differing digit positions across all pairs
   */
  const n = nums.length;
  if (n < 2) return 0;

  // Find number of digits by checking first element
  const numDigits = String(nums[0]).length;
  const totalPairs = (n * (n - 1)) / 2; // C(n, 2)
  let result = 0;

  // Process each digit position from least significant to most
  for (let pos = 0; pos < numDigits; pos++) {
    // Count frequency of each digit (0-9) at current position
    const freq = new Array(10).fill(0);

    // Extract digit at position 'pos' from each number
    const divisor = Math.pow(10, pos);
    for (const num of nums) {
      // Get digit: Math.floor(num / 10^pos) % 10
      const digit = Math.floor(num / divisor) % 10;
      freq[digit]++;
    }

    // Calculate same-digit pairs at this position
    let sameDigitPairs = 0;
    for (const count of freq) {
      if (count > 1) {
        // C(count, 2) = count*(count-1)/2
        sameDigitPairs += (count * (count - 1)) / 2;
      }
    }

    // Different-digit pairs = total pairs - same-digit pairs
    // Each different-digit pair contributes 1 to result
    result += totalPairs - sameDigitPairs;
  }

  return result;
}
```

```java
// Time: O(n * d) | Space: O(1) [10*d constant space]
public int sumDigitDifferences(int[] nums) {
    /**
     * Calculate total digit differences between all pairs.
     *
     * @param nums Array of integers with same digit length
     * @return Total count of differing digit positions across all pairs
     */
    int n = nums.length;
    if (n < 2) return 0;

    // Find number of digits by checking first element
    int numDigits = String.valueOf(nums[0]).length();
    long totalPairs = (long) n * (n - 1) / 2;  // C(n, 2) - use long to avoid overflow
    long result = 0;  // Use long for large results

    // Process each digit position from least significant to most
    for (int pos = 0; pos < numDigits; pos++) {
        // Count frequency of each digit (0-9) at current position
        int[] freq = new int[10];

        // Extract digit at position 'pos' from each number
        long divisor = (long) Math.pow(10, pos);
        for (int num : nums) {
            // Get digit: (num / 10^pos) % 10
            int digit = (int) ((num / divisor) % 10);
            freq[digit]++;
        }

        // Calculate same-digit pairs at this position
        long sameDigitPairs = 0;
        for (int count : freq) {
            if (count > 1) {
                // C(count, 2) = count*(count-1)/2
                sameDigitPairs += (long) count * (count - 1) / 2;
            }
        }

        // Different-digit pairs = total pairs - same-digit pairs
        // Each different-digit pair contributes 1 to result
        result += (totalPairs - sameDigitPairs);
    }

    return (int) result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × d)**

- We iterate through all n numbers for each of d digit positions
- Extracting a digit is O(1) using division and modulo
- Counting frequencies and calculating combinations is O(10) = O(1) per position
- Total: O(n × d) operations

**Space Complexity: O(1)**

- We use a fixed-size array of 10 integers per position
- No additional data structures scale with input size
- Even with d positions, we reuse the same array

**Why this is optimal:**

- We must examine each digit of each number at least once → Ω(n × d) lower bound
- Our solution achieves this lower bound
- Any solution would need to process all n×d digits

## Common Mistakes

1. **Not handling large n in combinatorial calculations**
   - Calculating n×(n-1)/2 can overflow 32-bit integers when n ≈ 10⁵
   - Solution: Use 64-bit integers (long in Java, int64 in Python)

2. **Incorrect digit extraction**
   - Using string conversion for each digit extraction: O(d) per number instead of O(1)
   - Solution: Use arithmetic: `(num // 10**pos) % 10`
   - Mistake: Processing from most significant digit when numbers have different lengths

3. **Double counting pairs**
   - Adding contributions for both (i,j) and (j,i)
   - Solution: Use combinations C(n,2) not permutations n×(n-1)
   - In frequency counting: C(count,2) not count×(count-1)

4. **Assuming digits are 0-9 only**
   - The problem guarantees decimal digits, but in other contexts (binary, hex) this matters
   - Solution: Check constraints - here it's base-10 digits

## When You'll See This Pattern

This "count contributions per position/feature" pattern appears in several combinatorial problems:

1. **Total Hamming Distance (LeetCode 477)**
   - Count differing bits between all pairs
   - Same pattern: For each bit position, count 0s and 1s
   - Contribution = (count_0 × count_1) for each position

2. **Sum of Distances in Array (LeetCode 2615)**
   - Sum of absolute differences between all pairs
   - Can be optimized by sorting and prefix sums
   - Similar independence of position contributions

3. **Count Number of Excellent Pairs (LeetCode 2354)**
   - Pairs where sum of set bits meets threshold
   - Uses frequency counting of bit counts

**Recognizing the pattern:**

- Problem involves "all pairs" with some pairwise metric
- The metric can be decomposed into independent components (digits, bits, etc.)
- Looking for O(n²) → O(n) improvements via counting

## Key Takeaways

1. **Decompose pairwise metrics** - When a metric between pairs can be expressed as a sum of independent components (like digit positions), process each component separately.

2. **Combinatorial counting beats explicit pairing** - Instead of checking O(n²) pairs, use frequency counts and combinatorics to calculate contributions in O(n).

3. **Watch for overflow in combinatorial formulas** - When n is large (≥10⁴), use 64-bit integers for calculations involving n² terms.

Related problems: [Total Hamming Distance](/problem/total-hamming-distance)
