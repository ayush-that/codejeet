---
title: "How to Solve Rotated Digits — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rotated Digits. Medium difficulty, 56.8% acceptance rate. Topics: Math, Dynamic Programming."
date: "2026-12-29"
category: "dsa-patterns"
tags: ["rotated-digits", "math", "dynamic-programming", "medium"]
---

# How to Solve Rotated Digits

This problem asks us to count "good" numbers from 1 to N, where a number is "good" if when you rotate each digit 180 degrees, you get a different valid number. The tricky part is that only certain digits rotate to valid digits (0,1,8 rotate to themselves; 2,5,6,9 rotate to different digits; 3,4,7 become invalid), and we need to check every number in the range efficiently.

## Visual Walkthrough

Let's trace through N = 20 to build intuition:

**Step 1: Understanding digit rotations**

- Digits that rotate to themselves: 0→0, 1→1, 8→8
- Digits that rotate to different valid digits: 2→5, 5→2, 6→9, 9→6
- Digits that become invalid: 3→, 4→, 7→

**Step 2: Checking numbers 1-20**

- 1: Rotates to 1 (same) → not good
- 2: Rotates to 5 (different) → good ✓
- 3: Contains invalid digit 3 → not good
- 4: Contains invalid digit 4 → not good
- 5: Rotates to 2 (different) → good ✓
- 6: Rotates to 9 (different) → good ✓
- 7: Contains invalid digit 7 → not good
- 8: Rotates to 8 (same) → not good
- 9: Rotates to 6 (different) → good ✓
- 10: Contains 1→1 and 0→0 (all same) → not good
- 11: All digits same → not good
- 12: 1→1 (same), 2→5 (different) → contains different → good ✓
- 13: Contains invalid digit 3 → not good
- 14: Contains invalid digit 4 → not good
- 15: 1→1 (same), 5→2 (different) → contains different → good ✓
- 16: 1→1 (same), 6→9 (different) → contains different → good ✓
- 17: Contains invalid digit 7 → not good
- 18: 1→1 (same), 8→8 (same) → all same → not good
- 19: 1→1 (same), 9→6 (different) → contains different → good ✓
- 20: 2→5 (different), 0→0 (same) → contains different → good ✓

**Result:** Good numbers are 2,5,6,9,12,15,16,19,20 → 9 good numbers

## Brute Force Approach

The most straightforward approach is to check every number from 1 to N individually. For each number:

1. Convert it to a string to examine each digit
2. Check if any digit is invalid (3,4,7) → if yes, skip
3. Check if rotating all digits produces a different number (at least one digit changes from 2,5,6,9)

This brute force solution is O(N × D) where D is the average number of digits. For N up to 10,000, this is acceptable, but for larger N (up to 10,000 in constraints), we can do better.

<div class="code-group">

```python
# Time: O(N × D) where D is average digits | Space: O(D)
def rotatedDigits_brute(N):
    count = 0
    # Define which digits are valid and which rotate to different digits
    same = {'0', '1', '8'}
    diff = {'2', '5', '6', '9'}

    for num in range(1, N + 1):
        num_str = str(num)
        valid = True
        has_diff = False

        for digit in num_str:
            if digit in same:
                # Digit rotates to itself, continue checking
                continue
            elif digit in diff:
                # Digit rotates to a different digit
                has_diff = True
            else:
                # Invalid digit (3,4,7) found
                valid = False
                break

        if valid and has_diff:
            count += 1

    return count
```

```javascript
// Time: O(N × D) where D is average digits | Space: O(D)
function rotatedDigitsBrute(N) {
  let count = 0;
  // Define which digits are valid and which rotate to different digits
  const same = new Set(["0", "1", "8"]);
  const diff = new Set(["2", "5", "6", "9"]);

  for (let num = 1; num <= N; num++) {
    const numStr = num.toString();
    let valid = true;
    let hasDiff = false;

    for (let digit of numStr) {
      if (same.has(digit)) {
        // Digit rotates to itself, continue checking
        continue;
      } else if (diff.has(digit)) {
        // Digit rotates to a different digit
        hasDiff = true;
      } else {
        // Invalid digit (3,4,7) found
        valid = false;
        break;
      }
    }

    if (valid && hasDiff) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(N × D) where D is average digits | Space: O(D)
public int rotatedDigitsBrute(int N) {
    int count = 0;
    // Define which digits are valid and which rotate to different digits
    Set<Character> same = new HashSet<>(Arrays.asList('0', '1', '8'));
    Set<Character> diff = new HashSet<>(Arrays.asList('2', '5', '6', '9'));

    for (int num = 1; num <= N; num++) {
        String numStr = Integer.toString(num);
        boolean valid = true;
        boolean hasDiff = false;

        for (char digit : numStr.toCharArray()) {
            if (same.contains(digit)) {
                // Digit rotates to itself, continue checking
                continue;
            } else if (diff.contains(digit)) {
                // Digit rotates to a different digit
                hasDiff = true;
            } else {
                // Invalid digit (3,4,7) found
                valid = false;
                break;
            }
        }

        if (valid && hasDiff) {
            count++;
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we can use **dynamic programming** or **digit DP** to count valid numbers without checking each one individually. We can think of this as counting numbers with certain digit constraints:

1. The number must contain only digits from {0,1,2,5,6,8,9}
2. The number must contain at least one digit from {2,5,6,9}

We can solve this using a state machine approach with memoization:

- State 0: No digits processed yet (or all digits so far are from {0,1,8})
- State 1: At least one digit from {2,5,6,9} encountered
- State 2: Invalid digit encountered (3,4,7)

We process digits from most significant to least significant, keeping track of whether we're still constructing a number less than or equal to N.

## Optimal Solution

Here's the digit DP solution that runs in O(log N) time:

<div class="code-group">

```python
# Time: O(log N) | Space: O(log N) for memoization
def rotatedDigits(N):
    # Convert N to string for digit-by-digit processing
    s = str(N)
    n = len(s)

    # Memoization cache: dp[index][state][tight]
    # index: current digit position (0 to n)
    # state: 0 = no diff digit yet, 1 = has diff digit, 2 = invalid
    # tight: 1 = current prefix equals N's prefix, 0 = prefix already smaller
    memo = [[[-1] * 2 for _ in range(3)] for _ in range(n + 1)]

    # Define digit sets
    same = set('018')
    diff = set('2569')
    invalid = set('347')

    def dfs(index, state, tight):
        """
        Count valid numbers from position 'index' to the end.

        Args:
            index: Current digit position (0-indexed)
            state: 0 = no rotating digit yet, 1 = has rotating digit, 2 = invalid
            tight: Whether current prefix equals N's prefix (limits digit choices)
        """
        # Base case: processed all digits
        if index == n:
            return 1 if state == 1 else 0  # Only count if has rotating digit

        # Check memoization
        if memo[index][state][tight] != -1:
            return memo[index][state][tight]

        count = 0
        # Determine the maximum digit we can choose at this position
        max_digit = int(s[index]) if tight else 9

        for digit in range(0, max_digit + 1):
            digit_char = str(digit)
            new_tight = tight and (digit == max_digit)
            new_state = state

            # Update state based on current digit
            if state != 2:  # Not already invalid
                if digit_char in invalid:
                    new_state = 2  # Mark as invalid
                elif digit_char in diff:
                    new_state = 1  # Has rotating digit
                elif digit_char in same and state == 0:
                    new_state = 0  # Still no rotating digit
                # If state was already 1, keep it as 1

            # Recurse to next digit
            count += dfs(index + 1, new_state, new_tight)

        memo[index][state][tight] = count
        return count

    # Start DFS from first digit, no rotating digit yet, in tight mode
    return dfs(0, 0, 1)
```

```javascript
// Time: O(log N) | Space: O(log N) for memoization
function rotatedDigits(N) {
  // Convert N to string for digit-by-digit processing
  const s = N.toString();
  const n = s.length;

  // Memoization cache: dp[index][state][tight]
  // index: current digit position (0 to n)
  // state: 0 = no diff digit yet, 1 = has diff digit, 2 = invalid
  // tight: 1 = current prefix equals N's prefix, 0 = prefix already smaller
  const memo = Array(n + 1)
    .fill()
    .map(() =>
      Array(3)
        .fill()
        .map(() => Array(2).fill(-1))
    );

  // Define digit sets
  const same = new Set(["0", "1", "8"]);
  const diff = new Set(["2", "5", "6", "9"]);
  const invalid = new Set(["3", "4", "7"]);

  function dfs(index, state, tight) {
    /**
     * Count valid numbers from position 'index' to the end.
     *
     * @param {number} index - Current digit position (0-indexed)
     * @param {number} state - 0 = no rotating digit yet, 1 = has rotating digit, 2 = invalid
     * @param {number} tight - Whether current prefix equals N's prefix (limits digit choices)
     */
    // Base case: processed all digits
    if (index === n) {
      return state === 1 ? 1 : 0; // Only count if has rotating digit
    }

    // Check memoization
    if (memo[index][state][tight] !== -1) {
      return memo[index][state][tight];
    }

    let count = 0;
    // Determine the maximum digit we can choose at this position
    const maxDigit = tight ? parseInt(s[index]) : 9;

    for (let digit = 0; digit <= maxDigit; digit++) {
      const digitChar = digit.toString();
      const newTight = tight && digit === maxDigit;
      let newState = state;

      // Update state based on current digit
      if (state !== 2) {
        // Not already invalid
        if (invalid.has(digitChar)) {
          newState = 2; // Mark as invalid
        } else if (diff.has(digitChar)) {
          newState = 1; // Has rotating digit
        } else if (same.has(digitChar) && state === 0) {
          newState = 0; // Still no rotating digit
        }
        // If state was already 1, keep it as 1
      }

      // Recurse to next digit
      count += dfs(index + 1, newState, newTight);
    }

    memo[index][state][tight] = count;
    return count;
  }

  // Start DFS from first digit, no rotating digit yet, in tight mode
  return dfs(0, 0, 1);
}
```

```java
// Time: O(log N) | Space: O(log N) for memoization
public int rotatedDigits(int N) {
    // Convert N to string for digit-by-digit processing
    String s = Integer.toString(N);
    int n = s.length();

    // Memoization cache: dp[index][state][tight]
    // index: current digit position (0 to n)
    // state: 0 = no diff digit yet, 1 = has diff digit, 2 = invalid
    // tight: 1 = current prefix equals N's prefix, 0 = prefix already smaller
    int[][][] memo = new int[n + 1][3][2];
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j < 3; j++) {
            Arrays.fill(memo[i][j], -1);
        }
    }

    // Define digit sets
    Set<Character> same = new HashSet<>(Arrays.asList('0', '1', '8'));
    Set<Character> diff = new HashSet<>(Arrays.asList('2', '5', '6', '9'));
    Set<Character> invalid = new HashSet<>(Arrays.asList('3', '4', '7'));

    return dfs(0, 0, 1, s, n, memo, same, diff, invalid);
}

