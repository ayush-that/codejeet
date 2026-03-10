---
title: "How to Solve Push Dominoes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Push Dominoes. Medium difficulty, 63.0% acceptance rate. Topics: Two Pointers, String, Dynamic Programming."
date: "2028-07-08"
category: "dsa-patterns"
tags: ["push-dominoes", "two-pointers", "string", "dynamic-programming", "medium"]
---

## How to Solve Push Dominoes

This problem asks us to simulate dominoes falling in a line, where each domino can be pushed left (L), right (R), or remain standing (.). The tricky part is that dominoes influence each other simultaneously — a domino falling right pushes the one to its right in the next second, while one falling left pushes to the left. When forces from both sides meet, the domino stays upright. This simultaneous action makes a direct simulation approach complex.

## Visual Walkthrough

Let's trace through the example `.L.R...LR..L..` step by step to build intuition:

**Initial state:** `. L . R . . . L R . . L . .`

We'll analyze each domino's fate:

- Domino at index 1 is 'L' → falls left immediately (but nothing to its left)
- Domino at index 3 is 'R' → falls right
- Domino at index 7 is 'L' → falls left
- Domino at index 8 is 'R' → falls right

Now consider the standing dominoes:

- Index 0: Between no force and left force from index 1 → falls left
- Index 2: Between left force (index 1) and right force (index 3) → balanced, stays upright
- Index 4: Right force from index 3 reaches it → falls right
- Index 5: Also gets right force from index 3 → falls right
- Index 6: Right force continues → falls right
- Index 9: Between left force (index 8) and right force (index 10 is '.') → actually, index 8 is 'R' falling right, so index 9 falls right
- Index 10: Between right force (index 8) and left force (index 11 is 'L') → balanced
- Index 12: Left force from index 11 → falls left
- Index 13: Also gets left force → falls left

**Final result:** `LL.RR.LLRRLL..`

The key insight: each domino's final state depends on the nearest forces to its left and right, and which is closer.

## Brute Force Approach

A naive approach would simulate each second explicitly:

1. Create a copy of the current state
2. For each domino, check if it's being pushed by adjacent falling dominoes
3. Update all dominoes simultaneously
4. Repeat until no more changes occur

This approach has several problems:

- Could take O(n²) time in worst case (like `R......L` where force takes n seconds to propagate)
- Handling simultaneous updates requires careful state management
- Determining when forces meet in the middle is complex

The brute force helps us understand the physics but isn't efficient enough for large inputs.

## Optimized Approach

The key insight is that we don't need to simulate each second. Instead, we can calculate the **net force** on each domino by finding the nearest force to its left and right:

1. **Left-to-right pass**: Calculate the distance to the nearest 'R' to the left of each position
2. **Right-to-left pass**: Calculate the distance to the nearest 'L' to the right of each position
3. **Compare distances**:
   - If left distance < right distance → domino falls right ('R')
   - If right distance < left distance → domino falls left ('L')
   - If equal → domino stays upright ('.')

Special cases:

- If no 'R' to the left, use infinity for left distance
- If no 'L' to the right, use infinity for right distance
- Original 'L' and 'R' dominoes keep their state

This approach works because dominoes only care about the **closest** force in each direction — farther forces don't matter since closer ones reach first.

## Optimal Solution

Here's the implementation using two passes:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def pushDominoes(dominoes: str) -> str:
    n = len(dominoes)
    # Step 1: Calculate distance to nearest 'R' on the left
    left_force = [float('inf')] * n
    distance = float('inf')

    # Left to right pass: track distance to most recent 'R'
    for i in range(n):
        if dominoes[i] == 'R':
            distance = 0  # Reset distance when we see 'R'
        elif dominoes[i] == 'L':
            distance = float('inf')  # 'L' blocks rightward force
        else:
            if distance != float('inf'):
                distance += 1
        left_force[i] = distance

    # Step 2: Calculate distance to nearest 'L' on the right
    right_force = [float('inf')] * n
    distance = float('inf')

    # Right to left pass: track distance to most recent 'L'
    for i in range(n-1, -1, -1):
        if dominoes[i] == 'L':
            distance = 0  # Reset distance when we see 'L'
        elif dominoes[i] == 'R':
            distance = float('inf')  # 'R' blocks leftward force
        else:
            if distance != float('inf'):
                distance += 1
        right_force[i] = distance

    # Step 3: Determine final state based on closest force
    result = []
    for i in range(n):
        if dominoes[i] != '.':
            result.append(dominoes[i])  # Keep original pushes
        elif left_force[i] < right_force[i]:
            result.append('R')  # Right force is closer
        elif right_force[i] < left_force[i]:
            result.append('L')  # Left force is closer
        else:
            result.append('.')  # Equal distance or no force

    return ''.join(result)
