import { useEffect, useState } from "react";
import { Demo, Profile } from "./HistoryList";
import { useGetViewedProfilesQuery } from "../app/api/api";
import { List, ListItem, ListItemText } from "@mui/material";
import FullScreenLoader from "../components/FullScreenLoader";

interface ViewedProfilesListProps {
  setViewedProfilesCount: (count: number) => void;
}

function ViewedProfilesList(props: ViewedProfilesListProps) {
  const { data, isSuccess, isLoading } = useGetViewedProfilesQuery();
  const [viewedProfiles, setViewedProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (isSuccess) {
      props.setViewedProfilesCount(data.length);
      setViewedProfiles(data.map((el) => ({ username: el.username })));
    }
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Demo>
      <List dense={true}>
        {viewedProfiles?.map((item, ind) => {
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

export default ViewedProfilesList;
