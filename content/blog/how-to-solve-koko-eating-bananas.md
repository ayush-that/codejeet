---
title: "How to Solve Koko Eating Bananas — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Koko Eating Bananas. Medium difficulty, 49.7% acceptance rate. Topics: Array, Binary Search."
date: "2026-07-13"
category: "dsa-patterns"
tags: ["koko-eating-bananas", "array", "binary-search", "medium"]
---

# How to Solve Koko Eating Bananas

Koko needs to eat all bananas from `n` piles within `h` hours, choosing a constant eating speed `k` bananas per hour. Each hour she eats from one pile, and if a pile has fewer than `k` bananas left, she finishes that pile and doesn't eat more that hour. The challenge is finding the **minimum integer `k`** that allows her to finish within `h` hours. What makes this interesting is that it's not about finding an exact match but searching for the smallest valid speed—a perfect candidate for binary search on the answer space.

## Visual Walkthrough

Let's walk through example: `piles = [3,6,7,11]`, `h = 8`.

**Step 1: Understanding the problem**

- If Koko chooses speed `k=1`:
  - Pile 1 (3 bananas): takes 3 hours (1+1+1)
  - Pile 2 (6 bananas): takes 6 hours
  - Pile 3 (7 bananas): takes 7 hours
  - Pile 4 (11 bananas): takes 11 hours
  - Total hours = 3+6+7+11 = 27 hours → too slow (needs ≤8 hours)

**Step 2: Trying a reasonable speed**

- If `k=11` (largest pile):
  - Pile 1: ⌈3/11⌉ = 1 hour
  - Pile 2: ⌈6/11⌉ = 1 hour
  - Pile 3: ⌈7/11⌉ = 1 hour
  - Pile 4: ⌈11/11⌉ = 1 hour
  - Total = 4 hours → works, but maybe we can go slower

**Step 3: Finding the minimum**
We need the smallest `k` where total hours ≤ 8. Let's test systematically:

- `k=4`: Hours = ⌈3/4⌉+⌈6/4⌉+⌈7/4⌉+⌈11/4⌉ = 1+2+2+3 = 8 → works!
- `k=3`: Hours = ⌈3/3⌉+⌈6/3⌉+⌈7/3⌉+⌈11/3⌉ = 1+2+3+4 = 10 → too slow

So answer is `k=4`. The key insight: we're searching for the smallest `k` in range [1, max(piles)] that satisfies the time constraint.

## Brute Force Approach

The brute force solution tries every possible speed from 1 up to the maximum pile size:

1. For each speed `k` from 1 to max(piles)
2. Calculate total hours needed = sum(⌈pile/k⌉ for all piles)
3. If total hours ≤ h, return `k` (first valid one is minimum)

**Why it's too slow:**

- Maximum pile size could be up to 10⁹ (per constraints)
- That means up to 1 billion iterations in worst case
- Each iteration sums over all piles (up to 10⁴ piles)
- Total operations could be 10⁹ × 10⁴ = 10¹³ → far too slow

<div class="code-group">

```python
# Time: O(n * max(pile)) - Too slow for large inputs!
# Space: O(1)
def minEatingSpeed_brute(piles, h):
    max_pile = max(piles)

    # Try every possible speed from 1 to max pile
    for k in range(1, max_pile + 1):
        total_hours = 0

        # Calculate hours needed at this speed
        for pile in piles:
            total_hours += (pile + k - 1) // k  # Ceiling division

        # Check if this speed works
        if total_hours <= h:
            return k

    return max_pile  # Fallback, should never reach here
```

```javascript
// Time: O(n * max(pile)) - Too slow for large inputs!
// Space: O(1)
function minEatingSpeedBrute(piles, h) {
  const maxPile = Math.max(...piles);

  // Try every possible speed from 1 to max pile
  for (let k = 1; k <= maxPile; k++) {
    let totalHours = 0;

    // Calculate hours needed at this speed
    for (const pile of piles) {
      totalHours += Math.ceil(pile / k);
    }

    // Check if this speed works
    if (totalHours <= h) {
      return k;
    }
  }

  return maxPile; // Fallback
}
```

```java
// Time: O(n * max(pile)) - Too slow for large inputs!
// Space: O(1)
public int minEatingSpeedBrute(int[] piles, int h) {
    int maxPile = 0;
    for (int pile : piles) {
        maxPile = Math.max(maxPile, pile);
    }

    // Try every possible speed from 1 to max pile
    for (int k = 1; k <= maxPile; k++) {
        int totalHours = 0;

        // Calculate hours needed at this speed
        for (int pile : piles) {
            totalHours += (pile + k - 1) / k;  // Ceiling division
        }

        // Check if this speed works
        if (totalHours <= h) {
            return k;
        }
    }

    return maxPile;  // Fallback
}
```

