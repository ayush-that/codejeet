---
title: "How to Solve Arranging Coins — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Arranging Coins. Easy difficulty, 48.0% acceptance rate. Topics: Math, Binary Search."
date: "2027-03-02"
category: "dsa-patterns"
tags: ["arranging-coins", "math", "binary-search", "easy"]
---

# How to Solve Arranging Coins

You have `n` coins and need to arrange them into a staircase pattern where the first row has 1 coin, second row has 2 coins, and so on. Your task is to find how many **complete** rows you can build. The challenge is that the last row may be incomplete, and you need an efficient solution that works for large values of `n` (up to 2³¹ - 1).

What makes this problem interesting is that while a brute force approach is straightforward, the optimal solution requires either mathematical insight or binary search thinking. It's a great example of how a simple problem can have elegant, efficient solutions.

## Visual Walkthrough

Let's trace through an example with `n = 8` coins:

**Step 1:** Start building rows from the top:

- Row 1: Needs 1 coin → Use 1 coin (7 left)
- Row 2: Needs 2 coins → Use 2 coins (5 left)
- Row 3: Needs 3 coins → Use 3 coins (2 left)
- Row 4: Needs 4 coins → Only 2 coins left, so this row is incomplete

**Step 2:** Count complete rows:
We have 3 complete rows (rows 1, 2, and 3) and 2 leftover coins that can't complete row 4.

**Result:** For `n = 8`, we can build 3 complete rows.

Notice the pattern: The total coins needed for `k` complete rows is `1 + 2 + 3 + ... + k = k(k+1)/2`. We need to find the largest `k` such that `k(k+1)/2 ≤ n`.

## Brute Force Approach

The most straightforward solution is to simulate building the staircase row by row:

1. Start with `k = 1` (first row)
2. Subtract `k` from `n` (use coins for current row)
3. If `n` is still non-negative, increment `k` and continue
4. Stop when you don't have enough coins for the next row
5. Return `k - 1` (the last complete row)

<div class="code-group">

```python
# Time: O(√n) | Space: O(1)
def arrangeCoinsBruteForce(n: int) -> int:
    k = 1  # Start with first row
    while n >= k:
        n -= k  # Use coins for current row
        k += 1  # Move to next row
    return k - 1  # Last complete row
```

```javascript
// Time: O(√n) | Space: O(1)
function arrangeCoinsBruteForce(n) {
  let k = 1; // Start with first row
  while (n >= k) {
    n -= k; // Use coins for current row
    k++; // Move to next row
  }
  return k - 1; // Last complete row
}
```

```java
// Time: O(√n) | Space: O(1)
public int arrangeCoinsBruteForce(int n) {
    int k = 1;  // Start with first row
    while (n >= k) {
        n -= k;  // Use coins for current row
        k++;     // Move to next row
    }
    return k - 1;  // Last complete row
}
```

</div>

**Why this isn't optimal:** The time complexity is O(√n) because we iterate until `k` reaches approximately √(2n). For `n = 2³¹ - 1` (the maximum input), this could mean up to ~46,340 iterations. While this might be acceptable for many cases, we can do better with O(log n) solutions.

## Optimal Solution

We have two optimal approaches, both with O(log n) time complexity:

### Approach 1: Binary Search

We're looking for the largest `k` where `k(k+1)/2 ≤ n`. This is a monotonic condition (if it's true for some `k`, it's true for all smaller values), so we can use binary search.

### Approach 2: Mathematical Solution

Solve the quadratic equation `k(k+1)/2 ≤ n` for `k`, which gives us `k ≤ (-1 + √(1 + 8n))/2`.

Here's the binary search solution (more general and interview-friendly):

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def arrangeCoins(n: int) -> int:
    """
    Find the maximum k such that k(k+1)/2 <= n using binary search.

    Args:
        n: Number of coins available

    Returns:
        Number of complete rows that can be built
    """
    left, right = 0, n  # Search space for k

    while left <= right:
        # Calculate middle point
        mid = left + (right - left) // 2

        # Calculate total coins needed for mid rows
        # Using formula: mid * (mid + 1) // 2
        coins_needed = mid * (mid + 1) // 2

        if coins_needed == n:
            # Found exact match - mid rows can be built completely
            return mid
        elif coins_needed < n:
            # We can build at least mid rows, try for more
            left = mid + 1
        else:
            # Need too many coins, try fewer rows
            right = mid - 1

    # When loop ends, right is the largest k where k(k+1)/2 <= n
    # This is because:
    # - left > right
    # - right was last valid k (coins_needed <= n)
    # - left was first invalid k (coins_needed > n)
    return right
