---
title: "How to Solve Minimum Number of Food Buckets to Feed the Hamsters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Food Buckets to Feed the Hamsters. Medium difficulty, 48.0% acceptance rate. Topics: String, Dynamic Programming, Greedy."
date: "2029-05-13"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-food-buckets-to-feed-the-hamsters",
    "string",
    "dynamic-programming",
    "greedy",
    "medium",
  ]
---

# How to Solve Minimum Number of Food Buckets to Feed the Hamsters

You're given a string representing hamsters (`'H'`) and empty spots (`'.'`), and you need to place food buckets at empty spots to feed all hamsters. Each hamster must have a bucket either at its own position or immediately adjacent to it, and each bucket can only feed one hamster. The challenge is finding the minimum number of buckets needed to feed all hamsters, or returning -1 if it's impossible. What makes this tricky is that placing a bucket affects multiple hamsters, so you need to coordinate placements efficiently.

## Visual Walkthrough

Let's trace through an example: `hamsters = ".H.H."`

**Step 1:** We'll scan left to right. The first hamster is at index 1. We check if we can place a bucket to its left (index 0). Yes, it's empty. Place a bucket at index 0. Buckets used: 1.

**Step 2:** Next hamster at index 3. Check left (index 2): it's empty. Place bucket at index 2. Buckets used: 2.

**Result:** All hamsters fed with 2 buckets. The string becomes `"BHBHB"` where B represents a bucket.

Now try a trickier example: `hamsters = "H.H"`

**Step 1:** First hamster at index 0. Can't place bucket to left (no position). Check right (index 1): empty. Place bucket at index 1.

**Step 2:** Next hamster at index 2. Check left (index 1): already has a bucket! That bucket can feed this hamster too. No new bucket needed.

**Result:** 1 bucket feeds both hamsters.

What about an impossible case? `hamsters = "HHH"`

**Step 1:** Hamster at index 0. Check right (index 1): has a hamster, not empty. Can't place bucket.

**Step 2:** Hamster at index 1. Check left (index 0): hamster. Check right (index 2): hamster. No empty adjacent spots.

**Step 3:** Hamster at index 2. Check left (index 1): hamster. No empty adjacent spots.

**Result:** Impossible → return -1.

This shows we need to be smart about bucket placement to minimize usage while ensuring all hamsters get fed.

## Brute Force Approach

A naive approach would try all possible bucket placements. For each empty spot, we could decide whether to place a bucket there or not. With `n` positions, there are 2^n possible configurations to check. For each configuration, we'd verify if all hamsters are fed and count the buckets used, keeping track of the minimum.

The verification step would check each hamster: for hamster at position `i`, check if there's a bucket at `i-1`, `i`, or `i+1`. This is O(n) per configuration, making the overall complexity O(n \* 2^n), which is completely impractical for strings of any reasonable length.

Even if we try to be slightly smarter by only considering placements near hamsters, the search space is still exponential. We need a more systematic approach.

## Optimized Approach

The key insight is that this is essentially a **covering problem** where we need to cover all hamsters with buckets placed at empty spots, with each bucket covering up to 3 positions (left, center, right). We can solve this greedily with a single left-to-right scan.

Here's the step-by-step reasoning:

1. **Always prefer to place buckets to the right of a hamster** when possible. Why? Because a bucket placed to the right can potentially feed the next hamster too if they're adjacent.

2. **Only place to the left when necessary** (when the right spot isn't available and the hamster isn't already fed).

3. **Check for impossible configurations early**: A hamster with hamsters on both sides can't be fed.

Let's formalize the greedy algorithm:

- Scan left to right
- When we encounter a hamster:
  - If it's already fed (by a bucket placed to its left in previous step), skip it
  - Otherwise, try to place a bucket to its right (if empty)
  - If right isn't available, try to place to its left (if empty)
  - If neither is available, return -1 (impossible)

This greedy approach works because by always trying right first, we maximize the chance that a bucket will feed multiple hamsters. If we placed left first, we might miss opportunities for sharing.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumBuckets(hamsters: str) -> int:
    """
    Returns minimum buckets needed to feed all hamsters.
    Returns -1 if impossible.
    """
    n = len(hamsters)
    buckets = 0
    # Convert string to list for easy modification
    # (we need to mark positions as having buckets)
    arr = list(hamsters)

    for i in range(n):
        # Only care about hamster positions
        if arr[i] != 'H':
            continue

        # Check if hamster is already fed by a bucket to its left
        if i > 0 and arr[i-1] == 'B':
            continue

        # Try to place bucket to the right first (optimal for sharing)
        if i + 1 < n and arr[i+1] == '.':
            # Place bucket at i+1
            arr[i+1] = 'B'
            buckets += 1
        # If right not available, try left
        elif i > 0 and arr[i-1] == '.':
            # Place bucket at i-1
            arr[i-1] = 'B'
            buckets += 1
        # If neither available, impossible to feed this hamster
        else:
            return -1

    return buckets
