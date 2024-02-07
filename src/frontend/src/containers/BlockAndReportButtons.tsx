import { Box, Button } from "@mui/material";
import { emitNotificationConnectionEvent } from "../sockets/notificationConnection";
import { NotificationEvent } from "../config";
import { useEffect, useState } from "react";
import { useReportProfileMutation } from "../app/api/api";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

interface BlockAndReportButtonsProps {
  profileId: string;
}

function BlockAndReportButtons({ profileId }: BlockAndReportButtonsProps) {
  const [reportHidden, setReportHidden] = useState(false);
  const [report, { isLoading, isSuccess }] = useReportProfileMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.warning(
        "Thank you for your help! Admins will analyse this profile in detail"
      );
      setReportHidden(true);
    }
  }, [isSuccess]);

  const handleBlockProfile = () => {
    emitNotificationConnectionEvent(NotificationEvent.BlockProfile, profileId);
  };

  const handleReportProfile = () => {
    report(profileId);
  };

  return (
    <Box>
      <Button onClick={handleBlockProfile} sx={styles.blockButton}>
        Block Profile
      </Button>
      {!reportHidden && (
        <LoadingButton
          onClick={handleReportProfile}
          sx={styles.reportButton}
          loading={isLoading}
        >
          Report this Profile
        </LoadingButton>
      )}
    </Box>
  );
}

const styles = {
  blockButton: {
    backgroundColor: "#ffdddd",
    color: "#ff0000",
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ff0000",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(255, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  },
  reportButton: {
    backgroundColor: "#929b1d",
    color: "#eaff00",
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #eaff00",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(255, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  },
};

export default BlockAndReportButtons;
