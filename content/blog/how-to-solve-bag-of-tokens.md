---
title: "How to Solve Bag of Tokens — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Bag of Tokens. Medium difficulty, 59.5% acceptance rate. Topics: Array, Two Pointers, Greedy, Sorting."
date: "2028-04-04"
category: "dsa-patterns"
tags: ["bag-of-tokens", "array", "two-pointers", "greedy", "medium"]
---

# How to Solve Bag of Tokens

You have a bag of tokens with different power costs, and you can either play a token face-up (spending power to gain a point) or face-down (gaining power but losing a point). The challenge is to maximize your final score by strategically choosing which tokens to play and in what order. What makes this problem interesting is the tension between spending power to score points versus sacrificing points to gain more power for better tokens later.

## Visual Walkthrough

Let's walk through an example: `tokens = [100, 200, 300, 400]`, `power = 200`, and we want to maximize our score.

**Step 1: Sort the tokens** → `[100, 200, 300, 400]`  
We sort because we want to play cheap tokens face-up first (to gain points) and expensive tokens face-down last (to gain power).

**Step 2: Initialize two pointers**

- `left = 0` (points to the cheapest token)
- `right = 3` (points to the most expensive token)
- `score = 0`
- `max_score = 0`

**Step 3: First move**  
We have `power = 200`. Can we play `tokens[left] = 100` face-up? Yes, because `200 ≥ 100`.

- Play token face-up: `power = 200 - 100 = 100`, `score = 0 + 1 = 1`
- Update `max_score = max(0, 1) = 1`
- Move `left = 1`

**Step 4: Second move**  
Now `power = 100`, `score = 1`. Can we play `tokens[left] = 200` face-up? No, because `100 < 200`.  
We could play `tokens[right] = 400` face-down, but only if `score ≥ 1` (which it is).

- Play token face-down: `power = 100 + 400 = 500`, `score = 1 - 1 = 0`
- Move `right = 2`

**Step 5: Third move**  
Now `power = 500`, `score = 0`. Can we play `tokens[left] = 200` face-up? Yes, because `500 ≥ 200`.

- Play token face-up: `power = 500 - 200 = 300`, `score = 0 + 1 = 1`
- Update `max_score = max(1, 1) = 1`
- Move `left = 2`

**Step 6: Fourth move**  
Now `left = 2`, `right = 2` (same token). We can only play if `left ≤ right`.  
`power = 300`, `score = 1`. Can we play `tokens[left] = 300` face-up? Yes, because `300 ≥ 300`.

- Play token face-up: `power = 300 - 300 = 0`, `score = 1 + 1 = 2`
- Update `max_score = max(1, 2) = 2`
- Move `left = 3`

**Step 7: Game ends**  
Now `left = 3`, `right = 2`, so `left > right`. We stop.  
Final `max_score = 2`.

The key insight: we traded a point early to gain enough power to buy two more expensive tokens, netting us +1 point overall.

## Brute Force Approach

A brute force approach would consider all possible sequences of playing tokens face-up or face-down. For each token, we have three choices:

1. Play it face-up (if we have enough power)
2. Play it face-down (if we have at least 1 point)
3. Skip it entirely

With `n` tokens, this leads to approximately `3^n` possible sequences to check. Even for moderate `n` (like 20), this becomes computationally infeasible (`3^20 ≈ 3.5 billion` operations).

We could also try all permutations of token order, but that's `n!` possibilities, which grows even faster. The brute force approach is clearly impractical for constraints where `n` can be up to 1000.

## Optimized Approach

The optimal solution uses a **greedy two-pointer approach** after sorting:

1. **Sort the tokens** in ascending order. This allows us to always know where the cheapest (left) and most expensive (right) tokens are.

2. **Use two pointers**:
   - `left` starts at the beginning (cheapest tokens)
   - `right` starts at the end (most expensive tokens)

3. **Core strategy**:
   - If we have enough power to play the cheapest available token face-up, do it! This gains us a point with minimal power cost.
   - If we don't have enough power, but we have at least 1 point, play the most expensive available token face-down. This sacrifices a point to gain significant power.
   - Otherwise, we can't make any more moves.

4. **Track the maximum score**: Since playing face-down reduces our score, we need to track the maximum score we've seen at any point, not just the final score.

Why does this greedy approach work? Because:

- Playing the cheapest token face-up gives us the "best bang for our buck" - maximum points per power spent.
- Playing the most expensive token face-down gives us the maximum power gain per point sacrificed.
- By always making these optimal local choices, we achieve the global optimum.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n) for two-pointer traversal = O(n log n)
# Space: O(1) if we sort in-place, O(n) if we need to copy (Python's sort is O(n) space)
def bagOfTokensScore(tokens, power):
    # Sort tokens to enable greedy strategy
    tokens.sort()

    left, right = 0, len(tokens) - 1  # Two pointers for cheapest and most expensive tokens
    score = 0  # Current score
    max_score = 0  # Maximum score achieved at any point

    # Continue while we have tokens to play
    while left <= right:
        # If we have enough power to play the cheapest token face-up
        if power >= tokens[left]:
            # Play token face-up: spend power, gain score
            power -= tokens[left]
            score += 1
            left += 1  # Move to next cheapest token

            # Update maximum score (important because score may decrease later)
            max_score = max(max_score, score)

        # If we can't play face-up but have at least 1 point to sacrifice
        elif score > 0:
            # Play token face-down: gain power, lose score
            power += tokens[right]
            score -= 1
            right -= 1  # Move to next most expensive token

        # If we can't play face-up AND don't have points to play face-down
        else:
            break  # Game over, no more valid moves

    return max_score