```

```javascript
// Time: O(n) | Space: O(n)
function pushDominoes(dominoes) {
  const n = dominoes.length;
  // Step 1: Calculate distance to nearest 'R' on the left
  const leftForce = new Array(n).fill(Infinity);
  let distance = Infinity;

  // Left to right pass
  for (let i = 0; i < n; i++) {
    if (dominoes[i] === "R") {
      distance = 0; // Reset when we see 'R'
    } else if (dominoes[i] === "L") {
      distance = Infinity; // 'L' blocks rightward force
    } else {
      if (distance !== Infinity) {
        distance++;
      }
    }
    leftForce[i] = distance;
  }

  // Step 2: Calculate distance to nearest 'L' on the right
  const rightForce = new Array(n).fill(Infinity);
  distance = Infinity;

  // Right to left pass
  for (let i = n - 1; i >= 0; i--) {
    if (dominoes[i] === "L") {
      distance = 0; // Reset when we see 'L'
    } else if (dominoes[i] === "R") {
      distance = Infinity; // 'R' blocks leftward force
    } else {
      if (distance !== Infinity) {
        distance++;
      }
    }
    rightForce[i] = distance;
  }

  // Step 3: Determine final state based on closest force
  const result = [];
  for (let i = 0; i < n; i++) {
    if (dominoes[i] !== ".") {
      result.push(dominoes[i]); // Keep original pushes
    } else if (leftForce[i] < rightForce[i]) {
      result.push("R"); // Right force is closer
    } else if (rightForce[i] < leftForce[i]) {
      result.push("L"); // Left force is closer
    } else {
      result.push("."); // Equal distance or no force
    }
  }

  return result.join("");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String pushDominoes(String dominoes) {
        int n = dominoes.length();
        // Step 1: Calculate distance to nearest 'R' on the left
        int[] leftForce = new int[n];
        int distance = Integer.MAX_VALUE;

        // Left to right pass
        for (int i = 0; i < n; i++) {
            char c = dominoes.charAt(i);
            if (c == 'R') {
                distance = 0;  // Reset when we see 'R'
            } else if (c == 'L') {
                distance = Integer.MAX_VALUE;  // 'L' blocks rightward force
            } else {
                if (distance != Integer.MAX_VALUE) {
                    distance++;
                }
            }
            leftForce[i] = distance;
        }

        // Step 2: Calculate distance to nearest 'L' on the right
        int[] rightForce = new int[n];
        distance = Integer.MAX_VALUE;

        // Right to left pass
        for (int i = n - 1; i >= 0; i--) {
            char c = dominoes.charAt(i);
            if (c == 'L') {
                distance = 0;  // Reset when we see 'L'
            } else if (c == 'R') {
                distance = Integer.MAX_VALUE;  // 'R' blocks leftward force
            } else {
                if (distance != Integer.MAX_VALUE) {
                    distance++;
                }
            }
            rightForce[i] = distance;
        }

        // Step 3: Determine final state based on closest force
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < n; i++) {
            char c = dominoes.charAt(i);
            if (c != '.') {
                result.append(c);  // Keep original pushes
            } else if (leftForce[i] < rightForce[i]) {
                result.append('R');  // Right force is closer
            } else if (rightForce[i] < leftForce[i]) {
                result.append('L');  // Left force is closer
            } else {
                result.append('.');  // Equal distance or no force
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We make three passes through the string: one left-to-right, one right-to-left, and one final pass to build the result. Each pass processes n elements.

**Space Complexity:** O(n)  
We use two arrays of size n to store distances to nearest forces. The output string also requires O(n) space. We could optimize to O(1) extra space by combining passes, but the O(n) approach is clearer and still efficient.

## Common Mistakes

1. **Forgetting to reset distance when seeing opposite forces**: When scanning left-to-right and encountering 'L', you must reset the distance to infinity because 'L' blocks rightward force propagation. Similarly, 'R' blocks leftward force in the right-to-left pass.

2. **Off-by-one in distance calculation**: The distance should increment **after** moving to the next domino, not before. If 'R' is at index i, the domino at i+1 has distance 1, not 0.

3. **Not handling the "equal force" case correctly**: When left and right forces are equally distant, the domino should remain upright ('.'), not arbitrarily choose one direction.

4. **Modifying the original string while iterating**: This breaks simultaneous update requirement. Always create a new result string or use a separate data structure.

## When You'll See This Pattern

This "two-pass distance calculation" pattern appears in problems where each element's state depends on the nearest special element in each direction:

1. **Shortest Distance to a Character (LeetCode 821)**: Find the distance to the nearest target character in a string — uses the same two-pass technique.

2. **Candy (LeetCode 135)**: Each child's candy depends on ratings compared to neighbors — requires left-to-right then right-to-left passes.

3. **Trapping Rain Water (LeetCode 42)**: Water at each position depends on the maximum height to its left and right — similar two-pass logic.

The pattern is: when an element's value depends on some property of elements on both sides, consider computing left contributions in one pass and right contributions in another, then combine.

## Key Takeaways

1. **Simultaneous updates can often be solved with two passes**: Instead of simulating time steps, calculate the net effect by analyzing forces from both directions separately.

2. **Use sentinel values for "no force"**: Infinity or a large number works well to represent "no force in this direction."

3. **The closest force wins**: In propagation problems, only the nearest source matters — farther sources are irrelevant since closer ones arrive first.

[Practice this problem on CodeJeet](/problem/push-dominoes)
