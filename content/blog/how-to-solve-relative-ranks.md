---
title: "How to Solve Relative Ranks — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Relative Ranks. Easy difficulty, 74.4% acceptance rate. Topics: Array, Sorting, Heap (Priority Queue)."
date: "2027-07-25"
category: "dsa-patterns"
tags: ["relative-ranks", "array", "sorting", "heap-(priority-queue)", "easy"]
---

# How to Solve Relative Ranks

You're given an array of unique athlete scores and need to assign medal ranks ("Gold Medal", "Silver Medal", "Bronze Medal") to the top three athletes, and numeric ranks to everyone else. The challenge is efficiently mapping each athlete's original position to their final rank while handling the special medal cases.

What makes this interesting: You need to sort scores to determine rankings, but then must return results in the original athlete order. This requires careful tracking of each athlete's original index while sorting.

## Visual Walkthrough

Let's trace through `score = [10, 3, 8, 9, 4]`:

**Step 1: Understand the ranking logic**

- Highest score gets "Gold Medal" (1st place)
- Second highest gets "Silver Medal" (2nd place)
- Third highest gets "Bronze Medal" (3rd place)
- All others get their numeric rank: 4th, 5th, etc.

**Step 2: Sort scores to determine rankings**
Original scores with indices: `[(10,0), (3,1), (8,2), (9,3), (4,4)]`
Sorted descending: `[(10,0), (9,3), (8,2), (4,4), (3,1)]`

**Step 3: Assign ranks based on sorted position**

- Index 0: 1st place → "Gold Medal"
- Index 3: 2nd place → "Silver Medal"
- Index 2: 3rd place → "Bronze Medal"
- Index 4: 4th place → "4"
- Index 1: 5th place → "5"

**Step 4: Map back to original order**
Original order: indices 0, 1, 2, 3, 4

- Index 0: "Gold Medal"
- Index 1: "5"
- Index 2: "Bronze Medal"
- Index 3: "Silver Medal"
- Index 4: "4"

Final result: `["Gold Medal", "5", "Bronze Medal", "Silver Medal", "4"]`

## Brute Force Approach

A naive approach would be to repeatedly find the maximum score, assign it a rank, then find the next maximum, and so on. For each of n athletes, you'd scan the entire array to find the current maximum, resulting in O(n²) time complexity.

While this would work for small inputs, it's inefficient for larger arrays. The key insight is that we need to sort the scores to determine rankings efficiently, but we must preserve the original indices to return results in the correct order.

## Optimal Solution

The optimal approach uses sorting with index tracking. We create pairs of (score, original_index), sort them in descending order by score, then assign ranks based on sorted position while mapping back to original indices.

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(n) for storing pairs and result
def findRelativeRanks(score):
    """
    Assigns relative ranks to athletes based on their scores.

    Args:
        score: List of unique integer scores

    Returns:
        List of strings representing ranks in original order
    """
    n = len(score)

    # Step 1: Create pairs of (score, original_index)
    # This allows us to track where each score originally came from
    athletes = [(score[i], i) for i in range(n)]

    # Step 2: Sort in descending order by score
    # The lambda function sorts by first element (score) in reverse order
    athletes.sort(key=lambda x: x[0], reverse=True)

    # Step 3: Initialize result array with placeholders
    # We'll fill this in the original order of athletes
    result = [""] * n

    # Step 4: Assign ranks based on sorted position
    for rank, (_, original_idx) in enumerate(athletes):
        # rank is 0-based index in sorted list
        if rank == 0:
            result[original_idx] = "Gold Medal"
        elif rank == 1:
            result[original_idx] = "Silver Medal"
        elif rank == 2:
            result[original_idx] = "Bronze Medal"
        else:
            # For 4th place and beyond, use 1-based numeric rank
            result[original_idx] = str(rank + 1)

    return result
