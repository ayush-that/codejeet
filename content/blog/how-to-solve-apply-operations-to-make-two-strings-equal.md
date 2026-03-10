---
title: "How to Solve Apply Operations to Make Two Strings Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Apply Operations to Make Two Strings Equal. Medium difficulty, 27.6% acceptance rate. Topics: String, Dynamic Programming."
date: "2030-02-27"
category: "dsa-patterns"
tags: ["apply-operations-to-make-two-strings-equal", "string", "dynamic-programming", "medium"]
---

# How to Solve "Apply Operations to Make Two Strings Equal"

This problem presents a classic string transformation challenge with a twist: we can flip bits at two positions simultaneously, but at a cost that depends on their distance. The tricky part is that we need to minimize the total cost to make two binary strings equal, where flipping adjacent positions costs less than flipping distant ones. This creates an interesting optimization problem that requires careful analysis of the differences between the strings.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `s1 = "11000110"`, `s2 = "11001110"`, `x = 3`

First, we identify where the strings differ:

- Compare position by position: `s1[4] = '0'` vs `s2[4] = '1'`
- That's the only difference? Let's check carefully:
  - Index 0: 1 vs 1 ✓
  - Index 1: 1 vs 1 ✓
  - Index 2: 0 vs 0 ✓
  - Index 3: 0 vs 0 ✓
  - Index 4: 0 vs 1 ✗
  - Index 5: 1 vs 1 ✓
  - Index 6: 1 vs 1 ✓
  - Index 7: 0 vs 0 ✓

Wait, we have only one difference. But our operation flips TWO bits at a time! This is a key insight: we need an EVEN number of differences to make the strings equal, because each operation changes the parity of exactly two positions.

Actually, let me re-examine: `s1 = "11000110"`, `s2 = "11001110"`

- Index 4: s1 has '0', s2 has '1' → difference
- Index 5: s1 has '1', s2 has '1' → same
- Index 6: s1 has '1', s2 has '1' → same
- Index 7: s1 has '0', s2 has '0' → same

Hmm, something's wrong. Let me trace more carefully with a simpler example:

**Better example:** `s1 = "1010"`, `s2 = "1001"`, `x = 2`

1. Find differences: Compare character by character
   - Index 0: '1' vs '1' ✓
   - Index 1: '0' vs '0' ✓
   - Index 2: '1' vs '0' ✗ (difference at index 2)
   - Index 3: '0' vs '1' ✗ (difference at index 3)

   Differences at indices: [2, 3]

2. We need to flip bits at these positions to make s1 match s2.
   - Option 1: Flip (2, 3) together → cost = min(x, |3-2|) = min(2, 1) = 1
   - Total cost = 1

3. Check result: After flipping both bits at indices 2 and 3:
   - s1 becomes: "1001" which equals s2 ✓

**Another example:** `s1 = "1100"`, `s2 = "0011"`, `x = 4`

1. Differences at indices: [0, 1, 2, 3] (all positions differ)
2. We have 4 differences (even number, good!)
3. Possible pairing strategies:
   - Pair (0,1) and (2,3): cost = min(4,1) + min(4,1) = 1 + 1 = 2
   - Pair (0,2) and (1,3): cost = min(4,2) + min(4,2) = 2 + 2 = 4
   - Pair (0,3) and (1,2): cost = min(4,3) + min(4,1) = 3 + 1 = 4

   Optimal cost = 2

The key insight: We need to pair up the difference indices optimally to minimize total cost.

## Brute Force Approach

A naive approach would be to try all possible ways to pair up the difference indices. If we have `m` differences (where `m` must be even for a solution to exist), we could:

1. Generate all permutations of the difference indices
2. Pair them up sequentially (first two, next two, etc.)
3. Calculate the total cost for each pairing
4. Return the minimum cost

However, this approach has factorial complexity O(m!) which is infeasible even for moderate `m`. For example, with just 20 differences, we'd have 20! ≈ 2.4×10¹⁸ possibilities.