```

```javascript
// Time: O(log n) | Space: O(1)
function arrangeCoins(n) {
  /**
   * Find the maximum k such that k(k+1)/2 <= n using binary search.
   *
   * @param {number} n - Number of coins available
   * @return {number} Number of complete rows that can be built
   */
  let left = 0;
  let right = n;

  while (left <= right) {
    // Calculate middle point
    const mid = Math.floor(left + (right - left) / 2);

    // Calculate total coins needed for mid rows
    // Using formula: mid * (mid + 1) / 2
    const coinsNeeded = (mid * (mid + 1)) / 2;

    if (coinsNeeded === n) {
      // Found exact match - mid rows can be built completely
      return mid;
    } else if (coinsNeeded < n) {
      // We can build at least mid rows, try for more
      left = mid + 1;
    } else {
      // Need too many coins, try fewer rows
      right = mid - 1;
    }
  }

  // When loop ends, right is the largest k where k(k+1)/2 <= n
  return right;
}
```

```java
// Time: O(log n) | Space: O(1)
public int arrangeCoins(int n) {
    /**
     * Find the maximum k such that k(k+1)/2 <= n using binary search.
     *
     * @param n Number of coins available
     * @return Number of complete rows that can be built
     */
    long left = 0;  // Use long to avoid overflow
    long right = n;

    while (left <= right) {
        // Calculate middle point
        long mid = left + (right - left) / 2;

        // Calculate total coins needed for mid rows
        // Using formula: mid * (mid + 1) / 2
        long coinsNeeded = mid * (mid + 1) / 2;

        if (coinsNeeded == n) {
            // Found exact match - mid rows can be built completely
            return (int) mid;
        } else if (coinsNeeded < n) {
            // We can build at least mid rows, try for more
            left = mid + 1;
        } else {
            // Need too many coins, try fewer rows
            right = mid - 1;
        }
    }

    // When loop ends, right is the largest k where k(k+1)/2 <= n
    return (int) right;
}
```

</div>

**Mathematical solution alternative:**

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def arrangeCoinsMath(n: int) -> int:
    """
    Solve k(k+1)/2 <= n using quadratic formula.
    k = floor((-1 + sqrt(1 + 8n)) / 2)
    """
    import math
    return int((-1 + math.sqrt(1 + 8 * n)) // 2)
```

```javascript
// Time: O(1) | Space: O(1)
function arrangeCoinsMath(n) {
  /**
   * Solve k(k+1)/2 <= n using quadratic formula.
   * k = floor((-1 + sqrt(1 + 8n)) / 2)
   */
  return Math.floor((-1 + Math.sqrt(1 + 8 * n)) / 2);
}
```

```java
// Time: O(1) | Space: O(1)
public int arrangeCoinsMath(int n) {
    /**
     * Solve k(k+1)/2 <= n using quadratic formula.
     * k = floor((-1 + sqrt(1 + 8n)) / 2)
     */
    return (int)((-1 + Math.sqrt(1 + 8L * n)) / 2);
}
```

</div>

## Complexity Analysis

**Binary Search Solution:**

- **Time Complexity:** O(log n) - We halve the search space in each iteration
- **Space Complexity:** O(1) - We only use a few variables

**Mathematical Solution:**

- **Time Complexity:** O(1) - Constant time operations
- **Space Complexity:** O(1) - Constant space

**Why binary search works:** The condition `k(k+1)/2 ≤ n` defines a monotonic function. For any `k`, if the condition holds, it also holds for all smaller values. This monotonic property is essential for binary search.

## Common Mistakes

1. **Off-by-one errors in binary search:** The most common mistake is returning `left` instead of `right` (or vice versa). Remember: when the loop ends, `right` points to the last valid `k` where `k(k+1)/2 ≤ n`, while `left` points to the first invalid `k`.

2. **Integer overflow:** When calculating `mid * (mid + 1) / 2`, the intermediate result can overflow for large `n`. In Java, use `long` for calculations. In Python, integers are arbitrary precision, but in other languages, be mindful of this.

3. **Forgetting to handle edge cases:**
   - `n = 0`: Should return 0 (no complete rows)
   - `n = 1`: Should return 1 (one complete row with 1 coin)
   - Very large `n` (2³¹ - 1): Ensure solution doesn't overflow or time out

4. **Incorrect loop condition in brute force:** Using `while (n > 0)` instead of `while (n >= k)` will give wrong results because you might stop too early when you have exactly enough coins for a row.

## When You'll See This Pattern

The "arranging coins" problem teaches two important patterns:

1. **Binary search on answer:** When you need to find the maximum/minimum value satisfying a condition, and the condition is monotonic, binary search is often the solution. Related problems:
   - **Sqrt(x)** (LeetCode 69): Find integer square root using binary search
   - **Capacity To Ship Packages Within D Days** (LeetCode 1011): Find minimum capacity satisfying constraints
   - **Koko Eating Bananas** (LeetCode 875): Find minimum eating speed

2. **Mathematical formula optimization:** Recognizing that a summation can be expressed as a closed-form formula (`k(k+1)/2` for triangular numbers) allows O(1) solutions. Related problems:
   - **Bulb Switcher** (LeetCode 319): Uses mathematical insight about perfect squares
   - **Perfect Squares** (LeetCode 279): Can use Lagrange's four-square theorem

## Key Takeaways

1. **Look for monotonic conditions:** If you can frame the problem as "find the largest X such that f(X) ≤ n" where f is monotonic, binary search is likely applicable.

2. **Know your summation formulas:** The triangular number formula `k(k+1)/2` appears frequently in problems involving sequential sums. Other useful formulas include arithmetic series and geometric series.

3. **Consider multiple approaches:** Even "easy" problems can have elegant mathematical solutions. Always ask: "Can I solve this with a formula instead of iteration?"

4. **Test edge cases thoroughly:** With binary search, always test cases where the answer is at the boundaries (0, 1, max value) and where there's an exact match vs. approximate match.

[Practice this problem on CodeJeet](/problem/arranging-coins)
