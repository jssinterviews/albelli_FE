import "./styles.scss";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { dequeueNotification } from "../../../store/reducers/notifications";

function Notification() {
  const notifications = useAppSelector((state) => state.notifications.value);
  const dispatch = useAppDispatch();

  const firstNotification = notifications[0];

  useEffect(() => {
    if (firstNotification) {
      setTimeout(() => {
        dispatch(dequeueNotification());
      }, 3000);
    }
  }, [dispatch, firstNotification]);

  return firstNotification ? (
    <div
      className={`notification_container notification_${firstNotification.type}`}
    >
      {firstNotification.message}
    </div>
  ) : (
    <></>
  );
}

export default Notification;
