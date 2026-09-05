# Build domain-specific CRDTs for learning data

Codejeet will implement its Progress Observed-Remove Set and server-sequenced LWW Problem Note register in TypeScript rather than adopt a general-purpose CRDT library. The implementation is intentionally limited to Codejeet's two replicated data types so we can learn the underlying algorithms while sharing the same code across the browser and Cloudflare runtime; accepting ownership of their correctness is the trade-off.
