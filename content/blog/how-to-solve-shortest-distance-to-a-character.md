---
title: "How to Solve Shortest Distance to a Character — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Shortest Distance to a Character. Easy difficulty, 72.7% acceptance rate. Topics: Array, Two Pointers, String."
date: "2028-06-04"
category: "dsa-patterns"
tags: ["shortest-distance-to-a-character", "array", "two-pointers", "string", "easy"]
---

# How to Solve Shortest Distance to a Character

This problem asks us to find, for each character in a string, the distance to the nearest occurrence of a specific target character. While conceptually simple, it's tricky because we need to consider distances in both directions—looking left and right—and efficiently compute the minimum for every position. The challenge lies in avoiding O(n²) brute force while handling the bidirectional nature of the search.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "loveleetcode"` and `c = "e"`.

**Step 1: Identify target positions**
The character `"e"` appears at indices: 3, 5, 6, and 11.

**Step 2: Calculate distances from each position**
For each index `i`, we need the minimum distance to any `"e"`:

- `i = 0`: Closest `"e"` is at index 3 → distance = |0-3| = 3
- `i = 1`: Closest `"e"` is at index 3 → distance = |1-3| = 2
- `i = 2`: Closest `"e"` is at index 3 → distance = |2-3| = 1
- `i = 3`: This is an `"e"` → distance = 0
- `i = 4`: Closest `"e"` is at index 3 or 5 → min(|4-3|, |4-5|) = 1
- `i = 5`: This is an `"e"` → distance = 0
- `i = 6`: This is an `"e"` → distance = 0
- `i = 7`: Closest `"e"` is at index 6 → distance = |7-6| = 1
- `i = 8`: Closest `"e"` is at index 6 → distance = |8-6| = 2
- `i = 9`: Closest `"e"` is at index 6 → distance = |9-6| = 3
- `i = 10`: Closest `"e"` is at index 11 → distance = |10-11| = 1
- `i = 11`: This is an `"e"` → distance = 0

The result array would be: `[3, 2, 1, 0, 1, 0, 0, 1, 2, 3, 1, 0]`

The key insight: For each position, we need to consider distances to the nearest `"e"` on the left AND the nearest `"e"` on the right, then take the minimum.

## Brute Force Approach

A naive solution would be: For each character in the string, scan left and right to find the nearest target character.

**Algorithm:**

1. Initialize an answer array of length n
2. For each index i from 0 to n-1:
   - Initialize min_distance = ∞
   - For each index j from 0 to n-1:
     - If s[j] == c:
       - Update min_distance = min(min_distance, |i-j|)
   - answer[i] = min_distance

**Why it's inefficient:**
This approach takes O(n²) time because for each of n positions, we potentially scan all n positions. For a string of length 10,000, that's 100 million operations—far too slow.

**What makes this problem interesting:** We can solve it in O(n) time with two passes through the string, which is a common pattern for problems involving distances to nearest elements.

## Optimal Solution