```

```javascript
// Time: O(n log n) for sorting | Space: O(n) for storing pairs and result
function findRelativeRanks(score) {
  /**
   * Assigns relative ranks to athletes based on their scores.
   *
   * @param {number[]} score - Array of unique integer scores
   * @return {string[]} - Array of strings representing ranks in original order
   */
  const n = score.length;

  // Step 1: Create array of objects with score and original index
  // This preserves the original position of each score
  const athletes = score.map((scoreValue, index) => ({
    score: scoreValue,
    index: index,
  }));

  // Step 2: Sort in descending order by score
  // b.score - a.score gives negative when b > a, placing higher scores first
  athletes.sort((a, b) => b.score - a.score);

  // Step 3: Initialize result array
  const result = new Array(n);

  // Step 4: Assign ranks based on sorted position
  athletes.forEach((athlete, rank) => {
    // rank is 0-based index in sorted array
    switch (rank) {
      case 0:
        result[athlete.index] = "Gold Medal";
        break;
      case 1:
        result[athlete.index] = "Silver Medal";
        break;
      case 2:
        result[athlete.index] = "Bronze Medal";
        break;
      default:
        // For 4th place and beyond, convert to 1-based rank
        result[athlete.index] = (rank + 1).toString();
    }
  });

  return result;
}
```

```java
// Time: O(n log n) for sorting | Space: O(n) for storing pairs and result
import java.util.*;

class Solution {
    public String[] findRelativeRanks(int[] score) {
        /**
         * Assigns relative ranks to athletes based on their scores.
         *
         * @param score - Array of unique integer scores
         * @return - Array of strings representing ranks in original order
         */
        int n = score.length;

        // Step 1: Create 2D array to store (score, index) pairs
        // We'll use this to track original positions after sorting
        int[][] athletes = new int[n][2];
        for (int i = 0; i < n; i++) {
            athletes[i][0] = score[i];  // Store the score
            athletes[i][1] = i;         // Store the original index
        }

        // Step 2: Sort in descending order by score (first element of pair)
        // Comparator sorts by first element in descending order
        Arrays.sort(athletes, (a, b) -> b[0] - a[0]);

        // Step 3: Initialize result array
        String[] result = new String[n];

        // Step 4: Assign ranks based on sorted position
        for (int rank = 0; rank < n; rank++) {
            int originalIndex = athletes[rank][1];  // Get original position

            // Convert 0-based rank to appropriate medal or numeric rank
            if (rank == 0) {
                result[originalIndex] = "Gold Medal";
            } else if (rank == 1) {
                result[originalIndex] = "Silver Medal";
            } else if (rank == 2) {
                result[originalIndex] = "Bronze Medal";
            } else {
                // For 4th place and beyond, use 1-based numeric rank
                result[originalIndex] = Integer.toString(rank + 1);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Creating the athlete pairs takes O(n)
- Sorting the pairs dominates at O(n log n)
- Assigning ranks takes O(n)
- Overall: O(n log n) due to sorting

**Space Complexity: O(n)**

- We store n pairs of (score, index): O(n)
- We store the result array: O(n)
- Total: O(n) additional space (excluding input and output)

The sorting step is the bottleneck. Since we need to compare all scores to determine rankings, O(n log n) is optimal for comparison-based sorting.

## Common Mistakes

1. **Forgetting to track original indices**: Sorting destroys the original order. If you just sort scores and try to map back without tracking indices, you'll lose the connection between scores and their original positions.

2. **Off-by-one errors with ranks**: The sorted list gives 0-based positions, but ranks are 1-based (except for medals). A common mistake is using `rank` instead of `rank + 1` for numeric ranks, or vice versa.

3. **Not handling the medal cases separately**: Some candidates try to use a single formula for all ranks, forgetting that "Gold Medal" isn't "1". The top three need special handling.

4. **Assuming scores are already sorted**: The problem doesn't guarantee sorted input. Always check your solution works with unsorted arrays like `[10, 3, 8, 9, 4]`.

## When You'll See This Pattern

This "sort with index tracking" pattern appears whenever you need to:

1. Sort elements to determine some ordering
2. But return results in the original input order

Related LeetCode problems:

1. **Sort Colors (75)**: While different in implementation, it also involves rearranging elements based on comparisons while tracking positions.
2. **Top K Frequent Elements (347)**: You sort by frequency but might need to return elements in some specific order.
3. **K Closest Points to Origin (973)**: You sort points by distance but the problem might ask for results in original order.

The core technique of pairing elements with their indices, sorting, then mapping back is valuable for many array manipulation problems.

## Key Takeaways

1. **When sorting destroys needed information (like original positions), pair elements with that information before sorting.** This "index tracking" technique is essential for problems that require processing in one order but outputting in another.

2. **Pay attention to 0-based vs 1-based conversions.** Interview problems often mix these, especially with rankings, positions, or indices. Always verify your conversions with edge cases.

3. **Special cases (like medal assignments) should be handled explicitly** rather than trying to fit them into a general formula. Clear, readable code with explicit conditions is better than clever but confusing one-liners.

[Practice this problem on CodeJeet](/problem/relative-ranks)
