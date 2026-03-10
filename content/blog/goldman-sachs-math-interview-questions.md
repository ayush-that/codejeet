---
title: "Math Questions at Goldman Sachs: What to Expect"
description: "Prepare for Math interview questions at Goldman Sachs — patterns, difficulty breakdown, and study tips."
date: "2027-07-25"
category: "dsa-patterns"
tags: ["goldman-sachs", "math", "interview prep"]
---

If you're preparing for Goldman Sachs interviews, you've likely seen the statistic: 39 of their 270 tagged LeetCode problems are categorized under "Math." That's about 14%, a significant chunk that can't be ignored. But here's the insider perspective you won't get from a spreadsheet: at Goldman, math isn't about abstract number theory. It's **applied, financial, and logic-based**. They use these questions as a direct proxy for quantitative reasoning and precision—skills critical for modeling, risk analysis, and algorithmic trading. You will absolutely face math problems, often in the first or second technical screen. They are not a "nice to have"; they are a core filter.

## Specific Patterns Goldman Sachs Favors

Goldman's math problems cluster around a few predictable, high-value themes. You won't see many advanced calculus proofs. Instead, expect:

1.  **Modular Arithmetic and Number Properties:** This is their bread and butter. Problems involving remainders, divisibility, and cycling sequences are common because they model periodicity in financial data (e.g., repeating settlement cycles, interest accruals). Think "find the *n*th digit in an infinite sequence" or "simulate a circular game."
2.  **Simulation and Iterative Computation:** They love problems where you must carefully simulate a process step-by-step. This tests your ability to translate a business rule (like a trading rule or a clearing mechanism) into bug-free code. Precision and handling edge cases are paramount.
3.  **Basic Combinatorics and Probability:** Usually limited to straightforward counting (permutations, combinations) or expected value calculations. The focus is on logical breakdown, not memorizing formulas.
4.  **Numerical String Manipulation:** Problems where numbers are treated as strings of digits to be manipulated, often related to large number arithmetic (since numbers can exceed standard integer limits).

A classic example is **LeetCode #258: Add Digits** (a modular arithmetic problem disguised as a simple loop). Another is **LeetCode #453: Minimum Moves to Equal Array Elements**, which is really a clever math insight about relative differences. For simulation, **LeetCode #650: 2 Keys Keyboard** is a great representative.

## How to Prepare

Your study should focus on pattern recognition and deriving formulas over brute force. Let's look at the most critical pattern: **Modular Arithmetic for Cycling Problems**.

Many Goldman problems boil down to this: You have a sequence or a state that repeats every `k` steps. Finding the state at a huge `n` (like `n = 10^9`) requires avoiding simulation and using `n % k`. Here's the template:

<div class="code-group">

```python
# Pattern: Using modulo to find position in a cycle
# Problem Type: "Find the state after n steps in a repeating cycle"
# Example: LeetCode #957. Prison Cells After N Days

def find_state_after_cycles(initial_state, n, cycle_length):
    """
    Simulates until a cycle is detected, then uses modulo to jump to the final state.
    """
    seen = {}
    current = initial_state
    step = 0

    while step < n:
        if current in seen:
            # Cycle detected! We can skip ahead.
            cycle_start = seen[current]
            cycle_len = step - cycle_start
            remaining = (n - step) % cycle_len
            # Now just simulate the remaining steps
            for _ in range(remaining):
                current = get_next_state(current)
            return current
        else:
            seen[current] = step
            current = get_next_state(current)
            step += 1

    return current

# Helper function (problem-specific)
def get_next_state(state):
    # Example transformation
    pass

# Time: O(cycle_length) - We simulate at most one full cycle.
# Space: O(cycle_length) - For storing the `seen` dictionary.
```

```javascript
// Pattern: Using modulo to find position in a cycle
// Problem Type: "Find the state after n steps in a repeating cycle"
// Example: LeetCode #957. Prison Cells After N Days

function findStateAfterCycles(initialState, n, getNextStateFn) {
  let seen = new Map();
  let current = initialState;
  let step = 0;

  while (step < n) {
    if (seen.has(current)) {
      // Cycle detected
      let cycleStart = seen.get(current);
      let cycleLen = step - cycleStart;
      let remaining = (n - step) % cycleLen;
      for (let i = 0; i < remaining; i++) {
        current = getNextStateFn(current);
      }
      return current;
    } else {
      seen.set(current, step);
      current = getNextStateFn(current);
      step++;
    }
  }
  return current;
}

// Time: O(cycle_length) - We simulate at most one full cycle.
// Space: O(cycle_length) - For storing the `seen` map.
```

```java
// Pattern: Using modulo to find position in a cycle
// Problem Type: "Find the state after n steps in a repeating cycle"
// Example: LeetCode #957. Prison Cells After N Days

import java.util.HashMap;
import java.util.Map;

public class CycleDetection {
    public State findStateAfterCycles(State initialState, int n) {
        Map<State, Integer> seen = new HashMap<>();
        State current = initialState;
        int step = 0;

        while (step < n) {
            if (seen.containsKey(current)) {
                // Cycle detected
                int cycleStart = seen.get(current);
                int cycleLen = step - cycleStart;
                int remaining = (n - step) % cycleLen;
                for (int i = 0; i < remaining; i++) {
                    current = getNextState(current);
                }
                return current;
            } else {
                seen.put(current, step);
                current = getNextState(current);
                step++;
            }
        }
        return current;
    }

    private State getNextState(State s) {
        // Problem-specific transformation
        return s;
    }
}

// Time: O(cycle_length) - We simulate at most one full cycle.
// Space: O(cycle_length) - For storing the `seen` map.
```

