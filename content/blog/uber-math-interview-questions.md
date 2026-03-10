---
title: "Math Questions at Uber: What to Expect"
description: "Prepare for Math interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-05-26"
category: "dsa-patterns"
tags: ["uber", "math", "interview prep"]
---

When you think of Uber, you probably think of routing, maps, and massive scale—so why do they ask math questions? The answer is in the business model. Uber's core operations—dynamic pricing (surge), ETA prediction, driver-rider matching, and fraud detection—are fundamentally built on probabilistic models, statistical analysis, and combinatorial optimization. A slight edge in algorithm efficiency or a more accurate model translates directly to millions in revenue and a better user experience. Therefore, while not as voluminous as graph or array questions, **math problems appear in nearly 1 in 10 Uber interview questions** (39 out of 381 on our platform), and they are often high-signal questions used to differentiate senior candidates. They test your ability to translate a real-world, often ambiguous, operational problem into clean logic and efficient code.

## Specific Patterns Uber Favors

Uber's math questions rarely involve advanced calculus. Instead, they focus on **computational number theory, probability, and simple combinatorics** applied to practical constraints. You can expect two main flavors:

1.  **Modular Arithmetic and Cycle Detection:** Problems involving repeated operations, finding patterns in sequences, or simulating processes that wrap around (like a circular route or a repeating schedule). These test your ability to avoid naive simulation with `O(n)` time and instead find the mathematical shortcut.
2.  **Combinatorial Probability & Expectation:** Questions like "What's the probability a driver accepts a request?" or "How many unique trips can be generated?" These assess your comfort with counting principles and expected value, which underpin A/B testing and system reliability metrics.

A classic example is **LeetCode 957. Prison Cells After N Days**. It's a perfect Uber-style problem: a simulation with a fixed number of states that must be run for a very large `N`. Brute-force simulation fails. The efficient solution requires recognizing the state repeats in a cycle and using modular arithmetic to jump directly to the final state.

<div class="code-group">

```python
def prisonAfterNDays(cells, n):
    """
    Simulates prison cell state after N days.
    Key insight: There are only 2^6 = 64 possible states for the 6 inner cells.
    The sequence will repeat in a cycle. Find the cycle length and skip ahead.
    Time: O(K * min(N, 2^K)) where K is number of cells, but effectively O(1) due to fixed cycle length.
    Space: O(2^K) for the seen dictionary.
    """
    seen = {}
    while n > 0:
        state_key = tuple(cells)
        if state_key in seen:
            # Cycle detected. We can skip all full cycles.
            cycle_length = seen[state_key] - n
            n %= cycle_length
            if n == 0:
                break
        else:
            seen[state_key] = n

        # Only simulate one day if we haven't finished
        if n > 0:
            n -= 1
            next_day = [0] * 8
            for i in range(1, 7):
                next_day[i] = 1 if cells[i-1] == cells[i+1] else 0
            cells = next_day
    return cells
```

```javascript
function prisonAfterNDays(cells, n) {
  // Time: O(1) due to fixed cycle length | Space: O(1) due to limited states
  const seen = new Map();
  while (n > 0) {
    const stateKey = cells.join("");
    if (seen.has(stateKey)) {
      const cycleLength = seen.get(stateKey) - n;
      n %= cycleLength;
      if (n === 0) break;
    } else {
      seen.set(stateKey, n);
    }
    if (n > 0) {
      n--;
      const nextDay = new Array(8).fill(0);
      for (let i = 1; i < 7; i++) {
        nextDay[i] = cells[i - 1] === cells[i + 1] ? 1 : 0;
      }
      cells = nextDay;
    }
  }
  return cells;
}
```

```java
public int[] prisonAfterNDays(int[] cells, int n) {
    // Time: O(1) | Space: O(1)
    Map<String, Integer> seen = new HashMap<>();
    boolean cycleFound = false;

    while (n > 0) {
        if (!cycleFound) {
            String stateKey = Arrays.toString(cells);
            if (seen.containsKey(stateKey)) {
                int cycleLength = seen.get(stateKey) - n;
                n %= cycleLength;
                cycleFound = true;
            } else {
                seen.put(stateKey, n);
            }
        }
        if (n > 0) {
            n--;
            int[] nextDay = new int[8];
            for (int i = 1; i < 7; i++) {
                nextDay[i] = (cells[i - 1] == cells[i + 1]) ? 1 : 0;
            }
            cells = nextDay;
        }
    }
    return cells;
}
```

</div>

