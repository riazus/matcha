import { useEffect } from "react";
import { useGetViewedProfilesQuery } from "../app/api/api";
import FullScreenLoader from "../components/FullScreenLoader";
import ProfileViewDisplay from "../components/ProfileViewDisplay";

interface ViewedProfilesListProps {
  setViewedProfilesCount: (count: number) => void;
}

function ViewedProfilesList(props: ViewedProfilesListProps) {
  const {
    data: viewedProfiles,
    isSuccess,
    isLoading,
  } = useGetViewedProfilesQuery();

  useEffect(() => {
    if (isSuccess) {
      props.setViewedProfilesCount(viewedProfiles.length);
    }
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <ProfileViewDisplay viewProfiles={viewedProfiles} />;
}

export default ViewedProfilesList;
