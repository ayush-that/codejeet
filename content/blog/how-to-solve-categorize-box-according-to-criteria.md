---
title: "How to Solve Categorize Box According to Criteria — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Categorize Box According to Criteria. Easy difficulty, 38.7% acceptance rate. Topics: Math."
date: "2028-08-07"
category: "dsa-patterns"
tags: ["categorize-box-according-to-criteria", "math", "easy"]
---

# How to Solve "Categorize Box According to Criteria"

This problem asks you to categorize a box based on its dimensions and mass. While conceptually straightforward, it's a **multi-condition classification problem** that tests your ability to carefully implement multiple independent criteria without overcomplicating the logic. The tricky part isn't algorithmic complexity—it's handling all the edge cases correctly and writing clean, readable code under interview pressure.

## Visual Walkthrough

Let's trace through an example: `length = 1000`, `width = 35`, `height = 700`, `mass = 300`

**Step 1: Check for "Bulky"**

- Condition 1: Any dimension ≥ 10⁴?
  - length = 1000 (NO, 1000 < 10000)
  - width = 35 (NO)
  - height = 700 (NO)
- Condition 2: Volume ≥ 10⁹?
  - Volume = 1000 × 35 × 700 = 24,500,000
  - 24,500,000 ≥ 1,000,000,000? NO
- Result: Not bulky

**Step 2: Check for "Heavy"**

- Condition: mass ≥ 100?
  - mass = 300 ≥ 100? YES
- Result: Heavy

**Step 3: Determine final category**

- Bulky? NO
- Heavy? YES
- Rules:
  - Both: "Both"
  - Only bulky: "Bulky"
  - Only heavy: "Heavy"
  - Neither: "Neither"
- Final: "Heavy"

Another example: `length = 15000`, `width = 200`, `height = 50`, `mass = 120`

**Step 1: Check for "Bulky"**

- Condition 1: Any dimension ≥ 10⁴?
  - length = 15000 ≥ 10000? YES → Immediately bulky
- Result: Bulky

**Step 2: Check for "Heavy"**

- mass = 120 ≥ 100? YES
- Result: Heavy

**Step 3: Final category**

- Bulky? YES
- Heavy? YES
- Final: "Both"

Notice that for bulky, we can short-circuit: if ANY dimension is huge, we don't need to calculate volume.

## Brute Force Approach

There's no traditional "brute force" vs "optimized" distinction here since the problem has fixed constraints. However, a common **inefficient approach** would be:

1. Always calculate the volume first (even if we could short-circuit)
2. Use nested if-else statements that check conditions in the wrong order
3. Write redundant code by checking the same conditions multiple times

While this would still run in O(1) time, it's inefficient in terms of code clarity and potential for bugs. The real "brute force" thinking is: "Check everything in any order without considering optimization."

What makes this approach problematic:

- Calculating volume when a dimension already exceeds 10⁴ is unnecessary work
- Messy if-else chains can lead to logic errors
- Harder to read and maintain

## Optimal Solution

The optimal approach uses **short-circuit evaluation** and **clean condition checking**:

1. Check if the box is bulky using two conditions (with short-circuiting)
2. Check if the box is heavy
3. Use the combination of these two boolean results to determine the final category

The key insight: We can determine "bulky" by checking EITHER:

- Any dimension ≥ 10⁴ (quick check, no multiplication needed)
- OR volume ≥ 10⁹ (only calculate if first check fails)

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def categorizeBox(length: int, width: int, height: int, mass: int) -> str:
    # Step 1: Check if the box is bulky
    # First check: any dimension >= 10^4
    bulky = (length >= 10**4 or width >= 10**4 or height >= 10**4)

    # Second check: volume >= 10^9 (only calculate if first check failed)
    # Note: We use multiplication only when necessary to avoid potential overflow
    # in languages without big integers, though Python handles it fine
    if not bulky:
        volume = length * width * height
        bulky = (volume >= 10**9)

    # Step 2: Check if the box is heavy
    heavy = (mass >= 100)

    # Step 3: Determine the category based on both conditions
    if bulky and heavy:
        return "Both"
    elif bulky:
        return "Bulky"
    elif heavy:
        return "Heavy"
    else:
        return "Neither"
