---
title: "How to Solve Minimum Cost to Set Cooking Time — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Set Cooking Time. Medium difficulty, 41.5% acceptance rate. Topics: Math, Enumeration."
date: "2029-11-20"
category: "dsa-patterns"
tags: ["minimum-cost-to-set-cooking-time", "math", "enumeration", "medium"]
---

# How to Solve Minimum Cost to Set Cooking Time

This problem asks us to find the minimum cost to set a target cooking time on a microwave by pressing digit buttons, where each button press has a specific cost. The microwave interprets up to four digits as minutes and seconds (with leading zeros), but we can also enter the time in alternative ways (like entering 90 seconds instead of 1:30). The challenge is balancing the trade-off between different valid digit sequences that represent the same cooking time, each with potentially different costs.

What makes this problem interesting is that a single target time can be represented in multiple valid digit sequences, and we need to systematically explore all possibilities while handling edge cases like invalid times (seconds ≥ 60) and the maximum time limit of 99:99.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `startAt = 1` (finger starts on digit 1)
- `moveCost = 2` (cost to move finger to another digit)
- `pushCost = 100` (cost to push current digit)
- `targetSeconds = 600` (we want to cook for 10 minutes)

The target time 600 seconds can be represented as:

1. **10:00** (10 minutes, 0 seconds) → digits: [1, 0, 0, 0]
2. **09:60** (9 minutes, 60 seconds) → digits: [0, 9, 6, 0]
3. **06:00** (6 minutes, 0 seconds) → Wait, this is wrong! 6:00 = 360 seconds, not 600.

Actually, let's think systematically. 600 seconds equals:

- 10 minutes = 600 seconds → digits: [1, 0, 0, 0]
- 9 minutes + 60 seconds = 540 + 60 = 600 seconds → digits: [0, 9, 6, 0]
- 8 minutes + 120 seconds → invalid (seconds ≥ 60)
- 7 minutes + 180 seconds → invalid
- ... and so on

We also have the option to enter just the total seconds (600), but the microwave requires exactly 4 digits with leading zeros, so 600 seconds = 10:00 = [1,0,0,0].

Now let's calculate costs for our two valid representations:

**Option 1: [1, 0, 0, 0]**

- Start at digit 1 (no move cost for first digit)
- Push '1': cost = pushCost = 100
- Move from '1' to '0': cost = moveCost = 2
- Push '0': cost = 100
- Finger stays on '0' (no move)
- Push '0': cost = 100
- Push '0': cost = 100
- Total = 100 + 2 + 100 + 100 + 100 = **402**

**Option 2: [0, 9, 6, 0]**

- Start at digit 1, move to '0': cost = 2
- Push '0': cost = 100
- Move from '0' to '9': cost = 2
- Push '9': cost = 100
- Move from '9' to '6': cost = 2
- Push '6': cost = 100
- Move from '6' to '0': cost = 2
- Push '0': cost = 100
- Total = 2 + 100 + 2 + 100 + 2 + 100 + 2 + 100 = **408**

So the minimum cost is 402 for this example. The key insight is we need to check ALL valid minute:second representations of the target time.

## Brute Force Approach

A naive approach might try to generate all possible 4-digit sequences (0000 to 9999), convert each to seconds, and check if it equals the target. However, this would be 10,000 possibilities, which is manageable but inefficient. More importantly, this approach misses the fact that the same time can be represented with fewer than 4 digits (like entering 90 instead of 01:30).

An even worse brute force would be to try all minute values from 0 to 99 and all second values from 0 to 99, but that's 100 × 100 = 10,000 combinations, many of which are invalid (seconds ≥ 60).

The real issue with brute force isn't the number of combinations (10K is fine), but rather failing to recognize that we only need to check two types of valid representations:

1. **MM:SS format**: Where MM ≤ 99 and SS ≤ 59
2. **Seconds-only format**: Where we interpret all digits as seconds (but still display as 4 digits)

Actually, there's a cleaner insight: For a given target time T seconds, the valid representations are:

