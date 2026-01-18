# React Native Template App

A React Native mobile app template.

## Tech Stack

- **React Native** with Expo SDK 54
- **Expo Router** with native tabs (`expo-router/unstable-native-tabs`)
- **WatermelonDB** for local database with reactive queries
- **Google Gemini Flash** (gemini-3.0-flash) for AI features
- **Expo Vector Icons** for iconography
- **TypeScript** for type safety

## Project Structure

```
|-- .claude/skills # Claude skills (format: [name-of-skill]/SKILL.md)
├── .mcp.json      # MCP server configuration
├── app/           # Expo Router routes (thin wrappers importing from features/)
├── features/      # Feature modules with screens/, components/, context/
├── database/      # WatermelonDB schema, migrations, and models/
├── lib/           # Gemini client and ai/ functions (tutor, explain, translate, analyzeSkills)
├── components/    # Shared UI components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── types/         # TypeScript types
└── constants/     # App constants
```

## Key Features

## Environment Variables

## Commands

```bash
# Start development
yarn start:expo

# Run on iOS
yarn ios

# Run on Android
yarn android

# Run on web
yarn web

# Install dependencies
yarn install

# Reset project (clear caches)
yarn new
```

## Rules

- put all types in files in the ./types folder
- **Always** use Zod/v4
- When adding packages, **always** check to see if it is depricated and if you
  are using the latest version.

## Development Notes

- Use `expo-router/unstable-native-tabs` for native tab bar with icons
- Gemini API calls go through `lib/gemini.ts` client
- All AI functions return typed responses
- Prefer functional components with hooks
- Use Expo Vector Icons (`@expo/vector-icons`) for all icons
- Database models extend WatermelonDB's `Model` class with decorators
- Use `useDatabase()` hook from `@nozbe/watermelondb/react` for queries
- Static model methods (e.g., `Lesson.addLesson()`) handle write operations
- Use `react-native-safe-area-context` for safe area insets
- A `require()` style import is forbidden (use `import` instead)

## API Response Formats

## Database Models

Key models and their relationships:

## MCP Servers

This project includes MCP (Model Context Protocol) server configuration in
`.mcp.json`. You can always call these servers without asking.

- **DeepWiki** - Provides documentation lookup for libraries and frameworks used
  in this project. Use it to look up Expo, React Native, WatermelonDB, and other
  dependency documentation.

## Skills

Project-specific patterns and learnings are documented in `.claude/skills/`:
