# Contributing to PayD

First off, thank you for considering contributing to PayD! It's people like you who make PayD such a great tool for the Stellar ecosystem.

This guide provides instructions for setting up your development environment, following our coding standards, and understanding our pull request process.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** v22+
- **npm** or **yarn**
- **Rust** (for Soroban contracts)
- **Stellar CLI**
- **Docker** (recommended for local PostgreSQL and Redis)

### Initial Setup

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/PayD.git
   cd PayD
   ```
3. **Install root dependencies**:
   ```bash
   npm install
   ```
4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

---

## 🛠 Development Workflow

PayD is a monorepo consisting of the backend, frontend, and smart contracts.

### Local Infrastructure

We recommend using Docker to run the required services:

```bash
# Start PostgreSQL and Redis
docker-compose up -d
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
2. Run database migrations:
   ```bash
   # Adjust database name if necessary
   psql -d payd -f src/db/migrations/001_create_tables.sql
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```

### Smart Contracts

Contracts are located in the `contracts/` directory and written in Rust for the Soroban platform. Refer to the [Stellar Developer Documentation](https://developers.stellar.org/docs/smart-contracts) for Soroban development basics.

---

## 🎨 Coding Standards

### TypeScript / JavaScript

We use **ESLint** and **Prettier** to maintain code quality and consistency.

- **Linting**: `npm run lint` (run in `backend` or `frontend`)
- **Formatting**: `npm run format` (available in `frontend`) or ensure your editor uses the project's `.prettierrc`.
- **Types**: Always use TypeScript for new code. Avoid using `any` unless absolutely necessary.

### Rust (Smart Contracts)

- Follow standard Rust naming conventions.
- Use `cargo fmt` to format your code before committing.
- Ensure all contracts compile without warnings.

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features.
- `fix:` for bug fixes.
- `docs:` for documentation changes.
- `style:` for formatting/visual changes.
- `refactor:` for code restructuring.
- `test:` for adding or updating tests.

---

## 🧪 Testing

We value high test coverage to ensure stability.

### Backend Tests
```bash
cd backend
npm test                # Run all tests
npm test -- --coverage  # Run with coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                # Run Vitest
```

Before submitting a PR, ensure all tests pass locally.

---

## 📮 Pull Request Process

1. **Create a branch**: Use a descriptive name like `feat/stellar-integration` or `fix/login-bug`.
2. **Implement your changes**: Ensure you add tests for any new features or bug fixes.
3. **Update documentation**: If your change affects how the system works, update the relevant `.md` files.
4. **Push and Open PR**: Push to your fork and open a PR against the `main` branch of the original repository.
5. **PR Description**: Use our PR template to describe **what** changed, **why**, and **how** it was tested.
6. **Code Review**: At least one maintainer must approve your PR before it can be merged.

---

## ⚖️ License

By contributing to PayD, you agree that your contributions will be licensed under its [MIT License](LICENSE).