Even a slightly better brute force would use recursion to try all possible pairings: for the first unpaired difference, try pairing it with each remaining difference, then recursively solve the smaller problem. This has complexity O(m!!) (double factorial), which is still exponential.

The problem constraints (n up to 10⁵) make any exponential approach impossible. We need a polynomial-time solution.

## Optimized Approach

The key insight is that this problem reduces to finding the minimum cost to pair up points on a number line (the indices where strings differ). Each pair (i, j) costs `min(x, j-i)`.

Important observations:

1. If the number of differences is odd, return -1 (we can't fix an odd number of differences with operations that flip two bits each)
2. The optimal pairing will never have crossing pairs. Why? If we have pairs (a,b) and (c,d) with a < c < b < d, we can always rearrange to (a,c) and (b,d) with equal or lower cost
3. This means we can process differences in sorted order and use dynamic programming

DP State: `dp[i]` = minimum cost to pair up the first `i` differences (0-indexed)
DP Transition: For the i-th difference (0-indexed):

- If i is odd (we're considering an even number of differences so far):
  - We can pair difference i with difference i-1: cost = `min(x, diff[i] - diff[i-1])`
  - Total cost = `dp[i-2] + min(x, diff[i] - diff[i-1])`
- We also need to consider that we might skip some pairings? Actually no, in the optimal non-crossing pairing, each difference must be paired with exactly one other

Wait, there's a catch: The operation cost is `min(x, j-i)`, not just `j-i`. This means if two differences are far apart (distance ≥ x), it's cheaper to use two separate operations with cost x each (by pairing each with some other distant difference).

Actually, let's think more carefully about the cost structure:

- If we pair two close differences (distance < x), cost = distance
- If we pair two far differences (distance ≥ x), cost = x

But here's the crucial optimization: When differences are far apart (distance ≥ x), it's ALWAYS better to pair each with a different partner using the x-cost operation, because:

- Pairing two far differences: cost = x
- Pairing each with a different (also far) difference: cost = x + x = 2x for two pairs
- But wait, that's worse! So we need to be careful.

Actually, the real insight is that when the distance between consecutive differences is very small (like 1), we should pair them directly. When the distance is large, we might want to use the x-cost operation separately.

This leads to a greedy approach: Process differences in order, and whenever we see two consecutive differences that are close enough (distance < x), pair them directly. Otherwise, use the x-cost operation.

But we need to prove this greedy approach works. Let's think about it with DP:

Let `diff` be the sorted list of indices where s1 and s2 differ.
Let `dp[i]` be the minimum cost to handle the first i+1 differences (0-indexed).

Base cases:

- `dp[0] = x` (one difference alone - but wait, we can't have just one difference! Actually, if i=0, we have 1 difference, which is invalid. So we should only compute dp for even i)
- Better: `dp[-1] = 0` (no differences, cost 0)

For the i-th difference (where i is odd, since we need even number):

1. Option 1: Pair diff[i] with diff[i-1] directly
   Cost = `min(x, diff[i] - diff[i-1])`
   Total = `dp[i-2] + min(x, diff[i] - diff[i-1])`
2. Option 2: Don't pair diff[i] with diff[i-1], but use x-cost operations
   Actually, if we don't pair consecutive differences, we need to pair them with something else. But in a non-crossing pairing, diff[i] must be paired with some diff[j] where j < i.

Wait, I think we're overcomplicating. Let me look at the problem constraints again: n ≤ 10⁵. We need O(n) or O(n log n) solution.

The actual optimal solution uses a simpler DP with state reduction. Since we only need the last two states, we can use O(1) space.

## Optimal Solution

The optimal solution uses dynamic programming with state reduction. Here's the reasoning:

1. First, collect all indices where `s1[i] != s2[i]`. Let this list be `diff`.
2. If the length of `diff` is odd, return -1 (can't fix odd number of differences with operations that flip two bits each).
3. If `diff` is empty, return 0 (strings already equal).
4. Use DP where `dp[i]` represents the minimum cost to handle the first `i+1` differences.
   - Base: `dp[0] = x` (handle one difference with cost x - but actually invalid, so we'll handle even indices only)
   - Better approach: Let `dp[i]` be min cost for first i differences (i even)
   - `dp[0] = 0` (no differences)
   - `dp[2] = min(x, diff[1] - diff[0])` (pair the first two)

   For i ≥ 4 (i even):
   - Option 1: Pair diff[i-1] with diff[i-2]: cost = `dp[i-2] + min(x, diff[i-1] - diff[i-2])`
   - Option 2: Pair diff[i-1] with some earlier difference using x-cost: Actually, we need to consider that we might use the x-cost operation for the last difference

Actually, the clean DP formulation is:
Let `dp[i]` be the minimum cost for the first i differences (0-indexed, i is the count of differences processed).

- `dp[0] = 0`
- For the i-th difference (1-indexed):
  - If i is odd: `dp[i] = dp[i-1]` (we can't complete a pair with odd number)
  - If i is even: `dp[i] = min(dp[i-2] + min(x, diff[i-1] - diff[i-2]), dp[i-1] + x)`

But wait, `dp[i-1] + x` doesn't make sense because with i-1 differences (odd number), we can't have a valid state.

The correct DP: Let `dp[i]` be the minimum cost for the first i differences (i is even).

- `dp[0] = 0`
- `dp[2] = min(x, diff[1] - diff[0])`
- For i ≥ 4: `dp[i] = min(dp[i-2] + min(x, diff[i-1] - diff[i-2]), dp[i-4] + min(x, diff[i-1] - diff[i-2]) + x)`
  Wait, that's getting complicated.

Actually, here's the clean O(n) time, O(1) space solution:
We only need to track the last two DP states since we only pair consecutive differences or skip them.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for storing differences, O(1) extra space
def minOperations(s1: str, s2: str, x: int) -> int:
    # Step 1: Collect indices where s1 and s2 differ
    diff_indices = []
    for i in range(len(s1)):
        if s1[i] != s2[i]:
            diff_indices.append(i)

    # Step 2: Check if solution is possible
    m = len(diff_indices)
    if m % 2 == 1:
        return -1

    # Step 3: Handle base cases
    if m == 0:
        return 0

    # Step 4: Dynamic programming with state reduction
    # We only need to track last two states
    # dp_prev2: minimum cost for i-2 differences processed
    # dp_prev1: minimum cost for i-1 differences processed
    # Actually, since we process differences in pairs, we can think differently

    # Initialize DP array (we'll use O(m) space for clarity, can be optimized to O(1))
    dp = [float('inf')] * (m + 1)
    dp[0] = 0  # 0 differences, 0 cost

    # Process differences
    for i in range(2, m + 1, 2):  # Only even numbers of differences
        if i == 2:
            # Base case: first two differences
            dp[i] = min(x, diff_indices[1] - diff_indices[0])
        else:
            # Two options for the i-th difference (1-indexed, so diff_indices[i-1]):
            # 1. Pair it with the previous difference (i-2 in 0-indexed)
            cost_pair = min(x, diff_indices[i-1] - diff_indices[i-2])
            # 2. Don't pair it with the previous difference - use x-cost operation
            #    This means we pair diff_indices[i-1] with some earlier difference using x cost
            #    and diff_indices[i-2] must have been paired earlier
            cost_separate = x

            dp[i] = min(dp[i-2] + cost_pair, dp[i-2] + cost_separate)
            # Wait, both options use dp[i-2]? That's not right.

    return dp[m] if dp[m] != float('inf') else -1
```

```javascript
// Time: O(n) | Space: O(n) for storing differences
function minOperations(s1, s2, x) {
  // Step 1: Collect indices where s1 and s2 differ
  const diffIndices = [];
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      diffIndices.push(i);
    }
  }

  // Step 2: Check if solution is possible
  const m = diffIndices.length;
  if (m % 2 === 1) {
    return -1;
  }

  // Step 3: Handle base cases
  if (m === 0) {
    return 0;
  }

  // Step 4: Dynamic programming
  // dp[i] = minimum cost for first i differences (i even)
  const dp = new Array(m + 1).fill(Infinity);
  dp[0] = 0;

  // For the first two differences
  dp[2] = Math.min(x, diffIndices[1] - diffIndices[0]);

  // Process remaining differences
  for (let i = 4; i <= m; i += 2) {
    // Option 1: Pair current difference with previous one
    const costPair = Math.min(x, diffIndices[i - 1] - diffIndices[i - 2]);
    // Option 2: Use x-cost operation for current and previous differences separately
    // This means we need to have processed i-4 differences before
    const costSeparate = x + x; // Two x-cost operations

    dp[i] = Math.min(
      dp[i - 2] + costPair, // Pair current with previous
      dp[i - 4] + costSeparate // Handle current and previous separately
    );
  }

  return dp[m] !== Infinity ? dp[m] : -1;
}
```

```java
// Time: O(n) | Space: O(n) for storing differences
class Solution {
    public int minOperations(String s1, String s2, int x) {
        // Step 1: Collect indices where s1 and s2 differ
        List<Integer> diffIndices = new ArrayList<>();
        for (int i = 0; i < s1.length(); i++) {
            if (s1.charAt(i) != s2.charAt(i)) {
                diffIndices.add(i);
            }
        }

        // Step 2: Check if solution is possible
        int m = diffIndices.size();
        if (m % 2 == 1) {
            return -1;
        }

        // Step 3: Handle base cases
        if (m == 0) {
            return 0;
        }

        // Step 4: Dynamic programming with state reduction (O(1) space)
        // We only need dp[i-4], dp[i-2], and dp[i]
        int dpPrev4 = 0;  // dp[0]
        int dpPrev2 = Math.min(x, diffIndices.get(1) - diffIndices.get(0));  // dp[2]

        // For m == 2, return dp[2]
        if (m == 2) {
            return dpPrev2;
        }

        int dpCurrent = 0;
        // Process from 4 differences onward
        for (int i = 4; i <= m; i += 2) {
            // Option 1: Pair i-1 with i-2
            int costPair = Math.min(x, diffIndices.get(i-1) - diffIndices.get(i-2));
            // Option 2: Handle i-1 and i-2 separately with x-cost operations
            int costSeparate = x + x;

            dpCurrent = Math.min(
                dpPrev2 + costPair,      // Pair current with previous
                dpPrev4 + costSeparate   // Handle current and previous separately
            );

            // Shift DP states for next iteration
            dpPrev4 = dpPrev2;
            dpPrev2 = dpCurrent;
        }

        return dpCurrent;
    }
}
```

</div>

Actually, I need to correct the logic. The proper solution is simpler. Let me provide the correct implementation:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for storing differences
def minOperations(s1: str, s2: str, x: int) -> int:
    # Step 1: Find all indices where strings differ
    diff = [i for i in range(len(s1)) if s1[i] != s2[i]]

    # Step 2: If odd number of differences, impossible
    if len(diff) % 2:
        return -1

    # Step 3: If no differences, already equal
    if not diff:
        return 0

    # Step 4: Dynamic programming
    # dp0: cost for first i-2 differences
    # dp1: cost for first i-1 differences
    dp0, dp1 = 0, float('inf')

    for i in range(1, len(diff)):
        # Current minimum cost for first i+1 differences
        current = min(
            dp1 + x,  # Use x-cost operation for current difference
            dp0 + min(x, diff[i] - diff[i-1])  # Pair current with previous
        )
        # Shift DP states
        dp0, dp1 = dp1, current

    return dp1
```

```javascript
// Time: O(n) | Space: O(n) for storing differences
function minOperations(s1, s2, x) {
  // Step 1: Find all indices where strings differ
  const diff = [];
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      diff.push(i);
    }
  }

  // Step 2: If odd number of differences, impossible
  if (diff.length % 2) {
    return -1;
  }

  // Step 3: If no differences, already equal
  if (diff.length === 0) {
    return 0;
  }

  // Step 4: Dynamic programming with state reduction
  let dp0 = 0; // Cost for i-2 differences
  let dp1 = Infinity; // Cost for i-1 differences

  for (let i = 1; i < diff.length; i++) {
    const current = Math.min(
      dp1 + x, // Use x-cost operation for current difference
      dp0 + Math.min(x, diff[i] - diff[i - 1]) // Pair current with previous
    );

    // Shift DP states for next iteration
    dp0 = dp1;
    dp1 = current;
  }

  return dp1;
}
```

```java
// Time: O(n) | Space: O(n) for storing differences
class Solution {
    public int minOperations(String s1, String s2, int x) {
        // Step 1: Find all indices where strings differ
        List<Integer> diff = new ArrayList<>();
        for (int i = 0; i < s1.length(); i++) {
            if (s1.charAt(i) != s2.charAt(i)) {
                diff.add(i);
            }
        }

        // Step 2: If odd number of differences, impossible
        if (diff.size() % 2 == 1) {
            return -1;
        }

        // Step 3: If no differences, already equal
        if (diff.isEmpty()) {
            return 0;
        }

        // Step 4: Dynamic programming with state reduction
        long dp0 = 0;  // Cost for i-2 differences
        long dp1 = Long.MAX_VALUE;  // Cost for i-1 differences

        for (int i = 1; i < diff.size(); i++) {
            long current = Math.min(
                dp1 + x,  // Use x-cost operation for current difference
                dp0 + Math.min(x, diff.get(i) - diff.get(i-1))  // Pair current with previous
            );

            // Shift DP states for next iteration
            dp0 = dp1;
            dp1 = current;
        }

        return (int) dp1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through both strings once to find differences: O(n)
- We iterate through the difference list once: O(m) where m ≤ n
- Total: O(n)

**Space Complexity:** O(n) in the worst case

- We store the difference indices, which could be up to n in the worst case
- The DP uses O(1) extra space (just a few variables)
- Total: O(n) for the difference list

## Common Mistakes

1. **Not checking for odd number of differences first**: Each operation flips exactly two bits, so we need an even number of differences. Forgetting this check will lead to incorrect attempts to solve impossible cases.

2. **Incorrect pairing logic**: The cost is `min(x, j-i)`, not `j-i`. Candidates often miss the `min()` part and try to minimize sum of distances instead of the correct cost function.

3. **Using O(n²) DP instead of O(n)**: A natural DP formulation might be `dp[i][j]` for pairing up to i-th difference with j state, which is O(n²). The key insight is that optimal pairing is non-crossing, allowing O(n) solution.

4. **Integer overflow in Java**: When n is large (up to 10⁵) and x is large, the total cost might exceed 2³¹-1. Using `int` instead of `long` for DP values can cause overflow.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Non-crossing pairing on a line**: Similar to "Minimum Cost to Connect Sticks" (LeetCode 1167) or "Minimum Time to Make Rope Colorful" (LeetCode 1578), where you need to pair or group elements with minimum cost.

2. **DP with state reduction**: When you only need the last few DP states, you can reduce space complexity from O(n) to O(1). Seen in problems like "Climbing Stairs" (LeetCode 70) or "House Robber" (LeetCode 198).

3. **String difference analysis**: Problems that require comparing two strings and finding minimum operations to make them equal, like "Edit Distance" (LeetCode 72) or "Minimum Swaps to Make Strings Equal" (LeetCode 1247).

## Key Takeaways

1. **Parity matters**: When operations affect elements in pairs, always check if the number of elements to change has the correct parity (even/odd).

2. **Optimal pairing is non-crossing**: On a line, the optimal way to pair points to minimize sum of connection costs (under certain conditions) never involves crossing pairs.

3. **DP state reduction**: When your DP transition only depends on a constant number of previous states, you can use O(1) space instead of O(n).

[Practice this problem on CodeJeet](/problem/apply-operations-to-make-two-strings-equal)
