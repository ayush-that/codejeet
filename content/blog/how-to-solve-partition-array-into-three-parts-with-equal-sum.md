---
title: "How to Solve Partition Array Into Three Parts With Equal Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Partition Array Into Three Parts With Equal Sum. Easy difficulty, 42.6% acceptance rate. Topics: Array, Greedy."
date: "2027-01-29"
category: "dsa-patterns"
tags: ["partition-array-into-three-parts-with-equal-sum", "array", "greedy", "easy"]
---

## How to Solve Partition Array Into Three Parts With Equal Sum

This problem asks whether we can split an array into three **non-empty** contiguous parts where each part has the same sum. The challenge lies in efficiently finding two split points without checking every possible pair, which would be too slow for large arrays. The key insight is that if the total sum isn't divisible by 3, it's immediately impossible. Otherwise, we can greedily find partitions by accumulating sums to exactly one-third of the total.

---

## Visual Walkthrough

Let's trace through `arr = [1, 3, 4, 2, 2, 2, 1, 1, 2]`:

**Step 1: Check total sum**  
Total = 1 + 3 + 4 + 2 + 2 + 2 + 1 + 1 + 2 = 18  
18 ÷ 3 = 6 → target sum for each part is 6.

**Step 2: Find first partition**  
We accumulate from left:

- Start at 0, sum = 0
- Add 1 → sum = 1
- Add 3 → sum = 4
- Add 4 → sum = 8 → exceeds 6? Wait, we need exactly 6, not just ≤6.  
  Actually, we need to find where running sum equals 6:  
  1 + 3 + 4 = 8 (too big), so this won't work. Let's try a better example.

**Better example:** `arr = [0, 2, 1, -6, 6, -7, 9, 1, 2, 0, 1]`  
Total = 0 + 2 + 1 + (-6) + 6 + (-7) + 9 + 1 + 2 + 0 + 1 = 9  
9 ÷ 3 = 3 → target = 3.

**Find first partition:**  
Accumulate: 0 → 0, +2 → 2, +1 → 3 ✅ First split at index 2 (sum of arr[0..2] = 3).

**Find second partition:**  
Reset sum, continue from index 3:  
-6 → -6, +6 → 0, +(-7) → -7, +9 → 2, +1 → 3 ✅ Second split at index 7 (sum of arr[3..7] = 3).

**Remaining part:** arr[8..10] = 2 + 0 + 1 = 3 ✅

We found two splits (i=2, j=7) satisfying the condition. The algorithm works by scanning once, counting how many times we reach exactly the target sum.

---

## Brute Force Approach

A naive solution would try all possible pairs of split points `(i, j)` where `0 ≤ i < j < n-1` (ensuring three non-empty parts). For each pair, compute three sums and check equality. This requires O(n³) time if we recompute sums each time, or O(n²) with prefix sums. Still too slow for n up to 5×10⁴.

**Why brute force fails:**

- O(n²) pairs to check
- Each sum computation takes O(n) if done naively
- Even with prefix sums, O(n²) is too slow for large n

The optimal solution uses a greedy single-pass approach.

---

## Optimal Solution

We can solve this in one pass using these steps:

1. Calculate total sum. If not divisible by 3, return false.
2. Compute target = total / 3.
3. Scan through array, accumulating running sum.
4. Count how many times running sum equals target.
5. If we reach target exactly 3 times (or more in special cases), return true.

**Special case:** If target = 0, we can have more than 3 segments with sum 0, but we still need at least 3 non-empty parts. So we check if count ≥ 3.

**Why this works:**  
Because we need contiguous segments, whenever running sum equals target, we can end a segment there. If we get exactly 3 segments by the end (and the last segment sum also equals target), we succeed.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def canThreePartsEqualSum(arr):
    total = sum(arr)

    # Step 1: If total sum not divisible by 3, impossible
    if total % 3 != 0:
        return False

    target = total // 3
    current_sum = 0
    count = 0

    # Step 2: Scan through array
    for num in arr:
        current_sum += num

        # When we hit target, end current segment
        if current_sum == target:
            count += 1
            current_sum = 0  # Reset for next segment

    # Step 3: Check if we found at least 3 segments
    # For target = 0, we might have more than 3 segments
    # For target ≠ 0, we need exactly 3 segments
    return count >= 3
```

```javascript
// Time: O(n) | Space: O(1)
function canThreePartsEqualSum(arr) {
  // Step 1: Calculate total sum
  let total = arr.reduce((sum, num) => sum + num, 0);

  // If not divisible by 3, impossible
  if (total % 3 !== 0) return false;

  const target = total / 3;
  let currentSum = 0;
  let count = 0;

  // Step 2: Scan through array
  for (let num of arr) {
    currentSum += num;

    // When current sum equals target, we found a segment
    if (currentSum === target) {
      count++;
      currentSum = 0; // Reset for next segment
    }
  }

  // Step 3: Need at least 3 segments
  return count >= 3;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean canThreePartsEqualSum(int[] arr) {
        // Step 1: Calculate total sum
        int total = 0;
        for (int num : arr) {
            total += num;
        }

        // If not divisible by 3, impossible
        if (total % 3 != 0) return false;

        int target = total / 3;
        int currentSum = 0;
        int count = 0;

        // Step 2: Scan through array
        for (int num : arr) {
            currentSum += num;

            // When we hit target, end current segment
            if (currentSum == target) {
                count++;
                currentSum = 0; // Reset for next segment
            }
        }

        // Step 3: Need at least 3 segments
        return count >= 3;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(n)

- We compute total sum with one pass: O(n)
- We scan array once to count segments: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity:** O(1)

- We only use a few integer variables
- No additional data structures needed

---

## Common Mistakes

1. **Not checking total % 3 early**  
   Some candidates start scanning without checking divisibility. This wastes time and might give wrong answers for arrays where sum isn't divisible by 3.

2. **Incorrect handling of target = 0**  
   When target = 0, we can have more than 3 segments (e.g., [0,0,0,0,0]). The condition should be `count >= 3`, not `count == 3`. Candidates often miss this edge case.

3. **Forgetting non-empty requirement**  
   The problem requires three **non-empty** parts. If we reset count too early or check wrong indices, we might accept empty segments. Our algorithm ensures non-empty segments because we only increment count after accumulating some elements.

4. **Off-by-one in split indices**  
   Some solutions try to track exact split points i and j, which adds complexity. The counting approach avoids this entirely.

---

## When You'll See This Pattern

This greedy accumulation pattern appears in problems where you need to partition an array into segments with equal sums or other properties:

1. **Find the Middle Index in Array (LeetCode 1991)**  
   Find index where left sum equals right sum. Similar idea: accumulate from left while tracking total sum.

2. **Partition Array Into Two Parts With Equal Sum (similar to LeetCode 416)**  
   Check if array can be split into two subsets with equal sum. Uses similar "find target sum" logic.

3. **Maximum Number of Ways to Partition Array**  
   Variations where you count how many ways to split into k equal-sum segments.

The core technique is:

1. Compute target from total
2. Greedily accumulate until hitting target
3. Reset and continue

---

## Key Takeaways

1. **Divisibility check first** – If you need equal-sum partitions, check if total sum is divisible by k before doing any work.

2. **Greedy accumulation works for contiguous segments** – Because segments must be contiguous, you can scan once and reset sum whenever you hit the target.

3. **Edge case: zero target** – When target sum is 0, you can have more segments than k. Always use `count >= k` not `count == k`.

---

Related problems: [Find the Middle Index in Array](/problem/find-the-middle-index-in-array)
