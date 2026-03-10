---
title: "How to Solve Airplane Seat Assignment Probability — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Airplane Seat Assignment Probability. Medium difficulty, 67.2% acceptance rate. Topics: Math, Dynamic Programming, Brainteaser, Probability and Statistics."
date: "2028-05-24"
category: "dsa-patterns"
tags:
  ["airplane-seat-assignment-probability", "math", "dynamic-programming", "brainteaser", "medium"]
---

# How to Solve Airplane Seat Assignment Probability

This problem presents a probability puzzle disguised as a seat assignment scenario. The twist is that while the first passenger chooses randomly, subsequent passengers follow a specific rule: take their own seat if available, otherwise choose randomly from remaining seats. The question asks: what's the probability that the last passenger (passenger `n`) ends up in their assigned seat? What makes this problem interesting is that the answer is surprisingly simple and constant for all `n > 1`, despite the seemingly complex random process.

## Visual Walkthrough

Let's trace through a small example with `n = 4` passengers to build intuition:

**Passenger 1** (lost ticket): Chooses randomly from seats 1-4

- If they choose seat 1 (their own seat): Everyone else gets their assigned seat. Last passenger (4) gets seat 4. ✅
- If they choose seat 4: Passenger 4 will never get seat 4. Last passenger gets wrong seat. ❌
- If they choose seat 2: Passenger 2 finds seat 2 occupied, so they choose randomly from seats 1,3,4

Let's follow the "choose seat 2" branch:

- Passenger 2 chooses randomly from {1,3,4}
  - If they choose seat 1: Passengers 3 and 4 get their assigned seats (3 and 4). Last passenger gets seat 4. ✅
  - If they choose seat 3: Passenger 3 finds seat 3 occupied, chooses from {1,4}
    - If passenger 3 chooses seat 1: Passenger 4 gets seat 4. ✅
    - If passenger 3 chooses seat 4: Passenger 4 gets seat 1. ❌
  - If they choose seat 4: Passenger 4 finds seat 4 occupied, gets whatever's left. ❌

Notice a pattern: whenever someone chooses seat 1 or seat `n`, the chain ends. If seat 1 is chosen, everyone gets their seat. If seat `n` is chosen, the last passenger definitely doesn't get their seat. For any other seat `k` chosen, the problem reduces to the same problem with `n-k+1` passengers (passengers k through n).

## Brute Force Approach

A naive approach would be to simulate all possible random choices. For each passenger who needs to choose randomly, we'd branch into all possible seat choices, creating an exponential number of scenarios. We could use recursion to explore all possibilities:

<div class="code-group">

```python
# Brute force simulation (exponential time)
def brute_force(n):
    def simulate(available_seats, current_passenger):
        if current_passenger > n:
            return 1 if available_seats[0] == n else 0

        # If passenger's assigned seat is available
        if current_passenger in available_seats:
            # Take their own seat
            new_available = [s for s in available_seats if s != current_passenger]
            return simulate(new_available, current_passenger + 1)
        else:
            # Choose randomly from available seats
            total_prob = 0
            for seat in available_seats:
                new_available = [s for s in available_seats if s != seat]
                total_prob += (1/len(available_seats)) * simulate(new_available, current_passenger + 1)
            return total_prob

    # First passenger chooses randomly
    available_seats = list(range(1, n + 1))
    total_prob = 0
    for seat in available_seats:
        new_available = [s for s in available_seats if s != seat]
        total_prob += (1/n) * simulate(new_available, 2)
    return total_prob
```

```javascript
// Brute force simulation (exponential time)
function bruteForce(n) {
  function simulate(availableSeats, currentPassenger) {
    if (currentPassenger > n) {
      return availableSeats[0] === n ? 1 : 0;
    }

    // If passenger's assigned seat is available
    if (availableSeats.includes(currentPassenger)) {
      // Take their own seat
      const newAvailable = availableSeats.filter((s) => s !== currentPassenger);
      return simulate(newAvailable, currentPassenger + 1);
    } else {
      // Choose randomly from available seats
      let totalProb = 0;
      for (const seat of availableSeats) {
        const newAvailable = availableSeats.filter((s) => s !== seat);
        totalProb += (1 / availableSeats.length) * simulate(newAvailable, currentPassenger + 1);
      }
      return totalProb;
    }
  }

  // First passenger chooses randomly
  const availableSeats = Array.from({ length: n }, (_, i) => i + 1);
  let totalProb = 0;
  for (const seat of availableSeats) {
    const newAvailable = availableSeats.filter((s) => s !== seat);
    totalProb += (1 / n) * simulate(newAvailable, 2);
  }
  return totalProb;
}
```

