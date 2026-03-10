---
title: "How to Solve Design Authentication Manager — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Authentication Manager. Medium difficulty, 58.4% acceptance rate. Topics: Hash Table, Linked List, Design, Doubly-Linked List."
date: "2028-06-05"
category: "dsa-patterns"
tags: ["design-authentication-manager", "hash-table", "linked-list", "design", "medium"]
---

# How to Solve Design Authentication Manager

This problem asks you to design an authentication manager that tracks tokens with expiration times. The tricky part is efficiently handling token renewals and counting unexpired tokens at any given time. You need to maintain tokens that can be renewed (extending their expiration) while automatically removing expired ones when counting.

## Visual Walkthrough

Let's trace through an example with `timeToLive = 5`:

1. Initialize: `AuthenticationManager(5)`
2. `generate("aaa", 1)` → Token "aaa" expires at time 6 (1 + 5)
3. `generate("bbb", 2)` → Token "bbb" expires at time 7 (2 + 5)
4. `countUnexpiredTokens(4)` → Both tokens are still valid (6 > 4 and 7 > 4) → Return 2
5. `renew("aaa", 6)` → Check if "aaa" exists and is unexpired (6 ≥ 6? No, must be > 6) → Token expired, do nothing
6. `generate("ccc", 7)` → Token "ccc" expires at time 12 (7 + 5)
7. `countUnexpiredTokens(10)` → "bbb" expired at 7 (7 ≤ 10), "ccc" expires at 12 (12 > 10) → Return 1
8. `renew("ccc", 11)` → "ccc" expires at 12 (12 > 11) → Renew to expire at 16 (11 + 5)
9. `countUnexpiredTokens(15)` → "ccc" expires at 16 (16 > 15) → Return 1

The key insight: when counting tokens, we need to efficiently find which tokens have expired at the given currentTime.

## Brute Force Approach

A naive approach would store tokens in a simple dictionary mapping tokenId → expirationTime. For each operation:

- **generate/renew**: Simply add/update the dictionary (O(1))
- **countUnexpiredTokens**: Iterate through ALL tokens, checking if expirationTime > currentTime (O(n))

The problem is that `countUnexpiredTokens` can be called frequently, and with many tokens, O(n) becomes too slow. In the worst case with 2000 tokens and 2000 count operations, that's 4 million operations.

```python
class AuthenticationManagerNaive:
    def __init__(self, timeToLive):
        self.timeToLive = timeToLive
        self.tokens = {}  # tokenId -> expirationTime

    def generate(self, tokenId, currentTime):
        self.tokens[tokenId] = currentTime + self.timeToLive

    def renew(self, tokenId, currentTime):
        if tokenId in self.tokens and self.tokens[tokenId] > currentTime:
            self.tokens[tokenId] = currentTime + self.timeToLive

    def countUnexpiredTokens(self, currentTime):
        count = 0
        for exp in self.tokens.values():
            if exp > currentTime:
                count += 1
        return count
```

The brute force fails because `countUnexpiredTokens` is O(n) and can be called up to 2000 times.

## Optimized Approach

The key insight: we need to efficiently remove expired tokens when counting. Two main approaches work:

1. **Sorted Data Structure + Cleanup**: Store tokens sorted by expiration time. When counting, remove all expired tokens from the front before counting.
2. **Double Cleanup**: Use a hash map for O(1) lookups and a separate cleanup mechanism.

The optimal solution uses a **hash map + cleanup-on-demand** pattern:

- Store tokens in a dictionary for O(1) lookups (generate/renew)
- When counting, first remove expired tokens from the dictionary
- To avoid O(n) cleanup every time, we only clean up expired tokens when needed

Actually, there's an even cleaner approach: **store expiration times in the dictionary, and when counting, iterate through all tokens but skip cleanup**. This is acceptable because:

- Maximum 2000 tokens total (constraint)
- Each count operation is O(n) but n ≤ 2000
- Total operations bounded by 2000 × 2000 = 4M, which is fine

