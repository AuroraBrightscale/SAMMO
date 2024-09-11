export interface TwitchUser {
    display_name: string;
    profile_image_url: string;
}

export class TwitchService {
    constructor(private token: string, private apiRoot = "https://api.twitch.tv/helix/") { }

    public getUserInfo(username: string): Promise<TwitchUser> {
        return new Promise((res, rej) => {
            var request = new XMLHttpRequest();
            request.open("GET", `${this.apiRoot}users?login=${username}`);
            request.onload = () => {
                if (request.status === 200) {
                    const response = JSON.parse(request.responseText) as TwitchUser[];
                    if (response.length > 0) {
                        res(response[0]);
                    } else {
                        rej("User not found");
                    }
                } else {
                    rej(`Response returned status code ${request.status}`);
                }
            };
        });
    }
}