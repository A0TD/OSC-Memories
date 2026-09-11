import React from "react";
import { FaSearchPlus, FaTrash, FaDownload } from "react-icons/fa";
import styles from "./EventPhoto.module.css";

export default function EventPhoto({
  photos,
  onDelete,
  onPreview,
  currentUserId,
  isAdmin,
}) {
  if (!photos || photos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h5>There are no photos yet.</h5>
      </div>
    );
  }

  return (
    <div className={styles.photoGrid}>
      {photos.map((photo, index) => {
        const photoId = photo._id || photo.id || photo.mediaId;
        const canDelete = isAdmin || photo.ownerId === currentUserId;
        const downloadLink = photo.downloadUrl || photo.url;

        return (
          <div key={photoId || index} className={styles.photoCard}>
            <img
              src={photo.url}
              alt="Event photo"
              className={styles.photoImg}
            />
            <div className={styles.overlay}>
              <button
                className={styles.actionBtn}
                title="توسيع"
                onClick={() => onPreview({ type: "image", url: photo.url })}
              >
                <FaSearchPlus />
              </button>

              <a
                href={downloadLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtn}
                title="تحميل"
              >
                <FaDownload />
              </a>

              {canDelete && photoId && (
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  title="حذف"
                  onClick={() => onDelete(photoId)}
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