```

```javascript
// Time: O(n log n) for sorting + O(n) for two-pointer traversal = O(n log n)
// Space: O(1) if we sort in-place, but JavaScript sort may use O(n) space
function bagOfTokensScore(tokens, power) {
  // Sort tokens to enable greedy strategy
  tokens.sort((a, b) => a - b);

  let left = 0,
    right = tokens.length - 1; // Two pointers
  let score = 0; // Current score
  let maxScore = 0; // Maximum score achieved

  // Continue while we have tokens to play
  while (left <= right) {
    // If we have enough power to play the cheapest token face-up
    if (power >= tokens[left]) {
      // Play token face-up: spend power, gain score
      power -= tokens[left];
      score++;
      left++; // Move to next cheapest token

      // Update maximum score
      maxScore = Math.max(maxScore, score);
    }
    // If we can't play face-up but have at least 1 point to sacrifice
    else if (score > 0) {
      // Play token face-down: gain power, lose score
      power += tokens[right];
      score--;
      right--; // Move to next most expensive token
    }
    // If we can't play face-up AND don't have points to play face-down
    else {
      break; // Game over
    }
  }

  return maxScore;
}
```

```java
// Time: O(n log n) for sorting + O(n) for two-pointer traversal = O(n log n)
// Space: O(1) if we sort in-place, but Java's Arrays.sort() may use O(n) space
class Solution {
    public int bagOfTokensScore(int[] tokens, int power) {
        // Sort tokens to enable greedy strategy
        Arrays.sort(tokens);

        int left = 0, right = tokens.length - 1;  // Two pointers
        int score = 0;  // Current score
        int maxScore = 0;  // Maximum score achieved

        // Continue while we have tokens to play
        while (left <= right) {
            // If we have enough power to play the cheapest token face-up
            if (power >= tokens[left]) {
                // Play token face-up: spend power, gain score
                power -= tokens[left];
                score++;
                left++;  // Move to next cheapest token

                // Update maximum score
                maxScore = Math.max(maxScore, score);
            }
            // If we can't play face-up but have at least 1 point to sacrifice
            else if (score > 0) {
                // Play token face-down: gain power, lose score
                power += tokens[right];
                score--;
                right--;  // Move to next most expensive token
            }
            // If we can't play face-up AND don't have points to play face-down
            else {
                break;  // Game over
            }
        }

        return maxScore;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n log n)`

- Sorting the tokens takes `O(n log n)` time
- The two-pointer traversal takes `O(n)` time
- Dominated by the sorting step, so overall `O(n log n)`

**Space Complexity:** `O(1)` or `O(n)` depending on implementation

- If we sort in-place: `O(1)` extra space (not counting input storage)
- If the sorting algorithm requires extra space (like Python's Timsort): `O(n)`
- The two-pointer approach itself uses only `O(1)` extra variables

## Common Mistakes

1. **Forgetting to track maximum score**: Candidates often return the final score instead of the maximum score achieved. Remember that playing face-down reduces your score, so you need to track the peak.

2. **Incorrect loop condition**: Using `while left < right` instead of `while left <= right`. When `left == right`, we still have one token to play if possible.

3. **Not sorting the tokens**: The greedy strategy depends on knowing which tokens are cheapest and most expensive. Without sorting, you can't make optimal local decisions.

4. **Playing face-down when score is 0**: The problem states you need at least 1 point to play a token face-down. Check `score > 0` before playing face-down.

5. **Infinite loop with zero-power tokens**: If a token costs 0 power, you can play it face-up indefinitely. However, our solution handles this correctly because after playing a zero-cost token, we increment `left`, so we don't play it again.

## When You'll See This Pattern

This "two-pointer greedy after sorting" pattern appears in problems where you need to make optimal pairings or trades:

1. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: Similar two-pointer approach to find pairs that sum to a target.

2. **Container With Most Water (LeetCode 11)**: Uses two pointers moving inward to maximize area.

3. **Boats to Save People (LeetCode 881)**: Sort people by weight, then pair heaviest with lightest using two pointers.

4. **Assign Cookies (LeetCode 455)**: Greedy approach of matching smallest cookies to smallest greed factors.

The pattern is: sort the array, then use two pointers to make optimal local decisions that lead to a global optimum.

## Key Takeaways

1. **When facing trade-off decisions**, consider sorting to enable greedy choices. The "cheapest first, most expensive last" pattern is powerful.

2. **Two pointers are excellent for exploring extremes** - they let you consider the smallest and largest elements efficiently.

3. **Track intermediate maxima** when your metric can go up and down. Don't assume the final value is the maximum.

4. **Always validate move conditions** - check you have enough resources (power or points) before making a move.

[Practice this problem on CodeJeet](/problem/bag-of-tokens)
