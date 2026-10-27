import type { Quiz } from './types';

export default {
  id: 'spring-data-security',
  title: 'Data, Security & Production',
  track: 'spring-boot',
  description: 'JPA and transactions, Spring Security and JWT, testing, caching, Kafka and resilience.',
  questions: [
    {
      q: 'You load 50 orders and then call `order.getLines().size()` on each. How many queries run with default lazy loading?',
      options: ['1', '2', '50', '51'],
      answer: 3,
      explain: 'One query for the orders plus one per order — the N+1 problem. Fix with a fetch join, entity graph, batch fetching or a projection.',
    },
    {
      q: 'What is the default fetch type of `@ManyToOne`?',
      options: ['LAZY', 'EAGER', 'It depends on the database', 'There is no default'],
      answer: 1,
      explain: 'To-one associations are EAGER by default in JPA — set `fetch = FetchType.LAZY` explicitly.',
    },
    {
      q: 'A `@Transactional` method throws a checked `IOException`. By default the transaction…',
      options: ['rolls back', 'commits', 'is marked rollback-only but commits', 'is suspended'],
      answer: 1,
      explain: 'Spring rolls back only on unchecked exceptions and errors unless you set `rollbackFor`.',
    },
    {
      q: 'Which propagation runs an audit write in an independent transaction that survives the caller’s rollback?',
      options: ['`REQUIRED`', '`SUPPORTS`', '`REQUIRES_NEW`', '`MANDATORY`'],
      answer: 2,
      explain: '`REQUIRES_NEW` suspends the current transaction and uses a second connection.',
    },
    {
      q: 'What does a `@Version` field enable?',
      options: ['Pessimistic locking', 'Optimistic locking', 'Entity auditing', 'Soft deletes'],
      answer: 1,
      explain: 'Updates include `where version = ?`; a concurrent change causes an optimistic locking failure you can map to 409.',
    },
    {
      q: 'Why disable `spring.jpa.open-in-view` in a REST API?',
      options: [
        'It is required for Hibernate 7',
        'It hides lazy-loading queries outside the service layer and holds connections longer',
        'It disables transactions',
        'It breaks JSON serialisation of records',
      ],
      answer: 1,
      explain: 'Fetch what you need inside transactional service methods instead.',
    },
    {
      q: 'Which `ddl-auto` setting is appropriate for production with Flyway?',
      options: ['`create-drop`', '`update`', '`validate`', '`create`'],
      answer: 2,
      explain: 'Let migrations own the schema; `validate` checks entities against it.',
    },
    {
      q: 'In Spring Security, `hasRole("ADMIN")` checks for which authority?',
      options: ['`ADMIN`', '`ROLE_ADMIN`', '`SCOPE_ADMIN`', '`AUTH_ADMIN`'],
      answer: 1,
      explain: 'Roles are authorities with the `ROLE_` prefix, which `hasRole` adds for you.',
    },
    {
      q: 'When is disabling CSRF protection acceptable?',
      options: [
        'Always, in Spring Boot 4',
        'For stateless APIs authenticated with an `Authorization` header',
        'For any app using HTTPS',
        'For session-based browser apps',
      ],
      answer: 1,
      explain: 'CSRF exploits automatically-sent cookies; bearer tokens in headers are not sent automatically by browsers.',
    },
    {
      q: 'A resource server validates JWTs signed with RS256. What does it need?',
      options: [
        'The authorization server’s private key',
        'The issuer’s public keys (JWKS)',
        'A shared HMAC secret',
        'A database of issued tokens',
      ],
      answer: 1,
      explain: 'Asymmetric signatures are verified with public keys, usually discovered via `issuer-uri`.',
    },
    {
      q: 'Which test slice loads controllers but not services or repositories?',
      options: ['`@SpringBootTest`', '`@WebMvcTest`', '`@DataJpaTest`', '`@JsonTest`'],
      answer: 1,
      explain: 'Mock the service layer with `@MockitoBean`.',
    },
    {
      q: 'What does `@ServiceConnection` on a Testcontainers bean do?',
      options: [
        'Starts the container in a separate JVM',
        'Lets Boot derive connection properties from the running container',
        'Registers the container as a Spring Cloud service',
        'Disables auto-configuration for that service',
      ],
      answer: 1,
      explain: 'No more `@DynamicPropertySource` boilerplate for URLs, ports and credentials.',
    },
    {
      q: 'Kafka guarantees message ordering…',
      options: ['across the whole topic', 'within a partition', 'within a consumer group', 'only with exactly-once enabled'],
      answer: 1,
      explain: 'Use the entity id as the key so all its events land in the same partition.',
    },
    {
      q: 'What is the transactional outbox pattern for?',
      options: [
        'Batching database writes',
        'Reliably publishing events together with a database change',
        'Encrypting messages at rest',
        'Retrying failed HTTP calls',
      ],
      answer: 1,
      explain: 'The event row is committed in the same transaction as the business data and relayed to the broker afterwards.',
    },
    {
      q: 'A circuit breaker is OPEN. What happens to new calls?',
      options: [
        'They are queued until it closes',
        'They fail fast (or use a fallback) without calling the dependency',
        'They are retried three times',
        'They go through with a longer timeout',
      ],
      answer: 1,
      explain: 'After the wait duration it moves to HALF_OPEN and lets a few trial calls through.',
    },
    {
      q: 'What does `@Cacheable(sync = true)` help with?',
      options: [
        'Keeping Redis and the database in sync',
        'Making only one thread compute a missing entry, reducing stampedes',
        'Synchronous cache eviction',
        'Distributed locking across instances',
      ],
      answer: 1,
      explain: 'It coalesces concurrent misses for the same key within one instance; it does not lock across a cluster.',
    },
  ],
} satisfies Quiz;
