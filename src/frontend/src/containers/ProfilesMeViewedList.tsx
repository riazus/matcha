import { useEffect } from "react";
import { useGetProfileMeViewedQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import ProfileViewDisplay from "../components/ProfileViewDisplay";

interface ProfilesMeViewedListProps {
  setProfilesMeViewedCount: (count: number) => void;
}

function ProfilesMeViewedList({
  setProfilesMeViewedCount,
}: ProfilesMeViewedListProps) {
  const {
    data: profilesMeViewed,
    isSuccess,
    isLoading,
  } = useGetProfileMeViewedQuery();

  useEffect(() => {
    if (isSuccess) {
      setProfilesMeViewedCount(profilesMeViewed.length);
    }
  }, [isSuccess, setProfilesMeViewedCount, profilesMeViewed?.length]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <ProfileViewDisplay viewProfiles={profilesMeViewed} />;
}

export default ProfilesMeViewedList;