```java
// Brute force simulation (exponential time)
public class BruteForceSolution {
    public static double bruteForce(int n) {
        List<Integer> availableSeats = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            availableSeats.add(i);
        }

        double totalProb = 0;
        // First passenger chooses randomly
        for (int seat : availableSeats) {
            List<Integer> newAvailable = new ArrayList<>(availableSeats);
            newAvailable.remove(Integer.valueOf(seat));
            totalProb += (1.0/n) * simulate(newAvailable, 2, n);
        }
        return totalProb;
    }

    private static double simulate(List<Integer> availableSeats, int currentPassenger, int n) {
        if (currentPassenger > n) {
            return availableSeats.get(0) == n ? 1.0 : 0.0;
        }

        // If passenger's assigned seat is available
        if (availableSeats.contains(currentPassenger)) {
            // Take their own seat
            List<Integer> newAvailable = new ArrayList<>(availableSeats);
            newAvailable.remove(Integer.valueOf(currentPassenger));
            return simulate(newAvailable, currentPassenger + 1, n);
        } else {
            // Choose randomly from available seats
            double totalProb = 0;
            for (int seat : availableSeats) {
                List<Integer> newAvailable = new ArrayList<>(availableSeats);
                newAvailable.remove(Integer.valueOf(seat));
                totalProb += (1.0/availableSeats.size()) * simulate(newAvailable, currentPassenger + 1, n);
            }
            return totalProb;
        }
    }
}
```

</div>

This brute force approach has exponential time complexity O(n!) in the worst case because each random choice creates multiple branches. For n=100, this is completely infeasible. We need a more mathematical insight.

## Optimized Approach

The key insight is recognizing the symmetry in the problem. Let `P(n)` be the probability that the last passenger (n) gets their own seat.

**Base cases:**