The optimal approach uses two passes: one left-to-right and one right-to-left. On the first pass, we track the distance to the most recent target character we've seen from the left. On the second pass, we track the distance to the most recent target character from the right, taking the minimum of the two distances at each position.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result array
def shortestToChar(s: str, c: str) -> List[int]:
    n = len(s)
    answer = [0] * n

    # First pass: left to right
    # Track the position of the most recent occurrence of c from the left
    # Initialize with -inf to represent "no c seen yet"
    prev = float('-inf')
    for i in range(n):
        if s[i] == c:
            prev = i
        # Distance to the nearest c on the left
        answer[i] = i - prev

    # Second pass: right to left
    # Track the position of the most recent occurrence of c from the right
    # Initialize with +inf to represent "no c seen yet"
    prev = float('inf')
    for i in range(n-1, -1, -1):
        if s[i] == c:
            prev = i
        # Take the minimum of distance to left c and distance to right c
        answer[i] = min(answer[i], prev - i)

    return answer
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function shortestToChar(s, c) {
  const n = s.length;
  const answer = new Array(n);

  // First pass: left to right
  // Track the position of the most recent occurrence of c from the left
  // Initialize with -Infinity to represent "no c seen yet"
  let prev = -Infinity;
  for (let i = 0; i < n; i++) {
    if (s[i] === c) {
      prev = i;
    }
    // Distance to the nearest c on the left
    answer[i] = i - prev;
  }

  // Second pass: right to left
  // Track the position of the most recent occurrence of c from the right
  // Initialize with Infinity to represent "no c seen yet"
  prev = Infinity;
  for (let i = n - 1; i >= 0; i--) {
    if (s[i] === c) {
      prev = i;
    }
    // Take the minimum of distance to left c and distance to right c
    answer[i] = Math.min(answer[i], prev - i);
  }

  return answer;
}
```

```java
// Time: O(n) | Space: O(n) for the result array
public int[] shortestToChar(String s, char c) {
    int n = s.length();
    int[] answer = new int[n];

    // First pass: left to right
    // Track the position of the most recent occurrence of c from the left
    // Initialize with -n to represent "no c seen yet" (could use Integer.MIN_VALUE/2)
    int prev = -n;
    for (int i = 0; i < n; i++) {
        if (s.charAt(i) == c) {
            prev = i;
        }
        // Distance to the nearest c on the left
        answer[i] = i - prev;
    }

    // Second pass: right to left
    // Track the position of the most recent occurrence of c from the right
    // Initialize with 2*n to represent "no c seen yet" (could use Integer.MAX_VALUE/2)
    prev = 2 * n;
    for (int i = n - 1; i >= 0; i--) {
        if (s.charAt(i) == c) {
            prev = i;
        }
        // Take the minimum of distance to left c and distance to right c
        answer[i] = Math.min(answer[i], prev - i);
    }

    return answer;
}
```

</div>

**Why this works:**

- The first pass ensures each position knows the distance to the nearest target character to its left.
- The second pass ensures each position knows the distance to the nearest target character to its right.
- By taking the minimum of these two distances at each position, we get the overall minimum distance.

**Key implementation details:**

1. We initialize `prev` with extreme values (±∞ or large numbers) so that when no target character has been seen yet, the distance calculation gives a large positive number that will be overwritten by the other pass.
2. The order of passes matters: left-to-right first, then right-to-left.
3. We update `prev` immediately when we encounter the target character, so the distance calculation for that position itself becomes 0.

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string, each taking O(n) time.
- Each pass performs constant work per character (comparison, subtraction, min operation).
- Total operations: 2n → O(n).

**Space Complexity: O(n)**

- We need to store the result array of length n.
- We use only a few extra variables (`prev`, loop counters), so auxiliary space is O(1).
- Total space: O(n) for the output, O(1) extra.

## Common Mistakes

1. **Forgetting to handle the "no target seen yet" case**: If you initialize `prev` to 0 instead of -∞, positions before the first target character will get incorrect distances. Always initialize to a value that ensures the first pass gives large distances that will be corrected by the second pass.

2. **Using the wrong order of passes**: Some candidates try to do both calculations in one pass, which doesn't work because you can't know future target positions. The left-to-right pass must come first to establish left distances, then right-to-left to establish right distances.

3. **Off-by-one errors in distance calculation**: Remember that `i - prev` gives the correct distance when `prev` is to the left of `i`, and `prev - i` gives the correct distance when `prev` is to the right of `i`. Mixing these up will give negative distances.

4. **Not updating `prev` immediately when encountering target**: If you update `prev` after calculating the distance for the current position, the target character itself won't get distance 0. Always update `prev` before or as part of the distance calculation for the current position.

## When You'll See This Pattern

This "two-pass distance calculation" pattern appears in several problems where you need to find distances to nearest elements:

1. **Shortest Distance to Target Color** (LeetCode 1182): Similar concept but with multiple colors/targets.
2. **Daily Temperatures** (LeetCode 739): Instead of distance to nearest target, it's distance to next warmer temperature—uses a similar forward/backward scanning approach.
3. **Candy** (LeetCode 135): Requires considering both left and right neighbors to determine candy distribution.
4. **Trapping Rain Water** (LeetCode 42): Uses the concept of tracking maximum heights from left and right to determine water capacity at each position.

The core idea is the same: when you need to consider information from both sides (left and right), make two passes—one in each direction—and combine the results.

## Key Takeaways

1. **Two-pass approach**: When a problem requires considering both directions (left/right, forward/backward), consider solving it with two separate passes and combining the results.

2. **Distance to nearest element**: The pattern of tracking the "most recent occurrence" and calculating distances from it is reusable for many proximity problems.

3. **Initialization matters**: Choosing appropriate initial values for tracking variables is crucial—they should represent "no valid value seen yet" in a way that doesn't break subsequent calculations.

**Related problems:** [Check Distances Between Same Letters](/problem/check-distances-between-same-letters)
