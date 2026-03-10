---
title: "How to Solve Minimum Number of Operations to Make Arrays Similar — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Make Arrays Similar. Hard difficulty, 61.5% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2030-01-12"
category: "dsa-patterns"
tags: ["minimum-number-of-operations-to-make-arrays-similar", "array", "greedy", "sorting", "hard"]
---

# How to Solve Minimum Number of Operations to Make Arrays Similar

This problem asks us to transform one array into another using operations where we can add 2 to one element and subtract 2 from another element simultaneously. The challenge is that we can only change elements in pairs, and the parity (odd/even nature) of numbers is preserved since we're adding/subtracting 2. This makes the problem fundamentally about matching odd numbers with odd numbers and even numbers with even numbers.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** nums = [1, 2, 5], target = [4, 1, 3]

**Step 1: Separate by parity**

- nums: odds = [1, 5], evens = [2]
- target: odds = [1, 3], evens = [4]

**Step 2: Sort each group**

- nums odds: [1, 5], nums evens: [2]
- target odds: [1, 3], target evens: [4]

**Step 3: Calculate differences within each parity group**

- For odds: compare [1, 5] with [1, 3]
  - First element: 1 vs 1 → difference = 0
  - Second element: 5 vs 3 → difference = 2 (nums is larger)
- For evens: compare [2] with [4]
  - First element: 2 vs 4 → difference = -2 (nums is smaller)

**Step 4: Count operations**
We only care about positive differences (where nums > target) because for every element that needs to decrease, there must be a corresponding element that needs to increase by the same amount. The operation pairs one decrease with one increase.

Positive differences: only from odds group = [2]
Total positive difference sum = 2

Each operation handles a difference of 2 (since we change elements by ±2), so:
Operations needed = 2 ÷ 2 = 1

**Verification:** We can transform [1, 2, 5] to [4, 1, 3] in 1 operation:

- Choose i=2 (nums[2]=5) and j=0 (nums[0]=1)
- nums[2] becomes 5-2=3 ✓
- nums[0] becomes 1+2=3 (not 4 yet, but we need another operation)
  Actually, we need 2 operations total. Let me recalculate...

The key insight: We need to sum ALL positive differences, not just look at individual pairs.

Positive differences: from odds: 5-3=2
Negative differences: from evens: 2-4=-2 (absolute value 2)

The total positive sum = 2, and each operation handles 2 units of change (1 decrease of 2 and 1 increase of 2), so operations = 2 ÷ 2 = 1.

Wait, that still gives 1. Let me actually work through the operations:

Operation 1: Choose 5 (decrease by 2) and 2 (increase by 2)
Array becomes: [1, 4, 3]

Operation 2: Choose 1 (increase by 2) and 4 (decrease by 2)  
Array becomes: [3, 2, 3] — still not [4, 1, 3]

I see the issue! We need to sort both arrays first, then separate by parity.

**Correct approach:**

1. Sort both arrays: nums = [1, 2, 5], target = [1, 3, 4]
2. Separate by parity after sorting:
   - nums odds: [1, 5], evens: [2]
   - target odds: [1, 3], evens: [4]
3. Calculate differences:
   - Odds: [1-1=0, 5-3=2] → positive sum = 2
   - Evens: [2-4=-2] → absolute value = 2 (but this is negative)
4. Total positive sum = 2, operations = 2 ÷ 2 = 1

But we just saw we need 2 operations. Let me trace the actual transformation:

Sorted nums: [1, 2, 5], sorted target: [1, 3, 4]

We need to transform:

- 1 → 1 (no change)
- 2 → 3 (need +1, but can only change by ±2)
- 5 → 4 (need -1, but can only change by ±2)

This reveals the real issue: We can only change by multiples of 2! So 2→3 is impossible with ±2 operations. Therefore, the arrays must have the same distribution of odd and even numbers.

Let me check parity:

- nums: [odd, even, odd]
- target: [odd, odd, even]

Different parity distribution! So it's actually impossible. The problem guarantees it's possible, so my example was bad.

**Better example:** nums = [1, 2, 5], target = [1, 4, 3]

1. Sort both: nums = [1, 2, 5], target = [1, 3, 4]
2. Separate by parity:
   - nums odds: [1, 5], evens: [2]
   - target odds: [1, 3], evens: [4]
3. Differences:
   - Odds: [0, 2] → positive sum = 2
   - Evens: [-2] → absolute value = 2
4. Operations = 2 ÷ 2 = 1

Now let's verify: [1, 2, 5] → [1, 4, 3]
Operation: decrease 5 by 2, increase 2 by 2 → [1, 4, 3] ✓

