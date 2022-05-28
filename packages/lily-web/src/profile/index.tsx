import { useAuthContext } from "lily-service";
import { ProfileViewContainer } from "lily-web/components";

const Profile = () => {
    const { authUserData } = useAuthContext();
    if (!authUserData) return null;

    const { fname, lname, email } = authUserData;
    return <ProfileViewContainer>
        <div>
            {fname} {lname}
        </div>
        <div>
            {email}
        </div>
    </ProfileViewContainer>
};

export default Profile;