But we can do better with **lazy cleanup**: only clean expired tokens when we encounter them during other operations or when counting.

The most elegant solution uses a **sorted data structure** (like SortedDict in Python or TreeMap in Java) to store tokens by expiration time, allowing us to efficiently find and remove all expired tokens in O(k log n) where k is the number of expired tokens.

## Optimal Solution

We'll use a hash map for O(1) token lookups and a sorted dictionary (OrderedDict or regular dict with sorting) to efficiently remove expired tokens. Here's the step-by-step:

1. **Data Structures**:
   - `tokens`: Dictionary mapping tokenId → expirationTime
   - We'll use the fact that Python 3.7+ dictionaries maintain insertion order

2. **Operations**:
   - `generate()`: Add token with expiration time
   - `renew()`: Check if token exists and is unexpired, then update expiration
   - `countUnexpiredTokens()`: First remove all expired tokens, then return count

3. **Cleanup Strategy**: Before counting, iterate through tokens and remove those with expiration ≤ currentTime

<div class="code-group">

```python
# Time: O(n) for countUnexpiredTokens (but with cleanup), O(1) for others
# Space: O(n) for storing n tokens
class AuthenticationManager:
    def __init__(self, timeToLive: int):
        # Store the time-to-live value for calculating expiration
        self.ttl = timeToLive
        # Dictionary to store tokenId -> expirationTime
        # Python 3.7+ dict maintains insertion order
        self.tokens = {}

    def generate(self, tokenId: str, currentTime: int) -> None:
        # Calculate expiration time and store the token
        self.tokens[tokenId] = currentTime + self.ttl

    def renew(self, tokenId: str, currentTime: int) -> None:
        # Only renew if token exists and hasn't expired
        if tokenId in self.tokens and self.tokens[tokenId] > currentTime:
            # Update expiration time to currentTime + ttl
            self.tokens[tokenId] = currentTime + self.ttl

    def countUnexpiredTokens(self, currentTime: int) -> int:
        # First, clean up expired tokens
        self._cleanup(currentTime)
        # Return the number of remaining tokens
        return len(self.tokens)

    def _cleanup(self, currentTime: int) -> None:
        # Create list of tokens to remove (can't modify dict during iteration)
        to_remove = []
        for token_id, exp_time in self.tokens.items():
            if exp_time <= currentTime:
                to_remove.append(token_id)

        # Remove expired tokens
        for token_id in to_remove:
            del self.tokens[token_id]
```

```javascript
// Time: O(n) for countUnexpiredTokens (but with cleanup), O(1) for others
// Space: O(n) for storing n tokens
class AuthenticationManager {
  constructor(timeToLive) {
    this.ttl = timeToLive;
    // Map to store tokenId -> expirationTime
    this.tokens = new Map();
  }

  generate(tokenId, currentTime) {
    // Calculate expiration time and store the token
    this.tokens.set(tokenId, currentTime + this.ttl);
  }

  renew(tokenId, currentTime) {
    // Only renew if token exists and hasn't expired
    if (this.tokens.has(tokenId) && this.tokens.get(tokenId) > currentTime) {
      // Update expiration time to currentTime + ttl
      this.tokens.set(tokenId, currentTime + this.ttl);
    }
  }

  countUnexpiredTokens(currentTime) {
    // First, clean up expired tokens
    this._cleanup(currentTime);
    // Return the number of remaining tokens
    return this.tokens.size;
  }

  _cleanup(currentTime) {
    // Create array of tokens to remove
    const toRemove = [];

    // Iterate through all tokens
    for (const [tokenId, expTime] of this.tokens.entries()) {
      if (expTime <= currentTime) {
        toRemove.push(tokenId);
      }
    }

    // Remove expired tokens
    for (const tokenId of toRemove) {
      this.tokens.delete(tokenId);
    }
  }
}
```