## Brute Force Approach

A brute force approach would try all possible sequences of operations. For each operation, we choose two indices i and j (i ≠ j), add 2 to nums[i] and subtract 2 from nums[j]. We'd need to explore all possible sequences until we match the target array.

Why this fails:

1. **Exponential complexity:** With n elements, there are O(n²) possible index pairs for each operation. The number of operations needed could be large, leading to an exponential search space.
2. **No clear termination:** We don't know when to stop trying different sequences.
3. **Parity constraint ignored:** The brute force might waste time trying impossible transformations.

The brute force is completely impractical for arrays of any reasonable size (n up to 10⁵ in this problem).

## Optimized Approach

The key insights for the optimal solution:

1. **Parity preservation:** Adding or subtracting 2 doesn't change whether a number is odd or even. Therefore, odd numbers in `nums` can only become odd numbers in `target`, and even numbers can only become even numbers.

2. **Sorting and pairing:** After separating by parity, we should sort both odd groups and both even groups. The optimal pairing is to match the smallest odd in `nums` with the smallest odd in `target`, and so on. This minimizes the total operations.

3. **Operation counting:** Each operation decreases one number by 2 and increases another by 2. So for every unit of "decrease needed," we need a corresponding unit of "increase needed." We only need to sum the positive differences (where nums[i] > target[i]) and divide by 2.

4. **Why divide by 2?** Each operation handles 2 units of net change: -2 for one element, +2 for another. So if the total positive difference is D, we need D/2 operations.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def makeSimilar(nums, target):
    """
    Transform nums to target using operations where we can add 2 to one element
    and subtract 2 from another element simultaneously.

    Key insight: Parity (odd/even) is preserved, so we must match odds with odds
    and evens with evens. Sort each group and sum the positive differences.
    """
    # Step 1: Separate nums and target into odd and even arrays
    nums_odd = [x for x in nums if x % 2 == 1]
    nums_even = [x for x in nums if x % 2 == 0]
    target_odd = [x for x in target if x % 2 == 1]
    target_even = [x for x in target if x % 2 == 0]

    # Step 2: Sort all four arrays
    # We need to match smallest with smallest for optimal operations
    nums_odd.sort()
    nums_even.sort()
    target_odd.sort()
    target_even.sort()

    # Step 3: Calculate total positive difference
    # We only need positive differences because for every decrease needed,
    # there's a corresponding increase needed (total sum must be preserved)
    total_ops = 0

    # Compare odd arrays element by element
    for i in range(len(nums_odd)):
        if nums_odd[i] > target_odd[i]:
            # nums has a larger odd number that needs to decrease
            total_ops += (nums_odd[i] - target_odd[i]) // 2

    # Compare even arrays element by element
    for i in range(len(nums_even)):
        if nums_even[i] > target_even[i]:
            # nums has a larger even number that needs to decrease
            total_ops += (nums_even[i] - target_even[i]) // 2

    return total_ops
