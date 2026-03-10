---
title: "How to Solve Unique Email Addresses — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Unique Email Addresses. Easy difficulty, 67.8% acceptance rate. Topics: Array, Hash Table, String."
date: "2027-03-23"
category: "dsa-patterns"
tags: ["unique-email-addresses", "array", "hash-table", "string", "easy"]
---

# How to Solve Unique Email Addresses

This problem asks us to count the number of unique email addresses from a given list. The twist is that email addresses have special rules: dots (`.`) in the local name are ignored, and everything after a plus (`+`) in the local name is ignored. While the problem is straightforward once you understand these rules, it's a great exercise in careful string parsing and using hash sets for deduplication.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have these emails:

```
["test.email+alex@leetcode.com", "test.e.mail+bob.cathy@leetcode.com", "testemail+david@lee.tcode.com"]
```

**Step 1: Process "test.email+alex@leetcode.com"**

- Split at `@`: local = `"test.email+alex"`, domain = `"leetcode.com"`
- Process local name:
  - Find `+` at position 9: ignore everything from index 9 onward → `"test.email"`
  - Remove all dots → `"testemail"`
- Recombine: `"testemail@leetcode.com"`

**Step 2: Process "test.e.mail+bob.cathy@leetcode.com"**

- Split at `@`: local = `"test.e.mail+bob.cathy"`, domain = `"leetcode.com"`
- Process local name:
  - Find `+` at position 11: ignore everything from index 11 onward → `"test.e.mail"`
  - Remove all dots → `"testemail"`
- Recombine: `"testemail@leetcode.com"` (same as first!)

**Step 3: Process "testemail+david@lee.tcode.com"**

- Split at `@`: local = `"testemail+david"`, domain = `"lee.tcode.com"`
- Process local name:
  - Find `+` at position 9: ignore everything from index 9 onward → `"testemail"`
  - No dots to remove
- Recombine: `"testemail@lee.tcode.com"`

We end up with 2 unique addresses: `"testemail@leetcode.com"` and `"testemail@lee.tcode.com"`.

## Brute Force Approach

A naive approach would be to process each email according to the rules, then compare it against all previously processed emails to check for uniqueness. This would involve:

1. For each email in the list
2. Process it according to the rules (remove dots, ignore after plus)
3. Compare it with every other processed email to check if it's unique
4. Count the unique ones

The problem with this approach is the comparison step. If we have `n` emails, and we compare each new email against all previous ones, we end up with O(n²) comparisons. While this would technically work for small inputs, it's inefficient and doesn't demonstrate good algorithmic thinking.

## Optimal Solution

The optimal solution uses a hash set to track unique processed emails. Hash sets provide O(1) average time complexity for insertions and lookups, making the overall solution O(n) where n is the total number of characters across all emails.

The key steps are:

1. Create an empty set to store unique processed emails
2. For each email in the input list:
   - Split the email at `@` into local and domain parts
   - Process the local part:
     - Find the index of `+` (if any) and take only the substring before it
     - Remove all `.` characters from this substring
   - Combine the processed local part with the domain using `@`
   - Add this processed email to the set
3. Return the size of the set (number of unique emails)

<div class="code-group">

```python
# Time: O(n * m) where n is number of emails, m is average email length
# Space: O(n * m) for the set storing processed emails
def numUniqueEmails(emails):
    """
    Count unique email addresses after applying processing rules.

    Rules:
    1. In local name, dots (.) are ignored
    2. In local name, everything after plus (+) is ignored
    3. Domain name is unchanged

    Args:
        emails: List of email strings

    Returns:
        Number of unique email addresses after processing
    """
    unique_emails = set()  # Set to store unique processed emails

    for email in emails:
        # Step 1: Split email into local and domain parts
        # '@' is guaranteed to exist in valid emails
        local, domain = email.split('@')

        # Step 2: Process local name
        # Find index of '+' if it exists
        plus_index = local.find('+')
        if plus_index != -1:
            # If '+' exists, take only the part before it
            local = local[:plus_index]

        # Remove all dots from the local name
        # Using replace() is more efficient than iterating character by character
        local = local.replace('.', '')

        # Step 3: Reconstruct the processed email
        processed_email = local + '@' + domain

        # Step 4: Add to set (duplicates are automatically ignored)
        unique_emails.add(processed_email)

    # The size of the set is the number of unique emails
    return len(unique_emails)
```

