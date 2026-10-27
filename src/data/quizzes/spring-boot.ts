import type { Quiz } from './types';

export default {
  id: 'spring-boot',
  title: 'Spring Core & Boot 4',
  track: 'spring-boot',
  description: 'DI, bean scopes, auto-configuration, configuration, AOP proxies, REST and what changed in Spring Boot 4.',
  questions: [
    {
      q: 'Which annotations does `@SpringBootApplication` combine?',
      options: [
        '`@Configuration`, `@EnableWebMvc`, `@ComponentScan`',
        '`@SpringBootConfiguration`, `@EnableAutoConfiguration`, `@ComponentScan`',
        '`@Component`, `@EnableAutoConfiguration`, `@EnableTransactionManagement`',
        '`@SpringBootConfiguration`, `@EnableCaching`, `@ComponentScan`',
      ],
      answer: 1,
      explain: 'It is a meta-annotation for configuration, auto-configuration and component scanning of its package.',
    },
    {
      q: 'What is the default scope of a Spring bean?',
      options: ['prototype', 'singleton — one per JVM', 'singleton — one per ApplicationContext', 'request'],
      answer: 2,
      explain: 'Singleton means one instance per container, not per JVM — two contexts can each hold one.',
    },
    {
      q: 'Why is constructor injection preferred over field injection?',
      options: [
        'It is the only kind Spring Boot 4 supports',
        'Dependencies are explicit, fields can be final, and tests don’t need reflection',
        'It starts the application faster',
        'It allows circular dependencies',
      ],
      answer: 1,
      explain: 'Constructor injection produces complete, immutable objects that are trivially unit-testable — and it surfaces circular dependencies instead of hiding them.',
    },
    {
      q: 'Two beans implement `PaymentGateway`. Which does NOT resolve the ambiguity?',
      options: ['`@Primary` on one', '`@Qualifier` at the injection point', 'Injecting `List<PaymentGateway>`', '`@Lazy` on the injection point'],
      answer: 3,
      explain: '`@Lazy` only defers resolution — you still get `NoUniqueBeanDefinitionException`.',
    },
    {
      q: 'How does auto-configuration avoid overriding a bean you defined yourself?',
      options: ['`@Order`', '`@ConditionalOnMissingBean`', '`@Primary`', '`@DependsOn`'],
      answer: 1,
      explain: 'Auto-configured beans back off when a bean of that type already exists.',
    },
    {
      q: 'Which property source has the HIGHEST precedence?',
      options: ['`application.yml` inside the jar', 'Profile-specific `application-prod.yml`', 'OS environment variables', 'Command-line arguments'],
      answer: 3,
      explain: 'Command-line args beat system properties, which beat env vars, which beat config files.',
    },
    {
      q: 'Inside `OrderService`, `importAll()` calls `this.save()`, which is `@Transactional`. What happens?',
      options: [
        'A new transaction starts for each `save()`',
        'No transaction is started — the call bypasses the proxy',
        'Spring throws `IllegalStateException`',
        'It works only with CGLIB proxies',
      ],
      answer: 1,
      explain: 'Transactional behaviour lives in the proxy; self-invocation goes straight to the target object.',
    },
    {
      q: 'Which methods can a CGLIB-based Spring AOP proxy NOT intercept?',
      options: ['public methods', 'protected methods', '`final` and `private` methods', 'methods returning `void`'],
      answer: 2,
      explain: 'CGLIB overrides methods in a generated subclass, which is impossible for final or private methods.',
    },
    {
      q: 'In Spring Boot 4, what replaces `@MockBean` in tests?',
      options: ['`@Mock`', '`@MockitoBean`', '`@TestBean`', '`@InjectMocks`'],
      answer: 1,
      explain: '`@MockBean` and `@SpyBean` were removed in Boot 4 in favour of Spring Framework’s `@MockitoBean` and `@MockitoSpyBean`.',
    },
    {
      q: 'Which JSON library does Spring Boot 4 use by default?',
      options: ['Gson', 'Jackson 2', 'Jackson 3', 'JSON-B (Yasson)'],
      answer: 2,
      explain: 'Boot 4 defaults to Jackson 3 (`tools.jackson` packages); annotations remain in `com.fasterxml.jackson.annotation`.',
    },
    {
      q: 'How does Spring Framework 7 support API versioning in controllers?',
      options: [
        'Only by putting `/v1` in every path manually',
        'A `version` attribute on request mappings plus a configured version resolution strategy',
        'A separate `@ApiVersion` controller per version',
        'It doesn’t — you need Spring Cloud',
      ],
      answer: 1,
      explain: 'E.g. `@GetMapping(path = "/{id}", version = "1.1")` with the version read from a header, query param, path or media type.',
    },
    {
      q: 'Which client is the recommended synchronous HTTP client for new Spring Boot 4 servlet apps?',
      options: ['`RestTemplate`', '`RestClient`', '`HttpURLConnection`', '`WebClient` with `.block()`'],
      answer: 1,
      explain: '`RestTemplate` is in maintenance mode; `RestClient` is its fluent replacement (and HTTP service clients build on it).',
    },
    {
      q: 'What status code should a successful resource creation return?',
      options: ['200 OK', '201 Created with a Location header', '202 Accepted', '204 No Content'],
      answer: 1,
      explain: 'Return 201 and point to the new resource with `Location`, e.g. `ResponseEntity.created(uri).body(dto)`.',
    },
    {
      q: 'A request body fails `@Valid` validation. What does Spring MVC throw?',
      options: ['`ConstraintViolationException`', '`MethodArgumentNotValidException`', '`BindException`', '`IllegalArgumentException`'],
      answer: 1,
      explain: 'It is mapped to 400 Bad Request; handle it in a `@RestControllerAdvice` to return a ProblemDetail with field errors.',
    },
    {
      q: 'What does `spring.threads.virtual.enabled=true` do on Java 21+?',
      options: [
        'Makes the JVM use ZGC',
        'Runs Tomcat requests, @Async and @Scheduled work on virtual threads',
        'Enables reactive WebFlux',
        'Disables the HikariCP pool',
      ],
      answer: 1,
      explain: 'Blocking I/O code then scales like non-blocking code; downstream limits like the DB pool become the throttle.',
    },
    {
      q: 'Which annotations does Spring Framework 7 provide in core for resilience?',
      options: ['`@CircuitBreaker` and `@Bulkhead`', '`@Retryable` and `@ConcurrencyLimit`', '`@HystrixCommand`', '`@RateLimiter` and `@TimeLimiter`'],
      answer: 1,
      explain: 'Enable them with `@EnableResilientMethods`. Circuit breakers still come from Resilience4j.',
    },
  ],
} satisfies Quiz;
