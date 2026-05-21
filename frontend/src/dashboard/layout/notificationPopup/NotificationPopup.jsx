import React, { useEffect } from "react";
import { FaUser, FaIdCard, FaCalendarAlt, FaClock } from "react-icons/fa";
import { api, updateEntity } from "../../../api/api";
import { clearNotifications, markAsSeen } from "../../../Redux/slices";
import { useDispatch } from "react-redux";
import { showToast } from "../../../common/common";

function NotificationPopup({ notifications, isOpen, onClose, refetch }) {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  // Format date to French locale
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format time to French locale
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate how long ago the notification was created
  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440)
      return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
  };
  useEffect(() => {
    const markAllUnseenAsSeen = async () => {
      if (isOpen && notifications.length > 0) {
        const unseen = notifications.filter((n) => !n.seen);

        if (unseen.length > 0) {
          try {
            // Optimistically update UI
            unseen.forEach((notif) => dispatch(markAsSeen(notif._id)));

            // Then persist to backend in parallel
            await Promise.all(
              unseen.map((notif) =>
                updateEntity("notifications", notif._id, { seen: true })
              )
            );

            // Optional: refetch to ensure backend state matches
            await refetch();
          } catch (err) {
            console.error("Error marking notifications as seen:", err);
          }
        }
      }
    };

    markAllUnseenAsSeen();
  }, [isOpen, notifications]);

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <i className="fas fa-bell-slash text-2xl mb-2"></i>
            <p>Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={notification._id || index}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleUpdate(notification._id)}
            >
              <div className="flex space-x-3">
                {/* Status Indicator */}
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    notification.seen === false
                      ? "bg-green-500"
                      : notification.seen === true
                      ? "bg-gray-500"
                      : "bg-red-500"
                  }`}
                ></div>

                <div className="flex-1 min-w-0">
                  {/* Notification Title */}
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    {notification.type === "new_reservation" &&
                      "Nouvelle réservation"}
                    {notification.type === "cancellation" &&
                      "Réservation annulée"}
                    {notification.type === "modification" &&
                      "Réservation modifiée"}
                    {!notification.type && "Notification"}
                  </p>

                  {/* Reservation Details */}
                  <div className="space-y-2 text-xs text-gray-600">
                    {/* Client Name */}
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-gray-400 text-xs" />
                      <span className="font-medium">Client: </span>
                      <span>{notification.full_name} </span>
                    </div>

                    {/* Reservation ID */}
                    <div className="flex items-center space-x-2">
                      <FaIdCard className="text-gray-400 text-xs" />
                      <span className="font-medium">Réservation: </span>
                      <span className="font-mono bg-gray-100 px-1 rounded">
                        {notification.reservation_id}
                      </span>
                    </div>

                    {/* Departure Date & Time */}
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-gray-400 text-xs" />
                      <span className="font-medium">Départ: </span>
                      <span>{formatDate(notification.datetime_departure)}</span>
                      <FaClock className="text-gray-400 text-xs ml-1" />
                      <span>{formatTime(notification.datetime_departure)}</span>
                    </div>

                    {/* Return Date & Time */}
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-gray-400 text-xs" />
                      <span className="font-medium">Retour: </span>
                      <span>{formatDate(notification.datetime_return)}</span>
                      <FaClock className="text-gray-400 text-xs ml-1" />
                      <span>{formatTime(notification.datetime_return)}</span>
                    </div>

                    {/* Vehicle Info if available */}
                    {notification.car_info && (
                      <div className="flex items-center space-x-2 mt-1">
                        <i className="fas fa-car text-gray-400 text-xs"></i>
                        <span className="font-medium">Véhicule: </span>
                        <span>
                          {notification.car_info.model} (
                          {notification.car_info.registration})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-400 mt-2">
                    {getTimeAgo(
                      notification.createdAt || notification.timestamp
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button
          disabled={notifications.length === 0}
          className="w-full text-center text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
          onClick={async () => {
            try {
              const response = api.delete("/notifications");
              dispatch(clearNotifications());

              showToast(
                "Toutes les notifications supprimées avec success",
                "success"
              );
            } catch (error) {
              console.error(error);
              showToast(
                "Une erreur s'est produite lors de la suppression des notifications",
                "error"
              );
            }
          }}
        >
          Supprimer toutes les notifications
        </button>
      </div>
    </div>
  );
}

export default NotificationPopup;