```javascript
// Time: O(n * m) where n is number of emails, m is average email length
// Space: O(n * m) for the set storing processed emails
function numUniqueEmails(emails) {
  /**
   * Count unique email addresses after applying processing rules.
   *
   * Rules:
   * 1. In local name, dots (.) are ignored
   * 2. In local name, everything after plus (+) is ignored
   * 3. Domain name is unchanged
   *
   * @param {string[]} emails - Array of email strings
   * @return {number} Number of unique email addresses after processing
   */
  const uniqueEmails = new Set(); // Set to store unique processed emails

  for (const email of emails) {
    // Step 1: Split email into local and domain parts
    // '@' is guaranteed to exist in valid emails
    const [local, domain] = email.split("@");

    // Step 2: Process local name
    // Find index of '+' if it exists
    const plusIndex = local.indexOf("+");
    let processedLocal = local;

    if (plusIndex !== -1) {
      // If '+' exists, take only the part before it
      processedLocal = local.substring(0, plusIndex);
    }

    // Remove all dots from the local name
    // Using split/join is more efficient than regex for this simple case
    processedLocal = processedLocal.split(".").join("");

    // Step 3: Reconstruct the processed email
    const processedEmail = processedLocal + "@" + domain;

    // Step 4: Add to set (duplicates are automatically ignored)
    uniqueEmails.add(processedEmail);
  }

  // The size of the set is the number of unique emails
  return uniqueEmails.size;
}
```

```java
// Time: O(n * m) where n is number of emails, m is average email length
// Space: O(n * m) for the set storing processed emails
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int numUniqueEmails(String[] emails) {
        /**
         * Count unique email addresses after applying processing rules.
         *
         * Rules:
         * 1. In local name, dots (.) are ignored
         * 2. In local name, everything after plus (+) is ignored
         * 3. Domain name is unchanged
         *
         * @param emails Array of email strings
         * @return Number of unique email addresses after processing
         */
        Set<String> uniqueEmails = new HashSet<>();  // Set to store unique processed emails

        for (String email : emails) {
            // Step 1: Split email into local and domain parts
            // '@' is guaranteed to exist in valid emails
            String[] parts = email.split("@");
            String local = parts[0];
            String domain = parts[1];

            // Step 2: Process local name
            // Find index of '+' if it exists
            int plusIndex = local.indexOf('+');
            if (plusIndex != -1) {
                // If '+' exists, take only the part before it
                local = local.substring(0, plusIndex);
            }

            // Remove all dots from the local name
            // Using replace() is more efficient than manual iteration
            local = local.replace(".", "");

            // Step 3: Reconstruct the processed email
            String processedEmail = local + "@" + domain;

            // Step 4: Add to set (duplicates are automatically ignored)
            uniqueEmails.add(processedEmail);
        }

        // The size of the set is the number of unique emails
        return uniqueEmails.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m) where n is the number of emails and m is the average length of an email. We process each email once, and for each email, we perform operations (split, find, replace) that take time proportional to the email's length.

**Space Complexity:** O(n × m) in the worst case where all emails are unique after processing. We store each processed email in the hash set. The space is proportional to the total number of characters across all unique processed emails.

## Common Mistakes

1. **Forgetting that dots are only ignored in the local name, not the domain**: Some candidates remove dots from the entire email instead of just the local part. Remember: `test.email@leet.code.com` becomes `testemail@leet.code.com`, not `testemail@leetcodecom`.

2. **Incorrect order of operations**: The plus rule should be applied before removing dots. If you remove dots first, then look for plus, you might miss plus signs that were originally after dots. Example: `"t.est+hello@domain.com"` should become `"test@domain.com"`, not `"test+hello@domain.com"`.

3. **Using inefficient string operations**: Some candidates iterate through each character and build new strings character by character. While this works, using built-in methods like `replace()` or `split()` is more efficient and cleaner.

4. **Not handling multiple plus signs**: The problem states "everything after a plus" is ignored, so `"test+++hello@domain.com"` becomes `"test@domain.com"`. Some implementations only handle the first plus sign, which is correct, but be aware that `find()` or `indexOf()` methods typically return the first occurrence.

## When You'll See This Pattern

This problem combines string manipulation with hash set deduplication, a pattern that appears in many coding problems:

1. **Group Anagrams (LeetCode 49)**: Similar concept of processing strings (sorting characters) and using the processed form as a key in a hash map to group similar items.

2. **Valid Anagram (LeetCode 242)**: Involves processing strings (counting character frequencies) and comparing the processed forms.

3. **Find Common Characters (LeetCode 1002)**: Uses frequency counting and set-like operations to find common elements across multiple strings.

The core pattern is: "Process each item according to rules, then use the processed form for comparison/deduplication using efficient data structures."

## Key Takeaways

1. **Hash sets are perfect for deduplication**: When you need to track unique items, a hash set provides O(1) average time for insertions and lookups, making it much more efficient than comparing against all previous items.

2. **Order of string operations matters**: Always think carefully about which transformations should be applied first. In this case, handling the plus sign before removing dots is crucial for correctness.

3. **Split complex problems into clear steps**: Breaking the problem into (1) split email, (2) process local name, (3) reconstruct, (4) deduplicate makes the solution easier to understand, implement, and debug.

[Practice this problem on CodeJeet](/problem/unique-email-addresses)
