# Redux Toolkit Setup

This project now includes Redux Toolkit with RTK Query for state management and API calls.

## Structure

```
src/
├── store/
│   ├── store.ts       # Redux store configuration
│   └── hooks.ts       # Typed hooks for useSelector and useDispatch
└── service/
    ├── api.ts         # Base API slice with authentication
    ├── authService.ts # Authentication endpoints
    ├── userService.ts # User management endpoints
    ├── policyService.ts # Policy management endpoints
    ├── propertyService.ts # Property management endpoints
    ├── claimsService.ts # Claims management endpoints
    └── index.ts       # Re-exports all services
```

## Usage

### Basic Usage

```tsx
import { useGetUsersQuery, useCreateUserMutation } from '../service/userService';
// Or import from the index file:
import { useGetUsersQuery, useCreateUserMutation } from '../service';

function UsersList() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData).unwrap();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div>
      {users?.users.map(user => (
        <div key={user.id}>{user.firstName} {user.lastName}</div>
      ))}
    </div>
  );
}
```

### Authentication

```tsx
import { useLoginMutation, useGetCurrentUserQuery } from '../service/authService';

function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();
  const { data: currentUser } = useGetCurrentUserQuery();

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('refreshToken', result.refreshToken);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // Your login form JSX
  );
}
```

### Typed Hooks

Use the provided typed hooks instead of the default ones:

```tsx
import { useAppDispatch, useAppSelector } from '../store/hooks';

function MyComponent() {
  const dispatch = useAppDispatch(); // Typed dispatch
  const someState = useAppSelector(state => state.api); // Typed selector
  
  return <div>My Component</div>;
}
```

## Features

### API Configuration
- Base URL: `https://bricksure-api.onrender.com`
- Automatic authentication headers
- Token refresh handling
- Error handling and redirects

### Available Services

1. **Auth Service**: Login, register, logout, password management
2. **User Service**: User CRUD operations, profile management, bulk operations
3. **Policy Service**: Policy management, quotes, renewals, statistics
4. **Property Service**: Property CRUD, valuations, risk assessments, documents
5. **Claims Service**: Claims processing, status updates, document uploads, assignments

### Cache Management
RTK Query automatically handles caching, background refetching, and cache invalidation. Each service defines appropriate tags for cache management.

## Environment Setup

The store is already configured in `src/main.tsx` with the Redux Provider wrapping your app.

## Development

- All services use TypeScript for type safety
- RTK Query provides automatic loading states, error handling, and caching
- Use the generated hooks in your components
- The store includes Redux DevTools for development

## API Integration

Each service file contains:
- TypeScript interfaces for request/response data
- RTK Query endpoints with proper typing
- Generated hooks for components
- Cache tag management for automatic updates