---
title: "How to Solve Eat Pizzas! — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Eat Pizzas!. Medium difficulty, 33.1% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2029-08-17"
category: "dsa-patterns"
tags: ["eat-pizzas", "array", "greedy", "sorting", "medium"]
---

# How to Solve Eat Pizzas!

You’re given an array of pizza weights and must eat exactly four pizzas each day. When you eat four pizzas in sorted order (W ≤ X ≤ Y ≤ Z), you only gain the weight of the second-heaviest pizza (Y). Your goal is to minimize the total weight gained after eating all pizzas. The challenge is that you must group pizzas into sets of four, and the cost of each group depends on its third-largest element. This problem is interesting because a greedy approach works, but you need to figure out the right pairing strategy.

## Visual Walkthrough

Let’s walk through an example: `pizzas = [2, 7, 11, 15, 3, 8, 10, 14]`

First, we sort the array: `[2, 3, 7, 8, 10, 11, 14, 15]`.  
We need to form groups of four. The key insight: to minimize the sum of the third-largest elements, we should pair the smallest possible third-largest values together.

One naive grouping might be consecutive groups:  
Group 1: [2, 3, 7, 8] → third-largest = 7  
Group 2: [10, 11, 14, 15] → third-largest = 14  
Total = 7 + 14 = 21

But we can do better. Let’s try picking the third-largest from the end, then skip the smallest unused pizza:  
Start from the largest pizza (index 7 = 15). The third-largest in its group will be two steps left: index 5 = 11.  
We’ve used indices 7, 6, 5. Now skip the smallest unused (index 0 = 2) to avoid wasting a large pizza as the smallest in a group.  
Next, move to index 4 = 10. Third-largest is two steps left: index 2 = 7.  
Used indices 4, 3, 2. Skip the next smallest (index 1 = 3).  
We’ve formed:  
Group 1: [2, 11, 14, 15] → third-largest = 14? Wait, that’s wrong—we need to think differently.

Actually, the optimal strategy is simpler: after sorting, always pick the third-largest from the end, then move four steps backward. Let’s trace correctly:

Sorted: [2, 3, 7, 8, 10, 11, 14, 15]  
We want the third-largest of each group. If we start from the end:

- Last group uses pizzas at indices 7, 6, 5, 4 → sorted: [10, 11, 14, 15] → third-largest = 14
- Previous group uses indices 3, 2, 1, 0 → sorted: [2, 3, 7, 8] → third-largest = 7  
  Total = 14 + 7 = 21 (same as before).

But that’s not optimal! Let’s try another grouping:  
Group 1: [2, 3, 14, 15] → third-largest = 14  
Group 2: [7, 8, 10, 11] → third-largest = 10  
Total = 24 (worse).

The correct insight: to minimize the sum of third-largest values, we should make each third-largest as small as possible. That means we should take the third-largest from near the beginning, not the end. Wait—let’s think.

Actually, the optimal approach is to sort, then always take the third-largest from the **end** of the remaining array. Why? Because if we take a large pizza as the third-largest, we’re forced to have two even larger pizzas in that group (since W ≤ X ≤ Y ≤ Z). That’s expensive. Better to put large pizzas as the largest (Z) or second-largest (Y), since they don’t count toward weight gain. The third-largest (Y) is the one we pay for.

So, we should pair the largest pizzas as the largest and second-largest in groups, and use smaller pizzas as the third-largest. This suggests we should pick third-largest values from the smaller end. But we have to maintain groups of four.

The known optimal strategy: after sorting, take every third pizza from the end, stepping back by 4 each time. Let’s verify:

Sorted: [2, 3, 7, 8, 10, 11, 14, 15]  
Indices from end:  
Start at index 5 (value 11) → that’s two from the end? Let’s index from 0:  
Indices: 0:2, 1:3, 2:7, 3:8, 4:10, 5:11, 6:14, 7:15  
If we take index 5 (11), then we need three larger pizzas? No—we need two larger and one smaller. Actually, for a group where Y is the third-largest, we need one smaller pizza (W) and two larger (X and Z with X≤Z). So if Y is at index 5, we can take index 4 as W? That doesn’t work because W ≤ X ≤ Y ≤ Z.

