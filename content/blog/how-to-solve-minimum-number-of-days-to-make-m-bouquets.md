---
title: "How to Solve Minimum Number of Days to Make m Bouquets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Days to Make m Bouquets. Medium difficulty, 56.3% acceptance rate. Topics: Array, Binary Search."
date: "2027-05-19"
category: "dsa-patterns"
tags: ["minimum-number-of-days-to-make-m-bouquets", "array", "binary-search", "medium"]
---

# How to Solve Minimum Number of Days to Make m Bouquets

You need to make `m` bouquets, each requiring `k` adjacent flowers that have bloomed. Each flower blooms on a specific day (`bloomDay[i]`). Find the **minimum number of days** you must wait to have enough bloomed flowers to make all bouquets. The challenge is balancing two constraints: waiting longer gives more bloomed flowers, but you need exactly `k` adjacent ones for each bouquet, and you need `m` such groups.

## Visual Walkthrough

Let's walk through an example:  
`bloomDay = [1, 10, 3, 10, 2]`, `m = 3`, `k = 1`

**Step 1 — Understanding the problem:**

- We need 3 bouquets (`m = 3`).
- Each bouquet needs 1 adjacent flower (`k = 1`).
- Flowers bloom on days: flower0 on day1, flower1 on day10, flower2 on day3, flower3 on day10, flower4 on day2.
- If we pick day 1: only flower0 is bloomed → we have 1 bloomed flower → can make 1 bouquet (since k=1) → not enough (need 3).
- If we pick day 2: flowers 0, 4 bloomed → 2 bouquets → not enough.
- If we pick day 3: flowers 0, 2, 4 bloomed → 3 bouquets → success! Minimum day = 3.

Now a trickier example:  
`bloomDay = [1, 10, 3, 10, 2]`, `m = 3`, `k = 2`

**Step 2 — Adjacency matters:**

- Need 3 bouquets, each with 2 adjacent bloomed flowers.
- Day 3: Bloomed flowers = [1, 0, 1, 0, 1] (1=bloomed, 0=not).  
  Adjacent groups of 2 bloomed flowers: none (pattern is 1,0,1,0,1) → 0 bouquets.
- Day 10: All flowers bloomed → pattern = [1,1,1,1,1].  
  Adjacent groups: indices 0-1 (bouquet1), 2-3 (bouquet2) → only 2 bouquets (flower4 left alone) → not enough.
- Actually, impossible to make 3 bouquets with k=2 from 5 flowers (need 6 flowers total). So answer = -1.

This shows two key insights:

1. We need to check if `m * k > n` → impossible → return -1 immediately.
2. The relationship between days and bouquets is **monotonic**: if we can make m bouquets on day X, we can definitely make them on any day > X (more flowers bloom). This allows binary search.

## Brute Force Approach

A brute force approach would check every possible day from 1 to the maximum bloom day:

1. Check if `m * k > n` → return -1.
2. For each day `d` from 1 to `max(bloomDay)`:
   - Count how many bouquets can be made on that day.
   - If bouquets ≥ m, return `d`.

**Counting bouquets on a given day:**  
Iterate through flowers, count consecutive bloomed flowers. When we have `k` consecutive bloomed flowers, that's one bouquet, reset count.

**Why it's too slow:**  
If max bloom day is large (e.g., 10^9), iterating day by day is impossible. Even with bloom days up to 10^9 and n=10^5, we'd do ~10^9 operations → too slow. We need a faster way to find the minimal day.

## Optimized Approach

The key insight is **monotonicity**:

- If we can make `m` bouquets on day `X`, we can definitely make them on any day > `X` (more flowers bloom).
- If we cannot make `m` bouquets on day `X`, we cannot make them on any day < `X` (fewer flowers bloom).

This means the function `canMake(day)` is monotonic (false → false → ... → true → true). We can use **binary search** to find the first day where `canMake` becomes true.

**Binary search setup:**

- Left boundary: `left = min(bloomDay)` (could even be 1, but min is tighter).
- Right boundary: `right = max(bloomDay)`.
- While `left < right`:
  - `mid = (left + right) // 2`
  - If `canMake(mid)` is true → answer ≤ mid → set `right = mid`.
  - Else → answer > mid → set `left = mid + 1`.
- Return `left` (or `right`) as the minimal day.

**Counting bouquets efficiently in `canMake(day)`:**

- Iterate through flowers.
- If flower bloom day ≤ current day → it's bloomed → increment consecutive count.
- Else → reset consecutive count to 0.
- When consecutive count reaches `k` → increment bouquet count, reset consecutive count to 0.
- If bouquet count reaches `m` → return true early.
- After loop, return bouquet count ≥ m.

This counting runs in O(n) per check, and binary search does O(log(maxDay)) checks → total O(n log(maxDay)).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log(max(bloomDay))) | Space: O(1)
def minDays(bloomDay, m, k):
    n = len(bloomDay)

    # Edge case: not enough flowers total
    if m * k > n:
        return -1

    # Helper: check if we can make m bouquets by given day
    def canMake(day):
        bouquets = 0
        consecutive = 0

        for bloom in bloomDay:
            if bloom <= day:
                # Flower is bloomed
                consecutive += 1
                if consecutive == k:
                    # We have k adjacent bloomed flowers → one bouquet
                    bouquets += 1
                    consecutive = 0
                    # Early exit if we already have enough bouquets
                    if bouquets >= m:
                        return True
            else:
                # Flower not bloomed → break adjacency
                consecutive = 0

        return bouquets >= m

    # Binary search boundaries
    left, right = min(bloomDay), max(bloomDay)

    # Binary search for minimal day
    while left < right:
        mid = (left + right) // 2
        if canMake(mid):
            # We can make bouquets by mid → try smaller days
            right = mid
        else:
            # Cannot make bouquets by mid → need more time
            left = mid + 1

    # left is the minimal day where canMake becomes true
    return left
