---
title: "How to Solve Encode and Decode TinyURL — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Encode and Decode TinyURL. Medium difficulty, 86.6% acceptance rate. Topics: Hash Table, String, Design, Hash Function."
date: "2027-12-25"
category: "dsa-patterns"
tags: ["encode-and-decode-tinyurl", "hash-table", "string", "design", "medium"]
---

# How to Solve Encode and Decode TinyURL

This problem asks you to design a URL shortening service that can encode a long URL into a short "tiny" URL and decode it back to the original. What makes this problem interesting is that it's a practical system design question disguised as a coding problem—you need to create a bidirectional mapping between two string formats while handling collisions and ensuring uniqueness.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Step 1:** We receive a long URL to encode: `https://leetcode.com/problems/design-tinyurl`

**Step 2:** We need to generate a unique short code for it. One approach is to use a counter:

- First URL gets code `0` → `http://tinyurl.com/0`
- We store the mapping: `{"0": "https://leetcode.com/problems/design-tinyurl"}`

**Step 3:** When someone visits `http://tinyurl.com/0`, we extract the code `0`, look it up in our mapping, and redirect to the original URL.

**Step 4:** If we receive the same long URL again, we could either:

- Generate a new code (wasteful, creates duplicate entries)
- Return the existing code (efficient, consistent)

**Step 5:** For decoding, we simply take the short URL, extract the code, and return the corresponding long URL from our mapping.

The core challenge is generating unique codes efficiently and handling the bidirectional lookup.

## Brute Force Approach

A naive approach might try to use a simple hash function on the long URL, but this has several issues:

1. **Hash collisions:** Different URLs could produce the same hash
2. **Predictability:** Simple hashes might allow guessing other URLs
3. **No reverse lookup:** Some hash functions aren't easily reversible

Here's what a basic (flawed) implementation might look like:

<div class="code-group">

```python
class Codec:
    def __init__(self):
        self.mapping = {}
        self.counter = 0

    def encode(self, longUrl: str) -> str:
        """Naive encoding using counter - problematic for duplicates"""
        short_code = str(self.counter)
        self.mapping[short_code] = longUrl
        self.counter += 1
        return "http://tinyurl.com/" + short_code

    def decode(self, shortUrl: str) -> str:
        """Extract code and return original URL"""
        code = shortUrl.split("/")[-1]
        return self.mapping.get(code, "")
```

```javascript
class Codec {
  constructor() {
    this.mapping = {};
    this.counter = 0;
  }

  encode(longUrl) {
    // Naive encoding using counter - problematic for duplicates
    const shortCode = this.counter.toString();
    this.mapping[shortCode] = longUrl;
    this.counter++;
    return "http://tinyurl.com/" + shortCode;
  }

  decode(shortUrl) {
    // Extract code and return original URL
    const parts = shortUrl.split("/");
    const code = parts[parts.length - 1];
    return this.mapping[code] || "";
  }
}
```

```java
public class Codec {
    private Map<String, String> mapping;
    private int counter;

    public Codec() {
        mapping = new HashMap<>();
        counter = 0;
    }

    public String encode(String longUrl) {
        // Naive encoding using counter - problematic for duplicates
        String shortCode = String.valueOf(counter);
        mapping.put(shortCode, longUrl);
        counter++;
        return "http://tinyurl.com/" + shortCode;
    }

    public String decode(String shortUrl) {
        // Extract code and return original URL
        String[] parts = shortUrl.split("/");
        String code = parts[parts.length - 1];
        return mapping.getOrDefault(code, "");
    }
}
```

</div>

**Why this is insufficient:**

1. **Duplicate URLs get different codes:** If the same long URL is encoded twice, it gets two different short URLs, which wastes space and creates inconsistency.
2. **Sequential codes are predictable:** Codes like 0, 1, 2, 3... are easy to guess, allowing access to other URLs.
3. **No check for existing URLs:** We should return the same short URL for the same long URL.

## Optimized Approach

