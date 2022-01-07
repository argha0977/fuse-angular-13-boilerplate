import { Action, createReducer, on } from '@ngrx/store';
import * as UserActions from "../actions/user.actions";

/**
 * Define User State
 */
export interface State {
    user: any,
    users: any,

}

/**
 * Set Initial User State
 */
export const initialState: State = {
    user: undefined,
    users: [],

};

const userReducer = createReducer(
    initialState,
    on(UserActions.addUser, (state, { user }) => ({ ...state, users: [...state.users, user] })),
    on(UserActions.updateUser, (state, { user }) => {
        let index = state.users.map(item => item._id).indexOf(user._id);
        let updated = JSON.parse(JSON.stringify(state.users));
        if (index >= 0) updated[index] = user;
        return {
            ...state,
            users: updated
        };
    }),
    on(UserActions.deleteUser, (state, { user }) => ({ ...state, users: state.users.filter(item => item._id !== user._id) })),
    on(UserActions.setUsers, (state, { users }) => ({ ...state, users: users })),
    on(UserActions.signin, (state, { user }) => ({ ...state, user: user })),
    on(UserActions.reset, state => ({ ...state, user: undefined, users: [] })),

);

export function reducer(state: State | undefined, action: Action) {
    return userReducer(state, action);
}