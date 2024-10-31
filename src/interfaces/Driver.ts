export interface Driver {
    id: string;
    name: string;
    nationality: string;
    teamId: string;
    dateOfBirth: string;
    profilePictureUrl?: string;
    seat?: number;
    isPlayer?: boolean;
    favoriteTrack?: string;
    favoriteTeam?: string;
    favoriteDriver?: string;
    rating?: number;
}