</div>

## Optimized Approach

The key insight: **We can use binary search** because:

1. If speed `k` works, any speed > `k` also works (monotonic property)
2. If speed `k` doesn't work, any speed < `k` also doesn't work
3. We're searching for the minimum valid `k` in a sorted range [1, max(piles)]

**Why binary search works:**

- Think of speeds as: [1, 2, 3, ..., max_pile]
- For each speed, we get a boolean: "can finish in ≤ h hours?"
- This boolean array looks like: [false, false, ..., false, true, true, ..., true]
- We need to find the **first true** → perfect for binary search!

**Step-by-step reasoning:**

1. **Lower bound (left)**: Minimum possible speed is 1 (eat 1 banana/hour)
2. **Upper bound (right)**: Maximum needed speed is max(piles) (eat entire largest pile in 1 hour)
3. **Check function**: For a given `k`, calculate total hours = sum(⌈pile/k⌉)
4. **Binary search**:
   - If `k` works (total_hours ≤ h), try smaller speeds (move right = mid)
   - If `k` doesn't work, try larger speeds (move left = mid + 1)
5. **Termination**: When left == right, we've found minimum valid speed

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log(max(pile))) - Binary search with linear validation
# Space: O(1) - Only using constant extra space
def minEatingSpeed(piles, h):
    # Step 1: Establish search boundaries
    # Minimum possible speed is 1 (eat 1 banana per hour)
    # Maximum needed speed is max(piles) (finish largest pile in 1 hour)
    left, right = 1, max(piles)

    # Step 2: Binary search for minimum valid speed
    while left < right:
        # Calculate middle speed to test
        mid = (left + right) // 2

        # Step 3: Check if mid speed works
        total_hours = 0
        for pile in piles:
            # Ceiling division: (pile + mid - 1) // mid
            # Equivalent to math.ceil(pile / mid) but faster
            total_hours += (pile + mid - 1) // mid

        # Step 4: Adjust search boundaries based on result
        if total_hours <= h:
            # mid works, so minimum valid speed is ≤ mid
            # Search in lower half (including mid)
            right = mid
        else:
            # mid doesn't work, so minimum valid speed is > mid
            # Search in upper half (excluding mid)
            left = mid + 1

    # Step 5: When left == right, we've found minimum valid speed
    return left
```

```javascript
// Time: O(n * log(max(pile))) - Binary search with linear validation
// Space: O(1) - Only using constant extra space
function minEatingSpeed(piles, h) {
  // Step 1: Establish search boundaries
  // Minimum possible speed is 1 (eat 1 banana per hour)
  // Maximum needed speed is max(piles) (finish largest pile in 1 hour)
  let left = 1;
  let right = Math.max(...piles);

  // Step 2: Binary search for minimum valid speed
  while (left < right) {
    // Calculate middle speed to test
    const mid = Math.floor((left + right) / 2);

    // Step 3: Check if mid speed works
    let totalHours = 0;
    for (const pile of piles) {
      // Ceiling division: Math.ceil(pile / mid)
      totalHours += Math.ceil(pile / mid);
    }

    // Step 4: Adjust search boundaries based on result
    if (totalHours <= h) {
      // mid works, so minimum valid speed is ≤ mid
      // Search in lower half (including mid)
      right = mid;
    } else {
      // mid doesn't work, so minimum valid speed is > mid
      // Search in upper half (excluding mid)
      left = mid + 1;
    }
  }

  // Step 5: When left == right, we've found minimum valid speed
  return left;
}
```

```java
// Time: O(n * log(max(pile))) - Binary search with linear validation
// Space: O(1) - Only using constant extra space
public int minEatingSpeed(int[] piles, int h) {
    // Step 1: Find maximum pile size for upper bound
    int maxPile = 0;
    for (int pile : piles) {
        maxPile = Math.max(maxPile, pile);
    }

    // Step 2: Establish search boundaries
    // Minimum possible speed is 1 (eat 1 banana per hour)
    // Maximum needed speed is max(piles) (finish largest pile in 1 hour)
    int left = 1;
    int right = maxPile;

    // Step 3: Binary search for minimum valid speed
    while (left < right) {
        // Calculate middle speed to test
        int mid = left + (right - left) / 2;  // Avoids overflow

        // Step 4: Check if mid speed works
        int totalHours = 0;
        for (int pile : piles) {
            // Ceiling division: (pile + mid - 1) / mid
            totalHours += (pile + mid - 1) / mid;
        }

        // Step 5: Adjust search boundaries based on result
        if (totalHours <= h) {
            // mid works, so minimum valid speed is ≤ mid
            // Search in lower half (including mid)
            right = mid;
        } else {
            // mid doesn't work, so minimum valid speed is > mid
            // Search in upper half (excluding mid)
            left = mid + 1;
        }
    }

    // Step 6: When left == right, we've found minimum valid speed
    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × log M)**

