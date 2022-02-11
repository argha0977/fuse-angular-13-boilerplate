import { Action, createReducer, on } from '@ngrx/store';
import * as OrganizationActions from "../actions/organization.actions";

/**
 * Define User State
 */
export interface State {
    organization: any,
    organizations: any,
    action:any,
    data:any,

}

/**
 * Set Initial User State
 */
export const initialState: State = {
    organization: undefined,
    organizations: [],
    action:'',
    data:undefined,

};

const organizationReducer = createReducer(
    initialState,
    on(OrganizationActions.addOrganization, (state, { organization }) => ({ ...state, organizations: [...state.organizations, organization] })),
    on(OrganizationActions.updateOrganization, (state, { organization }) => {
        let index = state.organizations.map(item => item._id).indexOf(organization._id);
        let updated = JSON.parse(JSON.stringify(state.organizations));
        if (index >= 0) updated[index] = organization;
        return {
            ...state,
            organizations: updated
        };
    }),
    on(OrganizationActions.deleteOrganization, (state, { organization }) => ({ ...state, organizations: state.organizations.filter(item => item._id !== organization._id) })),
    on(OrganizationActions.setOrganization, (state, { organizations }) => ({ ...state, organizations: organizations })),
    // on(UserActions.signin, (state, { user }) => ({ ...state, user: user })),
    on(OrganizationActions.setActionOrganization, (state, { action }) => ({ ...state, action: action })),
    on(OrganizationActions.setListOrganizationData, (state, { data }) => ({ ...state, data: data })),
    on(OrganizationActions.resetOrganization, state => ({ ...state, organization: undefined, organizations: [] , action:''})),

);

export function reducer(state: State | undefined, action: Action) {
    return organizationReducer(state, action);
}