private int dfs(int index, int state, int tight, String s, int n,
                int[][][] memo, Set<Character> same,
                Set<Character> diff, Set<Character> invalid) {
    /**
     * Count valid numbers from position 'index' to the end.
     *
     * @param index Current digit position (0-indexed)
     * @param state 0 = no rotating digit yet, 1 = has rotating digit, 2 = invalid
     * @param tight Whether current prefix equals N's prefix (limits digit choices)
     */
    // Base case: processed all digits
    if (index == n) {
        return state == 1 ? 1 : 0;  // Only count if has rotating digit
    }

    // Check memoization
    if (memo[index][state][tight] != -1) {
        return memo[index][state][tight];
    }

    int count = 0;
    // Determine the maximum digit we can choose at this position
    int maxDigit = tight == 1 ? s.charAt(index) - '0' : 9;

    for (int digit = 0; digit <= maxDigit; digit++) {
        char digitChar = (char)('0' + digit);
        int newTight = (tight == 1 && digit == maxDigit) ? 1 : 0;
        int newState = state;

        // Update state based on current digit
        if (state != 2) {  // Not already invalid
            if (invalid.contains(digitChar)) {
                newState = 2;  // Mark as invalid
            } else if (diff.contains(digitChar)) {
                newState = 1;  // Has rotating digit
            } else if (same.contains(digitChar) && state == 0) {
                newState = 0;  // Still no rotating digit
            }
            // If state was already 1, keep it as 1
        }

        // Recurse to next digit
        count += dfs(index + 1, newState, newTight, s, n, memo, same, diff, invalid);
    }

    memo[index][state][tight] = count;
    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log N × 3 × 2 × 10) = O(log N)

- We have log N digits (base 10)
- 3 possible states (no diff digit, has diff digit, invalid)
- 2 possible tight values (tight or not tight)
- At each state, we try up to 10 digits
- With memoization, each state is computed once

**Space Complexity:** O(log N)

- The memoization table has size O(log N × 3 × 2) = O(log N)
- The recursion depth is O(log N)

## Common Mistakes

1. **Forgetting that all digits must rotate**: Some candidates try to leave digits unchanged or only rotate some digits. Remember, every digit must be rotated 180 degrees.

2. **Missing the "different number" requirement**: A number like 888 is not good because all digits rotate to themselves, resulting in the same number. You must check that at least one digit changes.

3. **Incorrect digit mapping**: Confusing which digits map to which (e.g., thinking 6 rotates to 6 instead of 9). Remember: 2↔5, 6↔9, 0/1/8 stay the same, 3/4/7 become invalid.

4. **Off-by-one with range**: The problem counts from 1 to N inclusive, not 0 to N. Make sure your loop or DP includes N but starts at 1.

## When You'll See This Pattern

This digit DP pattern appears in many counting problems with digit constraints:

1. **Numbers At Most N With Digit D** (LeetCode 1067): Count numbers containing a specific digit.
2. **Non-negative Integers Without Consecutive Ones** (LeetCode 600): Count numbers without consecutive 1s in binary.
3. **Count Special Integers** (LeetCode 2376): Count numbers with all unique digits.

The pattern is: when you need to count numbers up to N with certain digit properties, and checking each number individually is too slow, use digit DP with memoization on (position, state, tight).

## Key Takeaways

1. **Digit DP is powerful for counting problems**: When you need to count numbers with digit constraints up to a large N, digit DP with memoization provides an efficient O(log N) solution.

2. **State design is crucial**: Think about what information you need to carry forward as you process digits. Here we needed to track: have we seen a rotating digit? Have we seen an invalid digit?

3. **Tight/loose boundary handling**: The "tight" parameter ensures we don't count numbers greater than N. When tight=1, we restrict digits to not exceed N's digit at that position.

[Practice this problem on CodeJeet](/problem/rotated-digits)
