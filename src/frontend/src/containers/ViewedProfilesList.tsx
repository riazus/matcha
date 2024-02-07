import { useEffect } from "react";
import { useGetViewedProfilesQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import ProfileViewDisplay from "../components/ProfileViewDisplay";

interface ViewedProfilesListProps {
  setViewedProfilesCount: (count: number) => void;
}

function ViewedProfilesList({
  setViewedProfilesCount,
}: ViewedProfilesListProps) {
  const {
    data: viewedProfiles,
    isSuccess,
    isLoading,
  } = useGetViewedProfilesQuery();

  useEffect(() => {
    if (isSuccess) {
      setViewedProfilesCount(viewedProfiles.length);
    }
  }, [isSuccess, setViewedProfilesCount, viewedProfiles?.length]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <ProfileViewDisplay viewProfiles={viewedProfiles} />;
}

export default ViewedProfilesList;