```java
// Time: O(n) for countUnexpiredTokens (but with cleanup), O(1) for others
// Space: O(n) for storing n tokens
class AuthenticationManager {
    private int ttl;
    private Map<String, Integer> tokens;

    public AuthenticationManager(int timeToLive) {
        this.ttl = timeToLive;
        this.tokens = new HashMap<>();
    }

    public void generate(String tokenId, int currentTime) {
        // Calculate expiration time and store the token
        tokens.put(tokenId, currentTime + ttl);
    }

    public void renew(String tokenId, int currentTime) {
        // Only renew if token exists and hasn't expired
        if (tokens.containsKey(tokenId) && tokens.get(tokenId) > currentTime) {
            // Update expiration time to currentTime + ttl
            tokens.put(tokenId, currentTime + ttl);
        }
    }

    public int countUnexpiredTokens(int currentTime) {
        // First, clean up expired tokens
        cleanup(currentTime);
        // Return the number of remaining tokens
        return tokens.size();
    }

    private void cleanup(int currentTime) {
        // Create list of tokens to remove
        List<String> toRemove = new ArrayList<>();

        // Find all expired tokens
        for (Map.Entry<String, Integer> entry : tokens.entrySet()) {
            if (entry.getValue() <= currentTime) {
                toRemove.add(entry.getKey());
            }
        }

        // Remove expired tokens
        for (String tokenId : toRemove) {
            tokens.remove(tokenId);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `generate()`: O(1) - Just dictionary insertion
- `renew()`: O(1) - Dictionary lookup and update
- `countUnexpiredTokens()`: O(n) in worst case, but amortized better because we clean expired tokens
- Overall: With at most 2000 tokens and 2000 operations, worst-case is 4M operations which is acceptable

**Space Complexity:**

- O(n) where n is the number of active tokens (at most 2000)

The cleanup happens during `countUnexpiredTokens()`, so if count is called infrequently, we might accumulate expired tokens. However, the problem constraints (2000 max tokens) make this acceptable.

## Common Mistakes

1. **Not checking expiration before renewing**: Forgetting that `renew()` should only work if token exists AND is unexpired. The condition is `expirationTime > currentTime`, not `≥`.

2. **Modifying dictionary during iteration**: Trying to delete tokens while iterating through the dictionary causes runtime errors. Always collect tokens to remove first, then delete them.

3. **Forgetting to update expiration on renew**: Some candidates check if token exists but forget to actually update the expiration time to `currentTime + timeToLive`.

4. **Inefficient cleanup in countUnexpiredTokens**: Some try to clean up on every generate/renew call, which adds unnecessary overhead. Cleanup-on-demand during count operations is sufficient.

## When You'll See This Pattern

This "cleanup-on-demand" pattern appears in several design problems:

1. **LRU Cache (LeetCode 146)**: Similar concept of removing least recently used items when capacity is exceeded. Both use hash maps for O(1) access and maintain order for cleanup.

2. **Time-Based Key-Value Store (LeetCode 981)**: Stores values with timestamps and retrieves based on time. Requires efficient time-based lookups and cleanup.

3. **Logger Rate Limiter (LeetCode 359)**: Tracks message timestamps and needs to clean old entries. Uses similar time-based expiration logic.

The core pattern: **Use a hash map for fast lookups, and periodically clean expired entries based on some condition (time, capacity, etc.)**.

## Key Takeaways

1. **Cleanup-on-demand is often sufficient**: You don't always need to maintain perfectly clean data structures. Periodic cleanup when needed can be more efficient than constant maintenance.

2. **Hash maps + auxiliary structures solve many design problems**: For time-based systems, consider pairing a hash map (for O(1) access) with a time-sorted structure for efficient expiration handling.

3. **Check constraints before optimizing**: With only 2000 max tokens, even O(n) operations per call are acceptable. Don't over-engineer when simple solutions work within constraints.

[Practice this problem on CodeJeet](/problem/design-authentication-manager)