- `P(1) = 1` (only one passenger, they get their seat)
- `P(2) = 0.5` (first passenger either takes their own seat or passenger 2's seat)

**For n > 1:**
When passenger 1 chooses randomly:

1. Probability 1/n they choose seat 1 (their own): Then everyone gets their assigned seat, so last passenger gets seat n. Probability contribution: (1/n) \* 1
2. Probability 1/n they choose seat n: Then last passenger definitely doesn't get seat n. Probability contribution: (1/n) \* 0
3. Probability (n-2)/n they choose some seat k where 2 ≤ k ≤ n-1:
   - Passenger 2 through k-1 get their seats (since they're available)
   - Passenger k finds their seat taken, so they choose randomly from remaining seats
   - This creates a subproblem with passengers k through n, which is equivalent to the original problem with n-k+1 passengers
   - So the probability becomes P(n-k+1)

Thus: P(n) = (1/n)*1 + (1/n)*0 + (1/n)\*[P(n-1) + P(n-2) + ... + P(2)]

But notice the symmetry: P(2) = P(n) for all n > 1! Let's prove this:

Assume P(k) = 1/2 for all 1 < k < n. Then:
P(n) = 1/n + (1/n)_[P(n-1) + P(n-2) + ... + P(2)]
= 1/n + (1/n)_[(n-2)*(1/2)] (by induction hypothesis)
= 1/n + (n-2)/(2n)
= (2 + n - 2)/(2n)
= n/(2n)
= 1/2

So by induction, P(n) = 0.5 for all n > 1.

## Optimal Solution

The optimal solution is remarkably simple: return 1.0 if n == 1, otherwise return 0.5.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def nthPersonGetsNthSeat(n):
    """
    Returns the probability that the nth person gets the nth seat.

    The key insight is that for n > 1, the probability is always 0.5.
    This comes from symmetry and mathematical induction.

    Args:
        n: Number of passengers/seats

    Returns:
        Probability as a float
    """
    # Base case: only one passenger, they definitely get their seat
    if n == 1:
        return 1.0

    # For all n > 1, the probability is 0.5
    # This is because of the recursive structure and symmetry in the problem
    return 0.5
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Returns the probability that the nth person gets the nth seat.
 *
 * The key insight is that for n > 1, the probability is always 0.5.
 * This comes from symmetry and mathematical induction.
 *
 * @param {number} n - Number of passengers/seats
 * @return {number} Probability that last passenger gets their assigned seat
 */
function nthPersonGetsNthSeat(n) {
  // Base case: only one passenger, they definitely get their seat
  if (n === 1) {
    return 1.0;
  }

  // For all n > 1, the probability is 0.5
  // This is because of the recursive structure and symmetry in the problem
  return 0.5;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Returns the probability that the nth person gets the nth seat.
     *
     * The key insight is that for n > 1, the probability is always 0.5.
     * This comes from symmetry and mathematical induction.
     *
     * @param n Number of passengers/seats
     * @return Probability that last passenger gets their assigned seat
     */
    public double nthPersonGetsNthSeat(int n) {
        // Base case: only one passenger, they definitely get their seat
        if (n == 1) {
            return 1.0;
        }

        // For all n > 1, the probability is 0.5
        // This is because of the recursive structure and symmetry in the problem
        return 0.5;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We simply check if n == 1 and return either 1.0 or 0.5
- No loops or recursion needed in the optimal solution

**Space Complexity:** O(1)

- We only use a constant amount of extra space
- No data structures are created that scale with input size

## Common Mistakes

1. **Overcomplicating with simulation:** Many candidates try to simulate the process for large n, which is computationally infeasible. The simulation approach has exponential time complexity.

2. **Missing the base case:** Forgetting that n = 1 should return 1.0, not 0.5. Always check edge cases!

3. **Trying to derive complex probability formulas:** Some candidates attempt to derive P(n) through lengthy probability calculations without recognizing the simple pattern. The key is to work through small examples (n=2, n=3) to spot the pattern.

4. **Not explaining the reasoning:** In an interview, just stating "return 0.5 for n>1" without explanation would be insufficient. You need to walk through the logical reasoning:
   - First passenger choices: seat 1, seat n, or other seat
   - Show how choosing seat 1 guarantees success
   - Show how choosing seat n guarantees failure
   - Show how choosing other seats creates identical subproblems
   - Demonstrate the symmetry that leads to P(n) = 0.5

## When You'll See This Pattern

This problem teaches **recursive thinking with symmetry** and **mathematical induction** in probability problems. Similar patterns appear in:

1. **"Egg Drop" problems** - Where you need to find optimal strategies that have recursive structure with overlapping subproblems.

2. **"Coin Change" probability variants** - Problems where you calculate probabilities of reaching certain states, and the probability function has a recursive definition.

3. **"Random Pick with Weight" (LeetCode 528)** - While not identical, it involves probability calculations where the solution often has a simpler pattern than initially apparent.

4. **"Guess Number Higher or Lower" (LeetCode 374)** - Problems where the optimal strategy involves binary search, but analyzing the probability or expected value requires recursive thinking.

The core technique is recognizing when a problem has a self-similar structure (solving P(n) involves solving P(k) for smaller k) and then finding patterns or closed-form solutions through mathematical reasoning.

## Key Takeaways

1. **Look for symmetry and invariant properties** - Many probability puzzles have surprising symmetries that lead to simple answers. If a problem seems complex, check if there's an invariant or symmetric property you're missing.

2. **Start with small cases** - When faced with a probability sequence problem, compute P(1), P(2), P(3) manually. Patterns often emerge that suggest a general formula.

3. **Consider recursive definitions** - If a problem involves sequential decisions where each choice creates a similar subproblem, define the probability recursively first, then look for patterns or ways to simplify.

4. **Don't jump to simulation** - For probability problems with large n, simulation is usually not the answer. Look for mathematical insights first.

[Practice this problem on CodeJeet](/problem/airplane-seat-assignment-probability)