The correct algorithm: sort descending, then sum every 4th element starting from the 3rd element (0-indexed). Let’s test:

Sorted descending: [15, 14, 11, 10, 8, 7, 3, 2]  
Take index 2 (11), index 6 (3) → sum = 14? That’s not right.

Let’s implement the known working approach: sort ascending, then take elements at indices n-3, n-7, n-11, ... until we’ve covered all groups.

For n=8:  
Indices: n-3 = 5 (value 11), n-7 = 1 (value 3) → sum = 14. Wait, that’s 11+3=14, but earlier we had 21. Something’s off.

I realize now: the problem says you gain the weight of only 1 pizza—the second-heaviest in the sorted group. That’s Y, the third-largest? Let’s clarify:  
Sorted group: W ≤ X ≤ Y ≤ Z.  
Heaviest = Z, second-heaviest = Y. Yes, Y is the third-largest (since W is smallest). So we pay Y.

Thus, to minimize sum of Y’s, we want Y’s to be as small as possible. That means we should put the largest pizzas as Z (heaviest) and X (second-smallest?), and smaller ones as Y. Actually, the optimal greedy strategy is: sort, then take every 4th element starting from index 2 (0-based). Let’s test:

Sorted ascending: [2, 3, 7, 8, 10, 11, 14, 15]  
Index 2: 7, index 6: 14 → sum = 21. That matches our first grouping.

But is that minimal? Let’s try to prove: In each group of four, the cost is the third-smallest. To minimize total cost, we want each third-smallest to be as small as possible. By sorting and taking consecutive groups, we ensure that the third-smallest in each group is the smallest it can be, because any other grouping would put a larger pizza into a third-smallest slot.

Thus, the algorithm: sort, then sum elements at indices 2, 6, 10, ... i.e., i = 2 + 4k.

## Brute Force Approach

A brute force solution would try all possible ways to partition the sorted array into groups of four, calculate the sum of third-largest elements (Y values), and take the minimum. The number of partitions is enormous—it’s the number of ways to divide n elements into n/4 groups of four, which is factorial in complexity. Even for small n, this is infeasible. Coding this would involve recursive backtracking or generating all combinations, which is O((n!)/(4!^(n/4))), completely impractical for n up to 10^5.

We can skip coding this brute force because it’s clearly too slow. The key takeaway: we need a smarter way to assign pizzas to groups.

## Optimized Approach

The optimal insight is that sorting the array and then taking consecutive groups of four minimizes the sum of third-largest elements. Why? After sorting, the array is in ascending order. In any group of four consecutive elements [a, b, c, d], the third-largest is c. If we try to swap elements between groups, we’ll only increase some c values. For example, if we take a larger element from a later group to put as the third-largest in an earlier group, that earlier group’s c increases, and the later group’s c might decrease, but the net effect is non-negative increase because the array is sorted.

Formally, by the rearrangement inequality, to minimize the sum of selected elements (each group’s third-largest), we should pair the smallest possible values with the role of “third-largest.” After sorting, the optimal assignment is to take the third element of each consecutive block of four: indices 2, 6, 10, ... in 0-based indexing.

Thus, the algorithm:

1. Sort the array in ascending order.
2. Initialize sum = 0.
3. Start from index 2 (third element) and add `pizzas[i]` to sum, then jump i += 4 until we exceed array length.
4. Return sum.

This is greedy and runs in O(n log n) due to sorting.

## Optimal Solution

Here’s the complete implementation in Python, JavaScript, and Java with detailed comments.

<div class="code-group">

```python
# Time: O(n log n) due to sorting
# Space: O(1) extra space (or O(n) if sorting uses extra space, depending on language)
def minWeightGained(pizzas):
    # Step 1: Sort the pizzas in ascending order.
    # This ensures we can pick consecutive groups optimally.
    pizzas.sort()

    total_weight = 0
    n = len(pizzas)

    # Step 2: Iterate starting from index 2 (the third element, 0-based).
    # In each group of four sorted pizzas, the third element (index 2) is the
    # second-heaviest (Y), which is the weight we gain for that group.
    # We jump by 4 because each group has 4 pizzas.
    for i in range(2, n, 4):
        total_weight += pizzas[i]

    return total_weight
```

