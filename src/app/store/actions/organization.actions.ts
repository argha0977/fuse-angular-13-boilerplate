import { createAction, props } from '@ngrx/store';


export const addOrganization = createAction('[Organization Component] Add Organization', props<{organization:any}>());
export const updateOrganization = createAction('[Organization Component] Update Organization', props<{ organization: any }>());
export const deleteOrganization = createAction('[Organization Component] Delete Organization', props<{ organization: any }>());
export const setOrganization = createAction('[Organization Component] Set Organizations', props<{ organizations: any }>());
// export const signin = createAction('[Organization Component] Signin', props<{ user: any }>());
export const setActionOrganization = createAction('[Organization Component] set Organization action ', props<{ action: String }>());
export const setListOrganizationData = createAction('[Organization Component] set List Organization data', props<{ data: any }>());
export const resetOrganization = createAction('[Organization Component] Reset Organization');