The key insight is that we need **two mappings**:

1. **Long → Short:** To check if a URL was already encoded
2. **Short → Long:** To decode short URLs back to originals

We also need a **unique code generation** strategy. Instead of sequential numbers, we can:

- Use a hash of the long URL (like MD5 or SHA, but simpler for this problem)
- Generate random strings
- Use base62 encoding of a counter

For this problem, a practical approach is:

1. Check if the long URL was already encoded (using a long→short map)
2. If yes, return the existing short URL
3. If no, generate a unique code, store both mappings, and return the short URL

The unique code can be generated by:

- Taking the last 6 characters of a hash (simulating real URL shorteners)
- Using a random string of fixed length
- Encoding a counter in base62 (a-z, A-Z, 0-9)

## Optimal Solution

Here's the complete solution using random string generation for uniqueness:

<div class="code-group">

```python
import random
import string

class Codec:
    def __init__(self):
        # Two dictionaries for bidirectional mapping
        self.long_to_short = {}  # Maps long URL to short code
        self.short_to_long = {}  # Maps short code to long URL
        self.base_url = "http://tinyurl.com/"
        self.code_length = 6  # Standard TinyURL code length

        # Characters for generating random codes (62 possibilities)
        self.characters = string.ascii_letters + string.digits

    def encode(self, longUrl: str) -> str:
        """Encodes a URL to a shortened URL."""
        # Check if URL was already encoded
        if longUrl in self.long_to_short:
            return self.base_url + self.long_to_short[longUrl]

        # Generate a unique short code
        while True:
            # Create random code of specified length
            short_code = ''.join(random.choice(self.characters)
                                for _ in range(self.code_length))

            # Ensure code is unique (extremely low collision probability with 62^6 possibilities)
            if short_code not in self.short_to_long:
                break

        # Store both mappings
        self.long_to_short[longUrl] = short_code
        self.short_to_long[short_code] = longUrl

        return self.base_url + short_code

    def decode(self, shortUrl: str) -> str:
        """Decodes a shortened URL to its original URL."""
        # Extract the code from the short URL
        # Last part after the final slash is our code
        short_code = shortUrl.split("/")[-1]

        # Return the original URL or empty string if not found
        return self.short_to_long.get(short_code, "")

# Time: O(1) average for both encode and decode | Space: O(n) where n is number of URLs
```

```javascript
class Codec {
  constructor() {
    // Two maps for bidirectional mapping
    this.longToShort = new Map(); // Maps long URL to short code
    this.shortToLong = new Map(); // Maps short code to long URL
    this.baseUrl = "http://tinyurl.com/";
    this.codeLength = 6; // Standard TinyURL code length

    // Characters for generating random codes (62 possibilities)
    this.characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  }

  encode(longUrl) {
    // Check if URL was already encoded
    if (this.longToShort.has(longUrl)) {
      return this.baseUrl + this.longToShort.get(longUrl);
    }

    // Generate a unique short code
    let shortCode;
    while (true) {
      // Create random code of specified length
      shortCode = "";
      for (let i = 0; i < this.codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * this.characters.length);
        shortCode += this.characters[randomIndex];
      }

      // Ensure code is unique
      if (!this.shortToLong.has(shortCode)) {
        break;
      }
    }

    // Store both mappings
    this.longToShort.set(longUrl, shortCode);
    this.shortToLong.set(shortCode, longUrl);

    return this.baseUrl + shortCode;
  }

  decode(shortUrl) {
    // Extract the code from the short URL
    // Last part after the final slash is our code
    const parts = shortUrl.split("/");
    const shortCode = parts[parts.length - 1];

    // Return the original URL or empty string if not found
    return this.shortToLong.get(shortCode) || "";
  }
}

// Time: O(1) average for both encode and decode | Space: O(n) where n is number of URLs
```

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class Codec {
    private Map<String, String> longToShort;  // Maps long URL to short code
    private Map<String, String> shortToLong;  // Maps short code to long URL
    private String baseUrl = "http://tinyurl.com/";
    private int codeLength = 6;  // Standard TinyURL code length
    private String characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private Random random = new Random();

    public Codec() {
        longToShort = new HashMap<>();
        shortToLong = new HashMap<>();
    }

    public String encode(String longUrl) {
        // Check if URL was already encoded
        if (longToShort.containsKey(longUrl)) {
            return baseUrl + longToShort.get(longUrl);
        }

        // Generate a unique short code
        String shortCode;
        while (true) {
            // Create random code of specified length
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < codeLength; i++) {
                int randomIndex = random.nextInt(characters.length());
                sb.append(characters.charAt(randomIndex));
            }
            shortCode = sb.toString();

            // Ensure code is unique
            if (!shortToLong.containsKey(shortCode)) {
                break;
            }
        }

        // Store both mappings
        longToShort.put(longUrl, shortCode);
        shortToLong.put(shortCode, longUrl);

        return baseUrl + shortCode;
    }

    public String decode(String shortUrl) {
        // Extract the code from the short URL
        // Last part after the final slash is our code
        String[] parts = shortUrl.split("/");
        String shortCode = parts[parts.length - 1];

        // Return the original URL or empty string if not found
        return shortToLong.getOrDefault(shortCode, "");
    }
}

