export interface User {
    id: string;
    email: string;
    fullName: string | null;
    isActive: boolean;
    isSuperuser: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Contact {
    id: string;
    organisation: string;
    description: string | null;
    owner_id: string;
    owner?: {
        id: string;
        email: string;
        full_name: string | null;
    };
    created_at: string;
    updated_at: string;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