- `n` = number of piles (length of input array)
- `M` = maximum pile size (upper bound for binary search)
- Binary search performs O(log M) iterations
- Each iteration calculates total hours in O(n) time
- Total: O(n × log M)

**Space Complexity: O(1)**

- We only use a few variables (left, right, mid, total_hours)
- No additional data structures proportional to input size
- Even the recursive stack for binary search is iterative, not recursive

**Why this is efficient:**

- For worst-case constraints (n=10⁴, M=10⁹):
  - Brute force: 10⁴ × 10⁹ = 10¹³ operations
  - Binary search: 10⁴ × log₂(10⁹) ≈ 10⁴ × 30 = 300,000 operations
- Over 30,000× faster than brute force!

## Common Mistakes

1. **Incorrect binary search boundaries**
   - Starting with `left = 0` instead of `1` (speed must be positive)
   - Using `right = max(piles) - 1` and missing the case where answer equals max(piles)
   - **Fix**: Always use `left = 1`, `right = max(piles)`

2. **Wrong ceiling division implementation**
   - Using `pile // k` (floor division) instead of ceiling division
   - Using `math.ceil(pile / k)` without converting to float first in some languages
   - **Fix**: Use `(pile + k - 1) // k` (integer ceiling division) or proper `Math.ceil()`

3. **Off-by-one in binary search loop**
   - Using `while (left ≤ right)` and getting stuck in infinite loop
   - Incorrectly updating `right = mid - 1` when `mid` works (could skip valid answer)
   - **Fix**: Standard pattern: `while (left < right)` with `right = mid` when valid, `left = mid + 1` when invalid

4. **Not handling large numbers efficiently**
   - Calculating total hours as float then converting to int (precision issues)
   - Using recursion for binary search (stack overflow for large M)
   - **Fix**: Use integer arithmetic and iterative binary search

## When You'll See This Pattern

This "binary search on answer" pattern appears when:

1. You're asked to find **minimum** or **maximum** of something
2. There's a **monotonic relationship** (if X works, then anything > X also works, or vice versa)
3. The search space is too large for linear search

**Related LeetCode problems:**

1. **Minimize Max Distance to Gas Station (Hard)**
   - Similar: Binary search for minimum maximum distance between gas stations
   - Instead of hours vs speed, it's distance vs additional stations

2. **Maximum Candies Allocated to K Children (Medium)**
   - Similar: Binary search for maximum candies per child
   - Check function: "Can we give at least X candies to each of K children?"

3. **Capacity To Ship Packages Within D Days (Medium)**
   - Almost identical structure: Minimum capacity to ship packages in D days
   - Check function: "Can we ship all packages with capacity C in ≤ D days?"

4. **Split Array Largest Sum (Hard)**
   - Binary search for minimum largest sum when splitting array into m parts
   - Same "minimize maximum" pattern with monotonic check function

## Key Takeaways

1. **Recognize "binary search on answer" problems**: When asked for minimum/maximum value where checking if a value works is easier than finding the value directly, and the validity function is monotonic.

2. **Template for binary search on answer**:
   - Define search range `[left, right]` covering all possible answers
   - Write a function `canDo(x)` that checks if `x` works
   - Use standard binary search: `while left < right`, update `right = mid` when valid, `left = mid + 1` when invalid

3. **Ceiling division trick**: `(a + b - 1) // b` gives `⌈a/b⌉` for positive integers without floating-point operations.

Related problems: [Minimize Max Distance to Gas Station](/problem/minimize-max-distance-to-gas-station), [Maximum Candies Allocated to K Children](/problem/maximum-candies-allocated-to-k-children), [Minimized Maximum of Products Distributed to Any Store](/problem/minimized-maximum-of-products-distributed-to-any-store)
