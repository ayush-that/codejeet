---
title: "How to Solve Count Number of Teams — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Number of Teams. Medium difficulty, 70.2% acceptance rate. Topics: Array, Dynamic Programming, Binary Indexed Tree, Segment Tree."
date: "2028-05-27"
category: "dsa-patterns"
tags: ["count-number-of-teams", "array", "dynamic-programming", "binary-indexed-tree", "medium"]
---

# How to Solve Count Number of Teams

You need to count how many valid teams of 3 soldiers can be formed where their ratings are either strictly increasing or strictly decreasing. The challenge is that you can't just sort the array—the soldiers must maintain their original order in the line, so you're looking for increasing/decreasing _subsequences_ of length 3. The brute force approach is straightforward but too slow for the constraints, requiring a more clever counting strategy.

## Visual Walkthrough

Let's trace through a small example: `ratings = [2, 5, 3, 4, 1]`

We need to count all triplets `(i, j, k)` where `i < j < k` and either:

1. `rating[i] < rating[j] < rating[k]` (increasing team)
2. `rating[i] > rating[j] > rating[k]` (decreasing team)

**Increasing teams:**

- For soldier at index 1 (rating 5): No increasing teams because nothing after it is larger
- For soldier at index 2 (rating 3):
  - Before it: [2] is smaller
  - After it: [4] is larger
  - Teams: (0, 2, 3) → [2, 3, 4]
- For soldier at index 3 (rating 4):
  - Before it: [2, 3] are smaller
  - After it: Nothing larger
  - No complete teams

Total increasing teams: 1

**Decreasing teams:**

- For soldier at index 1 (rating 5):
  - Before it: Nothing larger
  - After it: [3, 4, 1] are smaller
  - No complete teams
- For soldier at index 2 (rating 3):
  - Before it: [5] is larger
  - After it: [1] is smaller
  - Teams: (1, 2, 4) → [5, 3, 1]
- For soldier at index 3 (rating 4):
  - Before it: [5] is larger
  - After it: [1] is smaller
  - Teams: (1, 3, 4) → [5, 4, 1]

Total decreasing teams: 2

**Total teams:** 1 + 2 = 3

The key insight: For each soldier as the middle person `j`, count how many soldiers before `j` are smaller/larger and how many after `j` are larger/smaller, then multiply.

## Brute Force Approach

