# Mermaid Diagram Generation - Example Workflows

Complete examples demonstrating diagram generation with Serena, Sequential, and Mermaid MCP integration.

---

## Example 1: Architecture Diagram from Code Structure

### Scenario
You want to visualize the structure of an authentication module.

### Workflow

**User Input:**
```
Show me the architecture of the auth module
```

**Claude Code Execution:**

1. **Trigger Detection**
   - Keywords: "architecture", "auth module"
   - Mode: Diagram Generation Mode activated
   - Type: Architecture diagram

2. **Serena Analysis**
   ```yaml
   Tool: serena.get_symbols_overview
   Path: "src/auth/"
   Depth: 2
   Result:
     - AuthService (class)
     - TokenManager (class)
     - UserRepository (class)
     - Methods and relationships extracted
   ```

3. **Mermaid Generation**
   ```yaml
   Tool: mermaid.generate_diagram
   Type: classDiagram
   Input: Extracted structure from Serena
   ```

4. **Output**

**Generated Diagram:**
```mermaid
classDiagram
    class AuthService {
        -TokenManager tokenManager
        -UserRepository userRepo
        +login(credentials) Token
        +logout(token) void
        +validateToken(token) boolean
        +refreshToken(token) Token
    }

    class TokenManager {
        -string secret
        +generateToken(user) Token
        +verifyToken(token) boolean
        +decodeToken(token) User
    }

    class UserRepository {
        -Database db
        +findByEmail(email) User
        +findById(id) User
        +save(user) User
        +update(user) User
    }

    AuthService --> TokenManager : uses
    AuthService --> UserRepository : uses
```

**File Saved:** `claudedocs/diagrams/architecture_auth-module_2025-12-23.md`

**Natural Language Explanation:**
```
The authentication module consists of three main components:

1. **AuthService**: The main authentication service that orchestrates login,
   logout, and token validation operations. It depends on both TokenManager
   and UserRepository.

2. **TokenManager**: Handles JWT token generation, verification, and decoding.
   Manages the secret key used for token signing.

3. **UserRepository**: Provides data access for user-related operations,
   interfacing with the database layer.

Related files:
- src/auth/AuthService.ts
- src/auth/TokenManager.ts
- src/auth/UserRepository.ts
```

---

## Example 2: Flowchart from Algorithm Analysis

### Scenario
You want to understand the login flow with a visual flowchart.

### Workflow

**User Input:**
```
/diagram flowchart for user login process
```

**Claude Code Execution:**

1. **Manual Command Detection**
   - Command: `/diagram flowchart`
   - Context: "user login process"
   - Mode: Interactive diagram generation

2. **Clarification Questions**
   ```
   Let me clarify the scope:
   1. Include email verification step? (yes/no)
   2. Show 2FA handling? (yes/no)
   3. Add "remember me" functionality? (yes/no)
   4. Include rate limiting checks? (yes/no)
   ```

3. **User Response**
   ```
   1. No
   2. Yes
   3. Yes
   4. Yes
   ```

4. **Mermaid Generation**
   ```yaml
   Tool: mermaid.generate_diagram
   Type: flowchart
   Input: Login process with 2FA, remember me, rate limiting
   ```

**Generated Diagram:**
```mermaid
flowchart TD
    Start([User Visits Login]) --> EnterCreds[/Enter Email & Password/]
    EnterCreds --> RateCheck{Rate Limit OK?}

    RateCheck -->|No| RateError[Show: Too Many Attempts]
    RateError --> Wait[Wait Period]
    Wait --> EnterCreds

    RateCheck -->|Yes| ValidateCreds{Credentials Valid?}

    ValidateCreds -->|No| LoginError[Show: Invalid Credentials]
    LoginError --> EnterCreds

    ValidateCreds -->|Yes| Check2FA{2FA Enabled?}

    Check2FA -->|No| RememberMe{Remember Me?}
    Check2FA -->|Yes| Send2FA[Send 2FA Code]
    Send2FA --> Enter2FA[/Enter 2FA Code/]
    Enter2FA --> Validate2FA{Code Valid?}

    Validate2FA -->|No| 2FAError[Show: Invalid Code]
    2FAError --> Enter2FA

    Validate2FA -->|Yes| RememberMe

    RememberMe -->|Yes| CreateLongToken[Create Long-lived Token]
    RememberMe -->|No| CreateShortToken[Create Session Token]

    CreateLongToken --> Success([Login Successful])
    CreateShortToken --> Success

    Success --> Redirect[Redirect to Dashboard]
```

