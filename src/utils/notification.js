import Notification from "../models/notification.model.js";

export const createPalikaNotification = async ({
  palika_id,
  type,
  message,
  redirect_id,
}) => {
  try {
    if (!palika_id) {
      throw new Error("Palika ID is required");
    }
    if (!type) {
      throw new Error("Notification type is required");
    }
    if (!message) {
      throw new Error("Notification message is required");
    }
    if (!redirect_id) {
      throw new Error("Redirect ID is required");
    }

    console.log(palika_id);
    // Create notification to user with role "DATA_SUBMIT"
    const notification = await Notification.create({
      palika_id: palika_id,
      message,
      type,
      redirect_id: redirect_id,
    });

    return notification;
  } catch (e) {
    throw new Error(e);
  }
};
