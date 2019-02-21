import { ProfileProperty } from './ProfileProperty';

export class RegistrationRequest {
    Username: string;
    RegistrationChannel: string;
    CreateRegistrationToken: boolean;
    UserProfileProperties: Array<ProfileProperty>;

    constructor(userName: string, email: string, registrationChannel: string,
        firstName: string, lastName: string) {
        this.Username = userName;
        this.RegistrationChannel = registrationChannel;
        this.CreateRegistrationToken = true;
        this.UserProfileProperties = new Array<ProfileProperty>();
        this.UserProfileProperties.push(new ProfileProperty('Email', email));
        this.UserProfileProperties.push(new ProfileProperty('FirstName', firstName));
        this.UserProfileProperties.push(new ProfileProperty('LastName', lastName));
    }
}