```javascript
// Time: O(n log n) due to sorting
// Space: O(1) extra space (or O(n) if sorting uses extra space)
function minWeightGained(pizzas) {
  // Step 1: Sort ascending so we can pick consecutive groups.
  pizzas.sort((a, b) => a - b);

  let totalWeight = 0;
  const n = pizzas.length;

  // Step 2: Start from index 2 (third pizza) and add every 4th element.
  // This corresponds to the third-largest (Y) in each group of four.
  for (let i = 2; i < n; i += 4) {
    totalWeight += pizzas[i];
  }

  return totalWeight;
}
```

```java
// Time: O(n log n) due to sorting
// Space: O(1) extra space (or O(n) if sorting uses extra space)
import java.util.Arrays;

public class Solution {
    public int minWeightGained(int[] pizzas) {
        // Step 1: Sort ascending for optimal grouping.
        Arrays.sort(pizzas);

        int totalWeight = 0;
        int n = pizzas.length;

        // Step 2: Pick every 4th element starting from index 2.
        // These are the Y values (second-heaviest) in each group.
        for (int i = 2; i < n; i += 4) {
            totalWeight += pizzas[i];
        }

        return totalWeight;
    }
}
```

</div>

## Complexity Analysis

- **Time Complexity:** O(n log n). The dominant step is sorting the array of size n. The subsequent loop runs O(n/4) = O(n) times, which is dominated by O(n log n).
- **Space Complexity:** O(1) extra space if we consider sorting as in-place (e.g., Python’s Timsort uses O(n) space in worst case, but often O(1) for small arrays; Java’s Arrays.sort uses O(log n) stack space for quicksort variant; JavaScript’s sort typically O(log n) space). The input modification is allowed unless specified otherwise. If we cannot modify input, we’d need O(n) space to make a sorted copy.

## Common Mistakes

1. **Not sorting the array:** Some candidates try to pick pizzas arbitrarily without sorting. This fails because the greedy choice depends on the sorted order to minimize the third-largest values.
2. **Incorrect index selection:** Picking index 3 (fourth element) instead of index 2 (third element) gives the heaviest pizza weight, which is wrong. Always verify with a small example: for [1,2,3,4], the weight gained should be 3 (third-largest), not 4.
3. **Handling n not divisible by 4:** The problem guarantees n is a multiple of 4, but candidates might add unnecessary checks. If it weren’t guaranteed, we’d need to handle remaining pizzas, but here we can assume valid input.
4. **Using descending sort and wrong indices:** If you sort descending, the indices change. For descending [4,3,2,1], the third-largest is 2, which is at index 2. But in ascending [1,2,3,4], it’s at index 2. Stick with ascending to avoid confusion.

## When You’ll See This Pattern

This problem uses a **greedy sorting** pattern, where sorting enables an optimal greedy selection. Similar problems:

1. **Array Partition I (LeetCode 561):** Given 2n integers, partition into n pairs to maximize sum of min(a,b). Solution: sort and sum every other element starting from index 0. The pattern is similar: sort and pick at regular intervals.
2. **Assign Cookies (LeetCode 455):** Assign cookies to children to maximize content. Sort both arrays and use two pointers greedily.
3. **Minimum Cost of Buying Candies With Discount (LeetCode 2144):** Buy candies in groups of three, pay for the two most expensive. Sort descending and pick every third element. Exactly analogous to this pizza problem but with groups of three.

In each case, sorting allows a greedy pick that optimizes the sum of selected elements (min, max, or k-th largest).

## Key Takeaways

- **Sorting enables greedy selection:** When you need to partition into groups and optimize a sum based on rank within each group (like k-th largest), sorting often reveals the optimal greedy strategy.
- **Test with small examples:** Always verify your index math with a concrete example (e.g., [1,2,3,4] should yield 3). This catches off-by-one errors.
- **Pattern recognition:** If the problem involves grouping sorted elements and summing every k-th element, it’s likely a greedy sorting problem.

[Practice this problem on CodeJeet](/problem/eat-pizzas)
