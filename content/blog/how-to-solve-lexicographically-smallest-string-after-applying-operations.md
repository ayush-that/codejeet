---
title: "How to Solve Lexicographically Smallest String After Applying Operations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest String After Applying Operations. Medium difficulty, 79.4% acceptance rate. Topics: String, Depth-First Search, Breadth-First Search, Enumeration."
date: "2027-09-30"
category: "dsa-patterns"
tags:
  [
    "lexicographically-smallest-string-after-applying-operations",
    "string",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Lexicographically Smallest String After Applying Operations

This problem asks us to find the lexicographically smallest string possible by repeatedly applying two operations on a string of digits: adding `a` to all odd-indexed digits (with wrap-around from 9 back to 0), and rotating the string right by `b` positions. The challenge lies in the exponential search space—both operations can be applied any number of times in any order, creating countless possible strings. The key insight is recognizing that while the operations seem complex, the state space is actually limited and searchable.

## Visual Walkthrough

Let's trace through a concrete example: `s = "5525"`, `a = 9`, `b = 2`.

**Initial state:** "5525"

**Operation 1 (add to odd indices):** Add 9 to indices 1 and 3 (0-indexed):

- Index 1: '5' + 9 = 14 → wrap around: 14 - 10 = 4 → '4'
- Index 3: '5' + 9 = 14 → wrap around: 14 - 10 = 4 → '4'
  Result: "5424"

**Operation 2 (rotate right by b):** Rotate "5424" right by 2 positions:

- "5424" → "2454"

Now let's see how we might find the lexicographically smallest string systematically:

1. Start with "5525"
2. Apply rotation: "5525" rotated by 2 → "2555"
3. Apply addition to odd indices of "2555": indices 1 and 3 are '5' and '5'
   - '5' + 9 = 14 → '4'
     Result: "2454"
4. Compare all strings we've seen: "5525", "5424", "2555", "2454"
5. The smallest lexicographically is "2454"

But wait—we've only explored a few possibilities! We need to systematically explore all reachable states. Since we can apply operations repeatedly, we might:

- Rotate multiple times
- Add to odd indices multiple times
- Alternate operations in different orders

The crucial observation: rotating an even-length string by `b` positions creates a cycle. If we rotate enough times, we'll return to the original orientation. Similarly, adding `a` to odd indices repeatedly cycles digits through 0-9. This means the state space is finite and we can explore it completely.

## Brute Force Approach

A naive brute force would try to generate all possible strings by applying operations in all possible sequences. Since we can apply operations infinitely many times, we need to recognize when we're repeating states.

The brute force approach would:

1. Start with the initial string
2. Try applying either operation
3. Recursively explore all possibilities
4. Track visited states to avoid cycles
5. Keep track of the smallest string seen

However, without optimization, this could explore redundant paths excessively. The key is that both operations have limited cycles:

- Rotation cycles every `n/gcd(n, b)` applications (where n is string length)
- Addition to odd indices cycles every 10/gcd(10, a) applications for each digit

Even with cycle detection, an unoptimized search might still explore too many states inefficiently.

## Optimized Approach

The optimal approach uses BFS or DFS to systematically explore all reachable states while avoiding repeats. Here's the step-by-step reasoning:

1. **State representation:** Each state is simply a string. We'll track visited strings to avoid reprocessing.

2. **Operation 1 - Add to odd indices:**
   - For each odd index (1, 3, 5, ...), add `a` to the digit
   - Handle wrap-around: `(digit + a) % 10`
   - This creates a new string where only odd positions change

3. **Operation 2 - Rotate right by b:**
   - Rotate the entire string right by `b` positions
   - Equivalent to: `s[-b:] + s[:-b]` in Python
   - Since `b` can be larger than string length, use modulo: `b % n`

4. **Search strategy:** Use BFS or DFS to explore:
   - Start with initial string
   - For each state, generate two new states (one for each operation)
   - If a state hasn't been visited, add it to the queue/stack and visited set
   - Track the minimum string seen

5. **Why BFS/DFS works:** The operations are reversible (we can add `10-a` to undo addition, or rotate left by `b` to undo rotation), so all reachable states form a connected component. By exploring systematically, we'll visit all reachable states.

6. **Termination:** When no new states can be generated (visited set stops growing), we've explored all reachable states.

The time complexity is bounded by the number of unique reachable states, which is at most `n * 10^(n/2)` (n rotations times possible odd-digit combinations), but in practice much smaller due to operation constraints.

## Optimal Solution

Here's the complete solution using BFS:

<div class="code-group">

```python
# Time: O(n * 10^(n/2)) worst case, but much smaller in practice
# Space: O(n * 10^(n/2)) for the visited set
from collections import deque

def findLexSmallestString(s: str, a: int, b: int) -> str:
    n = len(s)
    visited = set()          # Track visited states to avoid cycles
    queue = deque([s])       # BFS queue
    visited.add(s)
    smallest = s             # Track the smallest string seen

    while queue:
        current = queue.popleft()

        # Update smallest if current is lexicographically smaller
        if current < smallest:
            smallest = current

        # Operation 1: Add a to all odd indices
        # Convert to list for mutability
        chars = list(current)
        for i in range(1, n, 2):  # Only odd indices: 1, 3, 5, ...
            # Add a and wrap around using modulo 10
            new_digit = (int(chars[i]) + a) % 10
            chars[i] = str(new_digit)
        new_str1 = ''.join(chars)

        # If this new state hasn't been visited, add to queue
        if new_str1 not in visited:
            visited.add(new_str1)
            queue.append(new_str1)

        # Operation 2: Rotate right by b positions
        # Rotate by b % n to handle cases where b > n
        rotate_amount = b % n
        if rotate_amount > 0:  # No need to rotate if amount is 0
            # Right rotation: last rotate_amount chars + rest of string
            new_str2 = current[-rotate_amount:] + current[:-rotate_amount]

            # If this new state hasn't been visited, add to queue
            if new_str2 not in visited:
                visited.add(new_str2)
                queue.append(new_str2)

    return smallest
```

```javascript
// Time: O(n * 10^(n/2)) worst case, but much smaller in practice
// Space: O(n * 10^(n/2)) for the visited set
function findLexSmallestString(s, a, b) {
  const n = s.length;
  const visited = new Set(); // Track visited states to avoid cycles
  const queue = [s]; // BFS queue (using array as queue)
  visited.add(s);
  let smallest = s; // Track the smallest string seen

  while (queue.length > 0) {
    const current = queue.shift();

    // Update smallest if current is lexicographically smaller
    if (current < smallest) {
      smallest = current;
    }

    // Operation 1: Add a to all odd indices
    const chars = current.split("");
    for (let i = 1; i < n; i += 2) {
      // Only odd indices: 1, 3, 5, ...
      // Add a and wrap around using modulo 10
      const newDigit = (parseInt(chars[i]) + a) % 10;
      chars[i] = newDigit.toString();
    }
    const newStr1 = chars.join("");

    // If this new state hasn't been visited, add to queue
    if (!visited.has(newStr1)) {
      visited.add(newStr1);
      queue.push(newStr1);
    }

    // Operation 2: Rotate right by b positions
    // Rotate by b % n to handle cases where b > n
    const rotateAmount = b % n;
    if (rotateAmount > 0) {
      // No need to rotate if amount is 0
      // Right rotation: last rotateAmount chars + rest of string
      const newStr2 = current.slice(-rotateAmount) + current.slice(0, -rotateAmount);

      // If this new state hasn't been visited, add to queue
      if (!visited.has(newStr2)) {
        visited.add(newStr2);
        queue.push(newStr2);
      }
    }
  }

  return smallest;
}
```

```java
// Time: O(n * 10^(n/2)) worst case, but much smaller in practice
// Space: O(n * 10^(n/2)) for the visited set
import java.util.*;

class Solution {
    public String findLexSmallestString(String s, int a, int b) {
        int n = s.length();
        Set<String> visited = new HashSet<>();  // Track visited states
        Queue<String> queue = new LinkedList<>(); // BFS queue
        queue.offer(s);
        visited.add(s);
        String smallest = s;  // Track the smallest string seen

        while (!queue.isEmpty()) {
            String current = queue.poll();

            // Update smallest if current is lexicographically smaller
            if (current.compareTo(smallest) < 0) {
                smallest = current;
            }

            // Operation 1: Add a to all odd indices
            char[] chars = current.toCharArray();
            for (int i = 1; i < n; i += 2) {  // Only odd indices: 1, 3, 5, ...
                // Add a and wrap around using modulo 10
                int newDigit = (chars[i] - '0' + a) % 10;
                chars[i] = (char)('0' + newDigit);
            }
            String newStr1 = new String(chars);

            // If this new state hasn't been visited, add to queue
            if (!visited.contains(newStr1)) {
                visited.add(newStr1);
                queue.offer(newStr1);
            }

            // Operation 2: Rotate right by b positions
            // Rotate by b % n to handle cases where b > n
            int rotateAmount = b % n;
            if (rotateAmount > 0) {  // No need to rotate if amount is 0
                // Right rotation: last rotateAmount chars + rest of string
                String newStr2 = current.substring(n - rotateAmount) +
                                 current.substring(0, n - rotateAmount);

                // If this new state hasn't been visited, add to queue
                if (!visited.contains(newStr2)) {
                    visited.add(newStr2);
                    queue.offer(newStr2);
                }
            }
        }

        return smallest;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** In the worst case, we might visit all possible combinations of rotations and odd-digit values. There are `n` possible rotations (actually `n/gcd(n, b)` unique ones) and `10^(n/2)` possible combinations for odd indices (since only half the digits can change via addition). However, in practice:

- The addition operation only affects odd indices, and digits cycle every `10/gcd(10, a)` additions
- So the actual number of unique states is much smaller: `O(n * (10/gcd(10, a))^(n/2))`
- For typical constraints (n ≤ 100), this is manageable

**Space Complexity:** We store all visited strings in a set. In the worst case, this could be `O(n * 10^(n/2))`, but again the actual number is much smaller due to the cyclic nature of operations.

## Common Mistakes

1. **Forgetting to handle wrap-around correctly:** When adding `a` to a digit, some candidates forget the modulo operation or implement it incorrectly. Remember: digits wrap from 9 back to 0, not 10 back to 1.

2. **Incorrect rotation implementation:** Rotating right by `b` when `b > n` requires using `b % n`. Also, some candidates rotate left instead of right. Test with simple examples to verify.

3. **Not tracking visited states:** Without a visited set, BFS/DFS will run forever due to cycles in the operation graph. Always track visited states in search problems with reversible operations.

4. **Inefficient string comparison:** Comparing strings lexicographically is O(n), but since we're already doing O(n) work per state, this doesn't change the complexity. However, repeatedly converting between string and array representations can be optimized by working with character arrays.

## When You'll See This Pattern

This problem combines state space search with modular arithmetic—a pattern seen in several LeetCode problems:

1. **"Open the Lock" (Medium):** Similar BFS over digit strings with wrap-around operations. Instead of rotating and adding to indices, you increment/decrement digits at any position.

2. **"Sliding Puzzle" (Hard):** BFS over board states with sliding operations. The state space is defined by possible board configurations, similar to how our state space is defined by string configurations.

3. **"Minimum Genetic Mutation" (Medium):** BFS over gene strings where each mutation changes one character, similar to how our operations change the string.

The common pattern: when you have a start state, operations that transform the state, and need to find some optimal result (minimum/maximum), BFS/DFS over the state space is often the solution.

## Key Takeaways

1. **State space search problems** often appear when you have operations that transform a configuration. If the operations are reversible and the state space is limited, BFS/DFS with visited tracking is the go-to approach.

2. **Modular arithmetic** is crucial when dealing with cyclic systems (like digits 0-9 or circular rotations). Remember to use modulo operations for wrap-around behavior.

3. **Lexicographical comparison** in most programming languages uses dictionary order, which works correctly for strings of digits since '0' < '1' < ... < '9'.

Related problems: [Lexicographically Smallest String After Substring Operation](/problem/lexicographically-smallest-string-after-substring-operation), [Lexicographically Smallest String After a Swap](/problem/lexicographically-smallest-string-after-a-swap)