**File Saved:** `claudedocs/diagrams/flowchart_user-login_2025-12-23.md`

**Refinement Offer:**
```
Would you like me to:
1. Add error handling for network failures?
2. Show session storage details?
3. Add password reset flow branch?
4. Include OAuth login alternative paths?
```

---

## Example 3: Sequence Diagram from API Analysis

### Scenario
You want to trace the API request flow for authentication.

### Workflow

**User Input:**
```
Show how the POST /api/login endpoint works
```

**Claude Code Execution:**

1. **Trigger Detection**
   - Keywords: "endpoint", "POST /api/login"
   - Mode: Diagram Generation Mode
   - Type: Sequence diagram

2. **Code Analysis**
   ```yaml
   Read Files:
     - routes/auth.routes.ts
     - controllers/auth.controller.ts
     - services/auth.service.ts
     - middleware/rate-limit.middleware.ts

   Trace Flow:
     - Client → API Gateway
     - API Gateway → Rate Limit Middleware
     - Rate Limit → Auth Controller
     - Auth Controller → Auth Service
     - Auth Service → User Repository
     - User Repository → Database
   ```

3. **Mermaid Generation**
   ```yaml
   Tool: mermaid.generate_diagram
   Type: sequenceDiagram
   Input: Traced request/response flow
   ```

**Generated Diagram:**
```mermaid
sequenceDiagram
    participant Client
    participant API as API Gateway
    participant RL as Rate Limiter
    participant AC as Auth Controller
    participant AS as Auth Service
    participant UR as User Repository
    participant DB as Database

    Client->>API: POST /api/login
    Note over Client,API: {email, password}

    API->>RL: Check rate limit
    RL->>RL: Validate request count

    alt Rate limit exceeded
        RL-->>API: 429 Too Many Requests
        API-->>Client: Error response
    else Rate limit OK
        RL->>AC: Forward request
        AC->>AS: login(credentials)
        AS->>UR: findByEmail(email)
        UR->>DB: SELECT * FROM users WHERE email = ?
        DB-->>UR: User data
        UR-->>AS: User object

        AS->>AS: verifyPassword(password, hash)

        alt Invalid password
            AS-->>AC: Authentication failed
            AC-->>API: 401 Unauthorized
            API-->>Client: Error response
        else Valid password
            AS->>AS: generateToken(user)
            AS-->>AC: {user, token}
            AC-->>API: 200 OK
            API-->>Client: {user, token}
        end
    end
```

**File Saved:** `claudedocs/diagrams/sequence_login-api_2025-12-23.md`

**Related Files:**
```
- routes/auth.routes.ts:15 (POST /api/login endpoint)
- controllers/auth.controller.ts:45 (login handler)
- services/auth.service.ts:89 (authentication logic)
- middleware/rate-limit.middleware.ts:12 (rate limiting)
```

---

## Example 4: State Diagram from State Management

### Scenario
You want to visualize user session states and transitions.

### Workflow

**User Input:**
```
Diagram the user session lifecycle states
```

**Claude Code Execution:**

1. **Trigger Detection**
   - Keywords: "lifecycle", "states", "session"
   - Mode: Diagram Generation Mode
   - Type: State diagram

2. **Analysis**
   ```yaml
   Analyze:
     - State management code
     - Session handling logic
     - Lifecycle hooks

   Identify States:
     - Unauthenticated
     - Authenticating
     - Authenticated
     - Refreshing
     - Expired
     - Logged Out

   Identify Transitions:
     - login() → Authenticating
     - auth success → Authenticated
     - token expiry → Expired
     - refresh() → Refreshing
     - logout() → Logged Out
   ```

3. **Mermaid Generation**
   ```yaml
   Tool: mermaid.generate_diagram
   Type: stateDiagram-v2
   Input: States and transitions
   ```

