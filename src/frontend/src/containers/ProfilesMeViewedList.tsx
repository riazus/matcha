import { useEffect, useState } from "react";
import { Demo, Profile } from "./HistoryList";
import { useGetProfileMeViewedQuery } from "../app/api/api";
import { List, ListItem, ListItemText } from "@mui/material";
import FullScreenLoader from "../components/FullScreenLoader";

interface ProfilesMeViewedListProps {
  setProfilesMeViewedCount: (count: number) => void;
}

function ProfilesMeViewedList(props: ProfilesMeViewedListProps) {
  const { data, isSuccess, isLoading } = useGetProfileMeViewedQuery();
  const [profilesMeViewed, setProfilesMeViewed] = useState<Profile[]>([]);

  useEffect(() => {
    if (isSuccess) {
      props.setProfilesMeViewedCount(data.length);
      setProfilesMeViewed(data.map((el) => ({ username: el.username })));
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
