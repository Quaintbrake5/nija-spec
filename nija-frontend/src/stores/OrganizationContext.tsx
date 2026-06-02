import { getErrorMessage } from "@/utils/errors";
import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Organization } from '@/types';
import { organizationService } from '@/services';

// Organization state
interface OrganizationState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
}

// Organization actions
type OrganizationAction =
  | { type: 'LOAD_ORGS_START' }
  | { type: 'LOAD_ORGS_SUCCESS'; payload: Organization[] }
  | { type: 'LOAD_ORGS_FAILURE'; payload: string }
  | { type: 'SET_CURRENT_ORG'; payload: Organization }
  | { type: 'CREATE_ORG_SUCCESS'; payload: Organization }
  | { type: 'UPDATE_ORG_SUCCESS'; payload: Organization }
  | { type: 'DELETE_ORG_SUCCESS'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Organization reducer
const organizationReducer = (state: OrganizationState, action: OrganizationAction): OrganizationState => {
  switch (action.type) {
    case 'LOAD_ORGS_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_ORGS_SUCCESS':
      return { ...state, organizations: action.payload, isLoading: false };
    case 'LOAD_ORGS_FAILURE':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CURRENT_ORG':
      return { ...state, currentOrganization: action.payload };
    case 'CREATE_ORG_SUCCESS':
      return {
        ...state,
        organizations: [...state.organizations, action.payload],
        currentOrganization: state.currentOrganization || action.payload,
      };
    case 'UPDATE_ORG_SUCCESS':
      return {
        ...state,
        organizations: state.organizations.map((org) =>
          org.id === action.payload.id ? action.payload : org
        ),
        currentOrganization:
          state.currentOrganization?.id === action.payload.id
            ? action.payload
            : state.currentOrganization,
      };
    case 'DELETE_ORG_SUCCESS':
      return {
        ...state,
        organizations: state.organizations.filter((org) => org.id !== action.payload),
        currentOrganization:
          state.currentOrganization?.id === action.payload ? null : state.currentOrganization,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Initial state
const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  isLoading: false,
  error: null,
};

// Context
interface OrganizationContextType extends OrganizationState {
  loadOrganizations: () => Promise<void>;
  setCurrentOrganization: (orgId: string) => void;
  createOrganization: (name: string) => Promise<Organization>;
  updateOrganization: (orgId: string, name: string) => Promise<Organization>;
  deleteOrganization: (orgId: string) => Promise<void>;
  clearError: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

// Provider component
interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider = ({ children }: OrganizationProviderProps) => {
  const [state, dispatch] = useReducer(organizationReducer, initialState);

  const loadOrganizations = useCallback(async () => {
    dispatch({ type: 'LOAD_ORGS_START' });
    try {
      const orgs = await organizationService.getOrganizations();
      dispatch({ type: 'LOAD_ORGS_SUCCESS', payload: orgs });

      // Set current organization if not set
      if (!state.currentOrganization && orgs.length > 0) {
        const savedOrgId = organizationService.getCurrentOrganization();
        const orgToSet = savedOrgId
          ? orgs.find((org) => org.id === savedOrgId) || orgs[0]
          : orgs[0];
        dispatch({ type: 'SET_CURRENT_ORG', payload: orgToSet });
      }
    } catch (error) {
      dispatch({ type: 'LOAD_ORGS_FAILURE', payload: getErrorMessage(error) });
    }
  }, [state.currentOrganization]);

  // Load organizations on mount
  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const setCurrentOrganization = useCallback((orgId: string) => {
    const org = state.organizations.find((o) => o.id === orgId);
    if (org) {
      dispatch({ type: 'SET_CURRENT_ORG', payload: org });
      organizationService.setCurrentOrganization(orgId);
    }
  }, [state.organizations]);

  const createOrganization = useCallback(async (name: string): Promise<Organization> => {
    const newOrg = await organizationService.createOrganization({ name });
    dispatch({ type: 'CREATE_ORG_SUCCESS', payload: newOrg });
    organizationService.setCurrentOrganization(newOrg.id);
    return newOrg;
  }, []);

  const updateOrganization = useCallback(async (orgId: string, name: string): Promise<Organization> => {
    const updatedOrg = await organizationService.updateOrganization(orgId, { name });
    dispatch({ type: 'UPDATE_ORG_SUCCESS', payload: updatedOrg });
    return updatedOrg;
  }, []);

  const deleteOrganization = useCallback(async (orgId: string): Promise<void> => {
    await organizationService.deleteOrganization(orgId);
    dispatch({ type: 'DELETE_ORG_SUCCESS', payload: orgId });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: OrganizationContextType = useMemo(
    () => ({
      ...state,
      loadOrganizations,
      setCurrentOrganization,
      createOrganization,
      updateOrganization,
      deleteOrganization,
      clearError,
    }),
    [
      state,
      loadOrganizations,
      setCurrentOrganization,
      createOrganization,
      updateOrganization,
      deleteOrganization,
      clearError,
    ]
  );

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