Another frequent pattern is **computing greatest common divisor (GCD) or using the modulo operator** to solve problems about equal distribution, batch sizing, or determining if a task can be completed in cycles. Problems like **LeetCode 365. Water and Jug Problem** boil down to checking if a target is reachable using the GCD of the jug capacities (Bézout's identity).

## How to Prepare

Your study should mirror the patterns above. Don't dive into advanced statistics. Focus on:

1.  **Master the modulo operator and cycle detection.** For any simulation problem, ask: "What is the state space? Is it bounded? Can the state repeat?" If yes, you likely need a hash map to detect the cycle and use `n % cycleLength`.
2.  **Know basic number theory cold:** Euclidean algorithm for GCD (`gcd(a, b) = gcd(b, a % b)`), prime checking up to sqrt(n), and understanding of multiples and divisors.
3.  **Practice translating word problems into probability equations.** Break them down into independent events, sequences of events, or use linearity of expectation. Draw small cases.

Here is the GCD pattern, which is a utility function you should be able to write instantly:

<div class="code-group">

```python
def gcd(a, b):
    """Euclidean algorithm for Greatest Common Divisor."""
    while b:
        a, b = b, a % b
    return a
# Example: Solve if target capacity is achievable with two jugs (Water and Jug Problem)
def can_measure_water(jug1, jug2, target):
    if target > jug1 + jug2:
        return False
    return target % gcd(jug1, jug2) == 0
# Time: O(log(min(a, b))) for GCD | Space: O(1)
```

```javascript
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
function canMeasureWater(jug1, jug2, target) {
  if (target > jug1 + jug2) return false;
  return target % gcd(jug1, jug2) === 0;
}
// Time: O(log(min(a, b))) | Space: O(1)
```

```java
public int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
public boolean canMeasureWater(int jug1, jug2, int target) {
    if (target > jug1 + jug2) return false;
    return target % gcd(jug1, jug2) == 0;
}
// Time: O(log(min(a, b))) | Space: O(1)
```

</div>

## How Uber Tests Math vs Other Companies

Compared to other companies, Uber's math questions are more **applied and less purely algorithmic**.

- **vs. Google:** Google might ask a "pure" math puzzle or a complex probability brainteaser (e.g., "How many golf balls fit in a school bus?"). Uber's questions are almost always tied to a **platform operation**—simulating ride states, calculating fares, or optimizing resource matching.
- **vs. Facebook/Meta:** Facebook also asks probability, but often in the context of system design or A/B testing metrics. Uber leans more towards **deterministic simulation problems** (like the prison cells) that have a clear coding implementation.
- **vs. Finance Firms (HFT):** Quantitative finance interviews are _all_ advanced probability and statistics. Uber's bar is lower; they want to see you can handle the math that comes up in engineering, not that you are a mathematician.

The unique aspect is the **"Uber twist"**—the problem statement will often be framed around drivers, trips, surge pricing, or locations. Your job is to see through the framing to the underlying number theory or probability pattern.

## Study Order

Tackle the topics in this order to build a logical foundation:

1.  **Basic Number Properties & Modulo Arithmetic:** Start here because it's the most frequent pattern. Understand even/odd, divisibility, and the modulo operator's behavior. This is the foundation for cycle detection.
2.  **Greatest Common Divisor (GCD) & Least Common Multiple (LCM):** Learn the Euclidean algorithm and its applications. Many "distribution" or "measurement" problems are GCD problems in disguise.
3.  **Simulation with Cycle Detection:** Now combine topic 1 with simulation. Practice identifying the bounded state and implementing the hash map cycle-skip.
4.  **Basic Combinatorics (Permutations & Combinations):** Learn the formulas for `nPr` and `nCr` and when to use them. Focus on problems where you count the number of ways to arrange or select items under constraints.
5.  **Discrete Probability & Expected Value:** Start with simple independent events (coin flips, dice rolls), then move to linearity of expectation. This is the most advanced topic Uber typically asks.

## Recommended Practice Order

Solve these problems in sequence. Each introduces a key concept needed for the next.

1.  **LeetCode 258. Add Digits** - A gentle intro to digital root and modulo operations.
2.  **LeetCode 367. Valid Perfect Square** - Applies binary search in a numerical context.
3.  **LeetCode 365. Water and Jug Problem** - The canonical GCD application problem.
4.  **LeetCode 672. Bulb Switcher II** - A more complex state simulation with limited operations. Good for reasoning about state space.
5.  **LeetCode 957. Prison Cells After N Days** - The quintessential Uber cycle detection problem. Master this.
6.  **LeetCode 688. Knight Probability in Chessboard** - A classic probability + dynamic programming problem. It models a process (like a driver moving) over multiple steps.
7.  **LeetCode 470. Implement Rand10() Using Rand7()** - Tests understanding of uniform distribution and rejection sampling, relevant to random assignment or sampling in systems.

By following this focused approach, you'll be prepared for the specific flavor of mathematical thinking Uber interviewers are evaluating: the ability to find efficient, logical solutions to the numerical problems inherent in running a global, real-time marketplace.

[Practice Math at Uber](/company/uber/math)
