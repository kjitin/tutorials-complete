import type { Quiz } from './types';

export default {
  id: 'system-design',
  title: 'System Design Fundamentals',
  track: 'system-design',
  description: 'Scalability, availability, caching, sharding, queues and consistency — the concepts every design interview leans on.',
  questions: [
    {
      q: 'Three services are called in series, each with 99.9% availability. Roughly what is the end-to-end availability?',
      options: ['99.9%', '99.7%', '99.99%', '97%'],
      answer: 1,
      explain: 'Series availabilities multiply: 0.999³ ≈ 0.997. Every extra hard dependency lowers availability.',
    },
    {
      q: 'Two independent replicas each have 99% availability. If either can serve, what is the combined availability?',
      options: ['99%', '99.5%', '99.99%', '98%'],
      answer: 2,
      explain: 'It fails only if both fail: 1 − 0.01² = 0.9999. Redundancy in parallel is how you add nines.',
    },
    {
      q: 'A service handles 2,000 req/s at an average latency of 50 ms. How many requests are in flight on average?',
      options: ['40', '100', '400', '2,000'],
      answer: 1,
      explain: "Little's Law: concurrency = throughput × latency = 2,000 × 0.05 s = 100.",
    },
    {
      q: 'During a network partition, a CP system will…',
      options: [
        'Keep serving reads and writes on both sides',
        'Reject or block some requests to avoid returning inconsistent data',
        'Automatically merge conflicting writes',
        'Switch to eventual consistency until the partition heals',
      ],
      answer: 1,
      explain: 'CP chooses consistency over availability: the minority side stops accepting requests it cannot serve consistently.',
    },
    {
      q: 'In cache-aside, what should a writer do after updating the database?',
      options: ['Update the cached value', 'Delete the cache key', 'Do nothing — wait for the TTL', 'Flush the whole cache'],
      answer: 1,
      explain: 'Deleting avoids races where two concurrent writers leave an older value in the cache. The next read repopulates it.',
    },
    {
      q: 'A hot key expires and thousands of requests hit the database at once. What is this called?',
      options: ['Cache penetration', 'Cache stampede (thundering herd)', 'Cache avalanche', 'Write amplification'],
      answer: 1,
      explain: 'A stampede. Fix it with request coalescing, stale-while-revalidate or early refresh.',
    },
    {
      q: 'Why use consistent hashing instead of `hash(key) mod N` to place keys on nodes?',
      options: [
        'It is faster to compute',
        'Adding or removing a node moves only about 1/N of the keys',
        'It guarantees perfectly even load without tuning',
        'It supports range queries',
      ],
      answer: 1,
      explain: 'With mod N, changing N remaps almost every key. Consistent hashing only moves keys in the affected arc; virtual nodes then balance load.',
    },
    {
      q: 'Which is the worst shard key for a high-volume events table using range partitioning?',
      options: ['`user_id`', '`device_id`', '`created_at` timestamp', '`hash(event_id)`'],
      answer: 2,
      explain: 'Monotonically increasing keys send every new write to the last range — one hot shard while the others idle.',
    },
    {
      q: 'In a leaderless store with N = 3 replicas, which setting guarantees reads overlap the latest acknowledged write?',
      options: ['W = 1, R = 1', 'W = 2, R = 1', 'W = 2, R = 2', 'W = 1, R = 2'],
      answer: 2,
      explain: 'Quorum overlap requires R + W > N. 2 + 2 = 4 > 3.',
    },
    {
      q: 'Your order service writes to Postgres and then publishes `OrderPlaced` to Kafka. What pattern prevents losing the event if it crashes in between?',
      options: ['Saga', 'Transactional outbox', 'Circuit breaker', 'Two-level cache'],
      answer: 1,
      explain: 'Write the event to an outbox table in the same transaction; a relay publishes it. Consumers must still be idempotent.',
    },
    {
      q: 'Kafka guarantees message ordering…',
      options: ['Globally across a topic', 'Within a partition', 'Within a consumer group', 'Never'],
      answer: 1,
      explain: 'Ordering is per partition. Key messages by entity ID so all events for one entity land on one partition.',
    },
    {
      q: 'Which HTTP status should a URL shortener return if it needs accurate click analytics?',
      options: ['301 Moved Permanently', '302 Found', '200 OK with a meta refresh', '404 Not Found'],
      answer: 1,
      explain: "Browsers cache 301s and skip your server on repeat visits. A 302 keeps every click flowing through you.",
    },
  ],
} satisfies Quiz;