**Generated Diagram:**
```mermaid
stateDiagram-v2
    [*] --> Unauthenticated

    Unauthenticated --> Authenticating: login()

    Authenticating --> Authenticated: success
    Authenticating --> Unauthenticated: failure

    Authenticated --> Active: user activity
    Authenticated --> Idle: no activity (5 min)

    Active --> Authenticated: continue session
    Active --> Expired: token expires

    Idle --> Active: user activity
    Idle --> Expired: token expires (15 min)

    Expired --> Refreshing: auto-refresh attempt
    Expired --> Unauthenticated: manual refresh / re-login

    Refreshing --> Authenticated: refresh success
    Refreshing --> Unauthenticated: refresh failure

    Authenticated --> LoggingOut: logout()
    Active --> LoggingOut: logout()
    Idle --> LoggingOut: logout()

    LoggingOut --> Unauthenticated: cleanup complete

    note right of Authenticated
        Token valid
        User can access resources
    end note

    note right of Expired
        Token expired
        Refresh or re-authenticate
    end note
```

**File Saved:** `claudedocs/diagrams/state_user-session_2025-12-23.md`

**State Descriptions:**
```
- **Unauthenticated**: Initial state, no valid session
- **Authenticating**: Login in progress
- **Authenticated**: Valid session with fresh token
- **Active**: User actively using the application
- **Idle**: Session valid but no recent activity
- **Expired**: Token expired, refresh needed
- **Refreshing**: Token refresh in progress
- **LoggingOut**: Logout in progress, cleanup happening
```

---

## Example 5: Comprehensive Multi-Diagram Analysis

### Scenario
You want complete visual documentation of the authentication system.

### Workflow

**User Input:**
```
Provide comprehensive diagrams for the authentication system
```

**Claude Code Execution:**

1. **Multi-Type Generation**
   - Generate all relevant diagram types in parallel
   - Coordinate Serena + Sequential + Mermaid

2. **Parallel Execution**
   ```yaml
   Parallel Tasks:
     1. Architecture diagram (Serena → Mermaid)
     2. Login flowchart (Sequential → Mermaid)
     3. API sequence diagram (Analysis → Mermaid)
     4. Session state diagram (Analysis → Mermaid)
   ```

3. **Generated Diagrams**
   - `architecture_auth-system_2025-12-23.md` (class structure)
   - `flowchart_login-process_2025-12-23.md` (login flow)
   - `sequence_auth-api_2025-12-23.md` (API interactions)
   - `state_session-lifecycle_2025-12-23.md` (session states)

4. **Overview Document**

**File Saved:** `claudedocs/diagrams/OVERVIEW_auth-system_2025-12-23.md`

```markdown
# Authentication System - Complete Visual Documentation

Generated: 2025-12-23

## System Overview

This documentation provides comprehensive visual representation of the
authentication system across multiple perspectives.

## Diagrams

### 1. Architecture (Structure)
**File**: [architecture_auth-system_2025-12-23.md](./architecture_auth-system_2025-12-23.md)

Shows the class structure and component relationships.

**Key Insights:**
- Three main components: AuthService, TokenManager, UserRepository
- Clear separation of concerns
- Single-direction dependencies

### 2. Login Process (Flow)
**File**: [flowchart_login-process_2025-12-23.md](./flowchart_login-process_2025-12-23.md)

Illustrates the complete login workflow including 2FA and rate limiting.

**Key Insights:**
- Multiple security checks (rate limit, credentials, 2FA)
- Clear error handling paths
- Optional "remember me" functionality

### 3. API Communication (Sequence)
**File**: [sequence_auth-api_2025-12-23.md](./sequence_auth-api_2025-12-23.md)

Traces the request/response flow through all system layers.

**Key Insights:**
- 7-layer interaction pattern
- Rate limiting at gateway level
- Database interaction isolated in repository

### 4. Session Lifecycle (State)
**File**: [state_session-lifecycle_2025-12-23.md](./state_session-lifecycle_2025-12-23.md)

Visualizes all possible session states and transitions.

**Key Insights:**
- 8 distinct states
- Auto-refresh mechanism for expired tokens
- Idle timeout after 5 minutes of inactivity

## Usage

These diagrams can be:
- Rendered in markdown viewers (GitHub, GitLab, VS Code)
- Exported to PNG/SVG using mermaid-cli
- Embedded in documentation
- Used for onboarding new developers
- Referenced in design reviews

## Maintenance

Update diagrams when:
- Architecture changes (new components, relationships)
- Flow logic is modified (new steps, decision points)
- API contracts change (new endpoints, parameters)
- State management evolves (new states, transitions)
```

---

## Example 6: Interactive Refinement

### Scenario
Initial diagram needs refinement based on feedback.

### Workflow

