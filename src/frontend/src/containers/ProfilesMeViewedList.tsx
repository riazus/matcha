import { useEffect } from "react";
import { Demo } from "./HistoryList";
import { useGetProfileMeViewedQuery } from "../app/api/api";
import { List, ListItem, ListItemText } from "@mui/material";
import FullScreenLoader from "../components/FullScreenLoader";

interface ProfilesMeViewedListProps {
  setProfilesMeViewedCount: (count: number) => void;
}

function ProfilesMeViewedList(props: ProfilesMeViewedListProps) {
  const { data: profilesMeViewed, isSuccess, isLoading } = useGetProfileMeViewedQuery();

  useEffect(() => {
    if (isSuccess) {
      props.setProfilesMeViewedCount(profilesMeViewed.length);
    }
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Demo>
      <List dense={true}>
        {profilesMeViewed?.map((item, ind) => {
          return (
            <ListItem key={ind}>
              <ListItemText primary={item.username} />
            </ListItem>
          );
        })}
      </List>
    </Demo>
  );
}

export default ProfilesMeViewedList;