```

```javascript
// Time: O(n) | Space: O(n) - could be O(1) with careful indexing
function minimumBuckets(hamsters) {
  /**
   * Returns minimum buckets needed to feed all hamsters.
   * Returns -1 if impossible.
   */
  const n = hamsters.length;
  let buckets = 0;
  // Convert string to array for modification
  const arr = hamsters.split("");

  for (let i = 0; i < n; i++) {
    // Only process hamster positions
    if (arr[i] !== "H") continue;

    // Check if hamster already fed by bucket to its left
    if (i > 0 && arr[i - 1] === "B") continue;

    // Try to place bucket to the right first (optimal for sharing)
    if (i + 1 < n && arr[i + 1] === ".") {
      // Place bucket at i+1
      arr[i + 1] = "B";
      buckets++;
    }
    // If right not available, try left
    else if (i > 0 && arr[i - 1] === ".") {
      // Place bucket at i-1
      arr[i - 1] = "B";
      buckets++;
    }
    // If neither available, impossible to feed this hamster
    else {
      return -1;
    }
  }

  return buckets;
}
```

```java
// Time: O(n) | Space: O(n) - could be O(1) with careful indexing
class Solution {
    public int minimumBuckets(String hamsters) {
        /**
         * Returns minimum buckets needed to feed all hamsters.
         * Returns -1 if impossible.
         */
        int n = hamsters.length();
        int buckets = 0;
        // Convert string to char array for modification
        char[] arr = hamsters.toCharArray();

        for (int i = 0; i < n; i++) {
            // Only process hamster positions
            if (arr[i] != 'H') continue;

            // Check if hamster already fed by bucket to its left
            if (i > 0 && arr[i-1] == 'B') continue;

            // Try to place bucket to the right first (optimal for sharing)
            if (i + 1 < n && arr[i+1] == '.') {
                // Place bucket at i+1
                arr[i+1] = 'B';
                buckets++;
            }
            // If right not available, try left
            else if (i > 0 && arr[i-1] == '.') {
                // Place bucket at i-1
                arr[i-1] = 'B';
                buckets++;
            }
            // If neither available, impossible to feed this hamster
            else {
                return -1;
            }
        }

        return buckets;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string of length `n`
- Each position is examined at most once
- Constant-time operations at each position (comparisons and assignments)

**Space Complexity: O(n)** for the array conversion, but could be O(1) with careful implementation

- The array conversion uses O(n) space to allow marking bucket positions
- We could achieve O(1) space by using the original string with careful indexing, but the array approach is clearer
- Only a few integer variables are needed beyond the array

## Common Mistakes

1. **Not checking if a hamster is already fed before placing a new bucket**: This leads to overcounting. A bucket placed to the left of a hamster might also feed the hamster to its right. Always check if the current hamster is already fed by a previous bucket placement.

2. **Wrong order of placement attempts (left before right)**: Placing buckets to the left first seems natural when scanning left-to-right, but it's suboptimal. A bucket placed to the right can feed the next hamster if they're adjacent, while a left placement only feeds the current hamster.

3. **Forgetting to handle edge cases at string boundaries**: When `i = 0`, we can't check `i-1`. When `i = n-1`, we can't check `i+1`. Always include bounds checking before accessing adjacent indices.

4. **Not detecting impossible cases early**: Some candidates only realize a configuration is impossible at the end after trying all placements. We can detect impossibility immediately when encountering a hamster with no empty adjacent spots and not already fed.

## When You'll See This Pattern

This greedy covering pattern appears in several interval and placement problems:

1. **Maximum Number of People That Can Be Caught in Tag (LeetCode 1989)**: Similar covering problem where you need to place "catchers" to cover "runners" within a certain distance. The greedy approach of covering from one end works similarly.

2. **Brightest Position on Street (LeetCode 2021)**: While solved with sweep line, it's another coverage problem where lights cover intervals, and you need to find the position with maximum coverage.

3. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)**: Classic greedy interval covering problem where you shoot arrows to burst overlapping balloons. The "try to cover as much as possible" greedy strategy is similar.

4. **Video Stitching (LeetCode 1024)**: Another covering problem where you need to select minimum clips to cover a time interval.

## Key Takeaways

1. **Greedy works for many covering problems**: When you need to cover elements with overlapping intervals/areas, a greedy approach often works if you process in sorted order and make locally optimal choices.

2. **Direction matters in greedy scans**: The order in which you process elements and the direction in which you place coverings can significantly affect optimality. Always test both directions.

3. **Early impossibility detection**: In covering problems, you can often detect impossibility immediately when encountering an element that can't be covered, rather than exploring all possibilities first.

Related problems: [Maximum Number of People That Can Be Caught in Tag](/problem/maximum-number-of-people-that-can-be-caught-in-tag), [Brightest Position on Street](/problem/brightest-position-on-street)