```

```javascript
// Time: O(n log(max(bloomDay))) | Space: O(1)
function minDays(bloomDay, m, k) {
  const n = bloomDay.length;

  // Edge case: not enough flowers total
  if (m * k > n) return -1;

  // Helper: check if we can make m bouquets by given day
  const canMake = (day) => {
    let bouquets = 0;
    let consecutive = 0;

    for (let bloom of bloomDay) {
      if (bloom <= day) {
        // Flower is bloomed
        consecutive++;
        if (consecutive === k) {
          // We have k adjacent bloomed flowers → one bouquet
          bouquets++;
          consecutive = 0;
          // Early exit if we already have enough bouquets
          if (bouquets >= m) return true;
        }
      } else {
        // Flower not bloomed → break adjacency
        consecutive = 0;
      }
    }

    return bouquets >= m;
  };

  // Binary search boundaries
  let left = Math.min(...bloomDay);
  let right = Math.max(...bloomDay);

  // Binary search for minimal day
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canMake(mid)) {
      // We can make bouquets by mid → try smaller days
      right = mid;
    } else {
      // Cannot make bouquets by mid → need more time
      left = mid + 1;
    }
  }

  // left is the minimal day where canMake becomes true
  return left;
}
```

```java
// Time: O(n log(max(bloomDay))) | Space: O(1)
class Solution {
    public int minDays(int[] bloomDay, int m, int k) {
        int n = bloomDay.length;

        // Edge case: not enough flowers total
        if (m * k > n) return -1;

        // Find min and max bloom days for binary search boundaries
        int left = Integer.MAX_VALUE;
        int right = Integer.MIN_VALUE;
        for (int day : bloomDay) {
            left = Math.min(left, day);
            right = Math.max(right, day);
        }

        // Binary search for minimal day
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (canMake(bloomDay, m, k, mid)) {
                // We can make bouquets by mid → try smaller days
                right = mid;
            } else {
                // Cannot make bouquets by mid → need more time
                left = mid + 1;
            }
        }

        // left is the minimal day where canMake becomes true
        return left;
    }

    // Helper: check if we can make m bouquets by given day
    private boolean canMake(int[] bloomDay, int m, int k, int day) {
        int bouquets = 0;
        int consecutive = 0;

        for (int bloom : bloomDay) {
            if (bloom <= day) {
                // Flower is bloomed
                consecutive++;
                if (consecutive == k) {
                    // We have k adjacent bloomed flowers → one bouquet
                    bouquets++;
                    consecutive = 0;
                    // Early exit if we already have enough bouquets
                    if (bouquets >= m) return true;
                }
            } else {
                // Flower not bloomed → break adjacency
                consecutive = 0;
            }
        }

        return bouquets >= m;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log(maxDay))

- `canMake(day)` runs in O(n) — we iterate through all flowers once.
- Binary search runs O(log(maxDay)) times, where maxDay = max(bloomDay).
- Total: O(n log(maxDay)).

**Space Complexity:** O(1)

- We only use a few variables for counting and binary search.
- No extra data structures proportional to input size.

## Common Mistakes

1. **Forgetting the impossible case:** Not checking `m * k > n` early. If you need more flowers than exist, return -1 immediately. Otherwise, binary search might return an incorrect day.

2. **Incorrect bouquet counting:** When counting consecutive bloomed flowers, you must reset the count to 0 when encountering a non-bloomed flower. Also, after making a bouquet (when count reaches k), reset to 0 to avoid overlapping bouquets (unless the problem allowed overlapping, which it doesn't).

3. **Binary search off-by-one errors:** Using `while (left <= right)` instead of `while (left < right)` can cause infinite loops. With our approach (`right = mid` when true, `left = mid + 1` when false), `left < right` is correct. Also, using `mid = (left + right) // 2` is fine in Python/JS, but in Java use `left + (right - left) / 2` to avoid overflow.

4. **Not using early exit in `canMake`:** Once bouquet count reaches m, you can return true immediately. This optimization doesn't change worst-case complexity but helps in practice.

## When You'll See This Pattern

This "binary search on answer" pattern appears when:

1. The answer is an integer within a known range.
2. There's a monotonic predicate function `canDo(x)` that returns true for all values ≥ some threshold.
3. Direct computation is expensive, but checking the predicate is cheaper.

**Related LeetCode problems:**

- **Capacity To Ship Packages Within D Days (Medium):** Find minimal ship capacity to ship all packages within D days. Binary search on capacity, with predicate "can ship within D days".
- **Koko Eating Bananas (Medium):** Find minimal eating speed to finish bananas in H hours. Binary search on speed, with predicate "can finish in H hours".
- **Split Array Largest Sum (Hard):** Find minimal largest sum when splitting array into m subarrays. Binary search on the sum, with predicate "can split into ≤ m subarrays".

## Key Takeaways

1. **Recognize monotonicity:** If a problem asks for "minimum X such that condition Y is met" and condition Y becomes easier as X increases, think binary search on X.

2. **Separate predicate from search:** Design a function `canMake(value)` that checks if the condition is satisfied for a given value. Then binary search over the possible values.

3. **Check feasibility early:** Before binary search, handle obvious impossible cases (like `m * k > n` here) to avoid incorrect results.

Related problems: [Maximize the Confusion of an Exam](/problem/maximize-the-confusion-of-an-exam), [Earliest Possible Day of Full Bloom](/problem/earliest-possible-day-of-full-bloom)
