import { useEffect } from "react";
import { Demo } from "./HistoryList";
import { useGetViewedProfilesQuery } from "../app/api/api";
import { List, ListItem, ListItemText } from "@mui/material";
import FullScreenLoader from "../components/FullScreenLoader";

interface ViewedProfilesListProps {
  setViewedProfilesCount: (count: number) => void;
}

function ViewedProfilesList(props: ViewedProfilesListProps) {
  const { data: viewedProfiles, isSuccess, isLoading } = useGetViewedProfilesQuery();

  useEffect(() => {
    if (isSuccess) {
      props.setViewedProfilesCount(viewedProfiles.length);
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
