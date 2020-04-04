import React, { useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import * as mutations from '../graphql/mutations';
import { CreateCampaignMutationVariables } from '../graphql/types';
import gql from 'graphql-tag';

interface Destination {
  name: string;
  email: string;
}

interface CreateCampaignFormState {
  name: string;
  questionText: string;
  destinations: Destination[];
}

interface UpdateValueAction {
  type: 'update';
  name: keyof CreateCampaignFormState;
  value: string;
}

interface UpdateDestinationAction {
  type: 'update-destination';
  name: keyof Destination;
  index: number;
  value: string;
}

interface AddDestinationAction {
  type: 'add-destination';
}

interface RemoveDestinationAction {
  type: 'remove-destination';
  index: number;
}

const initialState = {
  name: 'Camping trip',
  questionText: 'Do you want to join?',
  destinations: [
    {
      name: 'Dogbert',
      email: 'carlhueffmeier@gmail.com',
    },
  ],
};

function formReducer(
  state: CreateCampaignFormState,
  action:
    | UpdateValueAction
    | UpdateDestinationAction
    | AddDestinationAction
    | RemoveDestinationAction,
): CreateCampaignFormState {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.name]: action.value,
      };
    case 'update-destination':
      return {
        ...state,
        destinations: [
          ...state.destinations.slice(0, action.index),
          {
            ...state.destinations[action.index],
            [action.name]: action.value,
          },
          ...state.destinations.slice(action.index + 1),
        ],
      };
    case 'add-destination':
      return {
        ...state,
        destinations: [...state.destinations, { name: '', email: '' }],
      };
    case 'remove-destination':
      return {
        ...state,
        destinations: [
          ...state.destinations.slice(0, action.index),
          ...state.destinations.slice(action.index + 1),
        ],
      };
  }
}

export function CreateCampaignPage() {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [
    createCampaign,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<any, CreateCampaignMutationVariables>(
    gql(mutations.createCampaign),
    { onCompleted: () => history.push('/campaigns') },
  );
  const history = useHistory();

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    createCampaign({ variables: { data: formState } });
  }

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    dispatch({
      type: 'update',
      name: event.currentTarget.name as keyof Omit<
        CreateCampaignFormState,
        'destinations'
      >,
      value: event.currentTarget.value,
    });
  }

  function handleDestinationChange(event: React.FormEvent<HTMLInputElement>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, index, field] = event.currentTarget.name.split('-');
    dispatch({
      type: 'update-destination',
      name: field as keyof Destination,
      index: Number(index),
      value: event.currentTarget.value,
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Campaign Name</label>
          <input
            value={formState.name}
            onChange={handleChange}
            type="text"
            name="name"
            id="name"
          />
        </div>
        <div>
          <label htmlFor="questionText">Question</label>
          <input
            value={formState.questionText}
            onChange={handleChange}
            type="text"
            name="questionText"
            id="questionText"
          />
        </div>
        {formState.destinations.map(
          (destination: Destination, index: number) => (
            <div key={index}>
              <label htmlFor={`destination-${index}-name`}>Recipient</label>
              <input
                value={destination.name}
                onChange={handleDestinationChange}
                type="text"
                name={`destination-${index}-name`}
                id={`destination-${index}-name`}
              />
              <label htmlFor={`destination-${index}-email`}>Email</label>
              <input
                value={destination.email}
                onChange={handleDestinationChange}
                type={`destination-${index}-email`}
                name={`destination-${index}-email`}
                id={`destination-${index}-email`}
              />
              <button
                type="button"
                onClick={() => dispatch({ type: 'remove-destination', index })}
              >
                -
              </button>
            </div>
          ),
        )}
        <button
          type="button"
          onClick={() => dispatch({ type: 'add-destination' })}
        >
          +
        </button>

        <button disabled={mutationLoading} type="submit">Create</button>
        <button disabled={mutationLoading} type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
        <br />
        {mutationError && <p>Something went wrong: {mutationError}</p>}
      </form>
    </div>
  );
}