</div>

The second key pattern is **Simulation with Early Stop Conditions**. Goldman problems often have constraints where direct simulation would be too slow (`n` is huge), but you can derive a mathematical shortcut. Your job is to find that shortcut.

<div class="code-group">

```python
# Pattern: Simulation with a derived formula
# Problem Type: "Minimum steps to reach a condition"
# Example: LeetCode #650. 2 Keys Keyboard

def minSteps(n):
    """
    Problem: Start with 'A', you can either Copy All or Paste.
    Find min operations to get exactly n 'A's.
    Insight: For any final length n, if n % k == 0, the optimal way is to
    reach k (which is n//i) and then paste it (n//k - 1) times.
    This reduces to finding the sum of prime factors.
    """
    ans = 0
    d = 2
    while n > 1:
        while n % d == 0:
            ans += d
            n //= d
        d += 1
    return ans

# Time: O(sqrt(n)) - In the worst case, we iterate up to sqrt(n).
# Space: O(1)
```

```javascript
// Pattern: Simulation with a derived formula
// Problem Type: "Minimum steps to reach a condition"
// Example: LeetCode #650. 2 Keys Keyboard

function minSteps(n) {
  let ans = 0;
  let d = 2;
  while (n > 1) {
    while (n % d === 0) {
      ans += d;
      n = Math.floor(n / d);
    }
    d++;
  }
  return ans;
}

// Time: O(sqrt(n)) - In the worst case, we iterate up to sqrt(n).
// Space: O(1)
```

```java
// Pattern: Simulation with a derived formula
// Problem Type: "Minimum steps to reach a condition"
// Example: LeetCode #650. 2 Keys Keyboard

public class MinSteps {
    public int minSteps(int n) {
        int ans = 0;
        int d = 2;
        while (n > 1) {
            while (n % d == 0) {
                ans += d;
                n /= d;
            }
            d++;
        }
        return ans;
    }
}

// Time: O(sqrt(n)) - In the worst case, we iterate up to sqrt(n).
// Space: O(1)
```

</div>

## How Goldman Sachs Tests Math vs Other Companies

At FAANG companies (like Google or Meta), math problems often test pure algorithmic cleverness or are intertwined with complex data structures. At Goldman, the math feels more **grounded**. The problems frequently resemble simplified versions of quantitative finance puzzles. The difficulty is not in advanced algorithms but in:

- **Absolute correctness:** Off-by-one errors or missing a modulo operation will fail you.
- **Handling extreme constraints:** They give you `n = 10^9` to force you away from simulation and towards a formula.
- **Clear, stepwise logic:** Interviewers want to follow your derivation. Mumbling "I saw this pattern on LeetCode" is less valuable than walking through how you'd discover the pattern: "Notice that after each day, the pattern depends only on the neighbors... which means the state space is limited to 2^8 possibilities, so it must cycle quickly."

The unique aspect is the **financial context**. While the LeetCode problem might be about prisoners (`LeetCode #957`), in the interview, they might frame it as "calculating the state of a daily risk flag across a network of 8 counterparties after N days." The underlying math is identical.

## Study Order

Tackle these sub-topics in this order to build a logical foundation:

1.  **Basic Number Manipulation:** (Prime checks, digit extraction, palindromes). This warms up your numerical logic. Problems: `#7 Reverse Integer`, `#9 Palindrome Number`.
2.  **Modular Arithmetic Fundamentals:** Understand modulo, divisibility, and cycling. Problems: `#258 Add Digits`, `#1018 Binary Prefix Divisible By 5`.
3.  **Simulation with Cycle Detection:** Learn to identify when a process must repeat and how to skip ahead. This is the single most important pattern. Problem: `#957 Prison Cells After N Days`.
4.  **Combinatorics (Basic):** Focus on counting principles and simple permutations. Problem: `#62 Unique Paths` (which is a basic combinations problem).
5.  **Numerical String Manipulation:** Practice adding/multiplying numbers-as-strings. Problem: `#43 Multiply Strings`.
6.  **Optimized Simulation (Math Insight):** Problems where brute force is too slow, forcing you to find a closed-form solution or a greedy insight. Problem: `#453 Minimum Moves to Equal Array Elements`, `#650 2 Keys Keyboard`.

This order works because it starts with mechanics, introduces the core Goldman pattern (cycle detection), and then builds up to problems that require deeper, finance-relevant insights.

## Recommended Practice Order

Solve these specific problems in sequence. Each builds on the previous pattern.

1.  **LeetCode #258. Add Digits** - The "Aha!" moment for modulo.
2.  **LeetCode #1018. Binary Prefix Divisible By 5** - Applying modulo in a streaming context.
3.  **LeetCode #957. Prison Cells After N Days** - Master this. It's the blueprint for cycle detection.
4.  **LeetCode #670. Maximum Swap** - Numerical string manipulation with greedy choice.
5.  **LeetCode #453. Minimum Moves to Equal Array Elements** - Shifting perspective from absolute to relative differences.
6.  **LeetCode #650. 2 Keys Keyboard** - From simulation to prime factorization.
7.  **LeetCode #43. Multiply Strings** - Handling large-number arithmetic precisely.
8.  **LeetCode #829. Consecutive Numbers Sum** - A harder number theory problem that tests your ability to derive a formula from an equation.

Remember, at Goldman Sachs, the goal isn't to be a mathematician. It's to be an engineer who can translate a quantitative process into efficient, correct code. Your practice should reflect that: derive, don't memorize; simulate only until you see the pattern, then calculate.

[Practice Math at Goldman Sachs](/company/goldman-sachs/math)
