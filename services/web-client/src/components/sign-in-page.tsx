import React, { useReducer } from 'react';
import { Auth } from 'aws-amplify';

interface SignInFormState {
  email: string;
  password: string;
}

interface UpdateValueAction {
  type: 'update';
  name: keyof SignInFormState;
  value: string;
}

const initialState: SignInFormState = {
  email: 'carlhueffmeier@gmail.com',
  password: 'trustNo1!',
};

function formReducer(state: SignInFormState, action: UpdateValueAction): SignInFormState {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.name]: action.value,
      }
    default:
      throw new Error(`Unknown type "${action.type}"`);
  }
}

export function SignInPage() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const user = await Auth.signIn(state.email, state.password);
    console.log('Successfully authenticated', user);
  }

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    dispatch({
      type: 'update',
      name: event.currentTarget.name as keyof SignInFormState,
      value: event.currentTarget.value,
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          value={state.email}
          onChange={handleChange}
          type="email"
          name="email"
          id="email"
        />
        <label htmlFor="password">Password</label>
        <input
          value={state.password}
          onChange={handleChange}
          type="password"
          name="password"
          id="password"
        />

        <button type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}
