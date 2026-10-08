# Working in this app

Implement the change request you have been given. A single change may span the
database schema, the server, and the front end.

- **`data-testid` is an immutable public API.** Expose a stable `data-testid` on every
  element and value a feature surfaces, and **never rename or remove a `data-testid`
  that already exists** — it is how the app is tested. Match exactly the `data-testid`
  values your task's test expects.
- **Run `bin/e2e`** to build the app, start it, run your test, and stop — use it to
  check your work. The `bin/` scripts and these two instruction files are fixed; do
  not edit them.

---

*The following is Angular's official best-practices rules file, included verbatim from
<https://angular.dev/assets/context/best-practices.md>. It is part of the Angular
architecture.*

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

---

*The following is OfficeFloor's own agent guidance for this stack, included verbatim
from <https://officefloor.net/AGENTS.md>. It is part of the OfficeFloor architecture.*

## OfficeFloor REST endpoints

Applies when adding or changing REST endpoints. This project serves REST through
OfficeFloor Function Injection, **not** Spring MVC controllers: each endpoint is a
pipeline of small function classes wired together in YAML.

- Requires the OfficeFloor Spring Boot starter in the build:
  `officefloor-rest-spring-boot-4-starter` (Spring Boot 4.x) or
  `officefloor-rest-spring-boot-3-starter` (Spring Boot 3.x). Without it these YAML
  files are inert. (Rules below track these starter versions.)
- Define each endpoint as a YAML file under `src/main/resources/officefloor/rest/`,
  named `<path>.<METHOD>.yml` (e.g. `owners/{ownerId}.PUT.yml` → `PUT /owners/{ownerId}`).
- One small function class per step; compose steps with `next:` and `outputs:`.
- Do NOT generate `@RestController`, `@GetMapping` or `@PostMapping`.
- Transactions: `govern: [ transaction ]` on steps, not `@Transactional`.
- Errors: a handler YAML in `officefloor/escalation/`, not `@ControllerAdvice`.

### Worked example — `PUT /owners/{ownerId}`

The whole shape of an endpoint. The sections after this one are the reference.

`src/main/resources/officefloor/rest/owners/{ownerId}.PUT.yml`

```yaml
# First step runs first. Validate before Load so an invalid body is a 400,
# not masked by a 404 for a missing owner.
validate:
  class: com.example.owner.ValidateOwner
  next: load
load:
  class: com.example.owner.LoadOwner
  next: apply
apply:
  class: com.example.owner.ApplyOwner
  govern: [ transaction ]
  next: save
save:
  class: com.example.owner.SaveOwner
  govern: [ transaction ]
  next: respond
respond:
  class: com.example.owner.RespondWithOwner
```

```java
// One public method each. State moves by Out<T> (set) → @Val (read), matched by type.
public class ValidateOwner {
  public void validate(@RequestBody @Valid OwnerRequest request, Out<OwnerRequest> body) {
    body.set(request); // body read once here; republished for later steps
  }
}
public class LoadOwner {
  public void load(@PathVariable("ownerId") int ownerId, OwnerRepository repository,
      Out<Owner> ownerOut) throws OwnerNotFoundException {
    Owner owner = repository.findById(ownerId);
    if (owner == null) throw new OwnerNotFoundException(ownerId); // handled below
    ownerOut.set(owner);
  }
}
public class ApplyOwner { // @Val yields the stored object, not a copy — mutate in place
  public void apply(@Val OwnerRequest request, @Val Owner owner) {
    owner.setFirstName(request.firstName());
    owner.setLastName(request.lastName());
  }
}
public class SaveOwner {
  public void save(@Val Owner owner, OwnerRepository repository) {
    repository.save(owner);
  }
}
public class RespondWithOwner {
  public void respond(@Val Owner owner, ObjectResponse<OwnerResponse> response) {
    response.send(OwnerResponse.from(owner)); // this step responds; 200 by default
  }
}
```

`src/main/resources/officefloor/escalation/com.example.owner.OwnerNotFoundException.yml`

```yaml
handle:
  class: com.example.owner.HandleOwnerNotFound
```

```java
public class HandleOwnerNotFound {
  public void handle(@Parameter OwnerNotFoundException ex,
      ObjectResponse<ResponseEntity<String>> response) {
    response.send(new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND));
  }
}
```

### Step wiring

Each top-level YAML entry is a developer-chosen step name; the first is the entry
point. `class:` names the function. **Give each function class exactly one public
method** — several public methods fail at start-up unless every reference adds
`method:`.

- `next: <step>` — run that step afterwards. This step's return value arrives there
  as `@Parameter T`.
- `outputs: { <name>: <step> }` — conditional branches. Declare a
  `@FunctionalInterface` parameter annotated `@Flow("<name>")` and call it to take the
  branch; not calling it short-circuits.

### Function parameters

Declare only what the step needs; they resolve by role:

- `@PathVariable`, `@RequestParam`, `@RequestBody` — Spring MVC annotations work.
- Spring beans (repositories, mappers, services) — injected by type as normal.
- `ObjectResponse<T>` (`net.officefloor.web.ObjectResponse`) — send the response with
  `response.send(dto)`. This is how a step responds; wrap as
  `ObjectResponse<ResponseEntity<T>>` to set status explicitly.
- `@Parameter T` (`net.officefloor.plugin.section.clazz.Parameter`) — the previous
  step's return value, a `@Flow` argument, or a thrown escalation.

### Passing state between steps — `Out<T>` / `@Val`

Steps do not call each other. Beyond the single `@Parameter` hand-off, publish state
into a variable (`net.officefloor.plugin.variable`):

- Producer declares `Out<T>` and calls `set(...)`; consumer declares `@Val T`.
- Matching is **by type** — two variables of the same type in one pipeline need a
  `@Qualifier` annotation to disambiguate.
- `@Val` yields the same object the producer stored, **not a copy** — so an `Apply`
  step mutates the entity in place and later steps see the change.

### Naming

Verb plus entity: `Load<E>` (fetch by path variable, publishes `Out<E>`, throws when
absent) · `Build<E>` (construct from body) · `Validate<E>` (bind and validate the body,
publish it) · `Apply<E>` (mutate) · `Save<E>` · `Delete<E>` · `RespondWith<E>` (200) ·
`RespondWith<E>Created` (201) · `RespondWithNoContent` (204).

Keep DTOs at the edges — request body in at the first step, response DTO out at the
responder. Steps in between work with entities.

### Request body and validation

- The HTTP body can be read only once: **only one step per pipeline may bind
  `@RequestBody`**. A second binding fails at runtime. When later steps need it, the
  first step publishes it as a variable.
- `@Valid` runs before that step's method body, so step order decides when validation
  happens. Put the validating step first — otherwise a missing id returns 404 before an
  invalid body can return 400.

### Transactions

`govern: [ transaction ]` for writes, `govern: [ readonly-transaction ]` for reads,
listed on **every** step it covers. Both are provided by the starter. Governance spans
the pipeline, so the request commits once at the end.

### Errors

Functions throw; handlers respond. The exception must be **checked** (`extends
Exception`) so it appears in the `throws` clause. Put the handler in
`officefloor/escalation/<fully.qualified.ExceptionClass>.yml`, taking the exception as
`@Parameter` and responding via `ObjectResponse`. Matching is most-specific-first;
anything unmatched falls through to Spring `@RestControllerAdvice`.

### Security

Guard a whole endpoint file with a Spring Security SpEL expression:

```yaml
composition:
  authorize: "hasRole('OWNER_ADMIN')"
```

- Full reference: https://officefloor.net/llms.txt
