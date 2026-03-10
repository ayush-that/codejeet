---
title: "How to Solve Chalkboard XOR Game — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Chalkboard XOR Game. Hard difficulty, 65.8% acceptance rate. Topics: Array, Math, Bit Manipulation, Brainteaser, Game Theory."
date: "2029-12-15"
category: "dsa-patterns"
tags: ["chalkboard-xor-game", "array", "math", "bit-manipulation", "hard"]
---

# How to Solve Chalkboard XOR Game

This problem presents a two-player game where Alice and Bob alternately erase numbers from a chalkboard, with Alice moving first. If a player's move makes the XOR of all remaining numbers become 0, that player loses. The challenge is determining whether Alice can force a win given optimal play from both sides. What makes this problem interesting is that it appears to require complex game theory analysis, but it actually has a surprisingly elegant mathematical solution based on XOR properties.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider `nums = [1, 1, 2]`.

**Initial state:**

- Board: [1, 1, 2]
- Current XOR: 1 ⊕ 1 ⊕ 2 = (1 ⊕ 1) ⊕ 2 = 0 ⊕ 2 = 2

**Turn 1 (Alice's move):**
Alice has three choices:

1. Remove 1 → Board: [1, 2], XOR: 1 ⊕ 2 = 3 (not 0, game continues)
2. Remove the other 1 → Board: [1, 2], XOR: 1 ⊕ 2 = 3 (not 0, game continues)
3. Remove 2 → Board: [1, 1], XOR: 1 ⊕ 1 = 0 (Alice loses immediately!)

Alice will choose option 1 or 2 to avoid losing. Let's say she removes the first 1.

**Turn 2 (Bob's move):**
Board: [1, 2], XOR: 3
Bob has two choices:

1. Remove 1 → Board: [2], XOR: 2 (not 0, game continues)
2. Remove 2 → Board: [1], XOR: 1 (not 0, game continues)

Bob chooses option 1.

**Turn 3 (Alice's move):**
Board: [2], XOR: 2
Alice must remove the last number (2), making the board empty. When the board is empty, the XOR is 0 by definition. Alice loses.

Wait, could Alice have done better? Let's reconsider Turn 1. What if Alice had removed 2 instead of 1? She would have lost immediately. What if she had removed the other 1? The game would proceed symmetrically, and Alice would still lose on Turn 3. So for `[1, 1, 2]`, Alice loses.

Now let's try `nums = [1, 2, 3]`:

- Initial XOR: 1 ⊕ 2 ⊕ 3 = 0
- Alice wins immediately! Why? Because if the initial XOR is already 0, Alice doesn't need to make a move - she's already in a winning position.

This gives us our first insight: **If the initial XOR is 0, Alice wins immediately.**

## Brute Force Approach

A naive approach would be to simulate all possible game sequences using recursion or backtracking. At each turn, the current player tries all available numbers to remove. If any move leads to the opponent losing, the current player wins. This is essentially a minimax search.

The problem with this approach is the exponential time complexity. For an array of length `n`, there are `n!` possible game sequences in the worst case. Even with memoization to avoid recomputing states, the state space is still enormous because the board state depends on which numbers remain.

Here's what the brute force logic would look like:

<div class="code-group">

```python
def xorGameBruteForce(nums):
    # Helper function to check if current player can force a win
    def canWin(current_nums):
        # Base case: if XOR is 0, current player loses
        # (because they would have made it 0 on previous move)
        xor = 0
        for num in current_nums:
            xor ^= num
        if xor == 0:
            return False

        # Try removing each number
        for i in range(len(current_nums)):
            # Create new board without the i-th element
            new_nums = current_nums[:i] + current_nums[i+1:]
            # If opponent cannot win from this state, current player wins
            if not canWin(new_nums):
                return True

        # If no winning move exists, current player loses
        return False

    return canWin(nums)
```

```javascript
function xorGameBruteForce(nums) {
  // Helper function to check if current player can force a win
  function canWin(currentNums) {
    // Base case: if XOR is 0, current player loses
    let xor = 0;
    for (let num of currentNums) {
      xor ^= num;
    }
    if (xor === 0) return false;

    // Try removing each number
    for (let i = 0; i < currentNums.length; i++) {
      // Create new board without the i-th element
      const newNums = [...currentNums.slice(0, i), ...currentNums.slice(i + 1)];
      // If opponent cannot win from this state, current player wins
      if (!canWin(newNums)) {
        return true;
      }
    }

    // If no winning move exists, current player loses
    return false;
  }

  return canWin(nums);
}
```

```java
public boolean xorGameBruteForce(int[] nums) {
    // Convert array to list for easier manipulation
    List<Integer> numList = new ArrayList<>();
    for (int num : nums) {
        numList.add(num);
    }
    return canWin(numList);
}

private boolean canWin(List<Integer> currentNums) {
    // Base case: if XOR is 0, current player loses
    int xor = 0;
    for (int num : currentNums) {
        xor ^= num;
    }
    if (xor == 0) return false;

    // Try removing each number
    for (int i = 0; i < currentNums.size(); i++) {
        // Create new board without the i-th element
        List<Integer> newNums = new ArrayList<>(currentNums);
        newNums.remove(i);
        // If opponent cannot win from this state, current player wins
        if (!canWin(newNums)) {
            return true;
        }
    }

    // If no winning move exists, current player loses
    return false;
}
```

</div>

This brute force solution is completely impractical for anything beyond very small inputs (n ≤ 10). We need a smarter approach.

## Optimized Approach

The key insight comes from analyzing the mathematical properties of XOR and the game structure. Let's reason step by step:

1. **Initial XOR is 0**: If the XOR of all numbers is initially 0, Alice wins immediately without making a move.

2. **Initial XOR is not 0**: Let's denote the initial XOR as `S ≠ 0`. Now consider two cases:
   - **Case A: Array length is even**: We'll prove Alice can always win.
   - **Case B: Array length is odd**: We'll prove Alice loses (assuming optimal play).

**Proof for even length (n is even):**

- Suppose Alice cannot win with optimal play. This means that no matter which number she removes, Bob can force a win from the resulting position.
- Let the numbers be `a₁, a₂, ..., aₙ` with `S = a₁ ⊕ a₂ ⊕ ... ⊕ aₙ ≠ 0`.
- For Alice's first move, she considers removing `aᵢ`. After removal, the XOR becomes `S ⊕ aᵢ` (since `x ⊕ x = 0`, removing `aᵢ` is equivalent to XOR-ing with `aᵢ`).
- If `S ⊕ aᵢ = 0` for any `aᵢ`, Alice would win immediately by removing that number. So we assume `S ⊕ aᵢ ≠ 0` for all `i`.
- Now, if Alice cannot win, then for every `i`, Bob can win from position `(a₁, ..., aᵢ₋₁, aᵢ₊₁, ..., aₙ)` with XOR `S ⊕ aᵢ`.
- But here's the crucial observation: There are `n` possible first moves for Alice, and `n` is even. If Bob can win from all these positions, then consider the XOR of all `S ⊕ aᵢ`:
  ```
  (S ⊕ a₁) ⊕ (S ⊕ a₂) ⊕ ... ⊕ (S ⊕ aₙ)
  = (S ⊕ S ⊕ ... ⊕ S) ⊕ (a₁ ⊕ a₂ ⊕ ... ⊕ aₙ)  [n copies of S]
  = (S ⊕ S ⊕ ... ⊕ S) ⊕ S  [n+1 copies of S total]
  = S  [since n is even, n copies of S cancel out, leaving one S]
  ```
  But if Bob can win from all positions with XOR values `S ⊕ aᵢ`, and XOR is not zero for any of them, we get a contradiction. Therefore, Alice must have a winning move.

**Proof for odd length (n is odd):**

- With odd length and `S ≠ 0`, Alice removes some number `aᵢ`, leaving an even number of elements with XOR `S ⊕ aᵢ`.
- If `S ⊕ aᵢ = 0`, Alice loses immediately.
- If `S ⊕ aᵢ ≠ 0`, then Bob faces an even-length array with non-zero XOR, which we just proved is a winning position for the player to move! So Bob can force a win.

Thus, the optimal solution is remarkably simple: **Alice wins if and only if the initial XOR is 0 OR the array length is even.**

## Optimal Solution

Based on our mathematical analysis, the solution reduces to checking two simple conditions. Here's the implementation:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def xorGame(nums):
    """
    Determines if Alice can win the XOR game.

    Args:
        nums: List of integers on the chalkboard

    Returns:
        True if Alice can force a win, False otherwise
    """
    # Calculate XOR of all numbers
    xor_sum = 0
    for num in nums:
        xor_sum ^= num

    # Alice wins if:
    # 1. XOR of all numbers is 0 (Alice wins immediately), OR
    # 2. The number of elements is even (mathematical proof shows Alice can force a win)
    return xor_sum == 0 or len(nums) % 2 == 0
```

```javascript
// Time: O(n) | Space: O(1)
function xorGame(nums) {
  /**
   * Determines if Alice can win the XOR game.
   *
   * @param {number[]} nums - Array of integers on the chalkboard
   * @return {boolean} True if Alice can force a win, False otherwise
   */
  // Calculate XOR of all numbers
  let xorSum = 0;
  for (let num of nums) {
    xorSum ^= num;
  }

  // Alice wins if:
  // 1. XOR of all numbers is 0 (Alice wins immediately), OR
  // 2. The number of elements is even (mathematical proof shows Alice can force a win)
  return xorSum === 0 || nums.length % 2 === 0;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean xorGame(int[] nums) {
    /**
     * Determines if Alice can win the XOR game.
     *
     * @param nums Array of integers on the chalkboard
     * @return True if Alice can force a win, False otherwise
     */
    // Calculate XOR of all numbers
    int xorSum = 0;
    for (int num : nums) {
        xorSum ^= num;
    }

    // Alice wins if:
    // 1. XOR of all numbers is 0 (Alice wins immediately), OR
    // 2. The number of elements is even (mathematical proof shows Alice can force a win)
    return xorSum == 0 || nums.length % 2 == 0;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We need to iterate through the array once to compute the XOR of all elements. This takes O(n) time where n is the length of the array.
- The parity check (even/odd) is O(1) time.

**Space Complexity:** O(1)

- We only use a constant amount of extra space: one variable to store the XOR result.
- No additional data structures are needed.

## Common Mistakes

1. **Attempting to simulate the game**: Many candidates try to implement actual game simulation with recursion or BFS. This leads to exponential time complexity and will time out on larger inputs. Always look for mathematical patterns in game theory problems.

2. **Missing the base case when XOR is initially 0**: Some candidates only check if the array length is even, forgetting that Alice wins immediately if the initial XOR is 0, regardless of array length.

3. **Incorrect XOR calculation**: Forgetting to initialize XOR to 0, or using the wrong operator (like `&` or `|` instead of `^`). Remember: XOR in Python/JavaScript/Java is `^`.

4. **Overcomplicating with unnecessary data structures**: No need for hash maps, stacks, or queues here. The solution only requires computing XOR and checking array length parity.

## When You'll See This Pattern

This problem combines game theory with bit manipulation, a pattern seen in several other LeetCode problems:

1. **Nim Game (LeetCode 292)**: Another game theory problem where the solution reduces to a simple modulo check. In Nim, you win if `n % 4 != 0`.

2. **Can I Win (LeetCode 464)**: A more complex game theory problem that often requires memoization and bitmask DP to track which numbers have been used.

3. **Stone Game (LeetCode 877)**: A game theory problem where the first player can always win with even-length arrays (similar pattern to this problem).

The key insight in all these problems is looking for invariant properties or parity arguments that simplify what seems like a complex game tree analysis.

## Key Takeaways

1. **Game theory problems often have mathematical solutions**: Instead of simulating all possible moves, look for patterns, invariants, or parity arguments that determine the outcome.

2. **XOR properties are powerful**: Remember that `x ⊕ x = 0` and `x ⊕ 0 = x`. These simple properties can lead to elegant solutions for seemingly complex problems.

3. **Even/odd parity is a common theme**: Many game theory problems boil down to checking whether some count is even or odd. Always consider parity when analyzing turn-based games.

4. **Start with small examples**: When faced with a game theory problem, work through small examples by hand to identify patterns before jumping to implementation.

[Practice this problem on CodeJeet](/problem/chalkboard-xor-game)