```

```javascript
// Time: O(1) | Space: O(1)
function categorizeBox(length, width, height, mass) {
  // Step 1: Check if the box is bulky
  // First check: any dimension >= 10^4
  let bulky = length >= 10000 || width >= 10000 || height >= 10000;

  // Second check: volume >= 10^9 (only calculate if first check failed)
  // Note: Use BigInt for volume to prevent integer overflow in JavaScript
  if (!bulky) {
    // Convert to BigInt to safely handle large multiplications
    const volume = BigInt(length) * BigInt(width) * BigInt(height);
    bulky = volume >= 1000000000n; // 10^9 as BigInt
  }

  // Step 2: Check if the box is heavy
  const heavy = mass >= 100;

  // Step 3: Determine the category based on both conditions
  if (bulky && heavy) {
    return "Both";
  } else if (bulky) {
    return "Bulky";
  } else if (heavy) {
    return "Heavy";
  } else {
    return "Neither";
  }
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public String categorizeBox(int length, int width, int height, int mass) {
        // Step 1: Check if the box is bulky
        // First check: any dimension >= 10^4
        boolean bulky = (length >= 10000 || width >= 10000 || height >= 10000);

        // Second check: volume >= 10^9 (only calculate if first check failed)
        // Use long to prevent integer overflow during multiplication
        if (!bulky) {
            // Cast to long before multiplication to avoid int overflow
            long volume = (long)length * (long)width * (long)height;
            bulky = (volume >= 1000000000L); // 10^9 as long
        }

        // Step 2: Check if the box is heavy
        boolean heavy = (mass >= 100);

        // Step 3: Determine the category based on both conditions
        if (bulky && heavy) {
            return "Both";
        } else if (bulky) {
            return "Bulky";
        } else if (heavy) {
            return "Heavy";
        } else {
            return "Neither";
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- All operations are constant time: comparisons, multiplications, and conditional checks
- We perform at most 3 comparisons for dimensions, 1 multiplication for volume, and 1 comparison for mass
- Even with the volume calculation, it's still O(1) since the number of operations doesn't scale with input size

**Space Complexity: O(1)**

- We only use a few boolean variables and potentially one variable for volume
- No data structures that grow with input size
- All variables use constant space regardless of input values

## Common Mistakes

1. **Integer Overflow**: When calculating volume, `length × width × height` can exceed 2³¹ - 1 (max 32-bit integer). In Java/C++, this causes overflow and incorrect comparisons.
   - **Fix**: Use `long` in Java or `BigInt` in JavaScript before multiplication.

2. **Incorrect Order of Checks**: Checking volume first instead of checking dimensions ≥ 10⁴ means unnecessary multiplication when a dimension already makes the box bulky.
   - **Fix**: Always check the quick condition (dimensions ≥ 10⁴) first before calculating volume.

3. **Misunderstanding "Any" vs "All"**: The problem says "Any of the dimensions" but some candidates mistakenly check if ALL dimensions are ≥ 10⁴.
   - **Fix**: Use OR (`||`) not AND (`&&`) when checking dimensions.

4. **Forgetting Edge Cases**: Not testing with maximum values (10⁵ dimensions, 10⁶ mass) or minimum values.
   - **Fix**: Always test: (1) all dimensions just below thresholds, (2) volume just below/above 10⁹, (3) mass just below/above 100.

## When You'll See This Pattern

This problem uses **multi-condition classification** with **short-circuit evaluation**, a pattern seen in:

1. **Fizz Buzz (LeetCode 412)**: Classify numbers based on divisibility by 3 and/or 5. Similar structure: check two independent conditions, then combine results.

2. **Best Poker Hand (LeetCode 2347)**: Categorize a poker hand based on multiple criteria (pair, three of a kind, etc.). Requires checking conditions in a specific order.

3. **Find Winner on a Tic Tac Toe Game (LeetCode 1275)**: Determine game state by checking multiple win conditions (rows, columns, diagonals). Uses similar conditional logic.

The core pattern: You have multiple independent criteria that combine to produce a final classification. The optimal solution often involves:

- Checking simpler/cheaper conditions first
- Using boolean flags to track each condition
- Combining results at the end with clear if-else logic

## Key Takeaways

1. **Short-Circuit Evaluation is Your Friend**: When you have OR conditions where some checks are cheaper than others, put the cheap ones first. This avoids unnecessary expensive computations.

2. **Watch for Integer Overflow**: Any time you multiply integers that could be large (≥ 10⁴ in this case), consider whether the product could exceed your language's integer limits. Use larger data types proactively.

3. **Boolean Flags Simplify Complex Logic**: Instead of deeply nested if-else statements, compute simple boolean values for each condition, then combine them. This makes your code more readable and less error-prone.

Related problems: [Fizz Buzz](/problem/fizz-buzz), [Find Winner on a Tic Tac Toe Game](/problem/find-winner-on-a-tic-tac-toe-game), [Best Poker Hand](/problem/best-poker-hand)
