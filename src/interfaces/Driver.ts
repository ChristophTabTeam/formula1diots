export interface Driver {
    id: string;
    name: string;
    nationality: string;
    teamId: string;
    dateOfBirth: string;
    profilePictureUrl?: string;
    driverSlot: number;
    isPlayer?: boolean;
    favoriteTrack?: string;
    favoriteTeam?: string;
    favoriteDriver?: string;
}