The most straightforward solution is to check all possible triplets:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def numTeams_brute(rating):
    n = len(rating)
    count = 0

    # Check all possible triplets (i, j, k) where i < j < k
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                # Check if ratings are strictly increasing
                if rating[i] < rating[j] < rating[k]:
                    count += 1
                # Check if ratings are strictly decreasing
                elif rating[i] > rating[j] > rating[k]:
                    count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function numTeamsBrute(rating) {
  const n = rating.length;
  let count = 0;

  // Check all possible triplets (i, j, k) where i < j < k
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        // Check if ratings are strictly increasing
        if (rating[i] < rating[j] && rating[j] < rating[k]) {
          count++;
        }
        // Check if ratings are strictly decreasing
        else if (rating[i] > rating[j] && rating[j] > rating[k]) {
          count++;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int numTeamsBrute(int[] rating) {
    int n = rating.length;
    int count = 0;

    // Check all possible triplets (i, j, k) where i < j < k
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                // Check if ratings are strictly increasing
                if (rating[i] < rating[j] && rating[j] < rating[k]) {
                    count++;
                }
                // Check if ratings are strictly decreasing
                else if (rating[i] > rating[j] && rating[j] > rating[k]) {
                    count++;
                }
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** With `n` up to 1000, O(n³) is 1 billion operations—far too slow. We need to reduce this to at least O(n²).

## Optimized Approach

The key insight is to treat each soldier as the **middle** of the team. For a soldier at index `j`:

- For increasing teams: We need `left_smaller * right_larger`
  - `left_smaller`: How many soldiers before `j` have smaller ratings
  - `right_larger`: How many soldiers after `j` have larger ratings
- For decreasing teams: We need `left_larger * right_smaller`
  - `left_larger`: How many soldiers before `j` have larger ratings
  - `right_smaller`: How many soldiers after `j` have smaller ratings

For each soldier `j`, we can count these in O(n) time by scanning left and right, giving us O(n²) total.

**Why this works mathematically:**

- When we fix the middle soldier `j`, any valid increasing team must have one smaller soldier from the left and one larger soldier from the right
- The number of ways to choose such a team is exactly `left_smaller * right_larger`
- Similarly for decreasing teams: `left_larger * right_smaller`

## Optimal Solution

Here's the O(n²) solution that counts for each middle soldier:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numTeams(rating):
    n = len(rating)
    total_teams = 0

    # For each soldier as the middle of the team
    for j in range(1, n - 1):
        left_smaller = left_larger = 0
        right_smaller = right_larger = 0

        # Count soldiers to the left of j
        for i in range(j):
            if rating[i] < rating[j]:
                left_smaller += 1
            elif rating[i] > rating[j]:
                left_larger += 1

        # Count soldiers to the right of j
        for k in range(j + 1, n):
            if rating[k] < rating[j]:
                right_smaller += 1
            elif rating[k] > rating[j]:
                right_larger += 1

        # Add increasing and decreasing teams with j as middle
        total_teams += left_smaller * right_larger  # increasing teams
        total_teams += left_larger * right_smaller  # decreasing teams

    return total_teams
```

```javascript
// Time: O(n²) | Space: O(1)
function numTeams(rating) {
  const n = rating.length;
  let totalTeams = 0;

  // For each soldier as the middle of the team
  for (let j = 1; j < n - 1; j++) {
    let leftSmaller = 0,
      leftLarger = 0;
    let rightSmaller = 0,
      rightLarger = 0;

    // Count soldiers to the left of j
    for (let i = 0; i < j; i++) {
      if (rating[i] < rating[j]) {
        leftSmaller++;
      } else if (rating[i] > rating[j]) {
        leftLarger++;
      }
    }

    // Count soldiers to the right of j
    for (let k = j + 1; k < n; k++) {
      if (rating[k] < rating[j]) {
        rightSmaller++;
      } else if (rating[k] > rating[j]) {
        rightLarger++;
      }
    }

    // Add increasing and decreasing teams with j as middle
    totalTeams += leftSmaller * rightLarger; // increasing teams
    totalTeams += leftLarger * rightSmaller; // decreasing teams
  }

  return totalTeams;
}
```

```java
// Time: O(n²) | Space: O(1)
public int numTeams(int[] rating) {
    int n = rating.length;
    int totalTeams = 0;

    // For each soldier as the middle of the team
    for (int j = 1; j < n - 1; j++) {
        int leftSmaller = 0, leftLarger = 0;
        int rightSmaller = 0, rightLarger = 0;

        // Count soldiers to the left of j
        for (int i = 0; i < j; i++) {
            if (rating[i] < rating[j]) {
                leftSmaller++;
            } else if (rating[i] > rating[j]) {
                leftLarger++;
            }
        }

        // Count soldiers to the right of j
        for (int k = j + 1; k < n; k++) {
            if (rating[k] < rating[j]) {
                rightSmaller++;
            } else if (rating[k] > rating[j]) {
                rightLarger++;
            }
        }

        // Add increasing and decreasing teams with j as middle
        totalTeams += leftSmaller * rightLarger;  // increasing teams
        totalTeams += leftLarger * rightSmaller;  // decreasing teams
    }

    return totalTeams;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- Outer loop runs O(n) times (for each possible middle soldier)
- Inner loops each run O(n) times in worst case (scanning left and right)
- Total: O(n) × O(n) = O(n²)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for counters
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting that soldiers must maintain order:** Candidates sometimes try to sort the array first, but the problem requires the original order. Remember: `i < j < k` refers to indices, not sorted positions.

2. **Off-by-one errors in loops:** When iterating for the middle soldier `j`, it should start at 1 (needs at least one soldier before) and end at `n-2` (needs at least one soldier after). Using `range(n)` instead of `range(1, n-1)` will cause index errors or incorrect counts.

3. **Not handling equal ratings:** The problem says ratings are unique, but some candidates add unnecessary `<=` or `>=` comparisons. Always use strict inequalities (`<` and `>`).

4. **Double-counting teams:** When counting left/right, make sure to use `else if` for the larger case, not just `if`. Otherwise, you might incorrectly count a soldier as both smaller and larger (though with unique ratings this is impossible, it's still good practice).

## When You'll See This Pattern

This "fix the middle element and count left/right" pattern appears in several counting problems:

1. **Count Increasing Triplets (LeetCode 334)** - Similar concept but with different constraints and optimizations
2. **132 Pattern (LeetCode 456)** - Finding a specific triplet pattern where you fix the middle element
3. **Number of Subarrays with Bounded Maximum (LeetCode 795)** - Uses similar "count contributions from each element" thinking
4. **Sum of Subarray Minimums (LeetCode 907)** - Each element contributes to multiple subarrays based on its position

The core idea is to think about how much each element contributes to the total count, rather than enumerating all combinations.

## Key Takeaways

1. **Think in terms of contributions:** Instead of checking all triplets, ask "how many valid teams have this soldier as the middle?" This reduces O(n³) to O(n²).

2. **Break symmetric problems:** When you need both increasing and decreasing sequences, handle them separately but with the same counting logic—just swap the comparison operators.

3. **The middle element trick:** For triplet problems where order matters, fixing the middle element often simplifies counting because you can independently count valid left and right choices.

[Practice this problem on CodeJeet](/problem/count-number-of-teams)
