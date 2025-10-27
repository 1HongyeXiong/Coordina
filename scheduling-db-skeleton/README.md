# Scheduling DB Skeleton (TypeScript + Mongoose)

Minimal "hello world" skeleton that mirrors your UML. Fields/enums are defined; method bodies throw `TODO` so you can implement them yourself.

## Quickstart
```bash
cp .env.example .env
npm i
npm run hello
```

## Structure
```
src/
  db/connect.ts
  models/
    types.ts
    index.ts
    user.model.ts
    event.model.ts
    eventTime.model.ts
    availability.model.ts
  repo/
    events.repo.ts
  scripts/
    hello.ts
```