- (T // 60) minutes, (T % 60) seconds → This is the "canonical" representation
- (T // 60 - 1) minutes, (T % 60 + 60) seconds, but ONLY if minutes > 0 and seconds < 40

Why seconds < 40? Because if we borrow 60 seconds from minutes, the new seconds become (T % 60 + 60), which must be < 100 (since seconds are two digits).

## Optimized Approach

The key insight is that for any target time in seconds, there are at most **two valid digit sequences** we need to consider:

1. **Standard minutes:seconds representation**: `minutes = targetSeconds // 60`, `seconds = targetSeconds % 60`
2. **Alternative representation** (when possible): `minutes = targetSeconds // 60 - 1`, `seconds = targetSeconds % 60 + 60`

The second representation is only valid when:

- `minutes ≥ 0` (can't have negative minutes)
- `seconds < 100` (seconds must be two digits)
- `minutes < 100` (minutes must be two digits)
- Actually, we also need `minutes * 60 + seconds == targetSeconds` (which it will by construction)

Wait, let's think about the seconds < 100 constraint more carefully. If targetSeconds % 60 ≥ 40, then seconds = targetSeconds % 60 + 60 would be ≥ 100, which is invalid. So the alternative representation is only valid when targetSeconds % 60 < 40.

For example, targetSeconds = 150:

- Standard: 2:30 → minutes=2, seconds=30
- Alternative: 1:90 → minutes=1, seconds=90 (invalid! 90 ≥ 60)

Actually 90 < 100, so it's valid as digits, but 90 seconds ≥ 60, which the microwave might reject... Oh, that's important! The problem says the microwave supports cooking times "at most 99 minutes and 99 seconds" - it doesn't say seconds must be < 60! So 1:90 is actually valid.

So our constraints are simpler:

1. minutes must be between 0 and 99 inclusive
2. seconds must be between 0 and 99 inclusive
3. minutes \* 60 + seconds must equal targetSeconds

For each valid (minutes, seconds) pair, we convert to a 4-digit string (with leading zeros), calculate the cost to enter those digits, and take the minimum.

## Optimal Solution

The algorithm:

1. Initialize answer to infinity
2. Try all minute values from 0 to 99
3. For each minute value, check if the corresponding seconds = targetSeconds - minutes \* 60 is between 0 and 99
4. If valid, convert (minutes, seconds) to 4-digit string and calculate cost
5. Also check the "seconds only" representation: minutes = 0, seconds = targetSeconds (if seconds ≤ 99)
6. Return the minimum cost found

Actually, we can be more efficient: We only need to check:

- The canonical representation: m = targetSeconds // 60, s = targetSeconds % 60
- The alternative representation: m = targetSeconds // 60 - 1, s = targetSeconds % 60 + 60 (if m ≥ 0 and s ≤ 99)
- The seconds-only representation: m = 0, s = targetSeconds (if s ≤ 99)
- But wait, what if targetSeconds // 60 > 99? Then we can't represent it at all!

Actually, the problem guarantees targetSeconds ≤ 99\*60 + 99 = 6039, so minutes will never exceed 99 in the canonical representation.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def minCostSetTime(startAt: int, moveCost: int, pushCost: int, targetSeconds: int) -> int:
    def cost_to_type(digits):
        """Calculate cost to type a sequence of digits."""
        total_cost = 0
        current_digit = startAt

        for digit in digits:
            if digit != current_digit:
                total_cost += moveCost
                current_digit = digit
            total_cost += pushCost

        return total_cost

    min_cost = float('inf')

    # Try all possible minute values from 0 to 99
    for minutes in range(100):
        seconds = targetSeconds - minutes * 60

        # Check if seconds is valid (0-99) and non-negative
        if 0 <= seconds <= 99:
            # Format as 4-digit string with leading zeros
            time_str = f"{minutes:02d}{seconds:02d}"

            # Convert to list of integers, removing leading zeros
            # But wait - we CAN'T remove leading zeros because the microwave
            # always interprets as 4 digits! Actually we need to include them.
            digits = [int(d) for d in time_str]

            # However, we CAN skip leading zeros in our button presses!
            # If the time is 01:30, we can press [1, 3, 0] not [0, 1, 3, 0]
            # So find first non-zero digit
            start_idx = 0
            while start_idx < len(digits) and digits[start_idx] == 0:
                start_idx += 1

            # If all digits are zero (00:00), we still need to press one zero
            if start_idx == len(digits):
                start_idx = len(digits) - 1

            actual_digits = digits[start_idx:]

            # Calculate cost for this representation
            current_cost = cost_to_type(actual_digits)
            min_cost = min(min_cost, current_cost)

    return min_cost
```

```javascript
// Time: O(1) | Space: O(1)
function minCostSetTime(startAt, moveCost, pushCost, targetSeconds) {
  // Helper function to calculate cost for a digit sequence
  const costToType = (digits) => {
    let totalCost = 0;
    let currentDigit = startAt;

    for (const digit of digits) {
      if (digit !== currentDigit) {
        totalCost += moveCost;
        currentDigit = digit;
      }
      totalCost += pushCost;
    }

    return totalCost;
  };

  let minCost = Infinity;

  // Try all possible minute values (0-99)
  for (let minutes = 0; minutes < 100; minutes++) {
    const seconds = targetSeconds - minutes * 60;

    // Check if seconds is valid (0-99)
    if (seconds >= 0 && seconds <= 99) {
      // Format as 4-digit string with leading zeros
      const timeStr = minutes.toString().padStart(2, "0") + seconds.toString().padStart(2, "0");

      // Convert to array of digits
      const digits = timeStr.split("").map(Number);

      // Skip leading zeros (we don't need to press them)
      let startIdx = 0;
      while (startIdx < digits.length && digits[startIdx] === 0) {
        startIdx++;
      }

      // If all digits are zero (00:00), press one zero
      if (startIdx === digits.length) {
        startIdx = digits.length - 1;
      }

      const actualDigits = digits.slice(startIdx);
      const currentCost = costToType(actualDigits);
      minCost = Math.min(minCost, currentCost);
    }
  }

  return minCost;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int minCostSetTime(int startAt, int moveCost, int pushCost, int targetSeconds) {
        int minCost = Integer.MAX_VALUE;

        // Try all possible minute values from 0 to 99
        for (int minutes = 0; minutes < 100; minutes++) {
            int seconds = targetSeconds - minutes * 60;

            // Check if seconds is valid (0-99) and non-negative
            if (seconds >= 0 && seconds <= 99) {
                // Format as 4-digit string with leading zeros
                String timeStr = String.format("%02d%02d", minutes, seconds);

                // Convert to digit array
                int[] digits = new int[4];
                for (int i = 0; i < 4; i++) {
                    digits[i] = timeStr.charAt(i) - '0';
                }

                // Skip leading zeros
                int startIdx = 0;
                while (startIdx < 4 && digits[startIdx] == 0) {
                    startIdx++;
                }

                // If all digits are zero (00:00), press one zero
                if (startIdx == 4) {
                    startIdx = 3;
                }

                // Calculate cost for this digit sequence
                int currentCost = 0;
                int currentDigit = startAt;

                for (int i = startIdx; i < 4; i++) {
                    if (digits[i] != currentDigit) {
                        currentCost += moveCost;
                        currentDigit = digits[i];
                    }
                    currentCost += pushCost;
                }

                minCost = Math.min(minCost, currentCost);
            }
        }

        return minCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We iterate through at most 100 minute values (0 to 99)
- For each minute value, we do O(1) work to check validity and calculate cost
- The number of iterations is constant regardless of input size

**Space Complexity: O(1)**

- We use only a constant amount of extra space
- The digit array has fixed size 4
- No data structures that grow with input size

## Common Mistakes

1. **Not handling leading zeros correctly**: The microwave always interprets input as 4 digits, but we don't need to physically press leading zeros. Candidates often either include them (overcounting cost) or remove them incorrectly.

2. **Missing valid representations**: Only checking the canonical (minutes, seconds) representation and forgetting about cases like 90 seconds instead of 1:30. The seconds can be up to 99, not 59!

3. **Incorrect cost calculation when staying on same digit**: Forgetting that if the next digit is the same as current, we only pay pushCost, not moveCost + pushCost.

4. **Not handling the 00:00 case**: When all digits are zero, we still need to press at least one zero. Some implementations skip all zeros and end up with empty sequence.

## When You'll See This Pattern

This problem combines **enumeration of valid states** with **cost optimization**. Similar patterns appear in:

1. **Minimum Time Difference (LeetCode 539)**: Convert times to minutes, sort, find minimum difference. Like here, you're working with time representations and finding optimal configurations.

2. **Minimum Number of Operations to Convert Time (LeetCode 2224)**: Calculating minimum operations to convert between time representations with specific allowed operations.

3. **Integer to English Words (LeetCode 273)**: Breaking down a number into valid components (like minutes and seconds here) and handling edge cases for different ranges.

The core pattern is: when a problem has multiple valid representations of the same thing, and you need to find the optimal one according to some cost function, enumerate all valid representations and calculate costs.

## Key Takeaways

1. **Always consider alternative representations**: Just because there's a "standard" way to represent something (like MM:SS for time) doesn't mean it's the only valid way. Look for constraints that allow multiple interpretations.

2. **Brute force can be efficient if search space is small**: When the input constraints limit possibilities (like minutes 0-99), a simple enumeration is often the cleanest solution.

3. **Pay attention to what the machine interprets vs. what you press**: The microwave interprets 4 digits, but you don't need to press leading zeros. This distinction between logical representation and physical action is common in optimization problems.

Related problems: [Minimum Time Difference](/problem/minimum-time-difference)