// Time: O(1) average for both encode and decode | Space: O(n) where n is number of URLs
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Encode:** O(1) average case. The while loop for generating unique codes typically runs only once because with 62^6 ≈ 56 billion possibilities, collisions are extremely rare. Hash map operations (insertion and lookup) are O(1) on average.
- **Decode:** O(1) average case. Just a hash map lookup and string splitting.

**Space Complexity:** O(n) where n is the number of unique URLs encoded. We store two entries per URL (one in each dictionary), so 2n entries total, which is O(n).

## Common Mistakes

1. **Not checking for duplicate URLs:** Encoding the same URL multiple times should return the same short URL. Without the long→short map check, you'll create duplicate entries.

2. **Using predictable sequential codes:** Codes like 0, 1, 2, 3... are security issues in real systems because they're easy to guess. Always use random or hashed codes.

3. **Forgetting to handle the base URL:** When decoding, candidates sometimes forget to extract just the code part from "http://tinyurl.com/abc123". Always split by "/" and take the last part.

4. **Not considering collisions:** With random generation, there's a tiny chance of duplicate codes. The while loop ensures uniqueness, but some candidates skip this check.

5. **Using only one dictionary:** You need bidirectional lookup. One dictionary for encoding (long→short) and another for decoding (short→long).

## When You'll See This Pattern

This bidirectional mapping pattern appears in several other problems:

1. **Two Sum (LeetCode #1):** While different in implementation, it uses the same core idea of maintaining a mapping to quickly check for existing values.

2. **LRU Cache (LeetCode #146):** Uses multiple data structures (hash map + doubly linked list) to maintain bidirectional relationships for O(1) operations.

3. **Logger Rate Limiter (LeetCode #359):** Uses a hash map to track timestamps of messages, similar to how we track URLs.

4. **Design Underground System (LeetCode #1396):** Another system design problem that uses multiple hash maps to track different relationships between entities.

The key pattern is using hash maps/dictionaries for O(1) lookups when you need to maintain relationships between different representations of data.

## Key Takeaways

1. **Bidirectional mapping requires two data structures:** When you need to look up A→B and B→A efficiently, maintain separate mappings for each direction.

2. **Check for existing entries before creating new ones:** This prevents duplicates and ensures consistency. Always check if the input already exists in your mapping.

3. **Random/unique ID generation needs collision handling:** Even with low probability, always include a uniqueness check when generating random identifiers.

4. **System design problems often test hash map mastery:** Many practical systems rely on efficient key-value lookups. Mastering hash maps is crucial for both coding interviews and real-world development.

[Practice this problem on CodeJeet](/problem/encode-and-decode-tinyurl)