**Initial User Input:**
```
/diagram flowchart for password reset
```

**Initial Generation:**
```mermaid
flowchart TD
    Start([Request Reset]) --> Email[Enter Email]
    Email --> Send[Send Reset Link]
    Send --> Click[Click Link]
    Click --> NewPassword[Enter New Password]
    NewPassword --> Save[Save Password]
    Save --> End([Complete])
```

**User Feedback:**
```
Add email validation, token expiration, and rate limiting
```

**Refined Generation:**
```mermaid
flowchart TD
    Start([Request Reset]) --> Email[Enter Email]
    Email --> ValidateEmail{Email Valid?}

    ValidateEmail -->|No| EmailError[Show: Invalid Email]
    EmailError --> Email

    ValidateEmail -->|Yes| RateCheck{Rate Limit OK?}

    RateCheck -->|No| RateError[Show: Too Many Attempts]
    RateError --> Wait[Wait 15 minutes]
    Wait --> Email

    RateCheck -->|Yes| SendEmail[Send Reset Link]
    SendEmail --> ClickLink[User Clicks Link]

    ClickLink --> ValidateToken{Token Valid?}

    ValidateToken -->|No| TokenError[Show: Link Expired]
    TokenError --> Email

    ValidateToken -->|Yes| CheckExpiry{Not Expired?}

    CheckExpiry -->|No| ExpiryError[Show: Link Expired]
    ExpiryError --> Email

    CheckExpiry -->|Yes| NewPassword[Enter New Password]
    NewPassword --> ValidatePassword{Strong Password?}

    ValidatePassword -->|No| PasswordError[Show: Password Requirements]
    PasswordError --> NewPassword

    ValidatePassword -->|Yes| Save[Update Password]
    Save --> Success([Password Reset Complete])
```

**File Updated:** `claudedocs/diagrams/flowchart_password-reset_2025-12-23.md`

---

## Example 7: Framework-Specific Architecture

### Scenario
Visualize Next.js routing architecture using Context7 patterns.

### Workflow

**User Input:**
```
Show the Next.js routing architecture for this app
```

**Claude Code Execution:**

1. **MCP Coordination**
   ```yaml
   Context7:
     - Fetch Next.js routing patterns
     - Get App Router conventions

   Serena:
     - Analyze app/ directory structure
     - Extract route definitions

   Mermaid:
     - Generate architecture diagram
   ```

**Generated Diagram:**
```mermaid
graph TB
    subgraph "Next.js App Router"
        Root[app/]

        Layout[layout.tsx<br/>Root Layout]
        Page[page.tsx<br/>Home Page]

        Auth[auth/]
        AuthLayout[auth/layout.tsx<br/>Auth Layout]
        Login[auth/login/page.tsx]
        Register[auth/register/page.tsx]

        Dashboard[dashboard/]
        DashLayout[dashboard/layout.tsx]
        DashPage[dashboard/page.tsx]
        Settings[dashboard/settings/page.tsx]

        API[api/]
        AuthAPI[api/auth/route.ts]
        UserAPI[api/users/route.ts]
    end

    Root --> Layout
    Root --> Page
    Root --> Auth
    Root --> Dashboard
    Root --> API

    Auth --> AuthLayout
    Auth --> Login
    Auth --> Register

    Dashboard --> DashLayout
    Dashboard --> DashPage
    Dashboard --> Settings

    API --> AuthAPI
    API --> UserAPI

    Layout -.->|wraps| Page
    AuthLayout -.->|wraps| Login
    AuthLayout -.->|wraps| Register
    DashLayout -.->|wraps| DashPage
    DashLayout -.->|wraps| Settings
```

**File Saved:** `claudedocs/diagrams/architecture_nextjs-routing_2025-12-23.md`

---

## Summary

These examples demonstrate:

1. **Automatic Generation**: Triggered by keywords and context
2. **Manual Commands**: Using `/diagram` for explicit requests
3. **Multi-MCP Coordination**: Serena + Sequential + Context7 + Mermaid
4. **Iterative Refinement**: Generate → Feedback → Improve
5. **Comprehensive Documentation**: Multiple diagram types for complete understanding
6. **Framework Integration**: Leveraging Context7 for framework-specific patterns

All diagrams are:
- Saved to `claudedocs/diagrams/`
- Version-controlled with dates
- Accompanied by natural language explanations
- Ready for rendering in markdown viewers