```

```javascript
// Time: O(n log n) | Space: O(n)
function makeSimilar(nums, target) {
  /**
   * Transform nums to target using operations where we can add 2 to one element
   * and subtract 2 from another element simultaneously.
   *
   * Key insight: Parity (odd/even) is preserved, so we must match odds with odds
   * and evens with evens. Sort each group and sum the positive differences.
   */

  // Step 1: Separate nums and target into odd and even arrays
  const numsOdd = nums.filter((x) => x % 2 === 1);
  const numsEven = nums.filter((x) => x % 2 === 0);
  const targetOdd = target.filter((x) => x % 2 === 1);
  const targetEven = target.filter((x) => x % 2 === 0);

  // Step 2: Sort all four arrays
  // We need to match smallest with smallest for optimal operations
  numsOdd.sort((a, b) => a - b);
  numsEven.sort((a, b) => a - b);
  targetOdd.sort((a, b) => a - b);
  targetEven.sort((a, b) => a - b);

  // Step 3: Calculate total positive difference
  // We only need positive differences because for every decrease needed,
  // there's a corresponding increase needed (total sum must be preserved)
  let totalOps = 0;

  // Compare odd arrays element by element
  for (let i = 0; i < numsOdd.length; i++) {
    if (numsOdd[i] > targetOdd[i]) {
      // nums has a larger odd number that needs to decrease
      totalOps += (numsOdd[i] - targetOdd[i]) / 2;
    }
  }

  // Compare even arrays element by element
  for (let i = 0; i < numsEven.length; i++) {
    if (numsEven[i] > targetEven[i]) {
      // nums has a larger even number that needs to decrease
      totalOps += (numsEven[i] - targetEven[i]) / 2;
    }
  }

  return totalOps;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public long makeSimilar(int[] nums, int[] target) {
        /**
         * Transform nums to target using operations where we can add 2 to one element
         * and subtract 2 from another element simultaneously.
         *
         * Key insight: Parity (odd/even) is preserved, so we must match odds with odds
         * and evens with evens. Sort each group and sum the positive differences.
         */

        // Step 1: Separate nums and target into odd and even lists
        List<Integer> numsOdd = new ArrayList<>();
        List<Integer> numsEven = new ArrayList<>();
        List<Integer> targetOdd = new ArrayList<>();
        List<Integer> targetEven = new ArrayList<>();

        for (int num : nums) {
            if (num % 2 == 1) {
                numsOdd.add(num);
            } else {
                numsEven.add(num);
            }
        }

        for (int t : target) {
            if (t % 2 == 1) {
                targetOdd.add(t);
            } else {
                targetEven.add(t);
            }
        }

        // Step 2: Sort all four lists
        // We need to match smallest with smallest for optimal operations
        Collections.sort(numsOdd);
        Collections.sort(numsEven);
        Collections.sort(targetOdd);
        Collections.sort(targetEven);

        // Step 3: Calculate total positive difference
        // We only need positive differences because for every decrease needed,
        // there's a corresponding increase needed (total sum must be preserved)
        long totalOps = 0;

        // Compare odd lists element by element
        for (int i = 0; i < numsOdd.size(); i++) {
            if (numsOdd.get(i) > targetOdd.get(i)) {
                // nums has a larger odd number that needs to decrease
                totalOps += (numsOdd.get(i) - targetOdd.get(i)) / 2;
            }
        }

        // Compare even lists element by element
        for (int i = 0; i < numsEven.size(); i++) {
            if (numsEven.get(i) > targetEven.get(i)) {
                // nums has a larger even number that needs to decrease
                totalOps += (numsEven.get(i) - targetEven.get(i)) / 2;
            }
        }

        return totalOps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Separating into odd/even arrays: O(n)
- Sorting four arrays: O(n log n) in total (each sort is O(k log k) where k ≤ n)
- Calculating differences: O(n)
- Dominated by the sorting step: O(n log n)

**Space Complexity:** O(n)

- We create four new arrays/lists to store odd and even numbers separately
- In total, they contain all n elements from the input arrays
- Additional O(log n) space for sorting (in Python/Java, JavaScript typically uses O(n) for sort)

## Common Mistakes

1. **Not separating by parity:** The most common mistake is trying to match numbers without considering that odd numbers can only transform to odd numbers, and even to even. This leads to incorrect calculations.

2. **Forgetting to sort within parity groups:** After separating odds and evens, you must sort each group. Matching the i-th odd in nums with the i-th odd in target only works optimally if both are sorted.

3. **Dividing by 2 incorrectly:** Some candidates divide individual differences by 2 before summing, which works mathematically but is less intuitive. Others forget to divide by 2 at all, giving twice the correct answer.

4. **Using integer division carelessly:** In languages like Python, `//` is used for integer division. In the calculation `(nums_odd[i] - target_odd[i]) // 2`, the difference is always even (because both numbers have the same parity), so integer division is safe and correct.

## When You'll See This Pattern

This problem uses a **greedy matching with constraints** pattern combined with **parity considerations**:

1. **Minimum Operations to Make Array Equal II** (Medium): Similar concept of matching elements with constraints on operations, though without the parity restriction.

2. **Rearranging Fruits** (Hard): Also involves transforming one array to another with pair-wise operations, though with different operation constraints.

3. **Minimum Moves to Equal Array Elements II** (Medium): Finding minimum operations to make all elements equal, which also involves sorting and considering differences.

The core pattern is: when operations have constraints that preserve certain properties (like parity), separate elements by those properties, then use greedy matching (usually by sorting) to minimize operations.

## Key Takeaways

1. **Look for invariant properties:** When operations have specific constraints, identify what properties they preserve (like parity in this case). This often reveals how to break the problem into independent subproblems.

2. **Greedy matching with sorting is often optimal:** When you need to pair elements from two sets to minimize some cost, sorting both and matching in order is frequently the optimal approach.

3. **Operation counting trick:** When operations involve symmetric changes (+x and -x), you often only need to count one direction (positive differences) and divide by x to get the total operations.

Related problems: [Minimum Operations to Make Array Equal](/problem/minimum-operations-to-make-array-equal), [Minimum Operations to Make Array Equal II](/problem/minimum-operations-to-make-array-equal-ii), [Rearranging Fruits](/problem/rearranging-fruits)
