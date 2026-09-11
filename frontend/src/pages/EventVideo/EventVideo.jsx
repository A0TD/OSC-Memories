import React from "react";
import { FaPlay, FaTrash } from "react-icons/fa";
import styles from "./EventVideo.module.css";

export default function EventVideo({
  videos,
  onDelete,
  onPreview,
  currentUserId,
  isAdmin,
}) {
  if (!videos || videos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h5>There is no videos yet.</h5>
      </div>
    );
  }

  return (
    <div className={styles.videoGrid}>
      {videos.map((video, index) => {
        const videoId = video._id || video.id || video.mediaId;
        const canDelete = isAdmin || video.ownerId === currentUserId;

        return (
          <div key={videoId || index} className={styles.videoCard}>
            <video src={video.url} className={styles.videoPlayer} />
            <div className={styles.overlay}>
              <button
                className={styles.actionBtn}
                title="تشغيل"
                onClick={() =>
                  onPreview({ type: "video", url: video.url })
                }
              >
                <FaPlay />
              </button>
              {canDelete && videoId && (
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  title="حذف"
                  onClick={() => onDelete(videoId)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}