---
title: "Game Theory Interview Questions: Patterns and Strategies"
description: "Master Game Theory problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-03-09"
category: "dsa-patterns"
tags: ["game-theory", "dsa", "interview prep"]
---

Game Theory questions test your ability to model competitive scenarios and find optimal strategies. While less frequent than core data structures, they appear at top tech companies to assess analytical reasoning and problem-solving under constraints. Mastering a few key patterns can turn these intimidating problems into predictable exercises.

## Common Patterns

Most interview problems reduce to one of a handful of classic game theory models.

### 1. The Nim Game & XOR Pattern

The classic Nim problem involves piles of stones where players take turns removing any number from a single pile. The winning strategy depends on the _nim-sum_ (XOR of all pile sizes). If the nim-sum is zero, the player to move is in a losing position with optimal play from the opponent.

<div class="code-group">

```python
def can_win_nim(piles):
    xor_sum = 0
    for stones in piles:
        xor_sum ^= stones
    # If xor_sum == 0, first player loses with perfect play.
    return xor_sum != 0
```

```javascript
function canWinNim(piles) {
  let xorSum = 0;
  for (let stones of piles) {
    xorSum ^= stones;
  }
  return xorSum !== 0;
}
```

```java
public boolean canWinNim(int[] piles) {
    int xorSum = 0;
    for (int stones : piles) {
        xorSum ^= stones;
    }
    return xorSum != 0;
}
```

</div>

### 2. Min-Max with Memoization

For turn-based games where both players play optimally, you often use recursive min-max. The state represents the current game configuration. You memoize results to avoid exponential re-calculation.

<div class="code-group">

```python
def can_win(target, memo):
    if target <= 0:
        return False
    if target in memo:
        return memo[target]

    # Assume moves are subtracting 1, 2, or 3
    for move in [1, 2, 3]:
        if not can_win(target - move, memo):
            memo[target] = True
            return True
    memo[target] = False
    return False
```

```javascript
function canWin(target, memo = {}) {
  if (target <= 0) return false;
  if (memo[target] !== undefined) return memo[target];

  const moves = [1, 2, 3];
  for (let move of moves) {
    if (!canWin(target - move, memo)) {
      memo[target] = true;
      return true;
    }
  }
  memo[target] = false;
  return false;
}
```

```java
public boolean canWin(int target, Map<Integer, Boolean> memo) {
    if (target <= 0) return false;
    if (memo.containsKey(target)) return memo.get(target);

    int[] moves = {1, 2, 3};
    for (int move : moves) {
        if (!canWin(target - move, memo)) {
            memo.put(target, true);
            return true;
        }
    }
    memo.put(target, false);
    return false;
}
```

</div>

### 3. Sprague-Grundy Theorem for Impartial Games

For complex impartial games (where both players have the same moves), the Sprague-Grundy theorem assigns a _Grundy number_ (or _mex_ value) to each game state. The overall game is a losing state if the XOR of all Grundy numbers is zero. This generalizes the Nim pattern.

## Difficulty Breakdown

Our dataset of 24 questions splits as: Easy (13%), Medium (50%), Hard (38%). This distribution is telling.

Easy problems are often direct applications of the Nim XOR rule or simple parity checks. Medium problems require adapting core patterns, often combining min-max with memoization or modifying the Nim logic. Hard problems frequently involve the Sprague-Grundy theorem, complex state representation, or are disguised as dynamic programming problems requiring a game-theoretic lens. The high percentage of Hard questions indicates that when companies ask Game Theory, they often aim for a high signal on candidate depth.

## Which Companies Ask Game Theory

These companies are known for including game theory problems in their interview loops:

- [Google](/company/google) – Often asks problems involving optimal play and strategy.
- [Amazon](/company/amazon) – Uses game theory in questions related to resource competition.
- [Bloomberg](/company/bloomberg) – Appears in financial modeling and competitive scenario problems.
- [Meta](/company/meta) – Sometimes includes it in puzzles and optimization rounds.
- [Microsoft](/company/microsoft) – Has a history of combinatorial game problems.

## Study Tips

1.  **Start with Nim and Min-Max.** Solidify your understanding of the XOR pattern and basic recursive min-max with memoization. These two concepts form the foundation for 80% of interview problems.
2.  **Look for the "Impartial" Signal.** If both players have the same moves from a given state, you're likely dealing with an impartial game. This immediately points to Nim, Grundy numbers, and XOR-based solutions.
3.  **Practice State Reduction.** The hardest part is often defining a minimal, hashable game state for your memo table. Look for symmetries and irrelevant details you can discard.
4.  **Don't Memorize, Pattern-Match.** Focus on recognizing the scenario: alternating turns, perfect play, and a win/lose outcome. This points you toward the min-max framework. Then check if it's a simple Nim variant.

[Practice all Game Theory questions on CodeJeet](/topic/game-theory)
