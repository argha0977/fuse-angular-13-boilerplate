import { createAction, props } from '@ngrx/store';


export const addUser = createAction('[User Component] Add User', props<{user:any}>());
export const updateUser = createAction('[User Component] Update User', props<{ user: any }>());
export const deleteUser = createAction('[User Component] Delete User', props<{ user: any }>());
export const setUsers = createAction('[User Component] Set Users', props<{ users: any }>());
export const signin = createAction('[User Component] Signin', props<{ user: any }>());
export const reset = createAction('[User Component] Reset User');
