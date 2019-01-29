export interface RegistrationResponse {
    userId: number;
    userName: string;
    referredBy: number;
    registrationChannel: string;
    createRegistrationToken: boolean;
    registrationToken: string;
    userProfileProperties: any;
}
